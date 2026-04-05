<div align="center">

<h1>📚 SAU EconHub</h1>

<p><strong>A modern blog and question bank platform for Agricultural Economics students at SAU.</strong></p>

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

</div>

---

## 📖 Description

**SAU EconHub** is a full-stack web platform built specifically for students and faculty of the Department of Agricultural Economics at Sher-e-Bangla Agricultural University (SAU). It solves the common problem of scattered, hard-to-find academic resources by providing a single, organized hub.

The platform offers:
- A rich, searchable **blog** where admins can publish guides, lecture notes, and articles.
- A structured **question bank** where past exam papers (midterms, finals, assignments) are archived and accessible by course, semester, and level.
- **AI-powered summaries** for blog posts using Groq's LLM API, saving students reading time.
- A secure **role-based access** system with SAU-gated registration, ensuring only verified students and faculty can access the platform.

> This platform is designed to be **white-labelable** — a single config flag (`SHOW_SAU_GATE`) makes it deployable for any other university with minimal changes.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📝 **Rich Text Blog** | Full WYSIWYG editor (TipTap) with image uploads via Cloudinary |
| 🗄️ **Question Bank** | Organized archive of past exam papers, filterable by level, semester, and course |
| 🤖 **AI Summaries** | On-demand Groq/LLM-powered post summaries for quick comprehension |
| 💬 **Engagement** | Per-post comment threads and emoji reactions for logged-in users |
| 🔍 **Full-Text Search** | Instant search across all blog posts |
| 🎨 **Dark Mode** | System-aware theme toggle powered by `next-themes` |
| 🔐 **Secure Auth** | Supabase Auth with role-based access control (`student` / `admin`) |
| ⚡ **SEO Ready** | Auto-generated sitemap (`/sitemap.xml`) and robots file (`/robots.txt`) |

---

## 🗂️ Folder Structure

```
sau-blog/
├── public/                        # Static assets (favicons, images)
├── src/
│   ├── app/                       # Next.js App Router pages & layouts
│   │   ├── actions/               # Server Actions (data fetching & mutations)
│   │   │   ├── ai.ts              #   → AI summary generation via Groq
│   │   │   ├── interactions.ts    #   → Comments & reactions CRUD
│   │   │   ├── posts.ts           #   → Blog post queries & mutations
│   │   │   ├── search.ts          #   → Full-text search action
│   │   │   └── page.tsx           #   → Question bank actions & UI page
│   │   ├── admin/                 # Admin-only area (post management)
│   │   │   └── posts/             #   → Create / edit posts
│   │   ├── auth/                  # Authentication callback handler
│   │   ├── blog/                  # Public blog listing & detail pages
│   │   │   └── [slug]/            #   → Individual post page (dynamic route)
│   │   ├── dashboard/             # Logged-in user dashboard
│   │   ├── login/                 # Login / registration page
│   │   ├── search/                # Search results page
│   │   ├── layout.tsx             # Root layout (fonts, theme provider, navbar)
│   │   ├── page.tsx               # Homepage
│   │   ├── sitemap.ts             # Auto-generated XML sitemap
│   │   └── robots.ts              # robots.txt rules
│   ├── components/                # Reusable UI components
│   │   ├── blog/                  # Blog-specific components
│   │   │   ├── ai-summary.tsx     #   → AI summary card
│   │   │   ├── comment-section.tsx#   → Comment thread UI
│   │   │   └── reaction-button.tsx#   → Emoji reaction button
│   │   ├── editor/
│   │   │   └── rich-text-editor.tsx # TipTap WYSIWYG editor wrapper
│   │   ├── search/                # Search bar & input components
│   │   ├── navbar.tsx             # Top navigation bar
│   │   ├── theme-provider.tsx     # next-themes provider wrapper
│   │   └── theme-toggle.tsx       # Dark/light mode toggle button
│   ├── lib/                       # Utilities, clients & type definitions
│   │   ├── supabase/
│   │   │   ├── client.ts          #   → Browser-side Supabase client
│   │   │   └── server.ts          #   → Server-side Supabase client (SSR)
│   │   ├── cloudinary-upload.ts   # Cloudinary image upload helper
│   │   ├── cloudinary.ts          # Cloudinary SDK configuration
│   │   ├── types.ts               # Shared TypeScript interfaces & types
│   │   └── utils.ts               # General utility functions (cn, etc.)
│   ├── context/                   # React Context providers
│   ├── config.ts                  # Site-wide config (name, URL, SAU gate flag)
│   └── middleware.ts              # Auth middleware (route protection)
├── .env.local                     # Local environment variables (never commit)
├── .gitignore
├── components.json                # shadcn/ui component registry config
├── next.config.ts                 # Next.js configuration
├── postcss.config.mjs             # PostCSS / Tailwind CSS configuration
├── tailwind.config.ts             # Tailwind CSS theme configuration
├── tsconfig.json                  # TypeScript compiler options
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed before you begin:

| Tool | Version | Link |
|---|---|---|
| Node.js | `v18+` | [nodejs.org](https://nodejs.org/) |
| npm | `v9+` | Bundled with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

You will also need active accounts on:
- **[Supabase](https://supabase.com/)** — for the database and authentication.
- **[Cloudinary](https://cloudinary.com/)** — for image storage and delivery.
- **[Groq](https://console.groq.com/)** — for AI-powered post summaries.

---

### Installation

**1. Clone the repository:**

```bash
git clone https://github.com/your-username/sau-blog.git
cd sau-blog
```

**2. Install dependencies:**

```bash
npm install
```

**3. Set up environment variables:**

Copy the example environment file and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Then open `.env.local` and populate it with your values (see the [Environment Variables](#-environment-variables) table below).

**4. Run the development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

### 🔑 Environment Variables

Create a `.env.local` file in the project root with the following keys:

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anonymous (public) key |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Supabase service role key (server-only, keep secret) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | ✅ | Your Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret (server-only, keep secret) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | ✅ | Cloudinary unsigned upload preset name |
| `GROQ_API_KEY` | ✅ | Groq API key for AI summary generation |

> **⚠️ Warning:** Never commit your `.env.local` file or any secrets to version control. The `.gitignore` is pre-configured to exclude it.

---

## 💻 Usage

### Development

```bash
npm run dev      # Start the Next.js development server on http://localhost:3000
```

### Production Build

```bash
npm run build    # Create an optimized production build
npm run start    # Start the production server
```

### Linting

```bash
npm run lint     # Run ESLint across the codebase
```

### Site Configuration

The main site configuration is in [`src/config.ts`](./src/config.ts):

```typescript
export const siteConfig = {
  name: "SAU EconHub",
  description: "Blogs & Question Bank for Agricultural Economics students at SAU.",
  url: "https://your-domain.com",
};

