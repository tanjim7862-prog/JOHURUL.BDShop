import React, { useState, useEffect, useRef, useMemo } from "react";
import { Product } from "../types";
import { 
  Copy, Globe, Sparkles, AlertCircle, RefreshCw, Heart, MessageCircle, 
  Share2, Play, Pause, Music, Flame, Star, Smartphone, Settings, 
  Tv, Volume2, VolumeX, BarChart3, ShieldCheck, DollarSign, Send, 
  Layers, CheckCircle, ExternalLink, Calendar, Users, Eye, HelpCircle, Download
} from "lucide-react";

interface TikTokAdPreviewProps {
  products: Product[];
  lang: "bn" | "en";
}

export default function TikTokAdPreview({ products, lang }: TikTokAdPreviewProps) {
  // Config state
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || "");
  const [campaignLanguage, setCampaignLanguage] = useState<string>("bengali");
  const [adStyle, setAdStyle] = useState<string>("ugc_hook");
  const [adCopy, setAdCopy] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Clipboard states
  const [copiedText, setCopiedText] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // User TikTok ID setup
  const [tiktokUsername, setTiktokUsername] = useState<string>(() => {
    return localStorage.getItem("tiktok_username") || "@tanjim.shop";
  });
  const [isEditingId, setIsEditingId] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [publishToast, setPublishToast] = useState<string | null>(null);
  const [isDownloadingVideo, setIsDownloadingVideo] = useState<boolean>(false);

  // Real human-like TTS Voice States
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);
      
      if (voices.length > 0) {
        // Try to find a premium, realistic/natural online voice for the selected language
        const isEn = campaignLanguage === "english";
        const preferred = voices.find(v => {
          const nameLower = v.name.toLowerCase();
          const langLower = v.lang.toLowerCase();
          if (isEn) {
            return langLower.startsWith("en") && (nameLower.includes("natural") || nameLower.includes("google") || nameLower.includes("zira") || nameLower.includes("aria") || nameLower.includes("guy"));
          } else {
            return langLower.startsWith("bn") && (nameLower.includes("natural") || nameLower.includes("google") || nameLower.includes("nabanita") || nameLower.includes("sabina") || nameLower.includes("pradeep"));
          }
        });
        
        if (preferred) {
          setSelectedVoiceName(preferred.name);
        } else {
          const firstMatching = voices.find(v => isEn ? v.lang.toLowerCase().startsWith("en") : v.lang.toLowerCase().startsWith("bn"));
          if (firstMatching) {
            setSelectedVoiceName(firstMatching.name);
          } else if (voices[0]) {
            setSelectedVoiceName(voices[0].name);
          }
        }
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [campaignLanguage]);

  // 4 Scenes custom images state
  const [sceneImages, setSceneImages] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("tiktok_scene_images");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return ["", "", "", ""];
  });

  const updateSceneImage = (index: number, val: string) => {
    const updated = [...sceneImages];
    updated[index] = val;
    setSceneImages(updated);
    localStorage.setItem("tiktok_scene_images", JSON.stringify(updated));
  };

  // TikTok interaction simulations
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(10352);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // 25s AI Video Rendering Simulation State
  const [activeViewMode, setActiveViewMode] = useState<"script" | "ai_video" | "adsense">("ai_video");
  const [videoDuration, setVideoDuration] = useState<number>(25); // 25s fixed duration
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isRenderingVideo, setIsRenderingVideo] = useState<boolean>(false);
  const [videoRenderProgress, setVideoRenderProgress] = useState<number>(0);
  const [isRendered, setIsRendered] = useState<boolean>(false);

  // TikTok Ad-Sense Campaign Simulator States
  const [campaignName, setCampaignName] = useState<string>("");
  const [dailyBudget, setDailyBudget] = useState<number>(1500); // BDT
  const [campaignStatus, setCampaignStatus] = useState<"Draft" | "Reviewing" | "Active" | "Paused">("Draft");
  const [targetAudience, setTargetAudience] = useState<string>("Bangladesh, 18-35, All Genders");
  const [pixelEventLog, setPixelEventLog] = useState<Array<{id: string, event: string, time: string, revenue?: number}>>([]);
  
  // Simulated Analytics stats
  const [impressions, setImpressions] = useState<number>(0);
  const [clicks, setClicks] = useState<number>(0);
  const [conversions, setConversions] = useState<number>(0);
  const [revenue, setRevenue] = useState<number>(0);

  // References
  const playbackIntervalRef = useRef<any>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  const selectedProduct = products.find((p) => p.id === selectedProductId) || products[0];

  // Dynamic values
  const appUrl = typeof window !== "undefined" ? window.location.origin : "https://mystore.com";
  const campaignLink = `${appUrl}/?product=${selectedProduct?.id}&coupon=TT20&ref=tiktok_campaign&creator=${tiktokUsername.replace("@", "")}`;

  // Pre-configured automated script slideshow scenes - Exactly 25 Seconds Total
  const slideScenes = [
    {
      timeRange: [0, 6],
      subtitleBn: `🔥 টিকটকে এই ভাইরাল প্রোডাক্টটা অবশেষে পেয়ে গেলাম! মাত্র ৳${selectedProduct?.price}!`,
      subtitleEn: `🔥 Finally got this viral TikTok product! Only ৳${selectedProduct?.price}!`,
      bgEffect: "scale-110 duration-5000 brightness-90 saturate-120",
      vocalBn: `ফেসবুক আর টিকটকে এই অরিজিনাল ভাইরাল প্রোডাক্টটা এতবার দেখেছি যে শেষমেশ কিনেই ফেললাম! মাত্র ${selectedProduct?.price} টাকা!`,
      vocalEn: "Okay, so I've been seeing this product all over my FYP, and I finally gave in and ordered it!"
    },
    {
      timeRange: [6, 13],
      subtitleBn: `✨ ১০০% অরিজিনাল প্রিমিয়াম কোয়ালিটি ও চমৎকার বিল্ড ফিনিশিং।`,
      subtitleEn: `✨ 100% Original premium build quality & sleek finish.`,
      bgEffect: "translate-x-3 translate-y-2 scale-105 duration-10000 brightness-75",
      vocalBn: "এর বিল্ড কোয়ালিটি এবং ফিনিশিং জাস্ট চমৎকার! দৈনন্দিন ব্যবহারের জন্য এটি অত্যন্ত আরামদায়ক এবং টেকসই।",
      vocalEn: "The premium design is absolutely beautiful. It makes your daily routine so seamless and comfortable."
    },
    {
      timeRange: [13, 19],
      subtitleBn: `🚚 সারা বাংলাদেশে দ্রুত ক্যাশ অন ডেলিভারি ও লাইভ কুরিয়ার ট্র্যাকিং!`,
      subtitleEn: `🚚 Super-fast Cash on Delivery nationwide with live tracking maps!`,
      bgEffect: "scale-115 -rotate-1 duration-8000 brightness-50",
      vocalBn: "সবচেয়ে ভালো লেগেছে এদের দ্রুত ক্যাশ অন ডেলিভারি এবং লাইভ কুরিয়ার ট্র্যাকিং সুবিধা! ঘরে বসেই ট্র্যাক করা যায়।",
      vocalEn: "The best part is their interactive live courier tracking and reliable cash on delivery. Track your parcel easily!"
    },
    {
      timeRange: [19, 25],
      subtitleBn: `🎁 ২০% স্পেশাল ডিসকাউন্ট পেতে এখনই 'Shop Now' বাটনে ক্লিক করুন!`,
      subtitleEn: `🎁 Click the 'Shop Now' button below right now to claim 20% OFF!`,
      bgEffect: "scale-100 animate-pulse brightness-90",
      vocalBn: "সীমিত সময়ের বিশেষ ২০ পারসেন্ট ডিসকাউন্ট পেতে এখনই নিচের শপ নাও বাটনে ক্লিক করে আপনার অর্ডার কনফার্ম করুন!",
      vocalEn: "Click the Shop Now button right now to secure yours with a special twenty percent discount today!"
    }
  ];

  // Save TikTok Handle
  const handleSaveTiktokUsername = () => {
    let formatted = tiktokUsername.trim();
    if (formatted && !formatted.startsWith("@")) {
      formatted = "@" + formatted;
    }
    setTiktokUsername(formatted || "@tanjim.shop");
    localStorage.setItem("tiktok_username", formatted || "@tanjim.shop");
    setIsEditingId(false);
  };

  // Setup initial copy or mock values on startup
  useEffect(() => {
    if (selectedProduct) {
      const initialCopy = generateClientSimulatedTikTokCopy(
        selectedProduct.name,
        selectedProduct.price,
        campaignLanguage,
        adStyle
      );
      setAdCopy(initialCopy);
    }
  }, [selectedProductId, campaignLanguage, adStyle]);

  // Video render effect simulation
  const triggerAutoVideoRender = () => {
    setIsRenderingVideo(true);
    setVideoRenderProgress(0);
    setIsRendered(false);
    setCurrentTime(0);
    setCurrentSlideIndex(0);

    const interval = setInterval(() => {
      setVideoRenderProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRenderingVideo(false);
          setIsRendered(true);
          setIsPlaying(true);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  // Video Timeline & Speech Synthesis Loop
  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          let nextTime = prev + 1;
          if (nextTime > 30) {
            nextTime = 0; // Loop
            window.speechSynthesis.cancel();
          }
          return nextTime;
        });
      }, 1000);
    } else {
      clearInterval(playbackIntervalRef.current);
      window.speechSynthesis.cancel();
    }

    return () => {
      clearInterval(playbackIntervalRef.current);
      window.speechSynthesis.cancel();
    };
  }, [isPlaying]);

  // Handle slide transitions & dynamic TTS voice trigger
  useEffect(() => {
    const matchedSlide = slideScenes.findIndex(
      (slide) => currentTime >= slide.timeRange[0] && currentTime < slide.timeRange[1]
    );
    if (matchedSlide !== -1 && matchedSlide !== currentSlideIndex) {
      setCurrentSlideIndex(matchedSlide);
      
      // Speak Voiceover aloud if not muted and active tab is ai_video
      if (isPlaying && !isMuted && activeViewMode === "ai_video") {
        playSceneSpeech(matchedSlide);
      }
    }
  }, [currentTime, isPlaying, isMuted, activeViewMode]);

  // Trigger TTS speech for current scene
  const playSceneSpeech = (index: number) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const scene = slideScenes[index];
    const textToSpeak = campaignLanguage === "bengali" ? scene.vocalBn : scene.vocalEn;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Choose appropriate voice/language attributes
    utterance.lang = campaignLanguage === "bengali" ? "bn-BD" : "en-US";
    
    // Select the user-specified realistic voice
    if (selectedVoiceName) {
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.name === selectedVoiceName);
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
    }

    // Set more natural human rate and pitch
    const isNatural = selectedVoiceName.toLowerCase().includes("natural") || selectedVoiceName.toLowerCase().includes("online");
    utterance.rate = isNatural ? 1.0 : (campaignLanguage === "bengali" ? 1.1 : 1.0);
    utterance.pitch = isNatural ? 1.0 : 1.05;

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Manual play sound
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      // Unmuting, speak right away
      playSceneSpeech(currentSlideIndex);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  // Live Simulated Adsense campaign stats update ticker
  useEffect(() => {
    let analyticsInterval: any = null;
    if (campaignStatus === "Active") {
      analyticsInterval = setInterval(() => {
        setImpressions((prev) => prev + Math.floor(15 + Math.random() * 35));
        setClicks((prev) => prev + Math.floor(1 + Math.random() * 4));
        
        // Randomly simulate purchases / conversions
        if (Math.random() > 0.85) {
          setConversions((prev) => prev + 1);
          setRevenue((prev) => prev + Number(selectedProduct?.price || 1200));
          
          // Log a mock pixel event
          const now = new Date().toLocaleTimeString();
          const pId = `px-${Math.floor(1000 + Math.random() * 9000)}`;
          setPixelEventLog((prevLog) => [
            {
              id: pId,
              event: "CompletePayment",
              time: now,
              revenue: Number(selectedProduct?.price || 1200)
            },
            ...prevLog.slice(0, 8)
          ]);
        }
      }, 3000);
    }

    return () => clearInterval(analyticsInterval);
  }, [campaignStatus, selectedProductId]);

  const handleLaunchAdSense = () => {
    if (!campaignName.trim()) {
      alert(lang === "bn" ? "দয়া করে ক্যাম্পেইনের নাম দিন!" : "Please enter a Campaign Name!");
      return;
    }
    setCampaignStatus("Reviewing");
    
    // Auto active after 4 seconds
    setTimeout(() => {
      setCampaignStatus("Active");
      setImpressions(120);
      setClicks(18);
      setConversions(1);
      setRevenue(Number(selectedProduct?.price || 1200));
      
      const now = new Date().toLocaleTimeString();
      setPixelEventLog([
        { id: "px-9901", event: "PageView", time: now },
        { id: "px-9902", event: "InitiateCheckout", time: now },
        { id: "px-9903", event: "CompletePayment", time: now, revenue: Number(selectedProduct?.price || 1200) }
      ]);
    }, 3000);
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

  const handleGenerateAd = async () => {
    if (!selectedProduct) return;
    setLoading(true);
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
          triggerAutoVideoRender();
          return;
        }
      }
      const fallbackCopy = generateClientSimulatedTikTokCopy(selectedProduct.name, selectedProduct.price, campaignLanguage, adStyle);
      setAdCopy(fallbackCopy);
      triggerAutoVideoRender();
    } catch (err: any) {
      const fallbackCopy = generateClientSimulatedTikTokCopy(selectedProduct.name, selectedProduct.price, campaignLanguage, adStyle);
      setAdCopy(fallbackCopy);
      triggerAutoVideoRender();
    } finally {
      setLoading(false);
    }
  };

  const generateClientSimulatedTikTokCopy = (productName: string, price: string | number, language: string, style: string): string => {
    const finalPrice = price ? `${price}/- BDT` : "সাশ্রয়ী মূল্য";
    if (language === "bengali") {
      let styleTitle = "ট্রেন্ডিং UGC হুক";
      let hookVO = `"ফেসবুক আর টিকটকে এই প্রোডাক্টটা এতবার দেখেছি যে শেষমেশ কিনেই ফেললাম! আর সত্যি বলতে..."`;
      
      if (style === "problem_solution") {
        styleTitle = "সমস্যা ও সমাধান স্টাইল";
        hookVO = `"আপনার কি প্রতিদিন এই ধরণের সমস্যায় পড়তে হয়? তাহলে এই ভিডিওটি আপনার জন্যই!"`;
      } else if (style === "asmr_unboxing") {
        styleTitle = "ASMR ও এস্থেটিক আনবক্সিং";
        hookVO = `"*প্রোডাক্ট খোলার সুন্দর মৃদু শব্দ* আহ! এবার দেখুন আসল প্রিমিয়াম কোয়ালিটি..."`;
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

  const getCaptionOnly = (): string => {
    if (!adCopy) return "";
    const captionMarker = lang === "bn" ? "📝 [টিকটক পোস্ট ক্যাপশন]:" : "📝 [TikTok Post Caption]:";
    const index = adCopy.indexOf(captionMarker);
    if (index !== -1) {
      return adCopy.substring(index + captionMarker.length).trim();
    }
    const parts = adCopy.split("📝");
    if (parts.length > 1) {
      return parts[1].replace(/\[.*\]\s*:/g, "").trim();
    }
    return adCopy.substring(0, 160) + "...";
  };

  // Generate and download 9:16 Vertical TikTok Video File (.webm / .mp4) - 25s Duration
  const generateAndDownloadVideo = async () => {
    if (!selectedProduct) return;
    setIsDownloadingVideo(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 1280; // 9:16 TikTok Vertical Format
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context unavailable");

      // Preload image cache for 4 scenes
      const loadedImages: HTMLImageElement[] = await Promise.all(
        slideScenes.map(async (_, idx) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.src = sceneImages[idx] || selectedProduct.image;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          return img;
        })
      );

      // Set up AudioContext & MediaStreamAudioDestinationNode for audio capturing
      let audioCtx: AudioContext | null = null;
      let audioStream: MediaStream | null = null;
      let oscNode: OscillatorNode | null = null;

      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtx = new AudioContextClass();
          const dest = audioCtx.createMediaStreamDestination();
          audioStream = dest.stream;

          // Ambient melodic tone beat for background
          oscNode = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
          oscNode.type = "sine";
          oscNode.frequency.setValueAtTime(220, audioCtx.currentTime);
          oscNode.connect(gainNode);
          gainNode.connect(dest);
          oscNode.start();
        }
      } catch (e) {
        console.warn("Web Audio API stream capture setup notice:", e);
      }

      // Stream canvas + audio to MediaRecorder
      const canvasStream = canvas.captureStream(30);
      const tracks = [...canvasStream.getVideoTracks()];
      if (audioStream && audioStream.getAudioTracks().length > 0) {
        tracks.push(...audioStream.getAudioTracks());
      }
      const combinedStream = new MediaStream(tracks);

      let mimeType = "video/webm";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("video/mp4")) {
          mimeType = "video/mp4";
        } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp9")) {
          mimeType = "video/webm;codecs=vp9";
        }
      }

      const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });
      const chunks: Blob[] = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        if (oscNode) {
          try { oscNode.stop(); } catch (e) {}
        }
        if (audioCtx) {
          try { audioCtx.close(); } catch (e) {}
        }

        const ext = mimeType.includes("mp4") ? "mp4" : "webm";
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `tiktok_ad_25s_${selectedProduct.name.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsDownloadingVideo(false);

        const msg = lang === "bn"
          ? "✅ ২৫ সেকেন্ডের ভিডিও ও ভয়েসডাউনলোড সম্পন্ন! এবার টিকটকে আপলোড করুন।"
          : "✅ 25s Video & Voice download completed! Open TikTok Studio to upload.";
        setPublishToast(msg);
        setTimeout(() => setPublishToast(null), 5000);
      };

      mediaRecorder.start();

      let frame = 0;
      const totalFrames = 750; // Exactly 25 seconds at 30 fps
      let lastSpokenScene = -1;

      // Helper function to wrap text neatly on Canvas
      const drawWrappedText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        lineHeight: number
      ) => {
        const words = text.split(" ");
        let line = "";
        let currentY = y;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth && n > 0) {
            ctx.fillText(line, x, currentY);
            line = words[n] + " ";
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, x, currentY);
      };

      const interval = setInterval(() => {
        frame++;
        const currentSec = Math.floor(frame / 30);

        // Determine current scene index (0, 1, 2, 3)
        let activeSceneIdx = slideScenes.findIndex(
          (s) => currentSec >= s.timeRange[0] && currentSec < s.timeRange[1]
        );
        if (activeSceneIdx === -1) activeSceneIdx = 3;

        // Speak Voiceover aloud at scene transition points
        if (activeSceneIdx !== lastSpokenScene) {
          lastSpokenScene = activeSceneIdx;
          if (!isMuted) playSceneSpeech(activeSceneIdx);
        }

        const currentImg = loadedImages[activeSceneIdx] || loadedImages[0];

        // 1. Dark Slate Background
        ctx.fillStyle = "#090d16";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Animated Product Image Zoom
        if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
          const sceneFrame = frame % 180;
          const scale = 1 + (sceneFrame / 180) * 0.08;
          const w = canvas.width * scale;
          const h = canvas.height * scale;
          const x = (canvas.width - w) / 2;
          const y = (canvas.height - h) / 2;
          ctx.drawImage(currentImg, x, y, w, h);
        }

        // 3. Dark Gradient Overlay for Maximum Legibility
        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "rgba(0,0,0,0.55)");
        grad.addColorStop(0.5, "rgba(0,0,0,0.25)");
        grad.addColorStop(1, "rgba(0,0,0,0.95)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 4. Offer Badge Pill
        ctx.fillStyle = "#e11d48";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(35, 70, 260, 52, 26);
        else ctx.rect(35, 70, 260, 52);
        ctx.fill();
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px sans-serif";
        ctx.fillText("⚡ ২০% ডিসকাউন্ট অফার", 52, 103);

        // 5. Price Tag Badge
        ctx.fillStyle = "rgba(15, 23, 42, 0.9)";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(canvas.width - 240, 70, 205, 52, 26);
        else ctx.rect(canvas.width - 240, 70, 205, 52);
        ctx.fill();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#38bdf8";
        ctx.font = "bold 24px sans-serif";
        ctx.fillText(`৳ ${selectedProduct.price}`, canvas.width - 215, 103);

        // 6. Beautiful Subtitle Box with Wrapped Bengali Text
        ctx.fillStyle = "rgba(0, 0, 0, 0.82)";
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(35, canvas.height - 320, canvas.width - 70, 160, 20);
        else ctx.rect(35, canvas.height - 320, canvas.width - 70, 160);
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = "#facc15";
        ctx.font = 'bold 26px "Kalpurush", "SolaimanLipi", "Segoe UI", sans-serif';
        const activeSubtitle = campaignLanguage === "bengali"
          ? slideScenes[activeSceneIdx]?.subtitleBn || selectedProduct.name
          : slideScenes[activeSceneIdx]?.subtitleEn || selectedProduct.name;

        drawWrappedText(activeSubtitle, 55, canvas.height - 275, canvas.width - 110, 36);

        // 7. TikTok Creator Handle & Product Title
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 28px sans-serif";
        ctx.fillText(`${tiktokUsername}`, 40, canvas.height - 110);

        ctx.fillStyle = "#cbd5e1";
        ctx.font = "bold 20px sans-serif";
        ctx.fillText(`${selectedProduct.name.substring(0, 32)} • ৳${selectedProduct.price}`, 40, canvas.height - 75);

        // 8. 25-Second Animated Timeline Progress Bar
        ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
        ctx.fillRect(0, canvas.height - 12, canvas.width, 12);

        const progressRatio = frame / totalFrames;
        ctx.fillStyle = "#22d3ee";
        ctx.fillRect(0, canvas.height - 12, canvas.width * progressRatio, 12);

        if (frame >= totalFrames) {
          clearInterval(interval);
          mediaRecorder.stop();
        }
      }, 33);

    } catch (err) {
      console.error("Video export failed:", err);
      setIsDownloadingVideo(false);
    }
  };

  // Auto copy payload & trigger video download & deep link publisher
  const triggerTiktokDeepLinkPublish = () => {
    const postCaption = getCaptionOnly() || `${selectedProduct?.name} 🛒 ${selectedProduct ? "৳" + selectedProduct.price : ""}! Direct Link inside Bio! #tiktokmademebuyit #foryoupage #viral`;
    const fullPayload = `${postCaption}\n\n👉 Order Link: ${campaignLink}\n👤 Creator: ${tiktokUsername}`;
    
    try {
      navigator.clipboard.writeText(fullPayload);
    } catch {
      // Fallback
    }

    // Trigger video download automatically
    generateAndDownloadVideo();

    const toastMsg = lang === "bn" 
      ? "🎥 ভিডিও ফাইল সেভ হচ্ছে & ক্যাপশন কপি হয়েছে! টিকটক আপলোড পেজে ফাইলটি সিলেক্ট করুন।" 
      : "🎥 Video downloading & Captions copied! Open TikTok Studio to upload.";
      
    setPublishToast(toastMsg);
    setTimeout(() => setPublishToast(null), 5000);

    // Open TikTok upload link
    setTimeout(() => {
      window.open(`https://www.tiktok.com/upload?caption=${encodeURIComponent(postCaption)}`, "_blank");
      setShowGuideModal(true);
    }, 500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      
      {/* LEFT PARAMETERS PANEL */}
      <div className="lg:col-span-5 bg-white border border-gray-100 rounded-3xl p-6 shadow-xs space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-black text-cyan-400 font-black text-xl flex items-center justify-center shadow-lg">
              𝅘𝅥𝅮
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-rose-500 animate-pulse" />
                {lang === "bn" ? "এআই টিকটক অ্যাড ক্রিয়েটর" : "AI TikTok Video Ads Creator"}
              </h3>
              <p className="text-[11px] text-gray-500 font-medium">
                {lang === "bn" ? "এআই স্ক্রিপ্ট, ৩০ সেঃ ভয়েসওভার ও অ্যাডসেন্স ক্যাম্পেইন" : "AI Video, Voiceover Synthesizer & Ad Manager"}
              </p>
            </div>
          </div>
        </div>

        {/* CONNECTED TIKTOK ID SETTINGS */}
        <div className="bg-gradient-to-r from-cyan-900 via-slate-900 to-rose-950 p-4 rounded-2xl text-white shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-widest">
                {lang === "bn" ? "টিকটক আইডি কানেকশন" : "TikTok Creator ID Account"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowGuideModal(true)}
                className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 px-2 py-1 rounded-md transition-all font-bold cursor-pointer flex items-center gap-1"
              >
                <HelpCircle className="w-3 h-3 text-cyan-300" />
                {lang === "bn" ? "পোস্টিং গাইড" : "Posting Guide"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditingId(!isEditingId)}
                className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md transition-all font-bold cursor-pointer"
              >
                {isEditingId ? (lang === "bn" ? "বাতিল" : "Cancel") : (lang === "bn" ? "পরিবর্তন" : "Edit")}
              </button>
            </div>
          </div>

          {isEditingId ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={tiktokUsername}
                onChange={(e) => setTiktokUsername(e.target.value)}
                placeholder="@username"
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono"
              />
              <button
                type="button"
                onClick={handleSaveTiktokUsername}
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                {lang === "bn" ? "সংরক্ষণ" : "Save"}
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono text-sm font-black text-white">{tiktokUsername}</span>
                <p className="text-[10px] text-gray-300">
                  {lang === "bn" ? "ক্যাম্পেইন ট্র্যাকিং লিংকে এই ক্রিয়েটর আইডি যোগ হবে" : "Tracking links will deep-link back to this account"}
                </p>
              </div>
              <span className="text-xl">🔥</span>
            </div>
          )}
        </div>

        {/* Product Select */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            {lang === "bn" ? "প্রোডাক্ট সিলেক্ট করুন" : "Select Product"}
          </label>
          <select
            value={selectedProductId}
            onChange={(e) => {
              setSelectedProductId(e.target.value);
              setAdCopy("");
              setIsRendered(false);
              setCurrentTime(0);
            }}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
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
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            {lang === "bn" ? "টিকটক ভিডিও থিম স্টাইল" : "TikTok Video Theme Style"}
          </label>
          <div className="grid grid-cols-2 gap-2.5">
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
                  setIsRendered(false);
                }}
                className={`p-3 rounded-xl border text-[10px] font-black text-left transition-all flex items-center justify-between cursor-pointer ${
                  adStyle === style.id
                    ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{lang === "bn" ? style.bn : style.en}</span>
                {adStyle === style.id && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            {lang === "bn" ? "ক্যাপশন ও এআই ভয়েস ভাষা" : "Voiceover & Caption Language"}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => {
                setCampaignLanguage("bengali");
                setAdCopy("");
                setIsRendered(false);
              }}
              className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                campaignLanguage === "bengali"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🇧🇩 বাংলা (Bengali)
            </button>
            <button
              type="button"
              onClick={() => {
                setCampaignLanguage("english");
                setAdCopy("");
                setIsRendered(false);
              }}
              className={`py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                campaignLanguage === "english"
                  ? "bg-slate-900 border-slate-900 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              🇺🇸 English Voice
            </button>
          </div>
        </div>

        {/* Real Human-Like Voice Customizer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              {lang === "bn" ? "🎙️ এআই ভয়েসওভার কণ্ঠস্বর" : "🎙️ AI Voiceover Speaker"}
            </label>
            <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full text-[#3730a3] text-[9px] font-black uppercase tracking-wider animate-pulse">
              ✨ {lang === "bn" ? "রিয়েল হিউম্যান ভয়েস" : "Real Human Voice"}
            </span>
          </div>

          <div className="space-y-1.5">
            <select
              value={selectedVoiceName}
              onChange={(e) => setSelectedVoiceName(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
            >
              {availableVoices.filter(v => {
                const isBn = v.lang.toLowerCase().startsWith("bn") || v.lang.toLowerCase().startsWith("ben");
                return campaignLanguage === "bengali" ? isBn : !isBn && v.lang.toLowerCase().startsWith("en");
              }).map((voice) => {
                // Prettify voice name
                let cleanName = voice.name;
                if (voice.name.includes("Microsoft") && voice.name.includes("Natural")) {
                  cleanName = `🗣️ Premium Natural: ${voice.name.replace("Microsoft", "").replace("Online (Natural)", "").replace(" - Bengali (Bangladesh)", "").replace(" - Bengali (India)", "").trim()}`;
                } else if (voice.name.includes("Google")) {
                  cleanName = `🤖 Google Assistant: ${voice.name.replace("Google", "").trim()}`;
                } else if (voice.name.includes("Natural")) {
                  cleanName = `✨ Real Voice: ${voice.name}`;
                } else {
                  cleanName = `👤 Device Default: ${voice.name}`;
                }
                return (
                  <option key={voice.name} value={voice.name}>
                    {cleanName} ({voice.lang})
                  </option>
                );
              })}
              {availableVoices.filter(v => {
                const isBn = v.lang.toLowerCase().startsWith("bn") || v.lang.toLowerCase().startsWith("ben");
                return campaignLanguage === "bengali" ? isBn : !isBn && v.lang.toLowerCase().startsWith("en");
              }).length === 0 && (
                <option value="">
                  {lang === "bn" ? "🗣️ ডিভাইস ডিফল্ট বাংলা ভয়েস" : "🗣️ Device Default Voice"}
                </option>
              )}
            </select>

            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-2.5 space-y-1">
              <p className="text-[10px] text-indigo-900 font-extrabold flex items-start gap-1 leading-normal">
                <span>💡</span>
                <span>
                  {lang === "bn" 
                    ? "টিপসঃ অসাধারণ রিয়েল মানুষের মতো ইমোশনাল কণ্ঠস্বর শুনতে 'Microsoft Edge' অথবা 'Google Chrome' ব্রাউজার ব্যবহার করুন। ক্রোম/এজে 'Premium Natural' বা 'Nabanita' ভয়েসটি সিলেক্ট করুন।" 
                    : "Tip: For breathtakingly realistic, professional human speech, open this app in 'Microsoft Edge' or 'Google Chrome' and choose the 'Premium Natural' or 'Nabanita' voice profile."}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Slideshow Image Manager (4 Scenes) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
              {lang === "bn" ? "📸 স্লাইডশো ইমেজ ম্যানেজার (৪টি দৃশ্য)" : "📸 Slideshow Image Manager (4 Scenes)"}
            </label>
            <button
              type="button"
              onClick={() => {
                if (confirm(lang === "bn" ? "আপনি কি সবগুলো স্লাইডের ছবি রিসেট করতে চান?" : "Are you sure you want to reset all custom slide images?")) {
                  const reseted = ["", "", "", ""];
                  setSceneImages(reseted);
                  localStorage.removeItem("tiktok_scene_images");
                }
              }}
              className="text-[10px] text-red-500 hover:text-red-600 font-bold flex items-center gap-1 cursor-pointer transition-all"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              {lang === "bn" ? "সব রিসেট" : "Reset All"}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((index) => {
              const sceneNum = index + 1;
              const currentImg = sceneImages[index] || selectedProduct?.image || "";
              const isCustom = !!sceneImages[index];
              
              const sceneLabelsBn = [
                "১ম দৃশ্য: হুক ওপেনার",
                "২য় দৃশ্য: প্রোডাক্ট বিবরণ",
                "৩য় দৃশ্য: ডেলিভারি ও ট্র্যাকিং",
                "৪র্থ দৃশ্য: ডিসকাউন্ট ও CTA"
              ];
              const sceneLabelsEn = [
                "Scene 1: Hook Opener",
                "Scene 2: Specs & Details",
                "Scene 3: Delivery & Track",
                "Scene 4: Discount & CTA"
              ];

              return (
                <div key={index} className="border border-gray-150 rounded-2xl p-2.5 bg-gray-50/50 flex flex-col justify-between space-y-2 relative group hover:border-gray-300 transition-all">
                  {/* Header info */}
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-slate-800 leading-none">
                      {lang === "bn" ? sceneLabelsBn[index] : sceneLabelsEn[index]}
                    </span>
                    {isCustom && (
                      <span className="text-[8px] bg-cyan-100 text-cyan-800 font-black px-1.5 py-0.5 rounded-md leading-none">
                        {lang === "bn" ? "কাস্টম" : "Custom"}
                      </span>
                    )}
                  </div>
                  
                  {/* Thumbnail Preview and Upload */}
                  <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded-xl bg-gray-200 overflow-hidden shrink-0 border border-gray-200 relative">
                      {currentImg ? (
                        <img src={currentImg} alt={`Scene ${sceneNum}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">🖼️</div>
                      )}
                    </div>
                    
                    {/* Upload Button */}
                    <div className="flex-1 min-w-0">
                      <label className="block w-full text-center bg-white hover:bg-gray-100 border border-gray-200 hover:border-gray-300 rounded-lg py-1 px-1 text-[9px] font-black text-gray-700 cursor-pointer transition-all truncate">
                        {lang === "bn" ? "📤 আপলোড" : "📤 Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === "string") {
                                  updateSceneImage(index, reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* Link paste input */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={lang === "bn" ? "ছবির লিংক..." : "Image URL..."}
                      value={sceneImages[index]}
                      onChange={(e) => updateSceneImage(index, e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg pl-1.5 pr-6 py-1 text-[9px] text-gray-700 font-medium focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                    {isCustom && (
                      <button
                        type="button"
                        onClick={() => updateSceneImage(index, "")}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 p-0.5 cursor-pointer leading-none text-[10px]"
                        title="Clear custom image"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateAd}
          disabled={loading || !selectedProduct}
          className="w-full bg-gradient-to-r from-cyan-500 via-rose-500 to-yellow-500 hover:opacity-95 disabled:from-gray-400 disabled:to-gray-500 text-white font-black text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              {lang === "bn" ? "ভিডিও ও স্ক্রিপ্ট তৈরি হচ্ছে..." : "Rendering Script & Voiceover..."}
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 animate-pulse text-white" />
              {lang === "bn" ? "এআই টিকটক ভিডিও স্ক্রিপ্ট জেনারেট করুন" : "Generate AI TikTok Video Script"}
            </>
          )}
        </button>

        {/* PROMINENT TIKTOK POST & DOWNLOAD BUTTONS */}
        <div className="pt-2 space-y-2">
          <button
            type="button"
            onClick={generateAndDownloadVideo}
            disabled={!selectedProduct || isDownloadingVideo}
            className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-slate-700"
          >
            <Download className={`w-4 h-4 text-cyan-400 ${isDownloadingVideo ? "animate-bounce" : ""}`} />
            <span>
              {isDownloadingVideo 
                ? (lang === "bn" ? "ভিডিও তৈরি ও ডাউনলোড হচ্ছে..." : "Downloading Video MP4...") 
                : (lang === "bn" ? "📥 ভিডিও ফাইল ডাউনলোড করুন (.mp4)" : "📥 Download Video MP4 File")}
            </span>
          </button>

          <button
            type="button"
            onClick={triggerTiktokDeepLinkPublish}
            disabled={!selectedProduct}
            className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-cyan-500 hover:from-rose-500 hover:to-cyan-400 disabled:opacity-50 text-white font-black text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-rose-200 transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
          >
            <Send className="w-4 h-4 animate-bounce" />
            <span>
              {lang === "bn" ? "🚀 ১-ক্লিকে টিকটকে পোস্ট করুন (Post to TikTok)" : "🚀 1-Click Post to TikTok Now"}
            </span>
          </button>
          <p className="text-[10px] text-gray-500 text-center mt-1 font-medium">
            {lang === "bn"
              ? "ভিডিও অটো-ডাউনলোড হবে, ক্যাপশন কপি হবে এবং টিকটক আপলোড পেজ ওপেন হবে"
              : "Auto-downloads video, copies viral caption & opens tiktok.com/upload"}
          </p>
        </div>

        {/* Deep Link Bio Integration Card */}
        {selectedProduct && (
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-wider bg-rose-50 px-2.5 py-0.5 rounded-full">
                {lang === "bn" ? "অটোমেটেড ডিসকাউন্ট লিংক" : "Dynamic Bio Landing Link"}
              </span>
              <span className="text-[9px] font-mono text-gray-400">Coupon: TT20</span>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              {lang === "bn"
                ? "এই লিংক দিয়ে ক্লিক করলে কাস্টমার সরাসরি ডিসকাউন্টে অর্ডার ট্র্যাক করতে পারবে।"
                : "Copy this dynamic link to your TikTok Bio or Ad button URL to automatically apply a 20% discount."}
            </p>

            <div className="flex bg-gray-50 border border-gray-200 rounded-xl overflow-hidden p-1">
              <input
                type="text"
                readOnly
                value={campaignLink}
                className="flex-1 bg-transparent border-none text-[10px] text-gray-600 font-mono px-2 py-1.5 outline-none select-all"
              />
              <button
                onClick={() => copyToClipboard(campaignLink, "link")}
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg px-3 py-1 text-[10px] font-bold transition-all cursor-pointer"
              >
                {copiedLink ? (lang === "bn" ? "কপি!" : "Copied!") : (lang === "bn" ? "কপি" : "Copy")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT PREVIEW & AD-SENSE HUB */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* VIEW NAVIGATION TABS */}
        <div className="flex bg-gray-100 p-1 rounded-2xl gap-1">
          <button
            onClick={() => setActiveViewMode("ai_video")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeViewMode === "ai_video"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-500" />
            {lang === "bn" ? "এআই ভিডিও প্লেয়ার" : "30s AI Video Player"}
          </button>
          
          <button
            onClick={() => setActiveViewMode("script")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeViewMode === "script"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            {lang === "bn" ? "কপিরাইটিং স্ক্রিপ্ট" : "Copywriting Script"}
          </button>

          <button
            onClick={() => setActiveViewMode("adsense")}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
              activeViewMode === "adsense"
                ? "bg-white text-gray-900 shadow-xs border border-gray-200/50"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-rose-600" />
            {lang === "bn" ? "টিকটক অ্যাডসেন্স" : "TikTok Ads Manager"}
          </button>
        </div>

        {/* RENDER VIEW: 30s AI VIDEO PLAYER */}
        {activeViewMode === "ai_video" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Live TikTok Phone Frame with Animated Slide Show */}
            <div className="md:col-span-6 w-full max-w-[280px] mx-auto shrink-0">
              
              {/* TikTok Phone Frame */}
              <div className="bg-black text-white w-full rounded-[40px] aspect-[9/16] relative overflow-hidden shadow-2xl border-[6px] border-slate-950 select-none">
                
                {/* Camera notch */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-950 rounded-full z-30"></div>

                {/* Video Render Progress overlay */}
                {isRenderingVideo && (
                  <div className="absolute inset-0 bg-black/90 z-40 flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
                    <div>
                      <h5 className="font-bold text-xs text-white">
                        {lang === "bn" ? "এআই ভিডিও রেন্ডার হচ্ছে..." : "Rendering 30s AI Video..."}
                      </h5>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {lang === "bn" ? "ভয়েসওভার ও সাবটাইটেল সিঙ্ক হচ্ছে" : "Aligning voice track & captions"}
                      </p>
                    </div>
                    <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-cyan-400 to-rose-500 h-full transition-all" style={{ width: `${videoRenderProgress}%` }}></div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400">{videoRenderProgress}%</span>
                  </div>
                )}

                {/* Inner background video block */}
                {selectedProduct ? (
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    {/* Animated zoom photo slideshow representing the timeline */}
                    <img
                      src={sceneImages[currentSlideIndex] || selectedProduct?.image || ""}
                      alt={selectedProduct.name}
                      className={`w-full h-full object-cover brightness-[0.4] transition-all transform ${slideScenes[currentSlideIndex]?.bgEffect}`}
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/95"></div>

                    {/* Fun overlay element: Dynamic Discount Badge */}
                    <div className="absolute top-16 left-4 bg-gradient-to-r from-red-600 to-rose-600 text-[9px] font-black uppercase px-2.5 py-1 rounded-full text-white shadow-md animate-bounce">
                      ⚡ 20% OFF TODAY
                    </div>
                    
                    {/* Live Courier Tracking Demo overlay on scene 2 */}
                    {currentSlideIndex === 2 && (
                      <div className="absolute inset-x-4 top-1/4 bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/15 animate-fade-in text-left">
                        <div className="flex items-center justify-between text-[8px] text-cyan-300 font-bold uppercase tracking-wider mb-1.5">
                          <span>📦 Live Tracking Active</span>
                          <span className="text-white">ID: TRK-92410</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                            <div className="bg-cyan-400 h-full w-2/3 animate-pulse"></div>
                          </div>
                          <p className="text-[8px] text-gray-300 font-medium">Parcel departed Dhaka Hub. Next stop: Cash on Delivery destination.</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-neutral-900 z-0 flex items-center justify-center text-gray-500 font-mono text-xs">
                    No Product Selected
                  </div>
                )}

                {/* Header: Following vs For You */}
                <div className="absolute top-8 left-0 right-0 flex justify-center gap-4 text-xs font-bold z-20 text-white/70">
                  <span className="hover:text-white cursor-pointer transition-colors text-[10px]">Following</span>
                  <span className="text-white border-b-2 border-white pb-1 cursor-pointer text-[10px]">For You</span>
                </div>

                {/* Play/Pause controls overlay */}
                <div 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                >
                  {!isPlaying && !isRenderingVideo && (
                    <div className="w-14 h-14 rounded-full bg-black/50 border border-white/20 flex items-center justify-center backdrop-blur-xs">
                      <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Right side interactions panel */}
                <div className="absolute right-2 bottom-24 flex flex-col items-center gap-4.5 z-20">
                  {/* Creator Profile */}
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full border border-white bg-slate-800 flex items-center justify-center text-xs shadow-md">
                      🛍️
                    </div>
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 text-white w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold">
                      +
                    </div>
                  </div>

                  {/* Likes */}
                  <button 
                    onClick={() => {
                      setIsLiked(!isLiked);
                      setLikesCount((prev) => isLiked ? prev - 1 : prev + 1);
                    }}
                    className="flex flex-col items-center cursor-pointer active:scale-95 transition-all"
                  >
                    <Heart className={`w-6 h-6 filter drop-shadow ${isLiked ? "text-red-500 fill-red-500 animate-bounce" : "text-white fill-white"}`} />
                    <span className="text-[9px] font-bold mt-0.5 shadow-sm">{likesCount.toLocaleString()}</span>
                  </button>

                  {/* Comments */}
                  <div className="flex flex-col items-center">
                    <MessageCircle className="w-6 h-6 text-white fill-white filter drop-shadow" />
                    <span className="text-[9px] font-bold mt-0.5 shadow-sm">248</span>
                  </div>

                  {/* Share button */}
                  <button 
                    onClick={triggerTiktokDeepLinkPublish}
                    className="flex flex-col items-center cursor-pointer hover:opacity-80 active:scale-90"
                  >
                    <Share2 className="w-6 h-6 text-cyan-400 fill-cyan-400 filter drop-shadow animate-pulse" />
                    <span className="text-[8px] font-bold text-cyan-300 mt-0.5">{lang === "bn" ? "পাবলিশ" : "Publish"}</span>
                  </button>

                  {/* Music Spinning disk */}
                  <div className={`w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-700 p-1 shadow flex items-center justify-center ${isPlaying ? "animate-spin" : ""}`} style={{ animationDuration: "6s" }}>
                    <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500 to-red-500 flex items-center justify-center text-[7px]">
                      💿
                    </div>
                  </div>
                </div>

                {/* Bottom Overlay Info & Kinetic Subtitles */}
                <div className="absolute left-3 bottom-3 right-12 z-20 space-y-2 text-left">
                  
                  {/* Dynamic Interactive Subtitle Block */}
                  <div className="bg-black/60 backdrop-blur-xs rounded-xl p-2.5 border border-white/10 shadow-lg min-h-[44px] flex items-center">
                    <p className="text-[10px] font-bold text-yellow-300 leading-tight tracking-wide animate-pulse">
                      {campaignLanguage === "bengali" 
                        ? slideScenes[currentSlideIndex]?.subtitleBn 
                        : slideScenes[currentSlideIndex]?.subtitleEn
                      }
                    </p>
                  </div>

                  <div className="space-y-0.5">
                    <h5 className="font-bold text-[12px] text-white flex items-center gap-1">
                      {tiktokUsername}
                      <span className="bg-cyan-400 text-black text-[6px] px-1 rounded-xs font-black font-sans uppercase">AD</span>
                    </h5>
                    <p className="text-[10px] text-gray-300 line-clamp-1 truncate font-sans font-medium">
                      {selectedProduct ? `Original ${selectedProduct.name} ৳${selectedProduct.price}` : ""}
                    </p>
                    <div className="flex items-center gap-1 text-[9px] text-gray-300 font-bold bg-white/10 px-2 py-0.5 rounded-full w-fit">
                      <Music className="w-2.5 h-2.5 text-cyan-300 shrink-0" />
                      <span className="truncate max-w-[100px]">TikTok AI Voice - 30s</span>
                    </div>
                  </div>

                  {/* In-feed Action Card (Shop Now Call to Action) */}
                  <a
                    href={campaignLink}
                    target="_blank"
                    rel="noreferrer"
                    className="block bg-gradient-to-r from-cyan-500 to-rose-500 hover:opacity-95 text-white text-center font-black py-2 rounded-xl text-[10px] uppercase tracking-wider shadow-md active:scale-[0.98] transition-all cursor-pointer"
                  >
                    {lang === "bn" ? "🛒 অর্ডার করুন (Shop Now)" : "🛒 Shop Now"}
                  </a>
                </div>
              </div>

              {/* Direct Post Button under Phone Frame */}
              <div className="mt-3 w-full bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border border-cyan-500/40 rounded-2xl p-3 text-white flex items-center justify-between shadow-lg">
                <div className="text-left">
                  <span className="text-[9px] font-extrabold text-cyan-400 uppercase tracking-wider block">
                    {lang === "bn" ? "✨ ভিডিও ও স্ক্রিপ্ট রেডি!" : "✨ Video & Script Ready!"}
                  </span>
                  <span className="text-xs font-black text-white">
                    {lang === "bn" ? "১-ক্লিকে টিকটকে পোস্ট করুন" : "1-Click Post to TikTok"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={triggerTiktokDeepLinkPublish}
                  className="bg-gradient-to-r from-cyan-400 to-rose-500 hover:from-cyan-300 hover:to-rose-400 text-black font-black text-xs px-3.5 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                >
                  <Send className="w-3.5 h-3.5 text-black" />
                  <span>{lang === "bn" ? "পোস্ট করুন" : "Post Now"}</span>
                </button>
              </div>
            </div>

            {/* AI Voice Generator Controls and Audio Timeline on Right */}
            <div className="flex-1 space-y-4 w-full">
              
              <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 border border-slate-800 shadow-lg text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {lang === "bn" ? "এআই ভয়েসওভার প্লেয়ার (৩০ সেঃ)" : "AI Text-to-Speech Voice (30s)"}
                      </h4>
                      <p className="text-[10px] text-gray-400">
                        {lang === "bn" ? "সরাসরি ব্রাউজারে এআই ভয়েসওভার শুনতে পাবেন" : "Synthesizes voice track directly in browser"}
                      </p>
                    </div>
                  </div>

                  {/* Sound on/off controls */}
                  <button
                    onClick={toggleMute}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      isMuted 
                        ? "bg-rose-500/20 border-rose-500 text-rose-400" 
                        : "bg-cyan-500/10 border-cyan-500/30 text-cyan-400"
                    }`}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Progress bar timeline */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>Scene {currentSlideIndex + 1}/4</span>
                    <span>0:0{currentTime} / 0:30</span>
                  </div>
                  <div className="bg-slate-800 h-2 rounded-full overflow-hidden relative cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = clickX / rect.width;
                    setCurrentTime(Math.floor(percent * 30));
                  }}>
                    <div 
                      className="bg-gradient-to-r from-cyan-400 to-rose-400 h-full transition-all duration-300" 
                      style={{ width: `${(currentTime / 30) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Mini scene visualizer list */}
                <div className="space-y-2">
                  {slideScenes.map((scene, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setCurrentTime(scene.timeRange[0]);
                        setCurrentSlideIndex(idx);
                        if (isPlaying && !isMuted) playSceneSpeech(idx);
                      }}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                        currentSlideIndex === idx
                          ? "bg-slate-800 border-cyan-400 text-white"
                          : "bg-slate-950/40 border-slate-800/60 text-gray-400 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex justify-between text-[9px] font-mono font-bold mb-1">
                        <span>Scene {idx + 1} ({scene.timeRange[0]}s-{scene.timeRange[1]}s)</span>
                        <span className="text-cyan-400">{idx === 0 ? "Hook opener" : idx === 1 ? "Product specs" : idx === 2 ? "Delivery info" : "CTA Offer"}</span>
                      </div>
                      <p className="text-[10px] line-clamp-1 leading-tight">
                        {campaignLanguage === "bengali" ? scene.subtitleBn : scene.subtitleEn}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Audio voice help */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 flex gap-2 items-start text-left">
                  <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="text-[9px] text-gray-400 leading-relaxed">
                    {lang === "bn"
                      ? "উপরে প্লে বাটনে ক্লিক করলে আপনার স্পিকার দিয়ে বাংলা এআই ভয়েসওভার বাজবে। সম্পূর্ণ ফ্রি এবং মোবাইল ফ্রেন্ডলি।"
                      : "Hit Play on the phone above. Real TTS voiceover track reads the generated video narration automatically!"}
                  </p>
                </div>
              </div>

              {/* TikTok Direct Publish Trigger */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 space-y-3 text-left">
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-cyan-600" />
                  {lang === "bn" ? "টিকটকে সরাসরি পাবলিশ করুন" : "Direct Share & Publish Tool"}
                </h5>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {lang === "bn"
                    ? "বাটনে ক্লিক করলে আপনার ভাইরাল ক্যাপশন এবং ভিডিও মেকিং স্ক্রিপ্ট অটো-কপি হয়ে যাবে এবং টিকটক আপলোড পেজ ওপেন হবে।"
                    : "One-click to copy the generated script details, viral post captions, hashtags, and directly open TikTok Creator upload."}
                </p>
                <button
                  onClick={triggerTiktokDeepLinkPublish}
                  className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-cyan-500 hover:from-rose-500 hover:to-cyan-400 text-white font-black text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 text-white animate-bounce" />
                  <span>
                    {lang === "bn" ? "🚀 ১-ক্লিকে টিকটকে পোস্ট করুন (Copy Caption & Open TikTok Upload)" : "🚀 1-Click Post to TikTok"}
                  </span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* RENDER VIEW: FULL COPYWRITING SCRIPT & 1-CLICK CAPTION BOX */}
        {activeViewMode === "script" && (
          <div className="space-y-4">
            {/* 1-CLICK DIRECT TIKTOK POST CAPTION COPY CARD */}
            <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 border border-rose-500/40 rounded-3xl p-6 text-left text-white space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center text-rose-400">
                    📋
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white uppercase tracking-wider">
                      {lang === "bn" ? "টিকটক পোস্ট ক্যাপশন ও বিবরণ (Copy Description)" : "TikTok Post Caption & Bio Description"}
                    </h4>
                    <p className="text-[10px] text-gray-300">
                      {lang === "bn" ? "সরাসরি কপি করে টিকটকে পেস্ট করুন" : "1-click copy & paste directly into TikTok Studio"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const postCaption = getCaptionOnly() || `TikTok made me buy it! 😱 অবশেষে পেয়ে গেলাম আসল "${selectedProduct?.name}"।\n💰 প্রোডাক্ট প্রাইস: ৳${selectedProduct?.price} (২০% ডিসকাউন্ট!)\n\n✨ বৈশিষ্ট্যসমূহ:\n• ১০০% অরিজিনাল প্রোডাক্ট\n• সারা বাংলাদেশে ক্যাশ অন ডেলিভারি\n• লাইভ অর্ডার ট্র্যাকিং লিংক সুবিধা\n\n🛒 অর্ডার লিংক: ${campaignLink}\n#tiktokmademebuyit #foryoupage #viral #bangladesh #onlineshopping #foryou`;
                    copyToClipboard(postCaption, "text");
                    setCopiedText(true);
                    setTimeout(() => setCopiedText(false), 2500);
                  }}
                  className="bg-gradient-to-r from-rose-500 to-cyan-500 hover:from-rose-400 hover:to-cyan-400 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95"
                >
                  <Copy className="w-4 h-4 text-white" />
                  <span>{copiedText ? (lang === "bn" ? "✅ ক্যাপশন কপি হয়েছে!" : "✅ Copied!") : (lang === "bn" ? "📋 ক্যাপশন কপি করুন" : "📋 Copy Caption")}</span>
                </button>
              </div>

              {/* Ready Description Preview Box */}
              <div className="bg-black/60 backdrop-blur-xs rounded-2xl p-4 border border-white/10 text-xs font-sans text-amber-200 leading-relaxed whitespace-pre-line font-medium select-all">
                {getCaptionOnly() || `TikTok made me buy it! 😱 অবশেষে পেয়ে গেলাম আসল "${selectedProduct?.name}"।
💰 প্রোডাক্ট প্রাইস: ৳${selectedProduct?.price} (২০% ডিসকাウント!)

✨ বৈশিষ্ট্যসমূহ:
• ১০০% অরিজিনাল ব্রান্ড নিউ প্রোডাক্ট
• সারা বাংলাদেশে ক্যাশ অন ডেলিভারি
• লাইভ অর্ডার ট্র্যাকিং লিংক সুবিধা

🛒 অর্ডার লিংক: ${campaignLink}
#tiktokmademebuyit #foryoupage #viral #bangladesh #onlineshopping #foryou`}
              </div>
            </div>

            {/* FULL VIDEO SCRIPT BLUEPRINT */}
            <div className="bg-slate-50 border border-gray-200/60 rounded-3xl p-6 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-gray-150 pb-3">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  {lang === "bn" ? "২৫ সেকেন্ড ভিডিও শুটিং ও ভয়েস স্ক্রিপ্ট" : "25s Video Shooting & Voice Blueprint"}
                </h4>
                <button
                  onClick={() => {
                    copyToClipboard(adCopy, "text");
                    setCopiedScript(true);
                    setTimeout(() => setCopiedScript(false), 2000);
                  }}
                  className="bg-white hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 font-bold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-700" />
                  <span>{copiedScript ? (lang === "bn" ? "কপি হয়েছে!" : "Copied!") : (lang === "bn" ? "সম্পূর্ণ স্ক্রিপ্ট কপি" : "Copy Full Blueprint")}</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-gray-100 min-h-[250px] shadow-2xs font-mono text-xs text-gray-700 whitespace-pre-line leading-relaxed">
                {adCopy || (lang === "bn" ? "এআই স্ক্রিপ্ট জেনারেট হচ্ছে..." : "Generating Copy blueprint...")}
              </div>
            </div>
          </div>
        )}

        {/* RENDER VIEW: TIKTOK ADSENSE / AD MANAGER */}
        {activeViewMode === "adsense" && (
          <div className="bg-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 text-left">
            
            {/* Header / Brand */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black tracking-wide uppercase text-white">
                    TikTok Ads Manager Lite
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {lang === "bn" ? "টিকটক পিক্সেল এবং রিয়েল-টাইম অ্যাড ট্র্যাকিং কনসোল" : "TikTok Pixel integration & Ads Campaign dashboard"}
                  </p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                campaignStatus === "Active" 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                  : campaignStatus === "Reviewing" 
                  ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse" 
                  : "bg-slate-800 text-slate-400"
              }`}>
                {campaignStatus}
              </span>
            </div>

            {/* Config & Launch Form */}
            {campaignStatus === "Draft" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === "bn" ? "ক্যাম্পেইন এর নাম" : "Campaign Name"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TikTok Smart Sale BDT"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === "bn" ? "দৈনিক বাজেট (৳ BDT)" : "Daily Budget (৳ BDT)"}
                    </label>
                    <input
                      type="number"
                      value={dailyBudget}
                      onChange={(e) => setDailyBudget(Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === "bn" ? "টার্গেট কাস্টমার" : "Target Audience"}
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      {lang === "bn" ? "পিক্সেল ট্র্যাকিং" : "TikTok Pixel Event Tracking"}
                    </label>
                    <div className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-emerald-400 font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>TikTok_Pixel_Active (Ready)</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLaunchAdSense}
                  className="w-full bg-gradient-to-r from-cyan-500 via-rose-500 to-yellow-500 text-white font-black text-xs py-3 px-4 rounded-xl hover:opacity-95 transition-all cursor-pointer text-center"
                >
                  🚀 {lang === "bn" ? "টিকটক অ্যাডসেন্স ক্যাম্পেইন রান করুন" : "Launch TikTok Ad Campaign"}
                </button>
              </div>
            )}

            {/* Reviewing Loader */}
            {campaignStatus === "Reviewing" && (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <RefreshCw className="w-10 h-10 text-cyan-400 animate-spin" />
                <h5 className="font-bold text-sm text-white">
                  {lang === "bn" ? "টিকটক পলিসি এবং পিক্সেল রিভিউ করা হচ্ছে..." : "TikTok Policy & Pixel Review..."}
                </h5>
                <p className="text-[10px] text-slate-400 max-w-xs">
                  {lang === "bn" ? "স্বয়ংক্রিয় এআই মডারেশন আপনার অ্যাড চেক করছে। কিছুক্ষণের মধ্যেই চালু হবে।" : "TikTok's automatic review system is processing your UGC landing script details."}
                </p>
              </div>
            )}

            {/* Active Analytics Dashboard */}
            {campaignStatus === "Active" && (
              <div className="space-y-6">
                
                {/* Stats Bento Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-slate-900 p-4 border border-slate-800 rounded-2xl">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">{lang === "bn" ? "ইম্প্রেশন" : "Impressions"}</span>
                    <p className="text-lg font-black font-mono text-white mt-1">{impressions.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900 p-4 border border-slate-800 rounded-2xl">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">{lang === "bn" ? "ক্লিক" : "Clicks"}</span>
                    <p className="text-lg font-black font-mono text-cyan-400 mt-1">{clicks.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900 p-4 border border-slate-800 rounded-2xl">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">{lang === "bn" ? "অর্ডার" : "Conversions"}</span>
                    <p className="text-lg font-black font-mono text-emerald-400 mt-1">{conversions.toLocaleString()}</p>
                  </div>
                  <div className="bg-slate-900 p-4 border border-slate-800 rounded-2xl">
                    <span className="text-[9px] text-slate-400 uppercase font-bold">{lang === "bn" ? "আরওএএস (ROAS)" : "Est. ROAS"}</span>
                    <p className="text-lg font-black font-mono text-yellow-400 mt-1">
                      {clicks > 0 ? `${((revenue / (clicks * 8)) || 4.2).toFixed(1)}x` : "4.5x"}
                    </p>
                  </div>
                </div>

                {/* Live Pixel Logs */}
                <div className="space-y-2">
                  <h5 className="text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>🔴 TikTok Pixel Events Log (Live)</span>
                    <span className="text-emerald-400 font-mono text-[9px]">Status: Active</span>
                  </h5>

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-h-[140px] overflow-y-auto space-y-2 font-mono text-[10px]">
                    {pixelEventLog.length > 0 ? (
                      pixelEventLog.map((log) => (
                        <div key={log.id} className="flex items-center justify-between border-b border-slate-800/60 pb-1.5 last:border-0 last:pb-0">
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-emerald-400 font-bold">{log.event}</span>
                            <span className="text-slate-500">[{log.id}]</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {log.revenue && <span className="text-yellow-400 font-bold">+৳{log.revenue}</span>}
                            <span className="text-slate-400">{log.time}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-slate-500 text-[10px]">
                        Waiting for target traffic landing page trigger...
                      </div>
                    )}
                  </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setCampaignStatus("Paused")}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs py-2.5 rounded-xl text-center cursor-pointer"
                  >
                    {lang === "bn" ? "ক্যাম্পেইন থামান" : "Pause Campaign"}
                  </button>
                  <button
                    onClick={() => {
                      setCampaignStatus("Draft");
                      setImpressions(0);
                      setClicks(0);
                      setConversions(0);
                      setRevenue(0);
                      setPixelEventLog([]);
                    }}
                    className="flex-1 bg-rose-900/30 text-rose-300 hover:bg-rose-950 border border-rose-800/40 font-bold text-xs py-2.5 rounded-xl text-center cursor-pointer"
                  >
                    {lang === "bn" ? "রিসেট ক্যাম্পেইন" : "Reset Campaign"}
                  </button>
                </div>

              </div>
            )}

            {/* Paused State */}
            {campaignStatus === "Paused" && (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-slate-400">
                  {lang === "bn" ? "ক্যাম্পেইনটি সাময়িকভাবে বন্ধ করা হয়েছে।" : "Campaign is currently paused."}
                </p>
                <button
                  onClick={() => setCampaignStatus("Active")}
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs py-2 px-4 rounded-xl transition-all cursor-pointer"
                >
                  {lang === "bn" ? "আবার চালু করুন" : "Resume Campaign"}
                </button>
              </div>
            )}

          </div>
        )}

      </div>

      {/* FLOATING TOAST NOTIFICATION */}
      {publishToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-cyan-400/40 flex items-center gap-3 animate-slide-in-up text-xs font-bold">
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
          <span>{publishToast}</span>
        </div>
      )}

      {/* TIKTOK POSTING INSTRUCTIONS GUIDE MODAL */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-6 text-left relative animate-scale-up">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black text-cyan-400 font-black text-xl flex items-center justify-center shadow-md">
                  𝅘𝅥𝅮
                </div>
                <div>
                  <h3 className="text-base font-black text-gray-900">
                    🚀 {lang === "bn" ? "টিকটক অ্যাকাউন্ট থেকে পোস্ট করার নির্দেশিকা" : "TikTok Direct Posting Guide"}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium">
                    {lang === "bn" ? "কীভাবে ১-ক্লিকে টিকটকে পোস্ট করবেন" : "Step-by-step account connection & 1-click publish"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full flex items-center justify-center font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Guide Steps */}
            <div className="space-y-4 text-xs text-gray-700 leading-relaxed">
              
              {/* Step 1 */}
              <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-black text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>{lang === "bn" ? "টিকটক আইডি লিঙ্ক করা (TikTok Creator ID Connection)" : "Step 1: Link Your TikTok Account"}</span>
                </div>
                <p className="text-[11px] text-gray-600 pl-7">
                  {lang === "bn"
                    ? 'অ্যাড মেকার ট্যাবে গেলে "টিকটক আইডি কানেকশন (TikTok Creator ID Account)" অপশন দেখতে পাবেন। সেখানে Edit / পরিবর্তন বাটনে ক্লিক করে আপনার টিকটক ইউজারনেম (যেমন: @yourusername) লিখে Save করে দিন।'
                    : "Go to the Ad Creator tab, click Edit under 'TikTok Creator ID Account', enter your username (e.g. @yourusername), and click Save."}
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-rose-50/70 border border-rose-100 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-rose-900 font-black text-xs uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>{lang === "bn" ? "🎥 টিকটক স্টুডিওতে আপলোড করার সহজ নিয়ম (Select Video Steps)" : "Step 2: Uploading Video on TikTok Studio"}</span>
                </div>
                <ul className="text-[11px] text-gray-700 pl-7 space-y-2 list-decimal font-medium">
                  <li>
                    <strong className="text-gray-900">{lang === "bn" ? "১. ভিডিও ডাউনলোড করুন:" : "1. Download Video:"}</strong>{" "}
                    {lang === "bn" 
                      ? 'আমাদের অ্যাপের "📥 ভিডিও ডাউনলোড করুন" বাটনে ক্লিক করুন। আপনার প্রোডাক্টের প্রমোশনাল ভিডিও (.mp4) কম্পিউটারে/ফোনে সেভ হবে।' 
                      : "Click 'Download Video MP4' button. The 9:16 ad video file will be saved to your device."}
                  </li>
                  <li>
                    <strong className="text-gray-900">{lang === "bn" ? "২. টিকটক আপলোডে সিলেক্ট করুন:" : "2. Select Video on TikTok:"}</strong>{" "}
                    {lang === "bn"
                      ? 'টিকটক স্টুডিওর স্ক্রিনে থাকা "Select video" বাটনে ক্লিক করে ডাউনলোডকৃত ভিডিও ফাইলটি সিলেক্ট করুন (বা ড্র্যাগ অ্যান্ড ড্রপ করুন)।'
                      : 'On TikTok Studio, click the red "Select video" button or drag and drop the downloaded video file.'}
                  </li>
                  <li>
                    <strong className="text-gray-900">{lang === "bn" ? "৩. ক্যাপশন পেস্ট করুন:" : "3. Paste Captions:"}</strong>{" "}
                    {lang === "bn"
                      ? 'ক্যাপশন বক্সে মাউসের রাইট ক্লিক করে Paste করুন (বা Ctrl+V চাপুন)। সমস্ত তথ্য, প্রাইস ও হ্যাশট্যাগ অটোমেটিক পেস্ট হয়ে যাবে!'
                      : 'Right click and Paste (or press Ctrl+V) in the Caption box. All pricing, offers, and hashtags will paste automatically!'}
                  </li>
                  <li>
                    <strong className="text-gray-900">{lang === "bn" ? "৪. পোস্ট বা ড্রাফট করুন:" : "4. Save as Draft or Post:"}</strong>{" "}
                    {lang === "bn"
                      ? 'পছন্দমতো Post বা Draft এ ক্লিক করে পোস্টটি সম্পন্ন করুন!'
                      : 'Click Post or Save as Draft to complete your TikTok post!'}
                  </li>
                </ul>
              </div>

              {/* Step 3 API Note */}
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>{lang === "bn" ? "💡 ব্যাকগ্রাউন্ড অটো-পোস্টিং ও টিকটক API সংক্রান্ত তথ্য" : "TikTok API & Web Share Info"}</span>
                </div>
                <p className="text-[10px] text-slate-300 leading-relaxed pl-6">
                  {lang === "bn"
                    ? "কোনো ব্রাউজার ইন্টারঅ্যাকশন ছাড়া ১-ক্লিক অটো-পাবলিশিংয়ের জন্য টিকটকের অফিশিয়াল TikTok Content Posting API (TikTok Developer OAuth) প্রয়োজন হয়। আমাদের সিস্টেমে TikTok Web Share Integration প্রস্তুত রাখা আছে, যার মাধ্যমে আপনার টিকটক আইডি সেভ রেখে কয়েক সেকেন্ডেই কন্টেন্ট শেয়ার ও পোস্ট করতে পারবেন!"
                    : "For direct background posting, TikTok Content Posting API OAuth is used. Our platform supports TikTok Web Share Integration to easily copy viral captions and deep-link directly into TikTok Upload with 1-click!"}
                </p>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition-all cursor-pointer shadow-md"
              >
                {lang === "bn" ? "ঠিক আছে, বুঝেছি" : "Got it!"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
