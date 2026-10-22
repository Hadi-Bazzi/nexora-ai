export type ContactInquiry = { kind: 'contact'; name: string; email: string; message: string }
export type ProjectInquiry = {
  kind: 'project'; name: string; email: string; company: string; message: string
  project_type: string; features: string[]; contact_preference: string; budget: string; timing: string
}

export async function submitInquiry(inquiry: ContactInquiry | ProjectInquiry): Promise<void> {
  let response: Response
  try {
    response = await fetch('/api/inquiries', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(inquiry),
    })
  } catch {
    throw new Error('The inquiry service is unavailable. Please try again later.')
  }
  const result = await response.json().catch(() => null) as { error?: string } | null
  if (!response.ok) throw new Error(result?.error || 'We could not save your inquiry. Please try again.')
}
