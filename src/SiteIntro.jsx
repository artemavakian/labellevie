import { useEffect, useRef } from 'react'
import './SiteIntro.css'

// How long the opening screen holds before the page transition takes it away.
const HOLD_MS = 2200

/* The opening screen: the mark and caption on warm off-white, held for a
   beat before onDone hands over to the page transition. */
export default function SiteIntro({ onDone }) {
  const doneRef = useRef(onDone)
  doneRef.current = onDone

  useEffect(() => {
    const timer = setTimeout(() => doneRef.current?.(), HOLD_MS)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="site-intro">
      <div className="site-intro__stack">
        <span className="site-intro__logo" role="img" aria-label="La Belle Vie" />
        <span className="site-intro__caption">Medical Care · Aesthetics</span>
      </div>
    </div>
  )
}
