import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import './FlowerButton.css'

// Hover: the flower rolls across to the far side of the label, turning half
// a revolution on the way. Just ahead of it the label sweeps away from the
// left, then sweeps back in from the left behind it on the side the flower
// left, so a held hover reads "LABEL ✿" where the resting button reads
// "✿ LABEL". Leaving plays it all backwards, so the sweeps run right to left.
const HOVER = {
  duration: 0.6, // Seconds for the flower's trip across
  ease: 'power2.inOut',
  sweepOut: 0.22, // Seconds for the label to sweep away
  sweepIn: 0.3, // Seconds for it to sweep back, ending as the flower lands
}

// Width of the soft edge on each sweep, as a share of the label's width.
const SWEEP_SOFTNESS = 0.3

// The flower and the gap beside it, in ems of the label, so every size of
// button keeps the same proportions.
const FLOWER_EM = 0.875
const GAP_EM = 0.833

// The pill's see-through text is drawn in SVG and has to be placed by number;
// these px values are the single source for both it and the CSS.
const PILL_FONT = 12
const PILL_PAD = 26
const PILL_HEIGHT = 54

/* The hover's sweep on its own: the label wipes away from the left, then
   comes back in from the left. `paint` draws the state, { hide, show }, each
   running 0→1 (see the `sweep-label` mask in FlowerButton.css). Played
   backwards on leaving, both sweeps run right to left. */
export function sweepTimeline(paint) {
  const sweep = { hide: 0, show: 1 }
  const draw = () => paint(sweep)
  return gsap.timeline({ paused: true })
    .to(sweep, { hide: 1, duration: HOVER.sweepOut, ease: 'none', onUpdate: draw }, 0)
    .set(sweep, { hide: 0, show: 0, onUpdate: draw, onComplete: draw, onReverseComplete: draw }, HOVER.sweepOut)
    .to(sweep, { show: 1, duration: HOVER.sweepIn, ease: 'none', onUpdate: draw }, HOVER.duration - HOVER.sweepIn)
}

/* The sweep for any HTML label carrying the `sweep-label` class: returns a
   hover(on) to call from its pointer handlers. */
export function useLabelSweep(labelRef) {
  const timelineRef = useRef(null)
  useEffect(() => () => timelineRef.current?.kill(), [])
  return on => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timelineRef.current ??= sweepTimeline(({ hide, show }) => {
      labelRef.current?.style.setProperty('--hide', hide)
      labelRef.current?.style.setProperty('--show', show)
    })
    if (on) timelineRef.current.play()
    else timelineRef.current.reverse()
  }
}

/* A label with a small flower to its left. `pill` is the hero's white pill,
   its label cut out of the fill so whatever is behind shows through; `plain`
   is white text with a white flower, sized by the font-size it's given.
   Without the flower (`flower={false}`) the hover is just the label sweeping
   out and back in where it stands. */
