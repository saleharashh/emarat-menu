"use client";

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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[3px] transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Popup className="fixed inset-x-0 bottom-0 z-50 mx-auto flex max-h-[92vh] w-full max-w-2xl flex-col outline-none transition-[transform,opacity] duration-200 ease-out sm:bottom-5 sm:max-w-lg data-[starting-style]:translate-y-6 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-6 data-[ending-style]:opacity-0">
          {activeItem && (
            <>
              {/* Floating drag handle */}
              <div className="mx-auto mb-2.5 h-1.5 w-12 shrink-0 rounded-full bg-white/60 backdrop-blur-sm" />

              <div className="flex flex-col overflow-hidden rounded-t-3xl border border-white/70 bg-card/75 shadow-[0_24px_60px_-12px_rgba(50,30,18,0.32),inset_0_1.5px_1px_rgba(255,255,255,0.85)] backdrop-blur-3xl backdrop-saturate-180 dark:border-white/15 dark:bg-card/70 dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.12)] sm:rounded-3xl">
                <div className="overflow-y-auto">
                  {/* Top visual */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                    <ItemThumbnail
                      src={image}
                      alt={activeItem.name}
                      className="size-full"
                      iconClassName="size-14"
                    />

                    <DialogPrimitive.Close
                      aria-label="بستن"
                      className="absolute top-3 left-3 flex size-9 items-center justify-center rounded-full border border-white/50 bg-card/70 text-primary shadow-sm backdrop-blur-md transition hover:bg-card/90"
                    >
                      <XIcon className="size-4" />
                    </DialogPrimitive.Close>

                    {activeItem.isFeatured && (
                      <span className="absolute right-3 bottom-3 inline-flex items-center gap-1 rounded-full border border-primary/20 bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground shadow-sm backdrop-blur-sm">
                        <span aria-hidden="true">✦</span>
                        پیشنهاد مجموعه
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="bg-gradient-to-b from-white/40 via-white/20 to-white/10 p-5 backdrop-blur-xl dark:from-white/[0.06] dark:via-white/[0.03] dark:to-transparent">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <DialogPrimitive.Title className="font-display text-xl font-bold text-foreground">
                          {activeItem.name}
                        </DialogPrimitive.Title>
                        {activeItem.nameEn && (
                          <p className="font-serif-en mt-0.5 text-xs font-medium tracking-wider text-foreground/65 italic">
                            {activeItem.nameEn}
                          </p>
                        )}
                        <p className="mt-2 text-base font-bold text-primary">
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
                      <DialogPrimitive.Description className="mt-3 text-sm leading-7 text-foreground/80">
                        {activeItem.description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                </div>

                {/* Sticky Footer */}
                <div className="flex items-center gap-2.5 border-t border-white/45 bg-white/40 p-3.5 backdrop-blur-2xl dark:border-white/10 dark:bg-white/[0.05] sm:gap-3 sm:p-4">
                  {cartCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenCart();
                      }}
                      className="flex h-12 flex-[1.2] items-center justify-center gap-2 rounded-full border border-white/45 bg-gradient-to-r from-primary/95 to-[#8c4d2b]/95 px-3 text-xs font-bold whitespace-nowrap text-primary-foreground shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.4),0_8px_22px_-4px_rgba(122,67,37,0.4)] backdrop-blur-xl backdrop-saturate-180 transition hover:brightness-105 sm:flex-1 sm:gap-2.5 sm:px-4 sm:text-sm"
                    >
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-primary sm:size-6 sm:text-xs">
                        {formatNumber(cartCount)}
                      </span>
                      مشاهده سبد خرید
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex h-12 items-center justify-center rounded-full border border-white/70 bg-white/55 px-3 text-xs font-semibold whitespace-nowrap text-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)] backdrop-blur-xl transition hover:bg-white/75 dark:border-white/15 dark:bg-white/10 dark:hover:bg-white/15 sm:px-4 sm:text-sm ${
                      cartCount > 0 ? "flex-1" : "w-full"
                    }`}
                  >
                    مشاهده منو
                  </button>
                </div>
              </div>
            </>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
