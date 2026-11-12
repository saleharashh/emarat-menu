import { Suspense } from "react";

import { MenuExplorer } from "@/components/menu-explorer";
import { SplashScreen } from "@/components/menu/splash-screen";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/lib/api";
import type { Category, MenuItem, SiteSettings } from "@/lib/types";

async function getMenuData(): Promise<{
  categories: Category[];
  items: MenuItem[];
  settings: SiteSettings | null;
}> {
  try {
    const [categories, items, settings] = await Promise.all([
      fetch(`${API_URL}/categories`, { cache: "no-store" }).then((r) =>
        r.json(),
      ),
      fetch(`${API_URL}/menu-items`, { cache: "no-store" }).then((r) =>
        r.json(),
      ),
      fetch(`${API_URL}/settings`, { cache: "no-store" }).then((r) =>
        r.ok ? r.json() : null,
      ),
    ]);
    return { categories, items, settings };
  } catch {
    return { categories: [], items: [], settings: null };
  }
}

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-4 py-2">
        <div className="mx-auto flex h-12 max-w-2xl items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="size-9 rounded-xl" />
            <Skeleton className="size-9 rounded-xl" />
          </div>
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="size-9 rounded-xl" />
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <div className="flex gap-2.5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[84px] w-[144px] shrink-0 rounded-xl sm:h-[92px] sm:w-[164px]"
            />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

async function PageServer() {
  const { categories, items, settings } = await getMenuData();

  return (
    <MenuExplorer categories={categories} items={items} settings={settings} />
  );
}

export default function Home() {
  return (
    <>
      <SplashScreen />
      <Suspense fallback={<PageSkeleton />}>
        <PageServer />
      </Suspense>
    </>
  );
}