export default function FlowerButton({ children, onClick, variant = 'plain', flower = true, className = '', ...rest }) {
  const id = useId().replace(/[^\w-]/g, '')
  const maskId = `flower-btn-mask-${id}`
  const sweepId = `flower-btn-sweep-${id}`
  const flowerRef = useRef(null)
  const labelRef = useRef(null)
  const cutoutRef = useRef(null)
  const stopsRef = useRef([])
  const timelineRef = useRef(null)
  const pill = variant === 'pill'
  const label = String(children)

  useEffect(() => () => timelineRef.current?.kill(), [])

  // `hide` runs 0→1 as the label sweeps away from the left; `show` runs 0→1
  // as it sweeps back in from the left. Together they mark the visible span
  // of the label, which becomes a mask on the HTML label or the gradient
  // that fills the pill's cutout.
  const paintSweep = ({ hide, show }) => {
    if (pill) {
      // The gradient vector overhangs the text by the softness on each side,
      // so every edge position maps inside 0–1.
      const span = 1 + 2 * SWEEP_SOFTNESS
      const at = x => (x + SWEEP_SOFTNESS) / span
      const offsets = [
        at(hide * (1 + SWEEP_SOFTNESS) - SWEEP_SOFTNESS),
        at(hide * (1 + SWEEP_SOFTNESS)),
        at(show * (1 + SWEEP_SOFTNESS) - SWEEP_SOFTNESS),
        at(show * (1 + SWEEP_SOFTNESS)),
      ]
      stopsRef.current.forEach((stop, index) => stop.setAttribute('offset', offsets[index]))
    } else {
      labelRef.current.style.setProperty('--hide', hide)
      labelRef.current.style.setProperty('--show', show)
    }
  }

  const buildTimeline = () => {
    const timeline = sweepTimeline(paintSweep)
    if (!flower) return timeline

    // With the flower: it rolls across, and the label, once swept away,
    // moves to the side the flower left before sweeping back in.
    const text = pill ? cutoutRef.current : labelRef.current
    const width = labelRef.current.offsetWidth
    const flowerWidth = flowerRef.current.offsetWidth
    const gap = parseFloat(getComputedStyle(flowerRef.current.parentElement).columnGap) || 0
    return timeline
      .to(flowerRef.current, { x: width + gap, rotation: 180, duration: HOVER.duration, ease: HOVER.ease }, 0)
      .set(text, { x: -(flowerWidth + gap) }, HOVER.sweepOut)
  }

  const hover = on => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let timeline = timelineRef.current
    // Built on first use, once the label's font has loaded, and rebuilt if
    // the label has changed width since (a resize, a late font) while at rest.
    if (!timeline || (timeline.progress() === 0 && timeline.labelWidth !== labelRef.current.offsetWidth)) {
      timeline?.kill()
      timeline = timelineRef.current = buildTimeline()
      timeline.labelWidth = labelRef.current.offsetWidth
    }
    if (on) timeline.play()
    else timeline.reverse()
  }

  return (
    <button
      type="button"
      className={`flower-btn flower-btn--${variant}${className ? ` ${className}` : ''}`}
      style={{
        '--flower-btn-flower': `${FLOWER_EM}em`,
        '--flower-btn-gap': `${GAP_EM}em`,
        '--flower-btn-pad': `${PILL_PAD}px`,
        '--flower-btn-height': `${PILL_HEIGHT}px`,
        ...(pill && { fontSize: `${PILL_FONT}px` }),
      }}
      onClick={onClick}
      onPointerEnter={event => event.pointerType === 'mouse' && hover(true)}
      onPointerLeave={event => event.pointerType === 'mouse' && hover(false)}
      onFocus={event => event.currentTarget.matches(':focus-visible') && hover(true)}
      onBlur={() => hover(false)}
      {...rest}
    >
      {pill && (
        <svg className="flower-btn__pill" aria-hidden="true">
          <defs>
            {/* Black punches the text out of the pill; white fills it back. */}
            <linearGradient id={sweepId} x1={-SWEEP_SOFTNESS} x2={1 + SWEEP_SOFTNESS} y1="0" y2="0">
              {['#fff', '#000', '#000', '#fff'].map((color, index) => (
                <stop
                  key={index}
                  ref={stop => { stopsRef.current[index] = stop }}
                  offset={[0, SWEEP_SOFTNESS, 1 + SWEEP_SOFTNESS, 1 + 2 * SWEEP_SOFTNESS][index] / (1 + 2 * SWEEP_SOFTNESS)}
                  stopColor={color}
                />
              ))}
            </linearGradient>
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <rect width="100%" height="100%" rx={PILL_HEIGHT / 2} fill="#fff" />
              <text
                ref={cutoutRef}
                className="flower-btn__cutout"
                x={PILL_PAD + (flower ? PILL_FONT * (FLOWER_EM + GAP_EM) : 0)}
                y="50%"
                dominantBaseline="central"
                fill={`url(#${sweepId})`}
              >
                {label.toUpperCase()}
              </text>
            </mask>
          </defs>
          <rect width="100%" height="100%" rx={PILL_HEIGHT / 2} fill="#fff" mask={`url(#${maskId})`} />
        </svg>
      )}
      {flower && <span ref={flowerRef} className="flower-btn__flower" aria-hidden="true" />}
      <span ref={labelRef} className="flower-btn__label sweep-label">{label}</span>
    </button>
  )
}
