"use client";

import { motion, AnimatePresence } from "motion/react";
import { ChevronLeftIcon, CoffeeIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";

import { useCart } from "@/components/cart-provider";
import { CafeLogo } from "@/components/menu/cafe-logo";
import { CategoryStrip } from "@/components/menu/category-strip";
import { CheckoutView } from "@/components/menu/checkout-view";
import { ItemDetailDialog } from "@/components/menu/item-detail-dialog";
import {
  CompactItemCard,
  FeaturedItemCard,
  SectionDivider,
} from "@/components/menu/menu-item-cards";
import {
  useCategorySwipe,
  type SwipeDirection,
} from "@/hooks/use-category-swipe";
import { resolveImageUrl } from "@/lib/api";
import { formatNumber, formatToman } from "@/lib/format";
import type { Category, MenuItem, SiteSettings } from "@/lib/types";

interface NavStep {
  topCategoryId: number;
  subcategoryId: number | null;
}

interface OutgoingLayerSnapshot {
  key: number;
  direction: SwipeDirection;
  startX: number;
  title: string;
  titleEn: string | null;
  hasHeader: boolean;
  items: MenuItem[];
}

const TRANSITION_CLEANUP_MS = 520;

interface MenuExplorerProps {
  categories: Category[];
  items: MenuItem[];
  settings: SiteSettings | null;
}

export function MenuExplorer({
  categories,
  items,
  settings,
}: MenuExplorerProps) {
  const { items: cartItems, count, total, add, setQty } = useCart();

  const topCategories = useMemo(() => {
    const parents = categories.filter((c) => !c.parentId);
    return parents.length > 0 ? parents : categories;
  }, [categories]);

  const [activeTopCategoryId, setActiveTopCategoryId] = useState<number | null>(
    () => topCategories[0]?.id ?? null,
  );
  const [activeSubcategoryId, setActiveSubcategoryId] = useState<number | null>(
    null,
  );
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const subcategories = useMemo(() => {
    if (!activeTopCategoryId) return [];
    return categories.filter((c) => c.parentId === activeTopCategoryId);
  }, [categories, activeTopCategoryId]);

  const effectiveSubcategoryId = useMemo(() => {
    if (subcategories.length === 0) return null;
    return subcategories.some((s) => s.id === activeSubcategoryId)
      ? activeSubcategoryId
      : subcategories[0].id;
  }, [subcategories, activeSubcategoryId]);

  const qtyById = useMemo(() => {
    const map = new Map<number, number>();
    for (const ci of cartItems) map.set(ci.itemId, ci.qty);
    return map;
  }, [cartItems]);

  // Compute cover image for each top-level category (explicit imageUrl or first item photo)
  const categoryImages = useMemo(() => {
    const map: Record<number, string | null> = {};
    for (const cat of topCategories) {
      const explicit = resolveImageUrl(cat.imageUrl);
      if (explicit) {
        map[cat.id] = explicit;
        continue;
      }
      const childIds = new Set(
        categories.filter((c) => c.parentId === cat.id).map((c) => c.id),
      );
      const firstWithImage = items.find(
        (item) =>
          item.imageUrl &&
          (item.categoryId === cat.id ||
            (item.categoryId !== null && childIds.has(item.categoryId))),
      );
      map[cat.id] = resolveImageUrl(firstWithImage?.imageUrl);
    }
    return map;
  }, [topCategories, categories, items]);

  const hasExplicitFeatured = useMemo(
    () => items.some((i) => i.isFeatured),
    [items],
  );

  const activeTopCategory = useMemo(
    () => topCategories.find((c) => c.id === activeTopCategoryId) ?? null,
    [topCategories, activeTopCategoryId],
  );

  const activeSubcategory = useMemo(
    () => subcategories.find((c) => c.id === effectiveSubcategoryId) ?? null,
    [subcategories, effectiveSubcategoryId],
  );

  const visibleItems = useMemo(() => {
    let filtered: MenuItem[];

    if (effectiveSubcategoryId !== null) {
      filtered = items.filter(
        (item) => item.categoryId === effectiveSubcategoryId,
      );
    } else if (activeTopCategoryId !== null) {
      const childIds = new Set(subcategories.map((s) => s.id));
      filtered = items.filter(
        (item) =>
          item.categoryId === activeTopCategoryId ||
          (item.categoryId !== null && childIds.has(item.categoryId)),
      );
    } else {
      filtered = items;
    }

    // Place featured items first within the section
    return [...filtered].sort((a, b) => {
      const aFeat = a.isFeatured ? 1 : 0;
      const bFeat = b.isFeatured ? 1 : 0;
      if (aFeat !== bFeat) return bFeat - aFeat;
      return a.sort - b.sort || a.id - b.id;
    });
  }, [items, effectiveSubcategoryId, activeTopCategoryId, subcategories]);

  function isItemFeatured(item: MenuItem, index: number): boolean {
    if (hasExplicitFeatured) return Boolean(item.isFeatured);
    // Fallback when no item in DB has isFeatured set yet: showcase first item
    return index === 0;
  }

  const navSteps = useMemo<NavStep[]>(() => {
    const steps: NavStep[] = [];
    for (const topCat of topCategories) {
      const children = categories.filter((c) => c.parentId === topCat.id);
      if (children.length > 0) {
        for (const child of children) {
          steps.push({ topCategoryId: topCat.id, subcategoryId: child.id });
        }
      } else {
        steps.push({ topCategoryId: topCat.id, subcategoryId: null });
      }
    }
    return steps;
  }, [topCategories, categories]);

  const currentStepIndex = useMemo(() => {
    if (activeTopCategoryId === null) return -1;
    return navSteps.findIndex(
      (step) =>
        step.topCategoryId === activeTopCategoryId &&
        step.subcategoryId === effectiveSubcategoryId,
    );
  }, [navSteps, activeTopCategoryId, effectiveSubcategoryId]);

  const [stepAnimation, setStepAnimation] = useState<{
    key: number;
    direction: SwipeDirection | null;
  }>({ key: 0, direction: null });
  const [outgoingLayer, setOutgoingLayer] =
    useState<OutgoingLayerSnapshot | null>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const listStageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const sectionTitle = activeSubcategory?.name ?? activeTopCategory?.name ?? "منو";
  const sectionTitleEn =
    activeSubcategory?.nameEn ?? activeTopCategory?.nameEn ?? null;

  const navigateToStep = useCallback(
    (
      targetTopId: number,
      targetSubId?: number | null,
      explicitDirection?: SwipeDirection,
      startX = 0,
    ) => {
      const resolvedSubId =
        targetSubId !== undefined
          ? targetSubId
          : (categories.find((c) => c.parentId === targetTopId)?.id ?? null);

      if (
        targetTopId === activeTopCategoryId &&
        resolvedSubId === effectiveSubcategoryId
      ) {
        return;
      }

      const targetIndex = navSteps.findIndex(
        (step) =>
          step.topCategoryId === targetTopId &&
          step.subcategoryId === resolvedSubId,
      );
      const direction: SwipeDirection =
        explicitDirection ??
        (currentStepIndex !== -1 &&
        targetIndex !== -1 &&
        targetIndex < currentStepIndex
          ? "prev"
          : "next");

      const nextKey = stepAnimation.key + 1;
      setOutgoingLayer({
        key: nextKey,
        direction,
        startX,
        title: sectionTitle,
        titleEn: sectionTitleEn,
        hasHeader: Boolean(activeTopCategory),
        items: visibleItems,
      });
      setStepAnimation({ key: nextKey, direction });

      if (transitionTimerRef.current !== null) {
        window.clearTimeout(transitionTimerRef.current);
      }
      transitionTimerRef.current = window.setTimeout(() => {
        setOutgoingLayer(null);
        transitionTimerRef.current = null;
      }, TRANSITION_CLEANUP_MS);

      setActiveTopCategoryId(targetTopId);
      setActiveSubcategoryId(resolvedSubId);

      // Keep the newly switched category header visible when user had scrolled down.
      const stageTop = listStageRef.current?.getBoundingClientRect().top;
      if (stageTop !== undefined && stageTop < 68) {
        window.scrollBy({ top: stageTop - 72, behavior: "smooth" });
      }
    },
    [
      categories,
      activeTopCategoryId,
      effectiveSubcategoryId,
      navSteps,
      currentStepIndex,
      stepAnimation.key,
      sectionTitle,
      sectionTitleEn,
      activeTopCategory,
      visibleItems,
    ],
  );

  const handleSwipeStep = useCallback(
    (direction: SwipeDirection, startOffsetX: number) => {
      if (currentStepIndex === -1) return;
      const nextIndex =
        direction === "next" ? currentStepIndex + 1 : currentStepIndex - 1;
      if (nextIndex < 0 || nextIndex >= navSteps.length) return;
      const target = navSteps[nextIndex];
      navigateToStep(
        target.topCategoryId,
        target.subcategoryId,
        direction,
        startOffsetX,
      );
    },
    [currentStepIndex, navSteps, navigateToStep],
  );

  const canGoNext =
    currentStepIndex !== -1 && currentStepIndex < navSteps.length - 1;
  const canGoPrev = currentStepIndex > 0;
  const swipeDisabled =
    navSteps.length <= 1 || selectedItem !== null || cartOpen;

  const { dragX, isDragging, swipeHandlers } = useCategorySwipe({
    disabled: swipeDisabled,
    canGoNext,
    canGoPrev,
    onSwipeStep: handleSwipeStep,
  });

  function handleSelectTopCategory(catId: number) {
    navigateToStep(catId);
  }

  function handleSelectSubcategory(subId: number) {
    if (activeTopCategoryId === null) return;
    navigateToStep(activeTopCategoryId, subId);
  }

  function handleHeaderBack() {
    if (topCategories[0] && activeTopCategoryId !== topCategories[0].id) {
      navigateToStep(topCategories[0].id, undefined, "prev");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const taxPercent = settings?.taxPercent ?? 10;

  function renderSectionContent({
    title,
    titleEn,
    showHeader,
    sectionItems,
    animClass,
    interactive,
  }: {
    title: string;
    titleEn: string | null;
    showHeader: boolean;
    sectionItems: MenuItem[];
    animClass: string;
    interactive: boolean;
  }) {
    return (
      <>
        {showHeader && (
          <div
            className={animClass || undefined}
            style={{ "--stagger-index": 0 } as CSSProperties}
          >
            <SectionDivider title={title} subtitleEn={titleEn} />
          </div>
        )}

        {sectionItems.length === 0 ? (
          <div
            className={`flex flex-col items-center justify-center rounded-3xl glass-crystal py-16 text-center ${animClass}`}
            style={{ "--stagger-index": 0 } as CSSProperties}
          >
            <CoffeeIcon className="size-10 text-primary/60" />
            <p className="mt-3 text-sm font-bold text-foreground">
              آیتمی یافت نشد
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              هنوز آیتمی در این دسته‌بندی ثبت نشده است.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {sectionItems.map((item, idx) => {
              const qty = qtyById.get(item.id) ?? 0;
              const featured = isItemFeatured(item, idx);
              const CardComponent = featured
                ? FeaturedItemCard
                : CompactItemCard;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.32,
                    delay: Math.min(idx * 0.035, 0.25),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={animClass || undefined}
                  style={
                    {
                      "--stagger-index": Math.min(idx, 6),
                      ...(idx > 3
                        ? {
                            contentVisibility: "auto",
                            containIntrinsicSize: "0 130px",
                          }
                        : {}),
                    } as CSSProperties
                  }
                >
                  <CardComponent
                    item={item}
                    qty={qty}
                    onSelect={
                      interactive ? () => setSelectedItem(item) : () => {}
                    }
                    onAdd={interactive ? () => add(item) : () => {}}
                    onDecrease={
                      interactive ? () => setQty(item.id, qty - 1) : () => {}
                    }
                    onIncrease={
                      interactive ? () => setQty(item.id, qty + 1) : () => {}
                    }
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </>
    );
  }

  const incomingAnimClass = stepAnimation.direction
    ? stepAnimation.direction === "next"
      ? "animate-menu-in-left"
      : "animate-menu-in-right"
    : "";

  const outgoingAnimClass = outgoingLayer
    ? outgoingLayer.direction === "next"
      ? "animate-menu-out-right"
      : "animate-menu-out-left"
    : "";

  return (
    <>
      {/* Sticky Top Header with Persian Arch Heritage */}
      <header className="sticky top-0 z-30 border-b border-amber-400/20 bg-[#090e15]/85 backdrop-blur-2xl shadow-[0_8px_24px_rgba(0,0,0,0.7)]">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="w-10" aria-hidden="true" />

          <motion.button
            type="button"
            whileHover={{ scale: 1.06, rotate: 2 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="transition cursor-pointer"
            aria-label="نشان عمارت طاق"
          >
            <CafeLogo className="size-12" />
          </motion.button>

          <div className="flex w-10 items-center justify-end">
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleHeaderBack}
              aria-label="بازگشت"
              className="flex size-10 items-center justify-center rounded-full border border-amber-400/30 bg-[#121b27]/80 text-amber-200 backdrop-blur-2xl shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.15),0_8px_20px_rgba(0,0,0,0.6)] transition hover:border-amber-400/60 hover:text-white cursor-pointer"
            >
              <ChevronLeftIcon className="size-6" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main
        className={`mx-auto w-full max-w-2xl flex-1 ${
          count > 0 ? "pb-28" : "pb-12"
        }`}
      >
        {/* Persian Mansion Heritage Masthead */}
        <div className="px-4 pt-5 pb-2 text-center">
          <div className="mx-auto flex max-w-md flex-col items-center">
            <h1 className="font-display bg-gradient-to-b from-amber-100 via-[#fcd34d] to-[#d97706] bg-clip-text text-3xl font-extrabold text-transparent drop-shadow-[0_2px_14px_rgba(229,170,56,0.35)] sm:text-4xl">
              عمارت طاق
            </h1>

            {/* Persian Ornamental Divider */}
            <div className="mt-2 flex items-center gap-2 text-amber-400/70">
              <span className="h-px w-10 bg-gradient-to-r from-transparent via-amber-400/40 to-amber-400/80" />
              <span className="text-xs text-amber-300">✦</span>
              <span className="h-px w-10 bg-gradient-to-l from-transparent via-amber-400/40 to-amber-400/80" />
            </div>
          </div>
        </div>

        {topCategories.length > 0 && (
          <CategoryStrip
            categories={topCategories}
            subcategories={subcategories}
            activeCategoryId={activeTopCategoryId}
            activeSubcategoryId={effectiveSubcategoryId}
            categoryImages={categoryImages}
            onSelectCategory={handleSelectTopCategory}
            onSelectSubcategory={handleSelectSubcategory}
          />
        )}

        <div
          ref={listStageRef}
          className="relative touch-pan-y overflow-x-clip px-4 pt-1"
          {...swipeHandlers}
        >
          {outgoingLayer && (
            <div
              key={`out-${outgoingLayer.key}`}
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-4 top-1 select-none"
              style={
                {
                  "--swipe-start-x": `${outgoingLayer.startX}px`,
                } as CSSProperties
              }
            >
              {renderSectionContent({
                title: outgoingLayer.title,
                titleEn: outgoingLayer.titleEn,
                showHeader: outgoingLayer.hasHeader,
                sectionItems: outgoingLayer.items,
                animClass: outgoingAnimClass,
                interactive: false,
              })}
            </div>
          )}

          <div
            key={stepAnimation.key}
            style={{
              transform:
                dragX !== 0 ? `translate3d(${dragX}px, 0, 0)` : undefined,
              transition: isDragging
                ? "none"
                : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {renderSectionContent({
              title: sectionTitle,
              titleEn: sectionTitleEn,
              showHeader: Boolean(activeTopCategory),
              sectionItems: visibleItems,
              animClass: incomingAnimClass,
              interactive: true,
            })}
          </div>
        </div>
      </main>

      {/* Floating Bottom Cart Bar with Persian Gilded Heritage Style */}
      <AnimatePresence>
        {count > 0 && !cartOpen && (
          <motion.div
            initial={{ y: 80, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 80, opacity: 0, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4"
          >
            <div className="pointer-events-auto mx-auto max-w-2xl">
              <motion.button
                type="button"
                whileHover={{ scale: 1.015, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setCartOpen(true)}
                className="group relative flex w-full items-center justify-between overflow-hidden rounded-full border border-amber-400/40 bg-gradient-to-r from-[#172333]/95 via-[#0e1724]/95 to-[#172333]/95 px-5 py-3.5 text-white shadow-[inset_0_1.5px_2px_rgba(229,170,56,0.35),0_16px_36px_rgba(0,0,0,0.8)] ring-1 ring-teal-500/30 backdrop-blur-3xl transition-all hover:border-amber-400/70 hover:shadow-[0_20px_45px_rgba(229,170,56,0.2)] cursor-pointer"
              >
                <span className="flex items-center gap-2.5">
                  <motion.span
                    key={count}
                    initial={{ scale: 1.35 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="flex size-7 items-center justify-center rounded-full border border-amber-300/40 bg-gradient-to-br from-[#d97706] to-[#b45309] text-xs font-black text-amber-50 shadow-xs"
                  >
                    {formatNumber(count)}
                  </motion.span>
                  <span className="font-heading text-sm font-bold text-amber-100 sm:text-base">
                    مشاهده سینی سفارش‌ها
                  </span>
                </span>
                <motion.span
                  key={total}
                  initial={{ opacity: 0.7, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm font-black text-[#fcd34d] drop-shadow-[0_2px_6px_rgba(229,170,56,0.3)] sm:text-base"
                >
                  {formatToman(total)}
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Detail Dialog */}
      <ItemDetailDialog
        item={selectedItem}
        qty={selectedItem ? (qtyById.get(selectedItem.id) ?? 0) : 0}
        cartCount={count}
        onClose={() => setSelectedItem(null)}
        onAdd={() => {
          if (selectedItem) add(selectedItem);
        }}
        onDecrease={() => {
          if (selectedItem) {
            const currentQty = qtyById.get(selectedItem.id) ?? 0;
            setQty(selectedItem.id, currentQty - 1);
          }
        }}
        onIncrease={() => {
          if (selectedItem) {
            const currentQty = qtyById.get(selectedItem.id) ?? 0;
            setQty(selectedItem.id, currentQty + 1);
          }
        }}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Full-Screen Checkout ("تکمیل سفارش") */}
      <CheckoutView
        open={cartOpen}
        items={items}
        categories={categories}
        taxPercent={taxPercent}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
}
