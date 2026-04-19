'use client'

import { Search } from 'lucide-react'

const trendingTopics = [
  { name: '#NBAPlayoffs', postCount: '42.1K' },
  { name: 'Patrick Mahomes', postCount: '31.7K' },
  { name: '#MLBOpeningDay', postCount: '28.4K' },
  { name: 'Sengun MVP', postCount: '19.2K' },
  { name: '#StanleyCup', postCount: '14.8K' },
]

const suggestedUsers = [
  { name: 'NBA Central', handle: 'nbacentral', avatar: 'https://ui-avatars.com/api/?name=NBA&background=1d9bf0&color=fff&size=40' },
  { name: 'NFL Network', handle: 'nflnetwork', avatar: 'https://ui-avatars.com/api/?name=NFL&background=013369&color=fff&size=40' },
  { name: 'ESPN', handle: 'espn', avatar: 'https://ui-avatars.com/api/?name=ESPN&background=cc0000&color=fff&size=40' },
]

export function FanPulseSidebar() {
  return (
    <div className="space-y-4 pt-2 sticky top-16">
      {/* Search */}
      <div className="relative">
        <input
          placeholder="Search Fan Pulse"
          className="w-full bg-[#202327] rounded-full py-3 pl-12 pr-4 text-[15px] text-[#e7e9ea] placeholder:text-[#71767b] outline-none focus:ring-1 focus:ring-[#1d9bf0] focus:bg-black transition-colors"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#71767b]" />
      </div>

      {/* Trending */}
      <div className="bg-[#16181c] rounded-2xl overflow-hidden">
        <h2 className="text-[20px] font-bold text-[#e7e9ea] px-4 pt-3 pb-1">Trending in sports</h2>
        {trendingTopics.map((topic, i) => (
          <div
            key={i}
            className="px-4 py-3 hover:bg-white/[0.03] cursor-pointer transition-colors border-t border-[#2f3336]"
          >
            <p className="text-[13px] text-[#71767b]">Sports · Trending</p>
            <p className="text-[15px] font-bold text-[#e7e9ea]">{topic.name}</p>
            <p className="text-[13px] text-[#71767b]">{topic.postCount} posts</p>
          </div>
        ))}
        <div className="px-4 py-3 border-t border-[#2f3336]">
          <p className="text-[15px] text-[#1d9bf0] hover:underline cursor-pointer">Show more</p>
        </div>
      </div>

      {/* Who to follow */}
      <div className="bg-[#16181c] rounded-2xl overflow-hidden">
        <h2 className="text-[20px] font-bold text-[#e7e9ea] px-4 pt-3 pb-1">Who to follow</h2>
        {suggestedUsers.map((u, i) => (
          <div
            key={i}
            className="px-4 py-3 hover:bg-white/[0.03] cursor-pointer flex items-center justify-between gap-3 transition-colors border-t border-[#2f3336]"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={u.avatar}
                alt={u.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-[#e7e9ea] truncate">{u.name}</p>
                <p className="text-[13px] text-[#71767b]">@{u.handle}</p>
              </div>
            </div>
            <button className="px-4 py-1.5 bg-[#e7e9ea] text-black font-bold rounded-full text-[14px] hover:bg-white transition-colors flex-shrink-0">
              Follow
            </button>
          </div>
        ))}
        <div className="px-4 py-3 border-t border-[#2f3336]">
          <p className="text-[15px] text-[#1d9bf0] hover:underline cursor-pointer">Show more</p>
        </div>
      </div>

      <p className="text-[13px] text-[#71767b] px-1 leading-relaxed">
        Terms of Service · Privacy Policy · Cookie Policy · Accessibility
        · Ads info · More · © 2026 UNDRAFTED Corp.
      </p>
    </div>
  )
}
