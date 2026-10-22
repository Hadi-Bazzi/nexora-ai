import { lazy, Suspense, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import ProjectBuilder from './ProjectBuilder'
import AssistantWidget from './AssistantWidget'
import { submitInquiry } from './inquiries'
import ServicesGallery from './ServicesGallery'
import WorkflowShowcase from './WorkflowShowcase'
import HeroBackground from './HeroBackground'
import DeferredScrollVisual from './DeferredScrollVisual'
import {
  ArrowDown, ArrowRight, ArrowUpRight, Bot, Boxes, BrainCircuit, Check, CircleHelp,
  Code2, Cpu, Layers3, Menu, MessageSquareText, Orbit, Play, Send, ShieldCheck, Sparkles,
  Workflow, X, Zap,
} from 'lucide-react'

const ScrollRuntime = lazy(() => import('./ScrollRuntime'))
const SplitTextEnhancer = lazy(() => import('./SplitTextEnhancer'))

const services = [
  { icon: Code2, id: '01', title: 'Website development', text: 'Distinctive, fast websites made to earn attention and turn it into action.', tags: 'Websites · E-commerce · Web apps' },
  { icon: BrainCircuit, id: '02', title: 'AI-powered applications', text: 'Useful, intuitive products that put machine intelligence to work for real people.', tags: 'AI products · Data tools · Integrations' },
  { icon: Bot, id: '03', title: 'AI agents & automation', text: 'Helpful digital teammates that take on repetitive work and keep things moving.', tags: 'AI agents · Workflows · Support' },
  { icon: Layers3, id: '04', title: 'Custom software', text: 'Purpose-built platforms and internal tools, shaped around the way you work.', tags: 'Platforms · Internal tools · Systems' },
  { icon: Workflow, id: '05', title: 'Business process automation', text: 'Connect the steps, systems, and people behind smoother day-to-day operations.', tags: 'Operations · Integrations · Automations' },
  { icon: Orbit, id: '06', title: 'AI consulting & integration', text: 'A clear-eyed plan for where AI fits, how to adopt it, and what to build first.', tags: 'AI strategy · Prototyping · Enablement' },
]

const solutions = [
  { key: 'website', name: 'Website development', icon: Code2, fits: ['more-leads', 'modernize', 'sell-online'], preference: 'web', why: 'A clear, high-performing digital experience can help more of the right people find you and take the next step.', next: 'Outline the audience, content, and actions your website should support.' },
  { key: 'ai-app', name: 'AI-powered applications', icon: BrainCircuit, fits: ['use-ai', 'new-product'], preference: 'ai', why: 'Turn a promising AI use case into a useful product experience for your team or your customers.', next: 'Choose one recurring task or user need to explore in a discovery conversation.' },
  { key: 'agents', name: 'AI agents & automation', icon: Bot, fits: ['save-time', 'support'], preference: 'automation', why: 'Automate repeatable tasks and common questions while keeping people in control.', next: 'Map the steps people repeat and decide where a human should stay in the loop.' },
  { key: 'software', name: 'Custom software', icon: Layers3, fits: ['new-product', 'modernize'], preference: 'software', why: 'Build the platform or tool that matches how your business actually works.', next: 'Describe who will use the system and the key job it should help them do.' },
  { key: 'process', name: 'Business process automation', icon: Workflow, fits: ['save-time', 'connect-tools'], preference: 'automation', why: 'Connect disconnected tools and remove manual handoffs from everyday workflows.', next: 'List the tools involved and where information gets stuck between them.' },
  { key: 'consulting', name: 'AI consulting & integration', icon: Orbit, fits: ['use-ai', 'connect-tools'], preference: 'guidance', why: 'Find practical, secure ways to bring AI into your existing products and processes.', next: 'Start with your existing systems, data boundaries, and the problem you want to solve.' },
]

const approaches = [
  { id: 'web', label: 'Web or product design' },
  { id: 'ai', label: 'AI-powered features' },
  { id: 'automation', label: 'Automation' },
  { id: 'software', label: 'A custom system' },
  { id: 'guidance', label: 'Advice on where to start' },
]

const needs = [
  { id: 'more-leads', label: 'Bring in more of the right customers', icon: ArrowUpRight },
  { id: 'save-time', label: 'Give my team time back', icon: Zap },
  { id: 'use-ai', label: 'Put AI to practical use', icon: BrainCircuit },
  { id: 'modernize', label: 'Modernize an existing experience', icon: Cpu },
  { id: 'connect-tools', label: 'Connect our tools and workflows', icon: Workflow },
  { id: 'support', label: 'Improve customer support', icon: MessageSquareText },
  { id: 'sell-online', label: 'Build a better way to sell online', icon: Boxes },
  { id: 'new-product', label: 'Create a new digital product', icon: Sparkles },
]

const projects = [
  { number: '01', type: 'AI WORKFLOW · DEMONSTRATION', name: 'Northstar', title: 'A clearer view of every moving part.', focus: 'Workflow visibility', variant: 'northstar', icon: Orbit, image: undefined },
  { number: '02', type: 'DIGITAL PRODUCT · DEMONSTRATION', name: 'Commonplace', title: 'Better ideas, finding their people.', focus: 'Community platform', variant: 'commonplace', icon: Layers3, image: undefined },
  { number: '03', type: 'CUSTOM SOFTWARE · DEMONSTRATION', name: 'Meridian', title: 'A calmer rhythm for daily operations.', focus: 'Operations workspace', variant: 'meridian', icon: Workflow, image: undefined },
]

const posts = [
  { category: 'PRACTICAL AI', time: '6 MIN READ', title: 'Start with the work, not the model.', excerpt: 'A useful way to find the AI opportunities that matter to the people doing the work.', icon: BrainCircuit },
  { category: 'DIGITAL PRODUCTS', time: '5 MIN READ', title: 'The case for making fewer things, better.', excerpt: 'Why clarity, care, and a smaller surface area often make for a stronger product.', icon: Layers3 },
  { category: 'STUDIO NOTES', time: '4 MIN READ', title: 'Good collaboration is a design decision.', excerpt: 'The habits that make a complicated project feel like a team effort.', icon: MessageSquareText },
]

const processSteps = [
  { number: '01', title: 'Discover', description: 'Understand the people, goals, constraints, and opportunities around the challenge.', icon: CircleHelp },
  { number: '02', title: 'Plan', description: 'Shape a practical scope, priorities, and a shared definition of a good outcome.', icon: Layers3 },
  { number: '03', title: 'Design', description: 'Explore flows and prototypes early, making the experience clear before it gets complex.', icon: Sparkles },
  { number: '04', title: 'Develop', description: 'Build the product in thoughtful increments, sharing progress along the way.', icon: Code2 },
  { number: '05', title: 'Test', description: 'Check the details, accessibility, and edge cases with real-world use in mind.', icon: ShieldCheck },
  { number: '06', title: 'Deliver', description: 'Prepare the handoff, documentation, and next steps for a confident launch.', icon: ArrowUpRight },
]

type ContactFields = { name: string; email: string; message: string }
const initialContact: ContactFields = { name: '', email: '', message: '' }

function validEmail(email: string) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) }
function SectionLabel({ number, children, light = false }: { number: string; children: string; light?: boolean }) {
  return <div className={`section-label${light ? ' light' : ''}`}><span>{number} <i>—</i> {children}</span><span className="label-dot" /></div>
}

