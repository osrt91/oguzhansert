-- SEO & Analytics config table
CREATE TABLE IF NOT EXISTS seo_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ga_measurement_id TEXT DEFAULT '',
  meta_pixel_id TEXT DEFAULT '',
  site_description_tr TEXT DEFAULT 'Oguzhan Sert - Full-stack web uygulamalari, otomasyon ve teknik sistemler uzerine uzmanlasmis urun odakli gelistirici.',
  site_description_en TEXT DEFAULT 'Portfolio of Oguzhan Sert — a product-minded developer specializing in full-stack web applications, automation, and technical systems.',
  og_image_url TEXT DEFAULT 'https://oguzhansert.dev/images/og-image.png',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE seo_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON seo_config FOR SELECT USING (true);
CREATE POLICY "Auth write" ON seo_config FOR ALL USING (auth.role() = 'authenticated');

-- Insert default row
INSERT INTO seo_config (site_description_tr, site_description_en, og_image_url)
VALUES (
  'Oguzhan Sert - Full-stack web uygulamalari, otomasyon ve teknik sistemler uzerine uzmanlasmis urun odakli gelistirici.',
  'Portfolio of Oguzhan Sert — a product-minded developer specializing in full-stack web applications, automation, and technical systems.',
  'https://oguzhansert.dev/images/og-image.png'
);

-- Fix EN content: remove Turkish chars from English hero_content
UPDATE hero_content SET name_line1 = 'OGUZHAN' WHERE lang = 'en' AND name_line1 = 'OĞUZHAN';

-- Fix EN content: remove Turkish chars from English site_config footer
UPDATE site_config SET footer_text = 'Designed and Developed by Oguzhan Sert' WHERE footer_text LIKE '%Oğuzhan%';