// Set to false to disable SAU-specific branding and access gate
export const SHOW_SAU_GATE = true;
```

---

## 🗃️ Database Schema (Supabase)

The application uses the following core tables in Supabase:

| Table | Description |
|---|---|
| `profiles` | User profiles with `role` field (`student` or `admin`) |
| `posts` | Blog posts with title, slug, content, cover image, and SEO fields |
| `question_bank` | Exam papers with metadata (level, semester, course, type, year) |
| `comments` | Per-post comment threads linked to `profiles` |
| `reactions` | Per-post emoji reactions (`love`) linked to `profiles` |

> Row Level Security (RLS) policies are managed in your Supabase dashboard. Ensure that `admin` role users have write access to `posts` and `question_bank`.

---

## 🛣️ Roadmap

- [ ] **Email notifications** for new comments and reactions
- [ ] **User profiles** with public-facing pages and activity history
- [ ] **Post tags & categories** for better organization and filtering
- [ ] **Saved/bookmarked posts** for students
- [ ] **Question bank upload** directly from the UI (for admin users)
- [ ] **Multi-university support** with tenant-based configuration
- [ ] **Mobile app** (React Native / Expo)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository.
2. **Create** a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes with a clear message:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push** to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open** a Pull Request against the `main` branch and describe your changes.

### Code Style

- This project uses **ESLint** and **TypeScript** for code quality. Ensure `npm run lint` passes before submitting a PR.
- Follow the existing file and component naming conventions.
- Keep components focused and reusable; place shared logic in `src/lib/`.

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more information.

---

## 🙏 Acknowledgments

This project is built with and is grateful for the following open-source projects:

- **[Next.js](https://nextjs.org/)** — The React framework for production
- **[Supabase](https://supabase.com/)** — Open-source Firebase alternative for database & auth
- **[TipTap](https://tiptap.dev/)** — Headless, extensible rich-text editor
- **[Tailwind CSS](https://tailwindcss.com/)** — A utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com/)** — Re-usable component library built on Radix UI
- **[Cloudinary](https://cloudinary.com/)** — Media management and delivery platform
- **[Groq](https://groq.com/)** — Fast LLM inference for AI-powered summaries
- **[Lucide React](https://lucide.dev/)** — Beautiful & consistent icon set
- **[next-themes](https://github.com/pacocoursey/next-themes)** — Perfect dark mode for Next.js

---

<div align="center">
  <p>Made with ❤️ for the students of <strong>Sher-e-Bangla Agricultural University</strong></p>
</div>
