import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import rawReviews from '../reviews?raw'
import FlowerButton from './FlowerButton'
import GoldenBackdrop from './GoldenBackdrop'
import RevealText from './RevealText'
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

function MarqueeRow({ items }) {
  const doubled = [...items, ...items]
  return (
    <div className="about-page__marquee" aria-label="Patient reviews">
      <div className="about-page__marquee-track about-page__marquee-track--left">
        {doubled.map((review, index) => (
          <ReviewCard key={`${review.name}-${index}`} {...review} />
        ))}
      </div>
    </div>
  )
}

const REVIEW_ROWS = 3
const REVIEW_SWAP_MS = 2500

/* Three full-width reviews stacked one above the other, the whole set turning
   over on a timer rather than scrolling past. */
function ReviewStack({ items }) {
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const pages = Math.floor(items.length / REVIEW_ROWS)
    if (pages < 2) return
    const timer = setInterval(() => setPage(current => (current + 1) % pages), REVIEW_SWAP_MS)
    return () => clearInterval(timer)
  }, [items.length])

  return (
    <div className="about-page__review-stack" aria-label="Patient reviews">
      {Array.from({ length: REVIEW_ROWS }, (_, row) => {
        const review = items[(page * REVIEW_ROWS + row) % items.length]
        return (
          <ReviewCard key={`${row}-${review.name}-${page}`} {...review} />
        )
      })}
    </div>
  )
}

const PHONE_QUERY = '(max-width: 700px)'

function usePhone() {
  const [phone, setPhone] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(PHONE_QUERY)
    const sync = () => setPhone(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return phone
}

export default function AboutPage({ onResults, onTreatments }) {
  // The marquee doubles all 77 reviews, so render only the variant in use
  // rather than hiding one with CSS.
  const phone = usePhone()

  const statement = (
    <div className="about-page__statement-wrap">
      {/* On a phone the label belongs to the statement block rather than to
          the section, which keeps the section down to a single flex child. */}
      {phone ? <p className="about-page__opening-tag">Premiere Med Spa in Utah</p> : null}
      <RevealText as="h1" id="about-page-statement" className="about-page__statement">
        <span className="about-page__statement-primary">
          Aesthetic medicine<br />
          delivered with<br />
          decades of{' '}
          <em>experience &amp;</em>
        </span>
        <em className="about-page__statement-final">warm, passionate service.</em>
      </RevealText>
    </div>
  )

  return (
    <main className="about-page" data-menu-theme="light">
      <section className="about-page__opening" aria-labelledby="about-page-statement">
        {/* The framing around the statement is a desktop composition; a phone
            gets the statement on its own, as before. */}
        {phone ? statement : (
          <>
            <div className="about-page__opening-topline">
              <p className="about-page__opening-tag">Premiere Med Spa in Utah</p>
              <span className="about-page__opening-rule" aria-hidden="true" />
            </div>

            <div className="about-page__opening-body">{statement}</div>
          </>
        )}
      </section>

      <section className="about-page__reviews-band" aria-label="Patient reviews">
        {phone ? <ReviewStack items={REVIEWS} /> : <MarqueeRow items={REVIEWS} />}
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
            <RevealText as="h2" className="about-page__specialists-heading">
              Meet the<br />specialists
            </RevealText>
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
      <section className="about-page__footer has-golden-backdrop" data-menu-theme="dark">
        <GoldenBackdrop />
        <div className="about-page__footer-copy">
          <RevealText className="about-page__bio">
            With over <span className="about-page__highlight">30 years of experience</span>, Kelly believes aesthetic treatments should leave you looking
            like yourself—<span className="about-page__highlight">naturally refreshed, never overdone</span>. Beyond beautiful results, we&apos;re proud
            to be known for our exceptional care, with reviews <span className="about-page__highlight">consistently praising how comfortable the experience is.</span>
          </RevealText>
        </div>
        <div className="about-page__actions" aria-label="Explore La Belle Vie">
          <FlowerButton className="about-page__button" onClick={onResults}>View Real Results</FlowerButton>
          <FlowerButton className="about-page__button" onClick={onTreatments}>Browse Treatments</FlowerButton>
        </div>
      </section>
    </main>
  )
}
