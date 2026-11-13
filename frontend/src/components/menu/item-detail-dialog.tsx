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

export interface ItemDetailDialogProps {
  item: MenuItem | null;
  qty: number;
  cartCount: number;
  onClose: () => void;
  onAdd: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  onOpenCart: () => void;
}

export function ItemDetailDialog({
  item,
  qty,
  cartCount,
  onClose,
  onAdd,
  onDecrease,
  onIncrease,
  onOpenCart,
}: ItemDetailDialogProps) {
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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <DialogPrimitive.Popup className="relative flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[86vh] rounded-3xl border border-white/18 bg-[#0e0a08]/92 shadow-[0_28px_70px_rgba(0,0,0,0.92),inset_0_1.5px_2px_rgba(255,255,255,0.2)] backdrop-blur-xl outline-none overflow-hidden transition-[transform,opacity] duration-200 ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
            {activeItem && (
              <>
                {/* Internal ambient glow for glass refraction */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-amber-500/08 blur-3xl transform-gpu"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 -left-10 h-40 w-40 rounded-full bg-amber-600/06 blur-3xl transform-gpu"
                />

                {/* Compact Visual Header */}
                {image ? (
                  <div className="relative h-48 w-full shrink-0 overflow-hidden bg-black/40 sm:h-56">
                    <ItemThumbnail
                      src={image}
                      alt={activeItem.name}
                      className="size-full object-cover"
                      iconClassName="size-10"
                    />

                    {/* Optical Glass Sheen over photo */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-white/10" />

                    <DialogPrimitive.Close
                      aria-label="بستن"
                      className="absolute top-3 left-3 flex size-8.5 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3)] backdrop-blur-2xl transition hover:border-amber-400/50 hover:bg-black/75 active:scale-95 cursor-pointer z-10"
                    >
                      <XIcon className="size-4" />
                    </DialogPrimitive.Close>

                    {activeItem.isFeatured && (
                      <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full border border-white/30 bg-gradient-to-r from-[#ca8234]/95 via-[#df9b47]/95 to-[#ca8234]/95 px-2.5 py-0.5 text-[11px] font-bold text-stone-950 shadow-[0_4px_14px_rgba(217,144,59,0.25),inset_0_1px_1px_rgba(255,255,255,0.7)] backdrop-blur-xl">
                        <span aria-hidden="true">✦</span>
                        پیشنهاد مجموعه
                      </span>
                    )}
                  </div>
                ) : (
                  /* Minimal header when no image exists */
                  <div className="relative flex items-center justify-between border-b border-white/10 px-5 py-4">
                    <div>
                      {activeItem.isFeatured && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-gradient-to-r from-[#ca8234]/95 via-[#df9b47]/95 to-[#ca8234]/95 px-2.5 py-0.5 text-[11px] font-bold text-stone-950 shadow-xs">
                          ✦ پیشنهاد مجموعه
                        </span>
                      )}
                    </div>
                    <DialogPrimitive.Close
                      aria-label="بستن"
                      className="flex size-8.5 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-xl transition hover:border-amber-400/40 hover:bg-white/[0.12] active:scale-95 cursor-pointer"
                    >
                      <XIcon className="size-4" />
                    </DialogPrimitive.Close>
                  </div>
                )}

                {/* Body: High-End Smoked Crystal Glass Panel (Scrollable if needed) */}
                <div className="relative flex-1 overflow-y-auto min-h-0 border-t border-white/12 bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.01] p-4.5 sm:p-5 backdrop-blur-2xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.18)]">
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
                    <div className="relative z-10 mt-4 rounded-2xl border-2 border-amber-400/35 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-4 backdrop-blur-xl shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.18),0_8px_24px_rgba(0,0,0,0.35)] ring-1 ring-amber-400/20">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-300">
                        <span className="size-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]" />
                        <span>محتویات و ترکیبات محصول</span>
                      </div>
                      <DialogPrimitive.Description className="text-xs leading-6 text-stone-200/95 sm:text-sm sm:leading-7">
                        {activeItem.description}
                      </DialogPrimitive.Description>
                    </div>
                  )}
                </div>

                {/* Sticky Dialog Footer */}
                <div className="relative z-10 flex items-center gap-2.5 border-t border-white/12 bg-black/60 p-3.5 backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] sm:p-4">
                  {cartCount > 0 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="flex h-11 flex-[1.2] items-center justify-center gap-2 rounded-full border border-white/25 bg-black/60 px-3 text-xs font-black whitespace-nowrap text-white shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.2),0_8px_20px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-2xl transition hover:bg-black/75 hover:border-white/40 sm:flex-1 sm:text-sm cursor-pointer"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/15 text-[11px] font-black text-white sm:size-5.5">
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
                    className={`flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] px-4 text-xs font-bold whitespace-nowrap text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-xl transition hover:border-amber-400/40 hover:bg-white/[0.12] sm:text-sm cursor-pointer ${
                      cartCount > 0 ? "flex-1" : "w-full"
                    }`}
                  >
                    بازگشت
                  </motion.button>
                </div>
              </>
            )}
          </DialogPrimitive.Popup>
        </DialogPrimitive.Viewport>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// Re-export alias for backwards compatibility
export { ItemDetailDialog as ItemDetailSheet };
export type { ItemDetailDialogProps as ItemDetailSheetProps };
