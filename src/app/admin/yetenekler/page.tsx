"use client";

import { useEffect, useState } from "react";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import type { Skill } from "@/types/database";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  X,
} from "lucide-react";

const EMPTY_SKILL: Partial<Skill> = {
  name: "",
  icon_name: "",
  category_key: "",
  sort_order: 0,
  visible: true,
};

export default function YeteneklerPage() {
  const { items, loading, fetchItems, createItem, updateItem, deleteItem } =
    useAdmin<Skill>("skills");
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSave = async () => {
    if (!editing) return;
    if (editing.id) {
      const { id, created_at, ...rest } = editing;
      await updateItem(id, rest);
    } else {
      await createItem(editing);
    }
    setEditing(null);
    setShowForm(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yeteneği silmek istediğinize emin misiniz?")) return;
    await deleteItem(id);
    fetchItems();
  };

  const toggleVisibility = async (item: Skill) => {
    await updateItem(item.id, { visible: !item.visible });
    fetchItems();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setEditing((prev) =>
      prev
        ? {
            ...prev,
            [name]: type === "number" ? Number(value) : value,
          }
        : null
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Yetenekler</h1>
        <Button
          onClick={() => {
            setEditing({ ...EMPTY_SKILL });
            setShowForm(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Ekle
        </Button>
      </div>

      {/* Form */}
      {showForm && editing && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {editing.id ? "Düzenle" : "Yeni Yetenek"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Ad
              </label>
              <input
                name="name"
                value={editing.name || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                İkon Adı
              </label>
              <input
                name="icon_name"
                value={editing.icon_name || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Kategori
              </label>
              <input
                name="category_key"
                value={editing.category_key || ""}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Sıra
              </label>
              <input
                name="sort_order"
                type="number"
                value={editing.sort_order || 0}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>
              Kaydet
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
              }}
            >
              İptal
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Yükleniyor...
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz yetenek eklenmemiş.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ad</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">İkon</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kategori</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sıra</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border last:border-0 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-foreground">{item.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.icon_name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.category_key}</td>
                  <td className="px-4 py-3 text-muted-foreground">{item.sort_order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleVisibility(item)}>
                      {item.visible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => {
                          setEditing({ ...item });
                          setShowForm(true);
                        }}
                        className="rounded p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
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
