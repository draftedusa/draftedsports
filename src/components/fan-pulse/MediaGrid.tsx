'use client'

interface MediaGridProps {
  files: string[]
  onRemove?: (index: number) => void
}

export function MediaGrid({ files, onRemove }: MediaGridProps) {
  if (files.length === 0) return null

  const CloseBtn = ({ index }: { index: number }) =>
    onRemove ? (
      <button
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 bg-black/70 rounded-full p-1 z-10"
      >
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
          <path d="M10.59 12L4.54 5.96l1.42-1.42L12 10.59l6.04-6.05 1.42 1.42L13.41 12l6.05 6.04-1.42 1.42L12 13.41l-6.04 6.05-1.42-1.42L10.59 12z" />
        </svg>
      </button>
    ) : null

  if (files.length === 1) {
    return (
      <div className="mt-3 rounded-2xl overflow-hidden relative">
        <img
          src={files[0]}
          className="w-full max-h-[510px] object-cover"
          alt=""
        />
        <CloseBtn index={0} />
      </div>
    )
  }

  if (files.length === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
        {files.map((f, i) => (
          <div key={i} className="relative">
            <img src={f} className="w-full aspect-square object-cover" alt="" />
            <CloseBtn index={i} />
          </div>
        ))}
      </div>
    )
  }

  if (files.length === 3) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
        <div className="relative row-span-2">
          <img src={files[0]} className="w-full h-full object-cover" style={{ aspectRatio: '2/3' }} alt="" />
          <CloseBtn index={0} />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="relative">
            <img src={files[i]} className="w-full aspect-square object-cover" alt="" />
            <CloseBtn index={i} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
      {files.slice(0, 4).map((f, i) => (
        <div key={i} className="relative">
          <img src={f} className="w-full aspect-square object-cover" alt="" />
          <CloseBtn index={i} />
        </div>
      ))}
    </div>
  )
}
