'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { formatDistanceToNow } from 'date-fns'
import { useReplies, useCreateReply } from '@/lib/hooks/useFanPulse'
import type { FanPulseReply } from '@/types'

interface ReplyThreadProps {
  postId: string
  isOpen: boolean
}

export function ReplyThread({ postId, isOpen }: ReplyThreadProps) {
  const { data: replies, isLoading } = useReplies(postId)
  const [showAll, setShowAll] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const createReply = useCreateReply()
  const { user } = useUser()

  if (!isOpen) return null

  const visibleReplies = showAll ? replies : replies?.slice(0, 3)

  const handleSubmitReply = async (parentReplyId?: string, depth = 0) => {
    if (!replyContent.trim() || !user) return
    await createReply.mutateAsync({ postId, content: replyContent, parentReplyId, depth })
    setReplyContent('')
    setReplyingTo(null)
  }

  return (
    <div className="border-t border-surface-300/40 mt-2 pt-3">
      {user && (
        <div className="flex gap-2 mb-4">
          <img
            src={user.imageUrl}
            alt=""
            className="w-7 h-7 rounded-full object-cover flex-shrink-0 mt-0.5"
          />
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply()}
              placeholder="Add a reply..."
              maxLength={500}
              className="flex-1 bg-transparent border border-[#2f3336] rounded-full px-4 py-2 text-[14px] text-[#e7e9ea] dark:text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none focus:border-[#1d9bf0] transition-colors"
            />
            <button
              onClick={() => handleSubmitReply()}
              disabled={!replyContent.trim() || createReply.isPending}
              className="px-4 py-2 bg-[#007CB0] text-white text-[14px] font-bold rounded-full disabled:opacity-40 hover:bg-[#007CB0]/90 transition-colors"
            >
              Reply
            </button>
          </div>
        </div>
      )}

      {isLoading && (
        <p className="text-xs text-surface-muted py-2">Loading replies…</p>
      )}

      {visibleReplies?.map((reply) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          postId={postId}
          onReplyTo={(id) => setReplyingTo(id)}
          replyingToId={replyingTo}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          onSubmitNested={(parentId) => handleSubmitReply(parentId, 1)}
          isPending={createReply.isPending}
        />
      ))}

      {replies && replies.length > 3 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="text-xs text-brand hover:underline mt-1"
        >
          Show {replies.length - 3} more {replies.length - 3 === 1 ? 'reply' : 'replies'}
        </button>
      )}

      {!isLoading && replies?.length === 0 && (
        <p className="text-xs text-surface-muted py-2">No replies yet. Be first.</p>
      )}
    </div>
  )
}

function ReplyItem({
  reply,
  postId,
  onReplyTo,
  replyingToId,
  replyContent,
  setReplyContent,
  onSubmitNested,
  isPending,
}: {
  reply: FanPulseReply
  postId: string
  onReplyTo: (id: string) => void
  replyingToId: string | null
  replyContent: string
  setReplyContent: (v: string) => void
  onSubmitNested: (parentId: string) => void
  isPending: boolean
}) {
  const { user } = useUser()
  let timeAgo = ''
  try {
    timeAgo = formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })
  } catch {
    timeAgo = 'just now'
  }

  return (
    <div className={`mb-3 ${reply.depth === 1 ? 'ml-8 border-l-2 border-surface-300/50 pl-3' : ''}`}>
      <div className="flex gap-2">
        {reply.user?.avatar_url ? (
          <img
            src={reply.user.avatar_url}
            alt=""
            className="w-6 h-6 rounded-full object-cover flex-shrink-0 mt-0.5"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
            {reply.user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xs font-bold text-surface-text">
              {reply.user?.name || 'Fan'}
            </span>
            <span className="text-[10px] text-surface-muted">@{reply.user?.handle}</span>
            <span className="text-[10px] text-surface-muted">{timeAgo}</span>
          </div>
          <p className="text-xs text-surface-text/90 mt-0.5 leading-relaxed">{reply.content}</p>
          <div className="flex items-center gap-3 mt-1">
            <button className="text-[10px] text-surface-muted hover:text-orange-400 flex items-center gap-1 transition-colors">
              🔥 {reply.fire_count}
            </button>
            {reply.depth === 0 && user && (
              <button
                onClick={() => onReplyTo(reply.id)}
                className="text-[10px] text-surface-muted hover:text-brand transition-colors"
              >
                Reply
              </button>
            )}
          </div>

          {replyingToId === reply.id && user && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSubmitNested(reply.id)}
                placeholder={`Replying to @${reply.user?.handle}…`}
                maxLength={500}
                autoFocus
                className="flex-1 bg-transparent border border-[#2f3336] rounded-full px-3 py-1.5 text-[13px] text-[#e7e9ea] placeholder:text-[#71767b] focus:outline-none focus:border-[#1d9bf0] transition-colors"
              />
              <button
                onClick={() => onSubmitNested(reply.id)}
                disabled={!replyContent.trim() || isPending}
                className="px-3 py-1.5 bg-[#007CB0] text-white text-[13px] font-bold rounded-full disabled:opacity-40 hover:bg-[#007CB0]/90 transition-colors"
              >
                Reply
              </button>
            </div>
          )}
        </div>
      </div>

      {reply.children?.map((child) => (
        <ReplyItem
          key={child.id}
          reply={child}
          postId={postId}
          onReplyTo={() => {}}
          replyingToId={null}
          replyContent=""
          setReplyContent={() => {}}
          onSubmitNested={() => {}}
          isPending={false}
        />
      ))}
    </div>
  )
}
