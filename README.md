# Nexora AI & Tech

Nexora AI & Tech is a studio website focused on practical AI, automation, and custom software.

| | |
| --- | --- |
| Intended website | [www.nexora-ai.com](https://www.nexora-ai.com) *(deployment pending; this domain currently points to a GoDaddy landing page)* |
| Source repository | [github.com/Hadi-Bazzi/nexora-ai](https://github.com/Hadi-Bazzi/nexora-ai) |

## Project overview

The site includes service information, a project-planning flow, a contact form, and an interactive assistant demo. The assistant uses local rules and is not connected to an AI provider. Portfolio and journal content are examples, not client case studies or published articles.

### Architecture

- **Web client:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, and GSAP.
- **Inquiry API:** Express with server-side Zod validation, request-size limits, rate limiting, security headers, and origin checks.
- **Data:** Supabase PostgreSQL. Inquiry records are private; the browser has no read access.
- **Homepage video:** A rendered Remotion asset. The Remotion source is maintained separately in the neighboring `nexora-ai-tech-remotion` project.

## Local development

### Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- A Supabase project to test inquiry submissions

Install dependencies from the project directory:

```sh
npm ci
```

Create a local environment file by copying `.env.example` to `.env`, then set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` to values from your Supabase project. Keep the secret server-side; do not use a `VITE_*` variable for it.

Apply the database migration:

```text
supabase/migrations/202610210001_create_private_inquiries.sql
```

Start the client and API together:

```sh
npm run dev
```

The Vite client runs at `http://localhost:5173`; the Express API runs on port `3001`. During development, Vite proxies `/api` requests to the API. The API requires its Supabase environment variables at startup.

To work on the client without configuring the API, run `npm run dev:client`. Inquiry submissions will not be available in that mode.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite client and Express API |
| `npm run dev:client` | Start only the Vite client |
| `npm run typecheck` | Type-check the client and server |
| `npm run lint` | Run ESLint |
| `npm test` | Build and run the server validation tests |
| `npm run build` | Build the client and compile the server |
| `npm start` | Start the compiled Express API |

The client build is written to `dist/`; the compiled API is written to `server-dist/`.

## Deployment

The client and API are separate runtime components. Host the contents of `dist/` as the website, run the compiled API with `npm start`, and configure the host or reverse proxy to route `/api/*` requests to the API.

Set these values as **server-side environment variables** in the API host:

- `SUPABASE_URL`
- `SUPABASE_SECRET_KEY`
- `PORT`
- `TRUST_PROXY_HOPS`
- `ALLOWED_ORIGINS` — the exact origin of the deployed website

Apply the Supabase migration to the production database before enabling inquiry submissions. Set `TRUST_PROXY_HOPS` to match the hosting proxy configuration. Do not commit `.env` files or expose the Supabase secret to the client.

The Express API provides inquiry submission and a health check; it does not provide an endpoint for reading inquiry records. Email notifications, CRM integrations, and other downstream workflows are not configured.
