import { auth } from '@clerk/nextjs/server'
import { supabaseService } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { postId } = await req.json()
  if (!postId) return NextResponse.json({ error: 'postId required' }, { status: 400 })

  const { data: post } = await supabaseService
    .from('fan_pulse_posts')
    .select('reactions')
    .eq('id', postId)
    .single()

  if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })

  const reactions = (post.reactions as Record<string, number>) ?? { fire: 0, wow: 0, repost: 0 }
  const { error } = await supabaseService
    .from('fan_pulse_posts')
    .update({ reactions: { ...reactions, fire: (reactions.fire ?? 0) + 1 } })
    .eq('id', postId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
