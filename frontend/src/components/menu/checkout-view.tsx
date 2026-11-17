"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  ChevronLeftIcon,
  MinusIcon,
  PlusIcon,
  ShoppingCartIcon,
  Trash2Icon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { useCart, type CartItem } from "@/components/cart-provider";
import {
  ItemThumbnail,
  SectionDivider,
} from "@/components/menu/menu-item-cards";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { resolveImageUrl } from "@/lib/api";
import { formatNumber, formatToman } from "@/lib/format";
import type { Category, MenuItem } from "@/lib/types";

interface CheckoutViewProps {
  open: boolean;
  items: MenuItem[];
  categories: Category[];
  taxPercent: number;
  onClose: () => void;
}

export function CheckoutView({
  open,
  items,
  categories,
  taxPercent,
  onClose,
}: CheckoutViewProps) {
  const { items: cartItems, count, total, setQty, clear } = useCart();
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !confirmClearOpen) onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, confirmClearOpen, onClose]);

  const itemLookup = useMemo(() => {
    const map = new Map<number, MenuItem>();
    for (const item of items) map.set(item.id, item);
    return map;
  }, [items]);

  const categoryLookup = useMemo(() => {
    const map = new Map<number, Category>();
    for (const cat of categories) map.set(cat.id, cat);
    return map;
  }, [categories]);

  const groupedCart = useMemo(() => {
    const groups = new Map<
      string,
      { title: string; titleEn: string | null; items: CartItem[] }
    >();

    for (const ci of cartItems) {
      const liveItem = itemLookup.get(ci.itemId);
      const catId = liveItem?.categoryId ?? ci.categoryId ?? null;
      const cat = catId ? categoryLookup.get(catId) : liveItem?.category;
      const parentCat = cat?.parentId ? categoryLookup.get(cat.parentId) : null;
      const displayCat = parentCat ?? cat;

      const title =
        displayCat?.name ?? ci.categoryName ?? "سفارش‌های شما";
      const titleEn =
        displayCat?.nameEn ?? ci.categoryNameEn ?? null;
      const key = `${title}::${titleEn ?? ""}`;

      if (!groups.has(key)) {
        groups.set(key, { title, titleEn, items: [] });
      }
      groups.get(key)!.items.push(ci);
    }

    return Array.from(groups.values());
  }, [cartItems, itemLookup, categoryLookup]);

  if (!open) return null;

  const taxAmount =
    taxPercent > 0 ? Math.round((total * taxPercent) / 100) : 0;
  const payableTotal = total + taxAmount;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#FFEDD8]/98 text-foreground backdrop-blur-3xl"
      role="dialog"
      aria-modal="true"
      aria-label="سینی سفارش‌های عمارت"
    >
      {/* Top Bar with Persian Haveli Styling */}
      <header className="sticky top-0 z-20 border-b border-[#E7BC91]/70 bg-[#FFEDD8]/92 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex w-10 items-center justify-start">
            {cartItems.length > 0 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setConfirmClearOpen(true)}
                title="خالی کردن سینی"
                aria-label="خالی کردن سینی سفارش"
                className="flex size-9 items-center justify-center rounded-xl border border-[#D4A276]/40 bg-[#FFFFFF]/85 text-[#6F4518] backdrop-blur-2xl shadow-xs transition hover:border-red-400 hover:bg-red-50 hover:text-red-600 cursor-pointer"
              >
                <Trash2Icon className="size-4" />
              </motion.button>
            )}
          </div>

          <h1 className="font-heading text-xl font-bold text-[#583101] sm:text-2xl drop-shadow-xs">
            سینی سفارش‌های عمارت
          </h1>

          <div className="flex w-10 items-center justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="بازگشت به منو"
              className="flex size-9 items-center justify-center rounded-xl border border-[#D4A276]/40 bg-[#FFFFFF]/85 text-[#6F4518] backdrop-blur-2xl shadow-xs transition hover:border-[#BC8A5F] hover:bg-[#F3D5B5]/60 hover:text-[#583101] cursor-pointer"
            >
              <ChevronLeftIcon className="size-6" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 pb-12">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-[#E7BC91] bg-[#FFFFFF] text-[#8B5E34] backdrop-blur-xl shadow-md ring-1 ring-[#D4A276]/20">
              <ShoppingCartIcon className="size-7" />
            </div>
            <h2 className="font-heading mt-4 text-lg font-bold text-[#583101]">
              سینی سفارش خالی است
            </h2>
            <p className="font-traditional mt-1.5 text-sm text-[#8B5E34]">
              لطفاً نوشیدنی‌ها یا طعم‌های سنتی دلخواهتان را از منو انتخاب کنید.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="mt-6 h-11 rounded-full border border-[#BC8A5F]/50 bg-gradient-to-r from-[#8B5E34] via-[#6F4518] to-[#8B5E34] px-7 text-sm font-black text-[#FFEDD8] shadow-[0_8px_20px_rgba(88,49,1,0.22)] backdrop-blur-xl transition hover:brightness-105 cursor-pointer"
            >
              بازگشت به منو
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Grouped Cart Items */}
            <div className="flex flex-col gap-2">
              {groupedCart.map((group) => (
                <section key={`${group.title}-${group.titleEn ?? ""}`}>
                  <SectionDivider
                    title={group.title}
                    subtitleEn={group.titleEn}
                  />
                  <div className="divide-y divide-[#E7BC91]/40">
                    <AnimatePresence initial={false}>
                      {group.items.map((ci) => {
                        const image = resolveImageUrl(ci.imageUrl);
                        return (
                          <motion.div
                            key={ci.itemId}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                            transition={{ duration: 0.22 }}
                            className="flex items-center justify-between gap-3 py-3.5"
                          >
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              {/* Arched image */}
                              <div className="h-14 w-12 shrink-0 overflow-hidden rounded-t-xl rounded-b-md border border-[#E7BC91] bg-[#F3D5B5]/40 shadow-xs ring-1 ring-[#D4A276]/30">
                                <ItemThumbnail
                                  src={image}
                                  alt={ci.name}
                                  className="size-full"
                                  iconClassName="size-5"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-heading truncate text-base font-bold text-[#583101]">
                                  {ci.name}
                                </p>
                                <p className="mt-1 text-xs font-black text-[#6F4518] sm:text-sm">
                                  {formatToman(ci.price * ci.qty)}
                                </p>
                              </div>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => setQty(ci.itemId, ci.qty + 1)}
                                aria-label={`افزایش تعداد ${ci.name}`}
                                className="flex size-9 items-center justify-center rounded-full border border-[#BC8A5F]/50 bg-gradient-to-br from-[#8B5E34] to-[#6F4518] text-[#FFEDD8] shadow-[0_4px_14px_rgba(88,49,1,0.2)] backdrop-blur-xl cursor-pointer"
                              >
                                <PlusIcon className="size-4 stroke-[2.5]" />
                              </motion.button>
                              <div className="relative w-5 flex items-center justify-center overflow-hidden">
                                <AnimatePresence mode="popLayout" initial={false}>
                                  <motion.span
                                    key={ci.qty}
                                    initial={{ y: 8, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -8, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="text-center text-sm font-black text-[#583101] tabular-nums"
                                  >
                                    {formatNumber(ci.qty)}
                                  </motion.span>
                                </AnimatePresence>
                              </div>
                              <motion.button
                                type="button"
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.85 }}
                                onClick={() => setQty(ci.itemId, ci.qty - 1)}
                                aria-label={`کاهش تعداد ${ci.name}`}
                                className="flex size-9 items-center justify-center rounded-full border border-[#D4A276]/40 bg-[#FFFFFF]/85 text-[#6F4518] shadow-xs backdrop-blur-xl transition hover:border-[#BC8A5F] hover:bg-[#F3D5B5]/60 cursor-pointer"
                              >
                                <MinusIcon className="size-4 stroke-[2.5]" />
                              </motion.button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </section>
              ))}
            </div>

            {/* Summary Box with Persian Gilded Style */}
            <div className="mt-6 space-y-3.5 rounded-[28px] border border-[#E7BC91] bg-[#FFFFFF]/90 p-4 sm:p-5 shadow-[0_8px_24px_rgba(88,49,1,0.06)] ring-1 ring-[#D4A276]/20">
              <div className="flex items-center justify-between text-sm">
                <span className="font-traditional text-[#8B5E34]">تعداد اقلام سفارش</span>
                <span className="font-semibold text-[#583101]">
                  {formatNumber(count)} عدد
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-traditional text-[#8B5E34]">جمع کل سفارش‌ها</span>
                <span className="font-semibold text-[#583101]">
                  {formatToman(total)}
                </span>
              </div>

              {taxPercent > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="font-traditional text-[#8B5E34]">مالیات و عوارض قانونی</span>
                  <span className="font-semibold text-[#583101]">
                    {formatToman(taxAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-[#E7BC91]/50 pt-3.5">
                <span className="font-heading text-base font-bold text-[#583101]">
                  مبلغ نهایی قابل پرداخت
                </span>
                <motion.span
                  key={payableTotal}
                  initial={{ opacity: 0.8, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-black text-[#6F4518] sm:text-xl drop-shadow-xs"
                >
                  {formatToman(payableTotal)}
                </motion.span>
              </div>
            </div>

            {/* Staff instruction banner with Persian Courtesy */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-[#E7BC91] bg-[#FFF9F2] p-4 text-center backdrop-blur-xl shadow-xs">
              <span className="shrink-0 text-xs text-[#8B5E34]" aria-hidden="true">
                ✦
              </span>
              <p className="font-traditional text-xs leading-6 text-[#6F4518] sm:text-sm">
                لطفاً شماره میز و سفارش خود را به مهمان‌دار یا صندوق عمارت اطلاع دهید • نوش جان و گوارای وجود
              </p>
              <span className="shrink-0 text-xs text-[#8B5E34]" aria-hidden="true">
                ✦
              </span>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="h-11 flex-1 rounded-full border border-[#BC8A5F]/50 bg-gradient-to-r from-[#8B5E34] via-[#6F4518] to-[#8B5E34] text-sm font-black text-[#FFEDD8] shadow-[0_8px_20px_rgba(88,49,1,0.22)] backdrop-blur-xl transition hover:brightness-105 cursor-pointer"
              >
                بازگشت به منو
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConfirmClearOpen(true)}
                className="h-11 rounded-full border border-red-500/40 bg-red-50 px-5 text-sm font-medium text-red-600 backdrop-blur-md transition hover:bg-red-100 cursor-pointer"
              >
                خالی کردن سینی
              </motion.button>
            </div>
          </div>
        )}
      </main>

      <AlertDialog
        open={open && confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
      >
        <AlertDialogContent dir="rtl" className="z-[60] rounded-[28px] border border-[#E7BC91] bg-[#FFFDF9] backdrop-blur-2xl">
          <AlertDialogHeader className="place-items-start text-right sm:place-items-start sm:text-right">
            <AlertDialogTitle className="font-heading text-lg text-[#583101]">خالی کردن سینی سفارش؟</AlertDialogTitle>
            <AlertDialogDescription className="font-traditional text-[#8B5E34]">
              تمام آیتم‌های انتخاب‌شده از سینی سفارش شما حذف خواهند شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="rounded-b-[28px] sm:justify-start">
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                clear();
                setConfirmClearOpen(false);
              }}
            >
              بله، خالی شود
            </AlertDialogAction>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
}
