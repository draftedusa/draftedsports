import type { ReactNode } from 'react'

export const ReplyIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none">
    <path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01z" fill="currentColor" />
  </svg>
)

export const FireIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
    <path d="M12 23a7.5 7.5 0 0 1-5.138-12.963C8.204 8.774 11.5 6.5 11 1.5c6 4 9 8 3 14 1 0 2.5 0 3-1.5.5 1 .5 2 .5 3A7.5 7.5 0 0 1 12 23z" />
  </svg>
)

export const RepostIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none">
    <path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z" fill="currentColor" />
  </svg>
)

export const ViewsIcon = () => (
  <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="currentColor">
    <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
  </svg>
)

interface ActionBtnProps {
  icon: ReactNode
  count: number
  hoverColor: 'blue' | 'orange' | 'green' | 'gray'
  active?: boolean
  activeColor?: string
  onClick?: () => void
}

const HOVER_CLASSES = {
  blue:   'hover:text-[#1d9bf0] [&>span:first-child]:hover:bg-[#1d9bf0]/10',
  orange: 'hover:text-orange-500 [&>span:first-child]:hover:bg-orange-500/10',
  green:  'hover:text-emerald-400 [&>span:first-child]:hover:bg-emerald-400/10',
  gray:   'hover:text-[#71767b] [&>span:first-child]:hover:bg-[#71767b]/10',
}

export function ActionBtn({ icon, count, hoverColor, active, activeColor, onClick }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-center gap-0.5 transition-colors ${
        active ? activeColor ?? 'text-[#1d9bf0]' : 'text-[#71767b]'
      } ${HOVER_CLASSES[hoverColor]}`}
    >
      <span className="p-2 rounded-full transition-colors">
        {icon}
      </span>
      {count > 0 && (
        <span className="text-[13px] tabular-nums">{count}</span>
      )}
    </button>
  )
}
