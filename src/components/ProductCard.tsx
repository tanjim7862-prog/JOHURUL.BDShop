import React from "react";
import { Product } from "../types";
import { Star, ShoppingCart, Eye, Sparkles } from "lucide-react";

interface ProductCardProps {
  key?: React.Key;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onOrderNow?: (product: Product) => void;
  lang: "bn" | "en";
}

export default function ProductCard({ product, onViewDetails, onAddToCart, onOrderNow, lang }: ProductCardProps) {
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      id={`product-${product.id}`} 
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative cursor-pointer"
      onClick={() => onViewDetails(product)}
    >
      {/* Discount Badge */}
      {discountPercent > 0 && (
        <div className="absolute top-2 left-2 bg-[#3730a3] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg z-10 shadow-sm">
          -{discountPercent}%
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 border-indigo-800 border-gray-50">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        
        {/* Express Badge overlay */}
        <div className="absolute bottom-2 left-2 bg-[#3730a3] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
          <span>⚡</span> {lang === "bn" ? "এক্সপ্রেস" : "Express"}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div className="space-y-1">
          {/* Category */}
          <span className="text-[9px] font-extrabold tracking-wider text-[#3730a3] bg-indigo-50 px-1.5 py-0.5 rounded-md uppercase">
            {product.category}
          </span>

          {/* Title */}
          <h3 className="text-[13px] font-medium text-gray-800 leading-snug h-10 overflow-hidden line-clamp-2 hover:text-[#3730a3] transition-colors">
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
                      ? "text-blue-800mber-500 fill-amber-500" 
                      : "text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-gray-400 font-medium">
              ({product.reviewsCount})
            </span>
          </div>

          {/* Dynamic Badges */}
          <div className="flex flex-wrap items-center gap-1 pt-1">
            <span className="text-[9px] bg-indigo-50 text-red-700 border border-indigo-800lue-100/40 px-1 py-0.5 rounded-md font-semibold">
              ✓ {lang === "bn" ? "অরিজিনাল প্রোডাক্ট" : "100% Original"}
            </span>
            <span className="text-[9px] bg-indigo-50/60 text-red-800 border border-indigo-800lue-100/30 px-1 py-0.5 rounded-md font-semibold">
              🚚 {lang === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}
            </span>
          </div>
        </div>

        {/* Pricing and Action Block */}
        <div className="pt-2 border-t border-gray-100 flex flex-col justify-end space-y-2">
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              <span className="text-indigo-900lue-600ase font-bold text-[#3730a3]">
                ৳{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <div className="flex items-center gap-1">
                  <span className="text-[11px] text-gray-400 line-through">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-[#3730a3] font-bold">
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
                className="p-1.5 bg-gray-50 hover:bg-indigo-50 text-gray-500 hover:text-[#3730a3] rounded-lg border border-gray-200 hover:border-indigo-800lue-200 transition-all cursor-pointer"
                title={lang === "bn" ? "বিস্তারিত দেখুন" : "View Details"}
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                id={`quick-add-${product.id}`}
                disabled={product.stock === 0}
                onClick={() => onAddToCart(product)}
                className="p-1.5 bg-[#3730a3] hover:bg-indigo-700 disabled:bg-gray-300 text-white rounded-lg transition-colors cursor-pointer"
                title={lang === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}
              >
                <ShoppingCart className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <button
            id={`card-order-now-${product.id}`}
            disabled={product.stock === 0}
            onClick={(e) => {
              e.stopPropagation();
              onOrderNow?.(product);
            }}
            className="w-full bg-[#3730a3] hover:bg-[#4338ca] disabled:bg-gray-300 text-white font-bold text-xs py-2 rounded-lg transition-colors cursor-pointer text-center flex items-center justify-center gap-1 shadow-xs hover:shadow-sm"
          >
            <span>🛍️</span>
            <span>{lang === "bn" ? "অর্ডার করুন" : "ORDER NOW"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

