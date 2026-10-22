import { useEffect, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Bot, ChevronDown, MessageCircle, RotateCcw, Send, ShieldCheck, Sparkles, X } from 'lucide-react'

type ChatMessage = {
  id: number
  role: 'assistant' | 'visitor'
  text: string
  action?: { label: string; href: string }
}

const welcome: ChatMessage = {
  id: 0,
  role: 'assistant',
  text: 'Hi there. I can point you toward Nexora’s services, explain how a project gets started, or help you find a good next step. What are you exploring?',
}

const shortcuts = ['Explore services', 'How do projects start?', 'Where could AI help?']

function localAnswer(question: string): Omit<ChatMessage, 'id' | 'role'> {
  const query = question.toLowerCase()
  if (/difference|different|versus|\bvs\b/.test(query) && /agent|automation|application|\bapp\b/.test(query)) {
    return { text: 'An AI application puts a model inside a product that a person uses. An AI agent can handle a multi-step task within defined permissions and review points. Automation connects predictable steps across tools, often without AI. A real project may combine all three, with people approving the important decisions.', action: { label: 'Explore the workflow concept', href: '#ai-showcase' } }
  }
  if (/price|pricing|budget|cost|charge|quote/.test(query)) {
    return { text: 'Project costs depend on the goals, scope, and systems involved. The project brief can capture a budget range, but it won’t generate a quote or send your details.', action: { label: 'Build a project brief', href: '#project-builder' } }
  }
  if (/website|web app|web development|e-commerce|ecommerce|online store/.test(query)) {
    return { text: 'Nexora offers website and web application development, including digital experiences for businesses and online commerce. A useful starting point is to outline who the experience serves and what you want visitors to do.', action: { label: 'See all services', href: '#services' } }
  }
  if (/agent|automation|automate|workflow|repetitive|busywork/.test(query)) {
    return { text: 'AI agents and process automation can help with repeatable tasks and handoffs. The right opportunity depends on how the work happens today and where a person should stay in control.', action: { label: 'Find a starting point', href: '#solutions' } }
  }
  if (/ai|artificial intelligence|model|llm|assistant/.test(query)) {
    return { text: 'Nexora works on practical AI applications, agents, automation, and AI consulting. A good first step is to identify a real user need or recurring task, then check whether AI is a useful fit.', action: { label: 'Explore AI services', href: '#services' } }
  }
  if (/custom software|software|platform|internal tool|system/.test(query)) {
    return { text: 'Custom software can be shaped around your team’s processes, users, and existing tools. Start with the job the system needs to make easier; feature ideas can follow from that.', action: { label: 'Describe your project', href: '#project-builder' } }
  }
  if (/start|process|first step|begin|timeline|how long|project/.test(query)) {
    return { text: 'Projects begin with discovery: clarify the people, goals, constraints, and opportunity. From there, Nexora outlines a plan, explores the design, develops in increments, tests, and prepares a handoff. Timing depends on the scope.', action: { label: 'See the project process', href: '#process' } }
  }
  if (/privacy|private|secure|data|store|save|send|email/.test(query)) {
    return { text: 'This rule-based assistant is a local preview. Your chat messages stay in this tab and are not sent to an AI provider. Website inquiries use a separate secure API and are saved only when its Supabase server configuration is in place. No email is sent automatically.', action: { label: 'Read the project brief notice', href: '#project-builder' } }
  }
  if (/portfolio|case stud|client|result|work sample|example/.test(query)) {
    return { text: 'The portfolio currently contains fictional demonstration concepts. They show possible directions, not real clients or measured business results.', action: { label: 'View demonstrations', href: '#work' } }
  }
  if (/contact|talk|human|person|email|phone/.test(query)) {
    return { text: 'Contact details are still placeholders. The project brief submits through the secure inquiry API; it is saved only when Supabase is configured and the API confirms success. No email or notification is sent automatically yet.', action: { label: 'Open the project builder', href: '#project-builder' } }
  }
  return { text: 'I’m a local preview assistant with a small set of Nexora answers, so I may not know that one yet. Try asking about services, AI, automation, project steps, or privacy. Nothing you type here is sent anywhere.', action: { label: 'Explore the solutions finder', href: '#solutions' } }
}

