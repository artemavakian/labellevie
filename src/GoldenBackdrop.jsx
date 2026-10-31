import { useEffect, useRef } from 'react'
import './GoldenBackdrop.css'

// Soft blotches drifting over the ground. Each one is placed and sized as a
// share of the backdrop and drifts on its own slow loop (seconds), so the
// pattern never quite repeats. `tone` picks one of four shades from the
// variant's palette (GoldenBackdrop.css); the brightest, `glow`, is kept to
// a couple of small touches.
const BLOTCHES = [
  { x: -8, y: -14, w: 52, h: 46, tone: 'honey', drift: [9, 7], turn: 14, time: 26 },
  { x: 58, y: -20, w: 46, h: 54, tone: 'ochre', drift: [-7, 9], turn: -10, time: 31 },
  { x: 30, y: 18, w: 40, h: 34, tone: 'gold', drift: [8, -6], turn: 18, time: 23 },
  { x: 76, y: 30, w: 38, h: 46, tone: 'honey', drift: [-9, -8], turn: -16, time: 28 },
  { x: -12, y: 48, w: 44, h: 50, tone: 'ochre', drift: [10, -5], turn: 12, time: 34 },
  { x: 40, y: 56, w: 50, h: 42, tone: 'honey', drift: [-8, -9], turn: -12, time: 29 },
  { x: 14, y: 78, w: 36, h: 32, tone: 'gold', drift: [7, -10], turn: 20, time: 25 },
  { x: 70, y: 72, w: 42, h: 40, tone: 'ochre', drift: [-6, -7], turn: -18, time: 37 },
  { x: 50, y: -6, w: 22, h: 20, tone: 'glow', drift: [-10, 8], turn: 22, time: 21 },
  { x: 88, y: 2, w: 28, h: 30, tone: 'gold', drift: [-8, 10], turn: -20, time: 27 },
  { x: 6, y: 26, w: 26, h: 28, tone: 'honey', drift: [9, 9], turn: 16, time: 33 },
  { x: 58, y: 88, w: 32, h: 26, tone: 'gold', drift: [8, -9], turn: -14, time: 24 },
  { x: 22, y: 40, w: 18, h: 16, tone: 'glow', drift: [10, -8], turn: -22, time: 30 },
  { x: 84, y: 54, w: 30, h: 28, tone: 'honey', drift: [-9, 7], turn: 18, time: 35 },
  { x: 2, y: 92, w: 30, h: 26, tone: 'ochre', drift: [8, -7], turn: -16, time: 32 },
  { x: 46, y: 30, w: 26, h: 30, tone: 'ochre', drift: [-7, 8], turn: 12, time: 38 },
]

// How close to the border (as a share of the backdrop) a blotch's centre has
// to sit to count as being round the edge.
const EDGE = 20
const nearEdge = (cx, cy) => cx < EDGE || cx > 100 - EDGE || cy < EDGE || cy > 100 - EDGE

/* The site's drifting ground. Drop it in as the first child of a section
   marked `has-golden-backdrop`. `gold` is the warm closing ground; `light`
   is the ivory version of the About opening's wash. `fixed` keeps it in
   place behind a long page instead of stretching it down the whole length.
   `edgesOnly` keeps just the blotches around the border, leaving the middle
   clear for content. */
export default function GoldenBackdrop({ variant = 'gold', fixed = false, edgesOnly = false }) {
  const ref = useRef(null)

  // Off screen, the drift is paused rather than left running unseen; it picks
  // up exactly where it stopped, so nothing visibly changes.
  useEffect(() => {
    const backdrop = ref.current
    if (!backdrop || !('IntersectionObserver' in window)) return undefined
    const observer = new IntersectionObserver(([entry]) => {
      backdrop.toggleAttribute('data-paused', !entry.isIntersecting)
    })
    observer.observe(backdrop)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`golden-backdrop golden-backdrop--${variant}${fixed ? ' golden-backdrop--fixed' : ''}`}
      aria-hidden="true"
    >
      {BLOTCHES.map(({ x, y, w, h, tone, drift, turn, time }, index) => (!edgesOnly || nearEdge(x + w / 2, y + h / 2)) && (
        <span
          key={index}
          className={`golden-backdrop__blotch golden-backdrop__blotch--${tone}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: `${w}%`,
            height: `${h}%`,
            '--drift-x': `${drift[0]}%`,
            '--drift-y': `${drift[1]}%`,
            '--turn': `${turn}deg`,
            // Negative delays start every loop part-way through, so nothing
            // sits at its starting point when the section first appears.
            animationDuration: `${time}s`,
            animationDelay: `${-time * ((index * 0.37) % 1)}s`,
          }}
        />
      ))}
    </div>
  )
}
