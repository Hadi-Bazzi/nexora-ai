import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { submitInquiry } from './inquiries'
import { ArrowLeft, ArrowRight, Check, ChevronDown, ShieldCheck } from 'lucide-react'

type Brief = {
  type: string
  goals: string
  features: string[]
  contactPreference: string
  name: string
  email: string
  company: string
  budget: string
  timing: string
}

const emptyBrief: Brief = { type: '', goals: '', features: [], contactPreference: '', name: '', email: '', company: '', budget: '', timing: '' }
const types = ['Website or web app', 'AI-powered application', 'AI agent or automation', 'Custom software', 'Business process automation', 'AI consulting & integration', 'I need help deciding']
const features = ['Customer or team portal', 'AI assistant or search', 'Workflow automation', 'Payments or checkout', 'Reports and dashboards', 'Connect existing tools', 'I need help deciding']
const contactMethods = ['Email conversation', 'Phone call', 'Video call', 'No preference yet']
const emailIsValid = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

export default function ProjectBuilder({ initialType = '' }: { initialType?: string }) {
  const prefersReducedMotion = useReducedMotion()
  const [step, setStep] = useState(0)
  const [brief, setBrief] = useState<Brief>(() => ({ ...emptyBrief, type: initialType }))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [complete, setComplete] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function update<K extends keyof Brief>(key: K, value: Brief[K]) {
    setBrief((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: '' }))
  }

  function toggleFeature(feature: string) {
    update('features', brief.features.includes(feature) ? brief.features.filter((item) => item !== feature) : [...brief.features, feature])
  }

  async function nextStep() {
    const nextErrors: Record<string, string> = {}
    if (step === 0) {
      if (!brief.type) nextErrors.type = 'Choose a service and visual direction, or choose “I need help deciding”.'
      if (brief.goals.trim().length < 15) nextErrors.goals = 'Add a few more details (at least 15 characters).'
    } else if (step === 1) {
      if (brief.features.length === 0) nextErrors.features = 'Choose at least one feature, or choose "I need help deciding".'
      if (!brief.contactPreference) nextErrors.contactPreference = 'Choose a preferred way to discuss the project.'
    } else if (step === 2) {
      if (brief.name.trim().length < 2) nextErrors.name = 'Please enter your name.'
      if (!emailIsValid(brief.email)) nextErrors.email = 'Enter a valid email address.'
    }
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    if (step < 3) setStep((current) => current + 1)
    else {
      setSubmitting(true)
      setSubmitError('')
      try {
        await submitInquiry({
          kind: 'project', name: brief.name, email: brief.email, company: brief.company,
          message: brief.goals, project_type: brief.type, features: brief.features,
          contact_preference: brief.contactPreference, budget: brief.budget, timing: brief.timing,
        })
        setComplete(true)
      } catch (error) {
        setSubmitError(error instanceof Error ? error.message : 'We could not save your project request. Please try again.')
      } finally {
        setSubmitting(false)
      }
    }
  }

  function restart() {
    setBrief({ ...emptyBrief, type: initialType })
    setErrors({})
    setStep(0)
    setComplete(false)
    setSubmitError('')
  }

  const motionProps = prefersReducedMotion
    ? { initial: false as const, animate: { opacity: 1, x: 0, y: 0 }, exit: undefined, transition: { duration: 0 } }
    : { initial: { opacity: 0, x: 8 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -8 }, transition: { duration: .22 } }

  return <div className="builder-form-shell"><AnimatePresence mode="wait">{complete
    ? <motion.div className="form-success" key="success" {...motionProps}>
      <span className="success-icon"><Check size={22} /></span><span className="form-overline">REQUEST RECEIVED</span><h3>Your project request is saved.</h3>
      <p>Your project request was saved to the Nexora inquiry database. No email is sent automatically yet.</p>
      <button className="form-secondary-button" type="button" onClick={restart}>Start another brief <ArrowRight size={14} /></button>
    </motion.div>
    : <motion.div className="builder-form" key={step} {...motionProps}>
      <div className="form-topline"><span className="form-overline">YOUR PROJECT, IN A FEW STEPS</span><span className="form-count">0{step + 1} <i>/</i> 04</span></div>
      <div className="step-progress" role="progressbar" aria-label="Project brief progress" aria-valuemin={1} aria-valuemax={4} aria-valuenow={step + 1}>{[0, 1, 2, 3].map((item) => <span className={item <= step ? 'filled' : ''} key={item} />)}</div>

      {step === 0 && <>
        <h3>What are you looking to make happen?</h3><p className="step-help">Start with the business need that is top of mind.</p>
        {initialType && <p className="selected-style-note"><Check size={12} /> Starting direction from examples: <strong>{initialType}</strong></p>}
        <fieldset className="form-fieldset"><legend className="field-label">Project type</legend><div className="project-needs">{types.map((item) => <button key={item} type="button" className={`project-choice${brief.type === item ? ' selected' : ''}`} aria-pressed={brief.type === item} onClick={() => update('type', item)}><span className="choice-dot">{brief.type === item && <span />}</span>{item}</button>)}</div>{errors.type && <span className="field-error" role="alert">{errors.type}</span>}</fieldset>
        <label className="field-label" htmlFor="brief-goals">Business goals and challenge</label><textarea id="brief-goals" rows={3} maxLength={500} placeholder="What is happening today, and what would better look like?" value={brief.goals} onChange={(event) => update('goals', event.target.value)} aria-invalid={Boolean(errors.goals)} />{errors.goals && <span className="field-error" role="alert">{errors.goals}</span>}
      </>}

      {step === 1 && <>
        <h3>What should the solution help you do?</h3><p className="step-help">Choose desired features. You can change these later.</p>
        <fieldset className="form-fieldset"><legend className="field-label">Features you're considering</legend><div className="project-needs">{[...features, 'I need help deciding'].map((item) => { const active = brief.features.includes(item); return <button key={item} type="button" className={`project-choice${active ? ' selected' : ''}`} aria-pressed={active} onClick={() => toggleFeature(item)}><span className="choice-check">{active && <Check size={11} />}</span>{item}</button> })}</div>{errors.features && <span className="field-error" role="alert">{errors.features}</span>}</fieldset>
        <label className="field-label" htmlFor="brief-contact-method">How would you prefer to discuss the project?</label><div className="select-wrap"><select id="brief-contact-method" value={brief.contactPreference} onChange={(event) => update('contactPreference', event.target.value)} aria-invalid={Boolean(errors.contactPreference)}><option value="">Choose a preference</option>{contactMethods.map((method) => <option key={method}>{method}</option>)}</select><ChevronDown size={15} /></div>{errors.contactPreference && <span className="field-error" role="alert">{errors.contactPreference}</span>}
      </>}

      {step === 2 && <>
        <h3>Who should we put the brief under?</h3><p className="step-help">Just the basics so this project has a name.</p>
        <label className="field-label" htmlFor="brief-name">Your name</label><input id="brief-name" type="text" autoComplete="name" placeholder="Name" value={brief.name} onChange={(event) => update('name', event.target.value)} aria-invalid={Boolean(errors.name)} />{errors.name && <span className="field-error" role="alert">{errors.name}</span>}
        <label className="field-label" htmlFor="brief-email">Email address</label><input id="brief-email" type="email" autoComplete="email" placeholder="name@company.com" value={brief.email} onChange={(event) => update('email', event.target.value)} aria-invalid={Boolean(errors.email)} />{errors.email && <span className="field-error" role="alert">{errors.email}</span>}
        <label className="field-label" htmlFor="brief-company">Company <span className="optional-label">OPTIONAL</span></label><input id="brief-company" type="text" autoComplete="organization" placeholder="Your company" value={brief.company} onChange={(event) => update('company', event.target.value)} />
        <div className="form-select-row"><label><span className="field-label">Approximate budget <span className="optional-label">OPTIONAL</span></span><div className="select-wrap"><select value={brief.budget} onChange={(event) => update('budget', event.target.value)} aria-label="Approximate budget"><option value="">Choose a range</option><option>Under $5,000</option><option>$5,000 - $15,000</option><option>$15,000 - $40,000</option><option>$40,000+</option><option>Let's talk it through</option></select><ChevronDown size={15} /></div></label><label><span className="field-label">Preferred timing <span className="optional-label">OPTIONAL</span></span><div className="select-wrap"><select value={brief.timing} onChange={(event) => update('timing', event.target.value)} aria-label="Preferred timing"><option value="">Select a timeframe</option><option>As soon as we're aligned</option><option>Within the next month</option><option>In 1-3 months</option><option>Still planning</option></select><ChevronDown size={15} /></div></label></div>
      </>}

      {step === 3 && <>
        <h3>Review your project brief.</h3><p className="step-help">Go back to edit anything before securely submitting your request.</p>
        <div className="brief-review"><div><span>PROJECT TYPE & GOALS</span><button type="button" onClick={() => setStep(0)}>EDIT</button><strong>{brief.type}</strong><p>{brief.goals}</p></div><div><span>FEATURES & CONTACT PREFERENCE</span><button type="button" onClick={() => setStep(1)}>EDIT</button><strong>{brief.features.join(', ')}</strong><p>Preferred discussion: {brief.contactPreference}</p></div><div><span>YOUR DETAILS</span><button type="button" onClick={() => setStep(2)}>EDIT</button><strong>{brief.name} · {brief.email}</strong><p>{brief.company || 'Company not provided'} · {brief.budget || 'Budget not provided'} · {brief.timing || 'Timing not provided'}</p></div></div>
        <p className="review-disclaimer"><ShieldCheck size={13} /> Your request will be stored securely. No email is sent yet.</p>
      </>}

      {submitError && <p className="field-error" role="alert">{submitError}</p>}
      <div className="form-actions">{step > 0 ? <button className="back-button" type="button" onClick={() => { setErrors({}); setStep((current) => current - 1) }} disabled={submitting}><ArrowLeft size={15} aria-hidden="true" /> Back</button> : <span className="form-footnote">No pressure to have it all figured out.</span>}<button className="button button-primary" type="button" onClick={nextStep} disabled={submitting}>{submitting ? 'Saving request...' : step === 3 ? 'Submit project request' : 'Next step'} {step === 3 ? <Check size={15} /> : <ArrowRight size={15} />}</button></div>
      <p className="no-send-notice"><ShieldCheck size={13} /> The secure API saves your brief when Supabase is configured. No email is sent yet.</p>
    </motion.div>}
  </AnimatePresence></div>
}
