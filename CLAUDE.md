@AGENTS.md

# I Don't Need That — Project State

## What This Is
Affiliate marketing platform showcasing novelty products with affiliate links. "Products You Didn't Know You Needed."

## Tech Stack
- **Next.js 16.2.1** (Turbopack) — `params` is `Promise<>`, middleware replaced with `proxy.ts`
- **React 19**, **TypeScript 5**
- **Supabase SSR** (`@supabase/ssr` v0.9.0, `@supabase/supabase-js` v2.100.0) with RLS policies
- **shadcn/ui v4** with **Base UI** (NOT Radix) — use `render` prop instead of `asChild`, add `nativeButton={false}` for Link renders
- **Tailwind CSS v4** with 90s palette: neon-green (#68f70b), hot-pink (#ff6b9d), electric-blue (#00d4ff), bright-yellow (#ffe600), purple (#b44dff)

## Critical Gotchas
- **Cannot export types from `"use server"` modules** — Turbopack limitation. Define types in consuming files via `import type { Database }`.
- **Supabase types need `Relationships` field** on all tables in `src/types/database.ts` (required by supabase-js v2.100).
- **Supabase `select("*, categories(name)")` type inference is broken** — use explicit return type annotations with `as unknown as` casts.
- **Base UI Button + Link**: Must use `render={<Link href="..." />}` and `nativeButton={false}`.
- **Supabase free tier auto-pauses** — if `ENOTFOUND` errors appear, restore project from Supabase dashboard.

## Architecture

### Route Groups
- `src/app/(site)/` — Public-facing pages (homepage, products, categories)
- `src/app/admin/` — Admin panel (auth-guarded via `admin_users` table check in layout)

### Key Directories
```
src/
├── app/
│   ├── (site)/           # Public site
│   │   ├── page.tsx      # Homepage (hero, featured, categories, recent)
│   │   ├── products/     # Product listing + [slug] detail
│   │   └── categories/   # [slug] category pages
│   ├── admin/            # Admin panel
│   │   ├── page.tsx      # Dashboard (stats, charts, recent products)
│   │   ├── products/     # CRUD + new + [id]/edit
│   │   ├── categories/   # Categories manager
│   │   ├── tags/         # Tags manager
│   │   ├── analytics/    # Click analytics (charts, device, country)
│   │   └── settings/     # Site settings
│   └── api/click/        # Click tracking endpoint
├── components/
│   ├── admin/            # Admin components
│   │   ├── admin-shell.tsx        # Sidebar nav
│   │   ├── products-table.tsx     # Products list with inline toggles
│   │   ├── product-form.tsx       # Product create/edit form
│   │   ├── categories-manager.tsx # Categories CRUD with dialogs
│   │   ├── tags-manager.tsx       # Tags CRUD with chip + table view
│   │   └── settings-form.tsx      # Site settings form
│   ├── site/             # Public site components
│   │   ├── site-header.tsx        # Dynamic header (uses site_name setting)
│   │   ├── site-footer.tsx        # Dynamic footer (settings + social links)
│   │   ├── product-card.tsx       # Product card (respects show_prices)
│   │   └── affiliate-button.tsx   # Click-tracked affiliate link
│   └── ui/               # shadcn/ui primitives
├── lib/
│   ├── actions/           # Server Actions
│   │   ├── products.ts    # Products CRUD + togglePublished/Featured
│   │   ├── categories.ts  # Categories CRUD + toggleActive
│   │   ├── tags.ts        # Tags CRUD
│   │   ├── dashboard.ts   # Dashboard stats (parallel queries)
│   │   ├── analytics.ts   # Click aggregation (day, product, device, country)
│   │   ├── settings.ts    # Site settings CRUD (key-value in site_settings table)
│   │   └── public.ts      # Public data fetching (published/featured/by-category)
│   └── supabase/          # Supabase client (server + client)
└── types/
    └── database.ts        # Supabase Database types
```

## Design Standards

### Status Toggle Iconography (Unified Pattern)
All status toggles across the admin panel use the same colored pill pattern:
- **Active/Live/On** → `border-neon-green/40 bg-neon-green/10 text-neon-green-dark` + Eye icon
- **Inactive/Draft/Off** → `border-orange-300/40 bg-orange-50 text-orange-600` + EyeOff icon
- **Featured** → `border-bright-yellow/40 bg-bright-yellow/10 text-yellow-700` + Star icon

Applied in: `products-table.tsx`, `product-form.tsx`, `categories-manager.tsx`, `settings-form.tsx`, `admin/page.tsx`

### Settings Integration
All admin settings from `site_settings` table are reflected in the public frontend:
- `site_name` → header + footer branding
- `site_description` → footer tagline + homepage hero
- `footer_text` → custom footer message (falls back to affiliate disclaimer)
- `social_twitter` / `social_instagram` → footer social links
- `show_prices` → controls price visibility on product cards + detail pages

## Git Workflow
- Working branch: `claude/focused-borg` (worktree at `.claude/worktrees/focused-borg`)
- Main repo at: `/Users/manyplaces/Desktop/PROJECTS/idontneedthat`
- To merge: `cd /Users/manyplaces/Desktop/PROJECTS/idontneedthat && git merge claude/focused-borg`
- Cannot `git checkout main` from worktree — must merge from main repo directory

## Completed Phases
1. ~~Foundation + Supabase setup~~
2. ~~Admin auth guard~~
3. ~~Products CRUD (create, edit, delete, publish/unpublish, feature/unfeature)~~
4. ~~Categories + Tags CRUD~~
5. ~~Admin Dashboard (stat cards, click metrics, recent products)~~
6. ~~Analytics + Settings pages~~
7. ~~Public-facing site (homepage, products, categories, click tracking)~~
8. ~~UX improvements (product status banners, inline toggles)~~
9. ~~Status iconography standardization across admin~~
10. ~~Settings wired to frontend + missing "Add" buttons~~

## Potential Next Steps
- Mobile navigation (hamburger menu for public site)
- Image upload (currently URL-based)
- Product tags display on public site
- Search / filtering on products page
- Pagination (using `products_per_page` setting)
- SEO metadata from settings
- Dark mode toggle
- Product sorting (by date, price, popularity)
- Bulk operations in admin (bulk publish/unpublish/delete)
- Drag-and-drop category reordering (display_order)
