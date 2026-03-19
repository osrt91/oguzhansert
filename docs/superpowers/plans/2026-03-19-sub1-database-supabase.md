# Sub-Project 1: Database & Supabase Foundation

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up Supabase client infrastructure, database schema (SQL migration), TypeScript types, seed script, and environment configuration — everything needed before admin panel or frontend can connect to data.

**Architecture:** Supabase client libraries follow the kismetplastik triple-client pattern (general, server, admin). Schema defined in SQL migration files. Types hand-written to match schema. Seed script imports existing resume.tsx template data as placeholder content.

**Tech Stack:** @supabase/supabase-js, TypeScript, Zod (validation), Node.js (seed script)

**Spec:** `docs/superpowers/specs/2026-03-19-oguzhansert-platform-design.md`

**Model routing:** All tasks in this plan use Opus (backend/DB work).

---

## File Structure

```
src/
├── lib/
│   ├── supabase.ts              # CREATE — Singleton client (general use)
│   ├── supabase-server.ts       # CREATE — Server client (async cookies)
│   ├── supabase-admin.ts        # CREATE — Admin client (service_role)
│   ├── auth.ts                  # CREATE — Admin auth helpers (checkAuth, hashSecret)
│   └── rate-limit.ts            # CREATE — In-memory rate limiter
├── types/
│   └── database.ts              # CREATE — TypeScript types for all tables
docs/
├── supabase-schema.sql          # CREATE — Full schema (tables, indexes, triggers, RLS)
├── supabase-storage.sql         # CREATE — Storage bucket setup
scripts/
├── seed-data.mjs                # CREATE — Seed script for initial data
.env.example                     # CREATE — Environment variable template
```

---

## Chunk 1: Schema & Environment

### Task 1: Create environment template

**Files:**
- Create: `.env.example`

- [ ] **Step 1: Create .env.example**

```env
# Supabase (self-hosted on VPS)
NEXT_PUBLIC_SUPABASE_URL=https://supabase.oguzhansert.dev
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Admin Auth
ADMIN_SECRET=your-admin-secret-min-32-characters-long

# Site
NEXT_PUBLIC_BASE_URL=https://oguzhansert.dev

# Analytics (optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_GTM_ID=
NEXT_PUBLIC_FB_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_CLARITY_ID=
```

- [ ] **Step 2: Create .env.local for development**

```env
# Local development — Supabase CLI or cloud instance
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-will-be-replaced
SUPABASE_SERVICE_ROLE_KEY=placeholder-will-be-replaced
ADMIN_SECRET=dev-admin-secret-min-32-characters!!
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- [ ] **Step 3: Verify .env.local is in .gitignore**

Run: `grep ".env.local" .gitignore`
Expected: Match found (already in .gitignore)

- [ ] **Step 4: Commit**

```bash
git add .env.example
git commit -m "chore: add environment variable template"
```

---

### Task 2: Create full database schema SQL

**Files:**
- Create: `docs/supabase-schema.sql`

- [ ] **Step 1: Write complete schema file**

The file must contain in order:
1. `update_updated_at()` trigger function
2. All 11 tables with locale CHECK constraints
3. All indexes
4. All `updated_at` triggers applied to tables
5. All RLS policies enabled + SELECT policies

Tables (with review fixes applied):
- `site_settings` (key, locale) PK
- `profile` (locale UNIQUE, social_links JSONB)
- `skills` (category_key TEXT, no locale)
- `work_experience` (locale, start_date DATE, end_date DATE nullable, period TEXT)
- `education` (locale, start_date DATE, end_date DATE nullable, period TEXT)
- `projects` (locale, technologies TEXT[], featured BOOLEAN)
- `blog_posts` (locale+slug UNIQUE, published BOOLEAN, tags TEXT[])
- `gallery_images` (locale, category)
- `hackathons` (locale, start_date DATE)
- `seo_metadata` (locale+page_slug UNIQUE, json_ld JSONB)
- `redirects` (source UNIQUE, status_code INTEGER)

- [ ] **Step 2: Verify SQL syntax**

Run: `head -20 docs/supabase-schema.sql` to confirm file structure.

- [ ] **Step 3: Commit**

```bash
git add docs/supabase-schema.sql
git commit -m "feat: add complete database schema with RLS, indexes, and triggers"
```

---

### Task 3: Create storage bucket setup SQL

**Files:**
- Create: `docs/supabase-storage.sql`

- [ ] **Step 1: Write storage SQL**

Create 7 public buckets: avatars, logos, projects, blog, gallery, documents, site.
Each bucket: public access for reads, file size limits (5MB images, 10MB PDFs).

- [ ] **Step 2: Commit**

```bash
git add docs/supabase-storage.sql
git commit -m "feat: add Supabase storage bucket configuration"
```

---

## Chunk 2: Supabase Client Libraries

### Task 4: Install Supabase dependency

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install @supabase/supabase-js**

Run: `pnpm add @supabase/supabase-js`

- [ ] **Step 2: Install sonner for admin toast notifications**

Run: `pnpm add sonner`

- [ ] **Step 3: Verify installation**

Run: `pnpm ls @supabase/supabase-js sonner`
Expected: Both packages listed with versions

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add supabase-js and sonner dependencies"
```

---

### Task 5: Create Supabase singleton client

**Files:**
- Create: `src/lib/supabase.ts`

- [ ] **Step 1: Write singleton client**

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

