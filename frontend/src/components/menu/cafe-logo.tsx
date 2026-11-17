export function CafeLogo({ className = "size-12" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-2xl border border-[#D4A276]/60 bg-gradient-to-b from-[#FFFFFF] via-[#FFF9F2] to-[#F3D5B5] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.9),0_6px_20px_rgba(88,49,1,0.08)] ring-1 ring-[#BC8A5F]/20 transition-all hover:border-[#BC8A5F] active:scale-95 dark:border-amber-400/40 dark:from-[#1e2a3c]/90 dark:via-[#101824]/90 dark:to-[#0b1018]/90 dark:shadow-[inset_0_1.5px_2px_rgba(229,170,56,0.35),0_8px_24px_rgba(0,0,0,0.7)] dark:ring-teal-500/30 dark:hover:border-amber-400/70 ${className}`}
      aria-label="نشان عمارت طاق"
    >
      {/* Traditional jewel accents */}
      <span className="pointer-events-none absolute top-1 right-1 size-1 rounded-full bg-[#BC8A5F]/70 dark:bg-amber-400/70" />
      <span className="pointer-events-none absolute bottom-1 left-1 size-1 rounded-full bg-[#D4A276]/70 dark:bg-teal-400/70" />
      <img
        src="/emarat-logo-tight.png"
        alt="لوگوی عمارت طاق"
        className="size-full object-contain p-1.5 drop-shadow-[0_2px_6px_rgba(88,49,1,0.15)] dark:drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
        loading="eager"
      />
    </div>
  );
}
