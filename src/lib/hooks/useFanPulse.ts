'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import type { FanPulsePost, FanPulseReply } from '@/types'

// ── Types ──────────────────────────────────────────────────
export interface FeedPost {
  id: string
  content: string
  league_tag: string
  author_clerk_id?: string
  fire_count: number
  comment_count: number
  repost_count: number
  created_at: string
  media_urls: string[]
  user: { name: string; handle: string; avatar_url: string }
  reactions?: { fire: number; wow: number; repost: number }
}

function mapPost(row: Record<string, unknown>): FanPulsePost {
  const reactions = (row.reactions as Record<string, number>) ?? {}
  return {
    id: row.id as string,
    user_id: row.author_clerk_id as string,
    content: row.content as string,
    league_tag: (row.league_tag as string) ?? 'ALL',
    fire_count: reactions.fire ?? 0,
    comment_count: (row.reply_count as number) ?? 0,
    repost_count: reactions.repost ?? 0,
    hot_score: row.hot_score as number | undefined,
    created_at: row.created_at as string,
    updated_at: (row.updated_at ?? row.created_at) as string,
    user: {
      name: (row.author_display_name as string) || (row.author_username as string) || 'Fan',
      handle: (row.author_username as string) || 'fan',
      avatar_url: (row.author_avatar_url as string) || '',
    },
  }
}

function mapReply(row: Record<string, unknown>): FanPulseReply {
  return {
    id: row.id as string,
    post_id: row.post_id as string,
    parent_reply_id: (row.parent_reply_id as string) || null,
    user_id: row.user_id as string,
    content: row.content as string,
    fire_count: (row.fire_count as number) ?? 0,
    depth: (row.depth as number) ?? 0,
    created_at: row.created_at as string,
    updated_at: (row.updated_at ?? row.created_at) as string,
    user: {
      name: (row.author_display_name as string) || (row.author_username as string) || 'Fan',
      handle: (row.author_username as string) || 'fan',
      avatar_url: (row.author_avatar_url as string) || '',
    },
  }
}

