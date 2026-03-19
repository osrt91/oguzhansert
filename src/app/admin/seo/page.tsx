"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import type { SeoMetadata } from "@/types/database";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";

const LOCALES = ["tr", "en"] as const;

const EMPTY: Partial<SeoMetadata> = {
  page_slug: "",
  title: "",
  description: "",
  og_title: "",
  og_description: "",
  og_image_url: "",
  canonical_url: "",
  no_index: false,
  json_ld: {},
};

export default function SeoPage() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } =
    useAdmin<SeoMetadata>("seo_metadata");
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("tr");
  const [editing, setEditing] = useState<Partial<SeoMetadata> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [jsonLdText, setJsonLdText] = useState("{}");

  useEffect(() => {
    fetchItems(locale);
  }, [fetchItems, locale]);

  const handleSave = async () => {
    if (!editing) return;
    let parsedJsonLd = {};
    try {
      parsedJsonLd = JSON.parse(jsonLdText);
    } catch {
      // Keep as empty object if invalid JSON
    }
    const payload = { ...editing, locale, json_ld: parsedJsonLd };
    if (editing.id) {
      const { id, updated_at, ...rest } = payload;
      await updateItem(id!, rest);
    } else {
      await createItem(payload);
    }
    setEditing(null);
    setShowForm(false);
    fetchItems(locale);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await deleteItem(id);
    fetchItems(locale);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditing((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  const openEdit = (item: Partial<SeoMetadata>) => {
    setEditing({ ...item });
    setJsonLdText(JSON.stringify(item.json_ld || {}, null, 2));
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">SEO Metadata</h1>
        <Button onClick={() => { openEdit({ ...EMPTY }); }}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
        </Button>
      </div>

      <div className="flex gap-1 rounded-md border border-border p-1 w-fit">
        {LOCALES.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${
              locale === l ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.toUpperCase()}
          </button>
        ))}
      </div>

      {showForm && editing && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {editing.id ? "Düzenle" : "Yeni SEO Kaydı"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: "page_slug", label: "Sayfa Slug" },
              { name: "title", label: "Title" },
              { name: "og_title", label: "OG Title" },
              { name: "og_image_url", label: "OG Image URL" },
              { name: "canonical_url", label: "Canonical URL" },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
                <input
                  name={field.name}
                  value={(editing as Record<string, string>)[field.name] || ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.no_index || false}
                  onChange={(e) => setEditing({ ...editing, no_index: e.target.checked })}
                  className="rounded"
                />
                noindex
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Description</label>
            <textarea name="description" value={editing.description || ""} onChange={handleChange} rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">OG Description</label>
            <textarea name="og_description" value={editing.og_description || ""} onChange={handleChange} rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">JSON-LD</label>
            <textarea
              value={jsonLdText}
              onChange={(e) => setJsonLdText(e.target.value)}
              rows={6}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>Kaydet</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setEditing(null); }}>İptal</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Yükleniyor...
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz SEO metadata eklenmemiş.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sayfa</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">noindex</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{item.page_slug}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.no_index ? "Evet" : "Hayır"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => openEdit(item)} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
