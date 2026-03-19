# Sub-Project 6: Design Customization — Spec

**Date:** 2026-03-20
**Status:** Approved
**Domain:** oguzhansert.dev

## Overview

Transform the Dillion Verma template into Oğuzhan Sert's personal brand. Replace all placeholder data, apply custom color palette, and adjust sections to match the user's dual identity (tech entrepreneur + company executive).

## Design Decisions

### Color Palette: Warm Orange

**Accent color:** `#f97316` (orange-500)
**Neutral base:** Tailwind `stone` scale

**Light mode:**
- Background: stone-50 (`#fafaf9`)
- Foreground: stone-900 (`#1c1917`)
- Card: white (`#ffffff`)
- Muted: stone-100 (`#f5f5f4`)
- Muted foreground: stone-500 (`#78716c`)
- Border: stone-200 (`#e7e5e4`)
- Primary: orange-500 (`#f97316`)
- Primary foreground: white
- Accent: orange-50 (`#fff7ed`)
- Accent foreground: orange-600 (`#ea580c`)

**Dark mode:**
- Background: stone-950 (`#0c0a09`)
- Foreground: stone-50 (`#fafaf9`)
- Card: stone-900 (`#1c1917`)
- Muted: stone-800 (`#292524`)
- Muted foreground: stone-400 (`#a8a29e`)
- Border: stone-800 (`#292524`) or white/10%
- Primary: orange-500 (`#f97316`)
- Primary foreground: white
- Accent: orange-950 (`#431407`)
- Accent foreground: orange-400 (`#fb923c`)

### Layout

Keep existing single-column flow layout. No structural changes.

### Sections (top to bottom)

1. **Hero** — Name, description, avatar
2. **About** — Short bio/summary
3. **Markalarım** (was "Work Experience") — Companies/brands owned
4. **Education** — Education history
5. **Skills** — Technical skills
6. **Projects** — Software projects
7. **Contact** — Contact section
8. **Blog** — Accessible from navbar

**Removed:** Hackathons section (not relevant)

### Fonts

Keep Geist (sans) and Geist Mono. No change needed.

## Personal Data

### Profile (TR)

```
name: Oğuzhan Sert
initials: OS
location: İstanbul
locationLink: https://www.google.com/maps/place/istanbul
email: info@oguzhansert.dev
description: Teknoloji Girişimcisi & Yazılım Geliştirici | SaaS, E-Ticaret ve B2B Çözümleri | Kozmetik Ambalaj Üretimi
```

### Summary/Bio (TR)

```
Geleneksel "yazılımcı" tanımının ötesinde, kendi dijital ekosistemlerini sıfırdan inşa eden ve yöneten bir ürün mimarıyım. Sadece kod yazmıyor; uçtan uca geliştirdiğim web teknolojilerini kullanarak B2B üretim hatlarından, oyunlaştırılmış SaaS platformlarına ve özel altyapılı e-ticaret sistemlerine kadar farklı sektörlerde sürdürülebilir iş modelleri kuruyorum.
```

### Profile (EN)

```
name: Oguzhan Sert
initials: OS
location: Istanbul
locationLink: https://www.google.com/maps/place/istanbul
email: info@oguzhansert.dev
description: Tech Entrepreneur & Software Developer | SaaS, E-Commerce & B2B Solutions | Cosmetic Packaging Manufacturing
```

### Summary/Bio (EN)

```
Beyond the traditional "developer" label, I'm a product architect who builds and manages entire digital ecosystems from scratch. I don't just write code — I create sustainable business models across different industries, from B2B production lines and gamified SaaS platforms to custom-built e-commerce systems, using end-to-end web technologies.
```

### Social Links

```json
{
  "GitHub": "https://github.com/osrt91",
  "LinkedIn": "https://www.linkedin.com/in/osrt91/",
  "Instagram": "https://instagram.com/osrt91",
  "email": "mailto:info@oguzhansert.dev"
}
```

### Navbar Items

- Home (/)
- Blog (/blog)
- Social: GitHub, LinkedIn, Instagram
- Locale switcher (TR/EN)
- Theme toggle (light/dark)

## Implementation Scope

### What Changes

1. **globals.css** — Replace color variables with Warm Orange palette (both light and dark)
2. **resume.tsx** — Replace all Dillion Verma data with Oğuzhan Sert data (fallback)
3. **Supabase seed** — Update seed script with real data
4. **[locale]/page.tsx** — Rename "Work Experience" to "Markalarım" / "My Brands", remove hackathons section
5. **messages/tr.json & en.json** — Update i18n strings for section titles
6. **Navbar** — Add Instagram social icon
7. **components/icons.tsx** — Add Instagram icon if missing
8. **public/me.png** — Replace with real avatar (user to provide)

### What Stays

- Layout structure (single column, max-w-2xl)
- All Magic UI animations (blur-fade, flickering-grid, dock)
- shadcn/ui component library
- Blog system
- Admin panel
- i18n infrastructure
- All Supabase integration

## Success Criteria

- Site shows Oğuzhan Sert's real data, not Dillion Verma template
- Warm Orange color palette applied consistently in both light and dark modes
- Hackathons section removed
- Work section renamed to Markalarım/My Brands
- All social links point to real profiles
- Build passes without errors