let client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase.ts
git commit -m "feat: add Supabase singleton client"
```

---

### Task 6: Create Supabase server client

**Files:**
- Create: `src/lib/supabase-server.ts`

- [ ] **Step 1: Write server client with async cookies**

```typescript
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function supabaseServer() {
  const cookieStore = await cookies();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase-server.ts
git commit -m "feat: add Supabase server client with cookie support"
```

---

### Task 7: Create Supabase admin client

**Files:**
- Create: `src/lib/supabase-admin.ts`

- [ ] **Step 1: Write admin client with service_role key**

```typescript
import { createClient } from "@supabase/supabase-js";

let adminClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (!adminClient) {
    adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
      }
    );
  }
  return adminClient;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/supabase-admin.ts
git commit -m "feat: add Supabase admin client with service_role"
```

---

## Chunk 3: Auth & Utilities

### Task 8: Create admin auth helpers

**Files:**
- Create: `src/lib/auth.ts`

- [ ] **Step 1: Write auth module**

Port from kismetplastik pattern:
- `timingSafeCompare(a, b)` — crypto.timingSafeEqual wrapper
- `hashSecret(secret)` — SHA-256 hash of ADMIN_SECRET
- `checkAuth(request)` — extract admin-token cookie, compare against hash, return 401 if invalid
- `sanitizeSearchInput(input)` — allowlist regex, truncate to 100 chars

- [ ] **Step 2: Commit**

```bash
git add src/lib/auth.ts
git commit -m "feat: add admin auth helpers with timing-safe comparison"
```

---

### Task 9: Create rate limiter

**Files:**
- Create: `src/lib/rate-limit.ts`

- [ ] **Step 1: Write rate limiter**

Port from kismetplastik:
- `rateLimit(key, { limit, windowMs })` — returns `{ ok, remaining }`
- In-memory Map with sliding window
- Auto-cleanup every 60s

- [ ] **Step 2: Commit**

```bash
git add src/lib/rate-limit.ts
git commit -m "feat: add in-memory rate limiter"
```

---

## Chunk 4: TypeScript Types & Seed Script

### Task 10: Create database TypeScript types

**Files:**
- Create: `src/types/database.ts`

- [ ] **Step 1: Write types matching schema**

Define interfaces for all 11 tables:
- `SiteSettings`, `Profile`, `Skill`, `WorkExperience`, `Education`
- `Project`, `BlogPost`, `GalleryImage`, `Hackathon`
- `SeoMetadata`, `Redirect`
- `Locale` type: `"tr" | "en"`
- `ApiResponse<T>` type: `{ success: boolean; data?: T; error?: string; message?: string }`

- [ ] **Step 2: Commit**

```bash
git add src/types/database.ts
git commit -m "feat: add TypeScript types for all database tables"
```

---

### Task 11: Create seed script

**Files:**
- Create: `scripts/seed-data.mjs`

- [ ] **Step 1: Write seed script**

The script should:
1. Read SUPABASE_URL and SERVICE_ROLE_KEY from env
2. Insert placeholder profile data for TR and EN
3. Insert skills from current resume.tsx (React, Next.js, TypeScript, etc.)
4. Insert placeholder work_experience, education, projects, hackathons
5. Insert default site_settings (site_title, etc.)
6. Insert default seo_metadata for all pages
7. Log progress to console

Run: `node scripts/seed-data.mjs`

- [ ] **Step 2: Commit**

```bash
git add scripts/seed-data.mjs
git commit -m "feat: add database seed script with placeholder data"
```

---

### Task 12: Update next.config.mjs CSP for Supabase

**Files:**
- Modify: `next.config.mjs`

- [ ] **Step 1: Add Supabase origins to CSP**

Update Content-Security-Policy:
- `img-src`: add `https://supabase.oguzhansert.dev`
- `connect-src`: add `https://supabase.oguzhansert.dev wss://supabase.oguzhansert.dev`

Also add `poweredByHeader: false` if not present (already added in previous session).

- [ ] **Step 2: Add Supabase remote image pattern**

Add to `images.remotePatterns`:
```javascript
{ protocol: "https", hostname: "supabase.oguzhansert.dev", pathname: "/storage/v1/object/public/**" }
```

- [ ] **Step 3: Verify config is valid**

Run: `pnpm build` (should not error on config)

- [ ] **Step 4: Commit**

```bash
git add next.config.mjs
git commit -m "feat: update CSP and image config for Supabase integration"
```

---

## Summary

| Task | Description | Files | Est. |
|------|-------------|-------|------|
| 1 | Environment template | .env.example, .env.local | 2 min |
| 2 | Database schema SQL | docs/supabase-schema.sql | 5 min |
| 3 | Storage buckets SQL | docs/supabase-storage.sql | 2 min |
| 4 | Install dependencies | package.json | 1 min |
| 5 | Supabase singleton client | src/lib/supabase.ts | 2 min |
| 6 | Supabase server client | src/lib/supabase-server.ts | 2 min |
| 7 | Supabase admin client | src/lib/supabase-admin.ts | 2 min |
| 8 | Admin auth helpers | src/lib/auth.ts | 3 min |
| 9 | Rate limiter | src/lib/rate-limit.ts | 2 min |
| 10 | TypeScript types | src/types/database.ts | 3 min |
| 11 | Seed script | scripts/seed-data.mjs | 5 min |
| 12 | Update next.config CSP | next.config.mjs | 2 min |
| **Total** | | **12 files** | **~30 min** |

**After this plan:** Sub-Project 2 (i18n) plan will be written next.
