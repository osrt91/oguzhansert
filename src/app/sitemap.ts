import type { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/content";

const BASE_URL = "https://oguzhansert.dev";

const locales = ["tr", "en"] as const;

// Static pages per locale
const staticPages: Record<string, Record<string, string>> = {
  "/": { tr: "/tr", en: "/en" },
  "/blog": { tr: "/tr/blog", en: "/en/blog" },
  "/hakkimda": { tr: "/tr/hakkimda", en: "/en/about" },
  "/projeler": { tr: "/tr/projeler", en: "/en/projects" },
  "/yetenekler": { tr: "/tr/yetenekler", en: "/en/skills" },
  "/iletisim": { tr: "/tr/iletisim", en: "/en/contact" },
  "/galeri": { tr: "/tr/galeri", en: "/en/gallery" },
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  for (const [, paths] of Object.entries(staticPages)) {
    for (const [, path] of Object.entries(paths)) {
      entries.push({
        url: `${BASE_URL}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path.endsWith("/tr") || path.endsWith("/en") ? 1.0 : 0.8,
      });
    }
  }

  // Dynamic blog posts
  for (const locale of locales) {
    const posts = await getBlogPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.updated_at
          ? new Date(post.updated_at)
          : post.published_at
            ? new Date(post.published_at)
            : new Date(),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
