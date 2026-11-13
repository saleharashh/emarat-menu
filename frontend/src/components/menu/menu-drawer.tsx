"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
  MapPinIcon,
  SettingsIcon,
  ShoppingCartIcon,
  XIcon,
} from "lucide-react";
import Link from "next/link";

import { CafeLogo } from "@/components/menu/cafe-logo";
import { resolveImageUrl } from "@/lib/api";
import { getCategoryIcon } from "@/lib/category-icons";
import { formatNumber } from "@/lib/format";
import type { Category } from "@/lib/types";

interface MenuDrawerProps {
  open: boolean;
  categories: Category[];
  activeCategoryId: number | null;
  cartCount: number;
  heroImageUrl: string | null;
  onClose: () => void;
  onSelectCategory: (categoryId: number) => void;
  onOpenCart: () => void;
}

export function MenuDrawer({
  open,
  categories,
  activeCategoryId,
  cartCount,
  heroImageUrl,
  onClose,
  onSelectCategory,
  onOpenCart,
}: MenuDrawerProps) {
  const cover = resolveImageUrl(heroImageUrl);

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col border-l border-white/80 bg-background/80 text-foreground shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.9),0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-3xl outline-none transition-[transform,opacity] duration-200 ease-out dark:border-white/14 dark:bg-background/80 data-[starting-style]:translate-x-full data-[starting-style]:opacity-0 data-[ending-style]:translate-x-full data-[ending-style]:opacity-0">
          {/* Header card */}
          <div className="relative overflow-hidden border-b border-white/60 px-5 pt-5 pb-6 dark:border-white/10">
            {cover && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cover}
                alt=""
                className="absolute inset-0 size-full object-cover opacity-30"
              />
            )}
            <div className="pattern-botanical absolute inset-0 bg-gradient-to-b from-blush/60 to-background" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CafeLogo className="size-12" />
                <div>
                  <DialogPrimitive.Title className="font-display text-xl font-bold text-foreground">
                    کافه عمارت
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="mt-0.5 text-xs text-muted-foreground">
                    طعم‌های اصیل و سنتی یزد
                  </DialogPrimitive.Description>
                </div>
              </div>
              <DialogPrimitive.Close
                aria-label="بستن منو"
                className="flex size-8 items-center justify-center rounded-full border border-white/70 bg-card/75 text-foreground shadow-xs backdrop-blur-md transition hover:border-white hover:bg-card/90"
              >
                <XIcon className="size-4" />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Categories navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-2.5 px-2 text-xs font-semibold text-muted-foreground">
              دسته‌بندی‌های منو
            </p>
            <div className="flex flex-col gap-1.5">
              {categories.map((cat) => {
                const Icon = getCategoryIcon(cat.icon);
                const isActive = cat.id === activeCategoryId;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      onClose();
                    }}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "border border-white/35 bg-gradient-to-r from-primary to-[#8c4d2b] font-bold text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_6px_16px_-2px_rgba(122,67,37,0.3)] backdrop-blur-md"
                        : "border border-white/70 bg-card/70 text-foreground shadow-xs backdrop-blur-md hover:border-white hover:bg-card/90"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {Icon && <Icon className="size-4" />}
                      {cat.name}
                    </span>
                    {cat.nameEn && (
                      <span
                        className={`font-serif-en text-xs italic ${
                          isActive
                            ? "text-primary-foreground/80"
                            : "text-muted-foreground"
                        }`}
                      >
                        {cat.nameEn}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Drawer footer actions */}
          <div className="space-y-2.5 border-t border-white/60 bg-gradient-to-b from-card/60 to-blush/40 p-4 backdrop-blur-2xl dark:border-white/10">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex h-11 w-full items-center justify-between rounded-full border border-white/40 bg-gradient-to-r from-primary to-[#8c4d2b] px-4 text-sm font-bold text-primary-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_20px_-3px_rgba(122,67,37,0.3)] backdrop-blur-md transition hover:brightness-105"
            >
              <span className="flex items-center gap-2">
                <ShoppingCartIcon className="size-4" />
                مشاهده سبد خرید
              </span>
              {cartCount > 0 && (
                <span className="rounded-full bg-white px-2 py-0.5 text-xs font-bold text-primary shadow-xs">
                  {formatNumber(cartCount)}
                </span>
              )}
            </button>

            <Link
              href="/admin"
              onClick={onClose}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/70 bg-card/75 px-4 text-xs font-semibold text-foreground shadow-xs backdrop-blur-md transition hover:border-white hover:bg-card/90"
            >
              <SettingsIcon className="size-3.5" />
              پنل مدیریت منو
            </Link>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-muted-foreground">
              <MapPinIcon className="size-3.5" />
              یزد، بافت تاریخی شهر
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
