import { mkdir, writeFile } from 'node:fs/promises'

const groups = [
  { prefix: 'web', hue: 211, count: ['minimal', 'corporate', 'bold-creative', 'ecommerce'] },
  { prefix: 'ai', hue: 247, count: ['dashboard', 'chat-assistant', 'data-viz', 'saas-product'] },
  { prefix: 'agent', hue: 224, count: ['workflow', 'dashboard', 'builder', 'enterprise-ops'] },
  { prefix: 'software', hue: 232, count: ['platform', 'mobile', 'portal', 'internal-tool'] },
  { prefix: 'process', hue: 201, count: ['operations', 'document', 'integration', 'approvals'] },
  { prefix: 'consulting', hue: 261, count: ['strategy', 'workshop', 'integration', 'governance'] },
]

const root = new URL('../public/style-previews/placeholders/', import.meta.url)
await mkdir(root, { recursive: true })

for (const [groupIndex, group] of groups.entries()) {
  for (const [variant, name] of group.count.entries()) {
    const id = `${group.prefix}-${name}`
    const hue = group.hue + variant * 9
    const shift = variant * 21 + groupIndex * 13
    const dots = Array.from({ length: 16 }, (_, i) => {
      const x = 54 + ((i * 71 + shift) % 780)
      const y = 48 + ((i * 47 + shift * 2) % 420)
      const r = i % 5 === 0 ? 3.1 : 1.5
      return `<circle cx="${x}" cy="${y}" r="${r}" fill="hsl(${hue + 16} 100% 79%)" opacity="${i % 3 ? '.55' : '.9'}"/>`
    }).join('')
    const paths = Array.from({ length: 5 }, (_, i) => {
      const y = 120 + i * 68 + (variant % 2) * 13
      const bend = 130 + i * 31 + shift
      return `<path d="M -20 ${y + 70} C ${bend} ${y - 60}, ${500 - i * 24} ${y + 150}, 920 ${y - 38}"/>`
    }).join('')
    const cards = Array.from({ length: 4 }, (_, i) => {
      const col = i % 2
      const row = Math.floor(i / 2)
      const x = 325 + col * 232 + (variant % 2 ? 18 : 0)
      const y = 104 + row * 152
      const w = 194 - (variant === i ? 18 : 0)
      return `<g transform="translate(${x} ${y})"><rect width="${w}" height="112" rx="13" fill="url(#glass${i})" stroke="hsl(${hue} 92% 79% / .4)"/><rect x="15" y="15" width="${45 + ((i + variant) % 3) * 18}" height="4" rx="2" fill="hsl(${hue + 15} 95% 84% / .62)"/><rect x="15" y="31" width="${w - 30}" height="51" rx="7" fill="hsl(${hue} 93% 65% / .1)"/><path d="M 17 94 H ${40 + i * 16}" stroke="hsl(${hue + 15} 90% 82% / .38)" stroke-width="2"/></g>`
    }).join('')
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 540" role="img" aria-label="Local placeholder art for ${id}"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0a0f24"/><stop offset=".55" stop-color="#111a3c"/><stop offset="1" stop-color="#101129"/></linearGradient><radialGradient id="aura"><stop stop-color="hsl(${hue} 83% 62% / .34)"/><stop offset="1" stop-color="#0a0f24" stop-opacity="0"/></radialGradient>${[0,1,2,3].map(i=>`<linearGradient id="glass${i}" x2="1" y2="1"><stop stop-color="hsl(${hue} 76% 72% / .2)"/><stop offset="1" stop-color="#546cff" stop-opacity=".035"/></linearGradient>`).join('')}</defs><rect width="900" height="540" fill="url(#bg)"/><ellipse cx="562" cy="258" rx="370" ry="270" fill="url(#aura)"/><g fill="none" stroke="hsl(${hue} 92% 69% / .31)" stroke-width="1.25">${paths}</g><g>${dots}</g><g>${cards}</g><g fill="none" stroke="hsl(${hue + 15} 100% 78% / .44)"><circle cx="184" cy="270" r="76"/><circle cx="184" cy="270" r="55" stroke-dasharray="3 8"/><path d="M 110 270 H 258 M 184 196 V 344" opacity=".42"/></g><circle cx="184" cy="270" r="24" fill="hsl(${hue} 100% 72% / .16)" stroke="hsl(${hue + 15} 100% 82% / .74)"/><g fill="none" stroke="#b6c5ff" stroke-opacity=".12"><path d="M 0 90 H 900 M 0 180 H 900 M 0 270 H 900 M 0 360 H 900 M 0 450 H 900"/><path d="M 90 0 V 540 M 180 0 V 540 M 270 0 V 540 M 360 0 V 540 M 450 0 V 540 M 540 0 V 540 M 630 0 V 540 M 720 0 V 540 M 810 0 V 540"/></g><rect x="1" y="1" width="898" height="538" fill="none" stroke="#91a8ff" stroke-opacity=".19"/><metadata>Placeholder visual generated locally for Nexora service example. No external image or Higgsfield output.</metadata></svg>`
    await writeFile(new URL(`${id}.svg`, root), svg, 'utf8')
  }
}
