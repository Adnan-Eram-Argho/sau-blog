<p align="center">
  <img src="public/android-chrome-512x512.png" alt="SAU EconHub Logo" width="80" />
</p>

<h1 align="center">SAU EconHub</h1>

<p align="center">
  <strong>The Knowledge Hub for Agricultural Economics Students</strong><br/>
  <em>Sher-e-Bangla Agricultural University (SAU), Dhaka, Bangladesh</em>
</p>

<p align="center">
  <a href="https://sau-blogs.vercel.app">🌐 Live Site</a> &nbsp;·&nbsp;
  <a href="https://adnan-eram-argho.github.io/portfolio/">👤 Creator</a> &nbsp;·&nbsp;
  <a href="https://bd.linkedin.com/in/md-adnan-eram-argho">LinkedIn</a>
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16.2.2-black?logo=next.js&logoColor=white" alt="Next.js" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E?logo=supabase&logoColor=white" alt="Supabase" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel" alt="Vercel" /></a>
</p>

---

## ✨ Overview

SAU EconHub is a full-stack academic content platform built with **Next.js 16**, designed to centralize educational content for Agricultural Economics students and faculty at SAU. It combines a rich blog system, AI-powered reading tools, and student engagement features — all optimized for search engines and fast performance.

**Created by [Md. Adnan Eram Argho](https://adnan-eram-argho.github.io/portfolio/)**

---

## 🚀 Key Features

| Area | Features |
|---|---|
| **Blog Authoring** | TipTap rich editor, Cloudinary image uploads, paste-image (Ctrl+V), SEO title/description fields |
| **Blog Reading** | AI-powered summary, AI Bangla translation, KaTeX math rendering, comments, reactions |
| **Navigation** | Previous/Next post linking for guided learning flow |
| **Discovery** | Full-text search, dedicated search page, SEO-optimized sitelinks |
| **SEO** | JSON-LD structured data, canonical URLs, Open Graph/Twitter cards, Google Search Console, dynamic sitemap |
| **Analytics** | Vercel Analytics integration |
| **Security** | Supabase Auth, role-based access (`student` / `admin`) |
| **Platform** | Next.js App Router, dark mode, responsive design, PWA manifest |

---

## 🔍 SEO & Discoverability

The site is comprehensively optimized for search engine visibility:

- **Google Search Console** verified with meta tag
- **JSON-LD structured data** on every page type:
  - `WebSite` schema with `SearchAction` (enables Google sitelinks search box)
  - `Article` schema on blog posts with author, publisher, dates
  - `EducationalOrganization` for the SAU EconHub brand
  - `BreadcrumbList` for breadcrumb rich results
  - `CollectionPage` on the blog listing
- **Canonical URLs** on all pages to prevent duplicate content
- **Open Graph & Twitter Cards** with a branded OG image (1200×630px)
- **Dynamic XML sitemap** generated from published blog posts
- **Robots.txt** with proper crawl directives and Google bot settings
- **Per-page meta robots** (e.g. search results are `noindex` to avoid thin content)
- **`generateStaticParams`** for blog posts — pre-rendered at build time for fast Core Web Vitals
- **Keyword-optimized metadata** for relevant search terms

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript 5 |
| UI | Tailwind CSS 4, shadcn/ui, Lucide icons |
| Editor | TipTap |
| Database & Auth | Supabase (PostgreSQL, Row Level Security) |
| Media Storage | Cloudinary |
| AI | Groq API (Llama) |
| Math Rendering | KaTeX |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

---

## 📁 Project Structure

```text
src/
  app/
    actions/              # Server actions (posts, search, AI, interactions)
    admin/posts/          # Admin post create/edit/list pages
    blog/[slug]/          # Blog detail page (with JSON-LD, generateStaticParams)
    blog/                 # Blog listing page (with CollectionPage schema)
    search/               # Search page (noindex)
    login/                # Authentication page
    not-found.tsx         # Custom 404 page
    robots.ts             # Dynamic robots.txt generation
    sitemap.ts            # Dynamic sitemap.xml generation
    layout.tsx            # Root layout with full SEO metadata
    page.tsx              # Homepage with WebSite + Organization JSON-LD
  components/
    blog/                 # AI summary, translation, comments, reactions
    editor/               # Rich text editor with math + image support
    search/               # Search bar and results UI
    creator-footer.tsx    # Animated creator credit footer
    navbar.tsx            # Responsive navigation with search
  config.ts               # Site config (name, URL, description, author)
  lib/
    supabase/             # Server/client Supabase helpers
    cloudinary*.ts        # Cloudinary upload helpers
    types.ts              # Shared TypeScript interfaces
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js `20+`
- npm `9+`
- Supabase project
- Cloudinary account
- Groq API key

### Installation

```bash
git clone https://github.com/Adnan-Eram-Argho/sau-blog.git
cd sau-blog
npm install
```

### Environment Setup

Copy `.env.local.example` to `.env.local` and configure:

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase public key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service key (server only) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret (server only) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | ✅ | Unsigned upload preset |
| `GROQ_API_KEY` | ✅ | Groq API key for AI features |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 🗄 Database Schema

Core Supabase tables:

| Table | Purpose |
|---|---|
| `profiles` | User profiles with roles (`student` / `admin`) |
| `posts` | Blog posts with SEO fields, content, previous/next linking |
| `comments` | User comments on blog posts |
| `reactions` | Post reactions/likes |
| `question_bank` | Past exam question papers |

To enable previous/next blog linking, run this SQL migration:

```sql
ALTER TABLE public.posts
ADD COLUMN IF NOT EXISTS previous_slug TEXT NULL,
ADD COLUMN IF NOT EXISTS next_slug TEXT NULL;
```

---

## 📐 Math Content Authoring

Write equations in blog posts using:

| Syntax | Type | Example |
|---|---|---|
| `$...$` | Inline math | `$x^2 + y^2 = z^2$` |
| `$$...$$` | Block math | `$$\sum_{i=1}^{n} x_i$$` |
| `\(...\)` | Inline (alt) | `\(E = mc^2\)` |
| `\[...\]` | Block (alt) | `\[\int_0^\infty f(x)\,dx\]` |

KaTeX renders formulas automatically on the blog reading page.

---

## 📜 Recent Updates

### SEO & Analytics
- Vercel Analytics integration
- Google Search Console verification
- JSON-LD structured data (WebSite, Article, Organization, BreadcrumbList, CollectionPage)
- Canonical URLs on all pages
- Open Graph image (1200×630px branded)
- Enhanced robots.txt with Google bot directives
- Search results marked `noindex` to prevent thin content
- `generateStaticParams` for build-time blog pre-rendering
- Expanded keyword-rich metadata for discoverability

### Blog Experience
- Author name and avatar displayed on blog post headers
- Commenter names and avatars shown correctly on new comments (optimistic updates)
- AI blog translation (English → Bangla)
- Math-friendly publishing with KaTeX rendering
- Equation authoring helpers in the editor
- Clipboard image paste support (Ctrl/Cmd+V)
- Optional previous/next blog navigation

### Platform
- Animated creator credit footer with gradient hover effects
- Custom 404 page with navigation
- PWA web manifest linked
- Redirect-safe publish/update flow
- Type-safety cleanups for partial Supabase selects

---

## 📦 Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## ⚙️ Configuration

Site-wide configuration in `src/config.ts`:

```ts
export const siteConfig = {
  name: "SAU EconHub",
  description: "...",
  url: "https://sau-blogs.vercel.app",
  author: {
    name: "Md. Adnan Eram Argho",
    url: "https://bd.linkedin.com/in/md-adnan-eram-argho",
  },
};

export const SHOW_SAU_GATE = true; // Toggle SAU-specific branding
```

---

## 🤝 Contributing

1. Create a feature branch from `main`
2. Make focused, testable changes
3. Run `npm run lint` and `npm run build`
4. Open a pull request with a clear summary

---

## 📄 License

No license file is currently included. Add a `LICENSE` file before public redistribution if needed.

---

<p align="center">
  <strong>Created with ❤️ by <a href="https://adnan-eram-argho.github.io/portfolio/">Adnan Eram Argho</a></strong><br/>
  <em>Sher-e-Bangla Agricultural University, Dhaka</em>
</p>
