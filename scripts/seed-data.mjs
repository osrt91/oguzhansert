/**
 * Seed script for oguzhansert portfolio database.
 *
 * Populates all tables with placeholder data for TR + EN locales.
 * Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.
 *
 * Usage:
 *   SUPABASE_URL=https://supabase.oguzhansert.dev \
 *   SUPABASE_SERVICE_ROLE_KEY=your-key \
 *   node scripts/seed-data.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error(
    "❌ Missing env vars. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Helpers ─────────────────────────────────────────────────────────

async function upsert(table, data, conflictColumns) {
  const { error } = await supabase.from(table).upsert(data, {
    onConflict: conflictColumns,
    ignoreDuplicates: false,
  });
  if (error) {
    console.error(`  ✗ ${table}: ${error.message}`);
    return false;
  }
  const count = Array.isArray(data) ? data.length : 1;
  console.log(`  ✓ ${table}: ${count} row(s) upserted`);
  return true;
}

// ─── Site Settings ───────────────────────────────────────────────────

async function seedSiteSettings() {
  console.log("\n📋 Seeding site_settings...");
  const rows = [
    {
      key: "site_title",
      locale: "tr",
      value: { text: "Oğuzhan Sert — Yazılım Geliştirici" },
    },
    {
      key: "site_title",
      locale: "en",
      value: { text: "Oğuzhan Sert — Software Developer" },
    },
    {
      key: "site_description",
      locale: "tr",
      value: {
        text: "Full-stack yazılım geliştirici. React, Next.js, TypeScript ve bulut teknolojileri.",
      },
    },
    {
      key: "site_description",
      locale: "en",
      value: {
        text: "Full-stack software developer. React, Next.js, TypeScript, and cloud technologies.",
      },
    },
    {
      key: "site_url",
      locale: "tr",
      value: { text: "https://www.oguzhansert.dev" },
    },
    {
      key: "site_url",
      locale: "en",
      value: { text: "https://www.oguzhansert.dev" },
    },
  ];
  await upsert("site_settings", rows, "key,locale");
}

// ─── Profiles ────────────────────────────────────────────────────────

async function seedProfiles() {
  console.log("\n👤 Seeding profiles...");
  const base = {
    name: "Oğuzhan Sert",
    initials: "OS",
    email: "hello@oguzhansert.dev",
    phone: "",
    avatar_url: "",
    resume_pdf_url: "",
    location_link: "https://maps.google.com/?q=Istanbul,Turkey",
    social_links: {
      github: "https://github.com/oguzhansert",
      linkedin: "https://linkedin.com/in/oguzhansert",
      twitter: "https://twitter.com/oguzhansert",
    },
  };

  const rows = [
    {
      ...base,
      locale: "tr",
      title: "Full-Stack Yazılım Geliştirici",
      location: "İstanbul, Türkiye",
      description:
        "Modern web teknolojileri ile ölçeklenebilir uygulamalar geliştiriyorum.",
      summary:
        "React, Next.js ve TypeScript odaklı full-stack geliştirici. Bulut mimarileri ve DevOps süreçlerinde deneyimli.",
    },
    {
      ...base,
      locale: "en",
      title: "Full-Stack Software Developer",
      location: "Istanbul, Turkey",
      description:
        "Building scalable applications with modern web technologies.",
      summary:
        "Full-stack developer focused on React, Next.js, and TypeScript. Experienced in cloud architectures and DevOps.",
    },
  ];
  await upsert("profiles", rows, "locale");
}

// ─── Skills ──────────────────────────────────────────────────────────

async function seedSkills() {
  console.log("\n🛠  Seeding skills...");
  const skills = [
    { name: "React", icon_name: "react", category_key: "frontend", sort_order: 1 },
    { name: "Next.js", icon_name: "nextjs", category_key: "frontend", sort_order: 2 },
    { name: "TypeScript", icon_name: "typescript", category_key: "language", sort_order: 3 },
    { name: "Node.js", icon_name: "nodejs", category_key: "backend", sort_order: 4 },
    { name: "Python", icon_name: "python", category_key: "language", sort_order: 5 },
    { name: "Go", icon_name: "go", category_key: "language", sort_order: 6 },
    { name: "PostgreSQL", icon_name: "postgresql", category_key: "database", sort_order: 7 },
    { name: "Docker", icon_name: "docker", category_key: "devops", sort_order: 8 },
    { name: "Kubernetes", icon_name: "kubernetes", category_key: "devops", sort_order: 9 },
    { name: "Java", icon_name: "java", category_key: "language", sort_order: 10 },
    { name: "C#", icon_name: "csharp", category_key: "language", sort_order: 11 },
  ].map((s) => ({ ...s, visible: true }));

  await upsert("skills", skills, "name");
}

// ─── Work Experience ─────────────────────────────────────────────────

async function seedWorkExperience() {
  console.log("\n💼 Seeding work_experience...");
  const rows = [
    {
      locale: "tr",
      company: "Örnek Teknoloji A.Ş.",
      title: "Kıdemli Yazılım Geliştirici",
      start_date: "2023-01-01",
      end_date: null,
      period: "2023 — Devam",
      description:
        "Mikro servis mimarisi ile e-ticaret platformu geliştirme. React, Node.js, PostgreSQL.",
      logo_url: "",
      url: "",
      sort_order: 1,
      visible: true,
    },
    {
      locale: "en",
      company: "Sample Tech Inc.",
      title: "Senior Software Developer",
      start_date: "2023-01-01",
      end_date: null,
      period: "2023 — Present",
      description:
        "Developing e-commerce platform with microservice architecture. React, Node.js, PostgreSQL.",
      logo_url: "",
      url: "",
      sort_order: 1,
      visible: true,
    },
  ];
  await upsert("work_experience", rows, "locale,sort_order");
}

// ─── Education ───────────────────────────────────────────────────────

async function seedEducation() {
  console.log("\n🎓 Seeding education...");
  const rows = [
    {
      locale: "tr",
      school: "İstanbul Teknik Üniversitesi",
      degree: "Bilgisayar Mühendisliği, Lisans",
      start_date: "2018-09-01",
      end_date: "2022-06-30",
      period: "2018 — 2022",
      description: "Bilgisayar Mühendisliği bölümünden mezun.",
      logo_url: "",
      url: "",
      sort_order: 1,
      visible: true,
    },
    {
      locale: "en",
      school: "Istanbul Technical University",
      degree: "Computer Engineering, B.Sc.",
      start_date: "2018-09-01",
      end_date: "2022-06-30",
      period: "2018 — 2022",
      description: "Graduated from Computer Engineering department.",
      logo_url: "",
      url: "",
      sort_order: 1,
      visible: true,
    },
  ];
  await upsert("education", rows, "locale,sort_order");
}

// ─── Projects ────────────────────────────────────────────────────────

async function seedProjects() {
  console.log("\n🚀 Seeding projects...");
  const rows = [
    {
      locale: "tr",
      title: "Kişisel Portfolyo",
      description:
        "Next.js, TypeScript ve Tailwind CSS ile geliştirilmiş kişisel web sitesi.",
      image_url: "",
      url: "https://www.oguzhansert.dev",
      source_url: "https://github.com/oguzhansert/portfolio",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      sort_order: 1,
      visible: true,
      featured: true,
    },
    {
      locale: "en",
      title: "Personal Portfolio",
      description:
        "Personal website built with Next.js, TypeScript, and Tailwind CSS.",
      image_url: "",
      url: "https://www.oguzhansert.dev",
      source_url: "https://github.com/oguzhansert/portfolio",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
      sort_order: 1,
      visible: true,
      featured: true,
    },
    {
      locale: "tr",
      title: "Görev Yöneticisi API",
      description:
        "Go ve PostgreSQL ile geliştirilmiş RESTful görev yönetim API'si.",
      image_url: "",
      url: "",
      source_url: "https://github.com/oguzhansert/task-manager-api",
      technologies: ["Go", "PostgreSQL", "Docker", "REST API"],
      sort_order: 2,
      visible: true,
      featured: false,
    },
    {
      locale: "en",
      title: "Task Manager API",
      description:
        "RESTful task management API built with Go and PostgreSQL.",
      image_url: "",
      url: "",
      source_url: "https://github.com/oguzhansert/task-manager-api",
      technologies: ["Go", "PostgreSQL", "Docker", "REST API"],
      sort_order: 2,
      visible: true,
      featured: false,
    },
  ];
  await upsert("projects", rows, "locale,sort_order");
}

// ─── Blog Posts ──────────────────────────────────────────────────────

async function seedBlogPosts() {
  console.log("\n📝 Seeding blog_posts...");
  const rows = [
    {
      locale: "tr",
      slug: "nextjs-ile-modern-web-gelistirme",
      title: "Next.js ile Modern Web Geliştirme",
      summary:
        "Next.js App Router, Server Components ve modern web geliştirme pratikleri hakkında.",
      content:
        "# Next.js ile Modern Web Geliştirme\n\nBu yazıda Next.js'in sunduğu modern web geliştirme araçlarını inceliyoruz...",
      cover_image_url: "",
      tags: ["Next.js", "React", "Web Development"],
      published: true,
      published_at: "2026-01-15T10:00:00Z",
    },
    {
      locale: "en",
      slug: "modern-web-development-with-nextjs",
      title: "Modern Web Development with Next.js",
      summary:
        "About Next.js App Router, Server Components, and modern web development practices.",
      content:
        "# Modern Web Development with Next.js\n\nIn this article, we explore the modern web development tools that Next.js offers...",
      cover_image_url: "",
      tags: ["Next.js", "React", "Web Development"],
      published: true,
      published_at: "2026-01-15T10:00:00Z",
    },
  ];
  await upsert("blog_posts", rows, "locale,slug");
}

// ─── Gallery Images ──────────────────────────────────────────────────

async function seedGalleryImages() {
  console.log("\n🖼  Seeding gallery_images...");
  const rows = [
    {
      locale: "tr",
      title: "Çalışma Alanım",
      description: "Ev ofisindeki çalışma masam ve kurulum.",
      image_url: "",
      category: "workspace",
      sort_order: 1,
      visible: true,
    },
    {
      locale: "en",
      title: "My Workspace",
      description: "My desk and setup in the home office.",
      image_url: "",
      category: "workspace",
      sort_order: 1,
      visible: true,
    },
  ];
  await upsert("gallery_images", rows, "locale,sort_order");
}

// ─── Hackathons ──────────────────────────────────────────────────────

async function seedHackathons() {
  console.log("\n🏆 Seeding hackathons...");
  const rows = [
    {
      locale: "tr",
      title: "İTÜ Hackathon 2024",
      description: "48 saatlik hackathon yarışmasında takım lideri olarak katılım.",
      start_date: "2024-03-15",
      date: "15-17 Mart 2024",
      location: "İstanbul, Türkiye",
      url: "",
      image_url: "",
      sort_order: 1,
      visible: true,
    },
    {
      locale: "en",
      title: "ITU Hackathon 2024",
      description: "Participated as team lead in a 48-hour hackathon competition.",
      start_date: "2024-03-15",
      date: "March 15-17, 2024",
      location: "Istanbul, Turkey",
      url: "",
      image_url: "",
      sort_order: 1,
      visible: true,
    },
  ];
  await upsert("hackathons", rows, "locale,sort_order");
}

// ─── SEO Metadata ────────────────────────────────────────────────────

async function seedSeoMetadata() {
  console.log("\n🔍 Seeding seo_metadata...");

  const pages = [
    {
      page_slug: "home",
      tr: {
        title: "Oğuzhan Sert — Yazılım Geliştirici",
        description:
          "Full-stack yazılım geliştirici. React, Next.js, TypeScript ve bulut teknolojileri.",
      },
      en: {
        title: "Oğuzhan Sert — Software Developer",
        description:
          "Full-stack software developer. React, Next.js, TypeScript, and cloud technologies.",
      },
    },
    {
      page_slug: "about",
      tr: {
        title: "Hakkımda — Oğuzhan Sert",
        description: "Yazılım geliştirme kariyerim ve teknik becerilerim.",
      },
      en: {
        title: "About — Oğuzhan Sert",
        description: "My software development career and technical skills.",
      },
    },
    {
      page_slug: "projects",
      tr: {
        title: "Projeler — Oğuzhan Sert",
        description: "Geliştirdiğim açık kaynak projeler ve uygulamalar.",
      },
      en: {
        title: "Projects — Oğuzhan Sert",
        description: "Open source projects and applications I have built.",
      },
    },
    {
      page_slug: "skills",
      tr: {
        title: "Yetenekler — Oğuzhan Sert",
        description: "Teknik becerilerim ve uzmanlık alanlarım.",
      },
      en: {
        title: "Skills — Oğuzhan Sert",
        description: "My technical skills and areas of expertise.",
      },
    },
    {
      page_slug: "blog",
      tr: {
        title: "Blog — Oğuzhan Sert",
        description: "Yazılım geliştirme, teknoloji ve kariyer üzerine yazılar.",
      },
      en: {
        title: "Blog — Oğuzhan Sert",
        description: "Articles on software development, technology, and career.",
      },
    },
    {
      page_slug: "contact",
      tr: {
        title: "İletişim — Oğuzhan Sert",
        description: "Benimle iletişime geçin.",
      },
      en: {
        title: "Contact — Oğuzhan Sert",
        description: "Get in touch with me.",
      },
    },
    {
      page_slug: "gallery",
      tr: {
        title: "Galeri — Oğuzhan Sert",
        description: "Fotoğraflar ve etkinlik görüntüleri.",
      },
      en: {
        title: "Gallery — Oğuzhan Sert",
        description: "Photos and event images.",
      },
    },
  ];

  const rows = pages.flatMap((page) => [
    {
      locale: "tr",
      page_slug: page.page_slug,
      title: page.tr.title,
      description: page.tr.description,
      og_title: page.tr.title,
      og_description: page.tr.description,
      og_image_url: "",
      canonical_url: "",
      no_index: false,
      json_ld: {},
    },
    {
      locale: "en",
      page_slug: page.page_slug,
      title: page.en.title,
      description: page.en.description,
      og_title: page.en.title,
      og_description: page.en.description,
      og_image_url: "",
      canonical_url: "",
      no_index: false,
      json_ld: {},
    },
  ]);

  await upsert("seo_metadata", rows, "locale,page_slug");
}

// ─── Redirects (default empty) ───────────────────────────────────────

async function seedRedirects() {
  console.log("\n↪  Seeding redirects...");
  const rows = [
    {
      source: "/cv",
      destination: "/about",
      status_code: 301,
      active: true,
    },
    {
      source: "/portfolio",
      destination: "/projects",
      status_code: 301,
      active: true,
    },
  ];
  await upsert("redirects", rows, "source");
}

// ─── Main ────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Starting database seed...");
  console.log(`   URL: ${SUPABASE_URL}`);

  await seedSiteSettings();
  await seedProfiles();
  await seedSkills();
  await seedWorkExperience();
  await seedEducation();
  await seedProjects();
  await seedBlogPosts();
  await seedGalleryImages();
  await seedHackathons();
  await seedSeoMetadata();
  await seedRedirects();

  console.log("\n✅ Seed complete!");
}

main().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
