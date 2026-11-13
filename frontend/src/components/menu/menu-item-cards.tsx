"use client";

import { motion, AnimatePresence } from "motion/react";
import { ImageIcon, MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

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
        className={`flex items-center justify-center bg-muted/70 text-primary/30 ${className}`}
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
        className={`flex items-center justify-center bg-muted/70 text-primary/30 ${className}`}
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
      <span className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.05] px-3.5 text-xs font-medium text-stone-400 backdrop-blur-md shadow-xs">
        اتمام موجودی
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
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/30 bg-gradient-to-r from-[#ca8234] via-[#df9b47] to-[#ca8234] px-1.5 text-stone-950 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_6px_18px_rgba(217,144,59,0.25)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.button
          type="button"
          onClick={onDecrease}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          className="flex size-7 items-center justify-center rounded-full text-stone-950 transition hover:bg-black/15"
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
          className="flex size-7 items-center justify-center rounded-full text-stone-950 transition hover:bg-black/15"
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
      aria-label={`افزودن ${item.name} به سبد`}
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/35 bg-gradient-to-br from-[#ca8234] via-[#df9b47] to-[#ca8234] text-stone-950 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.65),0_6px_18px_rgba(217,144,59,0.25)] backdrop-blur-xl"
    >
      <PlusIcon className="size-4.5 stroke-[2.5]" />
    </motion.button>
  );
}

function BotanicalSprig({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 28 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-7 shrink-0 text-primary/75 ${flipped ? "-scale-x-100" : ""}`}
      aria-hidden="true"
    >
      <path
        d="M2 13C7.5 11.5 14 8 24 4.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M9 10.6C7.5 7.8 8.5 5 11 4C11.8 6.8 11 9.2 9 10.6Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8C14.8 5.2 16.4 2.8 19 2.4C19.2 5 17.8 7 15.5 8Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M13 9.2C14.5 11.4 16.8 12.2 19 11.2C17.8 9.2 15.5 8.4 13 9.2Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface SectionDividerProps {
  title: string;
  subtitleEn?: string | null;
}

export function SectionDivider({ title, subtitleEn }: SectionDividerProps) {
  return (
    <div className="my-4 flex items-center gap-3 py-2">
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500/30 to-amber-400/50" />
      <span className="flex items-center gap-2.5">
        <BotanicalSprig />
        <span className="text-center">
          <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
            {title}
          </h2>
          {subtitleEn && (
            <p className="font-serif-en mt-0.5 text-xs font-medium tracking-[0.2em] text-amber-300/80 uppercase">
              {subtitleEn}
            </p>
          )}
        </span>
        <BotanicalSprig flipped />
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/30 to-amber-400/50" />
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

  return (
    <motion.article
      onClick={onSelect}
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="group relative cursor-pointer overflow-hidden rounded-3xl glass-featured transition-all duration-300 hover:border-amber-400/35 hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.4),0_24px_50px_-8px_rgba(217,144,59,0.18)] before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
        <ItemThumbnail
          src={image}
          alt={item.name}
          className="size-full transition-transform duration-500 group-hover:scale-105"
          iconClassName="size-12"
        />
        {/* Optical Glass Sheen over visual */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/10" />

        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-gradient-to-r from-[#ca8234]/95 via-[#df9b47]/95 to-[#ca8234]/95 px-3 py-0.5 text-xs font-bold text-stone-950 shadow-[0_4px_14px_rgba(217,144,59,0.25),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-xl">
          <span aria-hidden="true">✦</span>
          پیشنهاد مجموعه
        </span>
      </div>

      <div className="relative p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold text-white sm:text-xl">
          {item.name}
        </h3>
        {item.nameEn && (
          <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wider text-amber-200/75 italic">
            {item.nameEn}
          </p>
        )}
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-stone-300/85 sm:text-sm">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <span className="text-base font-black whitespace-nowrap text-amber-300 drop-shadow-[0_2px_8px_rgba(217,144,59,0.22)] sm:text-lg">
            {formatToman(item.price)}
          </span>
          <span className="h-px flex-1 border-b border-dotted border-white/15" />
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
      className="group relative cursor-pointer overflow-hidden rounded-3xl glass-crystal p-4 transition-all duration-300 hover:border-amber-400/35 hover:shadow-[inset_0_2px_2px_rgba(255,255,255,0.35),0_18px_40px_-6px_rgba(217,144,59,0.15)] before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[1.5px] before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent"
    >
      {/* Specular Diagonal Sheen Overlay */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-br from-white/[0.06] via-transparent to-transparent opacity-80" />

      <div className="relative flex items-center justify-between gap-3.5">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-white sm:text-base">
            {item.name}
          </h3>
          {item.nameEn && (
            <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wide text-amber-200/75 italic">
              {item.nameEn}
            </p>
          )}
          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-stone-300/85 sm:text-sm">
              {item.description}
            </p>
          )}
        </div>

        <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-2 border-white/20 bg-black/50 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.25),0_10px_24px_rgba(0,0,0,0.6)] ring-1 ring-white/15 sm:size-28">
          <ItemThumbnail
            src={image}
            alt={item.name}
            className="size-full transition-transform duration-500 group-hover:scale-105"
            iconClassName="size-8"
          />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/20" />
        </div>
      </div>

      <div className="relative mt-3.5 flex items-center gap-3">
        <span className="text-sm font-black whitespace-nowrap text-amber-300 drop-shadow-[0_2px_8px_rgba(217,144,59,0.22)] sm:text-base">
          {formatToman(item.price)}
        </span>
        <span className="h-px flex-1 border-b border-dotted border-white/15" />
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
