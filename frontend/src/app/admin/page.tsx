"use client";

import { LogOutIcon, UtensilsCrossedIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

import { BannerManager } from "@/components/admin/banner-manager";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { ItemsManager } from "@/components/admin/items-manager";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { clearToken, getToken } from "@/lib/admin-api";
import { api } from "@/lib/admin-api";
import type { Category, MenuItem } from "@/lib/types";

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/admin/login");
      return;
    }
    setReady(true);
  }, [router]);

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        api<Category[]>("/categories"),
        api<MenuItem[]>("/menu-items"),
      ]);
      setCategories(cats);
      setItems(menuItems);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) reload();
  }, [ready, reload]);

  function handleLogout() {
    clearToken();
    router.push("/admin/login");
  }

  if (!ready) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <Spinner />
      </main>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-30 glass-header">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2 font-bold">
            <UtensilsCrossedIcon className="size-5 text-primary" />
            پنل مدیریت کافه عمارت
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href="/" />}
            >
              مشاهده سایت
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOutIcon data-icon="inline-start" />
              خروج
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Tabs defaultValue="items">
          <TabsList>
            <TabsTrigger value="items">آیتم‌های منو</TabsTrigger>
            <TabsTrigger value="categories">دسته‌بندی‌ها</TabsTrigger>
            <TabsTrigger value="banner">تنظیمات و بنر</TabsTrigger>
          </TabsList>
          <TabsContent value="items">
            <ItemsManager
              items={items}
              categories={categories}
              loading={loading}
              onChanged={reload}
            />
          </TabsContent>
          <TabsContent value="categories">
            <CategoriesManager
              categories={categories}
              items={items}
              loading={loading}
              onChanged={reload}
            />
          </TabsContent>
          <TabsContent value="banner">
            <BannerManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
