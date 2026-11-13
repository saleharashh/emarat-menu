"use client";

export function AmbientGlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transform-gpu"
    >
      {/* Orb 1: Top-Right Subtle Champagne Bronze Glow */}
      <div
        className="absolute -top-20 -right-20 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[#d9903b]/08 via-[#92400e]/04 to-transparent blur-[110px]"
      />

      {/* Orb 2: Top-Left Soft Smoked Ember Glow */}
      <div
        className="absolute top-24 -left-28 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#b45309]/07 via-[#78350f]/03 to-transparent blur-[110px]"
      />

      {/* Orb 3: Center Rich Smoked Quartz Depth */}
      <div
        className="absolute top-[40%] -right-20 h-[460px] w-[460px] rounded-full bg-gradient-to-tl from-[#78350f]/06 via-[#451a03]/04 to-transparent blur-[100px]"
      />

      {/* Orb 4: Bottom Delicate Golden Warmth */}
      <div
        className="absolute -bottom-20 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#92400e]/06 via-[#d9903b]/03 to-transparent blur-[110px]"
      />

      {/* Subtle Optical Grain Grid for Tactile Crystal Glass Dispersion */}
      <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:24px_24px]" />
    </div>
  );
}
