import React, { useState, useEffect, useMemo } from "react";
import { X, ShoppingCart, ShieldCheck, Heart, Share2, Facebook, MessageCircle, AlertTriangle, Check, ArrowRight } from "lucide-react";
import { Product } from "../types";

interface ProductDetailsProps {
  product: Product;
  lang: "bn" | "en";
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, selectedSize?: string, selectedColor?: string, price?: number) => void;
  onOrderNow: (product: Product, selectedSize?: string, selectedColor?: string, price?: number) => void;
  wishlistIds: string[];
  onToggleWishlist: (product: Product) => void;
  whatsappNumber?: string;
}

export default function ProductDetails({
  product,
  lang,
  onClose,
  onAddToCart,
  onOrderNow,
  wishlistIds,
  onToggleWishlist,
  whatsappNumber = "8801795339373"
}: ProductDetailsProps) {
  // Gallery active image state
  const [activeImage, setActiveImage] = useState<string>(product.image);

  // Variation States
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<{ name: string; hex: string } | null>(null);

  // Initialize selected variations on product load
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize("");
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else {
        setSelectedColor(null);
      }
      setActiveImage(product.image);
    }
  }, [product]);

  // Gallery images combined (main + auxiliary images)
  const galleryImages = useMemo(() => {
    const list = [product.image];
    if (product.images) {
      product.images.forEach(img => {
        if (img && !list.includes(img)) {
          list.push(img);
        }
      });
    }
    return list;
  }, [product]);

  // Zoom on Hover Calculations (Magnifier lens panning effect)
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center center",
      transform: "scale(1)",
    });
  };

  // Dynamic Pricing Calculation (XL adding +100, XXL adding +150, Shoe 43/44 adding +50)
  const dynamicPrice = useMemo(() => {
    let base = product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price;
    if (selectedSize) {
      if (selectedSize === "XL") base += 100;
      if (selectedSize === "XXL") base += 150;
      if (selectedSize === "43" || selectedSize === "44") base += 50;
    }
    return base;
  }, [product, selectedSize]);

  const dynamicOriginalPrice = useMemo(() => {
    if (!product.originalPrice) return undefined;
    let base = product.originalPrice;
    if (selectedSize) {
      if (selectedSize === "XL") base += 100;
      if (selectedSize === "XXL") base += 150;
      if (selectedSize === "43" || selectedSize === "44") base += 50;
    }
    return base;
  }, [product, selectedSize]);

  // Share link helpers
  const shareUrl = typeof window !== "undefined" ? window.location.href : `https://johurulbdshop.com/product/${product.id}`;
  
  const handleShareFacebook = () => {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbUrl, "_blank", "width=600,height=400");
  };

  const handleShareWhatsApp = () => {
    const text = lang === "bn" 
      ? `অসাধারণ এই প্রোডাক্টটি দেখুন: ${lang === "bn" ? product.banglaName || product.name : product.name} - ৳${dynamicPrice}. লিংক: ${shareUrl}`
      : `Check out this amazing product: ${product.name} - ৳${dynamicPrice}. Link: ${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleWhatsAppSupport = () => {
    const query = lang === "bn"
      ? `আসসালামু আলাইকুম, আমি "${product.banglaName || product.name}" পণ্যটি সম্পর্কে জানতে চাই। মূল্য: ৳${dynamicPrice}।${selectedSize ? " সাইজ: " + selectedSize : ""}${selectedColor ? " কালার: " + selectedColor.name : ""}`
      : `Hello, I would like to inquire about "${product.name}". Price: ৳${dynamicPrice}. ${selectedSize ? "Size: " + selectedSize : ""}${selectedColor ? "Color: " + selectedColor.name : ""}`;
    const waUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(query)}`;
    window.open(waUrl, "_blank");
  };

  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col">
        
        {/* Header bar / Close button */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            onClick={() => onToggleWishlist(product)}
            className={`p-2.5 rounded-full transition-all border shadow-xs cursor-pointer ${
              isWishlisted 
                ? "bg-red-50 border-red-100 text-red-500 hover:bg-red-100" 
                : "bg-white border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50"
            }`}
            title={lang === "bn" ? "উইশলিস্টে রাখুন" : "Add to Wishlist"}
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
          <button
            id="close-details-modal"
            onClick={onClose}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-1">
          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Left side: Gallery + Zoom Area */}
            <div className="p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-gray-100">
              {/* Active Image with zoom container */}
              <div 
                className="w-full aspect-square bg-gray-50 rounded-2xl overflow-hidden relative cursor-zoom-in border border-gray-100/80 group"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  style={zoomStyle}
                  className="w-full h-full object-cover transition-transform duration-100 ease-out"
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual Cue Indicator for zoom */}
                <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold py-1 px-2.5 rounded-full flex items-center gap-1 opacity-80 group-hover:opacity-0 transition-opacity">
                  <span>🔍</span> {lang === "bn" ? "জুম করতে মাউস রাখুন" : "Hover to zoom"}
                </div>
              </div>

              {/* Gallery Thumbnails row */}
              {galleryImages.length > 1 && (
                <div className="flex gap-2.5 overflow-x-auto py-1 scrollbar-thin">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border shrink-0 transition-all cursor-pointer ${
                        activeImage === img 
                          ? "border-[#3730a3] ring-2 ring-[#3730a3]/10 scale-95" 
                          : "border-gray-100 hover:border-gray-300"
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`${product.name} thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right side: Specifications & Actions */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              
              {/* Product Info Block */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-[#3730a3] bg-[#3730a3]/10 px-3 py-1 rounded-full uppercase tracking-wider">
                    {product.category}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
                    {lang === "bn" ? product.banglaName || product.name : product.name}
                  </h3>
                </div>

                {/* Ratings & Seller info */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-[#3730a3]/5 border border-[#3730a3]/10 px-2 py-0.5 rounded-lg">
                    <span className="text-xs font-black text-[#3730a3]">{product.rating}</span>
                    <span className="text-amber-400 text-sm">★</span>
                  </div>
                  <span className="text-xs text-gray-400 font-bold">
                    ({product.reviewsCount} {lang === "bn" ? "রিভিউ" : "Reviews"})
                  </span>
                  {product.supplierShop && (
                    <span className="text-xs text-gray-400 font-semibold border-l border-gray-200 pl-3">
                      🏪 {product.supplierShop}
                    </span>
                  )}
                </div>

                {/* Dynamic Price Display */}
                <div className="flex items-baseline gap-3.5 py-1">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#3730a3] transition-all duration-300">
                    ৳{dynamicPrice}
                  </span>
                  {dynamicOriginalPrice && (
                    <span className="text-sm sm:text-base text-gray-400 line-through">
                      ৳{dynamicOriginalPrice}
                    </span>
                  )}
                  {dynamicOriginalPrice && (
                    <span className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-md uppercase">
                      -{Math.round(((dynamicOriginalPrice - dynamicPrice) / dynamicOriginalPrice) * 100)}% {lang === "bn" ? "ছাড়" : "OFF"}
                    </span>
                  )}
                </div>

                {/* STOCK COUNTDOWN ALERT (High urgency indicator) */}
                <div className="py-1">
                  {product.stock <= 0 ? (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-3 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0"></div>
                      <span className="text-xs font-black text-red-700">
                        {lang === "bn" ? "দুঃখিত, স্টক শেষ!" : "Sorry, Out of stock!"}
                      </span>
                    </div>
                  ) : product.stock <= 15 ? (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 animate-bounce" />
                        <span>
                          {lang === "bn" 
                            ? `তাড়াতাড়ি করুন, আর মাত্র ${product.stock} টি স্টক বাকি আছে!` 
                            : `Hurry! Only ${product.stock} left in stock!`}
                        </span>
                      </div>
                      {/* Urgency Progress Bar */}
                      <div className="w-full bg-amber-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-amber-500 h-full rounded-full animate-pulse"
                          style={{ width: `${Math.max(10, (product.stock / 15) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-2xl w-fit">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                      <span>
                        {lang === "bn" ? "স্টকে এভেলেবল আছে" : "In Stock - Ready to Ship"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Description Snippet */}
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                    {lang === "bn" ? "পণ্য পরিচিতি" : "Product details"}
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed max-h-24 overflow-y-auto">
                    {lang === "bn" ? product.banglaDescription || product.description : product.description}
                  </p>
                </div>

                {/* PRODUCT VARIATION SELECTORS */}
                <div className="space-y-3.5 pt-2 border-t border-gray-100">
                  {/* Colors Selector */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-500">{lang === "bn" ? "রঙ নির্বাচন করুন:" : "Select Color:"}</span>
                        <span className="font-black text-[#3730a3]">{selectedColor?.name}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.colors.map((color, idx) => {
                          const isSelected = selectedColor?.name === color.name;
                          return (
                            <button
                              key={idx}
                              onClick={() => setSelectedColor(color)}
                              className={`p-1.5 rounded-full border transition-all flex items-center justify-center cursor-pointer ${
                                isSelected 
                                  ? "border-[#3730a3] scale-110 shadow-xs ring-2 ring-[#3730a3]/10" 
                                  : "border-gray-200 hover:border-gray-400"
                              }`}
                              title={color.name}
                            >
                              <span 
                                className="w-5 h-5 rounded-full border border-black/10 flex items-center justify-center shrink-0"
                                style={{ backgroundColor: color.hex }}
                              >
                                {isSelected && (
                                  <Check className={`w-3 h-3 ${
                                    color.hex.toLowerCase() === "#ffffff" || color.hex.toLowerCase() === "#f9fafb" 
                                      ? "text-black" 
                                      : "text-white"
                                  }`} />
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sizes Selector */}
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-gray-500">{lang === "bn" ? "সাইজ নির্বাচন করুন:" : "Select Size:"}</span>
                        {selectedSize === "XL" || selectedSize === "XXL" ? (
                          <span className="text-[10px] bg-indigo-50 text-[#3730a3] font-bold px-2 py-0.5 rounded">
                            {lang === "bn" ? "৳১০০-১৫০ যোগ হবে" : "+৳100-150 Premium"}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => {
                          const isSelected = selectedSize === size;
                          return (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                                isSelected 
                                  ? "bg-[#3730a3] text-white border-[#3730a3] shadow-md" 
                                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                              }`}
                            >
                              {size}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Trust COD Banner */}
                <div className="bg-[#3730a3]/5 border border-[#3730a3]/10 p-3 rounded-2xl space-y-1 text-xs">
                  <div className="flex items-center gap-2 text-[#3730a3] font-black">
                    <ShieldCheck className="w-4 h-4 text-[#3730a3]" />
                    <span>{lang === "bn" ? "ক্যাশ অন ডেলিভারি (COD)" : "Cash on Delivery Available"}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 pl-6 leading-relaxed">
                    {lang === "bn" 
                      ? "পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন। অগ্রিম টাকা দিতে হবে না।" 
                      : "Zero advance payment. Receive and verify your products first, then pay the rider."}
                  </p>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                {/* Buy & Add buttons */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    disabled={product.stock === 0}
                    onClick={() => onAddToCart(product, 1, selectedSize, selectedColor?.name, dynamicPrice)}
                    className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 text-gray-700 font-bold text-xs sm:text-sm py-3.5 px-5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer border border-gray-200 active:scale-95 shrink-0"
                  >
                    <ShoppingCart className="w-4 h-4 text-gray-500" />
                    <span>{lang === "bn" ? "কার্টে রাখুন" : "Add to Cart"}</span>
                  </button>

                  <button
                    disabled={product.stock === 0}
                    onClick={() => onOrderNow(product, selectedSize, selectedColor?.name, dynamicPrice)}
                    className="flex-1 bg-[#3730a3] hover:bg-[#4338ca] disabled:bg-gray-200 text-white font-black text-xs sm:text-sm py-3.5 px-6 rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:shadow-indigo-800/10 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
                  >
                    <span>🛍️</span>
                    <span>{lang === "bn" ? "সরাসরি অর্ডার করুন" : "ORDER COD NOW"}</span>
                  </button>
                </div>

                {/* Primary Support & Share Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* WhatsApp Support Chat (Very popular) */}
                  <button
                    onClick={handleWhatsAppSupport}
                    className="flex items-center justify-center gap-2 bg-[#25d366] hover:bg-[#20ba5a] text-white font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                  >
                    <MessageCircle className="w-4 h-4 text-white fill-current" />
                    <span>{lang === "bn" ? "হোয়াটস্যাপে অর্ডার ও হেল্প" : "Order / Chat on WhatsApp"}</span>
                  </button>

                  {/* Social Sharing */}
                  <div className="flex items-center gap-2 justify-center sm:justify-end">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                      <Share2 className="w-3.5 h-3.5" /> {lang === "bn" ? "শেয়ার:" : "Share:"}
                    </span>
                    <button
                      onClick={handleShareFacebook}
                      className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors cursor-pointer"
                      title="Share on Facebook"
                    >
                      <Facebook className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={handleShareWhatsApp}
                      className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors cursor-pointer"
                      title="Share on WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600 fill-current" />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Extended Info Block inside Modal */}
          {(product.landingDescription || 
            product.banglaLandingDescription || 
            (product.images && product.images.filter(img => img).length > 0)) && (
            <div className="border-t border-gray-100 bg-gray-50/50 p-6 sm:p-8 space-y-8 rounded-b-3xl">
              
              {/* Info Title */}
              <div className="text-center space-y-1.5">
                <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-[#3730a3] text-[10px] font-black uppercase tracking-wider">
                  <span>✨</span> {lang === "bn" ? "বিস্তারিত পণ্য গ্যালারি" : "Auxiliary Showcase Gallery"}
                </span>
                <h4 className="text-base font-black text-gray-800">
                  {lang === "bn" ? "কেন এটি আমাদের অন্যতম সেরা প্রিমিয়াম কালেকশন?" : "Why choose our authentic signature collections?"}
                </h4>
              </div>

              {/* Long Description text if loaded */}
              {(product.landingDescription || product.banglaLandingDescription) && (
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs text-xs sm:text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                  {lang === "bn" 
                    ? product.banglaLandingDescription || product.landingDescription 
                    : product.landingDescription}
                </div>
              )}

              {/* Show more auxiliary photos */}
              {product.images && product.images.filter(img => img).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.images.filter(img => img).map((imgUrl, i) => (
                    <div key={i} className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs aspect-video relative group">
                      <img 
                        src={imgUrl} 
                        alt={`${product.name} showcase detail ${i + 1}`} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[9px] font-black px-2.5 py-0.5 rounded-md uppercase">
                        {lang === "bn" ? `বৈশিষ্ট্য ${i + 1}` : `Feature ${i + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
