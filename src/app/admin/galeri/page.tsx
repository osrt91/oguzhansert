"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { GalleryImage } from "@/types/database";
import { Plus, Pencil, Trash2, Eye, EyeOff, Loader2, X, Upload } from "lucide-react";

const LOCALES = ["tr", "en"] as const;

const EMPTY: Partial<GalleryImage> = {
  title: "",
  description: "",
  image_url: "",
  category: "",
  sort_order: 0,
  visible: true,
};

export default function GaleriPage() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } =
    useAdmin<GalleryImage>("gallery_images");
  const [locale, setLocale] = useState<(typeof LOCALES)[number]>("tr");
  const [editing, setEditing] = useState<Partial<GalleryImage> | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchItems(locale);
  }, [fetchItems, locale]);

  const handleSave = async () => {
    if (!editing) return;
    const payload = { ...editing, locale };
    if (editing.id) {
      const { id, created_at, ...rest } = payload;
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

  const toggleVisibility = async (item: GalleryImage) => {
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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "gallery");

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!json.success) {
        toast.error(json.error || "Yükleme başarısız.");
        return;
      }

      setEditing((prev) => (prev ? { ...prev, image_url: json.data.url } : null));
      toast.success("Görsel yüklendi.");
    } catch {
      toast.error("Yükleme sırasında hata oluştu.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Galeri</h1>
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
              {editing.id ? "Düzenle" : "Yeni Görsel"}
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
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Kategori</label>
              <input name="category" value={editing.category || ""} onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Sıra</label>
              <input name="sort_order" type="number" value={editing.sort_order || 0} onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Görsel Yükle</label>
              <label className="flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground hover:bg-accent">
                <Upload className="h-4 w-4" />
                {uploading ? "Yükleniyor..." : "Dosya Seç"}
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Görsel URL</label>
            <input name="image_url" value={editing.image_url || ""} onChange={handleChange}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          {editing.image_url && (
            <div className="rounded-md border border-border overflow-hidden w-48 h-32">
              <img src={editing.image_url} alt="Önizleme" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Açıklama</label>
            <textarea name="description" value={editing.description || ""} onChange={handleChange} rows={2}
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
        <p className="text-sm text-muted-foreground">Henüz görsel eklenmemiş.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border bg-card">
              {item.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img src={item.image_url} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                </div>
              )}
              <div className="p-3">
                <h3 className="text-sm font-medium text-foreground">{item.title}</h3>
                {item.category && <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>}
                <div className="mt-2 flex items-center gap-1">
                  <button onClick={() => toggleVisibility(item)} className="rounded p-1 text-muted-foreground hover:bg-accent">
                    {item.visible ? <Eye className="h-3.5 w-3.5 text-green-600" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>
                  <button onClick={() => { setEditing({ ...item }); setShowForm(true); }} className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="rounded p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
