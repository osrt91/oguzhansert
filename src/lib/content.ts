import { getSupabaseSafe } from "@/lib/supabase";
import type {
  Profile,
  Skill,
  WorkExperience,
  Education,
  Project,
  BlogPost,
  GalleryImage,
  Hackathon,
  SeoMetadata,
  SiteSettings,
  Redirect,
} from "@/types/database";

// ─── Profile ────────────────────────────────────────────────────────────

export async function getProfile(locale: string): Promise<Profile | null> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("locale", locale)
      .single();

    if (error) {
      console.error("getProfile error:", error.message);
      return null;
    }
    return data as Profile;
  } catch (err) {
    console.error("getProfile exception:", err);
    return null;
  }
}

// ─── Skills ─────────────────────────────────────────────────────────────

export async function getSkills(): Promise<Skill[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .eq("visible", true)
      .order("sort_order");

    if (error) {
      console.error("getSkills error:", error.message);
      return [];
    }
    return (data as Skill[]) ?? [];
  } catch (err) {
    console.error("getSkills exception:", err);
    return [];
  }
}

// ─── Work Experience ────────────────────────────────────────────────────

export async function getWorkExperience(
  locale: string
): Promise<WorkExperience[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("work_experience")
      .select("*")
      .eq("locale", locale)
      .eq("visible", true)
      .order("sort_order");

    if (error) {
      console.error("getWorkExperience error:", error.message);
      return [];
    }
    return (data as WorkExperience[]) ?? [];
  } catch (err) {
    console.error("getWorkExperience exception:", err);
    return [];
  }
}

// ─── Education ──────────────────────────────────────────────────────────

export async function getEducation(locale: string): Promise<Education[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("education")
      .select("*")
      .eq("locale", locale)
      .eq("visible", true)
      .order("sort_order");

    if (error) {
      console.error("getEducation error:", error.message);
      return [];
    }
    return (data as Education[]) ?? [];
  } catch (err) {
    console.error("getEducation exception:", err);
    return [];
  }
}

// ─── Projects ───────────────────────────────────────────────────────────

export async function getProjects(locale: string): Promise<Project[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("locale", locale)
      .eq("visible", true)
      .order("sort_order");

    if (error) {
      console.error("getProjects error:", error.message);
      return [];
    }
    return (data as Project[]) ?? [];
  } catch (err) {
    console.error("getProjects exception:", err);
    return [];
  }
}

export async function getFeaturedProjects(
  locale: string
): Promise<Project[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("locale", locale)
      .eq("visible", true)
      .eq("featured", true)
      .order("sort_order");

    if (error) {
      console.error("getFeaturedProjects error:", error.message);
      return [];
    }
    return (data as Project[]) ?? [];
  } catch (err) {
    console.error("getFeaturedProjects exception:", err);
    return [];
  }
}

// ─── Blog Posts ─────────────────────────────────────────────────────────

export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("locale", locale)
      .eq("published", true)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("getBlogPosts error:", error.message);
      return [];
    }
    return (data as BlogPost[]) ?? [];
  } catch (err) {
    console.error("getBlogPosts exception:", err);
    return [];
  }
}

export async function getBlogPost(
  locale: string,
  slug: string
): Promise<BlogPost | null> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("locale", locale)
      .eq("slug", slug)
      .eq("published", true)
      .single();

    if (error) {
      console.error("getBlogPost error:", error.message);
      return null;
    }
    return data as BlogPost;
  } catch (err) {
    console.error("getBlogPost exception:", err);
    return null;
  }
}

// ─── Gallery Images ─────────────────────────────────────────────────────

export async function getGalleryImages(
  locale: string
): Promise<GalleryImage[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("gallery_images")
      .select("*")
      .eq("locale", locale)
      .eq("visible", true)
      .order("sort_order");

    if (error) {
      console.error("getGalleryImages error:", error.message);
      return [];
    }
    return (data as GalleryImage[]) ?? [];
  } catch (err) {
    console.error("getGalleryImages exception:", err);
    return [];
  }
}

// ─── Hackathons ─────────────────────────────────────────────────────────

export async function getHackathons(locale: string): Promise<Hackathon[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("hackathons")
      .select("*")
      .eq("locale", locale)
      .eq("visible", true)
      .order("sort_order");

    if (error) {
      console.error("getHackathons error:", error.message);
      return [];
    }
    return (data as Hackathon[]) ?? [];
  } catch (err) {
    console.error("getHackathons exception:", err);
    return [];
  }
}

// ─── SEO Metadata ───────────────────────────────────────────────────────

export async function getSeoMetadata(
  locale: string,
  pageSlug: string
): Promise<SeoMetadata | null> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("seo_metadata")
      .select("*")
      .eq("locale", locale)
      .eq("page_slug", pageSlug)
      .single();

    if (error) {
      console.error("getSeoMetadata error:", error.message);
      return null;
    }
    return data as SeoMetadata;
  } catch (err) {
    console.error("getSeoMetadata exception:", err);
    return null;
  }
}

// ─── Site Settings ──────────────────────────────────────────────────────

export async function getSiteSettings(
  locale: string
): Promise<Record<string, unknown>> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return {};

    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .eq("locale", locale);

    if (error) {
      console.error("getSiteSettings error:", error.message);
      return {};
    }

    // Convert array of { key, value } to a key-value object
    const settings: Record<string, unknown> = {};
    for (const row of (data as SiteSettings[]) ?? []) {
      settings[row.key] = row.value;
    }
    return settings;
  } catch (err) {
    console.error("getSiteSettings exception:", err);
    return {};
  }
}

// ─── Redirects ──────────────────────────────────────────────────────────

export async function getRedirects(): Promise<Redirect[]> {
  try {
    const supabase = getSupabaseSafe();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("redirects")
      .select("*")
      .eq("active", true);

    if (error) {
      console.error("getRedirects error:", error.message);
      return [];
    }
    return (data as Redirect[]) ?? [];
  } catch (err) {
    console.error("getRedirects exception:", err);
    return [];
  }
}
