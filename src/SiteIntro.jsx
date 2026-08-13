import { useEffect, useRef } from 'react'
import './SiteIntro.css'

const HOLD_MS = 2500

/* The opening screen: the mark on warm off-white, held just long enough for
   the rest of the site to load behind it, then it takes itself away. */
export default function SiteIntro({ leaving, onEnter }) {
  const enterRef = useRef(onEnter)
  enterRef.current = onEnter

  useEffect(() => {
    const timer = setTimeout(() => enterRef.current?.(), HOLD_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`site-intro${leaving ? ' site-intro--leaving' : ''}`}>
      <div className="site-intro__stack">
        <span className="site-intro__logo" role="img" aria-label="La Belle Vie" />
        <span className="site-intro__caption">Medical Care · Aesthetics</span>
      </div>
    </div>
  )
}
