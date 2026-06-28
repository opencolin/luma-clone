# Luma clone — build progress

Open-source clone of lu.ma. Self-paced `/loop` build. This file is the source of
truth across loop iterations — **read it first, update it last.**

## Stack
- Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- Tailwind CSS v4 (tokens in `app/globals.css` via `@theme`)
- Drizzle ORM + libSQL (local file `luma.db`, no native build)
- Inter via `next/font`, lucide-react icons, zod, date-fns

## Run
- Dev server: `PORT=3100 pnpm dev` (port 3000 is occupied on this machine). Log: `/tmp/luma-dev.log`
- DB: `pnpm db:generate` → `pnpm db:migrate` → `pnpm db:seed` (or `pnpm setup`)
- Browse/screenshot binary: `$HOME/.claude/skills/gstack/browse/dist/browse`
- Get slugs: `echo "SELECT slug,title FROM events;" | sqlite3 -column luma.db`

## Design tokens (use these, don't hardcode hex)
- `bg` #f7f8f9 · `surface` #fff · `ink` #131517 · `ink-secondary` · `ink-tertiary`
- `brand` #e5484d (coral) · `line` hairline borders
- accents: rose/orange/amber/green/teal/blue/indigo/purple
- headings = weight 500, tracking -0.022em (set globally). `.card`, `.glass`, `.text-gradient-brand` helpers.
- `EventCover` generates gradient+pattern covers (theme + pattern: aurora/mesh/rings/grid/confetti)

## Conventions
- Data access in `lib/events.ts`; auth/session in `lib/auth.ts`; dates in `lib/dates.ts`
- Server actions in `app/actions/*.ts`
- Components in `components/` (ui primitives in `components/ui/`)
- Event public URL = `/[slug]` (8-char nanoid)

## DONE
- [x] Scaffold, deps, design system (`globals.css`, `layout.tsx`)
- [x] DB schema (users, sessions, calendars+subs, events, tickets, registrations, eventHosts), migration, seed (10 events / 3 calendars / 6 users)
- [x] Auth/session layer (cookie sessions, findOrCreateUser) — sign-in UI not built yet
- [x] UI primitives: Button/ButtonLink, Avatar/AvatarStack, Logo/LogoMark, Clock, EventCover, MapBlock, NavBar/SiteNav, Footer
- [x] Marketing home `/` (hero + features + CTA) — verified, no console errors
- [x] Event page `/[slug]` (two-column, cover, hosts, date tile, registration card, about, location) — verified
- [x] Registration flow + server action (going/pending/waitlist, capacity, approval, guest cookie) — verified end-to-end, persists to DB

## NEXT (ordered)
1. ~~EventCard + Discover~~ ✅ DONE — verified, no errors
2. ~~Create event~~ ✅ DONE — `createEvent` action (also signs in host); verified end-to-end (fixed: empty capacity/price now preprocessed to undefined)
3. ~~Sign in `/signin`~~ ✅ DONE — passwordless (findOrCreateUser+createSession), redirects to `next`; verified
4. ~~Home dashboard `/home`~~ ✅ DONE — hosting/attending sections, upcoming/past tabs, Manage overlays; verified
   - ~~nav user menu + sign out~~ ✅ DONE — `UserMenu` dropdown + `signOut` action; verified login→dashboard→signout
5. **Manage event** `/[slug]/manage` (host-only; guest list, approve/decline pending regs, stats, copy invite link). Needs approve/decline server actions. Dashboard "Manage" links here (currently 404). **Use explicit child deletes — FK cascade is off.**
6. **Calendar page** `/c/[slug]` (header, subscribe button + action, event list grouped upcoming/past). Linked from discover + event pages (currently 404).
7. Static pages: pricing, terms, privacy, security, help (simple, consistent)
8. `not-found.tsx`, loading states, mobile/responsive pass, a11y pass
9. **Open-source**: README (screenshots, features, setup), LICENSE (MIT), `.env.example`, polish `.gitignore` (ignore `luma.db`), CONTRIBUTING, then `git init` + push to GitHub (gh, account `opencolin`). Then STOP loop + PushNotification.

## Notes
- 403s seen in browse console are from the real luma.com tab (Sentry/Maps), not our app.
- `gh` authenticated as `opencolin`. Repo not yet created.
- **FK cascades are NOT enforced** (SQLite needs `PRAGMA foreign_keys=ON`, not set on libSQL connection). When building event delete/manage, delete child rows (tickets, registrations, eventHosts) explicitly — don't rely on `onDelete: cascade`.
- Working flows confirmed clickable: home → discover → event → register; home → create → new event (auto signs you in).
- Test data cleaned (10 seed events, no orphans).
