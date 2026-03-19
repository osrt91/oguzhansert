import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["tr", "en"],
  defaultLocale: "tr",
  pathnames: {
    "/": "/",
    "/hakkimda": { tr: "/hakkimda", en: "/about" },
    "/projeler": { tr: "/projeler", en: "/projects" },
    "/yetenekler": { tr: "/yetenekler", en: "/skills" },
    "/blog": "/blog",
    "/blog/[slug]": "/blog/[slug]",
    "/iletisim": { tr: "/iletisim", en: "/contact" },
    "/galeri": { tr: "/galeri", en: "/gallery" },
  },
  localePrefix: "always",
});
