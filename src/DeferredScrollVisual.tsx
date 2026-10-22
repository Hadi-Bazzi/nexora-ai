import { lazy, Suspense, useEffect, useRef, useState, type RefObject } from 'react'
import { useReducedMotion } from 'framer-motion'

const ScrollDrivenVisual = lazy(() => import('./ScrollDrivenVisual'))

function StaticVisual({ sectionRef }: { sectionRef?: RefObject<HTMLElement | null> }) {
  return <section ref={sectionRef} className="scroll-visual-section scroll-visual-placeholder reduced-motion-static" aria-label="A connected intelligent system">
    <div className="scroll-visual-sticky">
      <div className="placeholder-network" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
      <div className="scroll-visual-vignette" aria-hidden="true" />
      <div className="scroll-visual-copy"><div className="visual-copy-block"><span className="visual-overline">A SYSTEM TAKING SHAPE <i>01 / 03</i></span><h2>Intelligence that finds its place.</h2><p>Good tools make the moving parts feel connected, clear, and ready for what comes next.</p></div></div>
    </div>
  </section>
}

export default function DeferredScrollVisual() {
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [nearViewport, setNearViewport] = useState(false)

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNearViewport(true)
        observer.disconnect()
      }
    }, { rootMargin: '600px 0px' })
    observer.observe(section)
    return () => observer.disconnect()
  }, [reducedMotion])

  if (reducedMotion) return <StaticVisual />
  if (!nearViewport) return <StaticVisual sectionRef={sectionRef} />
  return <Suspense fallback={<StaticVisual />}><ScrollDrivenVisual /></Suspense>
}
