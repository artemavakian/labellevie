import { useEffect, useId, useRef } from 'react'
import gsap from 'gsap'
import './FlowerButton.css'

// Hover: the flower rolls across to the far side of the label, turning half
// a revolution on the way. The label fades just before the flower would
// reach it and comes back on the side the flower left, so a held hover reads
// "LABEL ✿" where the resting button reads "✿ LABEL".
const HOVER = {
  duration: 0.6, // Seconds for the flower's trip across
  ease: 'power2.inOut',
  fadeOut: 0.14, // Seconds for the label to clear out of the way
  fadeIn: 0.2, // Seconds for it to come back, ending as the flower lands
}

// Layout in px. The pill's see-through text is drawn in SVG and has to be
// placed by number, so these are the single source for both it and the CSS.
const FLOWER = 14
const GAP = 10
const PILL_PAD = 26
const PILL_HEIGHT = 54

/* A label with a small flower to its left. `pill` is the hero's white pill,
   its label cut out of the fill so whatever is behind shows through; `plain`
   is white text with a white flower, for dark or golden grounds. */
export default function FlowerButton({ children, onClick, variant = 'plain', className = '', ...rest }) {
  const maskId = `flower-btn-${useId().replace(/[^\w-]/g, '')}`
  const flowerRef = useRef(null)
  const labelRef = useRef(null)
  const cutoutRef = useRef(null)
  const timelineRef = useRef(null)
  const pill = variant === 'pill'
  const label = String(children)

  useEffect(() => () => timelineRef.current?.kill(), [])

  const buildTimeline = () => {
    // The pill's visible label is the one cut out of the mask; the HTML one
    // only holds the button's width.
    const text = pill ? cutoutRef.current : labelRef.current
    const width = labelRef.current.offsetWidth
    return gsap.timeline({ paused: true })
      .to(flowerRef.current, { x: width + GAP, rotation: 180, duration: HOVER.duration, ease: HOVER.ease }, 0)
      .to(text, { opacity: 0, duration: HOVER.fadeOut, ease: 'power1.out' }, 0)
      .set(text, { x: -(FLOWER + GAP) }, HOVER.fadeOut)
      .to(text, { opacity: 1, duration: HOVER.fadeIn, ease: 'power1.in' }, HOVER.duration - HOVER.fadeIn)
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
        '--flower-btn-flower': `${FLOWER}px`,
        '--flower-btn-gap': `${GAP}px`,
        '--flower-btn-pad': `${PILL_PAD}px`,
        '--flower-btn-height': `${PILL_HEIGHT}px`,
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
            <mask id={maskId} maskUnits="userSpaceOnUse">
              <rect width="100%" height="100%" rx={PILL_HEIGHT / 2} fill="#fff" />
              <text
                ref={cutoutRef}
                className="flower-btn__cutout"
                x={PILL_PAD + FLOWER + GAP}
                y="50%"
                dominantBaseline="central"
                fill="#000"
              >
                {label.toUpperCase()}
              </text>
            </mask>
          </defs>
          <rect width="100%" height="100%" rx={PILL_HEIGHT / 2} fill="#fff" mask={`url(#${maskId})`} />
        </svg>
      )}
      <span ref={flowerRef} className="flower-btn__flower" aria-hidden="true" />
      <span ref={labelRef} className="flower-btn__label">{label}</span>
    </button>
  )
}
