export function CafeLogo({ className = "size-12" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-b from-[#1e2a3c]/90 via-[#101824]/90 to-[#0b1018]/90 shadow-[inset_0_1.5px_2px_rgba(229,170,56,0.35),0_8px_24px_rgba(0,0,0,0.7)] ring-1 ring-teal-500/30 transition-all hover:border-amber-400/70 hover:ring-teal-400/50 active:scale-95 ${className}`}
      aria-label="نشان عمارت طاق"
    >
      {/* Traditional jewel accents */}
      <span className="pointer-events-none absolute top-1 right-1 size-1 rounded-full bg-amber-400/70" />
      <span className="pointer-events-none absolute bottom-1 left-1 size-1 rounded-full bg-teal-400/70" />
      <img
        src="/emarat-logo-tight.png"
        alt="لوگوی عمارت طاق"
        className="size-full object-contain p-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        loading="eager"
      />
    </div>
  );
}
