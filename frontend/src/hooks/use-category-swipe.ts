"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent, PointerEvent } from "react";

export type SwipeDirection = "next" | "prev";

interface UseCategorySwipeOptions {
  disabled?: boolean;
  canGoNext: boolean;
  canGoPrev: boolean;
  onSwipeStep: (direction: SwipeDirection, startOffsetX: number) => void;
}

interface TrackingState {
  pointerId: number;
  startX: number;
  startY: number;
  prevX: number;
  prevTime: number;
  lastX: number;
  lastTime: number;
  effectiveDx: number;
  axis: "undecided" | "horizontal" | "vertical";
}

const AXIS_LOCK_DISTANCE_PX = 12;
const VERTICAL_ABORT_DISTANCE_PX = 10;
const SWIPE_COMMIT_DISTANCE_PX = 64;
const SWIPE_FLICK_MIN_DISTANCE_PX = 24;
const SWIPE_FLICK_VELOCITY_PX_MS = 0.45;
const RUBBER_BAND_MAX_PX = 56;
const RUBBER_BAND_DAMPING = 0.25;

/**
 * Tracks horizontal pointer/touch drags over the menu item stage without
 * interfering with vertical scrolling (`touch-action: pan-y`) or card taps.
 */
export function useCategorySwipe({
  disabled = false,
  canGoNext,
  canGoPrev,
  onSwipeStep,
}: UseCategorySwipeOptions) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const trackingRef = useRef<TrackingState | null>(null);
  const didDragRef = useRef(false);
  const cleanupListenersRef = useRef<(() => void) | null>(null);

  const optionsRef = useRef({ disabled, canGoNext, canGoPrev, onSwipeStep });
  useEffect(() => {
    optionsRef.current = { disabled, canGoNext, canGoPrev, onSwipeStep };
  }, [disabled, canGoNext, canGoPrev, onSwipeStep]);

  const detachTracking = useCallback(() => {
    cleanupListenersRef.current?.();
    cleanupListenersRef.current = null;
    trackingRef.current = null;
  }, []);

  const stopTracking = useCallback(() => {
    detachTracking();
    setIsDragging(false);
    setDragX(0);
  }, [detachTracking]);

  useEffect(() => {
    if (disabled) {
      detachTracking();
      didDragRef.current = false;
    }
  }, [disabled, detachTracking]);

  useEffect(() => detachTracking, [detachTracking]);

  const onPointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (optionsRef.current.disabled) return;
      if (!e.isPrimary) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;

      stopTracking();
      didDragRef.current = false;

      const now = performance.now();
      trackingRef.current = {
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        prevX: e.clientX,
        prevTime: now,
        lastX: e.clientX,
        lastTime: now,
        effectiveDx: 0,
        axis: "undecided",
      };

      const handleMove = (ev: globalThis.PointerEvent) => {
        const state = trackingRef.current;
        if (!state || ev.pointerId !== state.pointerId) return;

        const dx = ev.clientX - state.startX;
        const dy = ev.clientY - state.startY;

        if (state.axis === "undecided") {
          if (
            Math.abs(dy) > VERTICAL_ABORT_DISTANCE_PX &&
            Math.abs(dy) > Math.abs(dx)
          ) {
            state.axis = "vertical";
            stopTracking();
            return;
          }
          if (
            Math.abs(dx) > AXIS_LOCK_DISTANCE_PX &&
            Math.abs(dx) > Math.abs(dy) * 1.25
          ) {
            state.axis = "horizontal";
            didDragRef.current = true;
            setIsDragging(true);
          } else {
            return;
          }
        }

        const t = performance.now();
        if (t - state.lastTime >= 16) {
          state.prevX = state.lastX;
          state.prevTime = state.lastTime;
          state.lastX = ev.clientX;
          state.lastTime = t;
        }

        const { canGoNext: allowNext, canGoPrev: allowPrev } =
          optionsRef.current;
        const hitsBoundary = (dx < 0 && !allowNext) || (dx > 0 && !allowPrev);
        const effectiveDx = hitsBoundary
          ? Math.sign(dx) *
            Math.min(RUBBER_BAND_MAX_PX, Math.abs(dx) * RUBBER_BAND_DAMPING)
          : dx;

        state.effectiveDx = effectiveDx;
        setDragX(effectiveDx);
      };

      const handleUp = (ev: globalThis.PointerEvent) => {
        const state = trackingRef.current;
        if (!state || ev.pointerId !== state.pointerId) return;

        const wasHorizontal = state.axis === "horizontal";
        const startOffsetX = state.effectiveDx;
        const rawDx = ev.clientX - state.startX;
        const dt = performance.now() - state.prevTime;
        const vx = dt > 0 && dt < 120 ? (ev.clientX - state.prevX) / dt : 0;

        stopTracking();

        if (!wasHorizontal) {
          didDragRef.current = false;
          return;
        }

        const {
          canGoNext: allowNext,
          canGoPrev: allowPrev,
          onSwipeStep: commitStep,
        } = optionsRef.current;

        const goNext =
          allowNext &&
          (rawDx <= -SWIPE_COMMIT_DISTANCE_PX ||
            (vx <= -SWIPE_FLICK_VELOCITY_PX_MS &&
              rawDx <= -SWIPE_FLICK_MIN_DISTANCE_PX));
        const goPrev =
          allowPrev &&
          (rawDx >= SWIPE_COMMIT_DISTANCE_PX ||
            (vx >= SWIPE_FLICK_VELOCITY_PX_MS &&
              rawDx >= SWIPE_FLICK_MIN_DISTANCE_PX));

        if (goNext) {
          commitStep("next", startOffsetX);
        } else if (goPrev) {
          commitStep("prev", startOffsetX);
        }

        // Keep didDragRef set briefly so the post-pointerup click event is suppressed.
        window.setTimeout(() => {
          didDragRef.current = false;
        }, 0);
      };

      const handleCancel = (ev: globalThis.PointerEvent) => {
        const state = trackingRef.current;
        if (!state || ev.pointerId !== state.pointerId) return;
        stopTracking();
        didDragRef.current = false;
      };

      window.addEventListener("pointermove", handleMove, { passive: true });
      window.addEventListener("pointerup", handleUp);
      window.addEventListener("pointercancel", handleCancel);

      cleanupListenersRef.current = () => {
        window.removeEventListener("pointermove", handleMove);
        window.removeEventListener("pointerup", handleUp);
        window.removeEventListener("pointercancel", handleCancel);
      };
    },
    [stopTracking],
  );

  const onClickCapture = useCallback((e: MouseEvent<HTMLElement>) => {
    if (didDragRef.current) {
      e.stopPropagation();
      e.preventDefault();
      didDragRef.current = false;
    }
  }, []);

  return {
    dragX: disabled ? 0 : dragX,
    isDragging: disabled ? false : isDragging,
    swipeHandlers: {
      onPointerDown,
      onClickCapture,
    },
  };
}
