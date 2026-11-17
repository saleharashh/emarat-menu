"use client";

export function AmbientGlassBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none transform-gpu"
    >
      {/* ─── Light Mode Atmosphere (آفتاب غروب، خشت و بادگیر) ─── */}
      <div className="dark:hidden">
        {/* 1. Soft Warm Sand Light (تابش ملایم ماسه‌ای آفتاب کویر) */}
        <div className="absolute -top-24 right-[-10%] h-[560px] w-[560px] rounded-full bg-gradient-to-br from-[#F3D5B5]/60 via-[#E7BC91]/35 to-transparent blur-[120px]" />

        {/* 2. Terracotta Adobe Glow (حرارت گرم خشت‌های کویری) */}
        <div className="absolute top-[28%] -left-20 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[#D4A276]/45 via-[#BC8A5F]/20 to-transparent blur-[115px]" />

        {/* 3. Cinnamon Sunset Blush (غروب زعفرانی و دارچینی عمارت) */}
        <div className="absolute top-[55%] -right-24 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-[#E7BC91]/40 via-[#F3D5B5]/30 to-transparent blur-[110px]" />

        {/* 4. Roasted Earth Base (پایه خاکی و گرم کویر) */}
        <div className="absolute -bottom-24 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#D4A276]/35 via-[#E7BC91]/20 to-transparent blur-[125px]" />

        {/* Persian Girih Tile Pattern */}
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#bc8a5f_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="pattern-girih absolute inset-0 opacity-[0.06] [background-size:64px_64px]" />
      </div>

      {/* ─── Dark Mode Atmosphere (شبستان لاجوردی و زرین عمارت) ─── */}
      <div className="hidden dark:block">
        {/* 1. Turquoise Basin Pool (حوض فیروزه وسط حیاط عمارت) */}
        <div className="absolute -top-24 right-[-10%] h-[560px] w-[560px] rounded-full bg-gradient-to-br from-[#0d9488]/14 via-[#0f766e]/08 to-transparent blur-[120px]" />

        {/* 2. Amber / Saffron Lantern Glow (نور گرم فانوس و سماور زعفرانی) */}
        <div className="absolute top-[28%] -left-20 h-[520px] w-[520px] rounded-full bg-gradient-to-br from-[#d97706]/16 via-[#b45309]/08 to-transparent blur-[115px]" />

        {/* 3. Ruby Orosi Window Light (نور شیشه‌های ارسی سرخ و اناری) */}
        <div className="absolute top-[55%] -right-24 h-[500px] w-[500px] rounded-full bg-gradient-to-tl from-[#be123c]/12 via-[#9f1239]/06 to-transparent blur-[110px]" />

        {/* 4. Deep Persian Lapis Reflection (انعکاس لاجوردی آسمان شب کویر) */}
        <div className="absolute -bottom-24 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-gradient-to-t from-[#1d4ed8]/12 via-[#0e7490]/08 to-transparent blur-[125px]" />

        {/* Persian Girih Tile Pattern (گره‌چینی اسلیمی و کاشی‌کاری سنتی ظریف) */}
        <div className="absolute inset-0 opacity-[0.035] bg-[radial-gradient(#e5aa38_1px,transparent_1px)] [background-size:28px_28px]" />
        <div className="pattern-girih absolute inset-0 opacity-[0.035] [background-size:64px_64px]" />
      </div>
    </div>
  );
}
