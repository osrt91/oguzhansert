"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

interface UseAdminReturn<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  fetchItems: (locale?: string) => Promise<void>;
  createItem: (data: Partial<T>) => Promise<T | null>;
  updateItem: (id: string, data: Partial<T>) => Promise<T | null>;
  deleteItem: (id: string) => Promise<boolean>;
}

export function useAdmin<T extends { id?: string }>(
  table: string
): UseAdminReturn<T> {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(
    async (locale?: string) => {
      setLoading(true);
      setError(null);
      try {
        const params = locale ? `?locale=${locale}` : "";
        const res = await fetch(`/api/admin/${table}${params}`);
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "Veri yüklenemedi.");
        }
        setItems(json.data || []);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Bir hata oluştu.";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    },
    [table]
  );

  const createItem = useCallback(
    async (data: Partial<T>): Promise<T | null> => {
      try {
        const res = await fetch(`/api/admin/${table}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "Kayıt oluşturulamadı.");
        }
        toast.success("Kayıt oluşturuldu.");
        return json.data as T;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Bir hata oluştu.";
        toast.error(msg);
        return null;
      }
    },
    [table]
  );

  const updateItem = useCallback(
    async (id: string, data: Partial<T>): Promise<T | null> => {
      try {
        const res = await fetch(`/api/admin/${table}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "Kayıt güncellenemedi.");
        }
        toast.success("Kayıt güncellendi.");
        return json.data as T;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Bir hata oluştu.";
        toast.error(msg);
        return null;
      }
    },
    [table]
  );

  const deleteItem = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/admin/${table}/${id}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.error || "Kayıt silinemedi.");
        }
        toast.success("Kayıt silindi.");
        return true;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Bir hata oluştu.";
        toast.error(msg);
        return false;
      }
    },
    [table]
  );

  return { items, loading, error, fetchItems, createItem, updateItem, deleteItem };
}
