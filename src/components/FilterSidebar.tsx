import React, { useState } from "react";
import { Star, SlidersHorizontal, RotateCcw, X, Check } from "lucide-react";

export interface FilterSettings {
  priceMin: number;
  priceMax: number;
  minRating: number;
  stockStatus: "all" | "in_stock" | "out_of_stock";
  sortBy: "popularity" | "newest" | "price_low_high" | "price_high_low";
}

interface FilterSidebarProps {
  filters: FilterSettings;
  onChangeFilters: (filters: FilterSettings) => void;
  maxProductPrice: number;
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  getCategoryDisplayName: (category: string) => string;
  lang: "bn" | "en";
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export default function FilterSidebar({
  filters,
  onChangeFilters,
  maxProductPrice,
  categories,
  selectedCategory,
  onSelectCategory,
  getCategoryDisplayName,
  lang,
  isOpenMobile,
  onCloseMobile
}: FilterSidebarProps) {
  const [localPriceMax, setLocalPriceMax] = useState<number>(filters.priceMax || maxProductPrice);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalPriceMax(val);
    onChangeFilters({ ...filters, priceMax: val });
  };

  const handleRatingSelect = (rating: number) => {
    onChangeFilters({ ...filters, minRating: filters.minRating === rating ? 0 : rating });
  };

  const handleStockSelect = (status: "all" | "in_stock" | "out_of_stock") => {
    onChangeFilters({ ...filters, stockStatus: status });
  };

  const handleSortSelect = (sort: FilterSettings["sortBy"]) => {
    onChangeFilters({ ...filters, sortBy: sort });
  };

  const handleReset = () => {
    setLocalPriceMax(maxProductPrice);
    onChangeFilters({
      priceMin: 0,
      priceMax: maxProductPrice,
      minRating: 0,
      stockStatus: "all",
      sortBy: "popularity"
    });
    onSelectCategory("All");
  };

  const SidebarContent = () => (
    <div className="space-y-6">
      {/* Title & Reset Button */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-gray-900">
          <SlidersHorizontal className="w-4 h-4 text-[#3730a3]" />
          <span className="text-xs font-black uppercase tracking-wider">
            {lang === "bn" ? "ফিল্টার সমূহ" : "Filters & Sorting"}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="text-[10px] font-black uppercase text-[#3730a3] hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          {lang === "bn" ? "রিসেট" : "Reset"}
        </button>
      </div>

      {/* Sorting Methods */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">
          {lang === "bn" ? "সর্টিং (ক্রম বিন্যাস)" : "Sort By"}
        </h4>
        <div className="grid grid-cols-1 gap-1.5">
          {[
            { id: "popularity", labelBn: "জনপ্রিয়তা (বেস্ট সেলিং)", labelEn: "Popular / Best Sellers" },
            { id: "newest", labelBn: "নতুন প্রোডাক্ট", labelEn: "Newest Arrivals" },
            { id: "price_low_high", labelBn: "দামঃ কম থেকে বেশি", labelEn: "Price: Low to High" },
            { id: "price_high_low", labelBn: "দামঃ বেশি থেকে কম", labelEn: "Price: High to Low" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleSortSelect(item.id as FilterSettings["sortBy"])}
              className={`text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                filters.sortBy === item.id
                  ? "bg-indigo-50 text-[#3730a3] border-indigo-100"
                  : "bg-white hover:bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
              }`}
            >
              {lang === "bn" ? item.labelBn : item.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Category selection list */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">
          {lang === "bn" ? "ক্যাটাগরি" : "Categories"}
        </h4>
        <div className="flex flex-wrap md:flex-col gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`text-left px-3 py-1.5 md:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? "bg-[#3730a3] text-white border-indigo-700"
                  : "bg-white hover:bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
              }`}
            >
              {getCategoryDisplayName(cat)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">
            {lang === "bn" ? "মূল্য পরিসীমা (টাকা)" : "Price Range (BDT)"}
          </h4>
          <span className="text-[10px] font-black text-[#3730a3] bg-indigo-50 px-2 py-0.5 rounded-full">
            ৳0 - ৳{localPriceMax.toLocaleString()}
          </span>
        </div>
        <div className="space-y-1">
          <input
            type="range"
            min="0"
            max={maxProductPrice}
            step="50"
            value={localPriceMax}
            onChange={handlePriceChange}
            className="w-full accent-[#3730a3] cursor-pointer h-1.5 bg-gray-100 rounded-lg appearance-none"
          />
          <div className="flex justify-between text-[10px] text-gray-400 font-bold">
            <span>৳0</span>
            <span>৳{maxProductPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Star Ratings Filter */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">
          {lang === "bn" ? "রেটিং দিয়ে খুজুন" : "Customer Reviews"}
        </h4>
        <div className="grid grid-cols-1 gap-1.5">
          {[4.5, 4.0, 3.5].map((starVal) => (
            <button
              key={starVal}
              onClick={() => handleRatingSelect(starVal)}
              className={`flex items-center justify-between text-left px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                filters.minRating === starVal
                  ? "bg-indigo-50 text-[#3730a3] border-indigo-100"
                  : "bg-white hover:bg-gray-50 text-gray-600 border-gray-100 hover:border-gray-200"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(starVal) ? "fill-amber-400" : "text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {starVal.toFixed(1)} {lang === "bn" ? "ও তার উপরে" : "& Up"}
                </span>
              </div>
              {filters.minRating === starVal && (
                <Check className="w-3.5 h-3.5 text-[#3730a3]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Stock Status Filter */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-400">
          {lang === "bn" ? "স্টক প্রাপ্যতা" : "Availability"}
        </h4>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "all", labelBn: "সবই", labelEn: "All" },
            { id: "in_stock", labelBn: "স্টক আছে", labelEn: "In Stock" },
            { id: "out_of_stock", labelBn: "স্টক নাই", labelEn: "Out of Stock" }
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => handleStockSelect(status.id as any)}
              className={`text-center px-1.5 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer border ${
                filters.stockStatus === status.id
                  ? "bg-indigo-50 text-[#3730a3] border-indigo-100"
                  : "bg-white hover:bg-gray-50 text-gray-500 border-gray-100 hover:border-gray-200"
              }`}
            >
              {lang === "bn" ? status.labelBn : status.labelEn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Filter sidebar container */}
      <div className="hidden md:block w-64 bg-white border border-gray-100 rounded-3xl p-5 shadow-xs sticky top-24 h-fit">
        <SidebarContent />
      </div>

      {/* Mobile Drawer filter sidebar overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={onCloseMobile} 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />
          
          {/* Sidebar Drawer container */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 animate-slide-in-right">
            <div>
              {/* Drawer Close top bar */}
              <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                <span className="font-black text-xs uppercase text-gray-800">
                  {lang === "bn" ? "অ্যাডভান্সড ফিল্টার" : "Filter Catalog"}
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <SidebarContent />
            </div>

            {/* Footer with confirmation */}
            <div className="mt-8 pt-4 border-t border-gray-100">
              <button
                onClick={onCloseMobile}
                className="w-full bg-[#3730a3] hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-colors cursor-pointer text-center"
              >
                {lang === "bn" ? "ফিল্টার প্রয়োগ করুন" : "Apply Filters"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
