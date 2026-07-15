import React, { useState, useEffect, useRef } from "react";
import { Search, X, Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import { Product } from "../types";

interface SmartSearchBarProps {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectProduct: (product: Product) => void;
  lang: "bn" | "en";
  setCurrentView: (view: "shop" | "track" | "campaign" | "admin" | "account") => void;
}

export default function SmartSearchBar({
  products,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  lang,
  setCurrentView,
}: SmartSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter products based on search term
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 1) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const term = searchQuery.toLowerCase().trim();
    const filtered = products.filter((product) => {
      const matchEn = product.name?.toLowerCase().includes(term);
      const matchBn = product.banglaName?.toLowerCase().includes(term);
      const matchCat = product.category?.toLowerCase().includes(term);
      const matchDesc = product.description?.toLowerCase().includes(term) || 
                        product.banglaDescription?.toLowerCase().includes(term);
      return matchEn || matchBn || matchCat || matchDesc;
    });

    setSuggestions(filtered.slice(0, 6)); // limit to 6 suggestions
    setIsOpen(true);
    setActiveIndex(-1); // Reset index on new search
  }, [searchQuery, products]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[activeIndex]);
      } else {
        // Just trigger standard search search and close dropdown
        setCurrentView("shop");
        setIsOpen(false);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const handleSelectSuggestion = (product: Product) => {
    setSearchQuery("");
    setIsOpen(false);
    onSelectProduct(product);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div id="smart-search-container" ref={containerRef} className="relative w-full md:max-w-2xl">
      {/* Search Input Box */}
      <div className="w-full flex rounded-xl border border-indigo-200 focus-within:border-[#3730a3] focus-within:ring-2 focus-within:ring-indigo-100 bg-white overflow-hidden shadow-sm transition-all duration-200">
        <div className="flex items-center pl-3.5 text-gray-400">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          id="product-search-input"
          ref={inputRef}
          type="text"
          placeholder={
            lang === "bn"
              ? "জহুরুল বিডি-শপ এ অরিজিনাল প্রোডাক্ট খুঁজুন..."
              : "Search original products on JOHURUL.BDShop..."
          }
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-white text-sm text-gray-800 px-3 py-2.5 outline-none placeholder-gray-400 font-normal focus:ring-0"
        />

        {searchQuery && (
          <button
            id="clear-search-btn"
            type="button"
            onClick={clearSearch}
            className="p-2.5 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => {
            setCurrentView("shop");
            setIsOpen(false);
          }}
          className="px-6 bg-[#3730a3] hover:bg-[#4338ca] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shrink-0 border-l border-indigo-200"
        >
          <span>{lang === "bn" ? "খুঁজুন" : "SEARCH"}</span>
        </button>
      </div>

      {/* Auto-Suggestion Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-100 shadow-xl z-50 overflow-hidden divide-y divide-gray-50 animate-fade-in max-h-[380px] overflow-y-auto">
          {/* Header context */}
          <div className="bg-gray-50/70 px-4 py-2 flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#3730a3]" />
              {lang === "bn" ? "অটো-সাজেশন" : "Smart Suggestions"}
            </span>
            <span>
              {suggestions.length} {lang === "bn" ? "টি পণ্য পাওয়া গেছে" : "products found"}
            </span>
          </div>

          {/* Suggestions List */}
          <div className="p-1.5 space-y-0.5">
            {suggestions.map((product, index) => {
              const isSelected = index === activeIndex;
              const title = lang === "bn" ? product.banglaName || product.name : product.name;
              
              return (
                <div
                  key={product.id}
                  onClick={() => handleSelectSuggestion(product)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all ${
                    isSelected ? "bg-indigo-50/70 scale-[1.005]" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Thumbnail */}
                  <div className="w-11 h-11 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0 relative">
                    <img
                      src={product.image}
                      alt={title}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[8px] text-white font-black uppercase">
                        {lang === "bn" ? "স্টক শেষ" : "Out"}
                      </div>
                    )}
                  </div>

                  {/* Core Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold text-[#3730a3] bg-indigo-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.stock > 0 && product.stock <= 3 && (
                        <span className="text-[8px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                          {lang === "bn" ? "সীমিত স্টক" : "Low Stock"}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold text-gray-800 truncate mt-0.5">
                      {title}
                    </p>
                  </div>

                  {/* Pricing and Go Indicator */}
                  <div className="text-right shrink-0 pr-1">
                    <p className="text-xs font-extrabold text-[#3730a3]">
                      ৳{product.price}
                    </p>
                    {product.originalPrice && (
                      <p className="text-[10px] text-gray-400 line-through">
                        ৳{product.originalPrice}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* View Search Results Shortcut */}
          <div
            onClick={() => {
              setCurrentView("shop");
              setIsOpen(false);
            }}
            className="bg-indigo-50/20 hover:bg-indigo-50/50 px-4 py-3 text-center text-xs font-bold text-[#3730a3] transition-colors cursor-pointer flex items-center justify-center gap-1"
          >
            <span>{lang === "bn" ? "সব ফলাফল দেখতে এন্টার চাপুন" : "Press Enter to view all matching items"}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      )}
    </div>
  );
}
