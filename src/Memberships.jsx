import { useEffect, useRef } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import ContactForm from './ContactForm'
import './Memberships.css'

const TIERS = [
  {
    name: 'Silver',
    price: '$99',
    tone: 'silver',
    perks: [
      '$12 / Unit Neurotoxins',
      'Up to 10% off All Services',
      '10% off Fillers',
      '10% off Skin Care Products',
    ],
  },
  {
    name: 'Gold',
    price: '$149',
    tone: 'gold',
    featured: true,
    perks: [
      '$11 / Unit Neurotoxins',
      '15% off All Services',
      '15% off Fillers',
      '15% off Skin Care Products',
    ],
  },
  {
    name: 'Black',
    price: '$199',
    tone: 'black',
    dark: true,
    perks: [
      '$10 / Unit Neurotoxins',
      '20% off All Services',
      '20% off Fillers',
      '20% off Skin Care Products',
    ],
  },
  {
    name: 'Diamond',
    price: '$299',
    tone: 'diamond',
    perks: [
      '$9 / Unit Neurotoxins',
      '25% off All Services',
      '25% off Fillers',
      '25% off Skin Care Products',
    ],
  },
]

const HAIR_COLS = [
  [
    { area: 'Small Area',  price: '$55',  per: '/month' },
    { area: 'Medium Area', price: '$75',  per: '/month' },
  ],
  [
    { area: 'Large Area',       price: '$95',  per: '/month' },
    { area: 'Extra Large Area', price: '$125', per: '/month' },
  ],
  [
    { area: 'Full Body — Women', price: '$195', per: '/month', note: '24 months' },
    { area: 'Full Body — Men',   price: '$220', per: '/month', note: '24 months' },
  ],
]

const MAPS_URL = 'https://www.google.com/maps/place/La+Belle+Vie+Medical+Care+%26+Aesthetics/@40.5002038,-111.8856718,16z/data=!3m2!4b1!5s0x875280ca5769a3a1:0xee7a7bb289f576d3!4m6!3m5!1s0x875280ca562d37eb:0x462fa6321c6febc4!8m2!3d40.5001997!4d-111.8830969!16s%2Fg%2F11bbrjqph4?entry=ttu'

function MembershipContactLink({ href, icon: Icon, children, ...props }) {
  return (
    <a href={href} className="mem-contact-value mem-contact-link" {...props}>
      <span className="mem-contact-link__slot" aria-hidden="true">
        <span className="mem-contact-link__circle"><Icon /></span>
      </span>
      <span className="mem-contact-link__text">{children}</span>
    </a>
  )
}

export default function Memberships({ onScrollTo = () => {} }) {
  const contactRef = useRef(null)
  const innerRef = useRef(null)
  const scrollToContact = e => {
    e.preventDefault()
    if (contactRef.current) onScrollTo(contactRef.current)
  }

  useEffect(() => {
    let frame
    const updateAccent = () => {
      const shift = Math.min(window.scrollY * 0.035, 42)
      innerRef.current?.style.setProperty('--mem-accent-shift', `${shift}px`)
      frame = undefined
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateAccent)
    }
    updateAccent()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main className="mem-page" data-menu-theme="light">
      <div className="mem-inner" ref={innerRef}>
        <header className="mem-header">
          <div className="mem-header__title">
            <p className="mem-eyebrow">Elevated care, every month</p>
            <h1 className="mem-title">Memberships</h1>
          </div>
          <p className="mem-header__intro">
            Consistent care, preferred pricing, and a plan designed to make your best results
            easier to maintain.
          </p>
        </header>

        {/* Tier cards */}
        <div className="mem-tiers">
          {TIERS.map((t, index) => (
            <article
              key={t.name}
              className={[
                'mem-card',
                `mem-card--${t.tone}`,
                t.dark ? 'mem-card--dark' : '',
                t.featured ? 'mem-card--featured' : '',
              ].filter(Boolean).join(' ')}
            >
              <div className="mem-card__topline">
                <span className="mem-card__number">{String(index + 1).padStart(2, '0')}</span>
                {t.featured && <span className="mem-card__badge">Most Popular</span>}
              </div>
              <span className="mem-card__name">{t.name}</span>
              <div className="mem-card__price">
                <span className="mem-card__amount">{t.price}</span>
                <span className="mem-card__per">/month</span>
              </div>
              <div className="mem-card__divider" />
              <ul className="mem-card__perks">
                {t.perks.map(p => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a href="#mem-contact" className="mem-card__cta" onClick={scrollToContact}>
                <span>Get Started</span>
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          ))}
        </div>

        {/* Hair Removal */}
        <div className="mem-hair">
          <div className="mem-hair__heading">
            <div>
              <p className="mem-eyebrow">Membership pricing</p>
              <h2 className="mem-sub-title">Laser Hair Removal</h2>
            </div>
            <p className="mem-hair__intro">
              Simple monthly pricing for smooth, lasting results.
            </p>
          </div>
          <div className="mem-hair-cols">
            {HAIR_COLS.map((col, ci) => (
              <div key={ci} className="mem-hair-col">
                {col.map(r => (
                  <div key={r.area} className="mem-hair-card">
                    <div className="mem-hair-card__topline">
                      <span className="mem-hair-area">{r.area}</span>
                      <span className="mem-hair-index" aria-hidden="true">
                        {String(HAIR_COLS.slice(0, ci).flat().length + col.indexOf(r) + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="mem-hair-price-row">
                      <span className="mem-hair-price">
                        {r.price}<span className="mem-hair-per">{r.per}</span>
                      </span>
                      {r.note && <span className="mem-hair-note">({r.note})</span>}
                    </div>
                    <button
                      type="button"
                      className="mem-hair-card__cta"
                      onClick={scrollToContact}
                      aria-label={`Get started with ${r.area} laser hair removal`}
                    >
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Contact section */}
      <div
        id="mem-contact"
        ref={contactRef}
        className="mem-contact-section"
        data-menu-theme="light"
      >
        <div className="mem-contact-inner">
          <div className="mem-contact-heading">
            <p className="mem-eyebrow">Your membership begins here</p>
            <p className="mem-contact-intro">
              Call, text, email, or message us to learn more or sign up for a membership.
            </p>
          </div>
          <div className="mem-contact-layout">
            <div className="mem-contact-form-wrap">
              <ContactForm messagePlaceholder="Message" />
            </div>

            <div className="mem-contact-info">
              <div className="mem-contact-detail">
                <span className="mem-contact-label">Phone</span>
                <MembershipContactLink href="tel:8019878384" icon={Phone}>
                  801-987-8384
                </MembershipContactLink>
              </div>
              <div className="mem-contact-detail">
                <span className="mem-contact-label">Email</span>
                <MembershipContactLink href="mailto:info@labelleviemedicalcare.com" icon={Mail}>
                  info@labelleviemedicalcare.com
                </MembershipContactLink>
              </div>
              <div className="mem-contact-detail">
                <span className="mem-contact-label">Address</span>
                <MembershipContactLink
                  href={MAPS_URL}
                  icon={MapPin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  248 E 13800 S Suite 3<br />Draper, Utah 84020
                </MembershipContactLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
