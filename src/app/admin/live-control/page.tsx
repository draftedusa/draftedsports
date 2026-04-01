"use client";

import { useState } from "react";
import { games } from "@/data/games";
import { teams } from "@/data/teams";
import { highlights } from "@/data/highlights";
import { polls as mockPolls } from "@/data/polls";
import Panel from "@/components/ui/Panel";
import Badge from "@/components/ui/Badge";

// The live game being controlled (Rockets vs Lakers)
const CONTROL_GAME_ID = "game-001";

type ToastMsg = { id: number; text: string };

export default function LiveControlPage() {
  const game = games.find((g) => g.id === CONTROL_GAME_ID)!;
  const homeTeam = teams.find((t) => t.id === game.homeTeamId)!;
  const awayTeam = teams.find((t) => t.id === game.awayTeamId)!;

  // ── System toggles ────────────────────────────────────────────
  const [isCovering, setIsCovering] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isEmergency, setIsEmergency] = useState(false);

  // ── Event timeline ────────────────────────────────────────────
  const [dismissedEvents, setDismissedEvents] = useState<Set<string>>(new Set());
  const [triggeredEvents, setTriggeredEvents] = useState<Set<string>>(new Set());

  // ── Moment trigger engine ─────────────────────────────────────
  const [momentInput, setMomentInput] = useState("");
  const [momentPreview, setMomentPreview] = useState<{ text: string; actions: string[]; confidence: number } | null>(null);
  const [executedMoments, setExecutedMoments] = useState<string[]>([]);
  const [editActionsOpen, setEditActionsOpen] = useState(false);
  const [enabledActions, setEnabledActions] = useState({
    highlight: true,
    article: true,
    thread: true,
    stats: true,
    push: true,
  });

  function handleMomentSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!momentInput.trim()) return;
    setMomentPreview({
      text: momentInput.trim(),
      actions: Object.entries(enabledActions).filter(([, v]) => v).map(([k]) => k),
      confidence: Math.floor(Math.random() * 8) + 92, // 92–99%
    });
  }

  function executeMoment() {
    if (!momentPreview) return;
    setExecutedMoments((prev) => [momentPreview.text, ...prev]);
    addToast(`✅ Moment executed: "${momentPreview.text}"`);
    setMomentPreview(null);
    setMomentInput("");
  }

  // ── Highlight queue ───────────────────────────────────────────
  const pendingHighlights = highlights.filter((h) => h.gameId === CONTROL_GAME_ID && h.status === "pending");
  const [insertedHighlights, setInsertedHighlights] = useState<Set<string>>(new Set());
  const [discardedHighlights, setDiscardedHighlights] = useState<Set<string>>(new Set());

  // ── Thread controls ───────────────────────────────────────────
  const [threadCreated, setThreadCreated] = useState(true);
  const [chatEnabled, setChatEnabled] = useState(true);
  const [scorePinned, setScorePinned] = useState(true);
  const [slowMode, setSlowMode] = useState("15");

  // ── Poll injection ────────────────────────────────────────────
  const [pollQuestion, setPollQuestion] = useState("Are the Rockets contenders?");
  const [pollOptions, setPollOptions] = useState(["Yes", "Playoff team", "Pretenders"]);
  const [submittedPolls, setSubmittedPolls] = useState<string[]>([]);

  // ── Alert builder ─────────────────────────────────────────────
  const [alertHeadline, setAlertHeadline] = useState("Sengun is DOMINATING the paint");
  const [alertDests, setAlertDests] = useState({ mobile: true, web: true, thread: false });
  const [alertPriority, setAlertPriority] = useState("high");
  const [sentAlerts, setSentAlerts] = useState<string[]>([]);

  // ── Toast notifications ───────────────────────────────────────
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  function addToast(text: string) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }

  return (
    <div className="bg-gray-950 min-h-screen pb-16 relative">
      {/* Toast container */}
      <div className="fixed top-16 right-4 z-50 space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className="bg-gray-800 border border-gray-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
            {t.text}
          </div>
        ))}
      </div>

      {/* ── 1. Game Header Strip ─────────────────────────────────── */}
      <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          {/* Score */}
          <div className="flex items-center gap-2">
            <Badge variant="live">Live</Badge>
            <span className="text-white font-bold text-sm">
              {awayTeam.name} vs {homeTeam.name} — {game.awayScore}–{game.homeScore} | {game.quarter} {game.timeRemaining}
            </span>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-3 text-xs">
            <StatusDot label="Feed" active />
            <StatusDot label="Thread" active />
            <StatusDot label="Alerts" active={!isPaused} />
            <StatusDot label="Sync" active={!isEmergency} />
          </div>

          {/* Controls */}
          <div className="ml-auto flex items-center gap-2 flex-wrap">
            <ToggleBtn active={isCovering} onClick={() => { setIsCovering(!isCovering); addToast(isCovering ? "⏹ Coverage stopped" : "▶️ Coverage started"); }}>
              {isCovering ? "⏹ Stop Coverage" : "▶️ Start Coverage"}
            </ToggleBtn>
            <ToggleBtn active={!isPaused} onClick={() => { setIsPaused(!isPaused); addToast(isPaused ? "▶️ Automation resumed" : "⏸ Automation paused"); }}>
              {isPaused ? "▶️ Resume Auto" : "⏸ Pause Auto"}
            </ToggleBtn>
            <ToggleBtn
              active={isEmergency}
              danger
              onClick={() => { setIsEmergency(!isEmergency); addToast(isEmergency ? "✅ Emergency mode OFF" : "⚠️ EMERGENCY MODE ON"); }}
            >
              ⚠️ Emergency
            </ToggleBtn>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* ── 2. Left: Event Timeline ──────────────────────────── */}
        <div className="space-y-4">
          <Panel title="Live Event Timeline" accent="border-red-600"
            titleRight={<span className="text-gray-500">{game.events.length} events</span>}>
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {[...game.events].reverse().map((evt) => {
                const dismissed = dismissedEvents.has(evt.id);
                const triggered = triggeredEvents.has(evt.id);
                if (dismissed) return null;
                return (
                  <div key={evt.id} className={`border rounded-lg p-3 transition-colors ${triggered ? "border-green-800 bg-green-950/30" : "border-gray-800 bg-gray-900"}`}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <span className="text-xs text-gray-500 font-mono">[{evt.time}]</span>
                        {evt.isHighlight && <span className="ml-1 text-xs text-orange-400">🔥 Highlight</span>}
                        <p className={`text-sm mt-0.5 ${evt.isHighlight ? "text-white font-semibold" : "text-gray-300"}`}>
                          {evt.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <EventBtn onClick={() => { setTriggeredEvents((s) => new Set([...s, evt.id])); addToast(`🎬 Highlight triggered: ${evt.time}`); }}>
                        Trigger Highlight
                      </EventBtn>
                      <EventBtn onClick={() => addToast(`🧵 Thread created for event ${evt.time}`)}>
                        Create Thread
                      </EventBtn>
                      <EventBtn onClick={() => addToast(`📄 Attached to article`)}>
                        Attach Article
                      </EventBtn>
                      <EventBtn onClick={() => addToast(`🔔 Alert sent`)}>
                        Send Alert
                      </EventBtn>
                      <EventBtn
                        danger
                        onClick={() => setDismissedEvents((s) => new Set([...s, evt.id]))}
                      >
                        Ignore
                      </EventBtn>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* ── 8. System State (bottom of left col) ─────────── */}
          <Panel title="System State" accent="border-gray-600">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <SystemState label="Score Feed" value="Healthy" ok />
              <SystemState label="Thread Sync" value={isPaused ? "Paused" : "Active"} ok={!isPaused} />
              <SystemState label="Highlight Queue" value={`${pendingHighlights.length - discardedHighlights.size} pending`} ok />
              <SystemState label="Push Alerts" value={isEmergency ? "EMERGENCY" : "Armed"} ok={!isEmergency} />
            </div>
          </Panel>
        </div>

        {/* ── Center Column ─────────────────────────────────────── */}
        <div className="space-y-4">
          {/* ── 3. Moment Trigger Engine ─────────────────────── */}
          <Panel title="Moment Trigger Engine" accent="border-yellow-500">
            <form onSubmit={handleMomentSubmit} className="flex gap-2 mb-4">
              <input
                value={momentInput}
                onChange={(e) => setMomentInput(e.target.value)}
                placeholder="e.g. Sengun poster dunk"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-black text-sm font-bold rounded transition-colors"
              >
                Analyze
              </button>
            </form>

            {momentPreview && (
              <div className="bg-gray-800 rounded-lg p-4 mb-3 border border-yellow-800">
                <p className="text-sm font-bold text-yellow-400 mb-1">Moment: "{momentPreview.text}"</p>
                <p className="text-xs text-gray-400 mb-3">Confidence: <span className="text-green-400 font-bold">{momentPreview.confidence}%</span></p>
                <p className="text-xs font-semibold text-gray-300 mb-2 uppercase tracking-wide">Auto Actions:</p>
                <ul className="space-y-1 mb-4">
                  {Object.entries(enabledActions).map(([key, enabled]) => {
                    const labels: Record<string, string> = {
                      highlight: "Create highlight post",
                      article: "Insert into article",
                      thread: "Notify thread",
                      stats: "Update stats",
                      push: "Queue push alert",
                    };
                    return (
                      <li key={key} className={`flex items-center gap-2 text-xs ${enabled ? "text-gray-200" : "text-gray-600 line-through"}`}>
                        <span>{enabled ? "✅" : "❌"}</span> {labels[key]}
                      </li>
                    );
                  })}
                </ul>
                <div className="flex gap-2">
                  <button
                    onClick={executeMoment}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-bold rounded transition-colors"
                  >
                    Execute
                  </button>
                  <button
                    onClick={() => setEditActionsOpen(true)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-semibold rounded transition-colors"
                  >
                    Edit Actions
                  </button>
                  <button
                    onClick={() => setMomentPreview(null)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 text-sm rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Edit Actions Modal */}
            {editActionsOpen && (
              <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-80 space-y-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Edit Auto Actions</h3>
                  {Object.entries(enabledActions).map(([key, val]) => {
                    const labels: Record<string, string> = {
                      highlight: "Create highlight post",
                      article: "Insert into article",
                      thread: "Notify thread",
                      stats: "Update stats",
                      push: "Queue push alert",
                    };
                    return (
                      <label key={key} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={val}
                          onChange={(e) => setEnabledActions((prev) => ({ ...prev, [key]: e.target.checked }))}
                          className="w-4 h-4 accent-yellow-500"
                        />
                        <span className="text-sm text-gray-200">{labels[key]}</span>
                      </label>
                    );
                  })}
                  <button
                    onClick={() => setEditActionsOpen(false)}
                    className="w-full py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold text-sm rounded transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Executed moments log */}
            {executedMoments.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Executed</p>
                {executedMoments.map((m, i) => (
                  <p key={i} className="text-xs text-green-400">✅ {m}</p>
                ))}
              </div>
            )}
          </Panel>

          {/* ── 6. Poll Injection ─────────────────────────────── */}
          <Panel title="Poll Injection System" accent="border-blue-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Question</label>
                <input
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-600"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Options</label>
                {pollOptions.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => {
                      const copy = [...pollOptions];
                      copy[i] = e.target.value;
                      setPollOptions(copy);
                    }}
                    className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm text-white mb-1 focus:outline-none focus:border-blue-600"
                  />
                ))}
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Attach to Thread", dest: "thread" },
                  { label: "Attach to Article", dest: "article" },
                  { label: "Push Notification", dest: "push" },
                ].map(({ label, dest }) => (
                  <button
                    key={dest}
                    onClick={() => {
                      setSubmittedPolls((prev) => [...prev, `${pollQuestion} → ${dest}`]);
                      addToast(`📊 Poll attached to ${dest}`);
                    }}
                    className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white text-xs font-semibold rounded transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
              {submittedPolls.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {submittedPolls.map((p, i) => (
                    <p key={i} className="text-xs text-blue-400">✅ {p}</p>
                  ))}
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* ── Right Column ──────────────────────────────────────── */}
        <div className="space-y-4">
          {/* ── 4. Highlight Queue ───────────────────────────── */}
          <Panel
            title="Highlight Queue"
            accent="border-orange-600"
            titleRight={<span className="text-gray-500">{pendingHighlights.length - discardedHighlights.size} pending</span>}
          >
            <div className="space-y-3">
              {pendingHighlights.map((hl) => {
                if (discardedHighlights.has(hl.id)) return null;
                const inserted = insertedHighlights.has(hl.id);
                return (
                  <div key={hl.id} className={`border rounded-lg p-3 ${inserted ? "border-green-800 opacity-60" : "border-gray-700"}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-14 h-10 bg-gray-800 rounded flex items-center justify-center text-xl shrink-0">🎬</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{hl.title}</p>
                        <p className="text-xs text-gray-500">{hl.source} · {hl.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <SmBtn onClick={() => addToast(`▶️ Preview: ${hl.title}`)}>Preview</SmBtn>
                      <SmBtn
                        green
                        onClick={() => { setInsertedHighlights((s) => new Set([...s, hl.id])); addToast(`✅ Inserted: ${hl.title}`); }}
                      >
                        {inserted ? "Inserted ✓" : "Insert"}
                      </SmBtn>
                      <SmBtn
                        danger
                        onClick={() => setDiscardedHighlights((s) => new Set([...s, hl.id]))}
                      >
                        Discard
                      </SmBtn>
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>

          {/* ── 5. Thread & Community Controls ──────────────── */}
          <Panel title="Thread & Community" accent="border-purple-600">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Status</span>
                <span className="text-xs font-bold text-green-400">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">Slow Mode</span>
                <select
                  value={slowMode}
                  onChange={(e) => { setSlowMode(e.target.value); addToast(`⏱ Slow mode: ${e.target.value}s`); }}
                  className="bg-gray-800 border border-gray-700 text-white text-xs rounded px-2 py-1"
                >
                  <option value="0">Off</option>
                  <option value="5">5s</option>
                  <option value="15">15s</option>
                  <option value="30">30s</option>
                  <option value="60">60s</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-1.5 mt-1">
                {[
                  { label: threadCreated ? "Thread Active ✓" : "Create Thread", action: () => { setThreadCreated(true); addToast("🧵 Game thread created"); } },
                  { label: scorePinned ? "Score Pinned ✓" : "Pin Scoreboard", action: () => { setScorePinned(true); addToast("📌 Scoreboard pinned"); } },
                  { label: chatEnabled ? "Chat On ✓" : "Enable Chat", action: () => { setChatEnabled(!chatEnabled); addToast(chatEnabled ? "🔇 Chat disabled" : "💬 Chat enabled"); } },
                  { label: "Highlight Top Reply", action: () => addToast("⭐ Top reply highlighted") },
                  { label: "Add Poll", action: () => addToast("📊 Poll added to thread") },
                ].map(({ label, action }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="px-2 py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs font-medium rounded transition-colors text-center"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </Panel>

          {/* ── 7. Alert & Push System ───────────────────────── */}
          <Panel title="Alert & Push System" accent="border-red-600">
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Headline</label>
                <input
                  value={alertHeadline}
                  onChange={(e) => setAlertHeadline(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Destinations</p>
                <div className="flex gap-3">
                  {(Object.keys(alertDests) as Array<keyof typeof alertDests>).map((dest) => (
                    <label key={dest} className="flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={alertDests[dest]}
                        onChange={(e) => setAlertDests((prev) => ({ ...prev, [dest]: e.target.checked }))}
                        className="accent-red-500"
                      />
                      <span className="text-xs text-gray-300 capitalize">{dest}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Priority</label>
                  <select
                    value={alertPriority}
                    onChange={(e) => setAlertPriority(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-white text-sm rounded px-2 py-1.5"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="breaking">Breaking</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    const dests = Object.entries(alertDests).filter(([, v]) => v).map(([k]) => k).join(", ");
                    setSentAlerts((prev) => [`[${alertPriority.toUpperCase()}] ${alertHeadline} → ${dests}`, ...prev]);
                    addToast(`🔔 Alert sent: "${alertHeadline}"`);
                    console.log("MOCK ALERT SENT:", { headline: alertHeadline, dests, priority: alertPriority });
                  }}
                  className="self-end px-4 py-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded transition-colors"
                >
                  Send Now
                </button>
              </div>
              {sentAlerts.length > 0 && (
                <div className="mt-1 max-h-24 overflow-y-auto space-y-0.5">
                  {sentAlerts.map((a, i) => (
                    <p key={i} className="text-xs text-red-400 truncate">✅ {a}</p>
                  ))}
                </div>
              )}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

// ── Small helper components ─────────────────────────────────────

function StatusDot({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-400" : "bg-red-500"}`} />
      <span className={`text-xs ${active ? "text-gray-400" : "text-red-400"}`}>{label}</span>
    </div>
  );
}

function ToggleBtn({ children, active, danger, onClick }: { children: React.ReactNode; active: boolean; danger?: boolean; onClick: () => void }) {
  const base = "px-3 py-1.5 text-xs font-semibold rounded border transition-colors";
  const style = danger
    ? active
      ? "bg-red-700 border-red-500 text-white"
      : "bg-transparent border-red-800 text-red-400 hover:border-red-600"
    : active
    ? "bg-gray-700 border-gray-500 text-white"
    : "bg-transparent border-gray-700 text-gray-400 hover:border-gray-500";
  return <button className={`${base} ${style}`} onClick={onClick}>{children}</button>;
}

function EventBtn({ children, danger, onClick }: { children: React.ReactNode; danger?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
        danger
          ? "bg-red-950 text-red-400 hover:bg-red-900 border border-red-900"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
      }`}
    >
      {children}
    </button>
  );
}

function SmBtn({ children, green, danger, onClick }: { children: React.ReactNode; green?: boolean; danger?: boolean; onClick: () => void }) {
  const style = green
    ? "bg-green-900 text-green-400 hover:bg-green-800 border border-green-800"
    : danger
    ? "bg-red-950 text-red-400 hover:bg-red-900 border border-red-900"
    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700";
  return (
    <button onClick={onClick} className={`px-2 py-1 text-xs font-medium rounded transition-colors ${style}`}>
      {children}
    </button>
  );
}

function SystemState({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="bg-gray-800 rounded p-2">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-xs font-bold mt-0.5 ${ok ? "text-green-400" : "text-red-400"}`}>{value}</p>
    </div>
  );
}
