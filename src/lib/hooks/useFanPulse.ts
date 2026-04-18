'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useUser } from '@clerk/nextjs'
import type { FanPulsePost, FanPulseReply } from '@/types'

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
  return useQuery({
    queryKey: ['fan-pulse-posts', leagueTag],
    queryFn: async () => {
      let query = supabase
        .from('fan_pulse_posts_ranked')
        .select('*')
        .limit(50)

      if (leagueTag && leagueTag !== 'ALL') {
        query = query.eq('league_tag', leagueTag)
      }

      const { data, error } = await query
      if (error) throw error
      return (data as Record<string, unknown>[]).map(mapPost)
    },
    refetchInterval: 30000,
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
