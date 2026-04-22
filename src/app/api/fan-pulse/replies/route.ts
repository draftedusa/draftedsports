import { auth } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const content: string = (body.content ?? '').trim()
  if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const { postId, parentReplyId, depth, mediaUrls = [] } = body
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  let authorUsername = `user_${userId.slice(-6)}`
  let authorDisplayName: string | null = null
  let authorAvatarUrl: string | null = null

  try {
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    authorUsername = clerkUser.username || `user_${userId.slice(-6)}`
    authorDisplayName =
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      clerkUser.username ||
      null
    authorAvatarUrl = clerkUser.imageUrl || null
  } catch (err) {
    console.error('[fan-pulse/replies POST] Clerk fetch failed:', err)
  }

  const supabase = getSupabase()

  const { data, error } = await supabase
    .from('fan_pulse_replies')
    .insert({
      post_id: postId,
      parent_reply_id: parentReplyId || null,
      user_id: userId,
      author_username: authorUsername,
      author_display_name: authorDisplayName,
      author_avatar_url: authorAvatarUrl,
      content,
      depth: depth ?? 0,
      media_urls: mediaUrls,
    })
    .select()
    .single()

  if (error) {
    console.error('[fan-pulse/replies POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Increment reply_count on parent post (fire-and-forget)
  supabase
    .from('fan_pulse_posts')
    .select('reply_count')
    .eq('id', postId)
    .single()
    .then(({ data: p }) => {
      if (p) {
        supabase
          .from('fan_pulse_posts')
          .update({ reply_count: (p.reply_count ?? 0) + 1 })
          .eq('id', postId)
          .then(() => {})
      }
    })

  return NextResponse.json({ reply: data })
}
