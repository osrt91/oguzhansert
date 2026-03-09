export type Lang = "tr" | "en";

export interface SiteConfig {
  id: string;
  logo_text: string;
  email: string;
  phone: string;
  github_url: string;
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  resume_url: string;
  footer_text: string;
}

export interface HeroContent {
  id: string;
  lang: Lang;
  greeting: string;
  name_line1: string;
  name_line2: string;
  subtitle_prefix: string;
  subtitle_role1: string;
  subtitle_role2: string;
}

export interface AboutContent {
  id: string;
  lang: Lang;
  title: string;
  body: string;
}

export interface WhatIdoCard {
  id: string;
  lang: Lang;
  title: string;
  description_title: string;
  description: string;
  skills_title: string;
  skills: string[];
  sort_order: number;
}

export interface CareerEntry {
  id: string;
  lang: Lang;
  position: string;
  company: string;
  year: string;
  description: string;
  sort_order: number;
}

export interface Project {
  id: string;
  lang: Lang;
  title: string;
  category: string;
  tools: string;
  image_url: string;
  link: string;
  sort_order: number;
}

export interface TechStackItem {
  id: string;
  name: string;
  image_url: string;
  sort_order: number;
}
