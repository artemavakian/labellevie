import { useEffect, useRef, useState } from 'react'
import './SiteIntro.css'

const HOLD_MS = 2500
const FADE_MS = 700
// A beat of empty off-white after the mark has gone, before the panel moves.
const GAP_MS = 250

/* The opening screen: the mark on warm off-white, held just long enough for
   the rest of the site to load behind it. The mark fades out first, then the
   panel takes itself away. */
export default function SiteIntro({ leaving, onEnter }) {
  const enterRef = useRef(onEnter)
  enterRef.current = onEnter
  const [markGone, setMarkGone] = useState(false)

  useEffect(() => {
    const timers = [
      setTimeout(() => setMarkGone(true), HOLD_MS),
      setTimeout(() => enterRef.current?.(), HOLD_MS + FADE_MS + GAP_MS),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className={`site-intro${leaving ? ' site-intro--leaving' : ''}`}>
      <div className={`site-intro__stack${markGone ? ' site-intro__stack--gone' : ''}`}>
        <span className="site-intro__logo" role="img" aria-label="La Belle Vie" />
        <span className="site-intro__caption">Medical Care · Aesthetics</span>
      </div>
    </div>
  )
}
