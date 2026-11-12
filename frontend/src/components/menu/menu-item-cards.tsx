"use client";

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
        className={`flex items-center justify-center bg-muted text-primary/25 ${className}`}
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
        className={`flex items-center justify-center bg-muted text-primary/25 ${className}`}
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
      <span className="inline-flex h-9 shrink-0 items-center justify-center rounded-full border border-white/60 bg-secondary/75 px-3.5 text-xs font-medium text-muted-foreground backdrop-blur-md shadow-xs">
        اتمام موجودی
      </span>
    );
  }

  if (qty > 0) {
    return (
      <div
        className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full border border-white/35 bg-gradient-to-r from-primary to-[#8c4d2b] px-1.5 text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_16px_-2px_rgba(122,67,37,0.35)] backdrop-blur-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onDecrease}
          className="flex size-7 items-center justify-center rounded-full text-primary-foreground transition hover:bg-primary-foreground/20 active:scale-95"
          aria-label={`کاهش تعداد ${item.name}`}
        >
          <MinusIcon className="size-3.5 stroke-[2.5]" />
        </button>
        <span className="min-w-4 text-center text-sm font-bold tabular-nums">
          {formatNumber(qty)}
        </span>
        <button
          type="button"
          onClick={onIncrease}
          className="flex size-7 items-center justify-center rounded-full text-primary-foreground transition hover:bg-primary-foreground/20 active:scale-95"
          aria-label={`افزودن یک عدد ${item.name}`}
        >
          <PlusIcon className="size-3.5 stroke-[2.5]" />
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onAdd();
      }}
      aria-label={`افزودن ${item.name} به سبد`}
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-primary to-[#8c4d2b] text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_6px_16px_-2px_rgba(122,67,37,0.3)] backdrop-blur-md transition hover:scale-105 active:scale-95"
    >
      <PlusIcon className="size-4.5 stroke-[2.2]" />
    </button>
  );
}

function BotanicalSprig({ flipped = false }: { flipped?: boolean }) {
  return (
    <svg
      viewBox="0 0 28 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`h-4 w-7 shrink-0 text-primary/70 ${flipped ? "-scale-x-100" : ""}`}
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
    <div className="my-3 flex items-center gap-3 py-2">
      <span className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-primary/40" />
      <span className="flex items-center gap-2.5">
        <BotanicalSprig />
        <span className="text-center">
          <h2 className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
            {title}
          </h2>
          {subtitleEn && (
            <p className="font-serif-en mt-0.5 text-xs font-medium tracking-[0.16em] text-primary uppercase">
              {subtitleEn}
            </p>
          )}
        </span>
        <BotanicalSprig flipped />
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-primary/40" />
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
    <article
      onClick={onSelect}
      className="cursor-pointer overflow-hidden rounded-3xl border border-white/80 bg-gradient-to-br from-card/85 via-blush/45 to-card/70 backdrop-blur-2xl shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,0.9),0_18px_40px_-8px_rgba(74,43,26,0.12)] transition-all duration-300 hover:border-white hover:shadow-[inset_0_1.5px_1.5px_rgba(255,255,255,1),0_22px_48px_-6px_rgba(122,67,37,0.18)] dark:border-white/15 dark:bg-gradient-to-br dark:from-card/80 dark:to-card/50 dark:shadow-[0_18px_40px_-8px_rgba(0,0,0,0.5)]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <ItemThumbnail
          src={image}
          alt={item.name}
          className="size-full"
          iconClassName="size-12"
        />
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-primary/90 px-3.5 py-1 text-xs font-semibold text-primary-foreground shadow-md backdrop-blur-md">
          <span aria-hidden="true">✦</span>
          پیشنهاد مجموعه
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <h3 className="font-display text-lg font-bold text-foreground sm:text-xl">
          {item.name}
        </h3>
        {item.nameEn && (
          <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wider text-muted-foreground italic">
            {item.nameEn}
          </p>
        )}
        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-muted-foreground sm:text-sm">
            {item.description}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <span className="text-sm font-bold whitespace-nowrap text-primary sm:text-base">
            {formatToman(item.price)}
          </span>
          <span className="h-px flex-1 border-b border-dotted border-primary/30" />
          <ItemActionControl
            item={item}
            qty={qty}
            onAdd={onAdd}
            onDecrease={onDecrease}
            onIncrease={onIncrease}
          />
        </div>
      </div>
    </article>
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
    <article
      onClick={onSelect}
      className="cursor-pointer rounded-3xl border border-white/75 bg-card/75 p-4 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_12px_32px_-4px_rgba(60,36,22,0.07)] transition-all duration-300 hover:border-white hover:bg-card/90 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_18px_36px_-4px_rgba(122,67,37,0.14)] dark:border-white/12 dark:bg-card/65 dark:shadow-[0_12px_32px_-4px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-between gap-3.5">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-foreground sm:text-base">
            {item.name}
          </h3>
          {item.nameEn && (
            <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wide text-muted-foreground italic">
              {item.nameEn}
            </p>
          )}
          {item.description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-6 text-muted-foreground sm:text-sm">
              {item.description}
            </p>
          )}
        </div>

        <div className="size-24 shrink-0 overflow-hidden rounded-full border-2 border-white/80 bg-muted shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_6px_16px_-2px_rgba(60,36,22,0.12)] ring-2 ring-primary/20 sm:size-28">
          <ItemThumbnail
            src={image}
            alt={item.name}
            className="size-full"
            iconClassName="size-8"
          />
        </div>
      </div>

      <div className="mt-3.5 flex items-center gap-3">
        <span className="text-sm font-bold whitespace-nowrap text-primary sm:text-base">
          {formatToman(item.price)}
        </span>
        <span className="h-px flex-1 border-b border-dotted border-border" />
        <ItemActionControl
          item={item}
          qty={qty}
          onAdd={onAdd}
          onDecrease={onDecrease}
          onIncrease={onIncrease}
        />
      </div>
    </article>
  );
}
