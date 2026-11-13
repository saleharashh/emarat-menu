"use client";

export function AmbientGlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transform-gpu"
    >
      {/* Orb 1: Top-Right Luminous Amber Glow */}
      <div
        className="absolute -top-20 -right-20 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-[#f59e0b]/25 via-[#d97706]/15 to-transparent blur-[80px]"
      />

      {/* Orb 2: Top-Left Liquid Honey & Deep Ember Glow */}
      <div
        className="absolute top-24 -left-28 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-[#d97706]/20 via-[#b45309]/15 to-transparent blur-[80px]"
      />

      {/* Orb 3: Center Warm Smoked Bronze Glow */}
      <div
        className="absolute top-[40%] -right-20 h-[420px] w-[420px] rounded-full bg-gradient-to-tl from-[#92400e]/20 via-[#78350f]/15 to-transparent blur-[70px]"
      />

      {/* Orb 4: Bottom Golden Amber Warmth */}
      <div
        className="absolute -bottom-20 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#b45309]/20 via-[#f59e0b]/12 to-transparent blur-[80px]"
      />

      {/* Subtle Optical Grain Grid for Tactile Crystal Glass Dispersion */}
      <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
