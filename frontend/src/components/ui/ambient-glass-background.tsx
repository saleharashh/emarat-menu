"use client";

export function AmbientGlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Orb 1: Top-Right Luminous Amber Glow */}
      <div
        className="absolute -top-28 -right-24 h-[550px] w-[550px] rounded-full bg-gradient-to-br from-[#f59e0b]/35 via-[#d97706]/25 to-transparent blur-[110px] transform-gpu will-change-transform"
        style={{
          animation: "ambient-pulse-slow 9s ease-in-out infinite alternate",
        }}
      />

      {/* Orb 2: Top-Left Liquid Honey & Deep Ember Glow */}
      <div
        className="absolute top-28 -left-32 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-[#d97706]/30 via-[#b45309]/20 to-transparent blur-[125px] transform-gpu will-change-transform"
        style={{
          animation: "ambient-float-slow 11s ease-in-out infinite alternate",
        }}
      />

      {/* Orb 3: Center-Right Warm Smoked Bronze Glow */}
      <div
        className="absolute top-[34%] -right-24 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-[#92400e]/28 via-[#78350f]/20 to-transparent blur-[110px] transform-gpu will-change-transform"
        style={{
          animation: "ambient-pulse-slow 10s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Orb 4: Subtle Prismatic Cyan/Ice Reflection for True Optical Glass Dispersion */}
      <div
        className="absolute top-[52%] -left-16 h-[460px] w-[460px] rounded-full bg-gradient-to-tr from-[#0284c7]/14 via-[#38bdf8]/08 to-transparent blur-[130px] transform-gpu will-change-transform"
        style={{
          animation: "ambient-float-slow 13s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Orb 5: Center-Left Radiant Amber Glow */}
      <div
        className="absolute top-[58%] -left-20 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#f59e0b]/25 via-[#b45309]/18 to-transparent blur-[115px] transform-gpu will-change-transform"
        style={{
          animation: "ambient-pulse-slow 8.5s ease-in-out infinite alternate",
        }}
      />

      {/* Orb 6: Bottom Golden Amber Warmth */}
      <div
        className="absolute -bottom-28 left-1/2 h-[580px] w-[580px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#b45309]/25 via-[#f59e0b]/18 to-transparent blur-[130px] transform-gpu will-change-transform"
        style={{
          animation: "ambient-float-slow 10s ease-in-out infinite alternate",
        }}
      />

      {/* Subtle Optical Grain Grid for Tactile Crystal Glass Dispersion */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
