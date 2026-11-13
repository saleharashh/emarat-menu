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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Popup className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-2xl flex-col outline-none transition-[transform,opacity] duration-200 ease-out sm:bottom-5 sm:max-w-lg data-[starting-style]:translate-y-6 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-6 data-[ending-style]:opacity-0">
          {activeItem && (
            <>
              {/* Floating drag handle */}
              <div className="mx-auto mb-2.5 h-1.5 w-12 shrink-0 rounded-full bg-white/35 shadow-sm backdrop-blur-md" />

              <div className="relative flex flex-col overflow-hidden rounded-t-3xl border border-white/18 bg-[#0e0a08]/75 shadow-[0_32px_80px_rgba(0,0,0,0.92),inset_0_1.5px_2px_rgba(255,255,255,0.22)] backdrop-blur-3xl backdrop-saturate-200 sm:rounded-3xl">
                {/* Ambient glow orbs inside the sheet for authentic optical glass refraction */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-12 -right-12 h-60 w-60 rounded-full bg-amber-500/18 blur-3xl transform-gpu"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 -left-12 h-48 w-48 rounded-full bg-amber-600/14 blur-3xl transform-gpu"
                />

                <div className="relative overflow-y-auto">
                  {/* Top visual */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                    <ItemThumbnail
                      src={image}
                      alt={activeItem.name}
                      className="size-full"
                      iconClassName="size-14"
                    />

                    {/* Optical Glass Sheen over photo */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/10" />

                    <DialogPrimitive.Close
                      aria-label="بستن"
                      className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-2xl transition hover:border-amber-400/50 hover:bg-black/70"
                    >
                      <XIcon className="size-4" />
                    </DialogPrimitive.Close>

                    {activeItem.isFeatured && (
                      <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-gradient-to-r from-amber-500/95 via-amber-400/95 to-amber-600/95 px-3 py-1 text-xs font-bold text-stone-950 shadow-[0_4px_16px_rgba(245,158,11,0.45),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-xl">
                        <span aria-hidden="true">✦</span>
                        پیشنهاد مجموعه
                      </span>
                    )}
                  </div>

                  {/* Body: High-End Smoked Crystal Glass Panel */}
                  <div className="relative border-t border-white/15 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] p-5 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.18)]">
                    {/* Top Specular Edge Highlight right below photo */}
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />
                    
                    {/* Diagonal Optical Glass Sheen */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent" />

                    <div className="relative z-10 flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <DialogPrimitive.Title className="font-display text-xl font-bold text-white sm:text-2xl drop-shadow-sm">
                          {activeItem.name}
                        </DialogPrimitive.Title>
                        {activeItem.nameEn && (
                          <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wider text-amber-200/80 italic">
                            {activeItem.nameEn}
                          </p>
                        )}
                        <p className="mt-2 text-xl font-black text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)]">
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
                      <div className="relative z-10 mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_16px_rgba(0,0,0,0.3)]">
                        <DialogPrimitive.Description className="text-xs leading-6 text-stone-200/90 sm:text-sm sm:leading-7">
                          {activeItem.description}
                        </DialogPrimitive.Description>
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticky Footer with Pure Crystal Glass */}
                <div className="relative z-10 flex items-center gap-2.5 border-t border-white/12 bg-black/55 p-3.5 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] sm:gap-3 sm:p-4">
                  {cartCount > 0 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="flex h-12 flex-[1.2] items-center justify-center gap-2 rounded-full border border-white/35 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 px-3 text-xs font-black whitespace-nowrap text-stone-950 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.65),0_10px_26px_rgba(245,158,11,0.45)] backdrop-blur-2xl transition hover:brightness-105 sm:flex-1 sm:gap-2.5 sm:px-4 sm:text-sm"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-stone-950 text-[11px] font-black text-amber-400 sm:size-6 sm:text-xs">
                        {formatNumber(cartCount)}
                      </span>
                      مشاهده سبد خرید
                    </motion.button>
                  )}

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className={`flex h-12 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-3 text-xs font-bold whitespace-nowrap text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)] backdrop-blur-xl transition hover:border-amber-400/40 hover:bg-white/[0.12] sm:px-4 sm:text-sm ${
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
