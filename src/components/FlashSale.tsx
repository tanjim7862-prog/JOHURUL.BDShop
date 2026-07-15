import React, { useState, useEffect } from "react";
import { Product } from "../types";
import { Flame, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import ProductCard from "./ProductCard";

interface FlashSaleProps {
  products: Product[];
  lang: "bn" | "en";
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOrderNow?: (product: Product) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
}

export default function FlashSale({
  products,
  lang,
  onViewDetails,
  onAddToCart,
  onOrderNow,
  wishlistIds,
  onToggleWishlist
}: FlashSaleProps) {
  // Filter products that are on flash sale
  const flashSaleProducts = products.filter((p) => p.isFlashSale === true);

  // Set the countdown target to midnight of the current day or 12 hours from now
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Generate a fixed target in local storage or 12 hours from now to keep countdown fresh
    const now = new Date();
    const targetTime = new Date(now.getTime() + 12 * 60 * 60 * 1000); // 12 hours from now

    const timer = setInterval(() => {
      const difference = targetTime.getTime() - new Date().getTime();

      if (difference <= 0) {
        // Reset timer to 12 hours to loop infinitely and remain fresh
        setTimeLeft({ hours: 12, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (flashSaleProducts.length === 0) return null;

  const padZero = (num: number) => String(num).padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-3xl p-6 border border-rose-100/50 shadow-sm space-y-6">
      {/* Header section with countdown timer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-rose-100/50">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-rose-500 rounded-2xl text-white shadow-md shadow-rose-200">
            <Flame className="w-5 h-5 fill-white animate-bounce" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-wide uppercase">
              {lang === "bn" ? "ধামাকা ফ্ল্যাশ সেল" : "HOT FLASH SALE"}
            </h2>
            <p className="text-[10px] sm:text-xs text-rose-600 font-bold">
              {lang === "bn" ? "সীমিত সময়ের জন্য সেরা অফারসমূহ" : "Limited stock, maximum discount"}
            </p>
          </div>
        </div>

        {/* Countdown Visual Blocks */}
        <div className="flex items-center gap-2 bg-white/85 backdrop-blur-xs px-4 py-2 rounded-2xl border border-rose-100/40 shadow-xs">
          <span className="text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mr-1">
            <Clock className="w-3.5 h-3.5 text-rose-500" />
            {lang === "bn" ? "শেষ হতে বাকি" : "ENDS IN"}:
          </span>
          <div className="flex items-center gap-1">
            <div className="bg-rose-500 text-white font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg">
              {padZero(timeLeft.hours)}
            </div>
            <span className="text-rose-500 font-bold text-xs">:</span>
            <div className="bg-rose-500 text-white font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg">
              {padZero(timeLeft.minutes)}
            </div>
            <span className="text-rose-500 font-bold text-xs">:</span>
            <div className="bg-rose-500 text-white font-mono font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg">
              {padZero(timeLeft.seconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Flash Sale product items listing */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {flashSaleProducts.map((product) => {
          const isWishlisted = wishlistIds.includes(product.id);
          return (
            <ProductCard
              key={`flash-${product.id}`}
              product={product}
              lang={lang}
              onViewDetails={onViewDetails}
              onAddToCart={onAddToCart}
              onOrderNow={onOrderNow}
              isWishlisted={isWishlisted}
              onToggleWishlist={onToggleWishlist}
            />
          );
        })}
      </div>
    </div>
  );
}
