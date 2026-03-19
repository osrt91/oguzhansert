# oguzhansert.dev — Platform Design Spec

**Date:** 2026-03-19
**Status:** Approved
**Domain:** oguzhansert.dev

## Overview

Transform the static Dillion Verma portfolio template (MIT license) into a full CMS-backed, bilingual (TR/EN) personal platform with admin panel, deployed on existing Hostinger VPS alongside kismetplastik.com.

## Architecture

```
VPS (Hostinger — Ubuntu 24.04)
├── Traefik (reverse proxy, SSL/TLS)
│   ├── kismetplastik.com → Next.js :3000
│   ├── supabase.kismetplastik.com → Supabase :8443
│   ├── oguzhansert.dev → Next.js :3001
│   └── supabase.oguzhansert.dev → Supabase :8444
├── kismetplastik Supabase (existing Docker stack)
├── oguzhansert Supabase (NEW isolated Docker stack)
├── kismetplastik Next.js (PM2 — existing)
└── oguzhansert Next.js (PM2 — new)
```

**Key decisions:**
- Separate Supabase Docker instance (full isolation from kismetplastik)
- Same VPS, Traefik handles multi-domain routing
- PM2 for process management
- Cloudflare for DNS + WAF + caching

## Sub-Projects (Build Order)

| # | Sub-Project | Depends On | Description |
|---|-------------|-----------|-------------|
| 1 | Database & Supabase | — | Docker instance, schema, RLS, storage |
| 2 | i18n Infrastructure | — | next-intl, locale routing, auto-detect |
| 3 | Admin Panel | 1 | Auth, dashboard, all CMS modules |
| 4 | Frontend Refactor | 1, 2 | Replace static data with Supabase, i18n all pages |
| 5 | VPS Deploy + Cloudflare | 1-4 | Traefik config, PM2, DNS, SSL |
| 6 | Design Customization | 5 | Brand identity, unique look (future) |

---

## Sub-Project 1: Database & Supabase

### Supabase Instance

- Separate Docker Compose stack on VPS (port range 8444+)
- Subdomain: `supabase.oguzhansert.dev`
- Traefik labels for SSL termination
- Isolated from kismetplastik Supabase entirely

### Database Schema (10 tables + 1 view)

#### `site_settings` — Key-value site configuration
```sql
CREATE TABLE site_settings (
  key TEXT NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  locale TEXT NOT NULL DEFAULT 'tr',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (key, locale)
);
```
Keys: `site_title`, `site_description`, `logo_url`, `favicon_url`, `ga_id`, `gtm_id`, `fb_pixel_id`, `tiktok_pixel_id`, `clarity_id`, `og_default_image`, `contact_email`, `resume_pdf_url`

#### `profile` — About/bio information (per locale)
```sql
CREATE TABLE profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  name TEXT NOT NULL,
  initials TEXT,
  title TEXT,
  location TEXT,
  location_link TEXT,
  description TEXT,
  summary TEXT,
  avatar_url TEXT,
  resume_pdf_url TEXT,
  email TEXT,
  phone TEXT,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(locale)
);
```

#### `skills` — Technical skills (language-independent)
```sql
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_name TEXT,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `work_experience` — Work history (per locale)
```sql
CREATE TABLE work_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  company TEXT NOT NULL,
  title TEXT NOT NULL,
  period TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  url TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `education` — Education history (per locale)
```sql
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  school TEXT NOT NULL,
  degree TEXT,
  period TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  url TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `projects` — Portfolio projects (per locale)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  url TEXT,
  source_url TEXT,
  technologies TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `blog_posts` — Blog articles (per locale)
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  cover_image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(locale, slug)
);
```

#### `gallery_images` — Portfolio gallery (language-independent)
```sql
CREATE TABLE gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `hackathons` — Events & hackathons (per locale)
```sql
CREATE TABLE hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT,
  location TEXT,
  url TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `seo_metadata` — Per-page SEO management
