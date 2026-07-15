import React from "react";
import { Product } from "../types";
import { Star, ShoppingCart, Eye, Heart, Flame, Sparkles } from "lucide-react";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOrderNow?: (product: Product) => void;
  lang: "bn" | "en";
  isWishlisted?: boolean;
  onToggleWishlist?: (product: Product) => void;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  onOrderNow,
  lang,
  isWishlisted = false,
  onToggleWishlist
}: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;
  
  // Calculate discount percent based on either original price vs standard price OR flash sale price
  const activePrice = product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price;
  const comparePrice = product.originalPrice || (product.isFlashSale ? product.price : undefined);
  
  const discountPercent = comparePrice && comparePrice > activePrice
    ? Math.round(((comparePrice - activePrice) / comparePrice) * 100)
    : 0;

  return (
    <div 
      id={`product-${product.id}`} 
      className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      {/* Top action badges/buttons */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10" onClick={(e) => e.stopPropagation()}>
        <div className="flex flex-col gap-1">
          {/* Dynamic Badge (New, Hot, Sale) */}
          {product.badge === "new" && (
            <span className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              {lang === "bn" ? "নতুন" : "New"}
            </span>
          )}
          {product.badge === "hot" && (
            <span className="bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5 fill-white" />
              {lang === "bn" ? "গরম" : "Hot"}
            </span>
          )}
          {product.badge === "sale" && (
            <span className="bg-rose-500 text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm">
              {lang === "bn" ? "অফার" : "Sale"}
            </span>
          )}
          
          {/* Flash Sale Badge */}
          {product.isFlashSale && (
            <span className="bg-[#ef4444] text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full shadow-sm animate-pulse">
              ⚡ {lang === "bn" ? "ফ্ল্যাশ সেল" : "Flash Sale"}
            </span>
          )}
        </div>

        {/* Quick Wishlist button */}
        {onToggleWishlist && (
          <button
            onClick={() => onToggleWishlist(product)}
            className={`p-2 rounded-full border shadow-sm transition-all duration-300 cursor-pointer ${
              isWishlisted 
                ? "bg-rose-50 text-rose-500 border-rose-100 scale-110" 
                : "bg-white/80 hover:bg-white text-gray-400 hover:text-rose-500 border-gray-100"
            }`}
            title={isWishlisted ? (lang === "bn" ? "উইশলিস্ট থেকে বাদ দিন" : "Remove from Wishlist") : (lang === "bn" ? "উইশলিস্টে রাখুন" : "Add to Wishlist")}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-rose-500" : ""}`} />
          </button>
        )}
      </div>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 border-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Out Of Stock overlay */}
        {isOutOfStock ? (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
            <span className="bg-red-600 text-white font-black text-[10px] sm:text-xs uppercase tracking-wider px-3 py-1.5 rounded-full shadow-md">
              {lang === "bn" ? "স্টক শেষ" : "Out Of Stock"}
            </span>
          </div>
        ) : (
          /* Express Shipping Badge Overlay */
          <div className="absolute bottom-2.5 left-2.5 bg-slate-900/85 backdrop-blur-[2px] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
            <span>⚡</span> {lang === "bn" ? "এক্সপ্রেস" : "Express"}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1.5">
          {/* Category */}
          <span className="text-[9px] font-extrabold tracking-wider text-[#3730a3] bg-indigo-50 px-2 py-0.5 rounded-md uppercase">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="text-[13px] font-bold text-gray-800 leading-snug h-10 overflow-hidden line-clamp-2 hover:text-[#3730a3] transition-colors">
            {lang === "bn" ? product.banglaName || product.name : product.name}
          </h3>

          {/* Rating & Reviews */}
          <div className="flex items-center gap-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(product.rating) 
                      ? "text-amber-500 fill-amber-500" 
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-bold">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Dynamic badges */}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <span className="text-[8px] bg-slate-50 text-slate-700 border border-slate-100 px-1 py-0.5 rounded-md font-bold">
              ✓ {lang === "bn" ? "অরিজিনাল" : "100% Original"}
            </span>
            <span className="text-[8px] bg-indigo-50/50 text-[#3730a3] border border-indigo-50/80 px-1 py-0.5 rounded-md font-bold">
              🚚 {lang === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}
            </span>
          </div>
        </div>

        {/* Pricing and Action Block */}
        <div className="pt-2.5 border-t border-gray-50 flex flex-col justify-end space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className={`font-black text-sm sm:text-base ${product.isFlashSale ? "text-rose-600 font-black scale-105 origin-left" : "text-[#3730a3]"}`}>
                ৳{activePrice.toLocaleString()}
              </span>
              {discountPercent > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-400 line-through">
                    ৳{comparePrice?.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-[#ef4444] font-black">
                    -{discountPercent}%
                  </span>
                </div>
              )}
            </div>

            {/* Quick action buttons (isolated from the card click) */}
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <button
                id={`quick-view-${product.id}`}
                onClick={() => onViewDetails(product)}
                className="p-1.5 bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-[#3730a3] rounded-xl border border-gray-150 hover:border-indigo-200 transition-all cursor-pointer"
                title={lang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                id={`quick-add-${product.id}`}
                disabled={isOutOfStock}
                onClick={() => onAddToCart(product)}
                className="p-1.5 bg-[#3730a3] hover:bg-indigo-700 disabled:bg-gray-200 text-white rounded-xl transition-colors cursor-pointer"
                title={lang === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            id={`card-order-now-${product.id}`}
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              onOrderNow?.(product);
            }}
            className={`w-full font-black text-[11px] sm:text-xs py-2 rounded-xl transition-all cursor-pointer text-center flex items-center justify-center gap-1 shadow-sm ${
              isOutOfStock 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200 shadow-none" 
                : "bg-amber-500 hover:bg-amber-600 text-gray-900 hover:shadow-md"
            }`}
          >
            <span>🛍️</span>
            <span>{lang === "bn" ? "সরাসরি অর্ডার" : "ORDER NOW"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
