"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import {
  MapPinIcon,
  SettingsIcon,
  ShoppingCartIcon,
  XIcon,
} from "lucide-react";
import { Link } from "@/lib/navigation";

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
        <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col border-l border-white/15 bg-[#120e0b]/90 text-white shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2),0_24px_60px_rgba(0,0,0,0.85)] backdrop-blur-3xl outline-none transition-[transform,opacity] duration-200 ease-out data-[starting-style]:translate-x-full data-[starting-style]:opacity-0 data-[ending-style]:translate-x-full data-[ending-style]:opacity-0">
          {/* Header card */}
          <div className="relative overflow-hidden border-b border-white/10 px-5 pt-5 pb-6">
            {cover && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cover}
                alt=""
                className="absolute inset-0 size-full object-cover opacity-25"
              />
            )}
            <div className="pattern-botanical absolute inset-0 opacity-15 bg-gradient-to-b from-black/60 to-black/80" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CafeLogo className="size-12" />
                <div>
                  <DialogPrimitive.Title className="font-heading text-xl font-bold text-[#fbf8f1]">
                    کافه عمارت طاق
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="font-traditional mt-0.5 text-xs text-amber-200/80">
                    طعم‌های اصیل و سنتی دیار بادگیرها
                  </DialogPrimitive.Description>
                </div>
              </div>
              <DialogPrimitive.Close
                aria-label="بستن منو"
                className="flex size-8 items-center justify-center rounded-full border border-amber-400/30 bg-[#121b27]/80 text-amber-200 shadow-xs backdrop-blur-2xl transition hover:border-amber-400/60 hover:text-white"
              >
                <XIcon className="size-4" />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Categories navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-2.5 px-2 text-xs font-semibold text-stone-400">
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
                        ? "border border-white/30 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 font-black text-stone-950 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_8px_20px_rgba(245,158,11,0.4)] backdrop-blur-2xl"
                        : "border border-white/12 bg-white/[0.05] text-stone-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] backdrop-blur-xl hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {Icon && <Icon className="size-4 text-amber-400" />}
                      {cat.name}
                    </span>
                    {cat.nameEn && (
                      <span
                        className={`font-serif-en text-xs italic ${
                          isActive
                            ? "text-stone-900/90 font-bold"
                            : "text-amber-200/60"
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
          <div className="space-y-2.5 border-t border-white/10 bg-black/50 p-4 backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex h-11 w-full items-center justify-between rounded-full border border-amber-400/40 bg-gradient-to-r from-[#172333] via-[#0e1724] to-[#172333] px-4 text-sm font-bold text-amber-100 shadow-[inset_0_1.5px_1px_rgba(229,170,56,0.25),0_8px_24px_rgba(0,0,0,0.6)] ring-1 ring-teal-500/20 backdrop-blur-md transition hover:border-amber-400/70 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShoppingCartIcon className="size-4 text-amber-300" />
                <span className="font-heading">مشاهده سینی سفارش‌ها</span>
              </span>
              {cartCount > 0 && (
                <span className="rounded-full border border-amber-300/40 bg-amber-500 px-2 py-0.5 text-xs font-black text-stone-950 shadow-xs">
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
