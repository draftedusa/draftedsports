'use client'

export async function uploadMediaFiles(files: File[]): Promise<string[]> {
  if (files.length === 0) return []

  const formData = new FormData()
  files.forEach(file => formData.append('files', file))

  const response = await fetch('/api/fan-pulse/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    console.error('Upload failed:', await response.text())
    return []
  }

  const { urls } = await response.json()
  return urls
}
