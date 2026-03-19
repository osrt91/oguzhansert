# Sub-Project 6: Design Customization — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Dillion Verma template data with Oğuzhan Sert's personal brand — Warm Orange color palette, real content, section adjustments.

**Architecture:** Color variables in globals.css, i18n strings in messages/*.json, fallback data in resume.tsx. Page.tsx controls section rendering. Navbar reads social links from profile.

**Tech Stack:** Next.js 16, Tailwind CSS 4, next-intl, shadcn/ui

**Spec:** `docs/superpowers/specs/2026-03-20-design-customization.md`

---

## File Structure

```
src/
├── app/
│   ├── globals.css              # MODIFY — color variables (light + dark)
│   └── [locale]/
│       └── page.tsx             # MODIFY — remove hackathons, rename work section
├── components/
│   ├── icons.tsx                # MODIFY — add Instagram icon
│   ├── navbar.tsx               # MODIFY — add Instagram to socialIconMap
│   └── section/
│       └── contact-section.tsx  # MODIFY — update contact text for TR/EN
├── data/
│   └── resume.tsx               # MODIFY — replace all Dillion Verma data
messages/
├── tr.json                      # MODIFY — update section titles
├── en.json                      # MODIFY — update section titles
```

---

## Chunk 1: Color Palette

### Task 1: Apply Warm Orange palette to globals.css

**Files:**
- Modify: `src/app/globals.css:45-112`

- [ ] **Step 1: Replace `:root` (light mode) CSS variables**

Replace the `:root` block with Warm Orange light palette using oklch values:

```css
:root {
  --radius: 0.625rem;
  --background: oklch(0.985 0.002 75);
  --foreground: oklch(0.147 0.004 49.25);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.147 0.004 49.25);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.147 0.004 49.25);
  --primary: oklch(0.705 0.191 47.6);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.97 0.001 75);
  --secondary-foreground: oklch(0.147 0.004 49.25);
  --muted: oklch(0.97 0.001 75);
  --muted-foreground: oklch(0.553 0.013 58.07);
  --accent: oklch(0.975 0.016 73.68);
  --accent-foreground: oklch(0.586 0.2 41.12);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.923 0.003 48.72);
  --input: oklch(0.923 0.003 48.72);
  --ring: oklch(0.705 0.191 47.6);
  --chart-1: oklch(0.705 0.191 47.6);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --sidebar: oklch(0.985 0.002 75);
  --sidebar-foreground: oklch(0.147 0.004 49.25);
  --sidebar-primary: oklch(0.705 0.191 47.6);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.97 0.001 75);
  --sidebar-accent-foreground: oklch(0.147 0.004 49.25);
  --sidebar-border: oklch(0.923 0.003 48.72);
  --sidebar-ring: oklch(0.705 0.191 47.6);
}
```

- [ ] **Step 2: Replace `.dark` (dark mode) CSS variables**

```css
.dark {
  --background: oklch(0.107 0.005 49.25);
  --foreground: oklch(0.985 0.002 75);
  --card: oklch(0.147 0.004 49.25);
  --card-foreground: oklch(0.985 0.002 75);
  --popover: oklch(0.147 0.004 49.25);
  --popover-foreground: oklch(0.985 0.002 75);
  --primary: oklch(0.705 0.191 47.6);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.216 0.006 56.04);
  --secondary-foreground: oklch(0.985 0.002 75);
  --muted: oklch(0.216 0.006 56.04);
  --muted-foreground: oklch(0.709 0.01 56.26);
  --accent: oklch(0.216 0.006 56.04);
  --accent-foreground: oklch(0.985 0.002 75);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.705 0.191 47.6);
  --chart-1: oklch(0.705 0.191 47.6);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.147 0.004 49.25);
  --sidebar-foreground: oklch(0.985 0.002 75);
  --sidebar-primary: oklch(0.705 0.191 47.6);
  --sidebar-primary-foreground: oklch(1 0 0);
  --sidebar-accent: oklch(0.216 0.006 56.04);
  --sidebar-accent-foreground: oklch(0.985 0.002 75);
  --sidebar-border: oklch(1 0 0 / 10%);
  --sidebar-ring: oklch(0.705 0.191 47.6);
}
```

- [ ] **Step 3: Update blockquote accent color**

In the `@layer base` section, change the blockquote border from `border-amber-500` to `border-orange-500`:

```css
.prose blockquote {
  @apply border-l-4 border-orange-500! pl-4 italic bg-muted/50 p-4 rounded-md rounded-l-none;
}
```

- [ ] **Step 4: Update contact link color in contact-section.tsx**

Change `text-blue-500` to `text-primary` in `src/components/section/contact-section.tsx`:

```tsx
className="text-primary hover:underline underline-offset-4..."
```

- [ ] **Step 5: Verify colors**

Run: `pnpm build`
Expected: Build passes

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/components/section/contact-section.tsx
git commit -m "feat: apply Warm Orange color palette (light + dark)"
```

---

## Chunk 2: i18n Strings & Icons

### Task 2: Update i18n message files

**Files:**
- Modify: `messages/tr.json`
- Modify: `messages/en.json`

- [ ] **Step 1: Update tr.json**

Change `"work_title": "İş Deneyimi"` → `"work_title": "Markalarım"`
Remove `"hackathons_title"` line.

- [ ] **Step 2: Update en.json**

Change `"work_title": "Work Experience"` → `"work_title": "My Brands"`
Remove `"hackathons_title"` line.

- [ ] **Step 3: Commit**

```bash
git add messages/tr.json messages/en.json
git commit -m "feat: update section titles — Markalarım/My Brands, remove hackathons"
```

---

### Task 3: Add Instagram icon

**Files:**
- Modify: `src/components/icons.tsx`
- Modify: `src/components/navbar.tsx`

- [ ] **Step 1: Add Instagram SVG to icons.tsx**

Add after the `github` icon definition:

```tsx
instagram: (props: IconProps) => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
    <title>Instagram</title>
    <path
      fill="currentColor"
      d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.668 1.0745-1.3364 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8504.6165 19.0872.321 18.2143.12 16.9366.0635 15.6588.0075 15.2479-.006 11.9999 0 8.7519.006 8.3415.0204 7.0695.084m.2115 21.8321c-1.1696-.0533-1.8042-.2481-2.2268-.4124-.5596-.2176-.9585-.4781-1.3781-.8985-.4199-.4204-.6804-.8186-.8981-1.3782-.1644-.4226-.3592-1.057-.4126-2.2276-.0577-1.2662-.0694-1.6462-.0757-4.8523-.006-3.2063.005-3.5854.0533-4.8528.0532-1.1705.2485-1.8037.4119-2.2263.2183-.5598.4781-.9584.8983-1.3785.4203-.42.8183-.6803 1.378-.8983.4232-.164 1.0573-.359 2.2272-.4126 1.266-.058 1.646-.0694 4.8517-.076 3.2074-.006 3.5877.005 4.854.0534 1.1706.053 1.8038.2485 2.227.4119.5598.2183.9585.4781 1.3782.8983.4202.4202.6802.8183.8983 1.378.1645.4233.3593 1.0575.4127 2.2274.057 1.2664.0696 1.6462.076 4.8526.006 3.2071-.005 3.5868-.0536 4.853-.0533 1.1697-.2487 1.8039-.412 2.2269-.2182.5597-.4781.9585-.8982 1.378-.4197.4195-.8186.6804-1.3783.8982-.4228.164-1.057.3591-2.2272.4125-1.2662.0577-1.6462.0694-4.8525.0757-3.2062.0063-3.5867-.0049-4.8529-.0533m9.7415-13.3597c-.0085 1.116.895 2.0245 2.0114 2.0331 1.1159.008 2.024-.896 2.032-2.012.0086-1.116-.895-2.0244-2.0115-2.033-1.1157-.0086-2.0237.8955-2.0318 2.012M5.8394 12.012c.0048 3.4035 2.7678 6.1583 6.17 6.1534 3.4026-.005 6.1568-2.771 6.152-6.174-.005-3.4033-2.77-6.1574-6.172-6.1527-3.4025.005-6.155 2.7697-6.15 6.1733m2.1622-.001c-.002-2.209 1.7847-4.0003 3.9933-4.0027 2.21-.003 4.0013 1.784 4.004 3.993.002 2.2085-1.7853 4.0003-3.994 4.003-2.2088.0026-4.0007-1.7844-4.003-3.9933"
    />
  </svg>
),
```

- [ ] **Step 2: Add Instagram to navbar socialIconMap**

In `src/components/navbar.tsx`, add to the `socialIconMap`:

```tsx
Instagram: Icons.instagram,
instagram: Icons.instagram,
```

- [ ] **Step 3: Commit**

```bash
git add src/components/icons.tsx src/components/navbar.tsx
git commit -m "feat: add Instagram icon to navbar social links"
```

---

## Chunk 3: Content & Data

### Task 4: Replace resume.tsx fallback data

**Files:**
- Modify: `src/data/resume.tsx`

- [ ] **Step 1: Replace DATA object**

Replace entire `DATA` export with Oğuzhan Sert's data:

- name: "Oğuzhan Sert"
- initials: "OS"
- url: "https://oguzhansert.dev"
- location: "İstanbul"
- locationLink: "https://www.google.com/maps/place/istanbul"
- description: "Teknoloji Girişimcisi & Yazılım Geliştirici | SaaS, E-Ticaret ve B2B Çözümleri | Kozmetik Ambalaj Üretimi"
- summary: TR bio text from spec
- avatarUrl: "/me.png"
- skills: Keep existing tech skills (React, Next.js, TypeScript, Node.js, Python, Go, Postgres, Docker, Kubernetes, Java, C++)
- navbar: Keep Home + Blog
- contact.email: "info@oguzhansert.dev"
- contact.social: GitHub (osrt91), LinkedIn (osrt91), Instagram (osrt91), email
- work: Empty array `[]` (data comes from Supabase)
- education: Empty array `[]` (data comes from Supabase)
- projects: Empty array `[]` (data comes from Supabase)
- hackathons: Remove entirely

- [ ] **Step 2: Commit**

```bash
git add src/data/resume.tsx
git commit -m "feat: replace template data with Oğuzhan Sert profile"
```

---

### Task 5: Update page.tsx — remove hackathons, rename work section

**Files:**
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Remove hackathons import and data fetch**

Remove `getHackathons` from import and from `Promise.all`.
Remove `HackathonsSection` import.

- [ ] **Step 2: Remove hackathons section from JSX**

Delete the entire `{hackathons.length > 0 && (...)}` block.

- [ ] **Step 3: Update work section title**

Change `<h2 className="text-xl font-bold">Work Experience</h2>` to use i18n or hardcode "Markalarım".
If i18n is already being used via the `work_title` key, this is handled by Task 2.

- [ ] **Step 4: Verify build**

Run: `pnpm build`
Expected: Build passes, no references to hackathons

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/page.tsx
git commit -m "feat: remove hackathons section, update work section title"
```

---

### Task 6: Update contact section text

**Files:**
- Modify: `src/components/section/contact-section.tsx`

- [ ] **Step 1: Update contact CTA text and link**

Change the hardcoded English text to use profile-based content:
- "Get in Touch" → Keep (or i18n later)
- Change "shoot me a dm with a direct question on twitter" to use LinkedIn as primary contact
- Update social link priority: LinkedIn > Instagram > GitHub > email
- Remove "I will ignore all soliciting"

- [ ] **Step 2: Commit**

```bash
git add src/components/section/contact-section.tsx
git commit -m "feat: update contact section with personal links"
```

---

## Chunk 4: Final Verification

### Task 7: Build and verify

- [ ] **Step 1: Run full build**

Run: `pnpm build`
Expected: Build passes with zero errors

- [ ] **Step 2: Visual verification**

Run: `pnpm dev`
Check: `http://localhost:3000/tr` and `http://localhost:3000/en`
Verify:
- Orange accent color visible in both light and dark mode
- Name shows "Oğuzhan Sert" (not "Dillion Verma")
- Work section titled "Markalarım" (TR) / "My Brands" (EN)
- No hackathons section
- Social links in navbar: GitHub, LinkedIn, Instagram
- Contact section references LinkedIn

- [ ] **Step 3: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: design customization adjustments"
```

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | Warm Orange color palette | globals.css, contact-section.tsx |
| 2 | i18n section titles | tr.json, en.json |
| 3 | Instagram icon | icons.tsx, navbar.tsx |
| 4 | Replace resume.tsx data | resume.tsx |
| 5 | Remove hackathons, rename work | page.tsx |
| 6 | Update contact section | contact-section.tsx |
| 7 | Build and verify | — |

**After this plan:** User provides avatar image (public/me.png) and brand/company data for "Markalarım" section via admin panel.