```sql
CREATE TABLE seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale TEXT NOT NULL,
  page_slug TEXT NOT NULL,
  title TEXT,
  description TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  canonical_url TEXT,
  no_index BOOLEAN DEFAULT false,
  json_ld JSONB,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(locale, page_slug)
);
```

#### `redirects` — URL redirect management
```sql
CREATE TABLE redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL UNIQUE,
  destination TEXT NOT NULL,
  status_code INTEGER DEFAULT 301,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### RLS Policies

```sql
-- All tables: public read for visible/published content
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read visible" ON skills FOR SELECT USING (visible = true);

-- blog_posts: public read only published
CREATE POLICY "Public read published" ON blog_posts FOR SELECT USING (published = true);

-- All tables: service_role has full access (admin API uses service_role key)
-- No INSERT/UPDATE/DELETE policies for anon role
```

Pattern: Same RLS approach for all 10 tables. Public `SELECT` with visibility filter. Write operations only through service_role (admin API).

### Supabase Storage Buckets

| Bucket | Purpose | Public |
|--------|---------|--------|
| `avatars` | Profile avatar images | Yes |
| `logos` | Company/school logos | Yes |
| `projects` | Project screenshots | Yes |
| `blog` | Blog post images | Yes |
| `gallery` | Gallery images | Yes |
| `documents` | CV/Resume PDFs | Yes |
| `site` | Favicon, OG images, general | Yes |

---

## Sub-Project 2: i18n Infrastructure

### Library: next-intl

**Routing:**
- `/tr/hakkimda`, `/tr/projeler`, `/tr/blog`
- `/en/about`, `/en/projects`, `/en/blog`

**Auto-detection (middleware):**
1. Check cookie `NEXT_LOCALE` (user preference)
2. Check `Accept-Language` header (browser/system language)
3. Check Cloudflare `CF-IPCountry` header (geo-based)
4. If country = TR → redirect to `/tr/`
5. Else → redirect to `/en/`

**URL Slug Mapping:**
| TR | EN |
|----|-----|
| `/tr/hakkimda` | `/en/about` |
| `/tr/projeler` | `/en/projects` |
| `/tr/yetenekler` | `/en/skills` |
| `/tr/blog` | `/en/blog` |
| `/tr/iletisim` | `/en/contact` |
| `/tr/galeri` | `/en/gallery` |

**Static UI translations:** JSON files (`messages/tr.json`, `messages/en.json`)
**Dynamic content translations:** `locale` column in database tables

---

## Sub-Project 3: Admin Panel

### Auth: Cookie-based (kismetplastik model)
- `ADMIN_SECRET` env var (min 32 chars)
- SHA-256 hashed, timing-safe comparison
- httpOnly cookie, secure in production
- Admin routes: `/admin/*` (no locale prefix, Turkish-only internal tool)
- Rate-limited login endpoint (5 attempts/min)

### Admin Modules

| Module | Table(s) | Features |
|--------|----------|----------|
| Dashboard | all | Overview stats, quick links |
| Profil | profile | Edit bio per locale, avatar upload |
| Yetenekler | skills | CRUD, drag-sort, visibility toggle |
| Is Deneyimi | work_experience | CRUD per locale, logo upload, sort |
| Egitim | education | CRUD per locale, logo upload, sort |
| Projeler | projects | CRUD per locale, image upload, featured toggle |
| Blog | blog_posts | CRUD per locale, MDX editor, publish/draft, tags |
| Galeri | gallery_images | Upload, categorize, sort, visibility |
| Hackathonlar | hackathons | CRUD per locale, sort |
| SEO | seo_metadata | Per-page meta edit, OG preview |
| Yonlendirmeler | redirects | Add/edit/delete redirects |
| Site Ayarlari | site_settings | Title, description, analytics IDs, logos |
| CV Yukleme | storage | Upload/replace PDF per locale |

### Admin API Routes

```
POST   /api/admin/auth          — Login
DELETE /api/admin/auth          — Logout
GET    /api/admin/[table]       — List items
POST   /api/admin/[table]       — Create item
PUT    /api/admin/[table]/[id]  — Update item
DELETE /api/admin/[table]/[id]  — Delete item
POST   /api/admin/upload        — File upload to storage
POST   /api/admin/revalidate    — Trigger ISR revalidation
```

All admin API routes: `checkAuth(request)` → 401 if invalid.

---

## Sub-Project 4: Frontend Refactor

### Data Fetching (Server Components)
- Replace `import { DATA } from "@/data/resume"` with Supabase queries
- All fetching in RSC (no client-side Supabase calls for public pages)
- ISR with `revalidate = 60` (60 second cache)
- Admin panel triggers `/api/admin/revalidate` on content change

### Pages to Refactor
- Homepage: Fetch profile, skills, work, education, projects, hackathons
- Blog listing: Fetch published blog_posts
- Blog detail: Fetch single blog_post by slug+locale
- All pages: Fetch seo_metadata for meta tags

### Responsive Improvements
- Audit all breakpoints (sm/md/lg/xl)
- Test on: iPhone SE, iPhone 14, iPad, iPad Pro, Desktop (1080p, 1440p)
- Touch targets min 44px
- No horizontal scroll on any device

---

## Sub-Project 5: VPS Deploy + Cloudflare

### Traefik Configuration
- New router for `oguzhansert.dev` and `www.oguzhansert.dev`
- New router for `supabase.oguzhansert.dev`
- Let's Encrypt SSL (same as kismetplastik)

### PM2 Configuration
- New process: `oguzhansert` on port 3001
- Ecosystem file entry

### Cloudflare
- Add `oguzhansert.dev` zone
- DNS A records → VPS IP (proxied)
- `supabase.oguzhansert.dev` → VPS IP (DNS only, no proxy for WebSocket)
- WAF rules (same as kismetplastik)
- Cache rules for static assets
- Page rules for `/admin/*` (no cache)

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://supabase.oguzhansert.dev
NEXT_PUBLIC_SUPABASE_ANON_KEY=<generated>
SUPABASE_SERVICE_ROLE_KEY=<generated>
ADMIN_SECRET=<min 32 chars>
NEXT_PUBLIC_BASE_URL=https://oguzhansert.dev
NEXT_PUBLIC_GA_ID=<optional>
```

---

## Performance Strategy

| Technique | Implementation |
|-----------|---------------|
| ISR | `revalidate = 60` on all public pages |
| On-demand revalidation | Admin panel triggers `revalidatePath()` on content change |
| Image optimization | Next.js Image + Supabase Storage |
| Font loading | Geist (WOFF2, `font-display: swap`) |
| Code splitting | Dynamic imports for non-critical components |
| Static assets | `Cache-Control: max-age=31536000, immutable` |
| Compression | `compress: true` in next.config |

## Security

| Measure | Implementation |
|---------|---------------|
| Security headers | CSP, HSTS, X-Frame-Options, X-XSS (already in next.config.mjs) |
| Admin auth | Cookie-based, SHA-256 hashed, timing-safe compare |
| Rate limiting | In-memory, 5 req/min on login endpoint |
| RLS | All tables, public read visible only |
| Service role | Server-side only, never exposed to client |
| Input sanitization | All admin inputs validated before DB write |
| File upload | Type/size validation, Supabase Storage policies |
| HTTPS | Traefik + Let's Encrypt + Cloudflare |
| WAF | Cloudflare managed rules |

## SEO

| Feature | Implementation |
|---------|---------------|
| Meta tags | Per-page from `seo_metadata` table |
| Open Graph | Dynamic OG images + admin-managed OG data |
| JSON-LD | Person, WebSite, Article schemas from DB |
| Sitemap | Dynamic `sitemap.ts` from all published content |
| Robots.txt | Dynamic `robots.ts` |
| Canonical URLs | Per-page, admin-managed |
| hreflang | `<link rel="alternate" hreflang="tr"/"en">` on all pages |
| Redirects | Admin-managed 301/302 redirects via middleware |
