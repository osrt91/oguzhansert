-- =============================================================================
-- Oguzhan Sert Portfolio — Supabase Schema
-- =============================================================================
-- Run this file against your Supabase PostgreSQL instance to create all tables.
-- Prerequisites: Supabase project with auth.users table (provided by Supabase).
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 0. Utility: auto-update updated_at trigger function
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ---------------------------------------------------------------------------
-- 1. site_settings — key/value config (theme, social links, etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT NOT NULL UNIQUE,
  value       JSONB NOT NULL DEFAULT '{}',
  locale      TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_site_settings_key ON site_settings (key);
CREATE INDEX idx_site_settings_locale ON site_settings (locale);

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
  ON site_settings FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- 2. profile — personal info (one row per locale)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profile (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale      TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  full_name   TEXT NOT NULL,
  title       TEXT,
  bio         TEXT,
  avatar_url  TEXT,
  resume_url  TEXT,
  location    TEXT,
  email       TEXT,
  phone       TEXT,
  website     TEXT,
  github      TEXT,
  linkedin    TEXT,
  twitter     TEXT,
  visible     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_profile_locale ON profile (locale);

CREATE TRIGGER trg_profile_updated_at
  BEFORE UPDATE ON profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible profiles"
  ON profile FOR SELECT
  USING (visible = true);

-- ---------------------------------------------------------------------------
-- 3. skills — technical skills grouped by category
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS skills (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale        TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  category_key  TEXT NOT NULL,
  category_name TEXT NOT NULL,
  name          TEXT NOT NULL,
  icon          TEXT,
  level         INT CHECK (level >= 0 AND level <= 100),
  sort_order    INT NOT NULL DEFAULT 0,
  visible       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_skills_locale ON skills (locale);
CREATE INDEX idx_skills_category_key ON skills (category_key);

CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible skills"
  ON skills FOR SELECT
  USING (visible = true);

-- ---------------------------------------------------------------------------
-- 4. work_experience — professional experience
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS work_experience (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale       TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  company      TEXT NOT NULL,
  company_url  TEXT,
  logo_url     TEXT,
  title        TEXT NOT NULL,
  description  TEXT,
  start_date   DATE NOT NULL,
  end_date     DATE,
  location     TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  visible      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_work_experience_locale ON work_experience (locale);

CREATE TRIGGER trg_work_experience_updated_at
  BEFORE UPDATE ON work_experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE work_experience ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible work_experience"
  ON work_experience FOR SELECT
  USING (visible = true);

-- ---------------------------------------------------------------------------
-- 5. education — academic background
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS education (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale        TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  school        TEXT NOT NULL,
  school_url    TEXT,
  logo_url      TEXT,
  degree        TEXT NOT NULL,
  field         TEXT,
  description   TEXT,
  start_date    DATE NOT NULL,
  end_date      DATE,
  location      TEXT,
  sort_order    INT NOT NULL DEFAULT 0,
  visible       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_education_locale ON education (locale);

CREATE TRIGGER trg_education_updated_at
  BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE education ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible education"
  ON education FOR SELECT
  USING (visible = true);

-- ---------------------------------------------------------------------------
-- 6. projects — portfolio projects
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale        TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL,
  description   TEXT,
  long_description TEXT,
  image_url     TEXT,
  video_url     TEXT,
  live_url      TEXT,
  source_url    TEXT,
  technologies  TEXT[] DEFAULT '{}',
  featured      BOOLEAN NOT NULL DEFAULT false,
  sort_order    INT NOT NULL DEFAULT 0,
  visible       BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_projects_slug_locale ON projects (slug, locale);
CREATE INDEX idx_projects_locale ON projects (locale);
CREATE INDEX idx_projects_featured ON projects (featured) WHERE featured = true;

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible projects"
  ON projects FOR SELECT
  USING (visible = true);

-- ---------------------------------------------------------------------------
-- 7. blog_posts — blog articles
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS blog_posts (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale        TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL,
  excerpt       TEXT,
  content       TEXT,
  cover_image   TEXT,
  tags          TEXT[] DEFAULT '{}',
  published     BOOLEAN NOT NULL DEFAULT false,
  published_at  TIMESTAMPTZ,
  reading_time  INT,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_blog_posts_slug_locale ON blog_posts (slug, locale);
CREATE INDEX idx_blog_posts_published_locale ON blog_posts (published, locale);
CREATE INDEX idx_blog_posts_locale ON blog_posts (locale);

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read published blog_posts"
  ON blog_posts FOR SELECT
  USING (published = true);

-- ---------------------------------------------------------------------------
-- 8. gallery_images — photo gallery (locale-aware)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS gallery_images (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale      TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  title       TEXT,
  description TEXT,
  image_url   TEXT NOT NULL,
  alt_text    TEXT,
  category    TEXT,
  sort_order  INT NOT NULL DEFAULT 0,
  visible     BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_gallery_images_locale ON gallery_images (locale);
CREATE INDEX idx_gallery_images_category ON gallery_images (category);

CREATE TRIGGER trg_gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible gallery_images"
  ON gallery_images FOR SELECT
  USING (visible = true);

-- ---------------------------------------------------------------------------
-- 9. hackathons — hackathon participations and awards
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hackathons (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale       TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  name         TEXT NOT NULL,
  organizer    TEXT,
  description  TEXT,
  url          TEXT,
  image_url    TEXT,
  award        TEXT,
  start_date   DATE NOT NULL,
  end_date     DATE,
  location     TEXT,
  sort_order   INT NOT NULL DEFAULT 0,
  visible      BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_hackathons_locale ON hackathons (locale);

CREATE TRIGGER trg_hackathons_updated_at
  BEFORE UPDATE ON hackathons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE hackathons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read visible hackathons"
  ON hackathons FOR SELECT
  USING (visible = true);

-- ---------------------------------------------------------------------------
-- 10. seo_metadata — per-page SEO overrides
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS seo_metadata (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  locale           TEXT NOT NULL DEFAULT 'tr' CHECK (locale IN ('tr', 'en')),
  page_slug        TEXT NOT NULL,
  title            TEXT,
  description      TEXT,
  og_title         TEXT,
  og_description   TEXT,
  og_image         TEXT,
  canonical_url    TEXT,
  no_index         BOOLEAN NOT NULL DEFAULT false,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_seo_metadata_page_slug_locale ON seo_metadata (page_slug, locale);
CREATE INDEX idx_seo_metadata_locale ON seo_metadata (locale);

CREATE TRIGGER trg_seo_metadata_updated_at
  BEFORE UPDATE ON seo_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read seo_metadata"
  ON seo_metadata FOR SELECT
  USING (true);

-- ---------------------------------------------------------------------------
-- 11. redirects — URL redirect rules
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS redirects (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  from_path    TEXT NOT NULL,
  to_path      TEXT NOT NULL,
  status_code  INT NOT NULL DEFAULT 301 CHECK (status_code IN (301, 302, 307, 308)),
  active       BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_redirects_from_path ON redirects (from_path);

CREATE TRIGGER trg_redirects_updated_at
  BEFORE UPDATE ON redirects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active redirects"
  ON redirects FOR SELECT
  USING (active = true);

-- =============================================================================
-- End of schema
-- =============================================================================
