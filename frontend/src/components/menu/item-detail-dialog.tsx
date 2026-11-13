"use client";

import { motion } from "motion/react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { FlameIcon, SnowflakeIcon, SparklesIcon, XIcon } from "lucide-react";
import { useState } from "react";

import {
  ItemActionControl,
  ItemThumbnail,
  getTraditionalMeta,
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
  const meta = activeItem ? getTraditionalMeta(activeItem) : null;

  return (
    <DialogPrimitive.Root
      open={item !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <DialogPrimitive.Popup className="relative flex flex-col w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[86vh] rounded-[32px] sm:rounded-[38px] border border-amber-400/35 bg-[#0b1018]/95 shadow-[0_28px_70px_rgba(0,0,0,0.95),inset_0_1.5px_2px_rgba(229,170,56,0.25)] ring-1 ring-teal-500/20 backdrop-blur-2xl outline-none overflow-hidden transition-[transform,opacity] duration-200 ease-out data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0">
            {activeItem && (
              <>
                {/* Visual Header */}
                {image ? (
                  <div className="relative h-52 w-full shrink-0 overflow-hidden bg-[#090d14] sm:h-60">
                    <ItemThumbnail
                      src={image}
                      alt={activeItem.name}
                      className="size-full object-cover"
                      iconClassName="size-10"
                    />

                    {/* Gradient atmosphere */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0b1018] via-transparent to-black/40" />

                    <DialogPrimitive.Close
                      aria-label="بستن"
                      className="absolute top-3.5 left-3.5 flex size-9 items-center justify-center rounded-full border border-amber-400/30 bg-[#090e15]/80 text-amber-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] backdrop-blur-2xl transition hover:border-amber-400/60 hover:text-white active:scale-95 cursor-pointer z-10"
                    >
                      <XIcon className="size-4" />
                    </DialogPrimitive.Close>

                    {activeItem.isFeatured && (
                      <span className="absolute right-3.5 bottom-3.5 inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-[#99222c]/95 via-[#b91c1c]/95 to-[#99222c]/95 px-3 py-1 text-xs font-bold text-amber-100 shadow-[0_4px_16px_rgba(153,34,44,0.4)] backdrop-blur-md">
                        <SparklesIcon className="size-3 text-amber-300" />
                        پیشنهاد ویژه عمارت
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="relative flex items-center justify-between border-b border-amber-400/20 px-5 py-4">
                    <div>
                      {activeItem.isFeatured && (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-gradient-to-r from-[#99222c]/95 to-[#b91c1c]/95 px-3 py-1 text-xs font-bold text-amber-100 shadow-xs">
                          ✦ پیشنهاد ویژه عمارت
                        </span>
                      )}
                    </div>
                    <DialogPrimitive.Close
                      aria-label="بستن"
                      className="flex size-9 items-center justify-center rounded-full border border-amber-400/30 bg-[#121b27]/80 text-amber-200 backdrop-blur-xl transition hover:border-amber-400/60 hover:text-white active:scale-95 cursor-pointer"
                    >
                      <XIcon className="size-4" />
                    </DialogPrimitive.Close>
                  </div>
                )}

                {/* Body: Traditional Haveli Details */}
                <div className="relative flex-1 overflow-y-auto min-h-0 border-t border-amber-400/15 bg-gradient-to-b from-[#131c28]/70 via-[#0e1622]/80 to-[#0b1018]/90 p-4.5 sm:p-5">
                  <div className="relative z-10 flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <DialogPrimitive.Title className="font-heading text-xl font-bold text-[#fbf8f1] drop-shadow-sm sm:text-2xl">
                        {activeItem.name}
                      </DialogPrimitive.Title>
                      {activeItem.nameEn && (
                        <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wider text-amber-200/75 italic">
                          {activeItem.nameEn}
                        </p>
                      )}

                      {/* Traditional Temperament Badge */}
                      {meta?.temperament && (
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/30 bg-amber-400/15 px-2.5 py-0.5 text-xs font-bold text-amber-200">
                            {meta.isHot && <FlameIcon className="size-3 text-amber-400" />}
                            {meta.isCool && <SnowflakeIcon className="size-3 text-teal-300" />}
                            {meta.temperament}
                          </span>
                          {meta.specialBadge && (
                            <span className="text-xs text-teal-300/85">
                              • {meta.specialBadge}
                            </span>
                          )}
                        </div>
                      )}

                      <p className="mt-2.5 text-xl font-black text-[#fcd34d] drop-shadow-[0_2px_8px_rgba(229,170,56,0.35)] sm:text-2xl">
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
                    <div className="relative z-10 mt-4 rounded-2xl border border-amber-400/30 bg-[#101925]/80 p-4 backdrop-blur-xl shadow-[inset_0_1.5px_2px_rgba(229,170,56,0.1),0_8px_24px_rgba(0,0,0,0.4)] ring-1 ring-teal-500/15">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold text-amber-300">
                        <span className="size-1.5 rounded-full bg-teal-400 shadow-[0_0_6px_rgba(45,212,191,0.8)]" />
                        <span className="font-heading">شرح و خواص سنتی محصول</span>
                      </div>
                      <DialogPrimitive.Description className="text-xs leading-6 text-stone-200/95 sm:text-sm sm:leading-7">
                        {activeItem.description}
                      </DialogPrimitive.Description>
                    </div>
                  )}
                </div>

                {/* Dialog Footer */}
                <div className="relative z-10 flex items-center gap-2.5 border-t border-amber-400/20 bg-[#090e15]/90 p-3.5 backdrop-blur-2xl sm:p-4">
                  {cartCount > 0 && (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.015 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="flex h-11 flex-[1.2] items-center justify-center gap-2 rounded-full border border-amber-400/40 bg-gradient-to-r from-[#172333] via-[#0e1724] to-[#172333] px-3 text-xs font-bold whitespace-nowrap text-amber-100 shadow-[inset_0_1.5px_1px_rgba(229,170,56,0.25),0_8px_20px_rgba(0,0,0,0.6)] ring-1 ring-teal-500/20 transition hover:border-amber-400/70 sm:flex-1 sm:text-sm cursor-pointer"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[11px] font-black text-stone-950 sm:size-5.5">
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
                    className={`flex h-11 items-center justify-center rounded-full border border-amber-400/25 bg-[#121a24]/80 px-4 text-xs font-bold whitespace-nowrap text-stone-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] backdrop-blur-xl transition hover:border-amber-400/50 hover:text-white sm:text-sm cursor-pointer ${
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
