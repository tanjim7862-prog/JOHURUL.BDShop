import React, { useState } from "react";
import { Product } from "../types";
import { Copy, Facebook, Globe, Sparkles, AlertCircle, Link, RefreshCw } from "lucide-react";

interface FacebookAdPreviewProps {
  products: Product[];
  lang: "bn" | "en";
}

export default function FacebookAdPreview({ products, lang }: FacebookAdPreviewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [campaignLanguage, setCampaignLanguage] = useState<string>("bengali");
  const [adCopy, setAdCopy] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Generate ad landing link
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://mystore.com";
  const campaignLink = `${appUrl}/?product=${selectedProduct?.id}&coupon=FB20&ref=facebook_campaign`;

  const handleGenerateAd = async () => {
    if (!selectedProduct) return;
    setLoading(true);
    setError(null);
    setAdCopy("");

    try {
      const response = await fetch("/api/marketing/ad-copy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productName: selectedProduct.name,
          description: selectedProduct.description,
          price: selectedProduct.price,
          category: selectedProduct.category,
          language: campaignLanguage,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAdCopy(data.text);
          return;
        }
      }
      // Fallback if response is not ok
      const fallbackCopy = generateClientSimulatedCopy(selectedProduct.name, selectedProduct.price, campaignLanguage);
      setAdCopy(fallbackCopy);
    } catch (err: any) {
      console.warn("API Server not available, using client fallback copy.", err);
      const fallbackCopy = generateClientSimulatedCopy(selectedProduct.name, selectedProduct.price, campaignLanguage);
      setAdCopy(fallbackCopy);
    } finally {
      setLoading(false);
    }
  };

  // Static generator helper for pure client-side/serverless environments (like static Vercel/Firebase)
  const generateClientSimulatedCopy = (productName: string, price: string | number, language: string): string => {
    const finalPrice = price ? `${price}/- BDT` : "সাশ্রয়ী মূল্য";
    if (language === "bengali" || language === "both") {
      return `🔥 সীমিত অফার! আপনার জন্য নিয়ে এলাম প্রিমিয়াম কোয়ালিটির "${productName}"!

🛒 আপনার দৈনন্দিন জীবনকে আরও সহজ ও আরামদায়ক করতে এই পণ্যটি অত্যন্ত কার্যকর। নিখুঁত ডিজাইন এবং দুর্দান্ত স্থায়িত্বের সাথে এটি দেবে দীর্ঘদিনের ব্যবহারযোগ্যতার নিশ্চয়তা।

কেন আমাদের থেকে "${productName}" কিনবেন?
✅ প্রিমিয়াম কোয়ালিটি এবং আকর্ষণীয় ফিনিশিং
✅ সেরা ও সাশ্রয়ী দাম - মাত্র ${finalPrice}
✅ সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি (Cash on Delivery)
✅ লাইভ অর্ডার ট্র্যাকিং সুবিধা (আপনার প্রোডাক্ট কোথায় আছে কুরিয়ার ট্র্যাকিং দিয়ে লাইভ দেখুন!)

🎁 বিশেষ ছাড় পেতে আজই সরাসরি অর্ডার করুন!
👉 অর্ডার করতে "Shop Now" বাটনে ক্লিক করুন অথবা পেজে ইনবক্স করুন।`;
    } else {
      return `🔥 SPECIAL OFFER! Introducing the Premium "${productName}"!

🛒 Designed to make your daily life easier and more comfortable, this product delivers exceptional performance. Built with high-quality materials, it guarantees durability and a modern look.

Why Choose Our "${productName}"?
✅ Premium quality with elegant finish
✅ Unbeatable price of only ${finalPrice}
✅ Super-fast Cash on Delivery all over Bangladesh
✅ Live Order Tracking (Track exactly where your parcel is!)

🎁 Click "Shop Now" to place your order or message our page to secure yours today!`;
    }
  };

  const copyToClipboard = (text: string, type: "text" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "text") {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameters Panel */}
      <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            {lang === "bn" ? "ফেসবুক অ্যাড ক্রিয়েটর" : "FB Ad Campaign Assistant"}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {lang === "bn"
              ? "জেসমিন এআই ৩.৫ ফ্ল্যাশ ব্যবহার করে আপনার পেজের জন্য আকর্ষণীয় বিজ্ঞাপনের লেখা এবং ল্যান্ডিং লিংক তৈরি করুন।"
              : "Generate conversion-focused Facebook ad copies and landing links automatically using Gemini 3.5."}
          </p>
        </div>

        {/* Product Select */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            {lang === "bn" ? "প্রোডাক্ট সিলেক্ট করুন" : "Select Product"}
          </label>
          <select
            id="ad-product-select"
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setAdCopy("");
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {lang === "bn" ? p.banglaName || p.name : p.name} — ৳{p.price}
              </option>
            ))}
          </select>
        </div>

        {/* Copywriting Language */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            {lang === "bn" ? "বিজ্ঞাপনের ভাষা" : "Ad Language"}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              id="lang-bn-btn"
              type="button"
              onClick={() => setCampaignLanguage("bengali")}
              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                campaignLanguage === "bengali"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🇧🇩 বাংলা (Bengali)
            </button>
            <button
              id="lang-en-btn"
              type="button"
              onClick={() => setCampaignLanguage("english")}
              className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                campaignLanguage === "english"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          id="generate-ad-btn"
          onClick={handleGenerateAd}
          disabled={loading || !selectedProduct}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all hover:shadow cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              {lang === "bn" ? "তৈরি হচ্ছে..." : "Generating..."}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              {lang === "bn" ? "ফেসবুক অ্যাড কপি জেনারেট করুন" : "Generate Facebook Ad Copy"}
            </>
          )}
        </button>

        {/* Campaign Smart Link */}
        {selectedProduct && (
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide bg-indigo-50 px-2.5 py-1 rounded-md inline-block">
                {lang === "bn" ? "স্মার্ট প্রচার লিংক" : "Smart Campaign Link"}
              </span>
              <p className="text-[11px] text-gray-400 mt-1">
                {lang === "bn"
                  ? "এই লিংকটি আপনার বিজ্ঞাপনে ব্যবহার করুন। লিংকে ক্লিক করলে কাস্টমার সরাসরি এই পণ্যটিতে প্রবেশ করবে এবং ২০% ডিসকাউন্ট কুপন সক্রিয় হবে।"
                  : "Use this link in your ad post. Clicking it deep-links visitors to this product with an auto-applied FB20 coupon."}
              </p>
            </div>

            <div className="flex bg-gray-50 border border-gray-100 rounded-xl overflow-hidden p-1">
              <input
                id="campaign-link-input"
                type="text"
                readOnly
                value={campaignLink}
                className="flex-1 bg-transparent border-none text-xs text-gray-600 font-mono px-3 py-2 outline-none select-all"
              />
              <button
                id="copy-link-btn"
                onClick={() => copyToClipboard(campaignLink, "link")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                {copiedLink ? (
                  lang === "bn" ? "কপি হয়েছে!" : "Copied!"
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    {lang === "bn" ? "কপি" : "Copy"}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mock Facebook Preview Panel */}
      <div className="lg:col-span-7 space-y-6">
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
          <Facebook className="w-4 h-4 text-[#1877F2]" />
          {lang === "bn" ? "ফেসবুক পোস্ট প্রিভিউ (মোবাইল ভিউ)" : "Facebook Post Live Simulation"}
        </h4>

        {/* Facebook Frame */}
        <div className="bg-gray-100 rounded-3xl p-4 max-w-md mx-auto border border-gray-200/60 shadow-sm">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 overflow-hidden text-sm">
            {/* Facebook Post Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center border border-indigo-200">
                  🛒
                </div>
                <div>
                  <div className="font-bold text-gray-900 flex items-center gap-1">
                    JOHURUL.BDShop
                    <span className="w-3.5 h-3.5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[8px]" title="Verified Page">✓</span>
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <span>Just now</span>
                    <span>·</span>
                    <Globe className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Simulated Post Content */}
            <div className="px-4 pb-3">
              {error && (
                <div className="bg-indigo-50 border border-indigo-800lue-100 text-indigo-900lue-600lue-600 rounded-lg p-3 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {loading ? (
                <div className="space-y-2 py-4">
                  <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                </div>
              ) : adCopy ? (
                <div className="whitespace-pre-line text-gray-800 text-[13px] leading-relaxed">
                  {adCopy}
                </div>
              ) : (
                <p className="text-gray-400 italic text-indigo-900enter py-6 text-xs">
                  {lang === "bn"
                    ? "বাম পাশের বাটনে ক্লিক করে এআই দিয়ে বিজ্ঞাপনটি লিখুন।"
                    : "Generate your AI-powered Facebook ad copywriting to preview here."}
                </p>
              )}
            </div>

            {/* Product Card Attachment inside Post */}
            {selectedProduct && (
              <div className="border-t border-gray-100 bg-gray-50">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full aspect-[1.91/1] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-4 flex items-center justify-between border-t border-gray-100">
                  <div className="flex-1 min-w-0 pr-4">
                    <span className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
                      JOHURUL.BDSHOP · {selectedProduct.category.toUpperCase()}
                    </span>
                    <h5 className="font-bold text-gray-900 mt-0.5 truncate">
                      {lang === "bn" ? selectedProduct.banglaName || selectedProduct.name : selectedProduct.name}
                    </h5>
                    <p className="text-xs text-[#3730a3] font-extrabold mt-0.5">
                      ৳{selectedProduct.price}{" "}
                      {selectedProduct.originalPrice && (
                        <span className="text-gray-400 line-through text-[11px] ml-1">
                          ৳{selectedProduct.originalPrice}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    id="shop-now-fb-mock"
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs py-2 px-3 rounded transition-colors uppercase whitespace-nowrap"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Copy Full Post Text Button */}
          {adCopy && (
            <button
              id="copy-post-btn"
              onClick={() => copyToClipboard(adCopy, "text")}
              className="mt-4 w-full bg-white hover:bg-gray-50 border border-gray-200 rounded-xl py-3 px-4 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Copy className="w-4 h-4 text-[#3730a3]" />
                  <span className="text-[#3730a3]">{lang === "bn" ? "বিজ্ঞাপনের লেখা কপি হয়েছে!" : "Ad Text Copied!"}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-indigo-600" />
                  <span>{lang === "bn" ? "বিজ্ঞাপনের লেখা কপি করুন (ফেসবুকে পোস্টের জন্য)" : "Copy Ad Copy (Ready for Facebook)"}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
