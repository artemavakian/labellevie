/* Desktop windows narrower or shorter than the design size show the same
   desktop layout, scaled down, rather than cropping it — down to a floor,
   below which it stops shrinking. Phones and tablets (1024px and narrower)
   keep their own responsive layouts at full size.

   The scale is applied as `zoom` on the root, and published as --zoom so the
   stylesheets' viewport units can divide it back out: under zoom, 1vw would
   otherwise shrink along with everything else (see --vw and friends in
   index.css). */

const DESIGN_WIDTH = 1440
const DESIGN_HEIGHT = 760
const MIN_SCALE = 0.7
// At this width and below, the tablet and phone layouts take over unscaled.
const RESPONSIVE_MAX = 1024

let scale = 1

/* The current scale: on-screen pixels per CSS pixel. */
export const viewportScale = () => scale

function apply() {
  const width = window.innerWidth
  const height = window.innerHeight
  scale = width <= RESPONSIVE_MAX
    ? 1
    : Math.max(MIN_SCALE, Math.min(1, width / DESIGN_WIDTH, height / DESIGN_HEIGHT))
  const root = document.documentElement
  root.style.zoom = scale === 1 ? '' : String(scale)
  root.style.setProperty('--zoom', String(scale))
}

export function startViewportScale() {
  apply()
  window.addEventListener('resize', apply)
}
