import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { afterTransitions } from './PageTransition'

gsap.registerPlugin(SplitText, ScrollTrigger)

// Each word comes up out of a blur, one after another, the first time the
// text's bottom edge reaches the bottom of the screen.
const REVEAL = {
  duration: 1.5, // Seconds per word
  stagger: 0.05, // Seconds between words
  blur: 'blur(10px)',
  start: 'bottom bottom',
}

/* Renders `as` (an h1, a p…) exactly as it would be, and reveals its words.
   Typography and layout are untouched: the words are split in place, hidden
   before first paint, and played in once the page is clear of any wipe. */
export default function RevealText({ as: Tag = 'p', children, ...props }) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const element = ref.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const split = SplitText.create(element, { type: 'words' })
    gsap.set(split.words, { autoAlpha: 0 })
    let tween = null
    let live = true

    afterTransitions().then(() => {
      if (!live) return
      tween = gsap.fromTo(split.words, { autoAlpha: 0, filter: REVEAL.blur }, {
        autoAlpha: 1,
        filter: 'blur(0px)',
        duration: REVEAL.duration,
        stagger: REVEAL.stagger,
        clearProps: 'filter',
        scrollTrigger: { trigger: element, start: REVEAL.start, once: true },
      })
    })

    return () => {
      live = false
      tween?.scrollTrigger?.kill()
      tween?.kill()
      split.revert()
    }
  }, [])

  return <Tag ref={ref} {...props}>{children}</Tag>
}
