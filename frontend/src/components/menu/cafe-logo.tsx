export function CafeLogo({ className = "size-12" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-[#D4A276]/60 bg-gradient-to-b from-[#FFFFFF] via-[#FFF9F2] to-[#F3D5B5] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_6px_20px_rgba(88,49,1,0.08)] ring-1 ring-[#BC8A5F]/20 transition-all hover:border-[#BC8A5F] active:scale-95 ${className}`}
      aria-label="نشان عمارت طاق"
    >
      {/* Traditional jewel accents */}
      <span className="pointer-events-none absolute top-1 right-1 size-1 rounded-full bg-[#BC8A5F]/70" />
      <span className="pointer-events-none absolute bottom-1 left-1 size-1 rounded-full bg-[#D4A276]/70" />
      <img
        src="/emarat-logo-tight.png"
        alt="لوگوی عمارت طاق"
        className="size-full object-contain p-1.5 drop-shadow-[0_2px_6px_rgba(88,49,1,0.15)]"
        loading="eager"
      />
    </div>
  );
}
