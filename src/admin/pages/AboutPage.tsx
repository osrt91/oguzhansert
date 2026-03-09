import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { AboutContent, Lang } from "../../lib/types";

const AboutPage = () => {
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [about, setAbout] = useState<AboutContent>({ id: "", lang: "tr", title: "", body: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("about_content").select("*").eq("lang", activeLang).single().then(({ data }) => {
      setAbout(data || { id: "", lang: activeLang, title: "", body: "" });
    });
  }, [activeLang]);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    const payload = { ...about, lang: activeLang };
    const { error } = about.id
      ? await supabase.from("about_content").update(payload).eq("id", about.id)
      : await supabase.from("about_content").insert(payload);

    setMessage(error ? { type: "error", text: error.message } : { type: "success", text: "Kaydedildi!" });
    setSaving(false);
  };

  return (
    <div>
      <h1>Hakkımda</h1>
      <p className="admin-subtitle">About bölümü içeriği</p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button className={`admin-btn ${activeLang === "tr" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("tr")}>Türkçe</button>
        <button className={`admin-btn ${activeLang === "en" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("en")}>English</button>
      </div>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      <div className="admin-field">
        <label>Başlık</label>
        <input value={about.title} onChange={(e) => setAbout({ ...about, title: e.target.value })} />
      </div>
      <div className="admin-field">
        <label>İçerik</label>
        <textarea value={about.body} onChange={(e) => setAbout({ ...about, body: e.target.value })} rows={6} />
      </div>

      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default AboutPage;