function App() {
  const prefersReducedMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([])
  const [selectedApproaches, setSelectedApproaches] = useState<string[]>([])
  const [contact, setContact] = useState<ContactFields>(initialContact)
  const [contactErrors, setContactErrors] = useState<Record<string, string>>({})
  const [contactSent, setContactSent] = useState(false)
  const [contactSubmitting, setContactSubmitting] = useState(false)
  const [contactSubmitError, setContactSubmitError] = useState('')
  const [activeGallery, setActiveGallery] = useState('')
  const [selectedProjectDirection, setSelectedProjectDirection] = useState('')

  function useServiceDirection(service: string, style: string) {
    setSelectedProjectDirection(`${service} — ${style}`)
    setActiveGallery('')
    document.getElementById('project-builder')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  const recommendations = solutions.map((solution) => ({ ...solution, score: selectedNeeds.filter((need) => solution.fits.includes(need)).length + (selectedApproaches.includes(solution.preference) ? 2 : 0) }))
    .filter((solution) => solution.score > 0).sort((a, b) => b.score - a.score).slice(0, 3)

  function toggleNeed(id: string) {
    setSelectedNeeds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }
  function toggleApproach(id: string) {
    setSelectedApproaches((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  }
  async function submitContact(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors: Record<string, string> = {}
    if (contact.name.trim().length < 2) errors.name = 'Please enter your name.'
    if (!validEmail(contact.email)) errors.email = 'Enter a valid email address.'
    if (contact.message.trim().length < 10) errors.message = 'Please share at least 10 characters so we have some context.'
    setContactErrors(errors)
    if (Object.keys(errors).length === 0) {
      setContactSubmitting(true)
      setContactSubmitError('')
      try {
        await submitInquiry({ kind: 'contact', ...contact })
        setContactSent(true)
      } catch (error) {
        setContactSubmitError(error instanceof Error ? error.message : 'We could not save your inquiry. Please try again.')
      } finally {
        setContactSubmitting(false)
      }
    }
  }

  return <div className="app-shell" id="top">
    <Suspense fallback={null}><ScrollRuntime /><SplitTextEnhancer /></Suspense>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Nexora AI & Tech home"><span className="brand-symbol"><span /></span><span className="brand-name">nexora<span>®</span><small>AI & TECH</small></span></a>
      <button className="mobile-menu-button" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>{menuOpen ? <X /> : <Menu />}</button>
      <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        <a href="#services" onClick={() => setMenuOpen(false)}>Services</a><a href="#solutions" onClick={() => setMenuOpen(false)}>Solutions</a><a href="#work" onClick={() => setMenuOpen(false)}>Our work</a><a href="#about" onClick={() => setMenuOpen(false)}>About</a><a href="#process" onClick={() => setMenuOpen(false)}>Process</a><a href="#journal" onClick={() => setMenuOpen(false)}>Insights</a>
        <a className="nav-cta" href="#project-builder" onClick={() => setMenuOpen(false)}>Start a project <ArrowUpRight size={15} /></a>
      </nav>
    </header>

    <main id="main">
      <section className="hero section-wrap" aria-labelledby="hero-title">
        <HeroBackground />
        <div className="hero-content">
          <motion.div className="eyebrow" initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : .55 }}><span className="eyebrow-mark"><Sparkles size={12} /></span> APPLIED INTELLIGENCE <span className="eyebrow-line" /> BUILT AROUND PEOPLE</motion.div>
          <motion.h1 id="hero-title" initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : .7, delay: prefersReducedMotion ? 0 : .08 }}>Make work move.<br /><span className="hero-accent">With intelligence.</span></motion.h1>
          <motion.p className="hero-lede" initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : .6, delay: prefersReducedMotion ? 0 : .18 }}>We turn complex work into clear, useful AI applications, capable agents, and connected systems—with people in control at every step.</motion.p>
          <motion.div className="hero-actions" initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: prefersReducedMotion ? 0 : .6, delay: prefersReducedMotion ? 0 : .27 }}><a className="button button-primary" href="#project-builder">Start Your Project <ArrowRight size={16} /></a><a className="button button-quiet" href="#solutions">Explore Our Solutions <ArrowDown size={15} /></a></motion.div>
          <motion.div className="hero-proof" initial={prefersReducedMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: prefersReducedMotion ? 0 : .65 }}><span className="hero-proof-mark"><ShieldCheck size={15} /></span><span>Practical by design.<br /><strong>Thoughtful in the details.</strong></span></motion.div>
        </div>
        <div className="hero-bottomline"><span>STRATEGY <i>·</i> DESIGN <i>·</i> ENGINEERING <i>·</i> INTELLIGENCE</span><a href="#services">SCROLL TO EXPLORE <ArrowDown size={13} /></a></div>
      </section>

      <DeferredScrollVisual />

      <section className="trust-band" aria-label="Our approach"><div className="trust-inner"><span>GOOD TECHNOLOGY SHOULD FEEL LIKE</span><strong>More clarity <b>✳</b></strong><strong>Less busywork <b>✳</b></strong><strong>Better momentum <b>✳</b></strong><strong>Room to grow</strong></div></section>

      <section className="services section-wrap" id="services">
        <SectionLabel number="01" >WHAT WE DO</SectionLabel>
        <div className="section-heading services-heading"><div><span className="mini-overline">THE RIGHT TOOL FOR THE REAL CHALLENGE</span><h2 className="split-heading">AI that fits the work.<br /><span>Technology that fits you.</span></h2></div><p>From a custom website to an AI workflow, we pair the right tools with careful engineering and a clear path to delivery.</p></div>
        <div className="service-grid">{services.map((service, index) => <motion.article className={`service-card${activeGallery === service.id ? ' is-active' : ''}`} key={service.id} initial={prefersReducedMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: prefersReducedMotion ? 0 : .45, delay: prefersReducedMotion ? 0 : index * .055 }}><div className="service-card-top"><span className="service-icon"><service.icon size={19} strokeWidth={1.6} /></span><span className="service-id">{service.id}</span></div><h3>{service.title}</h3><p>{service.text}</p><div className="service-card-bottom"><span>{service.tags}</span><a href="#service-examples" aria-label={`View photo examples for ${service.title}`} aria-expanded={activeGallery === service.id} onClick={(event) => { event.preventDefault(); const next = activeGallery === service.id ? '' : service.id; setActiveGallery(next); if (next) setTimeout(() => document.getElementById('service-examples')?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' }), 0) }}><ArrowUpRight size={16} /></a></div></motion.article>)}</div>
        <ServicesGallery activeId={activeGallery} onUse={useServiceDirection} onClose={() => setActiveGallery('')} />
        <WorkflowShowcase />
      </section>

      <section className="solutions section-wrap" id="solutions">
        <SectionLabel number="02" light>THE SOLUTIONS FINDER</SectionLabel>
        <div className="solutions-layout"><div className="solutions-intro"><span className="mini-overline">A GOOD FIRST QUESTION</span><h2 className="split-heading">What would you<br />love to make <span>easier?</span></h2><p>Choose whatever feels closest. We’ll connect the dots and suggest a practical place to start.</p><div className="solutions-footnote"><CircleHelp size={15} /><span>Not sure yet? Pick a couple. Most good projects start with a conversation.</span></div></div>
          <div className="finder-panel"><div className="finder-panel-heading"><span className="panel-step">01 <i>/</i> YOUR PRIORITIES</span><span className="panel-select-hint">SELECT ALL THAT APPLY</span></div><div className="need-grid">{needs.map((need) => { const active = selectedNeeds.includes(need.id); return <button type="button" className={`need-option${active ? ' active' : ''}`} key={need.id} aria-pressed={active} onClick={() => toggleNeed(need.id)}><span className="need-check">{active && <Check size={12} />}</span><need.icon size={16} /><span>{need.label}</span></button> })}</div>
            <div className="approach-picks"><span className="approach-label">PREFERRED APPROACH <i>· OPTIONAL</i></span><div>{approaches.map((approach) => <button type="button" key={approach.id} aria-pressed={selectedApproaches.includes(approach.id)} className={selectedApproaches.includes(approach.id) ? 'approach-chip selected' : 'approach-chip'} onClick={() => toggleApproach(approach.id)}>{approach.label}</button>)}</div></div>
            <div className="recommendations" aria-live="polite" aria-atomic="true"><div className="recommendations-heading"><span>YOUR STARTING POINT</span><span className="rec-spark"><Sparkles size={13} /></span></div>{recommendations.length === 0 ? <div className="rec-empty"><span className="rec-empty-icon"><ArrowUpRight size={17} /></span><p>Select a business priority or preferred approach to see practical recommendations.</p></div> : <AnimatePresence mode="wait"><motion.div className="rec-results" key={`${selectedNeeds.join(',')}:${selectedApproaches.join(',')}`} initial={prefersReducedMotion ? false : { opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={prefersReducedMotion ? undefined : { opacity: 0, y: -5 }} transition={{ duration: prefersReducedMotion ? 0 : .2 }}>{recommendations.map((item) => <div className="rec-item" key={item.key}><span className="rec-icon"><item.icon size={17} /></span><div><strong>{item.name}</strong><p>{item.why}</p><small className="rec-next-step"><b>GOOD NEXT STEP</b> {item.next}</small></div><a href="#project-builder" aria-label={`Discuss ${item.name}`}><ArrowRight size={15} /></a></div>)}</motion.div></AnimatePresence>}</div>
          </div>
        </div>
      </section>

      <section className="work section-wrap" id="work">
        <SectionLabel number="03">SELECTED WORK</SectionLabel>
        <div className="section-heading work-heading"><div><span className="mini-overline">CONCEPTS BUILT TO SHOW THE POSSIBILITIES</span><h2 className="split-heading">Ideas, with a little<br /><span>room to grow.</span></h2></div><p>These demonstration concepts show how strategy, design, and technology can come together around a real business need.</p></div>
        <div className="portfolio-grid">{projects.map((project, index) => <motion.article className="portfolio-card" key={project.name} initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: prefersReducedMotion ? 0 : .5, delay: prefersReducedMotion ? 0 : index * .08 }}><div className={`portfolio-art ${project.variant}${project.image ? ' has-photo' : ''}`}>{project.image && <img className="portfolio-photo" src={project.image} alt="" loading="lazy" />}<div className="art-photo-shade" /><div className="art-grain" /><div className="portfolio-art-top"><span>DEMONSTRATION CONCEPT <i>·</i> {project.number}</span><span className="art-open"><ArrowUpRight size={15} /></span></div><div className="portfolio-art-center"><div className="art-orbit"><span /><span /><span /><div className="art-emblem"><project.icon size={29} strokeWidth={1.2} /></div></div><span className="art-coordinates">NXR / {project.number} <i>—</i> 2026</span></div><div className="portfolio-art-bottom"><span>{project.name.toUpperCase()}</span><span>CONCEPT STUDY</span></div></div><div className="portfolio-info"><div className="portfolio-description"><span className="portfolio-type">{project.type}</span><h3>{project.title}</h3><a href="#project-builder" className="case-link">Explore the approach <ArrowUpRight size={14} /></a></div><div className="portfolio-focus"><span>CONCEPT FOCUS</span><strong>{project.focus}</strong></div></div></motion.article>)}</div>
        <p className="portfolio-disclaimer"><ShieldCheck size={14} /> All portfolio concepts are fictional demonstrations. No client results or performance claims are implied.</p>
      </section>

      <section className="about section-wrap" id="about">
        <SectionLabel number="04">WHY NEXORA</SectionLabel>
        <div className="about-layout"><div className="about-art"><div className="about-art-grid" /><div className="about-rings"><span /><span /><span /><div className="about-orb"><span>n.</span></div></div><span className="about-art-tag"><span className="live-dot" /> PEOPLE FIRST. ALWAYS.</span><span className="about-art-caption">PURPOSEFUL BY NATURE<br />PRACTICAL BY DESIGN</span></div><div className="about-copy"><span className="mini-overline">OUR POINT OF VIEW</span><h2>Make the complicated<br />feel <span>clear.</span></h2><p>Nexora exists to make good technology more useful to the people who rely on it. We pair thoughtful design with hands-on engineering and a healthy respect for the real-world details.</p><p>That means asking better questions before writing code, choosing tools for their fit, and making sure what we build can grow with the business behind it.</p><a className="text-link" href="#project-builder">Meet us where you are <ArrowRight size={15} /></a><div className="about-principles"><div><span>01</span><strong>People before process</strong></div><div><span>02</span><strong>Practical over performative</strong></div><div><span>03</span><strong>Clear thinking, careful craft</strong></div></div></div></div>
      </section>

      <section className="process section-wrap" id="process">
        <SectionLabel number="05">HOW WE WORK</SectionLabel>
        <div className="section-heading process-heading"><div><span className="mini-overline">A CLEAR PATH FROM QUESTION TO DELIVERY</span><h2>Make progress,<br /><span>one good step at a time.</span></h2></div><p>Small, visible steps keep the work grounded, collaborative, and easier to steer as we learn.</p></div>
        <ol className="process-list">{processSteps.map((step) => <li key={step.number} className="process-step"><span className="process-number">{step.number}</span><span className="process-icon"><step.icon size={17} /></span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol>
      </section>

      <section className="journal section-wrap" id="journal">
        <SectionLabel number="06">NOTES & PERSPECTIVES</SectionLabel>
        <div className="section-heading journal-heading"><div><span className="mini-overline">A FEW IDEAS WORTH SHARING</span><h2>Thinking out loud<span>.</span></h2></div><a className="text-link" href="#contact">More insights coming soon <ArrowRight size={15} /></a></div>
        <div className="journal-grid">{posts.map((post, index) => <motion.article className="journal-card" key={post.title} initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .25 }} transition={{ duration: prefersReducedMotion ? 0 : .35, delay: prefersReducedMotion ? 0 : index * .07 }}><div className={`journal-art journal-art-${index + 1}`}><span className="journal-icon"><post.icon size={22} strokeWidth={1.4} /></span><span className="journal-art-number">FIELD NOTE 0{index + 1}</span><span className="journal-art-glow" /></div><div className="journal-meta"><span>{post.category}</span><span>{post.time}</span></div><h3>{post.title}</h3><p>{post.excerpt}</p><span className="sample-label"><Play size={11} /> SAMPLE ARTICLE · EDITORIAL PLACEHOLDER</span></motion.article>)}</div>
      </section>

      <section className="project-builder section-wrap" id="project-builder">
        <SectionLabel number="07" light>THE PROJECT BUILDER</SectionLabel>
        <div className="builder-layout"><div className="builder-intro"><span className="mini-overline">A LITTLE CONTEXT GOES A LONG WAY</span><h2>Let’s build<br />a <span>good start.</span></h2><p>Share a few details and shape a first project brief. You can change your mind at any step.</p><div className="builder-promise"><span className="promise-icon"><ShieldCheck size={16} /></span><span><strong>Private inquiry flow.</strong><br />The secure API saves submissions when Supabase is configured. No email is sent yet.</span></div><div className="builder-progress-note"><span>PROJECT BRIEF BUILDER</span><span>ABOUT 2 MINUTES <ArrowRight size={12} /></span></div></div>
          <ProjectBuilder key={selectedProjectDirection} initialType={selectedProjectDirection} /></div>
      </section>

      <section className="contact section-wrap" id="contact">
        <SectionLabel number="08">SAY HELLO</SectionLabel>
        <div className="contact-layout"><div className="contact-copy"><span className="mini-overline">A GOOD PROJECT STARTS SOMEWHERE</span><h2>Let’s talk about<br />what’s <span>possible.</span></h2><p>Tell us what you’re thinking. Big plan, tiny question, or somewhere in between — there’s a place for it here.</p><div className="contact-placeholder"><span className="contact-placeholder-icon"><MessageSquareText size={17} /></span><span><strong>INQUIRIES & GENERAL HELLOS</strong><small>Contact details will be added here.</small></span></div></div>
          <form className="contact-form" onSubmit={submitContact} noValidate><span className="form-overline">A QUICK NOTE TO THE STUDIO</span>{contactSent ? <div className="contact-success" role="status"><span className="success-icon"><Check size={20} /></span><h3>Thanks for the note.</h3><p>Your inquiry was saved securely. No email or notification is sent automatically yet.</p><button type="button" className="text-link" onClick={() => { setContact(initialContact); setContactSent(false); setContactSubmitError('') }}>Write another note <ArrowRight size={14} /></button></div> : <><label className="field-label" htmlFor="contact-name">Your name</label><input id="contact-name" type="text" autoComplete="name" placeholder="Name" value={contact.name} onChange={(event) => { setContact({ ...contact, name: event.target.value }); setContactErrors({ ...contactErrors, name: '' }) }} aria-invalid={Boolean(contactErrors.name)} />{contactErrors.name && <span className="field-error" role="alert">{contactErrors.name}</span>}<label className="field-label" htmlFor="contact-email">Email address</label><input id="contact-email" type="email" autoComplete="email" placeholder="name@company.com" value={contact.email} onChange={(event) => { setContact({ ...contact, email: event.target.value }); setContactErrors({ ...contactErrors, email: '' }) }} aria-invalid={Boolean(contactErrors.email)} />{contactErrors.email && <span className="field-error" role="alert">{contactErrors.email}</span>}<label className="field-label" htmlFor="contact-message">What’s on your mind?</label><textarea id="contact-message" rows={3} maxLength={1000} placeholder="A little context is always welcome…" value={contact.message} onChange={(event) => { setContact({ ...contact, message: event.target.value }); setContactErrors({ ...contactErrors, message: '' }) }} aria-invalid={Boolean(contactErrors.message)} />{contactErrors.message && <span className="field-error" role="alert">{contactErrors.message}</span>}{contactSubmitError && <span className="field-error" role="alert">{contactSubmitError}</span>}<button className="button button-primary contact-submit" type="submit" disabled={contactSubmitting}>{contactSubmitting ? 'Saving inquiry…' : 'Send inquiry'} <Send size={14} /></button><p className="no-send-notice"><ShieldCheck size={13} /> Submissions use the inquiry API and require Supabase setup. No email is sent yet.</p></>}</form>
        </div>
      </section>
    </main>

    <footer className="site-footer"><div className="footer-main"><div className="footer-brand-column"><a className="brand" href="#top" aria-label="Nexora AI & Tech home"><span className="brand-symbol"><span /></span><span className="brand-name">nexora<span>®</span><small>AI & TECH</small></span></a><p>Human-first technology<br />for what’s next.</p><span className="footer-location">INDEPENDENT DIGITAL STUDIO<br />LOCATION & CONTACT DETAILS COMING SOON</span></div><div className="footer-link-column"><span className="footer-heading">EXPLORE</span><a href="#services">Services</a><a href="#solutions">Solutions finder</a><a href="#work">Demonstrations</a><a href="#about">About Nexora</a><a href="#process">How we work</a><a href="#journal">Insights</a></div><div className="footer-link-column"><span className="footer-heading">WHAT WE DO</span>{services.map((service) => <a href="#services" key={service.id}>{service.title}</a>)}</div><div className="footer-link-column footer-connect"><span className="footer-heading">FIND US ELSEWHERE</span><a href="#contact">LinkedIn <ArrowUpRight size={12} /></a><a href="#contact">Instagram <ArrowUpRight size={12} /></a><a href="#contact">Behance <ArrowUpRight size={12} /></a><span className="footer-social-note">Social profiles will be linked here.</span></div></div><div className="footer-bottom"><span>© 2026 NEXORA AI & TECH</span><span>MADE WITH INTENTION <Sparkles size={11} /></span><a href="#top">BACK TO TOP ↑</a><span>NO TRACKERS. NO EXTERNAL APIS.</span></div></footer>
    <AssistantWidget />
  </div>
}

export default App
