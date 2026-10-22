import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, X } from 'lucide-react'
import { useEffect, useRef, type KeyboardEvent } from 'react'
import { serviceExamples } from './data/serviceExamples'

export default function ServicesGallery({ activeId, onUse, onClose }: {
  activeId: string
  onUse: (service: string, style: string) => void
  onClose: () => void
}) {
  const reducedMotion = useReducedMotion()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const service = serviceExamples.find((item) => item.serviceId === activeId)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (service && !dialog.open) dialog.showModal()
    if (!service && dialog.open) dialog.close()
  }, [service])

  function trapFocus(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key !== 'Tab') return
    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus()
    }
  }

  return <dialog id="service-gallery-modal" ref={dialogRef} className="service-gallery-modal" aria-labelledby="service-gallery-heading" onKeyDown={trapFocus} onCancel={onClose} onClose={onClose}>
    {service && <div className="service-gallery-dialog-content">
      <div className="service-gallery-heading">
        <div className="service-gallery-title"><span className="mini-overline">VISUAL DIRECTIONS <i>·</i> 04 CONCEPTS</span><h2 id="service-gallery-heading">Choose a <span>direction.</span></h2><p>Explore visual starting points for <strong>{service.service.toLowerCase()}</strong>. Choose one and carry it into your project brief.</p></div>
        <button type="button" className="gallery-close" aria-label="Close style examples" onClick={() => dialogRef.current?.close()}><X size={18} /></button>
      </div>
      <div className="service-photo-grid">
        {service.examples.map((item, index) => <motion.button type="button" className="service-photo-card" key={item.id} initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : .25, delay: reducedMotion ? 0 : index * .045 }} onClick={() => onUse(service.service, item.label)}>
          <span className="service-photo-wrap"><img src={item.image} alt="" loading="lazy" decoding="async" /><span className="service-photo-index">DIRECTION {String(index + 1).padStart(2, '0')}</span><span className="service-photo-placeholder">LOCAL ART PLACEHOLDER</span><span className="service-photo-action"><ArrowRight size={17} /></span></span>
          <span className="service-photo-caption"><strong>{item.label}</strong><small>{item.description}</small><span className="service-photo-select"><Check size={13} /> Use this direction</span></span>
        </motion.button>)}
      </div>
      <p className="service-gallery-note">These are locally generated concept placeholders. Final project visuals will be defined during discovery.</p>
    </div>}
  </dialog>
}
