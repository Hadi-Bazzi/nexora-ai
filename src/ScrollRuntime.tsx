import { useReducedMotion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export default function ScrollRuntime() {
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    if (reducedMotion) return

    const lenis = new Lenis({ autoRaf: false, anchors: true, smoothWheel: true })
    const updateScrollTrigger = () => ScrollTrigger.update()
    const tickLenis = (time: number) => lenis.raf(time * 1000)

    lenis.on('scroll', updateScrollTrigger)
    gsap.ticker.add(tickLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tickLenis)
      lenis.off('scroll', updateScrollTrigger)
      lenis.destroy()
    }
  }, { dependencies: [reducedMotion], revertOnUpdate: true })

  return null
}
