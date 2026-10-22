import assert from 'node:assert/strict'
import test from 'node:test'
import { inquirySchema } from './validation.js'

test('accepts a valid contact inquiry and trims user input', () => {
  const parsed = inquirySchema.parse({ kind: 'contact', name: '  Alex  ', email: 'a@example.com', message: '  Hello, I need a new site.  ' })
  assert.equal(parsed.name, 'Alex')
  assert.equal(parsed.message, 'Hello, I need a new site.')
})

test('rejects invalid email and unexpected fields', () => {
  assert.equal(inquirySchema.safeParse({ kind: 'contact', name: 'Alex', email: 'nope', message: 'Long enough inquiry', admin: true }).success, false)
})

test('accepts project brief and applies optional field defaults', () => {
  const parsed = inquirySchema.parse({ kind: 'project', name: 'Alex', email: 'a@example.com', message: 'A useful project goal that is long enough.', project_type: 'Website', features: ['Portal'], contact_preference: 'Email' })
  assert.equal(parsed.kind, 'project')
  if (parsed.kind === 'project') assert.equal(parsed.company, '')
})
