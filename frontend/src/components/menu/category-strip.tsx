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
                  ? "border-2 border-amber-400 ring-4 ring-amber-500/25 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.4),0_14px_35px_rgba(245,158,11,0.38)]"
                  : "border border-white/14 bg-white/[0.05] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.18),0_12px_28px_rgba(0,0,0,0.55)] hover:border-white/30 hover:bg-white/[0.09]"
              }`}
            >
              {/* Specular Edge Highlight */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
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
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/40 via-white/[0.05] to-black/60 backdrop-blur-md">
                  {Icon && (
                    <Icon className="size-8 text-amber-400/60" strokeWidth={1.5} />
                  )}
                </div>
              )}

              <div
                className={`absolute inset-0 ${
                  isActive
                    ? "bg-gradient-to-t from-black/90 via-black/50 to-black/15"
                    : "bg-gradient-to-t from-black/85 via-black/45 to-black/20"
                }`}
              />

              <div className="relative z-10 flex size-full flex-col items-center justify-center px-2 text-center">
                <span className="line-clamp-2 text-xs font-bold text-white drop-shadow-sm sm:text-sm">
                  {category.name}
                </span>
                {category.nameEn && (
                  <span className="font-serif-en mt-0.5 line-clamp-1 text-xs font-medium tracking-wider text-amber-200/80 italic drop-shadow-sm">
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
                    className="absolute inset-0 rounded-full border border-white/40 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.7),0_8px_24px_rgba(245,158,11,0.45)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-full border border-white/12 bg-white/[0.05] shadow-[inset_0_1px_1px_rgba(255,255,255,0.14),0_4px_14px_rgba(0,0,0,0.35)] hover:border-white/25 hover:bg-white/[0.1]" />
                )}
                <span
                  className={`relative z-10 block text-xs font-bold sm:text-sm transition-colors ${
                    isActive ? "text-stone-950 font-black" : "text-[#eae3dc]"
                  }`}
                >
                  {sub.name}
                </span>
                {sub.nameEn && (
                  <span
                    className={`font-serif-en relative z-10 mt-0.5 block text-[11px] font-medium italic transition-colors ${
                      isActive ? "text-stone-900/90 font-bold" : "text-amber-200/60"
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
