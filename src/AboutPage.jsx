import { ArrowUpRight } from 'lucide-react'
import rawReviews from '../reviews?raw'
import './AboutPage.css'

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/search?q=labelleviemedicalcare+utah&oq=labelleviemedicalcare+utah&gs_lcrp=EgZjaHJvbWUqBggAEEUYOzIGCAAQRRg7MggIARBFGCcYOzIKCAIQABiABBiiBDIHCAMQABjvBTIHCAQQABjvBTIGCAUQRRg8MgYIBhBFGDwyBggHEEUYPNIBCDY0NzVqMGo3qAIAsAIA&sourceid=chrome&source=chrome.ob&ie=UTF-8#lrd=0x875280ca562d37eb:0x462fa6321c6febc4,1,,,,'

const DATE_RE =
  /^(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}$/

const REVIEWS = rawReviews
  .trim()
  .split(/\n{2,}/)
  .map(block => {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean)
    const clean = lines.filter(line => !/google$/i.test(line))
    if (!clean.length) return null
    const name = clean[0]
    const body = clean.slice(1).filter(line => !DATE_RE.test(line))
    const text = body
      .join(' ')
      .replace(/\s*I?Read\s+(?:more|less)\s*$/i, '...')
      .trim()
    return text ? { name, text } : null
  })
  .filter(Boolean)

// Mobile: split reviews in half so each of the two marquees gets its own set
const REVIEWS_MID = Math.ceil(REVIEWS.length / 2)
const REVIEWS_A = REVIEWS.slice(0, REVIEWS_MID)   // top marquee (reversed)
const REVIEWS_B = REVIEWS.slice(REVIEWS_MID)       // bottom marquee (forward)

const TEAM = [
  { img: '/kelly.webp', name: 'Kelly Lance', role: 'MSN, APRN, FNP-C' },
  {
    img: '/mackenzie.webp',
    name: 'MacKenzie Stewart',
    role: 'Master Esthetician\nCoolSculpting Specialist',
  },
  { img: '/rylan.webp', name: 'Rylan Baum', role: 'Master Esthetician' },
]

function ReviewCard({ name, text }) {
  return (
    <article className="about-page__review-card">
      <div className="about-page__review-heading">
        <span className="about-page__review-name">{name}</span>
        <span className="about-page__review-stars" aria-label="Five stars">★★★★★</span>
      </div>
      <p className="about-page__review-text">{text}</p>
    </article>
  )
}

function MarqueeRow({ items, reverse = false }) {
  const doubled = [...items, ...items]
  const trackClass = reverse
    ? 'about-page__marquee-track about-page__marquee-track--right'
    : 'about-page__marquee-track about-page__marquee-track--left'

  return (
    <div className="about-page__marquee" aria-label="Patient reviews">
      <div className={trackClass}>
        {doubled.map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} {...review} />
        ))}
      </div>
    </div>
  )
}

function ActionButton({ children, onClick }) {
  return (
    <button type="button" className="about-page__action" onClick={onClick}>
      <span className="about-page__action-label">{children}</span>
      <span className="about-page__action-icon" aria-hidden="true">
        <ArrowUpRight />
      </span>
    </button>
  )
}

export default function AboutPage({ onResults, onTreatments }) {
  return (
    <main className="about-page" data-menu-theme="light">
      <section className="about-page__opening" aria-labelledby="about-page-statement">
        {/* Mobile-only: reversed marquee (first half) above the text */}
        <div className="about-page__opening-marquee" aria-hidden="true">
          <MarqueeRow items={REVIEWS_A} reverse />
        </div>
        <div className="about-page__statement-wrap">
          <h1 id="about-page-statement" className="about-page__statement">
            <span className="about-page__statement-primary">
              Aesthetic<br />
              medicine<br />
              delivered with<br />
              decades of<br />
              <em>experience &amp;</em>
            </span>
            <em className="about-page__statement-final">warm, passionate service.</em>
          </h1>
        </div>
      </section>

      <section className="about-page__reviews-band" aria-label="Patient reviews">
        {/* Desktop: full reviews list, forward direction */}
        <div className="about-page__reviews-variant about-page__reviews-variant--desktop">
          <MarqueeRow items={REVIEWS} />
        </div>
        {/* Mobile: second half only, forward direction (below text) */}
        <div className="about-page__reviews-variant about-page__reviews-variant--mobile">
          <MarqueeRow items={REVIEWS_B} />
        </div>
        <div className="about-page__reviews-band-link">
          <a
            className="about-page__reviews-link"
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/google.png" alt="Google" className="about-page__reviews-google-icon" aria-hidden="true" draggable={false} decoding="async" />
            See Reviews <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
      </section>

      {/* Team wrapper — provides the scroll range for sticky to work */}
      <div className="about-team-wrapper">
        <section className="about-page__team" aria-label="Our specialists">
          <header className="about-page__team-header">
            <p className="about-page__eyebrow">The people behind your care</p>
            <h2 className="about-page__specialists-heading">Meet the specialists</h2>
          </header>
          <div className="about-page__team-grid">
            {TEAM.map((member, index) => (
              <div key={member.name} className="about-page__team-card">
                <div className="about-page__team-portrait">
                  <img src={member.img} alt={member.name} draggable={false} loading="lazy" decoding="async" />
                  <span className="about-page__team-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                </div>
                <div className="about-page__team-info">
                  <h3 className="about-page__team-name">{member.name}</h3>
                  <p className="about-page__team-role">
                    {member.role.split('\n').map((line, index) => (
                      <span key={line}>
                        {line}
                        {index < member.role.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Closing statement slides up over the team as you scroll */}
      <section className="about-page__footer" data-menu-theme="dark">
        <div className="about-page__footer-copy">
          <p className="about-page__bio">
            With over <span className="about-page__highlight">30 years of experience</span>, Kelly believes aesthetic treatments should leave you looking
            like yourself—<span className="about-page__highlight">naturally refreshed, never overdone</span>. Beyond beautiful results, we&apos;re proud
            to be known for our exceptional care, with reviews <span className="about-page__highlight">consistently praising how comfortable the experience is.</span>
          </p>
        </div>
        <div className="about-page__actions" aria-label="Explore La Belle Vie">
          <ActionButton onClick={onResults}>View Real Results</ActionButton>
          <ActionButton onClick={onTreatments}>Browse Treatments</ActionButton>
        </div>
      </section>
    </main>
  )
}
