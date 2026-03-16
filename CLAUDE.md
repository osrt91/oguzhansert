# CLAUDE.md — Oguzhan Sert

## ARAÇ VE EKLENTİ REHBERİ

Bu projede aşağıdaki araçlar aktif kullanılmalıdır. Doğru zamanda doğru aracı öner.

### MCP'ler (Global)
- **shadcn-ui** → shadcn/ui bileşeni eklerken MCP'den doğru API/props bilgisini kontrol et
- **playwright** → Yeni özellik tamamlandığında "Playwright ile E2E test yazalım mı?" hatırlat
- **sequential-thinking** → Karmaşık mimari karar veya bug'da "Adım adım analiz edelim mi?" öner
- **chrome-devtools** → Frontend bug'larda "Chrome DevTools ile inceleyelim mi?" öner
- **gsc** → SEO çalışmasında "GSC'den performans kontrol edelim mi?" öner
- **ui-expert** → Yeni sayfa/bileşen tasarlarken "UI Expert ile kontrol yapalım mı?" öner
- **ui-screenshot-to-prompt** → Görsel/mockup paylaşıldığında "Koda çevirelim mi?" öner
- **context7** → Kütüphane API'si hakkında şüphe olduğunda güncel doküman kontrol et

### Plugin'ler
- **superpowers** → Büyük görevlerde brainstorming/planning/TDD/code-review skill'lerini kullan
- **cartographer** → Büyük refactor öncesi codebase haritalama öner
- **code-review** → PR oluşturmadan önce code review öner
- **frontend-design** → Yeni sayfa/bileşen oluştururken kullan
- **typescript-lsp** → Tip hataları ve refactoring'de kullan

### Otonom Araçlar
- **GSD-2 (v2.22.0)** → 5+ adımlık büyük görevlerde "GSD-2 auto mode kullanmak ister misin?" öner
  - Komut: proje dizininde `gsd` → `/gsd auto`
  - Küçük işler (bug fix, UI tweak) → Claude Code + superpowers
  - Büyük işler (yeni feature, milestone) → GSD-2 auto mode
