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
      {/* Top-level Persian Arch category cards */}
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
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              className={`group relative h-[90px] w-[148px] shrink-0 overflow-hidden rounded-t-[26px] rounded-b-xl backdrop-blur-xl transition-all sm:h-[98px] sm:w-[168px] cursor-pointer ${
                isActive
                  ? "border-2 border-amber-400 ring-2 ring-teal-500/30 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_12px_28px_rgba(0,0,0,0.7),0_0_20px_rgba(229,170,56,0.3)]"
                  : "border border-amber-400/20 bg-[#121a24]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_8px_20px_rgba(0,0,0,0.5)] hover:border-amber-400/40 hover:bg-[#162230]/90"
              }`}
            >
              {/* Persian arch peak jewel */}
              <div
                className={`pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 z-20 size-1 rounded-full ${
                  isActive ? "bg-amber-300 ring-2 ring-teal-400" : "bg-amber-400/40"
                }`}
              />

              {coverImage ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={coverImage}
                  alt={category.name}
                  loading="lazy"
                  decoding="async"
                  className={`absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                    isActive ? "brightness-95 contrast-105" : "brightness-65"
                  }`}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0d141e]">
                  {Icon && (
                    <Icon className="size-8 text-amber-400/60" strokeWidth={1.5} />
                  )}
                </div>
              )}

              {/* Atmospheric Iranian Vignette */}
              <div
                className={`absolute inset-0 ${
                  isActive
                    ? "bg-gradient-to-t from-[#0a0f18]/95 via-[#0a0f18]/50 to-black/20"
                    : "bg-gradient-to-t from-[#0a0f18]/90 via-[#0a0f18]/60 to-black/30"
                }`}
              />

              <div className="relative z-10 flex size-full flex-col items-center justify-center px-2 text-center">
                <span className="font-heading line-clamp-1 text-sm font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:text-base">
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

      {/* Subcategory pill tabs */}
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
                className="relative shrink-0 rounded-full px-4 py-2 text-center backdrop-blur-xl transition-all cursor-pointer"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeSubcategoryPill"
                    className="absolute inset-0 rounded-full border border-amber-300/40 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.5),0_6px_18px_rgba(229,170,56,0.3)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-full border border-amber-400/20 bg-[#121a24]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_14px_rgba(0,0,0,0.4)] hover:border-amber-400/40 hover:bg-[#182330]" />
                )}
                <span
                  className={`font-heading relative z-10 block text-xs font-bold sm:text-sm transition-colors ${
                    isActive ? "text-stone-950 font-black" : "text-[#eae3dc]"
                  }`}
                >
                  {sub.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