export default function AssistantWidget() {
  const prefersReducedMotion = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([welcome])
  const [announcement, setAnnouncement] = useState('')
  const sequence = useRef(1)
  const launcherRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const endRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        launcherRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth', block: 'nearest' })
  }, [messages, open, prefersReducedMotion])

  function sendMessage(text: string) {
    const cleaned = text.trim()
    if (!cleaned) return
    const visitor: ChatMessage = { id: sequence.current++, role: 'visitor', text: cleaned }
    const answer: ChatMessage = { ...localAnswer(cleaned), id: sequence.current++, role: 'assistant' }
    setMessages((current) => [...current, visitor, answer])
    setDraft('')
    setAnnouncement('Nexora preview replied.')
    inputRef.current?.focus()
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendMessage(draft)
  }

  function resetChat() {
    setMessages([welcome])
    setDraft('')
    sequence.current = 1
    setAnnouncement('Conversation restarted.')
    inputRef.current?.focus()
  }

  return <div className="assistant-widget">
    <AnimatePresence>
      {open && <motion.section className="assistant-panel" id="nexora-assistant-panel" role="dialog" aria-label="Nexora local preview assistant" initial={prefersReducedMotion ? false : { opacity: 0, y: 14, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={prefersReducedMotion ? undefined : { opacity: 0, y: 10, scale: .98 }} transition={{ duration: prefersReducedMotion ? 0 : .2 }}>
        <header className="assistant-header"><span className="assistant-avatar"><Bot size={19} /></span><div className="assistant-heading"><h2>Nexora guide</h2><span><i /> LOCAL PREVIEW · NO DATA SENT</span></div><button className="assistant-icon-button" type="button" aria-label="Restart conversation" title="Restart conversation" onClick={resetChat}><RotateCcw size={15} /></button><button className="assistant-icon-button" type="button" aria-label="Close assistant" onClick={() => { setOpen(false); launcherRef.current?.focus() }}><ChevronDown size={18} /></button></header>
        <div className="assistant-context"><Sparkles size={13} /><span>Answers about Nexora’s services and project process</span></div>
        <ol className="assistant-messages" aria-label="Conversation messages" aria-live="polite" aria-relevant="additions text">{messages.map((message) => <li className={`assistant-message ${message.role}`} key={message.id}><span className="message-avatar" aria-hidden="true">{message.role === 'assistant' ? <Bot size={14} /> : 'Y'}</span><div className="message-body"><p>{message.text}</p>{message.action && <a className="message-action" href={message.action.href} onClick={() => { setOpen(false); launcherRef.current?.focus() }}>{message.action.label} <ArrowRight size={13} /></a>}<span className="message-kind">{message.role === 'assistant' ? 'NEXORA GUIDE' : 'YOU'}</span></div></li>)}<li className="assistant-scroll-end" ref={endRef} aria-hidden="true" /></ol>
        {messages.length === 1 && <div className="assistant-shortcuts" aria-label="Suggested questions">{shortcuts.map((shortcut) => <button type="button" key={shortcut} onClick={() => sendMessage(shortcut)}>{shortcut}<ArrowRight size={12} /></button>)}</div>}
        <form className="assistant-composer" onSubmit={submit}><label className="sr-only" htmlFor="assistant-message">Ask Nexora a question</label><input id="assistant-message" ref={inputRef} maxLength={500} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Ask a question…" autoComplete="off" /><button type="submit" aria-label="Send message" disabled={!draft.trim()}><Send size={15} /></button></form>
        <footer className="assistant-footer"><ShieldCheck size={12} /><span>Demo only. Messages stay in this tab and are not sent or saved.</span></footer>
        <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
      </motion.section>}
    </AnimatePresence>
    <button ref={launcherRef} className={`assistant-launcher${open ? ' is-open' : ''}`} type="button" aria-expanded={open} aria-controls={open ? 'nexora-assistant-panel' : undefined} onClick={() => { setOpen((current) => !current); if (!open) window.setTimeout(() => inputRef.current?.focus(), prefersReducedMotion ? 0 : 180) }}><span className="launcher-icon">{open ? <X size={19} /> : <MessageCircle size={19} />}</span><span>{open ? 'Close guide' : 'Ask Nexora'}</span><i className="launcher-status" /></button>
  </div>
}
