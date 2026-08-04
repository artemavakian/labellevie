import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { ArrowUpRight } from 'lucide-react'
import Memberships from './Memberships'
import TreatmentPage from './TreatmentPage'
import BookingPage from './BookingPage'
import AboutPage from './AboutPage'
import ResultsPage from './ResultsPage'
import GalleryPage from './GalleryPage'
import TreatmentsDirectory from './TreatmentsDirectory'
import SiteMenu, { SiteMenuButton } from './SiteMenu'
import './App.css'

/* ── Treatments data ────────────────────────────────────────── */
const TREATMENT_COLS = [
  { label: 'Neurotoxins & Fillers', items: [
    { name: 'Neurotoxins',               key: 'neurotoxins' },
    { name: 'Hyper-Diluted Radiesse®',   key: 'hyper-diluted-radiesse' },
    { name: 'Sculptra®',                 key: 'sculptra' },
    { name: 'Filler',                    key: 'dermal-filler' },
    { name: 'PRP Therapy',               key: 'prp-therapy' },
    { name: 'Signature Cheeks',          key: 'signature-cheeks' },
    { name: 'Signature Lips',            key: 'signature-lips' },
    { name: 'Under Eye Filler',          key: 'under-eye-filler' },
    { name: 'Hand Rejuvenation',         key: 'hand-rejuvenation' },
  ]},
  { label: 'Skin & Body', items: [
    { name: 'Facials & Chemical Peels',  key: 'facials-and-peels' },
    { name: 'Microneedling',             key: 'microneedling' },
    { name: 'PDO Thread Lifts',          key: 'pdo-threads' },
    { name: 'CoolSculpting®',            key: 'coolsculpting' },
    { name: 'Sclerotherapy (Spider Veins)', key: 'sclerotherapy' },
    { name: 'Renuva®',                   key: 'renuva' },
  ]},
  { label: 'Laser & Aesthetics', items: [
    { name: 'IPL Photofacial',           key: 'ipl-photofacial' },
    { name: 'CO2 Laser',                 key: 'co2-laser' },
    { name: 'Laser Hair Removal',        key: 'laser-hair-removal' },
    { name: 'Acne Scar Treatment',       key: 'acne-scar-treatment' },
    { name: 'Age Spot Removal',          key: 'age-spot-removal' },
    { name: 'Vampire Facial',            key: 'vampire-facial' },
  ]},
  { label: 'Women’s Health', items: [
    { name: 'Clitoxin®',                 key: 'clitoxin' },
    { name: 'FemiLift',                  key: 'femilift' },
    { name: 'O-Shot™',                   key: 'o-shot' },
    { name: 'V-Plump',                   key: 'v-plump' },
    { name: 'Vampire Breast Lift',       key: 'vampire-breast-lift' },
    { name: 'Hormone Replacement',       key: 'womens-hormone-replacement' },
  ]},
  { label: 'Men’s Health', items: [
    { name: 'P-Shot',                    key: 'p-shot' },
    { name: 'P-Toxin™',                  key: 'p-toxin' },
    { name: 'ED Treatments',             key: 'ed-trifecta' },
    { name: 'Shockwave Therapy',         key: 'shockwave-therapy' },
    { name: 'Hormone Replacement',       key: 'mens-hormone-replacement' },
  ]},
  { label: 'Wellness & Medical', items: [
    { name: 'Vitamin B-12 Shots',        key: 'b12-shots' },
    { name: 'IV Therapy',                key: 'iv-therapy' },
    { name: 'Medical Weight Loss',       key: 'medical-weight-loss' },
    { name: 'Medical Exam',              key: 'medical-exam' },
    { name: 'Medical Dermatology',       key: 'medical-dermatology' },
    { name: 'Medical Cannabis',          key: 'medical-cannabis' },
  ]},
]
const HERO_WORDS = [
  'Rejuvenated',
  'Restored',
  'Maintained',
  'Refined',
  'Timeless',
  'Radiant',
  'Elevated',
  'Renewed',
  'Empowered',
]

