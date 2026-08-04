import { useEffect, useRef } from 'react'
import './SiteMenu.css'

const REVIEW_URL = 'https://www.google.com/search?q=labelleviemedicalcare+utah&oq=labelleviemedicalcare+utah&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MggIARBFGCcYOzIKCAIQABiABBiiBDIHCAMQABjvBTIHCAQQABjvBTIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBCDY0NzVqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x875280ca562d37eb:0x462fa6321c6febc4,1,,,,'

const MAIN_LINKS = [
  ['About Us', 'onAbout'],
  ['Treatments', 'onTreatments'],
  ['Real Results', 'onResults'],
  ['Get In Touch', 'onContact'],
]

const SECONDARY_LINKS = [
  ['Memberships', 'onMemberships', null],
  ['Full Gallery', 'onGallery', null],
  ['Leave Review', null, REVIEW_URL],
]

export function SiteMenuButton({ onClick, theme = 'light', open = false, className = '' }) {
  const resolvedTheme = theme === 'dark' ? 'dark' : 'light'

  return (
    <button
      className={`site-menu-button site-menu-button--${resolvedTheme}${open ? ' site-menu-button--open' : ''}${className ? ` ${className}` : ''}`}
      type="button"
      onClick={onClick}
      aria-label={open ? 'Close site menu' : 'Open site menu'}
      aria-expanded={open}
    >
      <span className="site-menu-button__text">{open ? 'Close' : 'Menu'}</span>
      <span className="site-menu-button__cross" aria-hidden="true">
        <span />
        <span />
      </span>
    </button>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export default function SiteMenu({
  open,
  onClose,
  onHome,
  onAbout,
  onTreatments,
  onMemberships,
  onResults,
  onGallery,
  onContact,
  variant,
}) {
  const isHero = variant === 'hero'
  const panelRef = useRef(null)

  useEffect(() => {
    if (isHero) return undefined
    if (!open) return undefined

    const handleKeyDown = event => {
      if (event.key === 'Escape') onClose?.()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    requestAnimationFrame(() => panelRef.current?.focus({ preventScroll: true }))

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose, isHero])

  const callbacks = {
    onAbout,
    onTreatments,
    onMemberships,
    onResults,
    onGallery,
    onContact,
  }

  const activateLink = (callbackName, url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
      return
    }
    callbacks[callbackName]?.()
  }

  return (
    <div
      className={`site-menu${open ? ' site-menu--open' : ''}${isHero ? ' site-menu--hero' : ''}`}
      aria-hidden={isHero ? undefined : !open}
      onMouseDown={isHero ? undefined : event => {
        if (event.target === event.currentTarget) onClose?.()
      }}
    >
      <aside
        ref={panelRef}
        className="site-menu__panel"
        role={isHero ? undefined : 'dialog'}
        aria-modal={isHero ? undefined : true}
        aria-label={isHero ? undefined : 'Site menu'}
        tabIndex={-1}
      >
        <button className="site-menu__logo-button" type="button" onClick={onHome} aria-label="Go to home page">
          <img className="site-menu__logo" src="/lbvlogo.png" alt="La Belle Vie" draggable={false} />
          <span className="site-menu__logo-caption">Medical Care · Aesthetics</span>
        </button>

        <nav className="site-menu__nav" aria-label="Main navigation">
          <div className="site-menu__nav-main">
            {MAIN_LINKS.map(([label, callbackName]) => (
              <button
                className="site-menu__nav-link"
                key={label}
                type="button"
                onClick={() => activateLink(callbackName, null)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="site-menu__nav-secondary">
            {SECONDARY_LINKS.map(([label, callbackName, url]) => (
              <button
                className="site-menu__nav-link site-menu__nav-link--secondary"
                key={label}
                type="button"
                onClick={() => activateLink(callbackName, url)}
              >
                {label}
              </button>
            ))}
          </div>
        </nav>

        <div className="site-menu__footer">
          <div className="site-menu__legal">
            <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
            <a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms</a>
            <a href="https://areni.digital" target="_blank" rel="noopener noreferrer">Site by Areni</a>
          </div>

          <div className="site-menu__socials" aria-label="Social media">
            <a
              href="https://www.instagram.com/utahaesthetics_labellevie/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Belle Vie on Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href="https://www.facebook.com/labelleviemedicalcare"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="La Belle Vie on Facebook"
            >
              <FacebookIcon />
            </a>
          </div>

          <small className="site-menu__copyright">
            © 2026 La Belle Vie. All rights reserved.
          </small>
        </div>
      </aside>
    </div>
  )
}
