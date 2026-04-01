import { Poll } from "@/types";

export const polls: Poll[] = [
  {
    id: "poll-001",
    question: "Are the Rockets legitimate contenders this season?",
    options: [
      { id: "opt-001-1", text: "Yes, championship level", votes: 4821 },
      { id: "opt-001-2", text: "Playoff team, not title", votes: 3102 },
      { id: "opt-001-3", text: "Still too early to say", votes: 1204 },
    ],
    threadId: "thread-001",
    votes: 9127,
  },
  {
    id: "poll-002",
    question: "Who wins Chiefs vs Eagles tonight?",
    options: [
      { id: "opt-002-1", text: "Chiefs", votes: 5543 },
      { id: "opt-002-2", text: "Eagles", votes: 4211 },
      { id: "opt-002-3", text: "Goes to OT", votes: 1832 },
    ],
    threadId: "thread-002",
    votes: 11586,
  },
  {
    id: "poll-003",
    question: "Is Sengun better than Jokic at the same age?",
    options: [
      { id: "opt-003-1", text: "Yes — Sengun is more dynamic", votes: 2901 },
      { id: "opt-003-2", text: "No — Jokic at 22 was on another level", votes: 3445 },
      { id: "opt-003-3", text: "Too close to call", votes: 1672 },
    ],
    articleId: "art-003",
    votes: 8018,
  },
  {
    id: "poll-004",
    question: "Will LeBron re-sign with the Lakers?",
    options: [
      { id: "opt-004-1", text: "Yes, one more year", votes: 4112 },
      { id: "opt-004-2", text: "No — he goes to Cleveland", votes: 1987 },
      { id: "opt-004-3", text: "Retires after this season", votes: 892 },
    ],
    articleId: "art-004",
    votes: 6991,
  },
  {
    id: "poll-005",
    question: "Hart Trophy 2026: Who wins MVP?",
    options: [
      { id: "opt-005-1", text: "MacKinnon", votes: 6234 },
      { id: "opt-005-2", text: "Pastrnak", votes: 5102 },
      { id: "opt-005-3", text: "Someone else", votes: 788 },
    ],
    articleId: "art-010",
    votes: 12124,
  },
];
