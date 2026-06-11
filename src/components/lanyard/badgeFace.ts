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
 * Brand-matched: tinted near-black face, warm off-white name, italic gold last
 * name and accents. Portrait ratio to match the card's UV rect.
 */

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

let cached: string | null = null

/** Draw the badge face once and return it as a PNG data URL (memoized). */
export function getBadgeFrontImage(): string {
  if (cached) return cached

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

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

  // Name — roman off-white, italic gold.
  ctx.fillStyle = OFFWHITE
  ctx.font = `600 92px ${SERIF}`
  ctx.fillText('SAMUEL', 44, 372)
  ctx.fillStyle = GOLD
  ctx.font = `italic 600 92px ${SERIF}`
  ctx.fillText('TAN', 44, 460)

  // Role.
  ctx.fillStyle = GOLD
  ctx.font = `500 26px ${MONO}`
  ctx.letterSpacing = '3px'
  ctx.fillText('FULL-STACK · AI/ML', 46, 532)

  // Divider.
  ctx.strokeStyle = GRID
  ctx.beginPath()
  ctx.moveTo(46, 578)
  ctx.lineTo(474, 578)
  ctx.stroke()

  // Meta.
  ctx.fillStyle = MUTED
  ctx.font = `500 24px ${MONO}`
  ctx.letterSpacing = '2px'
  ctx.fillText('NTU COMPUTER SCIENCE', 46, 638)
  ctx.fillStyle = FAINT
  ctx.fillText('@SAMTAN444', 46, 688)

  ctx.letterSpacing = '0px'
  cached = canvas.toDataURL('image/png')
  return cached
}