export function useFanPulsePosts(leagueTag?: string) {
  return useQuery<FeedPost[]>({
    queryKey: ['fan-pulse-posts', leagueTag ?? 'ALL'],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (leagueTag && leagueTag !== 'ALL') {
        params.set('league', leagueTag)
      }
      const url = `/api/fan-pulse/posts${params.toString() ? '?' + params.toString() : ''}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch posts')
      return res.json()
    },
    refetchInterval: 30000,
    staleTime: 20000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export function useCreatePost() {
  const queryClient = useQueryClient()
  const { user } = useUser()

  return useMutation({
    mutationFn: async ({
      content,
      leagueTag = 'ALL',
      mediaUrls = [],
    }: {
      content: string
      leagueTag: string
      mediaUrls?: string[]
    }) => {
      const res = await fetch('/api/fan-pulse/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, leagueTag, mediaUrls }),
      })
      if (!res.ok) throw new Error(`Failed to create post: ${res.status}`)
      return res.json() as Promise<FeedPost>
    },
    onMutate: async ({ content, leagueTag = 'ALL', mediaUrls = [] }) => {
      await queryClient.cancelQueries({ queryKey: ['fan-pulse-posts'] })
      const previousAll = queryClient.getQueryData<FeedPost[]>(['fan-pulse-posts', 'ALL'])
      const previousLeague = queryClient.getQueryData<FeedPost[]>(['fan-pulse-posts', leagueTag])

      const optimistic: FeedPost = {
        id: 'temp-' + Date.now(),
        content,
        league_tag: leagueTag,
        fire_count: 0,
        comment_count: 0,
        repost_count: 0,
        media_urls: mediaUrls,
        created_at: new Date().toISOString(),
        user: {
          name: user?.fullName || 'You',
          handle: user?.username || 'you',
          avatar_url: user?.imageUrl || '',
        },
      }

      queryClient.setQueryData<FeedPost[]>(['fan-pulse-posts', 'ALL'], (old) => [optimistic, ...(old ?? [])])
      if (leagueTag !== 'ALL') {
        queryClient.setQueryData<FeedPost[]>(['fan-pulse-posts', leagueTag], (old) => [optimistic, ...(old ?? [])])
      }
      return { previousAll, previousLeague, leagueTag }
    },
    onSuccess: (data, variables) => {
      // Replace the temp optimistic entry with the real DB row
      const replace = (old: FeedPost[] | undefined) => {
        if (!old) return [data]
        return old.map(p => p.id?.startsWith('temp-') ? data : p)
      }
      queryClient.setQueryData<FeedPost[]>(['fan-pulse-posts', 'ALL'], replace)
      if (variables.leagueTag !== 'ALL') {
        queryClient.setQueryData<FeedPost[]>(['fan-pulse-posts', variables.leagueTag], replace)
      }
    },
    onError: (_err, _vars, context) => {
      if (context?.previousAll !== undefined) {
        queryClient.setQueryData(['fan-pulse-posts', 'ALL'], context.previousAll)
      }
      if (context?.previousLeague !== undefined && context?.leagueTag) {
        queryClient.setQueryData(['fan-pulse-posts', context.leagueTag], context.previousLeague)
      }
    },
    onSettled: (_data, _err, variables) => {
      // Delay refetch so Supabase row is fully committed before we read it back
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['fan-pulse-posts', 'ALL'] })
        if (variables?.leagueTag && variables.leagueTag !== 'ALL') {
          queryClient.invalidateQueries({ queryKey: ['fan-pulse-posts', variables.leagueTag] })
        }
      }, 1500)
    },
  })
}

export function useReplies(postId: string) {
  return useQuery({
    queryKey: ['fan-pulse-replies', postId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fan_pulse_replies')
        .select('*')
        .eq('post_id', postId)
        .eq('depth', 0)
        .order('created_at', { ascending: true })
        .limit(20)

      if (error) throw error

      const repliesWithChildren = await Promise.all(
        (data as Record<string, unknown>[]).map(async (row) => {
          const reply = mapReply(row)
          const { data: childRows } = await supabase
            .from('fan_pulse_replies')
            .select('*')
            .eq('parent_reply_id', reply.id)
            .order('created_at', { ascending: true })
            .limit(3)
          return {
            ...reply,
            children: (childRows as Record<string, unknown>[] | null)?.map(mapReply) ?? [],
          }
        })
      )
      return repliesWithChildren
    },
    enabled: !!postId,
  })
}

export function useFirePost() {
  const queryClient = useQueryClient()
  const { user } = useUser()

  return useMutation({
    mutationFn: async (postId: string) => {
      await fetch('/api/fan-pulse/fire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user?.id }),
      })
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['fan-pulse-posts'] })
      const snapshots = queryClient.getQueriesData<FanPulsePost[]>({ queryKey: ['fan-pulse-posts'] })
      queryClient.setQueriesData<FanPulsePost[]>(
        { queryKey: ['fan-pulse-posts'] },
        (old) => old?.map((p) => p.id === postId ? { ...p, fire_count: p.fire_count + 1 } : p)
      )
      return { snapshots }
    },
    onError: (_err, _postId, context) => {
      context?.snapshots.forEach(([key, val]) => queryClient.setQueryData(key, val))
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['fan-pulse-posts'] })
    },
  })
}

export function useCreateReply() {
  const queryClient = useQueryClient()
  const { user } = useUser()

  return useMutation({
    mutationFn: async ({
      postId,
      content,
      parentReplyId,
      depth,
    }: {
      postId: string
      content: string
      parentReplyId?: string
      depth: number
    }) => {
      const res = await fetch('/api/fan-pulse/replies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content,
          parentReplyId: parentReplyId || null,
          depth,
          userId: user?.id,
        }),
      })
      if (!res.ok) throw new Error('Failed to post reply')
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['fan-pulse-replies', variables.postId] })
      queryClient.invalidateQueries({ queryKey: ['fan-pulse-posts'] })
    },
  })
}
