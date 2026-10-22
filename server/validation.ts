import { z } from 'zod'

const cleanText = (max: number) => z.string().trim().min(1).max(max)
const email = z.string().trim().email().max(254)

export const inquirySchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('contact'),
    name: cleanText(120),
    email,
    message: z.string().trim().min(10).max(1000),
  }).strict(),
  z.object({
    kind: z.literal('project'),
    name: cleanText(120),
    email,
    company: z.string().trim().max(160).default(''),
    message: z.string().trim().min(15).max(500),
    project_type: cleanText(100),
    features: z.array(cleanText(100)).min(1).max(12),
    contact_preference: cleanText(80),
    budget: z.string().trim().max(80).default(''),
    timing: z.string().trim().max(80).default(''),
  }).strict(),
])

export type Inquiry = z.infer<typeof inquirySchema>
