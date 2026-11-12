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
              className={`group relative h-[84px] w-[144px] shrink-0 overflow-hidden rounded-2xl backdrop-blur-md transition-all sm:h-[92px] sm:w-[164px] ${
                isActive
                  ? "border border-white/70 ring-2 ring-primary ring-offset-2 ring-offset-background shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.7),0_12px_26px_-4px_rgba(122,67,37,0.25)]"
                  : "border border-white/60 bg-card/50 opacity-85 shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_6px_16px_-2px_rgba(60,36,22,0.06)] hover:opacity-100 hover:border-white/90"
              }`}
            >
              {coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={coverImage}
                  alt={category.name}
                  className={`absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? "brightness-95" : "brightness-75"
                  }`}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blush/90 via-card/80 to-secondary/80 backdrop-blur-md">
                  {Icon && (
                    <Icon className="size-8 text-primary/50" strokeWidth={1.5} />
                  )}
                </div>
              )}

              <div
                className={`absolute inset-0 ${
                  isActive
                    ? "bg-gradient-to-t from-[#27170f]/85 via-[#27170f]/40 to-[#27170f]/15"
                    : "bg-[#27170f]/50"
                }`}
              />

              <div className="relative z-10 flex size-full flex-col items-center justify-center px-2 text-center">
                <span className="line-clamp-2 text-xs font-bold text-[#fffdfa] drop-shadow-sm sm:text-sm">
                  {category.name}
                </span>
                {category.nameEn && (
                  <span className="font-serif-en mt-0.5 line-clamp-1 text-xs font-medium tracking-wider text-[#fffdfa]/85 italic drop-shadow-sm">
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
                className={`shrink-0 rounded-full px-4 py-2 text-center backdrop-blur-xl transition-all ${
                  isActive
                    ? "border border-white/40 bg-gradient-to-r from-primary to-[#8c4d2b] text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_-3px_rgba(122,67,37,0.3)]"
                    : "border border-white/80 bg-card/70 text-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_4px_14px_-2px_rgba(60,36,22,0.06)] hover:bg-card/90 hover:border-white"
                }`}
              >
                <span className="block text-xs font-bold sm:text-sm">
                  {sub.name}
                </span>
                {sub.nameEn && (
                  <span
                    className={`font-serif-en mt-0.5 block text-[11px] font-medium italic ${
                      isActive ? "text-primary-foreground/90" : "text-muted-foreground"
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
