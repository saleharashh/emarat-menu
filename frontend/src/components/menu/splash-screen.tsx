"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type SplashStatus = "playing" | "fading" | "done";

const ANIMATION_DURATION_MS = 3600;
const REDUCED_MOTION_DURATION_MS = 1200;
const FADE_DURATION_MS = 500;

export function SplashScreen() {
  const [status, setStatus] = useState<SplashStatus>("playing");
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setStatus("fading");
  }, []);

  useEffect(() => {
    if (status !== "fading") return;
    const timer = window.setTimeout(() => {
      setStatus("done");
    }, FADE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
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
      aria-label="خوش‌آمدگویی کافه عمارت"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden overscroll-none bg-background select-none transition-opacity duration-500 ease-out ${
        status === "fading" ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* Matching editorial radial glow + subtle botanical pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(680px_420px_at_50%_46%,rgba(255,252,248,0.9)_0%,rgba(235,220,203,0.35)_52%,transparent_100%)]"
      />
      <div
        aria-hidden="true"
        className="pattern-botanical pointer-events-none absolute inset-0 opacity-45"
      />

      {/* Skip button */}
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-5 left-5 z-20 rounded-full border border-white/70 bg-card/75 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_4px_12px_-2px_rgba(60,36,22,0.08)] backdrop-blur-xl transition hover:border-white hover:bg-card/90 hover:text-foreground active:scale-95 sm:top-6 sm:left-6 sm:text-sm"
      >
        رد کردن
      </button>

      {/* Main pouring coffee onto ice -> coffee cup transformation */}
      <div className="relative z-10 flex flex-col items-center">
        <svg
          viewBox="0 0 280 320"
          className="h-[290px] w-[254px] overflow-visible sm:h-[330px] sm:w-[290px]"
          aria-hidden="true"
        >
          <defs>
            {/* Coffee stream & liquid gradients */}
            <linearGradient id="splash-coffee-stream" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2c170e" />
              <stop offset="42%" stopColor="#5c2d17" />
              <stop offset="72%" stopColor="#9c542b" />
              <stop offset="100%" stopColor="#351c11" />
            </linearGradient>

            <linearGradient id="splash-coffee-coat" x1="0" y1="0" x2="0.9" y2="1">
              <stop offset="0%" stopColor="#a75b2e" />
              <stop offset="40%" stopColor="#5d2c15" />
              <stop offset="100%" stopColor="#261209" />
            </linearGradient>

            {/* Crystal ice gradients */}
            <linearGradient id="splash-ice-body" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.96" />
              <stop offset="48%" stopColor="#edf6fa" stopOpacity="0.92" />
              <stop offset="100%" stopColor="#cbe0ea" stopOpacity="0.94" />
            </linearGradient>

            <linearGradient id="splash-ice-facet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.82" />
              <stop offset="100%" stopColor="#d7ebf3" stopOpacity="0.25" />
            </linearGradient>

            {/* Cup gradients */}
            <linearGradient id="splash-cup-body" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#e8dccb" />
              <stop offset="28%" stopColor="#fbf8f3" />
              <stop offset="68%" stopColor="#f7f2ea" />
              <stop offset="100%" stopColor="#dfceba" />
            </linearGradient>

            <linearGradient id="splash-cup-lid" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#221611" />
              <stop offset="35%" stopColor="#3e281f" />
              <stop offset="75%" stopColor="#321f18" />
              <stop offset="100%" stopColor="#1c120e" />
            </linearGradient>

            <radialGradient id="splash-floor-shadow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2d1e17" stopOpacity="0.22" />
              <stop offset="65%" stopColor="#2d1e17" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#2d1e17" stopOpacity="0" />
            </radialGradient>

            <clipPath id="splash-ice-clip">
              <rect x="82" y="160" width="116" height="116" rx="22" />
            </clipPath>

            <clipPath id="splash-cup-clip">
              <path d="M85 154 L195 154 L181 275 C180 282 171 287 140 287 C109 287 100 282 99 275 Z" />
            </clipPath>
          </defs>

          {/* Soft Ground Shadow */}
          <ellipse
            cx="140"
            cy="294"
            rx="68"
            ry="13"
            fill="url(#splash-floor-shadow)"
            className="splash-anim-shadow"
          />

          {/* 1. Pouring Coffee Stream from top */}
          <g className="splash-anim-stream">
            <path
              d="M134 0 C134 55 135 112 135.5 168 L144.5 168 C145 112 146 55 146 0 Z"
              fill="url(#splash-coffee-stream)"
            />
            <path
              d="M138.5 0 L138.5 166"
              stroke="#d99b66"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="14 18"
              opacity="0.72"
              className="splash-anim-stream-flow"
            />
          </g>

          {/* 2. Ice Cube + Coffee Coating inside Ice Silhouette */}
          <g className="splash-anim-ice">
            {/* Base translucent ice cube */}
            <rect
              x="82"
              y="160"
              width="116"
              height="116"
              rx="22"
              fill="url(#splash-ice-body)"
              stroke="#ffffff"
              strokeWidth="2.5"
            />

            {/* Internal icy crystal bevels */}
            <path
              d="M96 174 L144 174 L118 206 L94 206 Z"
              fill="url(#splash-ice-facet)"
            />
            <path
              d="M150 172 L184 172 L184 218 L156 196 Z"
              fill="#d4e8f1"
              opacity="0.45"
            />
            <rect
              x="89"
              y="167"
              width="102"
              height="102"
              rx="17"
              fill="none"
              stroke="#ffffff"
              strokeOpacity="0.65"
              strokeWidth="1.4"
            />

            {/* Coffee filling & dripping down the ice cube */}
            <g clipPath="url(#splash-ice-clip)">
              <g className="splash-anim-fill">
                <path
                  d="M74 166 Q108 156 140 165 T206 164 L206 286 L74 286 Z"
                  fill="url(#splash-coffee-coat)"
                />
                {/* Glossy caramel reflection inside liquid */}
                <path
                  d="M96 198 C108 216 106 244 98 262"
                  stroke="#c77e4b"
                  strokeWidth="4"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.45"
                />
              </g>

              {/* Top-down drip tongues coating the ice */}
              <g className="splash-anim-drips">
                <path
                  d="M82 156 L198 156 L198 188 C192 204 184 204 181 186 C178 176 171 178 168 198 C165 224 152 224 149 194 C146 178 136 178 133 206 C130 232 117 230 114 198 C111 176 100 176 96 196 C92 210 85 204 82 188 Z"
                  fill="url(#splash-coffee-coat)"
                />
              </g>
            </g>

            {/* Specular ice highlight */}
            <path
              d="M94 186 C94 176 102 170 114 170"
              stroke="#ffffff"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </g>

          {/* 3. Coffee Impact Splash Crown & Droplets */}
          <g className="splash-anim-crown">
            <path
              d="M114 164 Q124 145 134 161 Q140 142 146 161 Q156 145 166 164 Q140 172 114 164 Z"
              fill="#6a3319"
            />
            <path
              d="M123 162 Q132 150 140 160 Q148 150 157 162"
              stroke="#c8834d"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="none"
              opacity="0.7"
            />
          </g>

          <circle
            cx="132"
            cy="160"
            r="4.2"
            fill="#5d2c15"
            className="splash-anim-drop-a"
          />
          <circle
            cx="148"
            cy="160"
            r="3.8"
            fill="#7a3b1d"
            className="splash-anim-drop-b"
          />
          <circle
            cx="136"
            cy="158"
            r="2.8"
            fill="#9b532b"
            className="splash-anim-drop-c"
          />
          <circle
            cx="144"
            cy="158"
            r="2.6"
            fill="#5d2c15"
            className="splash-anim-drop-d"
          />

          {/* 4. Transformed Coffee Cup */}
          <g className="splash-anim-cup">
            {/* Cup Body */}
            <path
              d="M85 154 L195 154 L181 275 C180 282 171 287 140 287 C109 287 100 282 99 275 Z"
              fill="url(#splash-cup-body)"
              stroke="#d5c2ad"
              strokeWidth="1.2"
            />

            {/* Topographic wavy pattern & bottom accent band clipped inside cup */}
            <g clipPath="url(#splash-cup-clip)">
              <g
                fill="none"
                stroke="#7a4325"
                strokeOpacity="0.22"
                strokeWidth="1.2"
              >
                <path d="M74 176 Q110 164 142 178 T206 174" />
                <path d="M74 192 Q114 180 146 195 T206 190" />
                <path d="M74 209 Q110 198 144 212 T206 208" />
                <path d="M74 226 Q116 216 146 229 T206 224" />
                <path d="M74 244 Q112 234 144 246 T206 242" />
              </g>

              {/* Warm cocoa base stripe */}
              <path
                d="M92 268 Q140 274 188 268 L184 290 L96 290 Z"
                fill="#4a2c20"
                opacity="0.92"
              />
              <path
                d="M93 265 Q140 271 187 265"
                stroke="#7a4325"
                strokeWidth="2.5"
                fill="none"
              />
            </g>

            {/* Left cylindrical specular highlight */}
            <path
              d="M96 164 L106 270"
              stroke="#ffffff"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.65"
            />

            {/* Central Emarat Cafe Medallion */}
            <circle
              cx="140"
              cy="214"
              r="24"
              fill="#fbf8f3"
              stroke="#7a4325"
              strokeWidth="1.5"
            />
            <circle
              cx="140"
              cy="214"
              r="20"
              fill="none"
              stroke="#decbb7"
              strokeWidth="1"
            />
            {/* Coffee bean + arch emblem inside medallion */}
            <g transform="translate(140 214)">
              <ellipse
                cx="0"
                cy="0"
                rx="7"
                ry="10"
                transform="rotate(-22)"
                fill="#4a2c20"
              />
              <path
                d="M-2.2 -7.5 C1 -2 -1 2 2.2 7.5"
                stroke="#fbf8f3"
                strokeWidth="1.6"
                strokeLinecap="round"
                fill="none"
                transform="rotate(-22)"
              />
            </g>

            {/* Stepped Espresso Lid */}
            <g className="splash-anim-lid">
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
                fill="#1c120e"
              />
              {/* Lid bevel highlight */}
              <path
                d="M84 146 L196 146"
                stroke="#634537"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.65"
              />
            </g>
          </g>

          {/* 5. Gentle Rising Steam Wisps */}
          <g
            fill="none"
            stroke="#8a7161"
            strokeWidth="1.8"
            strokeLinecap="round"
            className="splash-anim-steam"
          >
            <path d="M132 114 C126 104 138 94 131 82" />
            <path d="M148 116 C154 106 142 96 149 85" opacity="0.7" />
          </g>
        </svg>

        {/* Brand reveal */}
        <div className="splash-anim-brand mt-2 flex flex-col items-center gap-1 text-center">
          <h1 className="font-display text-3xl tracking-wide text-foreground">
            کافه عمارت
          </h1>
          <p className="text-xs font-medium text-muted-foreground">
            با طعم‌های اصیل و ماندگار
          </p>
        </div>
      </div>
    </div>
  );
}
