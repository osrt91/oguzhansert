import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { TechStackItem } from "../../lib/types";

const emptyItem = (order: number): TechStackItem => ({
  id: "",
  name: "",
  image_url: "",
  sort_order: order,
});

const TechStackPage = () => {
  const [items, setItems] = useState<TechStackItem[]>([]);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("tech_stack").select("*").order("sort_order").then(({ data }) => {
      setItems(data?.length ? data : [emptyItem(1)]);
    });
  }, []);

  const updateItem = (index: number, updates: Partial<TechStackItem>) => {
    setItems(items.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const addItem = () => {
    setItems([...items, emptyItem(items.length + 1)]);
  };

  const removeItem = async (index: number) => {
    const item = items[index];
    if (item.id) {
      await supabase.from("tech_stack").delete().eq("id", item.id);
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    for (const item of items) {
      if (item.id) {
        await supabase.from("tech_stack").update(item).eq("id", item.id);
      } else {
        const { id: _, ...rest } = item;
        await supabase.from("tech_stack").insert(rest);
      }
    }

    setMessage({ type: "success", text: "Tech stack kaydedildi!" });
    setSaving(false);
  };

  return (
    <div>
      <h1>Tech Stack</h1>
      <p className="admin-subtitle">3D fizik sahnesindeki teknoloji küreleri</p>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      {items.map((item, index) => (
        <div className="admin-card" key={index}>
          <div className="admin-card-header">
            <h3>{item.name || `Teknoloji ${index + 1}`}</h3>
            <button className="admin-btn admin-btn-danger" onClick={() => removeItem(index)}>Sil</button>
          </div>
          <div className="admin-grid">
            <div className="admin-field">
              <label>Teknoloji Adı</label>
              <input value={item.name} onChange={(e) => updateItem(index, { name: e.target.value })} placeholder="React" />
            </div>
            <div className="admin-field">
              <label>Görsel URL</label>
              <input value={item.image_url} onChange={(e) => updateItem(index, { image_url: e.target.value })} placeholder="/images/react2.webp" />
            </div>
          </div>
        </div>
      ))}

      <div className="admin-actions">
        <button className="admin-btn admin-btn-secondary" onClick={addItem}>+ Yeni Teknoloji Ekle</button>
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </div>
  );
};

export default TechStackPage;
