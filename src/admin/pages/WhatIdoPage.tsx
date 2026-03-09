import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { WhatIdoCard, Lang } from "../../lib/types";

const emptyCard = (lang: Lang, order: number): WhatIdoCard => ({
  id: "",
  lang,
  title: "",
  description_title: lang === "tr" ? "Açıklama" : "Description",
  description: "",
  skills_title: lang === "tr" ? "Beceriler & Araçlar" : "Skillset & tools",
  skills: [],
  sort_order: order,
});

const WhatIdoPage = () => {
  const [activeLang, setActiveLang] = useState<Lang>("tr");
  const [cards, setCards] = useState<WhatIdoCard[]>([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("whatido_cards").select("*").eq("lang", activeLang).order("sort_order").then(({ data }) => {
      setCards(data?.length ? data : [emptyCard(activeLang, 1), emptyCard(activeLang, 2)]);
    });
  }, [activeLang]);

  const updateCard = (index: number, updates: Partial<WhatIdoCard>) => {
    setCards(cards.map((c, i) => i === index ? { ...c, ...updates } : c));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    for (const card of cards) {
      const payload = { ...card, lang: activeLang };
      if (card.id) {
        await supabase.from("whatido_cards").update(payload).eq("id", card.id);
      } else {
        const { id: _, ...rest } = payload;
        await supabase.from("whatido_cards").insert(rest);
      }
    }

    setMessage({ type: "success", text: "Kaydedildi!" });
    setSaving(false);
  };

  return (
    <div>
      <h1>Ne Yapıyorum</h1>
      <p className="admin-subtitle">WHAT I DO bölümündeki kartlar</p>

      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        <button className={`admin-btn ${activeLang === "tr" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("tr")}>Türkçe</button>
        <button className={`admin-btn ${activeLang === "en" ? "admin-btn-primary" : "admin-btn-secondary"}`} onClick={() => setActiveLang("en")}>English</button>
      </div>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      {cards.map((card, index) => (
        <div className="admin-card" key={index}>
          <div className="admin-card-header">
            <h3>Kart {index + 1}</h3>
          </div>
          <div className="admin-field">
            <label>Başlık (ör: DEVELOP, BUILD)</label>
            <input value={card.title} onChange={(e) => updateCard(index, { title: e.target.value })} />
          </div>
          <div className="admin-field">
            <label>Açıklama</label>
            <textarea value={card.description} onChange={(e) => updateCard(index, { description: e.target.value })} rows={3} />
          </div>
          <div className="admin-field">
            <label>Beceriler (virgülle ayırın)</label>
            <input
              value={card.skills.join(", ")}
              onChange={(e) => updateCard(index, { skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
            />
          </div>
        </div>
      ))}

      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default WhatIdoPage;
