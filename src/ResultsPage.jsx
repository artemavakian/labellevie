import { useEffect, useRef } from 'react'
import FlowerButton from './FlowerButton'
import './ResultsPage.css'

function RevealSection({
  beforeImg,
  afterImg,
  reversed = false,
  revealDir = 'ltr',
  number,
  treatment,
  text,
  consentText,
  final = false,
}) {
  const wrapperRef = useRef(null)
  const afterImgRef = useRef(null)
  const dividerRef = useRef(null)
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
      const scrollable = wrapperRef.current.offsetHeight - vh
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

  // Underline animation on scroll-note when user hovers the divider handle.
  // Only wired on pointer devices (matchMedia hover check).
  useEffect(() => {
    const divider = dividerRef.current
    const note = scrollNoteRef.current
    if (!divider || !note) return
    if (!window.matchMedia('(hover: hover)').matches) return

    const onEnter = () => {
      note.classList.remove('ba-scroll-note--erase')
      note.classList.add('ba-scroll-note--draw')
    }
    const onLeave = () => {
      note.classList.remove('ba-scroll-note--draw')
      note.classList.add('ba-scroll-note--erase')
    }

    divider.addEventListener('mouseenter', onEnter)
    divider.addEventListener('mouseleave', onLeave)
    return () => {
      divider.removeEventListener('mouseenter', onEnter)
      divider.removeEventListener('mouseleave', onLeave)
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
      <div ref={dividerRef} className="ba-divider" style={{ left: initLeft }} />
      {consentText && <p className="ba-consent-img">{consentText}</p>}
    </div>
  )

  const textEl = (
    <div className={`ba-text${reversed ? ' ba-text--right' : ''}`}>
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

export default function ResultsPage({ onTreatments, onGallery }) {
  return (
    <main className="results-page">
      <section className="results-intro" data-menu-theme="light">
        <div className="results-intro__topline" aria-label="Rejuvenate, restore, maintain">
          <span>Rejuvenate</span>
          <span className="results-intro__divider" aria-hidden="true" />
          <span>Restore</span>
          <span className="results-intro__divider" aria-hidden="true" />
          <span>Maintain</span>
        </div>

        <div className="results-intro__body">
          <h1 className="results-intro__statement">
            See what’s possible without the operating room.
          </h1>
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
        beforeImg="/realresults/renuvabefore.png"
        afterImg="/realresults/renuvaafter.png"
        number="01"
        treatment="Renuva"
        reversed={false}
        revealDir="ltr"
        consentText="Photos shared with patient consent."
        text={
          <>
            <span className="ba-treatment-label">Renuva®</span>
            <h2 className="ba-title">Natural volume restoration.<br />No surgery required.</h2>
            <p className="ba-desc">
              Restore youthful volume while avoiding the risks, scars, and recovery of surgery.
              The result is a refreshed, rejuvenated look that&apos;s unmistakably you.
            </p>
          </>
        }
      />

      <div className="ba-section-divider" />

      <RevealSection
        beforeImg="/realresults/coolsculptbefore.png"
        afterImg="/realresults/coolsculptafter.png"
        number="02"
        treatment="CoolSculpting"
        reversed
        revealDir="rtl"
        consentText="Photos shared with patient consent."
        final
        text={
          <>
            <span className="ba-treatment-label">CoolSculpting®</span>
            <h2 className="ba-title">Non-invasive transformation.</h2>
            <p className="ba-desc">
              Target stubborn fat with no surgery, no incisions, and little to no downtime —
              revealing a naturally slimmer, more contoured appearance.
            </p>
          </>
        }
      />

      <section className="results-cta" data-menu-theme="dark">
        <p className="results-cta__eyebrow">Begin your story</p>
        <p className="results-cta__text">
          Exceptional care, exceptional results.<br />
          Your consultation is always free.
        </p>
        <div className="results-cta__actions">
          <FlowerButton className="results-cta__button" onClick={onTreatments}>Treatments</FlowerButton>
          <FlowerButton className="results-cta__button" onClick={onGallery}>Full Gallery</FlowerButton>
        </div>
      </section>
    </main>
  )
}
