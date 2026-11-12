"use client";

import { useEffect, useRef } from "react";

import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/lib/types";

interface CategoryStripProps {
  categories: Category[];
  subcategories: Category[];
  activeCategoryId: number | null;
  activeSubcategoryId: number | null;
  categoryImages: Record<number, string | null>;
  onSelectCategory: (categoryId: number) => void;
  onSelectSubcategory: (categoryId: number) => void;
}

export function CategoryStrip({
  categories,
  subcategories,
  activeCategoryId,
  activeSubcategoryId,
  categoryImages,
  onSelectCategory,
  onSelectSubcategory,
}: CategoryStripProps) {
  const buttonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const subButtonRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (activeCategoryId !== null) {
      buttonRefs.current[activeCategoryId]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeCategoryId]);

  useEffect(() => {
    if (activeSubcategoryId !== null) {
      subButtonRefs.current[activeSubcategoryId]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeSubcategoryId]);

  function handleClick(catId: number) {
    onSelectCategory(catId);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Top-level horizontal photo category strip */}
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 pt-2 pb-1">
        {categories.map((category) => {
          const isActive = category.id === activeCategoryId;
          const coverImage = categoryImages[category.id];
          const Icon = getCategoryIcon(category.icon);

          return (
            <button
              key={category.id}
              ref={(el) => {
                buttonRefs.current[category.id] = el;
              }}
              type="button"
              onClick={() => handleClick(category.id)}
              className={`group relative h-[84px] w-[144px] shrink-0 overflow-hidden rounded-2xl transition-all sm:h-[92px] sm:w-[164px] ${
                isActive
                  ? "ring-2 ring-primary ring-offset-2 ring-offset-background shadow-lg shadow-primary/15"
                  : "border border-border/80 opacity-80 hover:opacity-100"
              }`}
            >
              {coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={coverImage}
                  alt={category.name}
                  className={`absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? "brightness-90" : "brightness-70"
                  }`}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-blush/80">
                  {Icon && (
                    <Icon className="size-8 text-primary/40" strokeWidth={1.5} />
                  )}
                </div>
              )}

              <div
                className={`absolute inset-0 ${
                  isActive
                    ? "bg-gradient-to-t from-[#3d2b29]/80 via-[#3d2b29]/35 to-[#3d2b29]/15"
                    : "bg-[#3d2b29]/45"
                }`}
              />

              <div className="relative z-10 flex size-full flex-col items-center justify-center px-2 text-center">
                <span className="line-clamp-2 text-xs font-bold text-[#fffaf8] drop-shadow-sm sm:text-sm">
                  {category.name}
                </span>
                {category.nameEn && (
                  <span className="font-serif-en mt-0.5 line-clamp-1 text-xs font-medium tracking-wider text-[#fffaf8]/85 italic drop-shadow-sm">
                    {category.nameEn}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Subcategory pill tabs (shown when active category has children) */}
      {subcategories.length > 0 && (
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 pb-1">
          {subcategories.map((sub) => {
            const isActive = sub.id === activeSubcategoryId;
            return (
              <button
                key={sub.id}
                ref={(el) => {
                  subButtonRefs.current[sub.id] = el;
                }}
                type="button"
                onClick={() => onSelectSubcategory(sub.id)}
                className={`shrink-0 rounded-full px-4 py-2 text-center transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "border border-border bg-card/85 text-foreground hover:bg-blush/60"
                }`}
              >
                <span className="block text-xs font-bold sm:text-sm">
                  {sub.name}
                </span>
                {sub.nameEn && (
                  <span
                    className={`font-serif-en mt-0.5 block text-[11px] font-medium italic ${
                      isActive ? "text-primary-foreground/85" : "text-muted-foreground"
                    }`}
                  >
                    {sub.nameEn}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
