# HabbitCraft — Project Rules

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **Marketplace:** Mercury.js
- **Runtime:** Node.js
- **Hosting:** Vercel
- **UI/UX Design:** Google Stitch

## Architecture & Conventions

### Next.js
- Use the **App Router** (`app/` directory) — never use `pages/` router.
- All pages and layouts go in `app/`.
- Use **Server Components** by default; add `'use client'` only when the component needs browser APIs, hooks, or interactivity.
- Data fetching should prefer Server Components and `fetch()` with caching; avoid `useEffect` for data loading.
- Use `loading.tsx`, `error.tsx`, and `not-found.tsx` for route-level UX states.
- API routes go in `app/api/` using Route Handlers.

### Tailwind CSS
- All styling must use Tailwind utility classes — no custom CSS files unless absolutely necessary.
- Extend the Tailwind config (`tailwind.config.ts`) for custom colors, fonts, and spacing from the Design System.
- Never use inline `style={}` attributes.

### shadcn/ui
- Use shadcn/ui components as the primary building blocks for the UI.
- Customise components via Tailwind classes and the `cn()` helper — do not modify the component source files directly unless needed.
- Install new components with `npx shadcn@latest add <component>`.

### Supabase Auth (Authentication)
- Use Supabase's built-in Auth module (`@supabase/supabase-js`) — no separate auth service needed.
- Create auth helpers in `lib/supabase.ts` (server client) and `lib/supabase-browser.ts` (browser client).
- Use `supabase.auth.signInWithPassword()`, `signUp()`, `signInWithOAuth()` for auth flows.
- Protect routes via Next.js middleware checking the Supabase session.
- Leverage **Row Level Security (RLS)** policies with `auth.uid()` for data access control — auth and DB security are unified.
- Use `@supabase/ssr` for server-side cookie-based session management in Next.js App Router.

### Supabase (Database)
- Use the Supabase JS client (`@supabase/supabase-js`) for database operations.
- Create a single shared Supabase client utility in `lib/supabase.ts`.
- Use Row Level Security (RLS) policies for data access control.
- Keep env vars in `.env.local`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

### Vercel (Hosting & Deployment)
- Deploy via Vercel — no Docker or custom server needed.
- Use `vercel.json` for project configuration (rewrites, headers, cron jobs).
- API routes in `app/api/` are automatically deployed as serverless functions.
- Use **Vercel Cron Jobs** for scheduled tasks (daily resets, streak calculations, stats generation).
- Define cron jobs in `vercel.json` under the `crons` field, pointing to API Route Handlers.
- Hobby plan: max 2 cron jobs, minimum frequency 1x/day, 10s timeout.
- Environment variables are set in the Vercel dashboard — never hardcode secrets.
- Use `vercel env pull` to sync env vars to `.env.local` for development.

### Google Stitch (UI/UX Design)
- Use **Google Stitch** (via MCP tools) for generating and iterating on UI/UX designs.
- Stitch designs are exported as `stitch_<name>/` folders containing:
  - `screen.png` — visual reference screenshot
  - `code.html` — Tailwind-based HTML prototype
  - `DESIGN.md` — design system notes and tokens
- When implementing a screen, use `code.html` as the source of truth for layout and styling.
- Adapt colors, fonts, and shadows from the stitch export to match the project's Tailwind theme (`globals.css`).
- Convert HTML to React/Next.js components — replace class attributes with `className`, self-close tags, use `next/font` for fonts.
- Keep `stitch_*` folders as design references — do not commit them to production.

## Design System — "The Dreamscape Framework"

### Target Audience
- Children aged **8–14**. The UI must feel expansive, magical, soft, yet structured.

### Colors
- **No borders for sectioning** — use background color shifts between surface tiers.
- Surface hierarchy: `surface` → `surface-container-low` → `surface-container-lowest`.
- Use **glassmorphism** (70% opacity + `backdrop-blur-[20px]`) for floating nav bars / modals.
- Use `primary → primary-container` gradients for CTAs and "Goal Reached" states.
- Never use pure black (`#000000`) for text — use `on-surface` (`#2c2f30`).

### Typography
- **Display & Headlines:** Plus Jakarta Sans
- **Titles & Body:** Be Vietnam Pro
- Always create strong typographic contrast (large headline + small label).

### Elevation & Depth
- Achieve hierarchy via tonal layering, not drop-shadows.
- When shadows are needed, use tinted, diffuse shadows (e.g., `rgba(88,96,254,0.08)`) — never black/grey.
- All main containers: `rounded-2xl` (1rem). Hero/CTA elements: `rounded-3xl` or `rounded-full`.

### Components
- **Buttons — Primary:** gradient bg, `rounded-full`, no border.
- **Buttons — Secondary:** `secondary-container` bg, standard text.
- **Buttons — Tertiary:** ghost style, text-only with lead emoji.
- **Cards:** no dividers, no 1px lines; use spacing (`gap-8` / `space-y-8`) or surface shifts.
- **Emojis:** every card must lead with a high-res emoji in a circle, instead of vector icons.
- **Inputs:** no borders; use toned bg (`surface-container-high`) with `rounded-xl`; focus = 2px ghost border.

### Layout
- Use **intentional asymmetry** — elements may be offset from center for a scrapbook feel.
- Use generous spacing (`p-10` / `px-10` top-level padding).
- When a screen feels full, move content into horizontal-scroll carousels.

## Code Quality

- **Language:** TypeScript everywhere — no `.js` files.
- **Formatting:** Prettier for code formatting.
- **Linting:** ESLint with `next/core-web-vitals` config.
- **Naming:** PascalCase for components, camelCase for functions/variables, kebab-case for files/folders.
- **Imports:** Use `@/` path alias for project imports (e.g., `@/components/...`, `@/lib/...`).
- **Environment Variables:** All secrets in `.env.local`, never committed. Public vars prefixed with `NEXT_PUBLIC_`.

## File Structure

```
app/              # Next.js App Router pages & layouts
components/       # Reusable UI components
  ui/             # shadcn/ui components
lib/              # Utilities, Supabase client, helpers
hooks/            # Custom React hooks
types/            # TypeScript type definitions
public/           # Static assets
```
