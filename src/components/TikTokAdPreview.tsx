import React, { useState } from "react";
import { Product } from "../types";
import { Copy, Globe, Sparkles, AlertCircle, RefreshCw, Heart, MessageCircle, Share2, Play, Music, Flame, Star, Smartphone } from "lucide-react";

interface TikTokAdPreviewProps {
  products: Product[];
  lang: "bn" | "en";
}

export default function TikTokAdPreview({ products, lang }: TikTokAdPreviewProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [campaignLanguage, setCampaignLanguage] = useState<string>("bengali");
  const [adStyle, setAdStyle] = useState<string>("ugc_hook");
  const [adCopy, setAdCopy] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  
  // Custom TikTok interaction states
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Generate ad landing link
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://mystore.com";
  const campaignLink = `${appUrl}/?product=${selectedProduct?.id}&coupon=TT20&ref=tiktok_campaign`;

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
          platform: "tiktok",
          style: adStyle,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAdCopy(data.text);
          return;
        }
      }
      // Fallback
      const fallbackCopy = generateClientSimulatedTikTokCopy(selectedProduct.name, selectedProduct.price, campaignLanguage, adStyle);
      setAdCopy(fallbackCopy);
    } catch (err: any) {
      console.warn("API Server not available, using client fallback copy.", err);
      const fallbackCopy = generateClientSimulatedTikTokCopy(selectedProduct.name, selectedProduct.price, campaignLanguage, adStyle);
      setAdCopy(fallbackCopy);
    } finally {
      setLoading(false);
    }
  };

  // Helper to generate local simulated copies
  const generateClientSimulatedTikTokCopy = (productName: string, price: string | number, language: string, style: string): string => {
    const finalPrice = price ? `${price}/- BDT` : "সাশ্রয়ী মূল্য";
    if (language === "bengali") {
      let styleTitle = "ট্রেন্ডিং UGC (ইউজার জেনারেটেড কন্টেন্ট) হুক";
      let hookVO = `"ফেসবুক আর টিকটকে এই প্রোডাক্টটা এতবার দেখেছি যে শেষমেশ কিনেই ফেললাম! আর সত্যি বলতে..."`;
      
      if (style === "problem_solution") {
        styleTitle = "সমস্যা ও সমাধান স্টাইল (Pain-point Solver)";
        hookVO = `"আপনার কি প্রতিদিন এই ধরণের সমস্যায় পড়তে হয়? তাহলে এই ভিডিওটি আপনার জন্যই!"`;
      } else if (style === "asmr_unboxing") {
        styleTitle = "ASMR ও এস্থেটিক আনবক্সিং";
        hookVO = `"*প্রোডাক্ট খোলার সুন্দর মৃদু শব্দ* আহ! এবার দেখুন আসল প্রিমিয়াম কোয়ালিটি কাকে বলে..."`;
      } else if (style === "direct_promo") {
        styleTitle = "সরাসরি ধামাকা অফার প্রোমো";
        hookVO = `"থামুন! আপনি কি এখনও বাজারে সেরা মূল্যে সঠিক প্রোডাক্টটি খুঁজছেন? আজই অর্ডার করুন!"`;
      }

      return `🎬 [ভিডিও আইডিয়া]: ${styleTitle} - "আমার জীবন বদলে দেওয়া একটি প্রোডাক্ট!"

🕒 ০:০০ - ০:০৩ [ভিডিও দৃশ্য]: প্রোডাক্টটি আনবক্স করা হচ্ছে, ব্যাকগ্রাউন্ডে একটি ট্রেন্ডিং আপবিট মিউজিক বাজছে।
🎙️ [ভয়েসওভার]: ${hookVO}

🕒 ০:০৩ - ০:১২ [ভিডিও দৃশ্য]: প্রোডাক্টটির প্রিমিয়াম ফিনিশ ক্লোজ-আপে দেখানো হচ্ছে এবং কীভাবে ব্যবহার করতে হয় তা দেখানো হচ্ছে।
🎙️ [ভয়েসওভার]: "এর কোয়ালিটি সত্যিই অসাধারণ! এটি আপনার প্রতিদিনের কাজকে করে তুলবে অনেক সহজ আর আরামদায়ক।"

🕒 ০:১২ - ০:১৫ [ভিডিও দৃশ্য]: ফোনের স্ক্রিনে লাইভ কুরিয়ার ট্র্যাকিং ও ক্যাশ অন ডেলিভারি পার্সেল পাওয়ার দৃশ্য।
🎙️ [ভয়েসওভার]: "সবচেয়ে ভালো লেগেছে এদের লাইভ অর্ডার ট্র্যাকিং আর ক্যাশ অন ডেলিভারি সুবিধা!"

💬 [অন-স্ক্রিন ক্যাপশন বা সাবটাইটেল]:
👉 মাত্র ${finalPrice} টাকায় প্রিমিয়াম কোয়ালিটি!
👉 সারা বাংলাদেশে ক্যাশ অন ডেলিভারি!
👉 ঘরে বসেই লাইভ কুরিয়ার ট্র্যাকিং সুবিধা!

📝 [টিকটক পোস্ট ক্যাপশন]:
TikTok made me buy it! 😱 অবশেষে পেয়ে গেলাম আসল "${productName}"। কোয়ালিটি জাস্ট ওয়াও! এখনই অর্ডার করতে নিচের "Shop Now" বাটনে ক্লিক করুন! 👇✨
#tiktokmademebuyit #foryoupage #bangladesh #onlineshopping #premium #trending #viral`;
    } else {
      let styleTitle = "Trending UGC Hook";
      let hookVO = `"Okay, so I've been seeing this product all over my FYP, and I finally gave in and ordered it..."`;
      
      if (style === "problem_solution") {
        styleTitle = "Problem-Solution Style";
        hookVO = `"Are you tired of dealing with this annoying issue? Let me show you the ultimate life-saver!"`;
      } else if (style === "asmr_unboxing") {
        styleTitle = "Aesthetic ASMR Unboxing";
        hookVO = `"*Crisp unboxing sounds* Ah, the satisfying click of opening this premium parcel..."`;
      } else if (style === "direct_promo") {
        styleTitle = "Direct Crazy Offer Promo";
        hookVO = `"Stop scrolling! If you want the absolute best value with direct home delivery, listen closely!"`;
      }

      return `🎬 [Video Idea]: ${styleTitle} - "TikTok Made Me Buy It!"

🕒 0:00 - 0:03 [Visual]: Fast unboxing with a clean ASMR sound and upbeat trending background music.
🎙️ [Voiceover]: ${hookVO}

🕒 0:03 - 0:12 [Visual]: Close-up showing the premium textures and demonstrating how easily it works in real-time.
🎙️ [Voiceover]: "And honestly? It lives up to the hype! The quality is amazing and it literally saves so much time."

🕒 0:12 - 0:15 [Visual]: Showcasing the dynamic live courier tracking map on a mobile phone screen.
🎙️ [Voiceover]: "Plus, they have super fast cash on delivery and real-time live tracking!"

💬 [On-Screen Captions]:
👉 Premium quality for only ${finalPrice}!
👉 Fast Cash on Delivery Nationwide!
👉 Live Order Tracking Link!

📝 [TikTok Post Caption]:
Can't believe I waited this long to get the "${productName}"! 😍 Game changer and totally worth the hype. Get yours now with Cash on Delivery! 👇✨
#tiktokmademebuyit #trending #shopping #unboxing #ugc #foryoupage #viral`;
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

  // Extract only the caption block to display inside the TikTok overlay
  const getCaptionOnly = (): string => {
    if (!adCopy) return "";
    
    const captionMarker = lang === "bn" ? "📝 [টিকটক পোস্ট ক্যাপশন]:" : "📝 [TikTok Post Caption]:";
    const index = adCopy.indexOf(captionMarker);
    if (index !== -1) {
      return adCopy.substring(index + captionMarker.length).trim();
    }
    
    // Fallback split
    const parts = adCopy.split("📝");
    if (parts.length > 1) {
      return parts[1].replace(/\[.*\]\s*:/g, "").trim();
    }
    
    return adCopy.substring(0, 160) + "...";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameters Panel */}
      <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-xl font-bold font-mono">
            𝅘𝅥𝅮
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              {lang === "bn" ? "টিকটক অ্যাড মেকার" : "TikTok Ad Script Assistant"}
            </h3>
            <p className="text-xs text-gray-500">
              {lang === "bn"
                ? "ভিডিও কনসেপ্ট, ভয়েসওভার স্ক্রিপ্ট এবং ভাইরাল ক্যাপশন জেনারেট করুন।"
                : "Create high-converting video concepts, scripts, and captions for your products."}
            </p>
          </div>
        </div>

        {/* Product Select */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            {lang === "bn" ? "প্রোডাক্ট সিলেক্ট করুন" : "Select Product"}
          </label>
          <select
            id="tiktok-product-select"
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

        {/* Video Script Style */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            {lang === "bn" ? "টিকটক ভিডিও স্টাইল" : "TikTok Video Style"}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              { id: "ugc_hook", bn: "📢 ভাইরাল UGC হুক", en: "📢 Viral UGC Hook" },
              { id: "problem_solution", bn: "🛠️ সমস্যা ও সমাধান", en: "🛠️ Problem-Solution" },
              { id: "asmr_unboxing", bn: "🔊 ASMR আনবক্সিং", en: "🔊 ASMR Unboxing" },
              { id: "direct_promo", bn: "🔥 ধামাকা ডিসকাউন্ট", en: "🔥 Crazy Promo Offer" },
            ].map((style) => (
              <button
                key={style.id}
                type="button"
                onClick={() => {
                  setAdStyle(style.id);
                  setAdCopy("");
                }}
                className={`p-3 rounded-xl border text-xs font-bold text-left transition-all flex items-center justify-between cursor-pointer ${
                  adStyle === style.id
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{lang === "bn" ? style.bn : style.en}</span>
                {adStyle === style.id && <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
            {lang === "bn" ? "ক্যাপশন ও স্ক্রিপ্ট এর ভাষা" : "Voiceover & Caption Language"}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCampaignLanguage("bengali")}
              className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                campaignLanguage === "bengali"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🇧🇩 বাংলা (Bengali)
            </button>
            <button
              type="button"
              onClick={() => setCampaignLanguage("english")}
              className={`py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                campaignLanguage === "english"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🇺🇸 English
            </button>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateAd}
          disabled={loading || !selectedProduct}
          className="w-full bg-gradient-to-r from-red-500 via-slate-900 to-cyan-500 hover:opacity-95 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              {lang === "bn" ? "স্ক্রিপ্ট তৈরি হচ্ছে..." : "Generating Script..."}
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 animate-pulse" />
              {lang === "bn" ? "টিকটক ভিডিও স্ক্রিপ্ট জেনারেট করুন" : "Generate TikTok Ad Script"}
            </>
          )}
        </button>

        {/* Smart Campaign Link */}
        {selectedProduct && (
          <div className="pt-4 border-t border-gray-100 space-y-3">
            <div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide bg-slate-100 px-2.5 py-1 rounded-md inline-block">
                {lang === "bn" ? "টিকটক স্পেশাল লিংক" : "TikTok Special Link"}
              </span>
              <p className="text-[11px] text-gray-400 mt-1">
                {lang === "bn"
                  ? "এই লিংকটি আপনার টিকটক বায়ো বা অ্যাড ট্রাফিকে যোগ করুন। কাস্টমার সরাসরি পণ্যটিতে আসবে এবং ২০% ডিসকাউন্ট অ্যাক্টিভ হবে।"
                  : "Paste this deep-link in your TikTok bio or Ad campaign website link. Triggers a TT20 code on the product."}
              </p>
            </div>

            <div className="flex bg-gray-50 border border-gray-100 rounded-xl overflow-hidden p-1">
              <input
                type="text"
                readOnly
                value={campaignLink}
                className="flex-1 bg-transparent border-none text-xs text-gray-600 font-mono px-3 py-2 outline-none select-all"
              />
              <button
                onClick={() => copyToClipboard(campaignLink, "link")}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  lang === "bn" ? "কপি!" : "Copied!"
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

      {/* Mock TikTok Simulation Panel */}
      <div className="lg:col-span-7 flex flex-col md:flex-row gap-6 items-start">
        {/* Visual Live Mobile Preview */}
        <div className="w-full md:w-80 shrink-0">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-1">
            <Smartphone className="w-4 h-4 text-slate-800" />
            {lang === "bn" ? "টিকটক ফিড সিমুলেশন" : "TikTok Post Live Simulation"}
          </h4>

          {/* TikTok Phone Frame */}
          <div className="bg-black text-white w-full rounded-[40px] aspect-[9/16] relative overflow-hidden shadow-2xl border-[6px] border-slate-900 select-none">
            {/* Camera notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-900 rounded-full z-30"></div>

            {/* Inner background video block */}
            {selectedProduct ? (
              <div className="absolute inset-0 z-0">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover brightness-[0.4]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80"></div>
              </div>
            ) : (
              <div className="absolute inset-0 bg-neutral-900 z-0 flex items-center justify-center text-gray-500 font-mono text-xs">
                No Product Selected
              </div>
            )}

            {/* Header: Following vs For You */}
            <div className="absolute top-8 left-0 right-0 flex justify-center gap-4 text-xs font-bold z-20 text-white/70">
              <span className="hover:text-white cursor-pointer transition-colors">Following</span>
              <span className="text-white border-b-2 border-white pb-1 cursor-pointer">For You</span>
            </div>

            {/* Middle: Big Pulsing Play button overlay */}
            <div 
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-black/40 border border-white/20 flex items-center justify-center backdrop-blur-xs">
                  <Play className="w-8 h-8 text-white fill-white ml-1" />
                </div>
              )}
            </div>

            {/* Right side interactions panel */}
            <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5 z-20">
              {/* Creator Profile */}
              <div className="relative">
                <div className="w-11 h-11 rounded-full border-2 border-white bg-slate-800 flex items-center justify-center text-sm shadow">
                  🛍️
                </div>
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-red-500 text-white w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                  +
                </div>
              </div>

              {/* Likes */}
              <button 
                onClick={() => setIsLiked(!isLiked)}
                className="flex flex-col items-center cursor-pointer active:scale-95 transition-all"
              >
                <Heart className={`w-7 h-7 filter drop-shadow ${isLiked ? "text-red-500 fill-red-500 animate-bounce" : "text-white fill-white"}`} />
                <span className="text-[10px] font-bold mt-1 shadow-sm">{isLiked ? "10.4K" : "10.3K"}</span>
              </button>

              {/* Comments */}
              <div className="flex flex-col items-center">
                <MessageCircle className="w-7 h-7 text-white fill-white filter drop-shadow" />
                <span className="text-[10px] font-bold mt-1 shadow-sm">248</span>
              </div>

              {/* Shares */}
              <div className="flex flex-col items-center">
                <Share2 className="w-7 h-7 text-white fill-white filter drop-shadow" />
                <span className="text-[10px] font-bold mt-1 shadow-sm">942</span>
              </div>

              {/* Music Spinning disk */}
              <div className={`w-9 h-9 rounded-full bg-slate-900 border-4 border-slate-700/60 p-1 shadow flex items-center justify-center ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }}>
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500 to-red-500 flex items-center justify-center text-[8px]">
                  💿
                </div>
              </div>
            </div>

            {/* Bottom Overlay Info */}
            <div className="absolute left-4 bottom-4 right-16 z-20 space-y-2.5">
              <div className="space-y-1">
                <h5 className="font-bold text-[14px] text-white flex items-center gap-1.5">
                  @johurul.bdshop
                  <span className="bg-cyan-400 text-black text-[7px] px-1 rounded-sm font-black font-sans uppercase">AD</span>
                </h5>
                <p className="text-[11px] text-gray-200 line-clamp-3 leading-relaxed font-sans font-medium">
                  {adCopy ? getCaptionOnly() : (
                    lang === "bn" 
                      ? `টিকটকে ভাইরাল আসল "${selectedProduct?.name}"! 🔥 সাশ্রয়ী মূল্যে সরাসরি কাস্টম ট্র্যাকিং এবং ডিসকাউন্টে অর্ডার করতে নিচের "Shop Now" বাটনে ক্লিক করুন!`
                      : `Get the original "${selectedProduct?.name}" now! 🔥 Tap "Shop Now" to secure yours with direct live courier tracking and cashback deals!`
                  )}
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-300 font-bold bg-white/10 px-2 py-0.5 rounded-full w-fit">
                  <Music className="w-3 h-3 text-cyan-300 shrink-0" />
                  <span className="truncate max-w-[120px]">Original sound - johurul.bdshop</span>
                </div>
              </div>

              {/* In-feed Action Card (Shop Now Call to Action) */}
              <a
                href={campaignLink}
                target="_blank"
                rel="noreferrer"
                className="block bg-gradient-to-r from-cyan-500 to-red-500 hover:opacity-95 text-white text-center font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                {lang === "bn" ? "🛒 অর্ডার করুন (Shop Now)" : "🛒 Shop Now"}
              </a>
            </div>
          </div>
        </div>

        {/* Full Details Script Output on Right */}
        <div className="flex-1 space-y-4 w-full">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-4 h-4 text-purple-600" />
            {lang === "bn" ? "ভিডিও কনসেপ্ট ও ভয়েসওভার স্ক্রিপ্ট" : "UGC Video Script & Full Copywriting"}
          </h4>

          <div className="bg-slate-50 border border-gray-150 rounded-2xl p-5 min-h-[350px] font-sans flex flex-col justify-between">
            {loading ? (
              <div className="space-y-4 py-8">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
              </div>
            ) : adCopy ? (
              <div className="space-y-4 text-xs leading-relaxed text-gray-700">
                <div className="whitespace-pre-line font-medium text-gray-800">
                  {adCopy}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                <Flame className="w-10 h-10 text-orange-500 animate-pulse" />
                <p className="text-gray-400 italic text-xs max-w-xs">
                  {lang === "bn"
                    ? "বাম পাশের বাটনে ক্লিক করে টিকটকের জন্য স্ক্রিপ্ট ও ভয়েসওভার জেনারেট করুন।"
                    : "Generate your TikTok video screenplay script and voiceover scripts here."}
                </p>
              </div>
            )}

            {/* Copy Script text */}
            {adCopy && (
              <button
                onClick={() => copyToClipboard(adCopy, "text")}
                className="mt-5 w-full bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-colors"
              >
                <Copy className="w-3.5 h-3.5 text-slate-800" />
                <span>
                  {copiedText 
                    ? (lang === "bn" ? "সম্পূর্ণ স্ক্রিপ্ট কপি হয়েছে!" : "Full Script Copied!") 
                    : (lang === "bn" ? "সম্পূর্ণ স্ক্রিপ্ট কপি করুন (টিকটক মেকিং এর জন্য)" : "Copy Complete Script & Copywriting")}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
