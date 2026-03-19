"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Loader2, Plus, Trash2 } from "lucide-react";

interface SettingRow {
  key: string;
  value: Record<string, unknown>;
  locale: string;
  updated_at: string;
}

const DEFAULT_KEYS = [
  "site_title",
  "site_description",
  "analytics_ga_id",
  "analytics_gtm_id",
  "social_github",
  "social_linkedin",
  "social_twitter",
  "contact_email",
];

const KEY_LABELS: Record<string, string> = {
  site_title: "Site Başlığı",
  site_description: "Site Açıklaması",
  analytics_ga_id: "Google Analytics ID",
  analytics_gtm_id: "Google Tag Manager ID",
  social_github: "GitHub URL",
  social_linkedin: "LinkedIn URL",
  social_twitter: "Twitter URL",
  contact_email: "İletişim E-posta",
};

export default function AyarlarPage() {
  const [settings, setSettings] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site_settings");
      const json = await res.json();
      if (json.success) {
        const data = json.data as SettingRow[];
        setSettings(data);
        const values: Record<string, string> = {};
        data.forEach((s) => {
          values[s.key] = typeof s.value === "object" ? JSON.stringify(s.value) : String(s.value);
        });
        setFormValues(values);
      }
    } catch {
      toast.error("Ayarlar yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    setSaving(true);
    try {
      for (const [key, value] of Object.entries(formValues)) {
        const existing = settings.find((s) => s.key === key);
        let parsedValue: Record<string, unknown>;
        try {
          parsedValue = JSON.parse(value);
        } catch {
          parsedValue = { value };
        }

        if (existing) {
          await fetch(`/api/admin/site_settings/${existing.key}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ value: parsedValue }),
          });
        } else {
          await fetch("/api/admin/site_settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key, value: parsedValue, locale: "tr" }),
          });
        }
      }
      toast.success("Ayarlar kaydedildi.");
      fetchSettings();
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const addSetting = async () => {
    if (!newKey.trim()) return;
    let parsedValue: Record<string, unknown>;
    try {
      parsedValue = JSON.parse(newValue || "{}");
    } catch {
      parsedValue = { value: newValue };
    }
    try {
      const res = await fetch("/api/admin/site_settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: newKey.trim(), value: parsedValue, locale: "tr" }),
      });
      const json = await res.json();
      if (json.success) {
        toast.success("Ayar eklendi.");
        setNewKey("");
        setNewValue("");
        fetchSettings();
      } else {
        toast.error(json.error || "Eklenemedi.");
      }
    } catch {
      toast.error("Bir hata oluştu.");
    }
  };

  const deleteSetting = async (key: string) => {
    if (!confirm(`"${key}" ayarını silmek istediğinize emin misiniz?`)) return;
    const existing = settings.find((s) => s.key === key);
    if (!existing) return;
    try {
      await fetch(`/api/admin/site_settings/${existing.key}`, { method: "DELETE" });
      toast.success("Ayar silindi.");
      fetchSettings();
    } catch {
      toast.error("Silinemedi.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Site Ayarları</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          Kaydet
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...
        </div>
      ) : (
        <div className="max-w-2xl space-y-4">
          {/* Existing settings */}
          {DEFAULT_KEYS.map((key) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">
                  {KEY_LABELS[key] || key}
                </label>
                {settings.find((s) => s.key === key) && (
                  <button onClick={() => deleteSetting(key)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <input
                value={formValues[key] || ""}
                onChange={(e) => setFormValues({ ...formValues, [key]: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}

          {/* Custom settings not in defaults */}
          {settings
            .filter((s) => !DEFAULT_KEYS.includes(s.key))
            .map((s) => (
              <div key={s.key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-foreground">{s.key}</label>
                  <button onClick={() => deleteSetting(s.key)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <input
                  value={formValues[s.key] || ""}
                  onChange={(e) => setFormValues({ ...formValues, [s.key]: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}

          {/* Add new setting */}
          <div className="border-t border-border pt-4 mt-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Yeni Ayar Ekle</h3>
            <div className="flex gap-2">
              <input
                placeholder="Anahtar"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <input
                placeholder="Değer"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button size="sm" variant="outline" onClick={addSetting}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
