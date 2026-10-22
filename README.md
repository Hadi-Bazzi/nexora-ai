
Nexora AI & Tech builds practical AI applications, AI agents, intelligent automation, and custom software. This repository contains the company website and its inquiry API.

| | |
| --- | --- |
| Local website (only while running locally) | [http://localhost:5173](http://localhost:5173) |
| Source repository | [github.com/Hadi-Bazzi/nexora-ai](https://github.com/Hadi-Bazzi/nexora-ai) |
| Public website | Not deployed yet |

> `localhost` is only reachable from the computer running the development server. It is not a public website link. The public HTTPS address will be added here after deployment is completed and verified.

## Project overview

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, and GSAP.
- **API:** Express provides `GET /api/health` and `POST /api/inquiries`.
- **Data:** Inquiry records are stored in Supabase PostgreSQL. The browser has no direct read access.
- **Assistant demo:** Uses local rules and is not connected to an AI provider.
- **Portfolio and journal content:** Examples, not client case studies or published articles.
- **Homepage video:** A rendered Remotion asset. Its source is maintained separately in the neighboring `nexora-ai-tech-remotion` project.

The Express server serves the built frontend and API from the same origin in production. During local development, Vite serves the frontend and proxies `/api` requests to Express.

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- A Supabase project for inquiry submissions

## Local development

Install dependencies:

```sh
npm ci
```

Copy `.env.example` to `.env` and set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` using values from your Supabase project. Keep the secret server-side; never use a `VITE_*` variable for it.

Apply the database migration in `supabase/migrations/202610210001_create_private_inquiries.sql` to your Supabase project.

Start the frontend and API:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) on the development computer. The API runs on port `3001`. To run only the frontend, use `npm run dev:client`; inquiry submissions will not work in that mode.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite client and Express API |
| `npm run dev:client` | Start only the Vite client |
| `npm run typecheck` | Type-check the client and server |
| `npm run lint` | Run ESLint |
| `npm test` | Build and run the server validation tests |
| `npm run build` | Build the client and compile the server |
| `npm start` | Start the compiled Express server |

The frontend build is written to `dist/`; the compiled API is written to `server-dist/`.

## Deploying to Render

The included `render.yaml` configures one Node web service on the GitHub `main` branch. It builds the existing frontend and server, then starts Express to serve both the website and `/api/*` routes. No redesign or separate frontend/API host is needed.

1. Sign in to Render and create a **Blueprint** from `Hadi-Bazzi/nexora-ai`, selecting the `main` branch.
2. Review the service and plan shown by Render before creating it. The service cannot accept inquiry submissions until the environment and Supabase database are configured.
3. In the service's Environment settings, set these values securely:
   - `SUPABASE_URL` — your Supabase project URL.
   - `SUPABASE_SECRET_KEY` — your server-side Supabase secret key. Never put it in source code or a `VITE_*` variable.
   - `ALLOWED_ORIGINS` — the exact `https://` origin Render assigns to this service (no path or trailing slash).
   - `TRUST_PROXY_HOPS` — `1` for the Render proxy.
4. Apply `supabase/migrations/202610210001_create_private_inquiries.sql` to the production Supabase database before accepting inquiries.
5. Confirm the build and deployment in Render. Verify the deployed website and `https://<your-render-host>/api/health`. Only then replace “Not deployed yet” above with the verified public HTTPS URL.

The inquiry API requires both Supabase variables at server startup. Render injects `PORT`; it should not be hard-coded. Keep `.env` files out of Git. Render may suspend free services while idle, so the first request after inactivity may take longer to respond.

## Inquiry API

- `GET /api/health` returns a health status.
- `POST /api/inquiries` validates and stores contact or project inquiries.

The API applies request validation, rate limiting, security headers, and an allowed-origin check. Inquiry records cannot be read through this API. Email notifications, CRM integrations, and other downstream workflows are not configured.
