import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types.js'
import { inquirySchema } from './validation.js'

const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env
if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
  throw new Error('SUPABASE_URL and SUPABASE_SECRET_KEY must be set in the server environment.')
}

const port = Number(process.env.PORT || 3001)
const proxyHops = Number(process.env.TRUST_PROXY_HOPS || 0)
if (!Number.isInteger(proxyHops) || proxyHops < 0 || proxyHops > 5) throw new Error('TRUST_PROXY_HOPS must be an integer from 0 to 5.')
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',').map((value) => value.trim()).filter(Boolean)
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', proxyHops)
app.use(helmet())
app.use(cors({ origin(origin, callback) {
  if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
  return callback(new Error('Origin is not allowed.'))
} }))
app.use(express.json({ limit: '12kb', type: 'application/json' }))
app.use('/api/inquiries', rateLimit({ windowMs: 15 * 60 * 1000, limit: 8, standardHeaders: 'draft-8', legacyHeaders: false }))

app.get('/api/health', (_request, response) => response.json({ status: 'ok' }))

app.post('/api/inquiries', async (request, response) => {
  const parsed = inquirySchema.safeParse(request.body)
  if (!parsed.success) return response.status(400).json({ error: 'Please check the form fields and try again.' })

  const inquiry = parsed.data
  const { error } = inquiry.kind === 'contact'
    ? await supabase.from('inquiries').insert({ kind: inquiry.kind, name: inquiry.name, email: inquiry.email, message: inquiry.message })
    : await supabase.from('inquiries').insert({
        kind: inquiry.kind,
        name: inquiry.name,
        email: inquiry.email,
        company: inquiry.company,
        message: inquiry.message,
        project_type: inquiry.project_type,
        features: inquiry.features,
        contact_preference: inquiry.contact_preference,
        budget: inquiry.budget,
        timing: inquiry.timing,
      })
  if (error) {
    // Do not log inquiry contents or return internal database details to the caller.
    console.error('Inquiry insert failed:', error.code || 'unknown database error')
    return response.status(503).json({ error: 'We could not save your inquiry right now. Please try again shortly.' })
  }
  return response.status(201).json({ message: 'Your inquiry was saved.' })
})

app.use((error: unknown, _request: express.Request, response: express.Response, next: express.NextFunction) => {
  void next
  if (error instanceof SyntaxError) return response.status(400).json({ error: 'Request body must be valid JSON.' })
  if (error instanceof Error && error.message === 'Origin is not allowed.') return response.status(403).json({ error: 'This request origin is not allowed.' })
  console.error('Request failed:', error instanceof Error ? error.name : 'unknown error')
  return response.status(500).json({ error: 'Something went wrong. Please try again.' })
})

app.listen(port, () => console.info(`Nexora inquiry API listening on port ${port}`))
