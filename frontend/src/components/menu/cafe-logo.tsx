export function CafeLogo({ className = "size-12" }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center rounded-full border border-white/80 bg-card/80 text-primary shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_6px_18px_-2px_rgba(122,67,37,0.18)] backdrop-blur-xl ring-4 ring-white/50 transition-transform active:scale-95 dark:border-white/20 dark:bg-card/70 dark:ring-white/10 ${className}`}
      aria-label="لوگوی کافه عمارت"
    >
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-7"
        aria-hidden="true"
      >
        {/* Minimalist teacup + botanical leaf sprig & heart emblem */}
        <path
          d="M15 22H31V27.5C31 31.92 27.42 35.5 23 35.5C18.58 35.5 15 31.92 15 27.5V22Z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M31 24H33.2C34.75 24 36 25.25 36 26.8C36 28.35 34.75 29.6 33.2 29.6H30.8"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        <path
          d="M13 38.5H33"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Delicate botanical sprig rising from cup */}
        <path
          d="M23 19C23 14.8 25.2 11.4 28.5 9.8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M24.2 15.2C21.2 15 19.2 13 19 10.2C21.8 10.4 23.8 12.2 24.2 15.2Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <path
          d="M25.6 12.6C27.2 10.4 29.5 9.6 31.6 10.4C31 12.6 28.6 13.8 25.6 12.6Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        {/* Tiny heart detail */}
        <path
          d="M23 28.8C23 28.8 20.4 27.2 20.4 25.5C20.4 24.6 21.1 24 21.9 24C22.4 24 22.8 24.25 23 24.65C23.2 24.25 23.6 24 24.1 24C24.9 24 25.6 24.6 25.6 25.5C25.6 27.2 23 28.8 23 28.8Z"
          fill="currentColor"
          fillOpacity="0.85"
        />
      </svg>
    </div>
  );
}
