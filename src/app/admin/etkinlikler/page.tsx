"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import type { Hackathon } from "@/types/database";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X } from "lucide-react";

const LOCALES = ["tr", "en"] as const;

const EMPTY: Partial<Hackathon> = {
  title: "",
  description: "",
  start_date: "",
  date: "",
  location: "",
  url: "",
  image_url: "",
  sort_order: 0,
  visible: true,
};

export default function EtkinliklerPage() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } =
    useAdmin<Hackathon>("hackathons");
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("tr");
  const [editing, setEditing] = useState<Partial<Hackathon> | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchItems(locale);
  }, [fetchItems, locale]);

  const handleSave = async () => {
    if (!editing) return;
    const payload = { ...editing, locale };
    if (editing.id) {
      const { id, created_at, updated_at, ...rest } = payload;
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

  const toggleVisibility = async (item: Hackathon) => {
    await updateItem(item.id, { visible: !item.visible });
    fetchItems(locale);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setEditing((prev) =>
      prev ? { ...prev, [name]: type === "number" ? Number(value) : value } : null
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Etkinlikler</h1>
        <Button onClick={() => { setEditing({ ...EMPTY }); setShowForm(true); }}>
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
              {editing.id ? "Düzenle" : "Yeni Etkinlik"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: "title", label: "Başlık" },
              { name: "location", label: "Konum" },
              { name: "start_date", label: "Başlangıç Tarihi" },
              { name: "date", label: "Tarih Metni" },
              { name: "url", label: "Etkinlik URL" },
              { name: "image_url", label: "Görsel URL" },
              { name: "sort_order", label: "Sıra", type: "number" },
            ].map((field) => (
              <div key={field.name}>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">{field.label}</label>
                <input
                  name={field.name}
                  type={field.type || "text"}
                  value={(editing as Record<string, string | number>)[field.name] ?? ""}
                  onChange={handleChange}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            ))}
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Açıklama</label>
            <textarea name="description" value={editing.description || ""} onChange={handleChange} rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
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
        <p className="text-sm text-muted-foreground">Henüz etkinlik eklenmemiş.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlık</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Konum</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tarih</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sıra</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.location}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleVisibility(item)}>
                      {item.visible ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => { setEditing({ ...item }); setShowForm(true); }} className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground">
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
