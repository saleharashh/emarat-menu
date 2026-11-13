import type { Metadata } from "next";
import { Cormorant_Garamond, Vazirmatn } from "next/font/google";
import { CartProvider } from "@/components/cart-provider";
import { AmbientGlassBackground } from "@/components/ui/ambient-glass-background";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-sans",
  subsets: ["arabic"],
});

const vazirmatnDisplay = Vazirmatn({
  variable: "--font-display",
  weight: ["600", "700"],
  subsets: ["arabic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif-en",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "کافه عمارت | منوی آنلاین",
  description: "منوی آنلاین کافه عمارت، با طعم‌های اصیل و سنتی یزد",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${vazirmatnDisplay.variable} ${cormorant.variable} dark h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-background text-foreground selection:bg-primary/20 selection:text-foreground">
        <AmbientGlassBackground />
        <CartProvider>{children}</CartProvider>
        <Toaster />
      </body>
    </html>
  );
}
