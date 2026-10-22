# Nexora AI & Tech

[Visit the Live Website — Nexora AI & Tech](https://nexora-ai-tech.onrender.com)

## Project Overview

Nexora AI & Tech is an AI-focused technology brand website. It helps visitors explore the studio's service areas, consider options for a business need, and shape an initial project brief.

## What Is Nexora AI & Tech?

The site presents Nexora's approach to practical technology: understand a business challenge, consider where software, AI, or automation may help, and plan a solution around the people who will use it. The services described are areas Nexora offers to explore; they are not claims that the website itself provides ready-to-use AI products.

## Website Goals

- Make the studio's service areas and approach clear to potential customers.
- Help visitors connect business needs with relevant technology options.
- Give visitors a guided way to outline a project and its goals.
- Present technology as practical, considered, and designed around people.

## Services and Solutions

The website presents these service areas:

- **AI-powered applications:** Applications designed around a particular product or business need.
- **AI agents and automation:** Agents and workflows intended to handle repeatable tasks, with people involved where appropriate.
- **Custom AI solutions:** Tailored AI applications or integrations considered in the context of a customer's needs.
- **Business process automation:** Connecting tools and reducing manual steps in business workflows.
- **Custom software and website development:** Digital products, platforms, websites, and internal tools shaped around how a business works.
- **AI consulting and integration:** Exploring use cases and how AI may fit with existing systems.

These are services the brand describes, not deployed customer products or guaranteed results.

## Customer Experience

Visitors can browse the service descriptions, use a needs-based finder to see suggested directions, and explore visual concepts for selected services. A project-process section outlines discovery, planning, design, development, testing, and delivery.

The project builder gathers a service choice, goals, possible features, contact preference, and basic contact details to form an inquiry. The site also includes a rule-based assistant that answers a limited set of questions locally; it does not use an AI provider.

## Key Website Features

- Responsive service and workflow showcases
- Needs-based solution finder
- Service-specific visual direction gallery; the displayed artwork is placeholder concept art
- Interactive project-process explainer marked as a demonstration, not a live system
- Project brief builder and contact form, which submit to the inquiry API
- Portfolio concepts and sample editorial content, clearly presented as demonstrations rather than client work or published articles

## Technology Stack

- React and TypeScript
- Vite
- Tailwind CSS
- Framer Motion and GSAP
- Express API
- Supabase PostgreSQL for inquiry storage

## Current Project Status

The public website is available at the link above. The public `/api/health` endpoint currently returns 404, so the inquiry API and form submissions are **not verified as working on the live site**. Do not rely on the site for inquiry collection until the API is deployed and tested.

The assistant is a local, rule-based preview. Email notifications, CRM routing, and AI-provider integrations are not connected. Portfolio and editorial entries are demonstration content.

## Local Development

Requirements: Node.js `^20.19.0` or `>=22.12.0` and npm.

```sh
npm ci
```

To run the API locally, copy `.env.example` to `.env` and set `SUPABASE_URL` and `SUPABASE_SECRET_KEY` from your Supabase project. These values are for the server only: never commit them or expose them through `VITE_*` variables. Apply `supabase/migrations/202610210001_create_private_inquiries.sql` to the Supabase project if you want to test inquiry storage.

Run the frontend and API together:

```sh
npm run dev
```

The site opens locally at `http://localhost:5173`. This address is only available on the development computer. Available project commands include `npm run dev:client`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, and `npm start`.

To work on the frontend without the API or Supabase configuration, run `npm run dev:client`; inquiry forms will not be available.

## Render Deployment

[`render.yaml`](./render.yaml) configures a Render Node service from the `main` branch. It builds the frontend and server and starts Express to serve both from the same service.

To enable inquiry storage, configure `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, and `ALLOWED_ORIGINS` in Render's environment settings. Set `ALLOWED_ORIGINS` to the exact HTTPS origin assigned to the service, and apply the Supabase migration before accepting submissions. Render supplies `PORT`; the Blueprint sets `TRUST_PROXY_HOPS` to `1`. Keep Supabase credentials private and server-side.

## Future Goals

- Complete and verify the production inquiry API setup.
- Decide whether email or CRM follow-up integrations are needed.
- Replace concept placeholders with approved final visuals and publishable content as they become available.
