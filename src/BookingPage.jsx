import ContactForm from './ContactForm'
import './BookingPage.css'

/* ── Inline SVG icons ──────────────────────────────────────────── */
const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
)

/* ── Reusable contact link with sliding icon ───────────────────── */
function ContactLink({ href, icon, children, ...props }) {
  return (
    <a href={href} className="contact-link booking-detail__value" {...props}>
      <span className="contact-link__slot" aria-hidden="true">
        <span className="contact-link__circle">{icon}</span>
      </span>
      <span className="contact-link__text">{children}</span>
    </a>
  )
}

export default function BookingPage() {
  return (
    <main className="booking-page" data-menu-theme="light">
      <div className="booking-inner">

        {/* ── Full-width header ── */}
        <div className="booking-header">
          <div className="booking-header__meta">
            <p className="booking-sub">Consultations in-person or virtual</p>
            <span className="booking-header__edition" aria-hidden="true">Draper · Utah</span>
          </div>
          <h1 className="booking-title">
            Let&apos;s begin with
            <em>a conversation.</em>
          </h1>
          <p className="booking-intro">
            Call, text, email, or message to book a free consultation or ask us anything.
          </p>
        </div>

        {/* ── Two-column body ── */}
        <div className="booking-grid">

          {/* LEFT: contact info + promo callout */}
          <div className="booking-left">
            <div className="booking-info">
              <div className="booking-detail">
                <span className="booking-detail__label">Phone</span>
                <ContactLink href="tel:8019878384" icon={<PhoneIcon />}>
                  801-987-8384
                </ContactLink>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Email</span>
                <ContactLink href="mailto:info@labelleviemedicalcare.com" icon={<MailIcon />}>
                  info@labelleviemedicalcare.com
                </ContactLink>
              </div>
              <div className="booking-detail">
                <span className="booking-detail__label">Address</span>
                <ContactLink
                  href="https://www.google.com/maps/place/La+Belle+Vie+Medical+Care+%26+Aesthetics/@40.5002038,-111.8856718,16z/data=!3m2!4b1!5s0x875280ca5769a3a1:0xee7a7bb289f576d3!4m6!3m5!1s0x875280ca562d37eb:0x462fa6321c6febc4!8m2!3d40.5001997!4d-111.8830969!16s%2Fg%2F11bbrjqph4?entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
                  icon={<LocationIcon />}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  248 E 13800 S Suite 3<br />Draper, Utah 84020
                </ContactLink>
              </div>
              <div className="booking-detail booking-detail--hours">
                <span className="booking-detail__label">Hours</span>
                <span className="booking-detail__value">
                  Monday – 9 AM–6 PM<br />
                  Tuesday – 9 AM–5 PM<br />
                  Wednesday – 9 AM–6 PM<br />
                  Thursday – 9 AM–5 PM<br />
                  Friday – 9 AM–3 PM
                </span>
              </div>
            </div>

            {/* Promo callout */}
            <div className="booking-promo">
              <p className="booking-promo__headline">$100 Off Your First Treatment</p>
              <p className="booking-promo__body">Ask About Our Current Specials &amp; Exclusive Offers</p>
            </div>
          </div>

          {/* RIGHT: golden form card */}
          <div className="booking-form-card">
            <div className="booking-form-card__heading">
              <span>CONNECT WITH US</span>
            </div>
            <ContactForm cardMode charLimit={500} submitLabel="SEND" />
          </div>

        </div>

        <div className="booking-policy">
          <a href="/no-show-policy.html" target="_blank" rel="noopener noreferrer">
            No Show &amp; Refund Policy
          </a>
        </div>
      </div>
    </main>
  )
}
