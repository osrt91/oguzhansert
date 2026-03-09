import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { CareerEntry, Lang } from "../../lib/types";

const emptyEntry = (lang: Lang, order: number): CareerEntry => ({
  id: "",
  lang,
  position: "",
  company: "",
  year: "",
  description: "",
  sort_order: order,
});

const CareerPage = () => {
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [entries, setEntries] = useState<CareerEntry[]>([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("career_entries").select("*").eq("lang", activeLang).order("sort_order").then(({ data }) => {
      setEntries(data?.length ? data : [emptyEntry(activeLang, 1)]);
    });
  }, [activeLang]);

  const updateEntry = (index: number, updates: Partial<CareerEntry>) => {
    setEntries(entries.map((e, i) => i === index ? { ...e, ...updates } : e));
  };

  const addEntry = () => {
    setEntries([...entries, emptyEntry(activeLang, entries.length + 1)]);
  };

  const removeEntry = async (index: number) => {
    const entry = entries[index];
    if (entry.id) {
      await supabase.from("career_entries").delete().eq("id", entry.id);
    }
    setEntries(entries.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    for (const entry of entries) {
      const payload = { ...entry, lang: activeLang };
      if (entry.id) {
        await supabase.from("career_entries").update(payload).eq("id", entry.id);
      } else {
        const { id: _, ...rest } = payload;
        await supabase.from("career_entries").insert(rest);
      }
    }

    setMessage({ type: "success", text: "Kaydedildi!" });
    setSaving(false);
  };

  return (
    <div>
      <h1>Kariyer</h1>
      <p className="admin-subtitle">Kariyer ve deneyim zaman çizelgesi</p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button className={`admin-btn ${activeLang === "tr" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("tr")}>Türkçe</button>
        <button className={`admin-btn ${activeLang === "en" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("en")}>English</button>
      </div>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      {entries.map((entry, index) => (
        <div className="admin-card" key={index}>
          <div className="admin-card-header">
            <h3>{entry.position || `Giriş ${index + 1}`}</h3>
            <button className="admin-btn admin-btn-danger" onClick={() => removeEntry(index)}>Sil</button>
          </div>
          <div className="admin-grid">
            <div className="admin-field">
              <label>Pozisyon</label>
              <input value={entry.position} onChange={(e) => updateEntry(index, { position: e.target.value })} />
            </div>
            <div className="admin-field">
              <label>Şirket</label>
              <input value={entry.company} onChange={(e) => updateEntry(index, { company: e.target.value })} />
            </div>
          </div>
          <div className="admin-field">
            <label>Yıl</label>
            <input value={entry.year} onChange={(e) => updateEntry(index, { year: e.target.value })} placeholder="2024 veya NOW" />
          </div>
          <div className="admin-field">
            <label>Açıklama</label>
            <textarea value={entry.description} onChange={(e) => updateEntry(index, { description: e.target.value })} rows={3} />
          </div>
        </div>
      ))}

      <div className="admin-actions">
        <button className="admin-btn admin-btn-secondary" onClick={addEntry}>+ Yeni Giriş Ekle</button>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default CareerPage;
