import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { SiteConfig } from "../../lib/types";

const SiteConfigPage = () => {
  const [config, setConfig] = useState<SiteConfig>({
    id: "",
    logo_text: "OS",
    email: "info@oguzhansert.dev",
    phone: "",
    github_url: "",
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    resume_url: "",
    footer_text: "Designed and Developed by Oğuzhan Sert",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("site_config").select("*").single().then(({ data }) => {
      if (data) setConfig(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    const { error } = config.id
      ? await supabase.from("site_config").update(config).eq("id", config.id)
      : await supabase.from("site_config").insert(config);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "Site ayarları kaydedildi!" });
    }
    setSaving(false);
  };

  return (
    <div>
      <h1>Site Ayarları</h1>
      <p className="admin-subtitle">Genel site bilgileri ve sosyal medya linkleri</p>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      <div className="admin-grid">
        <div className="admin-field">
          <label>Logo Metni</label>
          <input value={config.logo_text} onChange={(e) => setConfig({ ...config, logo_text: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>E-posta</label>
          <input value={config.email} onChange={(e) => setConfig({ ...config, email: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Telefon</label>
          <input value={config.phone} onChange={(e) => setConfig({ ...config, phone: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Resume URL</label>
          <input value={config.resume_url} onChange={(e) => setConfig({ ...config, resume_url: e.target.value })} />
        </div>
      </div>

      <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>Sosyal Medya</h3>
      <div className="admin-grid">
        <div className="admin-field">
          <label>GitHub URL</label>
          <input value={config.github_url} onChange={(e) => setConfig({ ...config, github_url: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>LinkedIn URL</label>
          <input value={config.linkedin_url} onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Twitter URL</label>
          <input value={config.twitter_url} onChange={(e) => setConfig({ ...config, twitter_url: e.target.value })} />
        </div>
        <div className="admin-field">
          <label>Instagram URL</label>
          <input value={config.instagram_url} onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })} />
        </div>
      </div>

      <div className="admin-field" style={{ marginTop: "16px" }}>
        <label>Footer Metni</label>
        <input value={config.footer_text} onChange={(e) => setConfig({ ...config, footer_text: e.target.value })} />
      </div>

      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default SiteConfigPage;
