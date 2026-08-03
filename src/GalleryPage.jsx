import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import './GalleryPage.css'

const GALLERY_CATEGORY_ORDER = ['threads', 'injectables', 'coolsculpting', 'microneedling']

const GALLERY_ITEMS = [
  { id: 1, treatment: 'Hyaluronic Acid, Radiesse, Jeuveau', category: 'injectables' },
  { id: 2, treatment: 'Profound — 1 Treatment, Radiesse, Jeuveau', category: 'injectables' },
  { id: 3, treatment: 'Hyaluronic Acid, Radiesse, Jeuveau', category: 'injectables' },
  { id: 4, treatment: 'Hyaluronic Acid', category: 'injectables' },
  { id: 5, treatment: 'Radiesse', category: 'injectables' },
  { id: 6, treatment: 'Radiesse', category: 'injectables' },
  { id: 7, treatment: 'Hyaluronic Acid: Radiesse', category: 'injectables' },
  { id: 8, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 9, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 10, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 11, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 12, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 13, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 14, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 15, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 16, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 17, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 18, treatment: 'Hyaluronic Acid: Restylane, Versa, Juvéderm', category: 'injectables' },
  { id: 19, treatment: 'PDO Threads', category: 'threads' },
  { id: 20, treatment: 'PDO Threads', category: 'threads' },
  { id: 21, treatment: 'PDO Threads', category: 'threads' },
  { id: 22, treatment: 'PDO Threads', category: 'threads' },
  { id: 23, treatment: 'PDO Threads', category: 'threads' },
  { id: 24, treatment: 'PDO Threads', category: 'threads' },
  { id: 25, treatment: 'PDO Threads', category: 'threads' },
  { id: 26, treatment: 'CoolSculpting', category: 'coolsculpting' },
  { id: 27, treatment: 'CoolSculpting', category: 'coolsculpting' },
  { id: 28, treatment: 'Microneedling', category: 'microneedling' },
  { id: 29, treatment: 'Microneedling', category: 'microneedling' },
  { id: 30, treatment: 'Hyperdiluted Radiesse', category: 'injectables' },
]
  .map(item => ({ ...item, src: `/beforeafters/ba${item.id}.jpg` }))
  .sort((a, b) => GALLERY_CATEGORY_ORDER.indexOf(a.category) - GALLERY_CATEGORY_ORDER.indexOf(b.category))

const FILTERS = [
  ['all', 'All Results'],
  ['injectables', 'Injectables'],
  ['threads', 'PDO Threads'],
  ['coolsculpting', 'CoolSculpting'],
  ['microneedling', 'Microneedling'],
]

export default function GalleryPage() {
  const [filter, setFilter] = useState('all')
  const [selectedId, setSelectedId] = useState(null)

  const visibleItems = useMemo(
    () => filter === 'all' ? GALLERY_ITEMS : GALLERY_ITEMS.filter(item => item.category === filter),
    [filter],
  )
  const selected = visibleItems.find(item => item.id === selectedId) ?? null
  const selectedPosition = selected ? visibleItems.findIndex(item => item.id === selected.id) + 1 : 0

  const moveSelection = direction => {
    if (!selected) return
    const currentIndex = visibleItems.findIndex(item => item.id === selected.id)
    const nextIndex = (currentIndex + direction + visibleItems.length) % visibleItems.length
    setSelectedId(visibleItems[nextIndex].id)
  }

  useEffect(() => {
    if (!selected) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = event => {
      if (event.key === 'Escape') setSelectedId(null)
      if (event.key === 'ArrowLeft') moveSelection(-1)
      if (event.key === 'ArrowRight') moveSelection(1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  })

  return (
    <main className="gallery-page" data-menu-theme="light">
      <section className="gallery-content" aria-label="Before and after gallery">
        <div className="gallery-filters" aria-label="Filter gallery by treatment">
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              className={filter === value ? 'gallery-filter gallery-filter--active' : 'gallery-filter'}
              type="button"
              aria-pressed={filter === value}
              onClick={() => {
                setFilter(value)
                setSelectedId(null)
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item, index) => (
            <figure className="gallery-card" key={item.id}>
              <button
                className="gallery-card__image-button"
                type="button"
                onClick={() => setSelectedId(item.id)}
                aria-label={`Open result ${index + 1}: ${item.treatment}`}
              >
                <img
                  src={item.src}
                  alt={`Before and after result for ${item.treatment}`}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  decoding="async"
                  draggable={false}
                />
              </button>
              <figcaption>
                <span className="gallery-card__number">{String(index + 1).padStart(2, '0')}</span>
                <span className="gallery-card__label">Treatment</span>
                <span className="gallery-card__treatment">{item.treatment}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {selected && (
        <div
          className="gallery-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Result ${selected.id}: ${selected.treatment}`}
          onMouseDown={event => {
            const clickedImageOrArrow = event.target.closest?.(
              '.gallery-lightbox__figure img, .gallery-lightbox__nav',
            )
            if (!clickedImageOrArrow) setSelectedId(null)
          }}
        >
          <button className="gallery-lightbox__close" type="button" onClick={() => setSelectedId(null)} aria-label="Close result">
            <X />
          </button>
          <button className="gallery-lightbox__nav gallery-lightbox__nav--prev" type="button" onClick={() => moveSelection(-1)} aria-label="Previous result">
            <ArrowLeft />
          </button>
          <figure className="gallery-lightbox__figure">
            <img src={selected.src} alt={`Before and after result for ${selected.treatment}`} draggable={false} />
            <figcaption>
              <span>{String(selectedPosition).padStart(2, '0')} / {String(visibleItems.length).padStart(2, '0')}</span>
              <span>Treatment · {selected.treatment}</span>
            </figcaption>
          </figure>
          <button className="gallery-lightbox__nav gallery-lightbox__nav--next" type="button" onClick={() => moveSelection(1)} aria-label="Next result">
            <ArrowRight />
          </button>
        </div>
      )}
    </main>
  )
}
