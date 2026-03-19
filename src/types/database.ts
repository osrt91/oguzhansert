// ─── Locale ──────────────────────────────────────────────────────────
export type Locale = "tr" | "en";

// ─── Site Settings ───────────────────────────────────────────────────
export interface SiteSettings {
  key: string;
  value: Record<string, unknown>;
  locale: Locale;
  updated_at: string;
}

// ─── Profile ─────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  locale: Locale;
  name: string;
  initials: string;
  title: string;
  location: string;
  location_link: string;
  description: string;
  summary: string;
  avatar_url: string;
  resume_pdf_url: string;
  email: string;
  phone: string;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

// ─── Skill ───────────────────────────────────────────────────────────
export interface Skill {
  id: string;
  name: string;
  icon_name: string;
  category_key: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
}

// ─── Work Experience ─────────────────────────────────────────────────
export interface WorkExperience {
  id: string;
  locale: Locale;
  company: string;
  title: string;
  start_date: string;
  end_date: string | null;
  period: string;
  description: string;
  logo_url: string;
  url: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Education ───────────────────────────────────────────────────────
export interface Education {
  id: string;
  locale: Locale;
  school: string;
  degree: string;
  start_date: string;
  end_date: string | null;
  period: string;
  description: string;
  logo_url: string;
  url: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Project ─────────────────────────────────────────────────────────
export interface Project {
  id: string;
  locale: Locale;
  title: string;
  description: string;
  image_url: string;
  url: string;
  source_url: string;
  technologies: string[];
  sort_order: number;
  visible: boolean;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

// ─── Blog Post ───────────────────────────────────────────────────────
export interface BlogPost {
  id: string;
  locale: Locale;
  slug: string;
  title: string;
  summary: string;
  content: string;
  cover_image_url: string;
  tags: string[];
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

// ─── Gallery Image ───────────────────────────────────────────────────
export interface GalleryImage {
  id: string;
  locale: Locale;
  title: string;
  description: string;
  image_url: string;
  category: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
}

// ─── Hackathon ───────────────────────────────────────────────────────
export interface Hackathon {
  id: string;
  locale: Locale;
  title: string;
  description: string;
  start_date: string;
  date: string;
  location: string;
  url: string;
  image_url: string;
  sort_order: number;
  visible: boolean;
  created_at: string;
  updated_at: string;
}

// ─── SEO Metadata ────────────────────────────────────────────────────
export interface SeoMetadata {
  id: string;
  locale: Locale;
  page_slug: string;
  title: string;
  description: string;
  og_title: string;
  og_description: string;
  og_image_url: string;
  canonical_url: string;
  no_index: boolean;
  json_ld: Record<string, unknown>;
  updated_at: string;
}

// ─── Redirect ────────────────────────────────────────────────────────
export interface Redirect {
  id: string;
  source: string;
  destination: string;
  status_code: number;
  active: boolean;
  created_at: string;
}

// ─── Generic API Response ────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
