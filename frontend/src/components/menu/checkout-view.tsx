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
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background/80 text-foreground backdrop-blur-3xl"
      role="dialog"
      aria-modal="true"
      aria-label="تکمیل سفارش"
    >
      {/* Top Bar with Pure Crystal Glass */}
      <header className="sticky top-0 z-20 glass-header">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex w-10 items-center justify-start">
            {cartItems.length > 0 && (
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setConfirmClearOpen(true)}
                title="خالی کردن سبد خرید"
                aria-label="خالی کردن سبد خرید"
                className="flex size-9 items-center justify-center rounded-xl border border-white/80 bg-white/45 text-muted-foreground backdrop-blur-2xl shadow-xs transition hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive dark:border-white/12 dark:bg-white/10"
              >
                <Trash2Icon className="size-4" />
              </motion.button>
            )}
          </div>

          <h1 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            تکمیل سفارش
          </h1>

          <div className="flex w-10 items-center justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              aria-label="بازگشت به منو"
              className="flex size-9 items-center justify-center rounded-xl border border-white/80 bg-white/45 text-foreground backdrop-blur-2xl shadow-xs transition hover:border-white hover:bg-white/70 dark:border-white/12 dark:bg-white/10"
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
            <div className="flex size-16 items-center justify-center rounded-2xl border border-white/80 bg-card/75 text-primary/60 backdrop-blur-xl shadow-sm">
              <ShoppingCartIcon className="size-7" />
            </div>
            <h2 className="mt-4 text-base font-bold text-foreground">
              سبد خرید خالی است
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              آیتم‌های مورد علاقه‌ات را از منو اضافه کن.
            </p>
            <motion.button
              type="button"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={onClose}
              className="mt-6 h-11 rounded-full border border-white/50 bg-gradient-to-r from-primary via-[#cf7b24] to-[#a45414] px-6 text-sm font-bold text-primary-foreground shadow-[0_8px_24px_-4px_rgba(184,101,27,0.38)] backdrop-blur-xl transition hover:brightness-105"
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
                  <div className="divide-y divide-border/60">
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
                              <div className="size-14 shrink-0 overflow-hidden rounded-full border-2 border-white/90 bg-muted/60 shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_4px_12px_-2px_rgba(56,30,16,0.1)] ring-1 ring-primary/25">
                                <ItemThumbnail
                                  src={image}
                                  alt={ci.name}
                                  className="size-full"
                                  iconClassName="size-5"
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-bold text-foreground sm:text-base">
                                  {ci.name}
                                </p>
                                <p className="mt-1 text-xs font-semibold text-primary sm:text-sm">
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
                                className="flex size-9 items-center justify-center rounded-full border border-white/50 bg-gradient-to-br from-primary to-[#cf7b24] text-primary-foreground shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.6),0_6px_16px_-2px_rgba(184,101,27,0.35)] backdrop-blur-xl"
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
                                    className="text-center text-sm font-bold text-foreground tabular-nums"
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
                                className="flex size-9 items-center justify-center rounded-full border border-white/70 bg-card/70 text-foreground shadow-xs backdrop-blur-xl transition hover:border-white hover:bg-card/90 dark:border-white/12 dark:bg-card/65"
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

            {/* Summary Box with Frosted Crystal Glass */}
            <div className="mt-6 space-y-3.5 rounded-3xl glass-crystal p-4 sm:p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">تعداد اقلام سبد</span>
                <span className="font-semibold text-foreground">
                  {formatNumber(count)} عدد
                </span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">مجموع سفارش</span>
                <span className="font-semibold text-foreground">
                  {formatToman(total)}
                </span>
              </div>

              {taxPercent > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">مالیات</span>
                  <span className="font-semibold text-foreground">
                    {formatToman(taxAmount)}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between border-t border-border/80 pt-3.5">
                <span className="text-base font-bold text-foreground">
                  مبلغ قابل پرداخت
                </span>
                <motion.span
                  key={payableTotal}
                  initial={{ opacity: 0.8, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-base font-extrabold text-primary sm:text-lg"
                >
                  {formatToman(payableTotal)}
                </motion.span>
              </div>
            </div>

            {/* Staff instruction banner */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl border border-white/85 bg-white/45 p-4 text-center backdrop-blur-2xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_6px_18px_rgba(56,30,16,0.04)] dark:border-white/12 dark:bg-white/10">
              <span className="shrink-0 text-xs text-primary" aria-hidden="true">
                ♥
              </span>
              <p className="text-xs leading-6 text-secondary-foreground sm:text-sm">
                لطفاً سفارش خود را به متصدی ثبت سفارش و یا صندوق مجموعه اطلاع
                دهید.
              </p>
              <span className="shrink-0 text-xs text-primary" aria-hidden="true">
                ♥
              </span>
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              <motion.button
                type="button"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="h-11 flex-1 rounded-full border border-white/50 bg-gradient-to-r from-primary via-[#cf7b24] to-[#a45414] text-sm font-bold text-primary-foreground shadow-[0_8px_24px_-4px_rgba(184,101,27,0.35)] backdrop-blur-xl transition hover:brightness-105"
              >
                بازگشت به منو
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setConfirmClearOpen(true)}
                className="h-11 rounded-full border border-destructive/35 bg-destructive/10 px-5 text-sm font-medium text-destructive backdrop-blur-md transition hover:bg-destructive/20"
              >
                خالی کردن سبد
              </motion.button>
            </div>
          </div>
        )}
      </main>

      <AlertDialog
        open={open && confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
      >
        <AlertDialogContent dir="rtl" className="z-[60] rounded-3xl">
          <AlertDialogHeader className="place-items-start text-right sm:place-items-start sm:text-right">
            <AlertDialogTitle>خالی کردن سبد خرید؟</AlertDialogTitle>
            <AlertDialogDescription>
              تمام آیتم‌های انتخاب‌شده از سبد خرید شما حذف خواهند شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="rounded-b-3xl sm:justify-start">
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
