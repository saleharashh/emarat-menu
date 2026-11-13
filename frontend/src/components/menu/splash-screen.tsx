"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SplashStatus = "playing" | "fading" | "done";

const ANIMATION_DURATION_MS = 2200;
const REDUCED_MOTION_DURATION_MS = 800;
const FADE_DURATION_MS = 400;

export function SplashScreen() {
  const [status, setStatus] = useState<SplashStatus>("playing");
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    try {
      sessionStorage.setItem("emarat_splash_shown", "1");
    } catch {}
    setStatus("fading");
  }, []);

  useEffect(() => {
    try {
      const isForceSplash =
        typeof window !== "undefined" &&
        new URLSearchParams(window.location.search).has("splash");
      if (!isForceSplash && sessionStorage.getItem("emarat_splash_shown") === "1") {
        setStatus("done");
        return;
      }
      if (!isForceSplash) {
        sessionStorage.setItem("emarat_splash_shown", "1");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (status !== "fading") return;
    const timer = window.setTimeout(() => {
      setStatus("done");
    }, FADE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    const isHold =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("splash") === "hold";

    if (isHold) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const holdMs = prefersReducedMotion
      ? REDUCED_MOTION_DURATION_MS
      : ANIMATION_DURATION_MS;

    const timer = window.setTimeout(dismiss, holdMs);
    return () => window.clearTimeout(timer);
  }, [dismiss]);

  if (status === "done") {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="خوش‌آمدگویی کافه عمارت طاق"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden overscroll-none bg-background select-none transition-opacity duration-500 ease-out ${
        status === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Refined subtle ambient radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(640px_420px_at_50%_46%,rgba(217,144,59,0.09)_0%,rgba(146,64,14,0.03)_50%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pattern-botanical pointer-events-none absolute inset-0 opacity-10"
      />

      {/* Skip button */}
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-5 left-5 z-20 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-stone-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_6px_16px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition hover:border-amber-400/40 hover:bg-white/[0.12] hover:text-white active:scale-95 sm:top-6 sm:left-6 sm:text-sm cursor-pointer"
      >
        رد کردن
      </button>

      {/* Main branded coffee cup presentation */}
      <div className="relative z-10 flex flex-col items-center">
        <svg
          viewBox="0 0 280 320"
          className="h-[290px] w-[254px] overflow-visible sm:h-[330px] sm:w-[290px]"
          aria-hidden="true"
        >
          <defs>
            {/* Cup Body Gradient */}
            <linearGradient id="splash-cup-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#dfd2c0" />
              <stop offset="28%" stopColor="#fdfbf8" />
              <stop offset="70%" stopColor="#f5efe3" />
              <stop offset="100%" stopColor="#d5c3ad" />
            </linearGradient>

            {/* Stepped Espresso Lid Gradient */}
            <linearGradient id="splash-cup-lid" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#1e130e" />
              <stop offset="35%" stopColor="#38231a" />
              <stop offset="75%" stopColor="#2a1a13" />
              <stop offset="100%" stopColor="#160e09" />
            </linearGradient>

            {/* Ground Contact Shadow */}
            <radialGradient id="splash-floor-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1c120c" stopOpacity="0.45" />
              <stop offset="65%" stopColor="#1c120c" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#1c120c" stopOpacity="0" />
            </radialGradient>

            {/* Natural Steam Wisps Gradient */}
            <linearGradient id="splash-steam-grad" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0%" stopColor="#d4b494" stopOpacity="0.75" />
              <stop offset="60%" stopColor="#ba9979" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#9a7858" stopOpacity="0" />
            </linearGradient>

            <clipPath id="splash-cup-clip">
              <path d="M85 154 L195 154 L181 275 C180 282 171 287 140 287 C109 287 100 282 99 275 Z" />
            </clipPath>
          </defs>

          {/* Soft Ground Shadow */}
          <ellipse
            cx="140"
            cy="294"
            rx="66"
            ry="12"
            fill="url(#splash-floor-shadow)"
            className="splash-anim-shadow"
          />

          {/* Rising Organic Steam Wisps */}
          <g>
            <path
              d="M136 122 C130 110 142 96 134 82 C128 70 138 56 132 44"
              fill="none"
              stroke="url(#splash-steam-grad)"
              strokeWidth="2.4"
              strokeLinecap="round"
              className="splash-anim-steam-1"
            />
            <path
              d="M144 122 C150 110 138 96 146 82 C152 70 142 56 148 44"
              fill="none"
              stroke="url(#splash-steam-grad)"
              strokeWidth="2"
              strokeLinecap="round"
              className="splash-anim-steam-2"
            />
          </g>

          {/* Branded Takeaway Cup */}
          <g className="splash-anim-cup">
            {/* Cup Body */}
            <path
              d="M85 154 L195 154 L181 275 C180 282 171 287 140 287 C109 287 100 282 99 275 Z"
              fill="url(#splash-cup-body)"
              stroke="#cfbeaa"
              strokeWidth="1.2"
            />

            {/* Subtle cup sleeve contour clipped inside cup */}
            <g clipPath="url(#splash-cup-clip)">
              {/* Sleeve band background */}
              <path
                d="M88 178 L192 178 L185 248 L95 248 Z"
                fill="rgba(140, 78, 35, 0.07)"
                stroke="rgba(140, 78, 35, 0.18)"
                strokeWidth="1"
              />
              <path
                d="M87 178 L193 178"
                stroke="#c59868"
                strokeWidth="1.2"
                strokeOpacity="0.35"
              />
              <path
                d="M95 248 L185 248"
                stroke="#c59868"
                strokeWidth="1.2"
                strokeOpacity="0.35"
              />
            </g>

            {/* Specular cylindrical highlight on left */}
            <path
              d="M96 164 L106 270"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.55"
            />

            {/* Central Emarat Tagh Medallion Frame on Cup */}
            <circle
              cx="140"
              cy="213"
              r="29"
              fill="#fcfbf8"
              stroke="#b46d3b"
              strokeWidth="1.5"
            />
            <circle
              cx="140"
              cy="213"
              r="26"
              fill="none"
              stroke="#deb887"
              strokeWidth="0.8"
              strokeDasharray="2.5 2"
            />

            {/* Official Emarat Tagh Logo on Cup */}
            <image
              href="/emarat-logo-tight.png"
              x="116"
              y="181"
              width="48"
              height="64"
              preserveAspectRatio="xMidYMid meet"
              className="splash-anim-logo"
            />

            {/* Stepped Espresso Lid */}
            <g>
              {/* Rim collar */}
              <rect
                x="78"
                y="144"
                width="124"
                height="12"
                rx="4.5"
                fill="url(#splash-cup-lid)"
              />
              {/* Upper stepped crown */}
              <path
                d="M87 128 L193 128 L199 144 L81 144 Z"
                fill="url(#splash-cup-lid)"
              />
              {/* Sip lip */}
              <rect
                x="128"
                y="124"
                width="24"
                height="5"
                rx="2"
                fill="#160e09"
              />
              {/* Lid bevel highlight */}
              <path
                d="M84 146 L196 146"
                stroke="#5a3d30"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.65"
              />
            </g>
          </g>
        </svg>

        {/* Brand reveal */}
        <div className="splash-anim-brand mt-4 flex flex-col items-center gap-1.5 text-center">
          <h1 className="font-display bg-gradient-to-b from-white via-stone-100 to-amber-200/90 bg-clip-text text-3xl font-extrabold text-transparent drop-shadow-[0_2px_12px_rgba(217,144,59,0.22)]">
            عمارت طاق
          </h1>
          <p className="text-xs font-medium text-amber-200/80">
            کافه و اقامتگاه سنتی
          </p>
        </div>
      </div>
    </div>
  );
}
