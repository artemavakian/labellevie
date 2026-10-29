import { useEffect, useImperativeHandle, useRef } from 'react'
import './PageTransition.css'

const FRAME_COUNT = 90
const FRAME_MS = 30
// The first frame whose cloud covers the whole screen — frames 44–53 are
// fully opaque edge to edge (measured from the frames' alpha), so the page is
// swapped here, at the start of that solid stretch rather than at the midpoint.
const COVER_FRAME = 44
// A gap between ticks longer than this is a stall (a heavy page mount, a
// backgrounded tab), not playback, and isn't allowed to skip frames.
const STALL_MS = 100

const frameSrc = index => `/page-transition/transition-${index}.webp`

let frames = null
let framesPromise = null

/* Fetches and decodes every frame up front, so the wipe never has to wait on
   one mid-play. Safe to call repeatedly; a failed load is retried next time. */
export function preloadTransitionFrames() {
  framesPromise ??= Promise.all(
    Array.from({ length: FRAME_COUNT }, (_, index) => {
      const image = new Image()
      image.src = frameSrc(index)
      return image.decode().then(() => image)
    }),
  ).then(
    list => (frames = list),
    error => {
      framesPromise = null
      throw error
    },
  )
  return framesPromise
}

/* Full-screen canvas that plays the golden cloud wipe. play(onCovered) runs
   the sequence once, calling onCovered while the screen is fully covered, and
   resolves once the canvas has cleared itself away. */
export default function PageTransition({ ref }) {
  const canvasRef = useRef(null)
  const busyRef = useRef(false)
  const stopRef = useRef(null)

  useEffect(() => () => stopRef.current?.(), [])

  useImperativeHandle(ref, () => ({
    get busy() {
      return busyRef.current
    },
    get ready() {
      return frames !== null
    },
    play(onCovered) {
      const canvas = canvasRef.current
      const context = canvas?.getContext('2d')
      if (!frames || !context || busyRef.current) {
        onCovered?.()
        return Promise.resolve()
      }
      busyRef.current = true

      return new Promise(resolve => {
        let drawn = -1
        let start = null
        let last = 0
        let covered = false
        let rafId

        const draw = index => {
          const image = frames[index]
          const { width, height } = canvas
          const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
          const w = image.naturalWidth * scale
          const h = image.naturalHeight * scale
          context.clearRect(0, 0, width, height)
          context.drawImage(image, (width - w) / 2, (height - h) / 2, w, h)
          drawn = index
        }

        const fit = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          canvas.width = Math.round(window.innerWidth * dpr)
          canvas.height = Math.round(window.innerHeight * dpr)
          context.imageSmoothingQuality = 'high'
          if (drawn >= 0) draw(drawn)
        }

        const finish = () => {
          cancelAnimationFrame(rafId)
          window.removeEventListener('resize', fit)
          context.clearRect(0, 0, canvas.width, canvas.height)
          canvas.classList.remove('page-transition--active')
          busyRef.current = false
          stopRef.current = null
          resolve()
        }

        const tick = now => {
          if (start === null) start = now
          else if (now - last > STALL_MS) start += now - last - FRAME_MS
          last = now

          let index = Math.min(FRAME_COUNT - 1, Math.floor((now - start) / FRAME_MS))
          if (!covered && index >= COVER_FRAME) {
            // Land exactly on the first covering frame before swapping, even
            // if this tick ran late, then carry on from there.
            index = COVER_FRAME
            start = now - COVER_FRAME * FRAME_MS
          }
          if (index !== drawn) draw(index)
          if (!covered && index === COVER_FRAME) {
            covered = true
            onCovered?.()
          }

          if (now - start >= FRAME_COUNT * FRAME_MS) finish()
          else rafId = requestAnimationFrame(tick)
        }

        fit()
        window.addEventListener('resize', fit)
        canvas.classList.add('page-transition--active')
        stopRef.current = finish
        rafId = requestAnimationFrame(tick)
      })
    },
  }), [])

  return <canvas ref={canvasRef} className="page-transition" aria-hidden="true" />
}
