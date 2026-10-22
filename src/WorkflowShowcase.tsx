import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Database, Inbox, ShieldCheck, Workflow } from 'lucide-react'

const stages = [
  {
    icon: Inbox,
    step: '01',
    eyebrow: 'CUSTOMER INTAKE',
    title: 'A visitor shares the brief',
    description: 'Contact and project forms collect the goals, selected service, features, and preferred follow-up in a structured way.',
    status: 'FRONTEND IMPLEMENTED',
    statusKind: 'ready',
  },
  {
    icon: ShieldCheck,
    step: '02',
    eyebrow: 'SERVER VALIDATION',
    title: 'The API checks each request',
    description: 'The server validates allowed fields, applies request limits, and returns a clear result. It never exposes a database secret to the browser.',
    status: 'API IMPLEMENTED',
    statusKind: 'ready',
  },
  {
    icon: Database,
    step: '03',
    eyebrow: 'PRIVATE STORAGE',
    title: 'Supabase stores the inquiry',
    description: 'The migration creates a private PostgreSQL table. Add the server environment values and apply the migration before real submissions can be stored.',
    status: 'CONFIGURATION REQUIRED',
    statusKind: 'setup',
  },
  {
    icon: Workflow,
    step: '04',
    eyebrow: 'FOLLOW-UP AUTOMATION',
    title: 'Route the next action',
    description: 'Email notifications, AI summaries, and CRM or n8n routing are future connections. They need a chosen destination and secure server credentials.',
    status: 'NOT CONNECTED',
    statusKind: 'future',
  },
] as const

const mapLabels = ['FORM', 'API', 'PRIVATE DB', 'ROUTING']

export default function WorkflowShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const reducedMotion = useReducedMotion()
  const activeStage = stages[activeIndex]
  const ActiveIcon = activeStage.icon

  return <section className="workflow-showcase" id="ai-showcase" aria-labelledby="workflow-showcase-title">
    <div className="workflow-showcase-heading">
      <span className="mini-overline">AI & AUTOMATION, IN PRACTICE</span>
      <h3 id="workflow-showcase-title">Good systems keep<br /><span>people in the loop.</span></h3>
      <p>Explore how a customer inquiry can move from a website form to a useful next step. Select a stage to see what is in place and what still needs configuration.</p>
    </div>

    <div className="workflow-showcase-layout">
      <div className="workflow-stage-list" role="group" aria-label="Inquiry workflow stages">
        {stages.map((stage, index) => {
          const StageIcon = stage.icon
          const selected = activeIndex === index
          return <button className={`workflow-stage${selected ? ' selected' : ''}`} type="button" key={stage.step} aria-pressed={selected} aria-controls="workflow-stage-detail" onClick={() => setActiveIndex(index)}>
            <span className="workflow-stage-icon"><StageIcon size={17} strokeWidth={1.7} /></span>
            <span className="workflow-stage-copy"><small>{stage.step} / {stage.eyebrow}</small><strong>{stage.title}</strong></span>
            <span className="workflow-stage-check" aria-hidden="true">{index < 2 ? <Check size={12} /> : <ArrowRight size={13} />}</span>
          </button>
        })}
      </div>

      <div className="workflow-canvas" aria-label="Interactive inquiry workflow demonstration">
        <img className="workflow-canvas-photo" src="/images/automation-studio.jpg" alt="Team reviewing a workflow together" loading="lazy" />
        <div className="workflow-canvas-shade" />
        <div className="workflow-canvas-top"><span><i /> INTERACTIVE EXPLAINER</span><span>NOT A LIVE SYSTEM</span></div>
        <div className="workflow-canvas-content" id="workflow-stage-detail" aria-live="polite" aria-atomic="true">
          <div className="workflow-system-map" aria-hidden="true">
            <svg viewBox="0 0 600 64" preserveAspectRatio="none">
              <defs><linearGradient id="workflow-map-thread"><stop stopColor="#71d7e7" /><stop offset=".55" stopColor="#90b9ff" /><stop offset="1" stopColor="#b99bff" /></linearGradient></defs>
              <path d="M75 29H525" className="workflow-map-track" />
              <motion.path d="M75 29H525" className="workflow-map-focus" initial={false} animate={{ strokeDashoffset: 450 - (activeIndex + 1) * 150 }} transition={{ duration: reducedMotion ? 0 : .32, ease: 'easeOut' }} />
            </svg>
            <div className="workflow-map-nodes">{stages.map((stage, index) => {
              const StageIcon = stage.icon
              return <div className={`workflow-map-node${index === activeIndex ? ' active' : ''}${index < 2 ? ' implemented' : ''}`} key={stage.step}>
                <span><StageIcon size={14} /></span>
                <small>{mapLabels[index]}</small>
              </div>
            })}</div>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div className="workflow-detail-card" key={activeStage.step} initial={reducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -5 }} transition={{ duration: reducedMotion ? 0 : .2 }}>
              <span className="workflow-detail-icon"><ActiveIcon size={19} /></span>
              <span className="workflow-detail-eyebrow">STEP {activeStage.step} <i>·</i> {activeStage.eyebrow}</span>
              <h4>{activeStage.title}</h4>
              <p>{activeStage.description}</p>
              <span className={`workflow-status ${activeStage.statusKind}`}>{activeStage.statusKind === 'ready' ? <Check size={12} /> : <i />} {activeStage.status}</span>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="workflow-canvas-footer"><span>PRIVATE BY DESIGN</span><span>VALIDATE <i>→</i> STORE <i>→</i> FOLLOW UP</span></div>
      </div>
    </div>

    <div className="workflow-showcase-footer"><span><ShieldCheck size={15} /> No live AI, email, or CRM connection is claimed here.</span><a className="text-link" href="#project-builder">Shape a project brief <ArrowRight size={14} /></a></div>
  </section>
}
