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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col border-l border-border bg-background text-foreground shadow-2xl outline-none transition-[transform,opacity] duration-200 ease-out data-[starting-style]:translate-x-full data-[starting-style]:opacity-0 data-[ending-style]:translate-x-full data-[ending-style]:opacity-0">
          {/* Header card */}
          <div className="relative overflow-hidden border-b border-border px-5 pt-5 pb-6">
            {cover && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cover}
                alt=""
                className="absolute inset-0 size-full object-cover opacity-30"
              />
            )}
            <div className="pattern-botanical absolute inset-0 bg-gradient-to-b from-blush/55 to-background" />

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
                className="flex size-8 items-center justify-center rounded-full border border-border bg-card/85 text-foreground transition hover:bg-blush"
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
                        ? "bg-primary font-bold text-primary-foreground shadow-sm shadow-primary/15"
                        : "bg-card/80 text-foreground hover:bg-blush/60"
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
          <div className="space-y-2.5 border-t border-border bg-blush/45 p-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex h-11 w-full items-center justify-between rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary/90"
            >
              <span className="flex items-center gap-2">
                <ShoppingCartIcon className="size-4" />
                مشاهده سبد خرید
              </span>
              {cartCount > 0 && (
                <span className="rounded-full bg-primary-foreground px-2 py-0.5 text-xs text-primary">
                  {formatNumber(cartCount)}
                </span>
              )}
            </button>

            <Link
              href="/admin"
              onClick={onClose}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 text-xs font-semibold text-foreground transition hover:bg-blush/60"
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
