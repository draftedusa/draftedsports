'use client'

import { supabase } from '@/lib/supabase'

const BUCKET = 'fan-pulse-media'

export async function uploadMediaFiles(files: File[]): Promise<string[]> {
  if (files.length === 0) return []

  const uploads = files.map(async (file) => {
    const ext = file.name.split('.').pop() ?? 'bin'
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (error) throw error
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
    return data.publicUrl
  })

  return Promise.all(uploads)
}
