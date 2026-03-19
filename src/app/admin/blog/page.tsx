"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types/database";
import { Plus, Pencil, Trash2, Loader2, X, Globe, GlobeLock } from "lucide-react";

const LOCALES = ["tr", "en"] as const;

const EMPTY: Partial<BlogPost> = {
  slug: "",
  title: "",
  summary: "",
  content: "",
  cover_image_url: "",
  tags: [],
  published: false,
  published_at: null,
};

export default function BlogPage() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } =
    useAdmin<BlogPost>("blog_posts");
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("tr");
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    fetchItems(locale);
  }, [fetchItems, locale]);

  const handleSave = async () => {
    if (!editing) return;
    const payload = {
      ...editing,
      locale,
      published_at: editing.published ? editing.published_at || new Date().toISOString() : null,
    };
    if (editing.id) {
      const { id, created_at, updated_at, ...rest } = payload;
      await updateItem(id!, rest);
    } else {
      await createItem(payload);
    }
    setEditing(null);
    setShowForm(false);
    setTagInput("");
    fetchItems(locale);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    await deleteItem(id);
    fetchItems(locale);
  };

  const togglePublished = async (item: BlogPost) => {
    await updateItem(item.id, {
      published: !item.published,
      published_at: !item.published ? new Date().toISOString() : null,
    });
    fetchItems(locale);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditing((prev) => (prev ? { ...prev, [e.target.name]: e.target.value } : null));
  };

  const addTag = () => {
    if (!tagInput.trim() || !editing) return;
    setEditing({ ...editing, tags: [...(editing.tags || []), tagInput.trim()] });
    setTagInput("");
  };

  const removeTag = (index: number) => {
    if (!editing) return;
    const tags = [...(editing.tags || [])];
    tags.splice(index, 1);
    setEditing({ ...editing, tags });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Blog</h1>
        <Button onClick={() => { setEditing({ ...EMPTY }); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Yazı
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
              {editing.id ? "Düzenle" : "Yeni Blog Yazısı"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Başlık</label>
              <input name="title" value={editing.title || ""} onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Slug</label>
              <input name="slug" value={editing.slug || ""} onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Kapak Görseli URL</label>
              <input name="cover_image_url" value={editing.cover_image_url || ""} onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Özet</label>
            <textarea name="summary" value={editing.summary || ""} onChange={handleChange} rows={2}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">İçerik (Markdown)</label>
            <textarea name="content" value={editing.content || ""} onChange={handleChange} rows={10}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Etiketler</label>
            <div className="flex gap-2">
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Etiket ekle..."
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
              <Button type="button" size="sm" variant="outline" onClick={addTag}>Ekle</Button>
            </div>
            {(editing.tags || []).length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {editing.tags!.map((tag, i) => (
                  <span key={i} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">
                    {tag}
                    <button onClick={() => removeTag(i)} className="text-muted-foreground hover:text-foreground"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.published || false}
              onChange={(e) => setEditing({ ...editing, published: e.target.checked })} className="rounded" />
            Yayınla
          </label>
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
        <p className="text-sm text-muted-foreground">Henüz blog yazısı eklenmemiş.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Başlık</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Etiketler</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground font-medium">{item.title}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{item.slug}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(item.tags || []).slice(0, 3).map((t, i) => (
                        <span key={i} className="rounded bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePublished(item)} className="flex items-center gap-1.5">
                      {item.published ? (
                        <><Globe className="h-4 w-4 text-green-600" /><span className="text-xs text-green-600">Yayında</span></>
                      ) : (
                        <><GlobeLock className="h-4 w-4 text-muted-foreground" /><span className="text-xs text-muted-foreground">Taslak</span></>
                      )}
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
