import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

type Panel = { x: number; y: number; w: number; h: number; hue: number; delay: number }
const panels: Panel[] = [
  { x: .12, y: .18, w: .23, h: .26, hue: 218, delay: .02 },
  { x: .39, y: .13, w: .2, h: .3, hue: 242, delay: .12 },
  { x: .63, y: .2, w: .25, h: .24, hue: 222, delay: .2 },
  { x: .2, y: .53, w: .2, h: .25, hue: 236, delay: .29 },
  { x: .44, y: .51, w: .25, h: .29, hue: 218, delay: .38 },
  { x: .74, y: .53, w: .16, h: .24, hue: 246, delay: .47 },
]

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value))
const ease = (value: number) => { const t = clamp(value); return t * t * (3 - 2 * t) }

function drawScene(canvas: HTMLCanvasElement, progress: number, reduced: boolean) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  const w = canvas.width
  const h = canvas.height
  const mobile = w < 760
  const p = reduced ? .78 : progress
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = '#0A0F24'
  ctx.fillRect(0, 0, w, h)

  const aura = ctx.createRadialGradient(w * .58, h * .48, 0, w * .58, h * .48, Math.max(w, h) * .7)
  aura.addColorStop(0, 'rgba(51, 69, 164, .34)')
  aura.addColorStop(.46, 'rgba(36, 48, 118, .14)')
  aura.addColorStop(1, 'rgba(10, 15, 36, 0)')
  ctx.fillStyle = aura; ctx.fillRect(0, 0, w, h)

  const points = Array.from({ length: mobile ? 23 : 42 }, (_, i) => ({
    x: (.06 + ((i * 37) % 89) / 100) * w,
    y: (.08 + ((i * 61 + 13) % 83) / 100) * h,
    phase: (i * .127) % 1,
  }))
  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const a = points[i]; const b = points[j]
      const distance = Math.hypot(a.x - b.x, a.y - b.y)
      const threshold = mobile ? 100 : 145
      if (distance > threshold) continue
      ctx.strokeStyle = `rgba(112, 143, 255, ${(1 - distance / threshold) * (.08 + ease(p * 1.3) * .2)})`
      ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
    }
  }
  points.forEach((point, i) => {
    const pulse = .5 + .5 * Math.sin(p * Math.PI * 4 + point.phase * Math.PI * 2)
    const r = i % 9 === 0 ? 2.6 : 1.4
    ctx.beginPath(); ctx.arc(point.x, point.y, r * 4, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(107, 130, 255, ${.04 + pulse * .075})`; ctx.fill()
    ctx.beginPath(); ctx.arc(point.x, point.y, r, 0, Math.PI * 2)
    ctx.fillStyle = i % 5 === 0 ? '#c4b8ff' : '#83aaff'; ctx.fill()
  })

  const traces = [
    { color: '#4f8cff', y: .35, bend: -.2, phase: .06 },
    { color: '#8871ff', y: .64, bend: .17, phase: .34 },
    { color: '#50c4ff', y: .48, bend: -.12, phase: .68 },
  ]
  traces.forEach((trace) => {
    const gradient = ctx.createLinearGradient(0, 0, w, h)
    gradient.addColorStop(0, 'rgba(74, 125, 255, 0)')
    gradient.addColorStop(.4, `${trace.color}66`)
    gradient.addColorStop(.7, `${trace.color}a8`)
    gradient.addColorStop(1, 'rgba(142, 111, 255, 0)')
    ctx.beginPath(); ctx.moveTo(-w * .1, h * (trace.y + trace.bend))
    ctx.bezierCurveTo(w * .25, h * trace.y, w * .65, h * (trace.y + trace.bend), w * 1.1, h * trace.y)
    ctx.strokeStyle = gradient; ctx.lineWidth = mobile ? 1.2 : 1.8
    ctx.globalAlpha = .17 + ease(p * 1.3) * .48; ctx.stroke(); ctx.globalAlpha = 1
    const t = (p * .82 + trace.phase) % 1
    const x = t * w
    const y = h * (trace.y + trace.bend * (1 - 4 * (t - .5) ** 2))
    const halo = ctx.createRadialGradient(x, y, 0, x, y, mobile ? 30 : 48)
    halo.addColorStop(0, `${trace.color}94`); halo.addColorStop(1, `${trace.color}00`)
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(x, y, mobile ? 30 : 48, 0, Math.PI * 2); ctx.fill()
  })

  panels.forEach((panel, index) => {
    const t = reduced ? 1 : ease((p * 1.16 - panel.delay) / .64)
    const px = (panel.x + (1 - t) * (index % 2 ? .13 : -.12)) * w
    const py = (panel.y - (1 - t) * .2) * h
    const pw = panel.w * w; const ph = panel.h * h
    ctx.save(); ctx.globalAlpha = .07 + t * .72
    ctx.translate(px + pw / 2, py + ph / 2); ctx.scale(.8 + t * .2, .8 + t * .2); ctx.translate(-pw / 2, -ph / 2)
    const glass = ctx.createLinearGradient(0, 0, pw, ph)
    glass.addColorStop(0, `hsla(${panel.hue}, 76%, 68%, .17)`); glass.addColorStop(1, 'rgba(117, 137, 255, .035)')
    ctx.fillStyle = glass; ctx.beginPath(); ctx.roundRect(0, 0, pw, ph, Math.min(16, w * .018)); ctx.fill()
    ctx.strokeStyle = `hsla(${panel.hue}, 92%, 82%, ${.17 + t * .25})`; ctx.lineWidth = 1; ctx.stroke()
    // Blank interface geometry keeps the artwork free of text and logos.
    ctx.fillStyle = 'rgba(174, 194, 255, .22)'; ctx.beginPath(); ctx.roundRect(pw * .08, ph * .12, pw * .19, Math.max(2, ph * .018), 2); ctx.fill()
    ctx.fillStyle = `hsla(${panel.hue}, 100%, 78%, .12)`; ctx.beginPath(); ctx.roundRect(pw * .08, ph * .23, pw * .84, ph * .46, 5); ctx.fill()
    ctx.strokeStyle = 'rgba(190, 205, 255, .16)'; ctx.beginPath(); ctx.moveTo(pw * .08, ph * .77); ctx.lineTo(pw * .54, ph * .77); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(pw * .08, ph * .85); ctx.lineTo(pw * .36, ph * .85); ctx.stroke(); ctx.restore()
  })

  const shade = ctx.createLinearGradient(0, 0, w, 0)
  shade.addColorStop(0, 'rgba(10, 15, 36, .81)'); shade.addColorStop(.44, 'rgba(10, 15, 36, .26)'); shade.addColorStop(1, 'rgba(10, 15, 36, .12)')
  ctx.fillStyle = shade; ctx.fillRect(0, 0, w, h)
}

export default function ScrollDrivenVisual() {
  const sectionRef = useRef<HTMLElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reducedMotion = useReducedMotion()

  useGSAP(() => {
    const section = sectionRef.current
    const canvas = canvasRef.current
    const visual = visualRef.current
    if (!section || !canvas || !visual) return

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 760 ? 1 : 1.5)
      canvas.width = Math.max(1, Math.round(rect.width * dpr))
      canvas.height = Math.max(1, Math.round(rect.height * dpr))
      drawScene(canvas, .78, Boolean(reducedMotion))
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    if (reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set('.visual-copy-block', { autoAlpha: 0, y: 0 })
      gsap.set('.visual-copy-block:first-child', { autoAlpha: 1 })
      return () => observer.disconnect()
    }

    const state = { progress: 0 }
    const blocks = gsap.utils.toArray<HTMLElement>('.visual-copy-block', section)
    const timeline = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        pin: visual,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
    timeline.to(state, { progress: 1, duration: 1, onUpdate: () => drawScene(canvas, state.progress, false) }, 0)
    blocks.forEach((block, index) => {
      const enter = .04 + index * .31
      timeline.fromTo(block, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .055, ease: 'power2.out' }, enter)
      timeline.to(block, { autoAlpha: 0, y: -16, duration: .055, ease: 'power2.in' }, enter + .2)
    })

    return () => observer.disconnect()
  }, { scope: sectionRef, dependencies: [reducedMotion], revertOnUpdate: true })

  return <section ref={sectionRef} className={`scroll-visual-section${reducedMotion ? ' reduced-motion-static' : ''}`} aria-label="How Nexora brings intelligent systems together">
    <div ref={visualRef} className="scroll-visual-sticky">
      <canvas ref={canvasRef} className="scroll-visual-canvas" aria-hidden="true" />
      <div className="scroll-visual-vignette" aria-hidden="true" />
      <div className="scroll-visual-copy" aria-live="off">
        <div className="visual-copy-block"><span className="visual-overline">A SYSTEM TAKING SHAPE <i>01 / 03</i></span><h2>Intelligence that finds its place.</h2><p>Good tools make the moving parts feel connected, clear, and ready for what comes next.</p></div>
        <div className="visual-copy-block"><span className="visual-overline">CONNECTED BY DESIGN <i>02 / 03</i></span><h2>Make every step work together.</h2><p>Bring people, processes, and technology into one thoughtful flow—with people still in control.</p></div>
        <div className="visual-copy-block"><span className="visual-overline">BUILT AROUND YOUR WORK <i>03 / 03</i></span><h2>A platform shaped around what matters.</h2><p>Start with the real challenge. Then build a system that earns its place in the day-to-day.</p></div>
      </div>
      <span className="visual-scroll-mark" aria-hidden="true"><span /> SCROLL TO ASSEMBLE</span>
    </div>
  </section>
}
