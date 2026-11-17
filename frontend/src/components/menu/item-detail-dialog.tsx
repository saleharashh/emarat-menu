"use client";

import { motion } from "motion/react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { SparklesIcon, XIcon } from "lucide-react";
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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[#583101]/40 dark:bg-black/75 backdrop-blur-sm transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <DialogPrimitive.Popup className="relative flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[86vh] rounded-[32px] sm:rounded-[38px] border border-[#E7BC91] bg-[#FFFDF9] shadow-[0_28px_70px_rgba(88,49,1,0.2)] ring-1 ring-[#D4A276]/30 backdrop-blur-2xl outline-none overflow-hidden transition-[transform,opacity] duration-200 ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0 dark:border-amber-400/35 dark:bg-[#0b1018]/95 dark:shadow-[0_28px_70px_rgba(0,0,0,0.95),inset_0_1.5px_2px_rgba(229,170,56,0.25)] dark:ring-teal-500/20">
            {activeItem && (
              <>
                {/* Visual Header */}
                {image ? (
                  <div className="relative h-52 w-full shrink-0 overflow-hidden bg-[#F3D5B5]/40 sm:h-60 dark:bg-[#090d14]">
                    <ItemThumbnail
                      src={image}
                      alt={activeItem.name}
                      className="size-full object-cover"
                      iconClassName="size-10"
                    />

                    {/* Gradient atmosphere */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#FFF6EB] via-transparent to-black/25 dark:from-[#0b1018] dark:via-transparent dark:to-black/40" />

                    <DialogPrimitive.Close
                      aria-label="بستن"
                      className="absolute top-3.5 left-3.5 flex size-9 items-center justify-center rounded-full border border-[#D4A276]/40 bg-[#FFFFFF]/85 text-[#6F4518] shadow-xs backdrop-blur-2xl transition hover:border-[#BC8A5F] hover:bg-[#F3D5B5]/60 hover:text-[#583101] active:scale-95 cursor-pointer z-10 dark:border-amber-400/30 dark:bg-[#090e15]/80 dark:text-amber-200 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] dark:hover:border-amber-400/60 dark:hover:text-white"
                    >
                      <XIcon className="size-4" />
                    </DialogPrimitive.Close>

                    {activeItem.isFeatured && (
                      <span className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-1.5 rounded-full border border-[#BC8A5F]/50 bg-gradient-to-r from-[#8B5E34] via-[#6F4518] to-[#8B5E34] px-3 py-1 text-xs font-bold text-[#FFEDD8] shadow-[0_4px_16px_rgba(88,49,1,0.2)] backdrop-blur-md dark:border-amber-300/40 dark:from-[#99222c]/95 dark:via-[#b91c1c]/95 dark:to-[#99222c]/95 dark:text-amber-100 dark:shadow-[0_4px_16px_rgba(153,34,44,0.4)]">
                        <SparklesIcon className="size-3 text-[#F3D5B5] dark:text-amber-300" />
                        پیشنهاد ویژه عمارت
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative flex items-center justify-between border-b border-[#E7BC91]/40 px-5 py-4 dark:border-amber-400/20">
                    <div>
                      {activeItem.isFeatured && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#BC8A5F]/50 bg-gradient-to-r from-[#8B5E34] to-[#6F4518] px-3 py-1 text-xs font-bold text-[#FFEDD8] shadow-xs dark:border-amber-300/40 dark:from-[#99222c] dark:to-[#b91c1c] dark:text-amber-100">
                          ✦ پیشنهاد ویژه عمارت
                        </span>
                      )}
                    </div>
                    <DialogPrimitive.Close
                      aria-label="بستن"
                      className="flex size-9 items-center justify-center rounded-full border border-[#D4A276]/40 bg-[#FFFFFF]/85 text-[#6F4518] backdrop-blur-xl transition hover:border-[#BC8A5F] hover:bg-[#F3D5B5]/60 hover:text-[#583101] active:scale-95 cursor-pointer dark:border-amber-400/30 dark:bg-[#090e15]/80 dark:text-amber-200 dark:hover:border-amber-400/60 dark:hover:text-white"
                    >
                      <XIcon className="size-4" />
                    </DialogPrimitive.Close>
                  </div>
                )}

                {/* Body: Traditional Haveli Details */}
                <div className="relative flex-1 overflow-y-auto min-h-0 border-t border-[#E7BC91]/30 bg-gradient-to-b from-[#FFFFFF] via-[#FFFBF6] to-[#FFF6EB] p-4.5 sm:p-5 dark:border-amber-400/20 dark:from-[#0f1722]/95 dark:via-[#0c121b]/95 dark:to-[#080c12]/95">
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <DialogPrimitive.Title className="font-heading text-xl font-bold text-[#583101] sm:text-2xl dark:text-[#fbf8f1]">
                        {activeItem.name}
                      </DialogPrimitive.Title>
                      {activeItem.nameEn && (
                        <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wider text-[#8B5E34] italic dark:text-amber-200/80">
                          {activeItem.nameEn}
                        </p>
                      )}

                      <p className="mt-2.5 text-xl font-black text-[#6F4518] sm:text-2xl dark:text-[#fcd34d] dark:drop-shadow-[0_2px_8px_rgba(229,170,56,0.35)]">
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
                    <div className="relative z-10 mt-4 rounded-2xl border border-[#E7BC91] bg-[#FFFDF9] p-4 backdrop-blur-xl shadow-xs ring-1 ring-[#D4A276]/20 dark:border-amber-400/30 dark:bg-[#101925]/80 dark:shadow-[inset_0_1.5px_2px_rgba(229,170,56,0.1),0_8px_24px_rgba(0,0,0,0.4)] dark:ring-teal-500/15">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-[#8B5E34] dark:text-amber-300">
                        <span className="size-1.5 rounded-full bg-[#BC8A5F] dark:bg-teal-400 dark:shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
                        <span className="font-heading">شرح و خواص سنتی محصول</span>
                      </div>
                      <DialogPrimitive.Description className="text-xs leading-6 text-[#6F4518]/90 sm:text-sm sm:leading-7 dark:text-stone-200/95">
                        {activeItem.description}
                      </DialogPrimitive.Description>
                    </div>
                  )}
                </div>

                {/* Dialog Footer */}
                <div className="relative z-10 flex items-center gap-2.5 border-t border-[#E7BC91]/50 bg-[#FFEDD8]/95 p-3.5 backdrop-blur-2xl sm:p-4 dark:border-amber-400/20 dark:bg-[#090e15]/90">
                  {cartCount > 0 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="flex h-11 flex-[1.2] items-center justify-center gap-2 rounded-full border border-[#BC8A5F]/50 bg-gradient-to-r from-[#8B5E34] via-[#6F4518] to-[#8B5E34] px-3 text-xs font-bold whitespace-nowrap text-[#FFEDD8] shadow-[0_4px_16px_rgba(88,49,1,0.2)] ring-1 ring-[#D4A276]/30 transition hover:border-[#D4A276] sm:flex-1 sm:text-sm cursor-pointer dark:border-amber-400/40 dark:from-[#172333] dark:via-[#0e1724] dark:to-[#172333] dark:text-amber-100 dark:shadow-[inset_0_1.5px_1px_rgba(229,170,56,0.25),0_8px_20px_rgba(0,0,0,0.6)] dark:ring-teal-500/20 dark:hover:border-amber-400/70"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FFEDD8] text-[11px] font-black text-[#583101] sm:size-5.5 dark:bg-amber-500 dark:text-stone-950">
                        {formatNumber(cartCount)}
                      </span>
                      مشاهده سینی سفارش
                    </motion.button>
                  )}

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={onClose}
                    className={`flex h-11 items-center justify-center rounded-full border border-[#D4A276]/40 bg-[#FFFFFF]/85 px-4 text-xs font-bold whitespace-nowrap text-[#6F4518] shadow-xs backdrop-blur-xl transition hover:border-[#BC8A5F] hover:bg-[#F3D5B5]/60 hover:text-[#583101] sm:text-sm cursor-pointer dark:border-amber-400/25 dark:bg-[#121a24]/80 dark:text-stone-200 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] dark:hover:border-amber-400/50 dark:hover:text-white ${
                      cartCount > 0 ? "flex-1" : "w-full"
                    }`}
                  >
                    بستن
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

export { ItemDetailDialog as ItemDetailSheet };
export type { ItemDetailDialogProps as ItemDetailSheetProps };
