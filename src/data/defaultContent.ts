import type {
  Lang,
  SiteConfig,
  HeroContent,
  AboutContent,
  WhatIdoCard,
  CareerEntry,
  Project,
  TechStackItem,
} from "../lib/types";

export function defaultContent(lang: Lang) {
  const siteConfig: SiteConfig = {
    id: "default",
    logo_text: "OS",
    email: "info@oguzhansert.dev",
    phone: "",
    github_url: "https://github.com/oguzhansert",
    linkedin_url: "https://linkedin.com/in/oguzhansert",
    twitter_url: "https://twitter.com/oguzhansert",
    instagram_url: "https://instagram.com/oguzhansert",
    resume_url: "#",
    footer_text: lang === "tr" ? "Oğuzhan Sert tarafından tasarlandı ve geliştirildi" : "Designed and Developed by Oğuzhan Sert",
  };

  const hero: HeroContent = {
    id: "default",
    lang,
    greeting: lang === "tr" ? "Merhaba! Ben" : "Hello! I'm",
    name_line1: "OĞUZHAN",
    name_line2: "SERT",
    subtitle_prefix: lang === "tr" ? "Bir" : "A Creative",
    subtitle_role1: lang === "tr" ? "Geliştirici" : "Developer",
    subtitle_role2: lang === "tr" ? "Ürün Yapımcısı" : "Builder",
  };

  const about: AboutContent = {
    id: "default",
    lang,
    title: lang === "tr" ? "Hakkımda" : "About Me",
    body: lang === "tr"
      ? "Ürün odaklı bir geliştirici ve teknik operatörüm. Temiz mimari, hızlı teslimat ve gerçek değer üreten çözümler inşa ediyorum. Full-stack uygulamalardan otomasyon sistemlerine kadar geniş bir yelpazede çalışıyorum."
      : "I'm a product-minded developer and technical operator. I build products, automate systems, and ship things that work. Focused on clean architecture, thoughtful design, and delivering real value.",
  };

  const whatIdo: WhatIdoCard[] = [
    {
      id: "dev",
      lang,
      title: lang === "tr" ? "GELİŞTİRME" : "DEVELOP",
      description_title: lang === "tr" ? "Açıklama" : "Description",
      description: lang === "tr"
        ? "Full-stack web uygulamaları, API'ler, otomasyon araçları ve teknik sistemler inşa ediyorum."
        : "I build full-stack web applications, APIs, automation tools, and technical systems.",
      skills_title: lang === "tr" ? "Beceriler & Araçlar" : "Skillset & tools",
      skills: ["JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Python", "PostgreSQL", "Supabase"],
      sort_order: 1,
    },
    {
      id: "build",
      lang,
      title: lang === "tr" ? "ÜRETİM" : "BUILD",
      description_title: lang === "tr" ? "Açıklama" : "Description",
      description: lang === "tr"
        ? "Ürün tasarımı, kullanıcı deneyimi ve teknik strateji ile çalışan, kullanılabilir çözümler üretiyorum."
        : "I create usable solutions through product design, user experience, and technical strategy.",
      skills_title: lang === "tr" ? "Beceriler & Araçlar" : "Skillset & tools",
      skills: ["Product Strategy", "UI/UX", "Automation", "System Design", "API Design", "DevOps"],
      sort_order: 2,
    },
  ];

  const career: CareerEntry[] = [
    {
      id: "c1",
      lang,
      position: lang === "tr" ? "Pozisyon Ekle" : "Add Position",
      company: lang === "tr" ? "Şirket Adı" : "Company Name",
      year: "20XX",
      description: lang === "tr"
        ? "Bu alanı admin panelinden düzenleyebilirsiniz."
        : "You can edit this section from the admin panel.",
      sort_order: 1,
    },
    {
      id: "c2",
      lang,
      position: lang === "tr" ? "Mevcut Pozisyon" : "Current Position",
      company: lang === "tr" ? "Şirket Adı" : "Company Name",
      year: lang === "tr" ? "ŞİMDİ" : "NOW",
      description: lang === "tr"
        ? "Bu alanı admin panelinden düzenleyebilirsiniz."
        : "You can edit this section from the admin panel.",
      sort_order: 2,
    },
  ];

  const projects: Project[] = [
    {
      id: "p1",
      lang,
      title: lang === "tr" ? "Proje Adı" : "Project Name",
      category: lang === "tr" ? "Web Uygulaması" : "Web Application",
      tools: "React, TypeScript, Supabase",
      image_url: "/images/placeholder.webp",
      link: "#",
      sort_order: 1,
    },
    {
      id: "p2",
      lang,
      title: lang === "tr" ? "Proje Adı" : "Project Name",
      category: lang === "tr" ? "Otomasyon" : "Automation",
      tools: "Node.js, Python, PostgreSQL",
      image_url: "/images/placeholder.webp",
      link: "#",
      sort_order: 2,
    },
  ];

  const techStack: TechStackItem[] = [
    { id: "t1", name: "React", image_url: "/images/react2.webp", sort_order: 1 },
    { id: "t2", name: "Next.js", image_url: "/images/next2.webp", sort_order: 2 },
    { id: "t3", name: "Node.js", image_url: "/images/node2.webp", sort_order: 3 },
    { id: "t4", name: "Express", image_url: "/images/express.webp", sort_order: 4 },
    { id: "t5", name: "MongoDB", image_url: "/images/mongo.webp", sort_order: 5 },
    { id: "t6", name: "MySQL", image_url: "/images/mysql.webp", sort_order: 6 },
    { id: "t7", name: "TypeScript", image_url: "/images/typescript.webp", sort_order: 7 },
    { id: "t8", name: "JavaScript", image_url: "/images/javascript.webp", sort_order: 8 },
  ];

  return { siteConfig, hero, about, whatIdo, career, projects, techStack };
}
