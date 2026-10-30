import { useEffect, useRef, useState } from 'react'
import './SiteIntro.css'

// How long the script sits alone before the flower starts drawing.
const START_MS = 1000
// How long the finished mark holds before the page transition takes it away.
const HOLD_MS = 1000

// Fetched and inlined (rather than shown as an image) so each showing of the
// intro gets its own copy of the drawing that starts from the first stroke.
let flowerPromise = null
const loadFlower = () => {
  flowerPromise ??= fetch('/lbvintro.svg')
    .then(response => (response.ok ? response.text() : ''))
    .catch(() => '')
  return flowerPromise
}

/* The opening screen: the script mark and caption on warm off-white, with the
   flower drawing itself on beside them. Once it has finished and held for a
   beat, onDone hands over to the page transition. */
export default function SiteIntro({ onDone }) {
  const doneRef = useRef(onDone)
  doneRef.current = onDone
  const flowerRef = useRef(null)
  const [flower, setFlower] = useState(null)

  // The flower is only put on the page once the pause is over: inserting it
  // is what starts its strokes.
  useEffect(() => {
    let live = true
    const started = Date.now()
    let timer
    loadFlower().then(markup => {
      if (!live) return
      timer = setTimeout(() => setFlower(markup), Math.max(0, START_MS - (Date.now() - started)))
    })
    return () => {
      live = false
      clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    if (flower === null) return
    let timer
    let live = true
    // Reduced motion leaves the strokes static, so there's nothing to wait on.
    const strokes = flowerRef.current?.getAnimations?.({ subtree: true }) ?? []
    Promise.all(strokes.map(stroke => stroke.finished)).then(() => {
      if (live) timer = setTimeout(() => doneRef.current?.(), HOLD_MS)
    }, () => {})
    return () => {
      live = false
      clearTimeout(timer)
    }
  }, [flower])

  return (
    <div className="site-intro">
      <div className="site-intro__stack">
        <div className="site-intro__mark" role="img" aria-label="La Belle Vie">
          <span className="site-intro__script" />
          {flower !== null && (
            <div
              ref={flowerRef}
              className="site-intro__flower"
              dangerouslySetInnerHTML={{ __html: flower }}
            />
          )}
        </div>
        <span className="site-intro__caption">Medical Care · Aesthetics</span>
      </div>
    </div>
  )
}
