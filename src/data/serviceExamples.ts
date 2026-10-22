export type ServiceExample = {
  id: string
  label: string
  description: string
  image: string
  placeholder: true
}

export type ServiceExampleGroup = {
  serviceId: string
  service: string
  examples: ServiceExample[]
}

const example = (id: string, label: string, description: string): ServiceExample => ({
  id,
  label,
  description,
  image: `/style-previews/placeholders/${id}.svg`,
  placeholder: true,
})

/** Local art placeholders; replace image paths with approved generated WebP assets when available. */
export const serviceExamples: ServiceExampleGroup[] = [
  { serviceId: '01', service: 'Website development', examples: [
    example('web-minimal', 'Minimal editorial', 'Quiet typography, generous space, and a focused content flow.'),
    example('web-corporate', 'Corporate', 'A confident digital presence with clear routes through the business.'),
    example('web-bold-creative', 'Bold creative', 'Expressive composition with distinctive visual rhythm.'),
    example('web-ecommerce', 'E-commerce', 'A product-first shopping journey with a clear path to purchase.'),
  ] },
  { serviceId: '02', service: 'AI-powered applications', examples: [
    example('ai-dashboard', 'AI dashboard', 'An intelligent workspace that brings signals into one view.'),
    example('ai-chat-assistant', 'Chat assistant', 'A conversational interface that helps people move forward.'),
    example('ai-data-viz', 'Data visualization', 'Complex information expressed as a calm, readable visual system.'),
    example('ai-saas-product', 'SaaS product', 'A connected application designed for everyday team use.'),
  ] },
  { serviceId: '03', service: 'AI agents & automation', examples: [
    example('agent-workflow', 'Workflow automation', 'Connected steps show how tasks move from trigger to action.'),
    example('agent-dashboard', 'Agent dashboard', 'Agent activity, approvals, and oversight in one workspace.'),
    example('agent-builder', 'No-code builder', 'A visual way to shape and connect repeatable tasks.'),
    example('agent-enterprise-ops', 'Enterprise operations', 'Reliable automation with visibility and human control.'),
  ] },
  { serviceId: '04', service: 'Custom software', examples: [
    example('software-platform', 'Digital platform', 'A modular foundation shaped around a specific business.'),
    example('software-mobile', 'Mobile product', 'A focused app experience that adapts to a smaller screen.'),
    example('software-portal', 'Customer portal', 'A clear self-service space for accounts and updates.'),
    example('software-internal-tool', 'Internal tool', 'Purpose-built software that makes team operations clearer.'),
  ] },
  { serviceId: '05', service: 'Business process automation', examples: [
    example('process-operations', 'Operations hub', 'A shared view of tasks, ownership, and progress.'),
    example('process-document', 'Document routing', 'Information intake and review move through a clear flow.'),
    example('process-integration', 'Systems integration', 'Separate tools connected through one considered system.'),
    example('process-approvals', 'Approval flow', 'A transparent route from request to decision.'),
  ] },
  { serviceId: '06', service: 'AI consulting & integration', examples: [
    example('consulting-strategy', 'AI strategy', 'A practical map of where intelligent tools may help.'),
    example('consulting-workshop', 'Team workshop', 'Shared discovery turns open questions into next steps.'),
    example('consulting-integration', 'AI integration', 'New capabilities connect with existing tools and data.'),
    example('consulting-governance', 'Responsible AI', 'Guardrails and governance are built into the approach.'),
  ] },
]
