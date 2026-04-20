import { auth } from '@clerk/nextjs/server'
import { supabaseService } from '@/lib/supabase'
import { runMigrations } from '@/lib/migrations'
import { NextResponse } from 'next/server'

let migrated = false
async function ensureMigrated() {
  if (!migrated) { await runMigrations(); migrated = true }
}

export async function POST(req: Request) {
  await ensureMigrated()

  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const content: string = (body.content ?? '').trim()
  if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

  const { postId, parentReplyId, depth } = body
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  const { data: profile } = await supabaseService
    .from('users')
    .select('username, display_name, avatar_url')
    .eq('clerk_id', userId)
    .maybeSingle()

  const username = profile?.username ?? userId.slice(0, 8)

  const { data, error } = await supabaseService
    .from('fan_pulse_replies')
    .insert({
      post_id: postId,
      parent_reply_id: parentReplyId || null,
      user_id: userId,
      author_username: username,
      author_display_name: profile?.display_name ?? null,
      author_avatar_url: profile?.avatar_url ?? null,
      content,
      depth: depth ?? 0,
    })
    .select()
    .single()

  if (error) {
    console.error('[fan-pulse/replies POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Increment reply_count on parent post (fire-and-forget)
  supabaseService
    .from('fan_pulse_posts')
    .select('reply_count')
    .eq('id', postId)
    .single()
    .then(({ data: p }) => {
      if (p) {
        supabaseService
          .from('fan_pulse_posts')
          .update({ reply_count: (p.reply_count ?? 0) + 1 })
          .eq('id', postId)
          .then(() => {})
      }
    })

  return NextResponse.json({ reply: data })
}
