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
                  ? "border-2 border-[#8B5E34] shadow-[0_12px_28px_rgba(88,49,1,0.22)]"
                  : "border border-[#E7BC91] bg-[#FFFFFF]/80 shadow-[0_4px_14px_rgba(88,49,1,0.06)] hover:border-[#BC8A5F] hover:bg-[#FFF9F2]"
              }`}
            >
              {/* Persian arch peak jewel */}
              <div
                className={`pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 z-20 size-1 rounded-full ${
                  isActive ? "bg-[#8B5E34] ring-2 ring-[#BC8A5F]/60" : "bg-[#D4A276]/60"
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
                    isActive ? "brightness-95 contrast-105" : "brightness-75"
                  }`}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[#F3D5B5]/60">
                  {Icon && (
                    <Icon className="size-8 text-[#8B5E34]" strokeWidth={1.5} />
                  )}
                </div>
              )}

              {/* Atmospheric Iranian Vignette */}
              <div
                className={`absolute inset-0 ${
                  isActive
                    ? "bg-gradient-to-t from-[#583101]/95 via-[#583101]/45 to-black/15"
                    : "bg-gradient-to-t from-[#583101]/90 via-[#583101]/50 to-black/20"
                }`}
              />

              <div className="relative z-10 flex size-full flex-col items-center justify-center px-2 text-center">
                <span className="font-heading line-clamp-1 text-sm font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:text-base">
                  {category.name}
                </span>
                {category.nameEn && (
                  <span className="font-serif-en mt-0.5 line-clamp-1 text-xs font-medium tracking-wider text-[#F3D5B5] italic drop-shadow-sm">
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
                    className="absolute inset-0 rounded-full border border-[#BC8A5F]/60 bg-gradient-to-r from-[#8B5E34] via-[#6F4518] to-[#8B5E34] shadow-[0_6px_18px_rgba(88,49,1,0.25)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                {!isActive && (
                  <div className="absolute inset-0 rounded-full border border-[#E7BC91] bg-[#FFFFFF]/85 shadow-[0_2px_8px_rgba(88,49,1,0.04)] hover:border-[#D4A276] hover:bg-[#F3D5B5]/50" />
                )}
                <span
                  className={`font-heading relative z-10 block text-xs font-bold sm:text-sm transition-colors ${
                    isActive ? "text-[#FFEDD8] font-black" : "text-[#6F4518]"
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
