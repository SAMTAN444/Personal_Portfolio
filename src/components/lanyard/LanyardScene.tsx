// Lazy-loaded 3D scene. Kept as its own default-export module so the heavy
// three.js / rapier bundle is code-split behind React.lazy and never blocks
// first paint. Renders the Lanyard with Samuel's badge face composited on.
import { useMemo } from 'react'
import Lanyard from './Lanyard'
import { getBadgeFrontImage } from './badgeFace'

export default function LanyardScene() {
  // Rasterize the badge face once (PNG data URL) for the card texture.
  const frontImage = useMemo(() => getBadgeFrontImage(), [])

  return (
    <div className="h-[460px] w-full md:h-[520px]">
      <Lanyard
        position={[0, 0, 18]}
        gravity={[0, -40, 0]}
        fov={20}
        transparent
        frontImage={frontImage}
        imageFit="cover"
      />
    </div>
  )
}
