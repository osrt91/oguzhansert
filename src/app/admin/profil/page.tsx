"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Profile } from "@/types/database";
import { Save, Loader2 } from "lucide-react";

const LOCALES = ["tr", "en"] as const;

const EMPTY_PROFILE: Partial<Profile> = {
  name: "",
  initials: "",
  title: "",
  location: "",
  location_link: "",
  description: "",
  summary: "",
  avatar_url: "",
  resume_pdf_url: "",
  email: "",
  phone: "",
  social_links: {},
};

export default function ProfilPage() {
  const { items, loading, fetchItems, createItem, updateItem } =
    useAdmin<Profile>("profile");
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("tr");
  const [form, setForm] = useState<Partial<Profile>>(EMPTY_PROFILE);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchItems(locale);
  }, [fetchItems, locale]);

  useEffect(() => {
    if (items.length > 0) {
      setForm(items[0]);
    } else {
      setForm({ ...EMPTY_PROFILE, locale });
    }
  }, [items, locale]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSocialChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      social_links: { ...((prev.social_links as Record<string, string>) || {}), [key]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, locale };
      if (items.length > 0 && items[0].id) {
        await updateItem(items[0].id, payload);
      } else {
        await createItem(payload);
      }
      fetchItems(locale);
    } catch {
      toast.error("Kayıt sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const socialKeys = ["github", "linkedin", "twitter", "website"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Profil</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Kaydet
        </Button>
      </div>

      {/* Locale tabs */}
      <div className="flex gap-1 rounded-md border border-border p-1 w-fit">
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              locale === l
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Yükleniyor...
        </div>
      ) : (
        <div className="grid gap-4 max-w-2xl">
          {[
            { name: "name", label: "Ad Soyad" },
            { name: "initials", label: "Kısaltma" },
            { name: "title", label: "Ünvan" },
            { name: "email", label: "E-posta" },
            { name: "phone", label: "Telefon" },
            { name: "location", label: "Konum" },
            { name: "location_link", label: "Konum Linki" },
            { name: "avatar_url", label: "Avatar URL" },
            { name: "resume_pdf_url", label: "CV PDF URL" },
          ].map((field) => (
            <div key={field.name}>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {field.label}
              </label>
              <input
                name={field.name}
                value={(form as Record<string, string>)[field.name] || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Açıklama
            </label>
            <textarea
              name="description"
              value={form.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Özet
            </label>
            <textarea
              name="summary"
              value={form.summary || ""}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Sosyal Medya</p>
            {socialKeys.map((key) => (
              <div key={key}>
                <label className="mb-1 block text-xs text-muted-foreground capitalize">
                  {key}
                </label>
                <input
                  value={
                    ((form.social_links as Record<string, string>) || {})[key] || ""
                  }
                  onChange={(e) => handleSocialChange(key, e.target.value)}
                  placeholder={`https://${key}.com/...`}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
