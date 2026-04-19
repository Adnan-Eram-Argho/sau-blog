# SAU EconHub

A modern academic content platform for Sher-e-Bangla Agricultural University (SAU), focused on Agricultural Economics blogs, learning resources, and AI-assisted reading support.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

---

## Overview

SAU EconHub is a full-stack Next.js application designed to centralize educational content for students and faculty. It combines:

- A rich blog system with admin publishing tools
- AI-powered article assistance (summary and translation)
- Student engagement tools (comments and reactions)
- Search and SEO-ready public pages

---

## Recent Updates

The following major improvements were recently added:

- **AI blog translation (English -> Bangla)** on individual blog pages
- **Math-friendly blog publishing** using KaTeX rendering (`$...$`, `$$...$$`, `\(...\)`, `\[...\]`)
- **Equation authoring helpers** in the editor (inline/block templates + common symbols)
- **Clipboard image paste support** in New/Edit post pages (Ctrl/Cmd+V)
- **Redirect-safe publish/update flow** to prevent false upload error alerts
- **Optional previous/next blog linking** in admin forms and reader-facing navigation
- **Type-safety cleanups** for partial Supabase selects across search/listing pages

---

## Feature Set

| Area | Features |
|---|---|
| Blog Authoring | TipTap editor, Cloudinary image uploads, paste-image support, SEO fields |
| Blog Reading | AI summary, AI Bangla translation, KaTeX-rendered equations, comments, reactions |
| Navigation | Optional previous/next post linking for guided learning flow |
| Discovery | Full-text search and dedicated search results pages |
| Security | Supabase Auth, role-based access (`student` / `admin`) |
| Platform | Next.js App Router, dark mode, sitemap, robots |

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI:** Tailwind CSS, shadcn/ui, Lucide icons
- **Editor:** TipTap
- **Database/Auth:** Supabase
- **Media:** Cloudinary
- **AI:** Groq API
- **Math Rendering:** KaTeX

---

## Project Structure

```text
src/
  app/
    actions/              # Server actions (posts, search, AI, interactions)
    admin/posts/          # Admin post create/edit/list pages
    blog/[slug]/          # Blog detail page
    blog/                 # Blog list page
    search/               # Search page
  components/
    blog/                 # AI summary, translation content, comments, reactions
    editor/               # Rich text editor
    search/               # Search UI
  lib/
    supabase/             # Server/client Supabase helpers
    cloudinary*.ts        # Cloudinary helpers
    types.ts              # Shared interfaces
```

---

## Getting Started

### 1) Prerequisites

- Node.js `20+`
- npm `9+`
- Supabase project
- Cloudinary account
- Groq API key

### 2) Install

```bash
git clone https://github.com/your-username/sau-blog.git
cd sau-blog
npm install
```

### 3) Environment Setup

Copy `.env.local.example` to `.env.local` and set:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service key (server only) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret (server only) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Yes | Unsigned upload preset |
| `GROQ_API_KEY` | Yes | Groq API key |

### 4) Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Database Notes (Important)

Core tables:

- `profiles`
- `posts`
- `comments`
- `reactions`
- `question_bank`

To enable previous/next blog linking, run this SQL migration in Supabase:

```sql
alter table public.posts
add column if not exists previous_slug text null,
add column if not exists next_slug text null;
```

If not migrated, create/update still works due to backward-compatible fallback, but linked navigation will not persist.

---

## Math Content Authoring Guide

You can write equations in post content using:

- Inline: `$x^2 + y^2 = z^2$`
- Block:
  `$$
  \sum_{i=1}^{n} x_i
  $$`
- Also supported: `\(...\)` and `\[...\]`

KaTeX renders formulas on the blog reading page.

---

## NPM Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

---

## Configuration

Main site config is in `src/config.ts`:

- Site name/URL/description
- `SHOW_SAU_GATE` toggle for SAU-specific gating/branding

---

## Contributing

1. Create a feature branch.
2. Make focused, testable changes.
3. Run `npm run lint` and `npm run build`.
4. Open a pull request with a clear summary.

---

## License

No license file is currently included in this repository. Add a `LICENSE` file before public redistribution if needed.
