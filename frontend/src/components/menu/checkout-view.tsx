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
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-[#090e15]/95 text-foreground backdrop-blur-3xl"
      role="dialog"
      aria-modal="true"
      aria-label="سینی سفارش‌های عمارت"
    >
      {/* Top Bar with Persian Haveli Styling */}
      <header className="sticky top-0 z-20 border-b border-amber-400/20 bg-[#090e15]/90 backdrop-blur-2xl">
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
                className="flex size-9 items-center justify-center rounded-xl border border-amber-400/20 bg-[#141d2a]/80 text-amber-200/70 backdrop-blur-2xl shadow-xs transition hover:border-red-400/50 hover:bg-red-500/20 hover:text-red-300 cursor-pointer"
              >
                <Trash2Icon className="size-4" />
              </motion.button>
            )}
          </div>

          <h1 className="font-heading text-xl font-bold text-[#fbf8f1] sm:text-2xl drop-shadow-sm">
            سینی سفارش‌های عمارت
          </h1>

          <div className="flex w-10 items-center justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="بازگشت به منو"
              className="flex size-9 items-center justify-center rounded-xl border border-amber-400/30 bg-[#121b27]/80 text-amber-200 backdrop-blur-2xl shadow-xs transition hover:border-amber-400/60 hover:text-white cursor-pointer"
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
            <div className="flex size-16 items-center justify-center rounded-2xl border border-amber-400/30 bg-[#121b27]/80 text-amber-400 backdrop-blur-xl shadow-lg ring-1 ring-teal-500/20">
              <ShoppingCartIcon className="size-7" />
            </div>
            <h2 className="font-heading mt-4 text-lg font-bold text-[#fbf8f1]">
              سینی سفارش خالی است
            </h2>
            <p className="font-traditional mt-1.5 text-sm text-[#b8ab9b]">
              لطفاً نوشیدنی‌ها یا طعم‌های سنتی دلخواهتان را از منو انتخاب کنید.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="mt-6 h-11 rounded-full border border-amber-300/40 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] px-7 text-sm font-black text-stone-950 shadow-[0_8px_20px_rgba(229,170,56,0.3)] backdrop-blur-xl transition hover:brightness-105 cursor-pointer"
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
                  <div className="divide-y divide-amber-400/15">
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
                              <div className="h-14 w-12 shrink-0 overflow-hidden rounded-t-xl rounded-b-md border border-amber-400/40 bg-[#0c121a] shadow-[inset_0_1px_1px_rgba(229,170,56,0.2),0_4px_14px_rgba(0,0,0,0.6)] ring-1 ring-teal-500/20">
                                <ItemThumbnail
                                  src={image}
                                  alt={ci.name}
                                  className="size-full"
                                  iconClassName="size-5"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-heading truncate text-base font-bold text-[#fbf8f1]">
                                  {ci.name}
                                </p>
                                <p className="mt-1 text-xs font-black text-[#fcd34d] sm:text-sm">
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
                                className="flex size-9 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-[#d97706] to-[#b45309] text-stone-950 shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_6px_16px_rgba(229,170,56,0.35)] backdrop-blur-xl cursor-pointer"
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
                                    className="text-center text-sm font-black text-amber-200 tabular-nums"
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
                                className="flex size-9 items-center justify-center rounded-full border border-amber-400/25 bg-[#141e2a]/80 text-amber-200 shadow-xs backdrop-blur-xl transition hover:border-amber-400/50 hover:bg-[#1a2737] cursor-pointer"
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
            <div className="mt-6 space-y-3.5 rounded-[28px] border border-amber-400/30 bg-gradient-to-b from-[#151f2c]/85 via-[#0f1722]/85 to-[#0b1018]/90 p-4 sm:p-5 shadow-[inset_0_1.5px_2px_rgba(229,170,56,0.15),0_12px_32px_rgba(0,0,0,0.7)] ring-1 ring-teal-500/20">
              <div className="flex items-center justify-between text-sm">
                <span className="font-traditional text-stone-300">تعداد اقلام سفارش</span>
                <span className="font-semibold text-amber-200">
                  {formatNumber(count)} عدد
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="font-traditional text-stone-300">جمع کل سفارش‌ها</span>
                <span className="font-semibold text-white">
                  {formatToman(total)}
                </span>
              </div>

              {taxPercent > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="font-traditional text-stone-300">مالیات و عوارض قانونی</span>
                  <span className="font-semibold text-white">
                    {formatToman(taxAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-amber-400/20 pt-3.5">
                <span className="font-heading text-base font-bold text-amber-100">
                  مبلغ نهایی قابل پرداخت
                </span>
                <motion.span
                  key={payableTotal}
                  initial={{ opacity: 0.8, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-lg font-black text-[#fcd34d] sm:text-xl drop-shadow-[0_2px_8px_rgba(229,170,56,0.3)]"
                >
                  {formatToman(payableTotal)}
                </motion.span>
              </div>
            </div>

            {/* Staff instruction banner with Persian Courtesy */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-[#172230]/80 via-[#101925]/80 to-[#172230]/80 p-4 text-center backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.08)]">
              <span className="shrink-0 text-xs text-amber-400" aria-hidden="true">
                ✦
              </span>
              <p className="font-traditional text-xs leading-6 text-amber-100/90 sm:text-sm">
                لطفاً شماره میز و سفارش خود را به مهمان‌دار یا صندوق عمارت اطلاع دهید • نوش جان و گوارای وجود
              </p>
              <span className="shrink-0 text-xs text-amber-400" aria-hidden="true">
                ✦
              </span>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="h-11 flex-1 rounded-full border border-amber-300/40 bg-gradient-to-r from-[#d97706] via-[#f59e0b] to-[#d97706] text-sm font-black text-stone-950 shadow-[0_8px_20px_rgba(229,170,56,0.3)] backdrop-blur-xl transition hover:brightness-105 cursor-pointer"
              >
                بازگشت به منو
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConfirmClearOpen(true)}
                className="h-11 rounded-full border border-red-500/40 bg-red-500/15 px-5 text-sm font-medium text-red-300 backdrop-blur-md transition hover:bg-red-500/25 cursor-pointer"
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
        <AlertDialogContent dir="rtl" className="z-[60] rounded-[28px] border border-amber-400/35 bg-[#0e1622]/95 backdrop-blur-2xl">
          <AlertDialogHeader className="place-items-start text-right sm:place-items-start sm:text-right">
            <AlertDialogTitle className="font-heading text-lg text-white">خالی کردن سینی سفارش؟</AlertDialogTitle>
            <AlertDialogDescription className="font-traditional text-stone-300">
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
