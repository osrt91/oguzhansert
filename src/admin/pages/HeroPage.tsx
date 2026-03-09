import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { HeroContent, Lang } from "../../lib/types";

const emptyHero = (lang: Lang): HeroContent => ({
  id: "",
  lang,
  greeting: "",
  name_line1: "",
  name_line2: "",
  subtitle_prefix: "",
  subtitle_role1: "",
  subtitle_role2: "",
});

const HeroPage = () => {
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [hero, setHero] = useState<HeroContent>(emptyHero("tr"));
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("hero_content").select("*").eq("lang", activeLang).single().then(({ data }) => {
      setHero(data || emptyHero(activeLang));
    });
  }, [activeLang]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    const payload = { ...hero, lang: activeLang };
    const { error } = hero.id
      ? await supabase.from("hero_content").update(payload).eq("id", hero.id)
      : await supabase.from("hero_content").insert(payload);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Hero kaydedildi!" });
    }
    setSaving(false);
  };

  return (
    <div>
      <h1>Hero Bölümü</h1>
      <p className="admin-subtitle">Ana sayfanın üst kısmındaki karşılama alanı</p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button className={`admin-btn ${activeLang === "tr" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("tr")}>
          Türkçe
        </button>
        <button className={`admin-btn ${activeLang === "en" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("en")}>
          English
        </button>
      </div>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      <div className="admin-field">
        <label>Karşılama ({activeLang === "tr" ? '"Merhaba! Ben"' : '"Hello! I\'m"'})</label>
        <input value={hero.greeting} onChange={(e) => setHero({ ...hero, greeting: e.target.value })} />
      </div>
      <div className="admin-grid">
        <div className="admin-field">
          <label>İsim Satır 1</label>
          <input value={hero.name_line1} onChange={(e) => setHero({ ...hero, name_line1: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>İsim Satır 2</label>
          <input value={hero.name_line2} onChange={(e) => setHero({ ...hero, name_line2: e.target.value })} />
        </div>
      </div>
      <div className="admin-field">
        <label>Alt Başlık Ön Ek ({activeLang === "tr" ? '"Bir"' : '"A Creative"'})</label>
        <input value={hero.subtitle_prefix} onChange={(e) => setHero({ ...hero, subtitle_prefix: e.target.value })} />
      </div>
      <div className="admin-grid">
        <div className="admin-field">
          <label>Rol 1 ({activeLang === "tr" ? '"Geliştirici"' : '"Developer"'})</label>
          <input value={hero.subtitle_role1} onChange={(e) => setHero({ ...hero, subtitle_role1: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Rol 2 ({activeLang === "tr" ? '"Ürün Yapımcısı"' : '"Builder"'})</label>
          <input value={hero.subtitle_role2} onChange={(e) => setHero({ ...hero, subtitle_role2: e.target.value })} />
        </div>
      </div>

      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default HeroPage;
