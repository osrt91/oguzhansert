# CLAUDE.md — Oguzhan Sert Portfolio

## Project Overview

Personal portfolio website built with **Next.js 16** (App Router), **Tailwind CSS 4**, **shadcn/ui**, **Magic UI**, and **Content Collections** for blog/MDX content. Uses the Dillion Verma portfolio template as base.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, React 19) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4, tw-animate-css |
| Components | shadcn/ui (Radix UI), Magic UI |
| Content | Content Collections (MDX blog) |
| Fonts | Geist (sans), Geist Mono |
| Package Manager | pnpm |

## Quick Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## Project Structure

```
├── content/              # MDX blog posts
├── public/               # Static assets
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/
│   │   ├── magicui/      # Magic UI components
│   │   └── ui/           # shadcn/ui components
│   ├── data/
│   │   └── resume.tsx    # Portfolio data (experience, skills, projects)
│   └── lib/              # Utilities
├── content-collections.ts
└── components.json       # shadcn/ui config
```

## Conventions

1. **Import paths**: Use `@/` alias (maps to `./src/*`)
2. **Components**: shadcn/ui in `src/components/ui/`, Magic UI in `src/components/magicui/`
3. **Data**: All portfolio content in `src/data/resume.tsx`
4. **Blog**: MDX files in `content/` directory
5. **Styling**: Tailwind utility classes, `cn()` for merging

## ARAC VE EKLENTI REHBERI

Bu projede asagidaki araclar aktif kullanilmalidir. Dogru zamanda dogru araci oner.

### MCP'ler (Global — Tum Projelerde Aktif)
- **shadcn-ui** → shadcn/ui bileseni eklerken MCP'den dogru API/props bilgisini kontrol et
- **playwright** → Yeni ozellik tamamlandiginda "Playwright ile E2E test yazalim mi?" hatirlat
- **sequential-thinking** → Karmasik mimari karar veya bug'da "Adim adim analiz edelim mi?" oner
- **chrome-devtools** → Frontend bug'larda "Chrome DevTools ile inceleyelim mi?" oner
- **repomix** → Buyuk codebase analizi ve kod birlesimi icin kullan
- **figma-remote-mcp** → Figma tasarimlarini koda cevirirken kullan

### Plugin'ler (Global — Tum Projelerde Aktif)
- **superpowers** → Buyuk gorevlerde brainstorming/planning/TDD/code-review skill'lerini kullan
- **cartographer** → Buyuk refactor oncesi codebase haritalama oner
- **context7** → Kutuphane API'si hakkinda suphe oldugunda guncel dokuman kontrol et
- **code-review** → PR olusturmadan once code review oner
- **frontend-design** → Yeni sayfa/bilesen olustururken kullan
- **typescript-lsp** → Tip hatalari ve refactoring'de LSP kullan
- **claude-md-management** → CLAUDE.md dosyalarini denetlemek ve iyilestirmek icin kullan

### Otonom Araclar
- **GSD-2 (v2.22.0)** → 5+ adimlik buyuk gorevlerde "GSD-2 auto mode kullanmak ister misin?" oner
  - Kucuk isler (bug fix, UI tweak) → Claude Code + superpowers
  - Buyuk isler (yeni feature, milestone) → GSD-2 auto mode