function RotatingHeroWord({ active }) {
  const [index, setIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState(null)

  useEffect(() => {
    if (!active) {
      setIndex(0)
      setPreviousIndex(null)
      return
    }

    const timer = setTimeout(() => {
      setPreviousIndex(index)
      setIndex(current => (current + 1) % HERO_WORDS.length)
    }, 7000)

    return () => clearTimeout(timer)
  }, [active, index])

  useEffect(() => {
    if (previousIndex === null) return
    const timer = setTimeout(() => setPreviousIndex(null), 450)
    return () => clearTimeout(timer)
  }, [previousIndex])

  return (
    <span className="hero-text__rotating-word" aria-live="polite">
      {previousIndex !== null && (
        <span className="hero-text__rotating-word-exit" aria-hidden="true">
          {HERO_WORDS[previousIndex]}
        </span>
      )}
      <span
        key={index}
        className={previousIndex !== null ? 'hero-text__rotating-word-enter' : ''}
      >
        {HERO_WORDS[index]}
      </span>
    </span>
  )
}

function HeroVideo({ complete, shouldPlay, onComplete, isVisible }) {
  const [ready, setReady] = useState(!complete)
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (!isVisible) {
      video.pause()
      return
    }
    if (complete || !shouldPlay) return
    video.play().catch(() => {})
  }, [complete, shouldPlay, isVisible])

  return (
    <video
      ref={videoRef}
      className={`hero__video${ready ? '' : ' hero__video--loading'}`}
      src="/herovid.mp4"
      muted
      playsInline
      preload="auto"
      onLoadedMetadata={e => {
        if (complete) {
          e.currentTarget.currentTime = Math.max(0, e.currentTarget.duration - 0.001)
        }
      }}
      onCanPlay={() => setReady(true)}
      onSeeked={() => setReady(true)}
      onPlay={e => {
        if (complete || !shouldPlay) e.currentTarget.pause()
      }}
      onEnded={e => {
        e.currentTarget.pause()
        onComplete()
      }}
    />
  )
}

/* ── URL ⇄ page mapping — keeps the browser back/forward buttons in
   sync with in-app navigation, without changing any page's content. ── */
const PAGE_PATHS = {
  home: '/',
  about: '/about',
  results: '/results',
  gallery: '/gallery',
  treatments: '/treatments',
  memberships: '/memberships',
  booking: '/contact',
}

function pageToPath(page) {
  if (page.startsWith('tx:')) return `/treatments/${page.slice(3)}`
  return PAGE_PATHS[page] || '/'
}

function pathToPage(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (path.startsWith('/treatments/')) return 'tx:' + path.slice('/treatments/'.length)
  const match = Object.entries(PAGE_PATHS).find(([, value]) => value === path)
  return match ? match[0] : 'home'
}

