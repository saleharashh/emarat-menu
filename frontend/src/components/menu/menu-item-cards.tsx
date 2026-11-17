"use client";

import { motion, AnimatePresence } from "motion/react";
import { ImageIcon, MinusIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { useState, useId } from "react";

import { formatNumber, formatToman } from "@/lib/format";
import { resolveImageUrl } from "@/lib/api";
import type { MenuItem } from "@/lib/types";

interface ItemThumbnailProps {
  src: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
}

function ItemImage({
  src,
  alt,
  className,
  iconClassName,
}: {
  src: string;
  alt: string;
  className: string;
  iconClassName: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center bg-[#131b26] text-amber-400/40 ${className}`}
      >
        <ImageIcon className={iconClassName} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export function ItemThumbnail({
  src,
  alt,
  className = "",
  iconClassName = "size-8",
}: ItemThumbnailProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-[#131b26] text-amber-400/40 ${className}`}
      >
        <ImageIcon className={iconClassName} strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <ItemImage
      key={src}
      src={src}
      alt={alt}
      className={className}
      iconClassName={iconClassName}
    />
  );
}

export interface TraditionalMeta {
  temperament?: "طبع گرم" | "طبع خنک" | "معتدل";
  specialBadge?: string;
  isHot?: boolean;
  isCool?: boolean;
}

export function getTraditionalMeta(item: MenuItem): TraditionalMeta {
  const name = item.name;
  if (name.includes("زعفران") || name.includes("نبات") || name.includes("دارچین") || name.includes("هل")) {
    return { temperament: "طبع گرم", specialBadge: "زعفران سرگل و هل", isHot: true };
  }
  if (name.includes("سکنجبین") || name.includes("خیار") || name.includes("نعنا")) {
    return { temperament: "طبع خنک", specialBadge: "سکنجبین سنتی عمارت", isCool: true };
  }
  if (name.includes("بیدمشک") || name.includes("گلاب") || name.includes("بهارنارنج")) {
    return { temperament: "طبع خنک", specialBadge: "عرق ناب و گلاب اعلا", isCool: true };
  }
  if (name.includes("ترک") || name.includes("قهوه")) {
    return { temperament: "طبع گرم", specialBadge: "دم‌کشیده در جذوه مسی", isHot: true };
  }
  if (name.includes("فالوده") || name.includes("شولی") || name.includes("آش")) {
    return { temperament: "طبع خنک", specialBadge: "طعم اصیل دیار بادگیرها", isCool: true };
  }
  if (name.includes("باقلوا") || name.includes("قطاب") || name.includes("شله") || name.includes("پشمک")) {
    return { temperament: "طبع گرم", specialBadge: "دست‌پخت سنتی یزد", isHot: true };
  }
  return { temperament: "معتدل" };
}

interface ItemActionControlProps {
  item: MenuItem;
  qty: number;
  onAdd: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function ItemActionControl({
  item,
  qty,
  onAdd,
  onDecrease,
  onIncrease,
}: ItemActionControlProps) {
  if (!item.isAvailable) {
    return (
      <span className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-amber-500/20 bg-stone-900/60 px-3.5 text-xs font-medium text-stone-400 backdrop-blur-md shadow-xs">
        تمام شد
      </span>
    );
  }

  if (qty > 0) {
    return (
      <motion.div
        layout
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-amber-300/40 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] px-1.5 text-stone-950 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_6px_18px_rgba(229,170,56,0.35)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          type="button"
          onClick={onDecrease}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          className="flex size-7 items-center justify-center rounded-full text-stone-950 transition hover:bg-black/15 cursor-pointer"
          aria-label={`کاهش تعداد ${item.name}`}
        >
          <MinusIcon className="size-3.5 stroke-[2.5]" />
        </motion.button>
        <div className="relative min-w-4 flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={qty}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="text-center text-sm font-black tabular-nums text-stone-950"
            >
              {formatNumber(qty)}
            </motion.span>
          </AnimatePresence>
        </div>
        <motion.button
          type="button"
          onClick={onIncrease}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          className="flex size-7 items-center justify-center rounded-full text-stone-950 transition hover:bg-black/15 cursor-pointer"
          aria-label={`افزودن یک عدد ${item.name}`}
        >
          <PlusIcon className="size-3.5 stroke-[2.5]" />
        </motion.button>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      layout
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.88 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      onClick={(e) => {
        e.stopPropagation();
        onAdd();
      }}
      aria-label={`افزودن ${item.name} به سفارش`}
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-amber-300/50 bg-gradient-to-br from-[#d97706] via-[#f59e0b] to-[#d97706] text-stone-950 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.65),0_6px_18px_rgba(229,170,56,0.35)] backdrop-blur-xl cursor-pointer"
    >
      <PlusIcon className="size-4.5 stroke-[2.5]" />
    </motion.button>
  );
}

function PersianEslimiSprig({ flipped = false }: { flipped?: boolean }) {
  const id = useId();

  return (
    <svg
      viewBox="0 0 64 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-5 w-11 sm:h-6 sm:w-14 shrink-0 transition-transform drop-shadow-[0_2px_8px_rgba(229,170,56,0.28)] ${
        flipped ? "-scale-x-100" : ""
      }`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-stem`} x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#b45309" stopOpacity="0.35" />
          <stop offset="35%" stopColor="#d97706" />
          <stop offset="75%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>
        <linearGradient id={`${id}-leaf-border`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id={`${id}-leaf-fill`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(254, 240, 138, 0.42)" />
          <stop offset="100%" stopColor="rgba(20, 143, 150, 0.16)" />
        </linearGradient>
      </defs>

      {/* Main flowing stem with organic taper */}
      <path
        d="M2 19 C 14 18, 28 14, 46 9 C 54 7, 59 5.5, 62 4.5"
        stroke={`url(#${id}-stem)`}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      {/* Delicate starting scroll */}
      <path
        d="M2 19 C 0 19.5, -0.5 21, 1 22.5 C 2.5 23.5, 4.5 22.5, 4 20.5"
        stroke={`url(#${id}-stem)`}
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Leaf 1 (Top Outer) */}
      <path
        d="M12 17.5 C 10 13, 12 7.5, 17 6 C 18 10, 16 15, 13 17"
        fill={`url(#${id}-leaf-fill)`}
        stroke={`url(#${id}-leaf-border)`}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M13 16.5 C 14 13, 15 10, 16.5 6.8"
        stroke="#fef08a"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Leaf 2 (Bottom Outer) */}
      <path
        d="M18 16 C 17 19.5, 18.5 23, 23 23.5 C 23.5 20, 21.5 17, 19 16"
        fill={`url(#${id}-leaf-fill)`}
        stroke={`url(#${id}-leaf-border)`}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M18.5 16.5 C 20 18.5, 21 20.5, 22.5 23"
        stroke="#fef08a"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Leaf 3 (Top Middle) */}
      <path
        d="M27 14 C 26 9.5, 29 4.5, 34.5 3 C 35 7.5, 32.5 12, 28 13.5"
        fill={`url(#${id}-leaf-fill)`}
        stroke={`url(#${id}-leaf-border)`}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M28 13.5 C 29.5 10, 31.5 7, 34 3.8"
        stroke="#fef08a"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Leaf 4 (Bottom Middle) */}
      <path
        d="M33 12.5 C 33 16.5, 35.5 20, 40 20 C 40.5 16.5, 37.5 13.5, 34 12.5"
        fill={`url(#${id}-leaf-fill)`}
        stroke={`url(#${id}-leaf-border)`}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M33.8 13 C 35.5 15, 37 17, 39.5 19.5"
        stroke="#fef08a"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Leaf 5 (Top Inner) */}
      <path
        d="M43 9.5 C 43 5.5, 47 2, 52 1.5 C 51.5 6, 48 9, 44 9.5"
        fill={`url(#${id}-leaf-fill)`}
        stroke={`url(#${id}-leaf-border)`}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M43.8 9 C 46 6.5, 48.5 4.5, 51.2 2"
        stroke="#fef08a"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Leaf 6 (Bottom Inner) */}
      <path
        d="M48 8.5 C 49 12, 52 15, 56.5 14.5 C 56 11.5, 53 9, 49 8.5"
        fill={`url(#${id}-leaf-fill)`}
        stroke={`url(#${id}-leaf-border)`}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      <path
        d="M49 9 C 51 10.5, 53 12.5, 55.8 14"
        stroke="#fef08a"
        strokeWidth="0.75"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* Terminal Bud Leaf */}
      <path
        d="M57 5.5 C 60 4, 63.5 3.5, 65 3.5 C 64 5.5, 61 7, 58 6.5"
        fill={`url(#${id}-leaf-fill)`}
        stroke={`url(#${id}-leaf-border)`}
        strokeWidth="1.0"
        strokeLinejoin="round"
      />

      {/* Royal Persian Golden Pearls */}
      <circle cx="21" cy="13.5" r="1.3" fill="#fef08a" stroke="#d97706" strokeWidth="0.5" />
      <circle cx="37" cy="9.5" r="1.3" fill="#fef08a" stroke="#d97706" strokeWidth="0.5" />
      <circle cx="51" cy="6" r="1.1" fill="#fef08a" stroke="#d97706" strokeWidth="0.5" />
    </svg>
  );
}

