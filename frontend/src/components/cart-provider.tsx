"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import type { MenuItem } from "@/lib/types";

export interface CartItem {
  itemId: number;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  categoryNameEn?: string | null;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (item: MenuItem) => void;
  setQty: (itemId: number, qty: number) => void;
  remove: (itemId: number) => void;
  clear: () => void;
}

const STORAGE_KEY = "emarat_cart";

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      // ignore corrupted cart storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const add = useCallback((item: MenuItem) => {
    setItems((prev) => {
      const existing = prev.find((ci) => ci.itemId === item.id);
      if (existing) {
        return prev.map((ci) =>
          ci.itemId === item.id ? { ...ci, qty: ci.qty + 1 } : ci,
        );
      }
      return [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          categoryId: item.categoryId,
          categoryName: item.category?.name ?? null,
          categoryNameEn: item.category?.nameEn ?? null,
          qty: 1,
        },
      ];
    });
  }, []);

  const setQty = useCallback((itemId: number, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((ci) => ci.itemId !== itemId)
        : prev.map((ci) => (ci.itemId === itemId ? { ...ci, qty } : ci)),
    );
  }, []);

  const remove = useCallback((itemId: number) => {
    setItems((prev) => prev.filter((ci) => ci.itemId !== itemId));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((sum, ci) => sum + ci.qty, 0);
    const total = items.reduce((sum, ci) => sum + ci.qty * ci.price, 0);
    return { items, count, total, add, setQty, remove, clear };
  }, [items, add, setQty, remove, clear]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
