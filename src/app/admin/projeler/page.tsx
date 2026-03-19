"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types/database";
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, Loader2, X } from "lucide-react";

const LOCALES = ["tr", "en"] as const;

const EMPTY: Partial<Project> = {
  title: "",
  description: "",
  image_url: "",
  url: "",
  source_url: "",
  technologies: [],
  sort_order: 0,
  visible: true,
  featured: false,
};

export default function ProjelerPage() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } =
    useAdmin<Project>("projects");
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("tr");
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [techInput, setTechInput] = useState("");

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
    setTechInput("");
    fetchItems(locale);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await deleteItem(id);
    fetchItems(locale);
  };

  const toggleVisibility = async (item: Project) => {
    await updateItem(item.id, { visible: !item.visible });
    fetchItems(locale);
  };

  const toggleFeatured = async (item: Project) => {
    await updateItem(item.id, { featured: !item.featured });
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

  const addTech = () => {
    if (!techInput.trim() || !editing) return;
    setEditing({
      ...editing,
      technologies: [...(editing.technologies || []), techInput.trim()],
    });
    setTechInput("");
  };

  const removeTech = (index: number) => {
    if (!editing) return;
    const techs = [...(editing.technologies || [])];
    techs.splice(index, 1);
    setEditing({ ...editing, technologies: techs });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Projeler</h1>
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
              {editing.id ? "Düzenle" : "Yeni Proje"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { name: "title", label: "Başlık" },
              { name: "url", label: "Proje URL" },
              { name: "source_url", label: "Kaynak Kodu URL" },
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
            <textarea
              name="description"
              value={editing.description || ""}
              onChange={handleChange}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Teknolojiler</label>
            <div className="flex gap-2">
              <input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTech())}
                placeholder="Teknoloji ekle..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button type="button" size="sm" variant="outline" onClick={addTech}>Ekle</Button>
            </div>
            {(editing.technologies || []).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {editing.technologies!.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
                  >
                    {tech}
                    <button onClick={() => removeTech(i)} className="text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.featured || false}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="rounded"
              />
              Öne Çıkan
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={editing.visible !== false}
                onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
                className="rounded"
              />
              Görünür
            </label>
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
        <p className="text-sm text-muted-foreground">Henüz proje eklenmemiş.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlık</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Teknolojiler</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sıra</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Öne Çıkan</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground">{item.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(item.technologies || []).slice(0, 3).map((t, i) => (
                        <span key={i} className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">{t}</span>
                      ))}
                      {(item.technologies || []).length > 3 && (
                        <span className="text-xs text-muted-foreground">+{item.technologies.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleFeatured(item)}>
                      {item.featured ? <Star className="h-4 w-4 text-amber-500 fill-amber-500" /> : <StarOff className="h-4 w-4 text-muted-foreground" />}
                    </button>
                  </td>
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
