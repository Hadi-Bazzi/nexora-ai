import { useReducedMotion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/** Staggered, accessible section-heading reveals using the Split Text pattern from React Bits. */
export default function SplitTextEnhancer() {
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const headings = gsap.utils.toArray<HTMLElement>('.split-heading, .about-copy h2, .process-heading h2, .journal-heading h2, .builder-intro h2, .contact-copy h2')
    const splits = headings.map((heading) => {
      const original = heading.textContent?.trim() ?? ''
      heading.setAttribute('aria-label', original)
      return SplitText.create(heading, {
        type: 'words, chars',
        aria: 'auto',
        wordsClass: 'split-word',
        charsClass: 'split-char',
        onSplit: (split) => gsap.from(split.chars, {
          autoAlpha: 0,
          yPercent: 65,
          duration: .65,
          stagger: .012,
          ease: 'power3.out',
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: heading, start: 'top 88%', once: true },
        }),
      })
    })

    return () => splits.forEach((split) => split.revert())
  }, { dependencies: [reducedMotion], revertOnUpdate: true })

  return null
}
