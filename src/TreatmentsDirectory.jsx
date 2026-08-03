import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import './TreatmentsDirectory.css'

const COL1 = ['Neurotoxins & Fillers', 'Laser & Aesthetics', 'Women\u2019s Health']
const COL2 = ['Skin & Body', 'Wellness & Medical', 'Men\u2019s Health']

/* object-position: X% = (crop_left / 42) × 100, for a 58:75 container with 4:3 source */
const CATEGORY_META = {
  'Neurotoxins & Fillers': { img: '/fillers.png',     pos: '50% 50%'   },
  'Skin & Body':           { img: '/bodyskin.png',    pos: '14.3% 50%' },
  'Laser & Aesthetics':    { img: '/laser.png',       pos: '23.8% 50%' },
  'Women\u2019s Health':   { img: '/womenhealth.png', pos: '100% 50%'  },
  'Men\u2019s Health':     { img: '/menhealth.png',   pos: '0% 50%'    },
  'Wellness & Medical':    { img: '/medical.png',     pos: '52.4% 50%' },
}

function CategoryTile({ column, index, onSelect, titleSide = 'left' }) {
  const meta = CATEGORY_META[column.label] ?? { img: '', pos: '50% 50%' }

  return (
    <section className={`treatments-directory__category treatments-directory__category--${titleSide}`}>
      <div className="treatments-directory__category-heading">
        <span className="treatments-directory__category-number">0{index + 1}</span>
        <h2 className="treatments-directory__category-title">{column.label}</h2>
      </div>
      <div className="treatments-directory__tile">
        <img
          className="treatments-directory__tile-img"
          src={meta.img}
          alt=""
          draggable="false"
          style={{ objectPosition: meta.pos }}
        />
        <div className="treatments-directory__tile-overlay" aria-hidden="true" />
        <span className="treatments-directory__tile-prompt" aria-hidden="true">
          Explore
          <ArrowUpRight />
        </span>
        <div className="treatments-directory__tile-items">
          {column.items.map(item => (
            <button
              className="treatments-directory__item"
              key={item.key}
              type="button"
              onClick={() => onSelect?.(item.key)}
            >
              <span>{item.name}</span>
              <ArrowUpRight aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function TreatmentsDirectory({ columns = [], onSelect }) {
  const byLabel = Object.fromEntries(columns.map(c => [c.label, c]))

  const col1Ref = useRef(null)
  const col2Ref = useRef(null)

  useEffect(() => {
    const grid = col1Ref.current?.parentElement
    if (!grid || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const rect = grid.getBoundingClientRect()
        const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
        const shift = Math.max(-34, Math.min(34, (progress - 0.5) * 68))
        if (col1Ref.current) col1Ref.current.style.transform = `translate3d(0, ${shift}px, 0)`
        if (col2Ref.current) col2Ref.current.style.transform = `translate3d(0, ${-shift}px, 0)`
        frame = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <main className="treatments-directory" data-menu-theme="light">
      <div className="treatments-directory__inner">
        <header className="treatments-directory__intro">
          <p className="treatments-directory__eyebrow">La Belle Vie · Treatment Menu</p>
          <h1 className="treatments-directory__title">
            Care, considered <em>beautifully.</em>
          </h1>
          <p className="treatments-directory__lede">
            Explore personalized aesthetic, medical, and wellness treatments designed around the life you want to live.
          </p>
        </header>
        <div className="treatments-directory__grid">
          <div className="treatments-directory__col" ref={col1Ref}>
            {COL1.map((label, index) => byLabel[label] && (
              <CategoryTile
                key={label}
                column={byLabel[label]}
                index={index * 2}
                onSelect={onSelect}
                titleSide="left"
              />
            ))}
          </div>
          <div className="treatments-directory__col treatments-directory__col--offset" ref={col2Ref}>
            {COL2.map((label, index) => byLabel[label] && (
              <CategoryTile
                key={label}
                column={byLabel[label]}
                index={index * 2 + 1}
                onSelect={onSelect}
                titleSide="right"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
