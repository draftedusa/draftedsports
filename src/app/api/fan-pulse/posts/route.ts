import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const getSupabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRow(post: any) {
  const reactions = typeof post.reactions === 'object' && post.reactions !== null ? post.reactions : {}
  return {
    ...post,
    user: {
      name: post.author_display_name || post.author_username || 'User',
      handle: post.author_username || 'user',
      avatar_url: post.author_avatar_url || '',
    },
    fire_count: reactions.fire ?? 0,
    repost_count: reactions.repost ?? 0,
    comment_count: post.reply_count ?? 0,
    media_urls: post.media_urls ?? [],
  }
}

export async function GET(req: NextRequest) {
  const supabase = getSupabase()
  const { searchParams } = new URL(req.url)
  const leagueTag = searchParams.get('league')

  let query = supabase
    .from('fan_pulse_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (leagueTag && leagueTag !== 'ALL') {
    query = query.eq('league_tag', leagueTag)
  }

  const { data, error } = await query

  if (error) {
    console.error('[GET /api/fan-pulse/posts] error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  console.log('[GET /api/fan-pulse/posts] rows:', data?.length ?? 0, '| league:', leagueTag ?? 'ALL')

  return NextResponse.json((data || []).map(mapRow))
}

export async function POST(req: NextRequest) {
  console.log('[POST /api/fan-pulse/posts] SUPABASE_URL set:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('[POST /api/fan-pulse/posts] SERVICE_KEY set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getSupabase()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let body: any
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { content, leagueTag = 'ALL', mediaUrls = [] } = body

  if (!content?.trim() && mediaUrls.length === 0) {
    return NextResponse.json({ error: 'Content or media required' }, { status: 400 })
  }

  let authorUsername = 'user'
  let authorDisplayName = 'User'
  let authorAvatarUrl = ''

  try {
    const { clerkClient } = await import('@clerk/nextjs/server')
    const client = await clerkClient()
    const clerkUser = await client.users.getUser(userId)
    authorUsername =
      clerkUser.username ||
      clerkUser.emailAddresses[0]?.emailAddress?.split('@')[0] ||
      'user'
    authorDisplayName =
      `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'User'
    authorAvatarUrl = clerkUser.imageUrl || ''
  } catch (err) {
    console.error('[POST /api/fan-pulse/posts] Clerk fetch failed:', err)
  }

  const { data, error } = await supabase
    .from('fan_pulse_posts')
    .insert({
      user_id: userId,
      content: content?.trim() || '',
      league_tag: leagueTag || 'ALL',
      media_urls: mediaUrls || [],
      reactions: {},
      reply_count: 0,
      author_username: authorUsername,
      author_display_name: authorDisplayName,
      author_avatar_url: authorAvatarUrl,
    })
    .select()
    .single()

  if (error) {
    console.error('[POST /api/fan-pulse/posts] Supabase insert error:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    })
    return NextResponse.json({
      error: error.message,
      details: error.details,
      hint: error.hint,
    }, { status: 500 })
  }

  return NextResponse.json(mapRow(data), { status: 201 })
}
