-- ==========================================
-- oguzhansert.dev - Supabase Veritabanı Şeması
-- Bu SQL'i Supabase Dashboard > SQL Editor'da çalıştırın
-- ==========================================

-- Site genel ayarları (tek satır)
CREATE TABLE IF NOT EXISTS site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_text TEXT DEFAULT 'OS',
  email TEXT DEFAULT 'info@oguzhansert.dev',
  phone TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  twitter_url TEXT DEFAULT '',
  instagram_url TEXT DEFAULT '',
  resume_url TEXT DEFAULT '',
  footer_text TEXT DEFAULT 'Designed and Developed by Oğuzhan Sert',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Hero bölümü (TR/EN)
CREATE TABLE IF NOT EXISTS hero_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lang TEXT NOT NULL CHECK (lang IN ('tr', 'en')),
  greeting TEXT NOT NULL,
  name_line1 TEXT NOT NULL,
  name_line2 TEXT NOT NULL,
  subtitle_prefix TEXT NOT NULL,
  subtitle_role1 TEXT NOT NULL,
  subtitle_role2 TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lang)
);

-- About bölümü (TR/EN)
CREATE TABLE IF NOT EXISTS about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lang TEXT NOT NULL CHECK (lang IN ('tr', 'en')),
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(lang)
);

-- What I Do kartları (TR/EN)
CREATE TABLE IF NOT EXISTS whatido_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lang TEXT NOT NULL CHECK (lang IN ('tr', 'en')),
  title TEXT NOT NULL,
  description_title TEXT DEFAULT 'Description',
  description TEXT NOT NULL,
  skills_title TEXT DEFAULT 'Skillset & tools',
  skills JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kariyer girişleri (TR/EN)
CREATE TABLE IF NOT EXISTS career_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lang TEXT NOT NULL CHECK (lang IN ('tr', 'en')),
  position TEXT NOT NULL,
  company TEXT NOT NULL,
  year TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projeler (TR/EN)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lang TEXT NOT NULL CHECK (lang IN ('tr', 'en')),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  tools TEXT NOT NULL,
  image_url TEXT DEFAULT '/images/placeholder.webp',
  link TEXT DEFAULT '#',
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tech Stack
CREATE TABLE IF NOT EXISTS tech_stack (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- Row Level Security (RLS)
-- Herkese okuma, sadece auth kullanıcıya yazma
-- ==========================================

ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatido_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE career_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stack ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir
CREATE POLICY "Public read" ON site_config FOR SELECT USING (true);
CREATE POLICY "Public read" ON hero_content FOR SELECT USING (true);
CREATE POLICY "Public read" ON about_content FOR SELECT USING (true);
CREATE POLICY "Public read" ON whatido_cards FOR SELECT USING (true);
CREATE POLICY "Public read" ON career_entries FOR SELECT USING (true);
CREATE POLICY "Public read" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read" ON tech_stack FOR SELECT USING (true);

-- Sadece giriş yapmış kullanıcı yazabilir
CREATE POLICY "Auth write" ON site_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON hero_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON about_content FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON whatido_cards FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON career_entries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON tech_stack FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- Varsayılan veriler
-- ==========================================

-- Site config
INSERT INTO site_config (logo_text, email, github_url, linkedin_url, twitter_url, instagram_url, footer_text)
VALUES ('OS', 'info@oguzhansert.dev', 'https://github.com/oguzhansert', 'https://linkedin.com/in/oguzhansert', 'https://twitter.com/oguzhansert', 'https://instagram.com/oguzhansert', 'Designed and Developed by Oğuzhan Sert');

-- Hero TR
INSERT INTO hero_content (lang, greeting, name_line1, name_line2, subtitle_prefix, subtitle_role1, subtitle_role2)
VALUES ('tr', 'Merhaba! Ben', 'OĞUZHAN', 'SERT', 'Bir', 'Geliştirici', 'Ürün Yapımcısı');

-- Hero EN
INSERT INTO hero_content (lang, greeting, name_line1, name_line2, subtitle_prefix, subtitle_role1, subtitle_role2)
VALUES ('en', 'Hello! I''m', 'OĞUZHAN', 'SERT', 'A Creative', 'Developer', 'Builder');

-- About TR
INSERT INTO about_content (lang, title, body)
VALUES ('tr', 'Hakkımda', 'Ürün odaklı bir geliştirici ve teknik operatörüm. Temiz mimari, hızlı teslimat ve gerçek değer üreten çözümler inşa ediyorum. Full-stack uygulamalardan otomasyon sistemlerine kadar geniş bir yelpazede çalışıyorum.');

-- About EN
INSERT INTO about_content (lang, title, body)
VALUES ('en', 'About Me', 'I''m a product-minded developer and technical operator. I build products, automate systems, and ship things that work. Focused on clean architecture, thoughtful design, and delivering real value.');

-- Tech Stack
INSERT INTO tech_stack (name, image_url, sort_order) VALUES
('React', '/images/react2.webp', 1),
('Next.js', '/images/next2.webp', 2),
('Node.js', '/images/node2.webp', 3),
('Express', '/images/express.webp', 4),
('MongoDB', '/images/mongo.webp', 5),
('MySQL', '/images/mysql.webp', 6),
('TypeScript', '/images/typescript.webp', 7),
('JavaScript', '/images/javascript.webp', 8);
