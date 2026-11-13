import { useEffect, useState } from "react";

import { MenuExplorer } from "@/components/menu-explorer";
import { SplashScreen } from "@/components/menu/splash-screen";
import { Skeleton } from "@/components/ui/skeleton";
import { API_URL } from "@/lib/api";
import type { Category, MenuItem, SiteSettings } from "@/lib/types";

function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-white/10 bg-black/60 px-4 py-2 backdrop-blur-3xl shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
        <div className="mx-auto flex h-12 max-w-2xl items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="size-9 rounded-full" />
          </div>
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="size-9 rounded-full" />
        </div>
      </div>

      <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-4">
        <div className="flex gap-2.5 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[84px] w-[144px] shrink-0 rounded-2xl sm:h-[92px] sm:w-[164px]"
            />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-3xl" />
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [data, setData] = useState<{
    categories: Category[];
    items: MenuItem[];
    settings: SiteSettings | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      fetch(`${API_URL}/categories`)
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch(`${API_URL}/menu-items`)
        .then((r) => (r.ok ? r.json() : []))
        .catch(() => []),
      fetch(`${API_URL}/settings`)
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null),
    ]).then(([categories, items, settings]) => {
      if (mounted) {
        setData({
          categories: Array.isArray(categories) ? categories : [],
          items: Array.isArray(items) ? items : [],
          settings,
        });
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <SplashScreen />
      {loading || !data ? (
        <PageSkeleton />
      ) : (
        <MenuExplorer
          categories={data.categories}
          items={data.items}
          settings={data.settings}
        />
      )}
    </>
  );
}
