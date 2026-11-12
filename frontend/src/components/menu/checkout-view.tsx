"use client";

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
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-background text-foreground"
      role="dialog"
      aria-modal="true"
      aria-label="تکمیل سفارش"
    >
      {/* Top Bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex w-10 items-center justify-start">
            {cartItems.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                title="خالی کردن سبد خرید"
                aria-label="خالی کردن سبد خرید"
                className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-secondary hover:text-destructive"
              >
                <Trash2Icon className="size-4" />
              </button>
            )}
          </div>

          <h1 className="font-display text-xl text-foreground sm:text-2xl">
            تکمیل سفارش
          </h1>

          <div className="flex w-10 items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              aria-label="بازگشت به منو"
              className="flex size-9 items-center justify-center rounded-xl text-foreground transition hover:bg-secondary"
            >
              <ChevronLeftIcon className="size-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-5 pb-12">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card text-primary/50">
              <ShoppingCartIcon className="size-7" />
            </div>
            <h2 className="mt-4 text-base font-bold text-foreground">
              سبد خرید خالی است
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              آیتم‌های مورد علاقه‌ات را از منو اضافه کن.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-11 rounded-full bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary/90"
            >
              بازگشت به منو
            </button>
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
                  <div className="divide-y divide-border/80">
                    {group.items.map((ci) => {
                      const image = resolveImageUrl(ci.imageUrl);
                      return (
                        <div
                          key={ci.itemId}
                          className="flex items-center justify-between gap-3 py-3.5"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-3">
                            <div className="size-14 shrink-0 overflow-hidden rounded-full border-2 border-card bg-muted shadow-xs ring-1 ring-border">
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
                              <p className="mt-1 text-xs font-medium text-primary sm:text-sm">
                                {formatToman(ci.price * ci.qty)}
                              </p>
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <button
                              type="button"
                              onClick={() => setQty(ci.itemId, ci.qty + 1)}
                              aria-label={`افزایش تعداد ${ci.name}`}
                              className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary/90 active:scale-95"
                            >
                              <PlusIcon className="size-4 stroke-[2.5]" />
                            </button>
                            <span className="w-5 text-center text-sm font-bold text-foreground tabular-nums">
                              {formatNumber(ci.qty)}
                            </span>
                            <button
                              type="button"
                              onClick={() => setQty(ci.itemId, ci.qty - 1)}
                              aria-label={`کاهش تعداد ${ci.name}`}
                              className="flex size-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:bg-blush/60 active:scale-95"
                            >
                              <MinusIcon className="size-4 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>

            {/* Summary Box */}
            <div className="mt-6 space-y-3.5 rounded-3xl border border-primary/20 bg-card/95 p-4 shadow-sm shadow-primary/10 sm:p-5">
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

              <div className="flex items-center justify-between border-t border-border pt-3.5">
                <span className="text-base font-bold text-foreground">
                  مبلغ قابل پرداخت
                </span>
                <span className="text-base font-extrabold text-primary sm:text-lg">
                  {formatToman(payableTotal)}
                </span>
              </div>
            </div>

            {/* Staff instruction banner */}
            <div className="mt-4 flex items-center justify-between gap-3 rounded-3xl border border-primary/15 bg-blush/65 p-4 text-center">
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
              <button
                type="button"
                onClick={onClose}
                className="h-11 flex-1 rounded-full bg-primary text-sm font-bold text-primary-foreground shadow-sm shadow-primary/20 transition hover:bg-primary/90"
              >
                بازگشت به منو
              </button>
              <button
                type="button"
                onClick={() => setConfirmClearOpen(true)}
                className="h-11 rounded-full border border-destructive/30 bg-destructive/10 px-5 text-sm font-medium text-destructive transition hover:bg-destructive/20"
              >
                خالی کردن سبد
              </button>
            </div>
          </div>
        )}
      </main>

      <AlertDialog
        open={open && confirmClearOpen}
        onOpenChange={setConfirmClearOpen}
      >
        <AlertDialogContent dir="rtl" className="z-[60] rounded-2xl">
          <AlertDialogHeader className="place-items-start text-right sm:place-items-start sm:text-right">
            <AlertDialogTitle>خالی کردن سبد خرید؟</AlertDialogTitle>
            <AlertDialogDescription>
              تمام آیتم‌های انتخاب‌شده از سبد خرید شما حذف خواهند شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="rounded-b-2xl sm:justify-start">
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
    </div>
  );
}
