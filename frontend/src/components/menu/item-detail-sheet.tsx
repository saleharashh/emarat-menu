"use client";

import { motion } from "motion/react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { useState } from "react";

import {
  ItemActionControl,
  ItemThumbnail,
} from "@/components/menu/menu-item-cards";
import { resolveImageUrl } from "@/lib/api";
import { formatNumber, formatToman } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

interface ItemDetailSheetProps {
  item: MenuItem | null;
  qty: number;
  cartCount: number;
  onClose: () => void;
  onAdd: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onOpenCart: () => void;
}

export function ItemDetailSheet({
  item,
  qty,
  cartCount,
  onClose,
  onAdd,
  onDecrease,
  onIncrease,
  onOpenCart,
}: ItemDetailSheetProps) {
  const [lastItem, setLastItem] = useState<MenuItem | null>(item);
  if (item !== null && item !== lastItem) {
    setLastItem(item);
  }

  const activeItem = item ?? lastItem;
  const image = activeItem ? resolveImageUrl(activeItem.imageUrl) : null;

  return (
    <DialogPrimitive.Root
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Popup className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[82vh] w-full max-w-md flex-col outline-none transition-[transform,opacity] duration-200 ease-out sm:bottom-4 sm:max-w-lg data-[starting-style]:translate-y-6 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-6 data-[ending-style]:opacity-0">
          {activeItem && (
            <>
              {/* Subtle floating drag handle */}
              <div className="mx-auto mb-2 h-1 w-10 shrink-0 rounded-full bg-white/30 shadow-xs backdrop-blur-md" />

              <div className="relative flex flex-col overflow-hidden rounded-t-[28px] border border-white/18 bg-[#0e0a08]/85 shadow-[0_28px_70px_rgba(0,0,0,0.92),inset_0_1.5px_2px_rgba(255,255,255,0.2)] backdrop-blur-3xl backdrop-saturate-200 sm:rounded-3xl">
                {/* Internal ambient glow for glass refraction */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-amber-500/15 blur-3xl transform-gpu"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 -left-10 h-40 w-40 rounded-full bg-amber-600/12 blur-3xl transform-gpu"
                />

                <div className="relative overflow-y-auto">
                  {/* Compact Visual Header */}
                  {image ? (
                    <div className="relative h-44 w-full shrink-0 overflow-hidden bg-black/40 sm:h-52">
                      <ItemThumbnail
                        src={image}
                        alt={activeItem.name}
                        className="size-full object-cover"
                        iconClassName="size-10"
                      />

                      {/* Optical Glass Sheen over photo */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-white/10" />

                      <DialogPrimitive.Close
                        aria-label="بستن"
                        className="absolute top-3 left-3 flex size-8 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-2xl transition hover:border-amber-400/50 hover:bg-black/75 active:scale-95"
                      >
                        <XIcon className="size-4" />
                      </DialogPrimitive.Close>

                      {activeItem.isFeatured && (
                        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full border border-white/30 bg-gradient-to-r from-amber-500/95 via-amber-400/95 to-amber-600/95 px-2.5 py-0.5 text-[11px] font-bold text-stone-950 shadow-[0_4px_14px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-xl">
                          <span aria-hidden="true">✦</span>
                          پیشنهاد مجموعه
                        </span>
                      )}
                    </div>
                  ) : (
                    /* Minimal header when no image exists to save mobile screen height */
                    <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <div>
                        {activeItem.isFeatured && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-gradient-to-r from-amber-500/95 via-amber-400/95 to-amber-600/95 px-2.5 py-0.5 text-[11px] font-bold text-stone-950 shadow-xs">
                            ✦ پیشنهاد مجموعه
                          </span>
                        )}
                      </div>
                      <DialogPrimitive.Close
                        aria-label="بستن"
                        className="flex size-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-xl transition hover:border-amber-400/40 hover:bg-white/[0.12] active:scale-95"
                      >
                        <XIcon className="size-4" />
                      </DialogPrimitive.Close>
                    </div>
                  )}

                  {/* Body: High-End Smoked Crystal Glass Panel */}
                  <div className="relative border-t border-white/12 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] p-4 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.18)] sm:p-5">
                    {/* Top Specular Edge Highlight right below photo */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

                    {/* Diagonal Optical Glass Sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-transparent" />

                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <DialogPrimitive.Title className="font-display text-lg font-bold text-white drop-shadow-sm sm:text-xl">
                          {activeItem.name}
                        </DialogPrimitive.Title>
                        {activeItem.nameEn && (
                          <p className="font-serif-en mt-0.5 text-[11px] font-medium tracking-wider text-amber-200/80 italic sm:text-xs">
                            {activeItem.nameEn}
                          </p>
                        )}
                        <p className="mt-1.5 text-lg font-black text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)] sm:text-xl">
                          {formatToman(activeItem.price)}
                        </p>
                      </div>

                      <ItemActionControl
                        item={activeItem}
                        qty={qty}
                        onAdd={onAdd}
                        onDecrease={onDecrease}
                        onIncrease={onIncrease}
                      />
                    </div>

                    {activeItem.description && (
                      <div className="relative z-10 mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08),0_4px_16px_rgba(0,0,0,0.25)] sm:mt-3.5 sm:p-3.5">
                        <DialogPrimitive.Description className="text-xs leading-6 text-stone-200/90 sm:text-sm sm:leading-7">
                          {activeItem.description}
                        </DialogPrimitive.Description>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticky Footer: Sleek, compact and native */}
                <div className="relative z-10 flex items-center gap-2 border-t border-white/12 bg-black/60 p-3 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] sm:gap-2.5 sm:p-3.5">
                  {cartCount > 0 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="flex h-11 flex-[1.2] items-center justify-center gap-2 rounded-full border border-white/35 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 px-3 text-xs font-black whitespace-nowrap text-stone-950 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.65),0_8px_20px_rgba(245,158,11,0.4)] backdrop-blur-2xl transition hover:brightness-105 sm:flex-1 sm:text-sm"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-stone-950 text-[11px] font-black text-amber-400 sm:size-5.5">
                        {formatNumber(cartCount)}
                      </span>
                      مشاهده سبد خرید
                    </motion.button>
                  )}

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className={`flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-3 text-xs font-bold whitespace-nowrap text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl transition hover:border-amber-400/40 hover:bg-white/[0.12] sm:px-4 sm:text-sm ${
                      cartCount > 0 ? "flex-1" : "w-full"
                    }`}
                  >
                    بازگشت
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
