"use client";

export function AmbientGlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
    >
      {/* Orb 1: Top-Right Luminous Caramel Amber Glow */}
      <div
        className="absolute -top-20 -right-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#df8a28]/45 via-[#b8651b]/35 to-transparent blur-[100px] transform-gpu will-change-transform dark:from-[#df8a28]/30 dark:via-[#9b5a1f]/20"
        style={{
          animation: "ambient-pulse-slow 9s ease-in-out infinite alternate",
        }}
      />

      {/* Orb 2: Top-Left Warm Creamy Latte & Honey Sunburst */}
      <div
        className="absolute top-32 -left-28 h-[540px] w-[540px] rounded-full bg-gradient-to-br from-[#f5b866]/40 via-[#ebdccb]/55 to-transparent blur-[120px] transform-gpu will-change-transform dark:from-[#c47622]/25 dark:via-[#3a2519]/40"
        style={{
          animation: "ambient-float-slow 11s ease-in-out infinite alternate",
        }}
      />

      {/* Orb 3: Center-Right Deep Roasted Mocha & Timber Timber Glow */}
      <div
        className="absolute top-[36%] -right-28 h-[480px] w-[480px] rounded-full bg-gradient-to-tl from-[#8c4e23]/35 via-[#5c351a]/28 to-transparent blur-[105px] transform-gpu will-change-transform dark:from-[#5c351a]/40 dark:via-[#2c1910]/35"
        style={{
          animation: "ambient-pulse-slow 10s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Orb 4: Center-Left Radiant Golden Amber Glow */}
      <div
        className="absolute top-[56%] -left-20 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-[#e59838]/42 via-[#b8651b]/30 to-transparent blur-[115px] transform-gpu will-change-transform dark:from-[#df8a28]/28 dark:via-[#5c351a]/25"
        style={{
          animation: "ambient-float-slow 12s ease-in-out infinite alternate-reverse",
        }}
      />

      {/* Orb 5: Bottom-Center Roasted Hazelnut & Warm Embers */}
      <div
        className="absolute -bottom-24 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#c87622]/38 via-[#df8a28]/28 to-transparent blur-[125px] transform-gpu will-change-transform dark:from-[#9b5a1f]/32 dark:via-[#df8a28]/18"
        style={{
          animation: "ambient-pulse-slow 8.5s ease-in-out infinite alternate",
        }}
      />

      {/* Subtle Botanical Watermark & Fine Dot Grid Texture for Optical Dispersion */}
      <div className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06] bg-[radial-gradient(#2c1910_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
