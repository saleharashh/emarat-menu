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
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-[#583101]/30 backdrop-blur-sm transition-opacity duration-200 ease-out data-[starting-style]:opacity-0 data-[ending-style]:opacity-0" />
        <DialogPrimitive.Popup className="fixed inset-y-0 right-0 z-50 flex w-80 max-w-[85vw] flex-col border-l border-[#E7BC91] bg-[#FFFDF9]/95 text-[#583101] shadow-[-12px_0_36px_rgba(88,49,1,0.15)] backdrop-blur-3xl outline-none transition-[transform,opacity] duration-200 ease-out data-[starting-style]:translate-x-full data-[starting-style]:opacity-0 data-[ending-style]:translate-x-full data-[ending-style]:opacity-0">
          {/* Header card */}
          <div className="relative overflow-hidden border-b border-[#E7BC91]/40 bg-[#F3D5B5]/30 px-5 pt-5 pb-6">
            {cover && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={cover}
                alt=""
                className="absolute inset-0 size-full object-cover opacity-20"
              />
            )}
            <div className="pattern-botanical absolute inset-0 opacity-15" />

            <div className="relative flex items-start justify-between">
              <div className="flex items-center gap-3">
                <CafeLogo className="size-12" />
                <div>
                  <DialogPrimitive.Title className="font-heading text-xl font-bold text-[#583101]">
                    کافه عمارت طاق
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="font-traditional mt-0.5 text-xs text-[#8B5E34]">
                    طعم‌های اصیل و سنتی دیار بادگیرها
                  </DialogPrimitive.Description>
                </div>
              </div>
              <DialogPrimitive.Close
                aria-label="بستن منو"
                className="flex size-8 items-center justify-center rounded-full border border-[#E7BC91] bg-white/80 text-[#6F4518] shadow-xs backdrop-blur-md transition hover:border-[#8B5E34] hover:bg-white hover:text-[#583101]"
              >
                <XIcon className="size-4" />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Categories navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <p className="mb-2.5 px-2 text-xs font-semibold text-[#8B5E34]">
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
                        ? "border border-[#8B5E34] bg-gradient-to-r from-[#8B5E34] via-[#6F4518] to-[#583101] font-bold text-[#FFEDD8] shadow-[0_4px_16px_rgba(88,49,1,0.22)] backdrop-blur-2xl"
                        : "border border-[#E7BC91]/70 bg-white/80 text-[#583101] shadow-xs backdrop-blur-md hover:border-[#8B5E34] hover:bg-white"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {Icon && <Icon className={`size-4 ${isActive ? "text-[#F3D5B5]" : "text-[#8B5E34]"}`} />}
                      {cat.name}
                    </span>
                    {cat.nameEn && (
                      <span
                        className={`font-serif-en text-xs italic ${
                          isActive
                            ? "text-[#FFEDD8]/90 font-bold"
                            : "text-[#A47148]"
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
          <div className="space-y-2.5 border-t border-[#E7BC91]/60 bg-[#F3D5B5]/30 p-4 backdrop-blur-2xl">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenCart();
              }}
              className="flex h-11 w-full items-center justify-between rounded-full border border-[#8B5E34] bg-gradient-to-r from-[#6F4518] to-[#583101] px-4 text-sm font-bold text-[#FFEDD8] shadow-[0_4px_16px_rgba(88,49,1,0.22)] backdrop-blur-md transition hover:opacity-95 cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShoppingCartIcon className="size-4 text-[#F3D5B5]" />
                <span className="font-heading">مشاهده سینی سفارش‌ها</span>
              </span>
              {cartCount > 0 && (
                <span className="rounded-full border border-[#D4A276] bg-[#FFEDD8] px-2 py-0.5 text-xs font-black text-[#583101] shadow-xs">
                  {formatNumber(cartCount)}
                </span>
              )}
            </button>

            <Link
              href="/admin"
              onClick={onClose}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full border border-[#E7BC91] bg-white/85 px-4 text-xs font-semibold text-[#583101] shadow-xs backdrop-blur-md transition hover:border-[#8B5E34] hover:bg-white"
            >
              <SettingsIcon className="size-3.5" />
              پنل مدیریت منو
            </Link>

            <div className="flex items-center justify-center gap-1.5 pt-1 text-xs text-[#8B5E34]">
              <MapPinIcon className="size-3.5" />
              یزد، بافت تاریخی شهر
            </div>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
