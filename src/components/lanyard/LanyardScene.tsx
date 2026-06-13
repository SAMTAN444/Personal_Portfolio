// Lazy-loaded 3D scene. Kept as its own default-export module so the heavy
// three.js / rapier bundle is code-split behind React.lazy and never blocks
// first paint. Renders the Lanyard with Samuel's badge face composited on.
import { useEffect, useState } from 'react'
import Lanyard from './Lanyard'
import { BadgeCard } from '../BadgeCard'
import { getBadgeFrontImage } from './badgeFace'

export default function LanyardScene() {
  // Rasterize the badge face (PNG data URL) for the card texture. It's async
  // because the portrait photo is decoded before compositing. We do NOT mount
  // <Lanyard> with a null image and later swap it in: changing frontImage on a
  // live canvas reloads the card texture mid-upload, which throws
  // "texSubImage2D: bad image data" and loses the WebGL context (the card
  // flashes then vanishes). Instead we wait for the face, then mount the canvas
  // once with the image already set — the path the synchronous version used.
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    let alive = true
    getBadgeFrontImage().then((src) => {
      if (alive) setFrontImage(src)
    })
    return () => {
      alive = false
    }
  }, [])

  // Fade the canvas in once it mounts, so it eases over the static badge instead
  // of popping in after the lazy chunk + texture finish loading.
  useEffect(() => {
    if (!frontImage) return
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [frontImage])

  // Keep the static badge on screen for the whole load (chunk download + image
  // decode) — no blank gap before the 3D arrives.
  if (!frontImage) {
    return (
      <div className="flex h-[520px] w-full items-start justify-center pt-4 md:h-[600px]">
        <BadgeCard />
      </div>
    )
  }

  return (
    <div
      className={`h-[520px] w-full transition-opacity duration-500 ease-out md:h-[600px] ${
        shown ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <Lanyard
        position={[0, 0, 14]}
        gravity={[0, -40, 0]}
        fov={20}
        transparent
        frontImage={frontImage}
        imageFit="cover"
      />
    </div>
  )
}