/* ── App ────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage]               = useState(() => pathToPage(window.location.pathname))
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen]       = useState(false)
  const [menuTheme, setMenuTheme]     = useState(() =>
    ['about', 'results', 'gallery', 'treatments', 'memberships'].includes(pathToPage(window.location.pathname))
      ? 'light'
      : 'dark',
  )
  const [heroPhase, setHeroPhase]     = useState('intro') // intro | logo-exit | reveal | done
  const [heroVideoStarted, setHeroVideoStarted] = useState(false)
  const [heroVideoComplete, setHeroVideoComplete] = useState(false)
  const heroRef      = useRef(null)
  const dropdownRef  = useRef(null)
  const lenisRef     = useRef(null)
  const skipHeroIntroRef = useRef(false)
  const heroIntroPlayedRef = useRef(false)

  useEffect(() => {
    if (!dropdownOpen) return
    const close = e => { if (!dropdownRef.current?.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [dropdownOpen])

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true, smoothTouch: false,
      wheelMultiplier: 1, touchMultiplier: 2,
    })
    lenisRef.current = lenis
    let id
    const tick = t => { lenis.raf(t); id = requestAnimationFrame(tick) }
    id = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(id); lenisRef.current = null; lenis.destroy() }
  }, [])

  // Lock the hero and full-screen overlays; other pages keep native Lenis scrolling.
  useEffect(() => {
    if (menuOpen || page === 'home') {
      lenisRef.current?.stop()
      document.body.style.overflow = 'hidden'
    } else {
      lenisRef.current?.start()
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen, page])

  useEffect(() => {
    if (page !== 'home') return
    if (skipHeroIntroRef.current) {
      skipHeroIntroRef.current = false
      setHeroPhase('done')
      setHeroVideoStarted(true)
      return
    }
    setHeroPhase('intro')
    setHeroVideoStarted(false)
    // On phones the video can take a beat to actually start rendering frames
    // once .play() is called, so it's started immediately (silently, fully
    // hidden behind the opaque intro panels) instead of waiting for the
    // reveal — by the time the intro splits open at 2500ms it's already
    // playing smoothly. Desktop/tablet keep the original synced timing.
    const isPhoneHero = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
    const logoExitTimer = setTimeout(() => setHeroPhase('logo-exit'), 2250)
    const revealTimer = setTimeout(() => setHeroPhase('reveal'), 2500)
    const videoTimer = setTimeout(() => setHeroVideoStarted(true), isPhoneHero ? 0 : 2500)
    const doneTimer = setTimeout(() => {
      setHeroPhase('done')
      heroIntroPlayedRef.current = true
    }, 3400)
    return () => {
      clearTimeout(logoExitTimer)
      clearTimeout(revealTimer)
      clearTimeout(videoTimer)
      clearTimeout(doneTimer)
    }
  }, [page])

  useEffect(() => {
    if (page === 'home') return

    const fallback = ['about', 'results', 'gallery', 'treatments', 'memberships'].includes(page) ? 'light' : 'dark'
    const updateTheme = () => {
      const themedElement = document
        .elementsFromPoint(Math.max(0, window.innerWidth - 72), 36)
        .map(element => element.closest?.('[data-menu-theme]'))
        .find(Boolean)
      setMenuTheme(themedElement?.dataset.menuTheme || fallback)
    }

    const frame = requestAnimationFrame(updateTheme)
    window.addEventListener('scroll', updateTheme, { passive: true })
    window.addEventListener('resize', updateTheme)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', updateTheme)
      window.removeEventListener('resize', updateTheme)
    }
  }, [page])

  // Shared by clicks (goTo) and browser back/forward (popstate) so both
  // paths update state identically.
  const applyNavigation = to => {
    setPage(to)
    setMenuTheme(['about', 'results', 'gallery', 'treatments', 'memberships'].includes(to) ? 'light' : 'dark')
    setMenuOpen(false)
    setDropdownOpen(false)
    lenisRef.current?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }

  const goTo = to => {
    applyNavigation(to)
    window.history.pushState({ page: to }, '', pageToPath(to))
  }

  // Keep the initial history entry tagged with its page, and restore the
  // correct page whenever the user presses the browser back/forward buttons.
  useEffect(() => {
    window.history.replaceState({ page }, '', pageToPath(page))

    const onPopState = event => {
      const targetPage = event.state?.page ?? pathToPage(window.location.pathname)
      // Only skip the intro replay if the hero has already been shown once
      // this session — e.g. deep-linking straight into another page and
      // then navigating back to a hero that never played should still
      // play it normally rather than snapping straight to "done".
      if (targetPage === 'home' && heroIntroPlayedRef.current) skipHeroIntroRef.current = true
      applyNavigation(targetPage)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nav = to => e => { e?.preventDefault(); goTo(to) }
  const navAbout = nav('about')
  const selectTreatment = key => goTo('tx:' + key)
  const returnToHero = () => {
    skipHeroIntroRef.current = true
    goTo('home')
  }

  const heroActive = page === 'home'

  return (
    <>
      {/* ── Hero: video + nav overlay + hero text ─────────────────
          Kept mounted (rather than unmounted per-page) so the video
          element never has to re-fetch/re-decode when navigating back
          to the hero — that reload was the source of the black flash. */}
      <section className={`hero${heroActive ? '' : ' hero--inactive'}`} ref={heroRef} aria-hidden={!heroActive}>
        {/* Plays once; the decoded video itself remains on its final frame. */}
        <HeroVideo
          complete={heroVideoComplete}
          shouldPlay={heroVideoStarted}
          isVisible={heroActive}
          onComplete={() => setHeroVideoComplete(true)}
        />

            {/* Warm-white opening screen reveals the hero after the logo exits. */}
            {heroPhase !== 'done' && (
              <div className={`hero-intro-screen hero-intro-screen--${heroPhase}`}>
                <div className={`hero-intro-logo${heroPhase !== 'intro' ? ' hero-intro-logo--exit' : ''}`}>
                  <img src="/lbvlogo.png" alt="La Belle Vie" className="hero-intro-logo__img" draggable={false} />
                  <span className="hero-intro-logo__text">Medical Care · Aesthetics</span>
                </div>
              </div>
            )}

            {/* Nav overlay — center links only */}
            <div className={`hero-nav${heroPhase !== 'done' ? ' hero-nav--hidden' : ' hero-nav--visible'}`}>
              <nav className="hero-nav__center">
                <a href="#" className="header__link" draggable={false} onClick={navAbout}>ABOUT US</a>
                <div
                  ref={dropdownRef}
                  className={`header__dropdown-wrap${dropdownOpen ? ' header__dropdown-wrap--open' : ''}`}
                >
                  <a href="#" className="header__link" draggable={false}
                     onClick={e => { e.preventDefault(); goTo('treatments') }}>
                    TREATMENTS
                  </a>
                  <div className="header__dropdown">
                    {TREATMENT_COLS.map(col => (
                      <div key={col.label} className="header__dropdown-col">
                        <span className="header__dropdown-label">{col.label}</span>
                        {col.items.map(item => (
                          <a
                            key={item.key}
                            href="#"
                            className="header__dropdown-item"
                            onClick={e => {
                              e.preventDefault()
                              selectTreatment(item.key)
                            }}
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
                <a href="#" className="header__link" draggable={false} onClick={nav('memberships')}>MEMBERSHIPS</a>
              </nav>
            </div>

            {/* Hero text — vertically centered, left side */}
            <div className={`hero-text${heroPhase !== 'done' ? ' hero-text--hidden' : ' hero-text--visible'}`}>
              <h1 className="hero-text__title">
                <span>Naturally</span>
                <RotatingHeroWord active={heroPhase === 'done'} />
              </h1>
              <div className="hero-text__sub">
                <span>30+ Years of Experience</span>
                <span>Thousands of Treatments Performed</span>
                <span className="hero-text__care-location">
                  <span>
                    <span className="hero-text__stars" aria-label="Five stars">★★★★★</span>
                    {' '}for Results &amp; Patient Care
                  </span>
                  <span className="hero-text__vertical-divider" aria-hidden="true" />
                  <span>Draper, Utah</span>
                </span>
              </div>
            </div>

            <div className={`hero-text__actions${heroPhase !== 'done' ? ' hero-text__actions--hidden' : ' hero-text__actions--visible'}`}>
              <a
                href="#"
                className="hero-text__book"
                aria-label="Book consultation"
                onClick={nav('booking')}
              >
                <svg className="hero-text__book-fill" viewBox="0 0 220 54" aria-hidden="true">
                  <defs>
                    <mask id="hero-book-mask" maskUnits="userSpaceOnUse">
                      <rect width="220" height="54" rx="27" fill="#fff" />
                      <text x="110" y="28" textAnchor="middle" dominantBaseline="middle" fill="#000">
                        Book Consultation
                      </text>
                    </mask>
                  </defs>
                  <rect width="220" height="54" rx="27" fill="#fff" mask="url(#hero-book-mask)" />
                </svg>
                <svg className="hero-text__book-outline" viewBox="0 0 220 54" aria-hidden="true">
                  <rect x="1" y="1" width="218" height="52" rx="26" fill="none" stroke="#fff" strokeWidth="2" />
                  <text x="110" y="28" textAnchor="middle" dominantBaseline="middle" fill="#fff">
                    Book Consultation
                  </text>
                </svg>
              </a>
              <button
                type="button"
                className="hero-text__results"
                onClick={() => goTo('results')}
              >
                <span className="hero-text__results-label">Real Results</span>
                <span className="hero-text__results-icon" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </button>
            </div>
      </section>

      {page === 'about' && (
        <AboutPage
          onResults={() => goTo('results')}
          onTreatments={() => goTo('treatments')}
        />
      )}
      {page === 'results' && (
        <ResultsPage
          onBook={() => goTo('booking')}
          onGallery={() => goTo('gallery')}
        />
      )}
      {page === 'gallery' && (
        <GalleryPage />
      )}
      {page === 'treatments' && (
        <TreatmentsDirectory columns={TREATMENT_COLS} onSelect={selectTreatment} />
      )}
      {page === 'memberships' && <Memberships onScrollTo={el => lenisRef.current?.scrollTo(el)} />}
      {page === 'booking' && <BookingPage />}

      {page.startsWith('tx:') && (
        <TreatmentPage
          key={page}
          treatmentKey={page.slice(3)}
          onBook={() => goTo('booking')}
          onBrowse={() => goTo('treatments')}
        />
      )}

      {page !== 'home' && (
        <SiteMenuButton
          onClick={() => setMenuOpen(current => !current)}
          theme={menuTheme}
          open={menuOpen}
        />
      )}

      {/* Mobile-only hero content: instead of a hamburger button that
          opens the menu, the phone hero simply *is* the menu — same
          logo, links and footer, same size and position, just rendered
          in white directly over the video. Desktop/tablet never show
          this (see .site-menu--hero in SiteMenu.css). */}
      {heroActive && (
        <SiteMenu
          variant="hero"
          open={heroPhase === 'done'}
          onHome={returnToHero}
          onAbout={() => goTo('about')}
          onTreatments={() => goTo('treatments')}
          onMemberships={() => goTo('memberships')}
          onResults={() => goTo('results')}
          onGallery={() => goTo('gallery')}
          onContact={() => goTo('booking')}
        />
      )}

      <SiteMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onHome={returnToHero}
        onAbout={() => goTo('about')}
        onTreatments={() => goTo('treatments')}
        onMemberships={() => goTo('memberships')}
        onResults={() => goTo('results')}
        onGallery={() => goTo('gallery')}
        onContact={() => goTo('booking')}
      />
    </>
  )
}
