import { useCallback, useEffect, useRef, useState } from 'react'
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
import SiteIntro from './SiteIntro'
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
    }, 10000)

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
  // intro    — opening screen up, logo writing itself on
  // entering — opening screen sliding away, hero video rolling
  // settling — hero content fading in behind the tail of the slide
  // done     — opening screen unmounted
  const [heroPhase, setHeroPhase]     = useState('intro')
  const [heroVideoStarted, setHeroVideoStarted] = useState(false)
  const [heroVideoComplete, setHeroVideoComplete] = useState(false)
  const [dockOpen, setDockOpen] = useState(false)
  const [phone, setPhone] = useState(false)
  const dropdownRef  = useRef(null)
  const lenisRef     = useRef(null)
  const skipHeroIntroRef = useRef(false)
  const heroIntroPlayedRef = useRef(false)
  const enteringRef  = useRef(false)
  const enterTimersRef = useRef([])

  // Phones show the menu button over the hero; wider screens use the hero nav.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)')
    const sync = () => {
      setPhone(mq.matches)
      // A dock left open at desktop width would otherwise keep the phone
      // hero's copy hidden behind a panel phones never show.
      if (mq.matches) setDockOpen(false)
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    // Portrait lock: works on Android Chrome; silently ignored on iOS Safari.
    if (window.matchMedia('(max-width: 640px)').matches) {
      screen.orientation?.lock?.('portrait').catch(() => {})
    }
  }, [])

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
      enteringRef.current = true
      setHeroPhase('done')
      setHeroVideoStarted(true)
      return
    }
    // SiteIntro holds the opening screen for a beat and then calls
    // enterHero() itself; that's what starts the video.
    enteringRef.current = false
    setHeroPhase('intro')
    setHeroVideoStarted(false)
    return () => {
      enterTimersRef.current.forEach(clearTimeout)
      enterTimersRef.current = []
    }
  }, [page])

  // The hero doesn't scroll, so the scroll gesture is spent on the menu
  // instead: on desktop it lifts the dock over the bottom of the video, and
  // on phones — which have no dock — it opens the full menu.
  useEffect(() => {
    if (page !== 'home' || heroPhase !== 'done' || menuOpen) return
    let touchOrigin = null

    const reveal = () => {
      if (phone) setMenuOpen(true)
      else setDockOpen(true)
    }
    const dismiss = () => {
      if (!phone) setDockOpen(false)
    }

    const onWheel = event => {
      if (event.deltaY > 6) reveal()
      else if (event.deltaY < -6) dismiss()
    }
    const onTouchStart = event => {
      touchOrigin = event.touches[0]?.clientY ?? null
    }
    const onTouchMove = event => {
      if (touchOrigin === null) return
      const travelled = touchOrigin - (event.touches[0]?.clientY ?? touchOrigin)
      // Far enough that a tap or a stray finger can't trigger it.
      if (travelled > 28) {
        touchOrigin = null
        reveal()
      } else if (travelled < -28) {
        touchOrigin = null
        dismiss()
      }
    }
    // Keyboards get the same reach as the wheel; space is left alone so it
    // keeps activating whichever hero control has focus.
    const onKeyDown = event => {
      if (event.key === 'ArrowDown' || event.key === 'PageDown') reveal()
      else if (event.key === 'ArrowUp' || event.key === 'PageUp') dismiss()
    }

    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [page, heroPhase, phone, menuOpen])

  const enterHero = useCallback(() => {
    if (enteringRef.current) return
    enteringRef.current = true
    setHeroPhase('entering')
    setHeroVideoStarted(true)
    enterTimersRef.current = [
      // Hero content comes up while the last of the white is still leaving,
      // so it settles into place instead of popping in afterwards.
      setTimeout(() => setHeroPhase('settling'), 950),
      // Just past the 1500ms slide, so the panel is never unmounted mid-move.
      setTimeout(() => {
        setHeroPhase('done')
        heroIntroPlayedRef.current = true
      }, 1600),
    ]
  }, [])

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
    setDockOpen(false)
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
  // Hero chrome shows from "settling" on — i.e. once the opening screen is
  // most of the way out rather than fully gone.
  const heroReady = heroPhase === 'settling' || heroPhase === 'done'
  const heroDrift = !heroActive || heroPhase === 'done'
    ? ''
    : heroPhase === 'intro' ? ' hero--intro-wait' : ' hero--intro-move'
  const heroDocked = heroActive && dockOpen ? ' hero--docked' : ''

  return (
    <>
      {/* ── Hero: video + nav overlay + hero text ─────────────────
          Kept mounted (rather than unmounted per-page) so the video
          element never has to re-fetch/re-decode when navigating back
          to the hero — that reload was the source of the black flash. */}
      <section
        className={`hero${heroActive ? '' : ' hero--inactive'}${heroDrift}${heroDocked}`}
        aria-hidden={!heroActive}
        data-menu-theme="dark"
      >
        {/* Plays once; the decoded video itself remains on its final frame. */}
        <HeroVideo
          complete={heroVideoComplete}
          shouldPlay={heroVideoStarted}
          isVisible={heroActive}
          onComplete={() => setHeroVideoComplete(true)}
        />

            {/* Nav overlay — center links only */}
            <div className={`hero-nav${heroReady ? ' hero-nav--visible' : ' hero-nav--hidden'}`}>
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
            <div className={`hero-text${heroReady ? ' hero-text--visible' : ' hero-text--hidden'}`}>
              <h1 className="hero-text__title">
                <span>Naturally</span>
                <RotatingHeroWord active={heroReady} />
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

            {/* Phone-only mark in the top-left corner. */}
            <span className={`hero-mobile-logo${heroReady ? ' hero-mobile-logo--visible' : ''}`} aria-hidden="true" />

            {/* Takes the place of the hero's copy while the dock is up. */}
            <span className="hero-dock-mark">
              <span className="hero-dock-mark__logo" role="img" aria-label="La Belle Vie" />
              <span className="hero-dock-mark__caption">Medical Care · Aesthetics</span>
            </span>

            <div className={`hero-text__actions${heroReady ? ' hero-text__actions--visible' : ' hero-text__actions--hidden'}`}>
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

      {/* Hidden over the desktop hero, which carries its own nav. Phones have
          no hero nav, so the button stays; it also has to come back whenever
          the menu is open, or there'd be no way to close it. */}
      {(page !== 'home' || menuOpen || phone) && (
        <SiteMenuButton
          onClick={() => setMenuOpen(current => !current)}
          theme={menuTheme}
          open={menuOpen}
          className={[
            page === 'home' && !menuOpen ? 'site-menu-button--hero' : '',
            // Over the phone hero the control waits for the intro to hand
            // over, fading in alongside the headline.
            phone && page === 'home' && !heroReady ? 'site-menu-button--waiting' : '',
          ].filter(Boolean).join(' ')}
        />
      )}

      {heroActive && heroPhase !== 'done' && (
        <SiteIntro leaving={heroPhase !== 'intro'} onEnter={enterHero} />
      )}

      {/* Scrolling the desktop hero brings this up over its bottom third. */}
      {heroActive && !phone && (
        <SiteMenu
          variant="dock"
          open={dockOpen}
          onClose={() => setDockOpen(false)}
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
