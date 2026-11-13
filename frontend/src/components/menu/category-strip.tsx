"use client";

import { motion } from "motion/react";
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
            <motion.button
              key={category.id}
              ref={(el) => {
                buttonRefs.current[category.id] = el;
              }}
              type="button"
              onClick={() => handleClick(category.id)}
              whileHover={{ scale: 1.025, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className={`group relative h-[86px] w-[148px] shrink-0 overflow-hidden rounded-2xl backdrop-blur-2xl transition-all sm:h-[94px] sm:w-[168px] ${
                isActive
                  ? "border-2 border-primary ring-4 ring-primary/30 shadow-[inset_0_2px_2px_rgba(255,255,255,0.9),0_16px_34px_-4px_rgba(184,101,27,0.4)]"
                  : "border border-white/80 bg-white/40 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.85),0_8px_20px_-2px_rgba(56,30,16,0.08)] hover:border-white hover:bg-white/60 dark:border-white/14 dark:bg-white/10"
              }`}
            >
              {/* Specular Edge Highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent" />
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
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blush/80 via-card/75 to-secondary/75 backdrop-blur-md">
                  {Icon && (
                    <Icon className="size-8 text-primary/50" strokeWidth={1.5} />
                  )}
                </div>
              )}

              <div
                className={`absolute inset-0 ${
                  isActive
                    ? "bg-gradient-to-t from-[#201109]/90 via-[#201109]/45 to-transparent"
                    : "bg-gradient-to-t from-[#201109]/80 via-[#201109]/40 to-[#201109]/20"
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
            </motion.button>
          );
        })}
      </div>

      {/* Subcategory pill tabs with Framer Motion layoutId */}
      {subcategories.length > 0 && (
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto px-4 pb-1">
          {subcategories.map((sub) => {
            const isActive = sub.id === activeSubcategoryId;
            return (
              <motion.button
                key={sub.id}
                ref={(el) => {
                  subButtonRefs.current[sub.id] = el;
                }}
                type="button"
                onClick={() => onSelectSubcategory(sub.id)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="relative shrink-0 rounded-full px-4 py-2 text-center backdrop-blur-2xl transition-all"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSubcategoryPill"
                    className="absolute inset-0 rounded-full border border-white/70 bg-gradient-to-r from-primary via-[#cf7b24] to-primary shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.7),0_10px_28px_-3px_rgba(184,101,27,0.45)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-full border border-white/85 bg-white/45 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_4px_16px_-2px_rgba(56,30,16,0.06)] hover:bg-white/70 hover:border-white dark:border-white/16 dark:bg-white/10" />
                )}
                <span
                  className={`relative z-10 block text-xs font-bold sm:text-sm transition-colors ${
                    isActive ? "text-primary-foreground" : "text-foreground"
                  }`}
                >
                  {sub.name}
                </span>
                {sub.nameEn && (
                  <span
                    className={`font-serif-en relative z-10 mt-0.5 block text-[11px] font-medium italic transition-colors ${
                      isActive ? "text-primary-foreground/90" : "text-muted-foreground"
                    }`}
                  >
                    {sub.nameEn}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
