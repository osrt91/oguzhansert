-- =============================================================================
-- Oguzhan Sert Portfolio — Supabase Storage Buckets
-- =============================================================================
-- Run this file after supabase-schema.sql to create storage buckets.
-- All buckets are public-read for serving assets on the frontend.
-- =============================================================================

-- 1. avatars — profile photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. logos — company/school logos for experience & education
INSERT INTO storage.buckets (id, name, public)
VALUES ('logos', 'logos', true)
ON CONFLICT (id) DO NOTHING;

-- 3. projects — project screenshots, thumbnails, videos
INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- 4. blog — blog post cover images and inline media
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog', 'blog', true)
ON CONFLICT (id) DO NOTHING;

-- 5. gallery — gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 6. documents — resume, certificates, downloadable files
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true)
ON CONFLICT (id) DO NOTHING;

-- 7. site — general site assets (favicon, OG images, etc.)
INSERT INTO storage.buckets (id, name, public)
VALUES ('site', 'site', true)
ON CONFLICT (id) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Public read policies for all buckets
-- ---------------------------------------------------------------------------

CREATE POLICY "Public read avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Public read logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'logos');

CREATE POLICY "Public read projects"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'projects');

CREATE POLICY "Public read blog"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'blog');

CREATE POLICY "Public read gallery"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');

CREATE POLICY "Public read documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents');

CREATE POLICY "Public read site"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site');

-- =============================================================================
-- End of storage setup
-- =============================================================================
