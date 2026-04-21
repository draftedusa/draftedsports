import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const formData = await req.formData()
  const files = formData.getAll('files') as File[]
  const uploadedUrls: string[] = []

  for (const file of files) {
    const ext = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())

    const { data, error } = await supabaseAdmin.storage
      .from('fan-pulse-media')
      .upload(fileName, buffer, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (error) {
      console.error('Upload error:', error)
      continue
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('fan-pulse-media')
      .getPublicUrl(data.path)

    uploadedUrls.push(publicUrl)
  }

  return NextResponse.json({ urls: uploadedUrls })
}
