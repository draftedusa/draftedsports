'use client'

import { useState, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { ImageIcon, X } from 'lucide-react'
import { uploadMediaFiles } from '@/lib/uploadMedia'

interface PostPreview {
  id: string
  content: string
  authorName: string
  authorHandle: string
  authorAvatar: string
}

interface ReplyModalProps {
  post: PostPreview
  onClose: () => void
  onSubmit: (content: string, mediaUrls?: string[]) => Promise<void>
}

export function ReplyModal({ post, onClose, onSubmit }: ReplyModalProps) {
  const { user } = useUser()
  const [content, setContent] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviewUrls, setMediaPreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleMediaSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    const next = [...mediaFiles, ...files].slice(0, 4)
    setMediaFiles(next)
    setMediaPreviewUrls(next.map(f => URL.createObjectURL(f)))
    e.target.value = ''
  }

  function removeMedia(index: number) {
    URL.revokeObjectURL(mediaPreviewUrls[index])
    const nextFiles = mediaFiles.filter((_, i) => i !== index)
    setMediaFiles(nextFiles)
    setMediaPreviewUrls(nextFiles.map(f => URL.createObjectURL(f)))
  }

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return
    setIsSubmitting(true)
    try {
      let uploadedUrls: string[] = []
      if (mediaFiles.length > 0) {
        uploadedUrls = await uploadMediaFiles(mediaFiles)
      }
      await onSubmit(content, uploadedUrls)
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center pt-8 sm:pt-14"
      style={{ background: 'rgba(91,112,131,0.4)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#000000] w-full max-w-[600px] rounded-2xl overflow-hidden shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center px-4 py-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#e7e9ea]">
              <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
            </svg>
          </button>
        </div>

        {/* Parent post preview (read-only) */}
        <div className="flex gap-3 px-4 pb-2 opacity-70">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-[#333639] overflow-hidden flex-shrink-0">
              {post.authorAvatar.startsWith('http') ? (
                <img src={post.authorAvatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">
                  {post.authorAvatar}
                </div>
              )}
            </div>
            <div className="w-0.5 bg-[#2f3336] flex-1 mt-2 min-h-[20px]" />
          </div>
          <div className="pb-3 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[15px] font-bold text-[#e7e9ea]">
                {post.authorName}
              </span>
              <span className="text-[15px] text-[#71767b]">
                @{post.authorHandle}
              </span>
            </div>
            <p className="text-[15px] text-[#e7e9ea] mt-1">{post.content}</p>
            <p className="text-[15px] text-[#71767b] mt-2">
              Replying to{' '}
              <span className="text-[#1d9bf0]">@{post.authorHandle}</span>
            </p>
          </div>
        </div>

        {/* Reply composer */}
        <div className="flex gap-3 px-4 pb-4">
          {user?.imageUrl ? (
            <img
              src={user.imageUrl}
              alt=""
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#333639] flex items-center justify-center text-[#71767b] flex-shrink-0">
              ?
            </div>
          )}

          <div className="flex-1 min-w-0">
            <textarea
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
              }}
              placeholder="Post your reply"
              maxLength={500}
              rows={3}
              className="w-full bg-transparent text-[20px] text-[#e7e9ea] placeholder:text-[#71767b] resize-none outline-none leading-7 min-h-[80px]"
            />

            {/* Media preview grid */}
            {mediaPreviewUrls.length > 0 && (
              <div className={`grid gap-1 mt-2 rounded-2xl overflow-hidden ${mediaPreviewUrls.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                {mediaPreviewUrls.map((url, i) => (
                  <div key={i} className="relative aspect-video bg-[#1c1c1c]">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeMedia(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center hover:bg-black transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#2f3336]">
              <div className="flex items-center gap-1 text-[#1d9bf0]">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleMediaSelect}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={mediaFiles.length >= 4}
                  className="p-2 hover:bg-[#1d9bf0]/10 rounded-full transition-colors disabled:opacity-40"
                >
                  <ImageIcon className="w-[18px] h-[18px]" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {content.length > 460 && (
                  <span className={`text-[13px] ${content.length > 490 ? 'text-red-500' : 'text-[#71767b]'}`}>
                    {500 - content.length}
                  </span>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="px-5 py-2 bg-[#007CB0] text-white text-[15px] font-bold rounded-full disabled:opacity-50 hover:bg-[#006a99] transition-colors"
                >
                  {isSubmitting ? 'Posting…' : 'Reply'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
