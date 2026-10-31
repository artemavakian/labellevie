import { useEffect, useRef } from 'react'
import FlowerButton from './FlowerButton'
import GoldenBackdrop from './GoldenBackdrop'
import RevealText from './RevealText'
import './ResultsPage.css'

function RevealSection({
  beforeImg,
  afterImg,
  reversed = false,
  revealDir = 'ltr',
  number,
  treatment,
  text,
  final = false,
}) {
  const wrapperRef = useRef(null)
  const afterImgRef = useRef(null)
  const dividerRef = useRef(null)
  const handleRef = useRef(null)
  const scrollNoteRef = useRef(null)

  useEffect(() => {
    // Driven by scroll/resize (rAF-throttled) rather than a perpetual
    // rAF loop, so it stays idle — and off the main thread — when the
    // page isn't actually being scrolled.
    let frame = 0

    const update = () => {
      frame = 0
      if (!wrapperRef.current) return

      const rect = wrapperRef.current.getBoundingClientRect()
      const vh = window.innerHeight
      // On-screen pixels throughout, like the rect (offsetHeight isn't, in a
      // scaled-down window).
      const scrollable = rect.height - vh
      const progress = Math.max(0, Math.min(1, -rect.top / scrollable))
      const pct = progress * 100

      if (afterImgRef.current) {
        afterImgRef.current.style.clipPath = revealDir === 'rtl'
          ? `inset(0 0 0 ${100 - pct}%)`
          : `inset(0 ${100 - pct}% 0 0)`
      }

      if (dividerRef.current) {
        dividerRef.current.style.left = revealDir === 'rtl' ? `${100 - pct}%` : `${pct}%`
        dividerRef.current.classList.toggle('ba-divider--done', pct >= 99)
      }
    }

    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [revealDir])

  // Hovering the divider's circle pulses a band of gold through the scroll
  // note once: it sweeps in behind the text and, the moment it reaches the
  // end, sweeps straight back out — whether or not the pointer has left.
  // Only wired on pointer devices (matchMedia hover check).
  useEffect(() => {
    const handle = handleRef.current
    const note = scrollNoteRef.current
    if (!handle || !note) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const onEnter = () => {
      note.classList.remove('ba-scroll-note--erase')
      note.classList.add('ba-scroll-note--draw')
    }
    const onDrawn = event => {
      if (event.animationName !== 'ba-underline-draw') return
      note.classList.remove('ba-scroll-note--draw')
      note.classList.add('ba-scroll-note--erase')
    }

    handle.addEventListener('mouseenter', onEnter)
    note.addEventListener('animationend', onDrawn)
    return () => {
      handle.removeEventListener('mouseenter', onEnter)
      note.removeEventListener('animationend', onDrawn)
    }
  }, [])

  const initClip = revealDir === 'rtl' ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)'
  const initLeft = revealDir === 'rtl' ? '100%' : '0%'

  const imagesEl = (
    <div className="ba-images">
      <img
        src={beforeImg}
        className="ba-before-img"
        alt={`${treatment} before treatment`}
        draggable={false}
        decoding="async"
      />
      <img
        ref={afterImgRef}
        src={afterImg}
        className="ba-after-img"
        alt={`${treatment} after treatment`}
        draggable={false}
        decoding="async"
        style={{ clipPath: initClip }}
      />
      <div ref={dividerRef} className="ba-divider" style={{ left: initLeft }}>
        {/* The circle's own hover target, so the thin line itself doesn't count. */}
        <span ref={handleRef} className="ba-divider__handle" aria-hidden="true" />
      </div>
    </div>
  )

  const textEl = (
    <div className={`ba-text${reversed ? ' ba-text--right' : ''}`} data-menu-theme="light">
      <div className="ba-text__inner">
        <div className="ba-chapter" aria-hidden="true">
          <span>{number}</span>
        </div>
        {text}
        <p ref={scrollNoteRef} className="ba-scroll-note">
          <span className="ba-scroll-note__text">Scroll to reveal the result</span>
        </p>
      </div>
    </div>
  )

  return (
    <div ref={wrapperRef} className={`ba-wrapper${final ? ' ba-wrapper--final' : ''}`} data-menu-theme="dark">
      <div className="ba-sticky">
        {reversed ? imagesEl : textEl}
        {reversed ? textEl : imagesEl}
      </div>
    </div>
  )
}

export default function ResultsPage({ onBook, onGallery }) {
  return (
    <main className="results-page">
      <section className="results-intro has-golden-backdrop" data-menu-theme="dark">
        <GoldenBackdrop />
        <div className="results-intro__topline" aria-label="Rejuvenate, restore, maintain">
          <span>Rejuvenate</span>
          <span className="results-intro__divider" aria-hidden="true" />
          <span>Restore</span>
          <span className="results-intro__divider" aria-hidden="true" />
          <span>Maintain</span>
        </div>

        <div className="results-intro__body">
          <RevealText as="h1" className="results-intro__statement">
            See what’s possible without the operating room.
          </RevealText>
          <p className="results-intro__lead">
            Results achieved with non-surgical, minimally-invasive treatments.
          </p>
        </div>

        <div className="results-intro__footer">
          <p className="results-intro__scroll">Scroll to Explore</p>
          <p className="results-intro__count">Shared with patient consent</p>
        </div>
      </section>

      <RevealSection
        beforeImg="/realresults/renuvabefore.webp"
        afterImg="/realresults/renuvaafter.webp"
        number="01"
        treatment="Renuva"
        reversed={false}
        revealDir="ltr"
        text={
          <>
            <span className="ba-treatment-label">Renuva®</span>
            <RevealText as="h2" className="ba-title">Natural volume restoration.<br />No surgery required.</RevealText>
            <p className="ba-desc">
              Restore youthful volume while avoiding the risks, scars, and recovery of surgery.
              The result is a refreshed, rejuvenated look that&apos;s unmistakably you.
            </p>
          </>
        }
      />

      <div className="ba-section-divider" />

      <RevealSection
        beforeImg="/realresults/coolsculptbefore.webp"
        afterImg="/realresults/coolsculptafter.webp"
        number="02"
        treatment="CoolSculpting"
        reversed
        revealDir="rtl"
        final
        text={
          <>
            <span className="ba-treatment-label">CoolSculpting®</span>
            <RevealText as="h2" className="ba-title">Non-invasive transformation.</RevealText>
            <p className="ba-desc">
              Target stubborn fat with no surgery, no incisions, and little to no downtime —
              revealing a naturally slimmer, more contoured appearance.
            </p>
          </>
        }
      />

      <section className="results-cta has-golden-backdrop" data-menu-theme="dark">
        <GoldenBackdrop />
        <p className="results-cta__eyebrow">Begin your story</p>
        <RevealText className="results-cta__text">
          Exceptional care, exceptional results.<br />
          Your consultation is always free.
        </RevealText>
        <div className="results-cta__actions">
          <FlowerButton className="results-cta__button" onClick={onGallery}>Full Gallery</FlowerButton>
          <FlowerButton className="results-cta__button" onClick={onBook}>Book Now</FlowerButton>
        </div>
      </section>
    </main>
  )
}
