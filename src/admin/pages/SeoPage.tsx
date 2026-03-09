import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { SeoConfig } from "../../lib/types";

const SeoPage = () => {
  const [config, setConfig] = useState<SeoConfig>({
    id: "",
    ga_measurement_id: "",
    meta_pixel_id: "",
    site_description_tr: "",
    site_description_en: "",
    og_image_url: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.from("seo_config").select("*").single().then(({ data }) => {
      if (data) setConfig(data);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });

    const { error } = config.id
      ? await supabase.from("seo_config").update(config).eq("id", config.id)
      : await supabase.from("seo_config").insert(config);

    if (error) {
      setMessage({ type: "error", text: error.message });
    } else {
      setMessage({ type: "success", text: "SEO settings saved!" });
    }
    setSaving(false);
  };

  return (
    <div>
      <h1>SEO & Analytics</h1>
      <p className="admin-subtitle">Google Analytics, Meta Pixel and SEO settings</p>

      {message.text && <div className={`admin-message ${message.type}`}>{message.text}</div>}

      <h3 style={{ marginTop: "0", marginBottom: "16px" }}>Analytics & Tracking</h3>
      <div className="admin-grid">
        <div className="admin-field">
          <label>Google Analytics (GA4) Measurement ID</label>
          <input
            placeholder="G-XXXXXXXXXX"
            value={config.ga_measurement_id}
            onChange={(e) => setConfig({ ...config, ga_measurement_id: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>Meta Pixel ID</label>
          <input
            placeholder="123456789012345"
            value={config.meta_pixel_id}
            onChange={(e) => setConfig({ ...config, meta_pixel_id: e.target.value })}
          />
        </div>
      </div>

      <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>SEO Descriptions</h3>
      <div className="admin-field">
        <label>Site Description (TR)</label>
        <textarea
          value={config.site_description_tr}
          onChange={(e) => setConfig({ ...config, site_description_tr: e.target.value })}
          placeholder="Turkce site aciklamasi..."
        />
      </div>
      <div className="admin-field">
        <label>Site Description (EN)</label>
        <textarea
          value={config.site_description_en}
          onChange={(e) => setConfig({ ...config, site_description_en: e.target.value })}
          placeholder="English site description..."
        />
      </div>

      <h3 style={{ marginTop: "24px", marginBottom: "16px" }}>Open Graph</h3>
      <div className="admin-field">
        <label>OG Image URL (1200x630px recommended)</label>
        <input
          value={config.og_image_url}
          onChange={(e) => setConfig({ ...config, og_image_url: e.target.value })}
          placeholder="https://oguzhansert.dev/images/og-image.png"
        />
      </div>

      <div className="admin-actions">
        <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
};

export default SeoPage;
