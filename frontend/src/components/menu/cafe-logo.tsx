export function CafeLogo({ className = "size-12" }: { className?: string }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-full border border-white/20 bg-gradient-to-b from-white/[0.14] via-white/[0.06] to-white/[0.02] shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.35),0_10px_28px_rgba(0,0,0,0.6)] backdrop-blur-3xl ring-2 ring-white/10 transition-all hover:border-amber-400/50 hover:ring-amber-400/25 active:scale-95 ${className}`}
      aria-label="لوگوی عمارت طاق"
    >
      <img
        src="/emarat-logo-tight.png"
        alt="لوگوی عمارت طاق"
        className="size-full object-contain p-1.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        loading="eager"
      />
    </div>
  );
}
