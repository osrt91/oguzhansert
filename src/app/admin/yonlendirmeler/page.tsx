"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import type { Redirect } from "@/types/database";
import { Plus, Pencil, Trash2, Loader2, X, ToggleLeft, ToggleRight } from "lucide-react";

const EMPTY: Partial<Redirect> = {
  source: "",
  destination: "",
  status_code: 301,
  active: true,
};

export default function YonlendirmelerPage() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } =
    useAdmin<Redirect>("redirects");
  const [editing, setEditing] = useState<Partial<Redirect> | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    if (editing.id) {
      const { id, created_at, ...rest } = editing;
      await updateItem(id!, rest);
    } else {
      await createItem(editing);
    }
    setEditing(null);
    setShowForm(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Silmek istediğinize emin misiniz?")) return;
    await deleteItem(id);
    fetchItems();
  };

  const toggleActive = async (item: Redirect) => {
    await updateItem(item.id, { active: !item.active });
    fetchItems();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setEditing((prev) =>
      prev ? { ...prev, [name]: type === "number" ? Number(value) : value } : null
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Yönlendirmeler</h1>
        <Button onClick={() => { setEditing({ ...EMPTY }); setShowForm(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Yeni Ekle
        </Button>
      </div>

      {showForm && editing && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {editing.id ? "Düzenle" : "Yeni Yönlendirme"}
            </h2>
            <button onClick={() => { setShowForm(false); setEditing(null); }}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Kaynak Yol</label>
              <input name="source" value={editing.source || ""} onChange={handleChange} placeholder="/eski-sayfa"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Hedef Yol</label>
              <input name="destination" value={editing.destination || ""} onChange={handleChange} placeholder="/yeni-sayfa"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">HTTP Kodu</label>
              <select
                name="status_code"
                value={editing.status_code || 301}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={301}>301 (Kalıcı)</option>
                <option value={302}>302 (Geçici)</option>
                <option value={307}>307 (Geçici - POST)</option>
                <option value={308}>308 (Kalıcı - POST)</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={editing.active !== false}
              onChange={(e) => setEditing({ ...editing, active: e.target.checked })} className="rounded" />
            Aktif
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
        <p className="text-sm text-muted-foreground">Henüz yönlendirme eklenmemiş.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kaynak</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hedef</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kod</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 text-foreground font-mono text-xs">{item.source}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{item.destination}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.status_code}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(item)}>
                      {item.active ? (
                        <ToggleRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
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
