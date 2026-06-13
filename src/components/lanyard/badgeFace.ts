/*
 * The Lanyard card face. Composited onto the GLB's texture atlas via the
 * <Lanyard frontImage> prop, so the 3D badge shows Samuel's identity instead of
 * the stock art.
 *
 * Rendered on a real <canvas> and exported as a PNG data URL. (An SVG data URL
 * is tempting, but three.js can't reliably size/decode SVG into a GPU texture —
 * it throws "texSubImage2D: bad image data" and loses the WebGL context. A
 * raster PNG uploads cleanly.) System serif + mono fonts so it draws
 * synchronously without waiting on web-font loads.
 *
 * The portrait photo is loaded asynchronously and cover-cropped (focal-biased
 * toward the face) into a window near the top of the card, so the builder is
 * async and the result is cached after the first successful draw.
 *
 * Brand-matched: tinted near-black face, warm off-white name, italic gold last
 * name and accents. Portrait ratio to match the card's UV rect.
 */

import portrait from './portrait.jpg'

const INK = '#0B0B0C'
const PANEL = '#131316'
const GRID = '#1F1F23'
const OFFWHITE = '#ECE7DD'
const MUTED = '#978F82'
const FAINT = '#847E73'
const GOLD = '#C9A227'

const SERIF = "Georgia, 'Times New Roman', serif"
const MONO = "'JetBrains Mono', 'Courier New', monospace"

const W = 520
const H = 760
// Supersample factor: draw at 2x so the rasterized face (text + photo) stays
// crisp when composited into the card's texture atlas. Coordinates below stay in
// W×H space; the context is scaled once.
const SS = 2

let cached: string | null = null
let portraitImg: HTMLImageElement | null = null

/** Load (and memoize) the portrait as a decoded image element for canvas compositing. */
function loadPortrait(): Promise<HTMLImageElement> {
  if (portraitImg) return Promise.resolve(portraitImg)
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      portraitImg = img
      resolve(img)
    }
    img.onerror = reject
    img.src = portrait
  })
}

/**
 * Draw `img` to fill the (x,y,w,h) box (cover crop, no stretch). `focalX/Y` in
 * [0,1] bias which part stays visible when the image overflows the box —
 * focalY > 0.5 keeps the lower portion (the face here) in frame.
 */
function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
  focalX = 0.5,
  focalY = 0.5
): void {
  const scale = Math.max(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale
  const dx = x + (w - dw) * focalX
  const dy = y + (h - dh) * focalY
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.drawImage(img, dx, dy, dw, dh)
  ctx.restore()
}

/** Draw the badge face once and return it as a PNG data URL (memoized). */
export async function getBadgeFrontImage(): Promise<string> {
  if (cached) return cached

  const img = await loadPortrait()

  const canvas = document.createElement('canvas')
  canvas.width = W * SS
  canvas.height = H * SS
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''
  ctx.scale(SS, SS)
  ctx.imageSmoothingQuality = 'high'

  // Face: tinted near-black with a faint vertical gradient.
  const grad = ctx.createLinearGradient(0, 0, 0, H)
  grad.addColorStop(0, PANEL)
  grad.addColorStop(1, INK)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, W, H)

  // Inner hairline frame.
  ctx.strokeStyle = GRID
  ctx.lineWidth = 2
  ctx.strokeRect(7, 7, W - 14, H - 14)

  // Eyebrow.
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = FAINT
  ctx.font = `500 22px ${MONO}`
  ctx.letterSpacing = '4px'
  ctx.fillText('// ID', 46, 80)

  // ST block (top-right).
  ctx.fillStyle = INK
  ctx.fillRect(396, 44, 78, 78)
  ctx.strokeStyle = GRID
  ctx.strokeRect(396, 44, 78, 78)
  ctx.fillStyle = GOLD
  ctx.font = `italic 600 40px ${SERIF}`
  ctx.letterSpacing = '0px'
  ctx.textAlign = 'center'
  ctx.fillText('ST', 435, 100)
  ctx.textAlign = 'left'

  // Portrait window — cover-cropped, focal-biased toward the face.
  const px = 46
  const py = 138
  const pw = W - 92
  const ph = 300
  drawCover(ctx, img, px, py, pw, ph, 0.5, 0.62)
  // Hairline frame around the photo to seat it on the card.
  ctx.strokeStyle = GRID
  ctx.lineWidth = 2
  ctx.strokeRect(px, py, pw, ph)

  // Name — roman off-white, italic gold.
  ctx.fillStyle = OFFWHITE
  ctx.font = `600 72px ${SERIF}`
  ctx.fillText('SAMUEL', 44, 512)
  ctx.fillStyle = GOLD
  ctx.font = `italic 600 72px ${SERIF}`
  ctx.fillText('TAN', 44, 582)

  // Role.
  ctx.fillStyle = GOLD
  ctx.font = `500 24px ${MONO}`
  ctx.letterSpacing = '3px'
  ctx.fillText('FULL-STACK · AI/ML', 46, 632)

  // Divider.
  ctx.strokeStyle = GRID
  ctx.beginPath()
  ctx.moveTo(46, 668)
  ctx.lineTo(474, 668)
  ctx.stroke()

  // Meta.
  ctx.fillStyle = MUTED
  ctx.font = `500 22px ${MONO}`
  ctx.letterSpacing = '2px'
  ctx.fillText('NTU COMPUTER SCIENCE', 46, 708)
  ctx.fillStyle = FAINT
  ctx.fillText('@SAMTAN444', 46, 740)

  ctx.letterSpacing = '0px'
  cached = canvas.toDataURL('image/png')
  return cached
}
