import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import './ResultsPage.css'

function ResultsAction({ children, onClick }) {
  return (
    <button type="button" className="results-cta__action" onClick={onClick}>
      <span className="results-cta__action-label">{children}</span>
      <span className="results-cta__action-icon" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </button>
  )
}

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
        <p className="ba-scroll-note">Scroll to reveal the result</p>
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
          <p className="results-intro__count">Selected results · 01—02</p>
        </div>
      </section>

      <RevealSection
        beforeImg="/renuvabefore.webp"
        afterImg="/renuvaafter.webp"
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
        beforeImg="/coolsculptbefore.webp"
        afterImg="/coolsculptafter.webp"
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
          <ResultsAction onClick={onBook}>Book Consultation</ResultsAction>
          <ResultsAction onClick={onGallery}>Full Gallery</ResultsAction>
        </div>
      </section>
    </main>
  )
}
