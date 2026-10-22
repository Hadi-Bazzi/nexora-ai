# Nexora AI & Tech V2

A responsive AI and technology studio site built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, and Lucide React.

## What is implemented

- Responsive marketing site with six service areas, a service-style gallery, fictional portfolio demonstrations, an editorial placeholder, and a six-step project process.
- Local-rule Solutions Finder with explanations and relevant next steps.
- Four-step Project Builder with validation, project summary, and honest save/error states.
- Contact inquiry form.
- A rule-based assistant demo. It is not connected to an AI model; chat messages stay in browser memory and are not submitted.
- Express inquiry API with server-side Zod validation, request size limits, rate limiting, origin checks, and a server-only Supabase key.
- Private Supabase PostgreSQL migration. The browser has no read access to inquiry records.
- A locally rendered 5-second Remotion video hero (`public/videos/nexora-hero.mp4`) with an SVG poster for reduced motion and video-load failures.
- Service example cards use local, clearly marked SVG concept art.

No live AI provider, email delivery, CRM, n8n, or other downstream notification integration is configured. The workflow explainer labels these boundaries in the interface. Portfolio and journal content are sample material, not real client results or published articles.

The Remotion composition source lives in the separate sibling folder `nexora-ai-tech-remotion`. It is a small video studio for the homepage background, not a rewrite of this React/Vite site. See that folder's README for preview and render commands.

## Run locally

Requirements: Node.js 20 or newer and npm.

1. Install dependencies: `npm install`.
2. Configure the inquiry API: copy `.env.example` to `.env`, then add your own Supabase project URL and server secret key. Keep the secret server-side; never put it in a `VITE_*` variable.
3. Apply `supabase/migrations/202610210001_create_private_inquiries.sql` to your Supabase project.
4. Run `npm run dev`. Vite is available at `http://localhost:5173`; the Express API runs on port 3001 and Vite proxies `/api` requests to it.

If Supabase is not configured, you can preview the frontend with `npm run dev:client`. The assistant and finder still work, but inquiry submissions will return an error rather than claim to be saved. A successful form message is shown only after the API confirms its database insert.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Deployment and data handling

Deploy the frontend and Express API to hosting you choose, route `/api/*` to the API, and set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `PORT`, `TRUST_PROXY_HOPS`, and the exact deployed site origin in `ALLOWED_ORIGINS` as server environment variables. Apply the migration to the hosted Supabase project before accepting inquiries. A hosted Supabase database stays online independently of your laptop, subject to the service plan and availability. This repository does not create a Supabase project or verify live connectivity.

The server exposes only a submission endpoint and health check, not an inquiry read/list endpoint. The `inquiries` table uses row-level security and grants no browser access. Build a future admin dashboard behind real Supabase Auth and a separately authorized server-side API.
