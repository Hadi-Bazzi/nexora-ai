# Nexora AI & Tech

The website for Nexora AI & Tech, a studio focused on practical AI, automation, and custom software.

**GitHub repository:** [github.com/Hadi-Bazzi/nexora-ai](https://github.com/Hadi-Bazzi/nexora-ai)

The site includes a services gallery, project-planning tools, a contact form, and a small assistant demo. The assistant runs on preset rules rather than a live AI service. Portfolio and journal items are examples, not published client work.

## Getting started

You’ll need Node.js 20 or newer and npm.

1. Install the dependencies:

   ```sh
   npm install
   ```

2. Copy `.env.example` to `.env` and add your Supabase project URL and server secret key. Keep the secret on the server; don’t put it in a `VITE_*` variable.
3. Apply `supabase/migrations/202610210001_create_private_inquiries.sql` to your Supabase project.
4. Start the app:

   ```sh
   npm run dev
   ```

The website runs at `http://localhost:5173`, and the inquiry API runs on port `3001`. Vite forwards `/api` requests to the API while you’re developing.

To preview just the website without setting up Supabase, run `npm run dev:client`. The rest of the site will work, but inquiry submissions need the API and database configured.

## Project checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

## Before deploying

The website and Express API need to be hosted with `/api/*` routed to the API. Configure `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `PORT`, `TRUST_PROXY_HOPS`, and the deployed site’s exact origin in `ALLOWED_ORIGINS` as server environment variables. Apply the database migration before accepting inquiries.

The inquiry table does not allow browser access, and the API does not provide an endpoint for reading inquiries. Email notifications, CRM connections, and other follow-up integrations still need to be set up separately.

The homepage video is rendered from the Remotion project in the neighboring `nexora-ai-tech-remotion` folder. That folder contains its own instructions for previewing and rendering the video.