interface SectionDividerProps {
  title: string;
  subtitleEn?: string | null;
}

export function SectionDivider({ title, subtitleEn }: SectionDividerProps) {
  return (
    <div className="my-5 flex items-center gap-2 sm:gap-3 py-2">
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400/40 to-teal-400/50" />
      <span className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <PersianEslimiSprig />
        <span className="text-center px-1 sm:px-2">
          <h2 className="font-heading text-xl font-bold tracking-tight text-[#fbf8f1] sm:text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            {title}
          </h2>
          {subtitleEn && (
            <p className="font-serif-en mt-0.5 text-xs font-semibold tracking-[0.22em] text-amber-300/85 uppercase">
              {subtitleEn}
            </p>
          )}
        </span>
        <PersianEslimiSprig flipped />
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400/40 to-teal-400/50" />
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  qty: number;
  onSelect: () => void;
  onAdd: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
}

export function FeaturedItemCard({
  item,
  qty,
  onSelect,
  onAdd,
  onDecrease,
  onIncrease,
}: MenuItemCardProps) {
  const image = resolveImageUrl(item.imageUrl);
  const meta = getTraditionalMeta(item);

  return (
    <motion.article
      onClick={onSelect}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative cursor-pointer overflow-hidden rounded-[32px] sm:rounded-[38px] border border-amber-400/35 bg-gradient-to-b from-[#182333]/90 via-[#101925]/90 to-[#0b1018]/95 p-0.5 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.15),0_18px_45px_rgba(0,0,0,0.75)] transition-all duration-300 hover:border-amber-400/60 hover:shadow-[0_20px_50px_rgba(229,170,56,0.15)] ring-1 ring-teal-500/20"
    >
      {/* Persian Arch-styled Header Image */}
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[30px] sm:rounded-t-[36px] bg-[#0c121a]">
        <ItemThumbnail
          src={image}
          alt={item.name}
          className="size-full transition-transform duration-500 group-hover:scale-105"
          iconClassName="size-12"
        />
        {/* Warm lantern gradient over visual */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1018] via-transparent to-black/30" />

        {/* Persian Arch Badge - تحفه عمارت */}
        <div className="absolute top-3.5 right-3.5 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-[#99222c]/95 via-[#b91c1c]/95 to-[#99222c]/95 px-3 py-1 text-xs font-bold text-amber-100 shadow-[0_4px_16px_rgba(153,34,44,0.4),inset_0_1px_1px_rgba(255,255,255,0.4)] backdrop-blur-md">
          <SparklesIcon className="size-3 text-amber-300" />
          <span>پیشنهاد عمارت طاق</span>
        </div>
      </div>

      <div className="relative p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-heading text-xl font-bold text-[#fbf8f1] sm:text-2xl drop-shadow-sm">
              {item.name}
            </h3>
            {item.nameEn && (
              <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wider text-amber-200/70 italic">
                {item.nameEn}
              </p>
            )}
          </div>
        </div>

        {item.description && (
          <p className="mt-2 line-clamp-2 text-xs leading-6 text-stone-300/85 sm:text-sm">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black whitespace-nowrap text-[#fcd34d] drop-shadow-[0_2px_8px_rgba(229,170,56,0.3)] sm:text-xl">
              {formatToman(item.price)}
            </span>
          </div>
          <span className="h-px flex-1 border-b border-dotted border-amber-400/20" />
          <ItemActionControl
            item={item}
            qty={qty}
            onAdd={onAdd}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        </div>
      </div>
    </motion.article>
  );
}

export function CompactItemCard({
  item,
  qty,
  onSelect,
  onAdd,
  onDecrease,
  onIncrease,
}: MenuItemCardProps) {
  const image = resolveImageUrl(item.imageUrl);

  return (
    <motion.article
      onClick={onSelect}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative cursor-pointer overflow-hidden rounded-[26px] sm:rounded-[30px] border border-amber-400/25 bg-gradient-to-b from-[#151f2d]/85 via-[#0f1722]/85 to-[#0b1018]/90 p-4 shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.1),0_12px_32px_rgba(0,0,0,0.65)] ring-1 ring-teal-500/15 transition-all duration-300 hover:border-amber-400/50 hover:shadow-[0_16px_36px_rgba(229,170,56,0.12)]"
    >
      <div className="relative flex items-center justify-between gap-3.5">
        <div className="min-w-0 flex-1">
          <h3 className="font-heading text-base font-bold text-[#fbf8f1] sm:text-lg">
            {item.name}
          </h3>
          {item.nameEn && (
            <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wide text-amber-200/70 italic">
              {item.nameEn}
            </p>
          )}

          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-5.5 text-stone-300/80 sm:text-sm">
              {item.description}
            </p>
          )}
        </div>

        {/* Persian Arch-framed Thumbnail (قاب طاقچه و پنج‌دری) */}
        <div className="relative h-24 w-22 sm:h-28 sm:w-26 shrink-0 overflow-hidden rounded-t-[2.2rem] rounded-b-xl border-2 border-amber-400/40 bg-[#090e15] shadow-[inset_0_1.5px_2px_rgba(229,170,56,0.25),0_8px_20px_rgba(0,0,0,0.65)] ring-1 ring-teal-400/25">
          <ItemThumbnail
            src={image}
            alt={item.name}
            className="size-full transition-transform duration-500 group-hover:scale-105"
            iconClassName="size-8"
          />
          {/* Subtle stained glass glare */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-amber-400/10 to-teal-400/15" />
          <span className="pointer-events-none absolute top-1 left-1/2 -translate-x-1/2 size-1 rounded-full bg-amber-300/80" />
        </div>
      </div>

      <div className="relative mt-3.5 flex items-center gap-3">
        <span className="text-sm font-black whitespace-nowrap text-[#fcd34d] drop-shadow-[0_2px_8px_rgba(229,170,56,0.25)] sm:text-base">
          {formatToman(item.price)}
        </span>
        <span className="h-px flex-1 border-b border-dotted border-amber-400/20" />
        <ItemActionControl
          item={item}
          qty={qty}
          onAdd={onAdd}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </div>
    </motion.article>
  );
}
