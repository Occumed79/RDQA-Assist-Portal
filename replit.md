# Guide Builder

## Overview

Full-stack Guide Builder app — a premium tool for creating, managing, and previewing step-by-step workflow guides (SOPs, training manuals, clinical protocols). Built as a pnpm monorepo with a React+Vite frontend and Express 5 API server.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19 + Vite 7, Tailwind CSS v4, Framer Motion, TanStack Query, Wouter routing, Lucide icons, Sonner toasts
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec`)
- **AI**: Gemini via Replit AI Integrations (`lib/integrations-gemini-ai`)
- **Build**: esbuild (ESM bundle)

## Architecture

```
artifacts/
  api-server/          — Express 5 API (port 8080, proxied at /api)
  guide-builder/       — React+Vite frontend (port 20750, proxied at /)
lib/
  api-spec/            — OpenAPI spec + Orval codegen config
  api-client-react/    — Generated TanStack Query hooks
  api-zod/             — Generated Zod schemas
  db/                  — Drizzle ORM schema + migrations
  integrations-gemini-ai/ — Gemini AI client wrapper
```

## Key Features

- **Dashboard**: Stats overview (total guides, steps, categories), recent guides list with category breakdown
- **Guides Library**: Searchable/filterable grid with category filter, quick actions (view, edit, delete)
- **Guide Builder/Editor**: Create/edit guides with title, description, category, tags
  - Step management: add, delete, drag-to-reorder (Framer Motion Reorder)
  - Per-step fields: title, instruction, tip, caution, image URL + caption
  - Template starters: Blank, SOP, Training Guide
- **AI Panel** (Gemini-powered):
  - Generate steps from rough outline
  - Polish all steps at once
  - Per-step autofill button
- **Guide Detail**: Read mode with beautiful step rendering, export as Markdown or plain text
- **Signatures**: Canvas-based handwritten signature capture per guide; stored in `guide_signatures` table
- **Form Builder**: Full form builder per guide — 9 field types (text, textarea, checkbox, radio, select, number, rating, date, signature); drag-to-reorder fields; submissions stored in DB; expandable submissions panel inline
- **Shareable Form Links**: Each form has a UUID `publicToken`; public URL `/forms/:token` renders a standalone full-screen form page (no auth); backend endpoints at `/api/public/forms/:token` and `/api/public/forms/:token/submit`
- **Email Notifications**: On any form submission (both in-app and via public link), an HTML email is sent via Resend to the `NOTIFY_EMAIL` address. Gracefully skips sending if `RESEND_API_KEY` is not set. Email includes submitter name/email, timestamp, all field answers, and a link back to the guide.
- **Branding**: Occumed logo integrated across the sidebar, dashboard hero, and AutoScribe panels, paired with glassmorphism glow and sparkle accents.
- **AutoScribe** (`/scribe`): Upload 1–20 screenshots → Gemini Vision analyzes each one → auto-generates titled steps with instructions, tips, and cautions → review/edit all fields inline → save as a full guide with one click.
- **Design**: macOS Tahoe glass aesthetic — deep navy background, frosted glass panels, amber/mint glow orbs, electric blue accents, hover luminous effects. Dashboard hero rebuilt with Kurzgesagt-inspired bold typography and character trio.

## Email Notifications Setup

Notifications use [Resend](https://resend.com) for transactional email. To activate:

1. Sign up at resend.com (free tier supports 3,000 emails/month)
2. Create an API key in your Resend dashboard
3. Add it as a secret named `RESEND_API_KEY` in Replit Secrets
4. Set `NOTIFY_EMAIL` env var (shared) to the address that should receive notifications

**If `RESEND_API_KEY` is not set, submissions still work — emails are silently skipped.**

> NOTE: Resend Replit integration was declined. Using direct API key via `RESEND_API_KEY` secret instead.

## API Routes

```
GET    /api/guides                          — list all guides
POST   /api/guides                          — create guide
GET    /api/guides/stats/summary            — stats (totals, categories, recent)
GET    /api/guides/:id                      — get guide
PATCH  /api/guides/:id                      — update guide
DELETE /api/guides/:id                      — delete guide
GET    /api/guides/:id/signatures           — list signatures
POST   /api/guides/:id/signatures           — add signature
GET    /api/guides/:id/forms                — list forms for guide
POST   /api/guides/:id/forms                — create form
GET    /api/forms/:id                       — get form
PUT    /api/forms/:id                       — update form
DELETE /api/forms/:id                       — delete form
GET    /api/forms/:id/submissions           — list submissions
POST   /api/forms/:id/submissions           — submit in-app response (triggers email)
GET    /api/public/forms/:token             — get public form (no auth)
POST   /api/public/forms/:token/submit      — submit public response (triggers email)
POST   /api/ai/generate-steps               — generate steps from outline
POST   /api/ai/polish-steps                 — polish all steps
POST   /api/ai/autofill-step                — autofill a single step
POST   /api/ai/analyze-screenshots          — analyze screenshots with Gemini Vision → generate guide steps
POST   /api/gemini/conversations            — create conversation
GET    /api/gemini/conversations            — list conversations
GET    /api/gemini/conversations/:id        — get conversation + messages
DELETE /api/gemini/conversations/:id        — delete conversation
GET    /api/gemini/conversations/:id/messages  — list messages
POST   /api/gemini/conversations/:id/messages  — send message (SSE streaming)
POST   /api/gemini/images                   — generate image
```

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)

## Important Notes

- esbuild `external` list in `artifacts/api-server/build.mjs` must NOT include `@google/*` — `@google/genai` needs to be bundled
- After running orval codegen, `lib/api-zod/src/index.ts` must only export from `./generated/api` (remove any `api.schemas` re-export that orval adds)
- Gemini SSE streaming endpoint must be consumed with raw `fetch` + `ReadableStream`, not the generated hook
- DB seeded with 3 example guides: HR Onboarding, RDQA Audit Process, Clinic Outreach Call Protocol
