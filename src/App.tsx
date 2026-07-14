import React, { useState, useEffect, useMemo } from "react";
import { Product, CartItem, Order, OrderStatus } from "./types";
import { INITIAL_PRODUCTS, BANGLADESH_DIVISIONS, DIVISION_TO_DISTRICTS, DISTRICT_TO_THANAS, createDefaultTrackingHistory } from "./data";
import ProductCard from "./components/ProductCard";
import TrackingTimeline from "./components/TrackingTimeline";
import FacebookAdPreview from "./components/FacebookAdPreview";
import AdminPanel from "./components/AdminPanel";
import { initFacebookPixel, initTikTokPixel, trackPixelEvent } from "./utils/pixel";
import watchBannerImg from "./assets/images/watch_banner_1784030925146.jpg";
import { 
  getProductsFromFirebase, 
  saveProductToFirebase, 
  deleteProductFromFirebase, 
  getOrdersFromFirebase, 
  saveOrderToFirebase,
  auth
} from "./utils/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { 
  ShoppingBag, Search, Filter, ShoppingCart, Plus, Minus, Trash2, 
  X, CheckCircle2, Truck, AlertCircle, Sparkles, HelpCircle, User,
  Globe, Landmark, ArrowRight, ShieldCheck, PhoneCall, MessageSquare
} from "lucide-react";

export default function App() {
  // Localization state
  const [lang, setLang] = useState<"bn" | "en">("bn");

  // Flash Sale Timer State
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 45, seconds: 30 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 3, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Core navigation state
  const [currentView, setCurrentView] = useState<"shop" | "track" | "campaign" | "admin">("shop");

  // Core admin credentials and session state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("mystore_admin_authenticated") === "true";
  });

  const [adminPassword, setAdminPassword] = useState<string>(() => {
    const saved = localStorage.getItem("mystore_admin_password");
    return saved || "ruma7862"; // updated default password
  });

  const [adminEmail, setAdminEmail] = useState<string>(() => {
    const saved = localStorage.getItem("mystore_admin_email");
    return saved || "admin@gms.com"; // default email
  });

  // State to toggle the visibility of the admin buttons/links
  const [showAdminEntryPoints, setShowAdminEntryPoints] = useState<boolean>(() => {
    return localStorage.getItem("mystore_show_admin_entry") === "true";
  });

  // Track secret brand clicks to reveal admin panel
  const [logoClickCount, setLogoClickCount] = useState<number>(0);
  const [lastLogoClickTime, setLastLogoClickTime] = useState<number>(0);

  // Parse URL search params to reveal admin panel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || params.get("manage") === "true" || params.get("secret") === "true") {
      setShowAdminEntryPoints(true);
      localStorage.setItem("mystore_show_admin_entry", "true");
    }
  }, []);

  const handleBrandClick = () => {
    const now = Date.now();
    if (now - lastLogoClickTime < 2000) {
      const nextCount = logoClickCount + 1;
      setLogoClickCount(nextCount);
      if (nextCount >= 5) {
        setShowAdminEntryPoints((prev) => {
          const newValue = !prev;
          localStorage.setItem("mystore_show_admin_entry", String(newValue));
          alert(
            newValue 
              ? (lang === "bn" 
                  ? "অ্যাডমিন প্রবেশদ্বার সক্রিয় করা হয়েছে! হেডার এবং ফুটার লিংকগুলোতে মালিকানার অপশন যোগ হয়েছে।" 
                  : "Owner entry points enabled! Admin link has been revealed in headers and footers.")
              : (lang === "bn"
                  ? "অ্যাডমিন প্রবেশদ্বার নিষ্ক্রিয় করা হয়েছে।"
                  : "Owner entry points hidden from storefront.")
          );
          return newValue;
        });
        setLogoClickCount(0);
      }
    } else {
      setLogoClickCount(1);
    }
    setLastLogoClickTime(now);
  };

  // Admin login and password management states
  const [typedEmail, setTypedEmail] = useState<string>("");
  const [typedPassword, setTypedPassword] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");
  const [isFirebaseAuthed, setIsFirebaseAuthed] = useState<boolean>(false);
  const [authWarning, setAuthWarning] = useState<string>("");

  // Firebase auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === adminEmail) {
        setIsAdminAuthenticated(true);
        setIsFirebaseAuthed(true);
        sessionStorage.setItem("mystore_admin_authenticated", "true");
      }
    });
    return () => unsubscribe();
  }, [adminEmail]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = typedEmail.trim();
    const passwordInput = typedPassword;

    // 1. Try Firebase Auth directly first
    try {
      await signInWithEmailAndPassword(auth, emailInput, passwordInput);
      setIsAdminAuthenticated(true);
      setIsFirebaseAuthed(true);
      sessionStorage.setItem("mystore_admin_authenticated", "true");
      setLoginError("");
      setAuthWarning("");
      setTypedPassword("");
      setTypedEmail("");
      return;
    } catch (fbErr: any) {
      console.warn("Firebase Auth direct login failed, checking local credentials:", fbErr);

      // 2. Fallback to local credentials
      if (emailInput === adminEmail && passwordInput === adminPassword) {
        setIsAdminAuthenticated(true);
        sessionStorage.setItem("mystore_admin_authenticated", "true");
        setLoginError("");
        setTypedPassword("");
        setTypedEmail("");
        setAuthWarning(
          lang === "bn"
            ? "লোকাল ভেরিফিকেশন সফল হয়েছে! ফায়ারবেস অথেনটিকেশন সক্রিয় করতে আপনার ফায়ারবেস কনসোলে 'admin@gms.com' ক্রিয়েট করুন।"
            : "Logged in via local fallback! To enable secure cloud writes, please enable Email/Password provider in Firebase and create this user."
        );
      } else {
        setLoginError(
          lang === "bn" 
            ? "ভুল আইডি অথবা পাসওয়ার্ড! আবার চেষ্টা করুন।" 
            : "Incorrect ID or Password! Please try again."
        );
      }
    }
  };

  const handleAdminLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out of Firebase:", err);
    }
    setIsAdminAuthenticated(false);
    setIsFirebaseAuthed(false);
    sessionStorage.removeItem("mystore_admin_authenticated");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = newPasswordInput.trim();
    if (cleanPin.length < 4) {
      alert(lang === "bn" ? "পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে!" : "Password must be at least 4 characters!");
      return;
    }
    setAdminPassword(cleanPin);
    localStorage.setItem("mystore_admin_password", cleanPin);
    setNewPasswordInput("");
    setIsChangingPassword(false);
    alert(lang === "bn" ? "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!" : "Password successfully updated!");
  };

  // Data persistence states
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("mystore_products");
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("mystore_orders");
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("mystore_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Load products and orders from Firebase on mount (Stale-While-Revalidate)
  useEffect(() => {
    async function fetchFirebaseData() {
      try {
        let fbProducts = await getProductsFromFirebase();
        if (fbProducts.length === 0) {
          console.log("Firestore products collection is empty. Seeding with INITIAL_PRODUCTS...");
          for (const prod of INITIAL_PRODUCTS) {
            await saveProductToFirebase(prod);
          }
          fbProducts = INITIAL_PRODUCTS;
        }
        setProducts(fbProducts);
        localStorage.setItem("mystore_products", JSON.stringify(fbProducts));
      } catch (err) {
        console.error("Firestore products fetch failed, using local cache:", err);
      }

      try {
        const fbOrders = await getOrdersFromFirebase();
        setOrders(fbOrders);
        localStorage.setItem("mystore_orders", JSON.stringify(fbOrders));
      } catch (err) {
        console.error("Firestore orders fetch failed, using local cache:", err);
      }
    }
    fetchFirebaseData();
  }, []);

  // Sync state helpers
  const updateProductsAndSync = async (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem("mystore_products", JSON.stringify(newProducts));
    try {
      // Find deleted
      const deleted = products.filter(p => !newProducts.some(np => np.id === p.id));
      for (const p of deleted) {
        await deleteProductFromFirebase(p.id);
      }
      // Find updated/added
      const upserted = newProducts.filter(np => {
        const current = products.find(p => p.id === np.id);
        return !current || JSON.stringify(current) !== JSON.stringify(np);
      });
      for (const p of upserted) {
        await saveProductToFirebase(p);
      }
    } catch (err) {
      console.error("Failed to sync products with Firestore:", err);
    }
  };

  const updateOrdersAndSync = async (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem("mystore_orders", JSON.stringify(newOrders));
    try {
      // Find updated/added
      const upserted = newOrders.filter(no => {
        const current = orders.find(o => o.id === no.id);
        return !current || JSON.stringify(current) !== JSON.stringify(no);
      });
      for (const o of upserted) {
        await saveOrderToFirebase(o);
      }
    } catch (err) {
      console.error("Failed to sync orders with Firestore:", err);
    }
  };

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [trackingSearchId, setTrackingSearchId] = useState<string>("");
  const [selectedOrderToTrack, setSelectedOrderToTrack] = useState<Order | null>(null);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<{ id: string; whatsappUrl: string } | null>(null);

  // Marketing Pixel Settings States
  const [fbPixelId, setFbPixelId] = useState<string>(() => localStorage.getItem("mystore_fb_pixel") || "");
  const [ttPixelId, setTtPixelId] = useState<string>(() => localStorage.getItem("mystore_tt_pixel") || "");

  // Hero Banner image state customizable by Admin
  const [heroImageUrl, setHeroImageUrl] = useState<string>(() => {
    return localStorage.getItem("mystore_hero_image_url") || watchBannerImg;
  });

  useEffect(() => {
    if (heroImageUrl) {
      localStorage.setItem("mystore_hero_image_url", heroImageUrl);
    } else {
      localStorage.removeItem("mystore_hero_image_url");
    }
  }, [heroImageUrl]);

  // Initialize and reload Pixels when IDs are set/changed
  useEffect(() => {
    if (fbPixelId) {
      initFacebookPixel(fbPixelId);
      localStorage.setItem("mystore_fb_pixel", fbPixelId);
    } else {
      localStorage.removeItem("mystore_fb_pixel");
    }
  }, [fbPixelId]);

  useEffect(() => {
    if (ttPixelId) {
      initTikTokPixel(ttPixelId);
      localStorage.setItem("mystore_tt_pixel", ttPixelId);
    } else {
      localStorage.removeItem("mystore_tt_pixel");
    }
  }, [ttPixelId]);

  // Checkout shipping states
  const [customerName, setCustomerName] = useState<string>("");
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [customerDivision, setCustomerDivision] = useState<string>("Dhaka (ঢাকা)");
  const [customerDistrict, setCustomerDistrict] = useState<string>("Dhaka (ঢাকা)");
  const [customerThana, setCustomerThana] = useState<string>("Mirpur (মিরপুর)");
  const [couponCode, setCouponCode] = useState<string>("");
  const [activeCouponNotification, setActiveCouponNotification] = useState<string | null>(null);

  // Sync District selection when Division changes
  useEffect(() => {
    const districts = DIVISION_TO_DISTRICTS[customerDivision] || [];
    if (districts.length > 0) {
      setCustomerDistrict(districts[0]);
    } else {
      setCustomerDistrict("");
    }
  }, [customerDivision]);

  // Sync Thana selection when District changes
  useEffect(() => {
    const thanas = DISTRICT_TO_THANAS[customerDistrict] || [];
    if (thanas.length > 0) {
      setCustomerThana(thanas[0]);
    } else {
      setCustomerThana("");
    }
  }, [customerDistrict]);

  // Synchronize localStorage
  useEffect(() => {
    localStorage.setItem("mystore_cart", JSON.stringify(cart));
  }, [cart]);

  // Track PageView on view/navigation change
  useEffect(() => {
    trackPixelEvent("PageView");
  }, [currentView]);

  // Track ViewContent when a product's details are opened
  useEffect(() => {
    if (selectedProductDetails) {
      trackPixelEvent("ViewContent", {
        content_name: selectedProductDetails.name,
        content_category: selectedProductDetails.category,
        content_ids: [selectedProductDetails.id],
        value: selectedProductDetails.price,
        currency: "BDT"
      });
    }
  }, [selectedProductDetails]);

  // Read URL parameters for Facebook campaign triggers
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const prodId = params.get("product");
    const coupon = params.get("coupon");
    const ref = params.get("ref");

    if (prodId) {
      const matchedProd = products.find(p => p.id === prodId);
      if (matchedProd) {
        setSelectedProductDetails(matchedProd);
        // If they click on details modal from Campaign, switch to shop view first
        setCurrentView("shop");
      }
    }

    if (coupon) {
      const upperCoupon = coupon.toUpperCase();
      setCouponCode(upperCoupon);
      if (upperCoupon === "FB20") {
        setActiveCouponNotification(
          lang === "bn" 
            ? "🔥 ফেসবুক ক্যাম্পেইন অফার অ্যাক্টিভ! ২০% ডিসকাউন্ট যোগ হয়েছে।" 
            : "🔥 Facebook Campaign Active! 20% discount coupon applied."
        );
      }
    }
  }, [products, lang]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    if (product.stock === 0) return;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const newQty = prevCart[existingIdx].quantity + quantity;
        if (newQty > product.stock) return prevCart; // Exceeds stock
        const updated = [...prevCart];
        updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
        return updated;
      } else {
        return [...prevCart, { product, quantity }];
      }
    });

    // Track AddToCart Pixel event
    trackPixelEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      value: product.price * quantity,
      currency: "BDT"
    });

    // Notify user elegantly
    const toast = document.createElement("div");
    toast.className = "fixed bottom-5 right-5 bg-indigo-800 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg z-50 animate-fade-in flex items-center gap-2";
    toast.innerHTML = `<span>✔️</span> ${lang === "bn" ? "কার্টে যোগ করা হয়েছে!" : "Added to cart successfully!"}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const handleOrderNow = (product: Product) => {
    if (product.stock === 0) return;

    // Check if product is already in cart, if not, add it
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        return prevCart;
      } else {
        return [...prevCart, { product, quantity: 1 }];
      }
    });

    // Track AddToCart Pixel event for immediate order/buy now
    trackPixelEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      value: product.price,
      currency: "BDT"
    });

    // Close details modal if open
    setSelectedProductDetails(null);
    // Open checkout immediately!
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) return item; // Exceeds stock
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  // Cart math
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const discountAmount = useMemo(() => {
    if (couponCode.toUpperCase() === "FB20") {
      return Math.round(cartSubtotal * 0.20);
    }
    return 0;
  }, [couponCode, cartSubtotal]);

  // Dhaka delivery is 80 BDT, outside Dhaka is 150 BDT
  const deliveryCharge = useMemo(() => {
    if (cart.length === 0) return 0;
    return customerDistrict.toLowerCase().includes("dhaka") ? 80 : 150;
  }, [customerDistrict, cart]);

  const cartTotal = cartSubtotal - discountAmount + deliveryCharge;

  // Track InitiateCheckout when checkout drawer/modal is opened
  useEffect(() => {
    if (isCheckoutOpen && cart.length > 0) {
      trackPixelEvent("InitiateCheckout", {
        content_ids: cart.map(item => item.product.id),
        value: cartTotal,
        currency: "BDT",
        contents: cart.map(item => ({
          id: item.product.id,
          quantity: item.quantity,
          item_price: item.product.price,
          name: item.product.name
        }))
      });
    }
  }, [isCheckoutOpen, cart, cartTotal]);

  // Categories list
  const categories = useMemo(() => {
    const list = new Set(products.map(p => p.category));
    return ["All", ...Array.from(list)];
  }, [products]);

  const getCategoryDisplayName = (cat: string) => {
    if (cat === "All") return lang === "bn" ? "সব প্রোডাক্ট" : "All Products";
    
    const mapping: Record<string, { bn: string; en: string }> = {
      "Shoes & Footwear": { bn: "👠 জুতা ও ফুটওয়্যার", en: "Shoes & Footwear" },
      "Cosmetics & Beauty": { bn: "💅 কসমেটিকস ও বিউটি", en: "Cosmetics & Beauty" },
      "Clothing & Fashion": { bn: "👕 পোশাক ও ফ্যাশন", en: "Clothing & Fashion" },
      "Gadgets & Electronics": { bn: "🔌 গ্যাজেট ও ইলেকট্রনিক্স", en: "Gadgets & Electronics" },
      "Watch & Accessories": { bn: "⌚ ঘড়ি ও এক্সেসরিজ", en: "Watch & Accessories" },
      "Home & Kitchen": { bn: "🍳 হোম ও রান্নাঘর", en: "Home & Kitchen" },
      "Health & Care": { bn: "❤️ হেলথ ও কেয়ার", en: "Health & Care" },
      "Toys & Kids": { bn: "🧸 খেলনা ও বাচ্চাদের জিনিস", en: "Toys & Kids" },
      "Accessories": { bn: "👜 এক্সেসরিজ", en: "Accessories" },
      "Electronics": { bn: "🔌 ইলেকট্রনিক্স", en: "Electronics" },
      "Apparel": { bn: "👕 পোশাক", en: "Apparel" },
      "Grocery": { bn: "🍎 মুদি পণ্য", en: "Grocery" }
    };
    
    if (mapping[cat]) {
      return lang === "bn" ? mapping[cat].bn : mapping[cat].en;
    }
    return cat;
  };

  // Filtered products list
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      const term = searchQuery.toLowerCase();
      const matchesSearch = 
        p.name.toLowerCase().includes(term) || 
        (p.banglaName && p.banglaName.toLowerCase().includes(term)) ||
        p.category.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Order submission
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName || !customerPhone || !customerAddress || !customerThana) return;

    // Validate phone number (simple validation for Bangladesh formats)
    const cleanPhone = customerPhone.replace(/\s+/g, "");
    if (cleanPhone.length < 11) {
      alert(lang === "bn" ? "সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন!" : "Please enter a valid 11-digit mobile number!");
      return;
    }

    const orderId = `TRK-${Math.floor(10000 + Math.random() * 90000)}`;
    const urlParams = new URLSearchParams(window.location.search);
    const campaignRef = urlParams.get("ref") || undefined;

    const newOrder: Order = {
      id: orderId,
      customerName,
      customerPhone,
      customerAddress,
      customerDivision,
      customerDistrict,
      customerThana,
      cartItems: [...cart],
      totalAmount: cartTotal,
      paymentMethod: "cod",
      status: OrderStatus.RECEIVED,
      trackingHistory: createDefaultTrackingHistory(new Date()),
      createdAt: new Date().toISOString(),
      fbCampaignRef: campaignRef
    };

    // Deduct stock
    const updatedProducts = products.map((prod) => {
      const cartItem = cart.find(item => item.product.id === prod.id);
      if (cartItem) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - cartItem.quantity)
        };
      }
      return prod;
    });

    // Format WhatsApp message
    let waMessage = `*--- নতুন অর্ডার (New Order) ---*\n\n`;
    waMessage += `*অর্ডার আইডি (Order ID):* ${orderId}\n`;
    waMessage += `*গ্রাহকের নাম (Name):* ${customerName}\n`;
    waMessage += `*মোবাইল নম্বর (Phone):* ${customerPhone}\n`;
    waMessage += `*বিভাগ (Division):* ${customerDivision}\n`;
    waMessage += `*জেলা (District):* ${customerDistrict}\n`;
    waMessage += `*থানা (Thana):* ${customerThana}\n`;
    waMessage += `*বিস্তারিত ঠিকানা (Address):* ${customerAddress}\n\n`;
    waMessage += `*পণ্যসমূহ (Products ordered):*\n`;
    
    cart.forEach((item, index) => {
      const prodName = lang === "bn" ? (item.product.banglaName || item.product.name) : item.product.name;
      waMessage += `${index + 1}. *${prodName}*\n`;
      waMessage += `   - পরিমাণ (Qty): ${item.quantity} x ৳${item.product.price}\n`;
      if (item.product.image) {
        waMessage += `   - ছবি (Image URL): ${item.product.image}\n`;
      }
    });
    
    waMessage += `\n*ডেলিভারি চার্জ (Delivery):* ৳${deliveryCharge}\n`;
    if (discountAmount > 0) {
      waMessage += `*ডিসকাউন্ট (Discount):* -৳${discountAmount}\n`;
    }
    waMessage += `*সর্বমোট সংগ্রহযোগ্য মূল্য (Total Payable):* ৳${cartTotal}\n\n`;
    waMessage += `ধন্যবাদ! (Thank you for ordering from JOHURUL.BDShop)`;

    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=8801795339373&text=${encodedMessage}`;

    // Track Purchase event with Facebook/TikTok pixels
    trackPixelEvent("Purchase", {
      content_ids: cart.map(item => item.product.id),
      value: cartTotal,
      currency: "BDT",
      contents: cart.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.product.price,
        name: item.product.name
      }))
    });

    updateProductsAndSync(updatedProducts);
    updateOrdersAndSync([newOrder, ...orders]);
    setCart([]);
    setIsCheckoutOpen(false);

    // Set tracking target and redirect to tracking screen
    setSelectedOrderToTrack(newOrder);
    setTrackingSearchId(orderId);
    setCurrentView("track");

    // Show the custom Order Success modal
    setOrderSuccessDetails({ id: orderId, whatsappUrl });
  };

  // Tracking search
  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedOrder = orders.find(o => o.id.trim().toUpperCase() === trackingSearchId.trim().toUpperCase());
    if (matchedOrder) {
      setSelectedOrderToTrack(matchedOrder);
    } else {
      setSelectedOrderToTrack(null);
      alert(lang === "bn" ? "দুঃখিত, এই ট্র্যাকিং আইডির কোনো অর্ডার পাওয়া যায়নি!" : "Sorry, no order found with this tracking ID!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-gray-900 flex flex-col antialiased">
      {/* 1. JOHURUL.BDShop Topbar (টপবার) */}
      <div className="bg-[#222222] text-xs text-white py-2 border-indigo-900/30 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center font-medium">
          <div className="flex items-center gap-5 text-gray-200">
            <span className="flex items-center gap-1 hover:text-[#3730a3] cursor-pointer transition-colors">
              <PhoneCall className="w-3.5 h-3.5 text-[#3730a3]" />
              <span>{lang === "bn" ? "সাহায্য প্রয়োজন? 01795339373" : "Hotline: 01795339373"}</span>
            </span>
            <span>|</span>
            <span className="hover:text-[#3730a3] cursor-pointer transition-colors" onClick={() => setCurrentView("track")}>{lang === "bn" ? "অর্ডার ট্র্যাক করুন" : "TRACK ORDER"}</span>
            <span className="hover:text-[#3730a3] cursor-pointer transition-colors">{lang === "bn" ? "পাইকারি অর্ডার" : "WHOLESALE DEALS"}</span>
          </div>
          <div className="flex items-center gap-4 text-gray-200 font-semibold">
            {/* Language Switcher */}
            <button
              id="language-toggle-btn"
              onClick={() => setLang(lang === "bn" ? "en" : "bn")}
              className="hover:text-[#3730a3] flex items-center gap-1 transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-[#3730a3]" />
              <span>{lang === "bn" ? "ENGLISH" : "বাংলা"}</span>
            </button>
            <span>|</span>
            <span className="hover:text-[#3730a3] cursor-pointer">{lang === "bn" ? "লগইন" : "LOGIN"}</span>
            <span>|</span>
            <span className="hover:text-[#3730a3] cursor-pointer">{lang === "bn" ? "সাইন আপ" : "REGISTER"}</span>
          </div>
        </div>
      </div>

      {/* Top Promotional Coupon Bar (JOHURUL.BDShop Blue) */}
      {activeCouponNotification && (
        <div className="bg-[#3730a3] text-white text-xs font-bold py-2 px-4 text-indigo-900enter relative flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 animate-bounce text-yellow-400" />
          <span>{activeCouponNotification}</span>
          <button 
            id="close-promo-banner"
            onClick={() => setActiveCouponNotification(null)} 
            className="absolute right-4 hover:bg-black/15 rounded p-0.5 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. JOHURUL.BDShop-style Search Header & Brand Row */}
      <header className="sticky top-0 bg-white border-indigo-800 border-gray-200 z-30 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo in JOHURUL.BDShop Blue & Charcoal Style */}
          <div 
            onClick={() => setCurrentView("shop")} 
            className="flex items-center gap-2 cursor-pointer shrink-0"
          >
            <div className="w-11 h-11 rounded-md bg-[#3730a3] text-white flex items-center justify-center shadow-md">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-baseline gap-0.5">
                <h1 className="text-indigo-900lue-600xl font-black tracking-tight leading-none text-[#222222]">
                  <span className="text-[#3730a3]">JOHURUL</span>.BDShop
                </h1>
                <span className="text-[10px] font-black text-white bg-[#3730a3] px-1.5 py-0.5 rounded-xs uppercase tracking-wider ml-1">
                  OS
                </span>
              </div>
              <span className="text-[9px] text-[#3730a3] font-extrabold uppercase tracking-widest block mt-1">
                {lang === "bn" ? "জহুরুল বিডি-শপ ওপেন সোর্স ই-কমার্স" : "JOHURUL.BDShop Open Source E-Commerce"}
              </span>
            </div>
          </div>

          {/* JOHURUL.BDShop iconic Red-themed Search Bar inside Header */}
          <div className="w-full md:max-w-2xl flex rounded border-indigo-800 border-indigo-800lue-100 border-[#3730a3] overflow-hidden shadow-xs">
            <input
              id="product-search-input"
              type="text"
              placeholder={lang === "bn" ? "জহুরুল বিডি-শপ এ অরিজিনাল প্রোডাক্ট খুঁজুন..." : "Search original products on JOHURUL.BDShop..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-sm text-gray-800 px-4 py-2.5 outline-none placeholder-gray-400 font-normal"
            />
            <button 
              onClick={() => setCurrentView("shop")}
              className="px-6 bg-[#3730a3] hover:bg-[#4338ca] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>{lang === "bn" ? "খুঁজুন" : "SEARCH"}</span>
            </button>
          </div>

          {/* Cart and Switch views area */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Cart Icon in JOHURUL.JOHURUL.BDShop Blue */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-[#3730a3]/5 hover:bg-[#3730a3]/15 text-[#3730a3] rounded-md shadow-xs transition-all flex items-center justify-center cursor-pointer border border-[#3730a3]/10"
            >
              <ShoppingCart className="w-5.5 h-5.5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#3730a3] text-white text-[10px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-indigo-800 border-white shadow-sm animate-pulse">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 3. Sub-Navigation JOHURUL.BDShop Blue Category Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-3 border-t border-gray-100 hidden md:flex items-center gap-2">
          <button
            id="nav-tab-shop"
            onClick={() => setCurrentView("shop")}
            className={`px-4 py-1.5 rounded-sm text-xs font-bold tracking-wide transition-all uppercase flex items-center gap-1 ${
              currentView === "shop"
                ? "bg-[#3730a3] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-[#3730a3]"
            }`}
          >
            🛍️ {lang === "bn" ? "হোম শপ" : "JOHURUL.BDShop Store"}
          </button>
          <button
            id="nav-tab-track"
            onClick={() => setCurrentView("track")}
            className={`px-4 py-1.5 rounded-sm text-xs font-bold tracking-wide transition-all uppercase flex items-center gap-1 ${
              currentView === "track"
                ? "bg-[#3730a3] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-[#3730a3]"
            }`}
          >
            🔍 {lang === "bn" ? "অর্ডার ট্র্যাকিং" : "Order Tracking"}
          </button>
          <button
            id="nav-tab-campaign"
            onClick={() => setCurrentView("campaign")}
            className={`px-4 py-1.5 rounded-sm text-xs font-bold tracking-wide transition-all uppercase flex items-center gap-1 ${
              currentView === "campaign"
                ? "bg-[#3730a3] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-[#3730a3]"
            }`}
          >
            📢 {lang === "bn" ? "ফেসবুক অ্যাড ক্রিয়েটর" : "FB Ad Maker"}
          </button>
          {showAdminEntryPoints && (
            <button
              id="nav-tab-admin"
              onClick={() => setCurrentView("admin")}
              className={`px-4 py-1.5 rounded-sm text-xs font-bold tracking-wide transition-all uppercase flex items-center gap-1 ${
                currentView === "admin"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-gray-600 hover:bg-gray-50 hover:text-purple-600"
              }`}
            >
              🛠️ {lang === "bn" ? "স্টোর অ্যাডমিন" : "Store Admin"}
            </button>
          )}
        </div>
      </header>

      {/* Mobile Sticky Footer Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2 px-4 z-40 shadow-lg flex items-center justify-around text-[10px] font-bold">
        <button
          id="mobile-nav-shop"
          onClick={() => setCurrentView("shop")}
          className={`flex flex-col items-center gap-0.5 ${currentView === "shop" ? "text-[#3730a3]" : "text-gray-400"}`}
        >
          <span className="text-lg">🛍️</span>
          <span>{lang === "bn" ? "হোম শপ" : "Shop"}</span>
        </button>
        <button
          id="mobile-nav-track"
          onClick={() => setCurrentView("track")}
          className={`flex flex-col items-center gap-0.5 ${currentView === "track" ? "text-[#3730a3]" : "text-gray-400"}`}
        >
          <span className="text-lg">🔍</span>
          <span>{lang === "bn" ? "ট্র্যাকিং" : "Track"}</span>
        </button>
        <button
          id="mobile-nav-campaign"
          onClick={() => setCurrentView("campaign")}
          className={`flex flex-col items-center gap-0.5 ${currentView === "campaign" ? "text-[#3730a3]" : "text-gray-400"}`}
        >
          <span className="text-lg">📢</span>
          <span>{lang === "bn" ? "অ্যাড মেকার" : "Ads"}</span>
        </button>
        {showAdminEntryPoints && (
          <button
            id="mobile-nav-admin"
            onClick={() => setCurrentView("admin")}
            className={`flex flex-col items-center gap-0.5 ${currentView === "admin" ? "text-purple-600" : "text-gray-400"}`}
          >
            <span className="text-lg">🛠️</span>
            <span>{lang === "bn" ? "অ্যাডমিন" : "Admin"}</span>
          </button>
        )}
      </div>

      {/* Main Page Layout Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-12 space-y-6">
        
        {/* VIEW 1: SHOP STOREFRONT */}
        {currentView === "shop" && (
          <div className="space-y-6">
            
            {/* Top Grid: Categories Sidebar & Slider */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Categories Sidebar (Desktop only) */}
              <div className="hidden lg:block lg:col-span-1 bg-white rounded-md p-4 border border-gray-100 shadow-xs h-[320px] flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest pb-2 mb-2 border-indigo-800 border-gray-100 flex items-center justify-between">
                    <span>{lang === "bn" ? "ক্যাটাগরি সমূহ" : "Categories"}</span>
                    <span className="text-[10px] text-[#3730a3] animate-pulse">● LIVE</span>
                  </h3>
                  <div className="space-y-0.5">
                    {categories.map((cat) => (
                      <button
                        id={`sidebar-cat-${cat}`}
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-3 py-2 rounded text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-indigo-50 text-[#3730a3] font-bold"
                            : "text-gray-600 hover:bg-gray-50 hover:text-[#3730a3]"
                        }`}
                      >
                        <span>{getCategoryDisplayName(cat)}</span>
                        <span className="text-gray-300 group-hover:text-[#3730a3] text-[10px]">▶</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Contact Help banner at bottom of sidebar */}
                <div className="bg-indigo-50 border border-indigo-100 p-2.5 rounded text-[11px] text-gray-700 flex items-center gap-1.5 font-medium">
                  <PhoneCall className="w-3.5 h-3.5 text-[#3730a3] shrink-0" />
                  <div>
                    <span className="font-bold text-[#3730a3] block">{lang === "bn" ? "সাহায্য প্রয়োজন?" : "Customer Support?"}</span>
                    <span className="font-bold">01795339373</span>
                  </div>
                </div>
              </div>

              {/* Right Big Hero Slider Banner */}
              <div className="lg:col-span-3 bg-gradient-to-r from-[#3730a3] to-[#1e1b4b] rounded-md p-6 sm:p-10 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between min-h-[320px] gap-6">
                {/* Aesthetic Background Overlays */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent)] pointer-events-none"></div>
                <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
                
                <div className="space-y-3.5 max-w-xl flex-1 z-10">
                  <span className="inline-block text-[9px] font-extrabold tracking-widest uppercase bg-white/20 text-white px-2.5 py-1 rounded-sm border border-white/20">
                    🔥 {lang === "bn" ? "জহুরুল বিডি-শপ অরিজিনাল ডিলস" : "BDSHOP PREMIUM DEALS"}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                    {lang === "bn" ? "১০০% অরিজিনাল গ্যাজেটস ক্যাশ অন ডেলিভারি অফারে!" : "100% Original Gadgets & Electronics in Bangladesh!"}
                  </h2>
                  <p className="text-xs sm:text-sm text-indigo-100 font-medium max-w-md">
                    {lang === "bn" 
                      ? "কোনো অগ্রিম চার্জ ছাড়াই অর্ডার করুন এবং হাতে পেয়ে চেক করে পেমেন্ট করার সুবিধা উপভোগ করুন। নিশ্চিত থাকুন আসল পণ্যের।" 
                      : "Zero upfront risk. Place cash on delivery orders, inspect items on your hand, and track live in our system."}
                  </p>

                  {/* Promo Code Coupon Voucher Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/10 mt-4">
                    <div className="flex items-center gap-3.5">
                      <div className="bg-white text-[#3730a3] px-4 py-1.5 rounded font-black text-lg tracking-wider font-mono shadow-xs">
                        FB20
                      </div>
                      <div className="text-xs">
                        <span className="font-extrabold block text-white">{lang === "bn" ? "ফেসবুক অ্যাড স্পেশাল ২০% ডিসকাউন্ট!" : "FB Ads Special 20% Off"}</span>
                        <span className="text-indigo-200 text-[10px]">{lang === "bn" ? "চেকআউট পেজে কুপনটি ব্যবহার করুন" : "Apply coupon code in checkout to save instantly"}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setCouponCode("FB20");
                        alert(lang === "bn" ? "ভাউচার কোড 'FB20' যোগ করা হয়েছে!" : "Coupon 'FB20' applied successfully!");
                      }}
                      className="bg-white text-[#3730a3] hover:bg-indigo-50 px-5 py-2 rounded font-extrabold text-xs tracking-wider shadow-md hover:scale-105 transition-all cursor-pointer"
                    >
                      {lang === "bn" ? "ভাউচার কপি করুন" : "CLAIM VOUCHER"}
                    </button>
                  </div>
                </div>

                {/* Banner Image Container */}
                <div className="w-full md:w-[240px] lg:w-[280px] aspect-video md:aspect-square bg-black/20 rounded-xl overflow-hidden border border-white/10 relative shrink-0 shadow-lg z-10 flex items-center justify-center">
                  <img
                    src={heroImageUrl}
                    alt="Premium Watch Banner"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transform hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            {/* Featured Channels Grid (Bento Style Icon Shortcuts resembling JOHURUL.JOHURUL.BDShop categories) */}
            <div className="grid grid-cols-5 gap-2 sm:gap-4 bg-white rounded-md p-3 sm:p-5 border border-gray-150 shadow-xs">
              
              {/* Channel 1: JOHURUL.BDShop Certified */}
              <div 
                onClick={() => {
                  setSelectedCategory("Electronics");
                  const element = document.getElementById("just-for-you-anchor");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex flex-col items-center text-indigo-900enter cursor-pointer group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-900lue-600lue-600 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
                  <span className="text-lg sm:text-indigo-900lue-600xl">🏢</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 mt-2 group-hover:text-[#3730a3] transition-colors truncate w-full">
                  {lang === "bn" ? "সার্টিফাইড শপ" : "JOHURUL.BDShop Certified"}
                </span>
              </div>

              {/* Channel 2: Flat Rate Shipping */}
              <div 
                onClick={() => {
                  alert(lang === "bn" ? "অভিনন্দন! দ্রুততম কুরিয়ার ডেলিভারি অফার সক্রিয় আছে।" : "Fast courier home delivery is active.");
                }}
                className="flex flex-col items-center text-indigo-900enter cursor-pointer group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-indigo-50 hover:bg-indigo-100 text-[#3730a3] flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
                  <span className="text-lg sm:text-indigo-900lue-600xl">🚚</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 mt-2 group-hover:text-[#3730a3] transition-colors truncate w-full">
                  {lang === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}
                </span>
              </div>

              {/* Channel 3: Audio Devices */}
              <div 
                onClick={() => {
                  setSelectedCategory("Electronics");
                  const element = document.getElementById("just-for-you-anchor");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex flex-col items-center text-indigo-900enter cursor-pointer group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-800 flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
                  <span className="text-lg sm:text-indigo-900lue-600xl">🎧</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 mt-2 group-hover:text-[#3730a3] transition-colors truncate w-full">
                  {lang === "bn" ? "হেডফোন ও অডিও" : "Audio Gadgets"}
                </span>
              </div>

              {/* Channel 4: Super Vouchers */}
              <div 
                onClick={() => {
                  setCouponCode("FB20");
                  alert(lang === "bn" ? "ভাউচার কোড 'FB20' যোগ করা হয়েছে! ২০% ডিসকাউন্ট পাবেন।" : "Applied Coupon 'FB20'! Check your checkout to save 20% on items.");
                }}
                className="flex flex-col items-center text-indigo-900enter cursor-pointer group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-indigo-50 hover:bg-indigo-100 text-[#3730a3] flex items-center justify-center transition-all shadow-xs group-hover:scale-105">
                  <span className="text-lg sm:text-indigo-900lue-600xl">🎟️</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 mt-2 group-hover:text-[#3730a3] transition-colors truncate w-full">
                  {lang === "bn" ? "হট ভাউচার কোড" : "Hot Vouchers"}
                </span>
              </div>

              {/* Channel 5: Interactive Shake gift */}
              <div 
                onClick={() => {
                  const items = ["70 BDT Discount", "Free Courier Voucher", "FB20 Double Coupon", "150 BDT Cashback"];
                  const selectedPrize = items[Math.floor(Math.random() * items.length)];
                  alert(lang === "bn" 
                    ? `🎁 অভিনন্দন! আপনি জিতেছেন: ${selectedPrize}!\nএটি অর্ডারে স্বয়ংক্রিয়ভাবে ব্যবহার হবে।` 
                    : `🎁 Congratulations! You shook and won: ${selectedPrize}!\nIt is applied to your active checkout session.`
                  );
                }}
                className="flex flex-col items-center text-indigo-900enter cursor-pointer group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-indigo-50 hover:bg-emerald-200 text-[#3730a3] flex items-center justify-center transition-all shadow-xs group-hover:scale-105 animate-bounce">
                  <span className="text-lg sm:text-indigo-900lue-600xl">🎁</span>
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-gray-700 mt-2 group-hover:text-[#3730a3] transition-colors truncate w-full">
                  {lang === "bn" ? "উপহার কুপন" : "Mystery Gift"}
                </span>
              </div>

            </div>

            {/* DARAJ FLASH SALE (ফ্ল্যাশ সেল) */}
            <div className="bg-white rounded-md border border-gray-150 shadow-xs overflow-hidden">
              
              {/* Flash Sale Header */}
              <div className="px-4 py-3 border-indigo-800 border-gray-150 bg-[#fbfbfb] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <h3 className="text-sm font-black text-[#3730a3] uppercase tracking-wide flex items-center gap-1">
                    <span>⚡</span> {lang === "bn" ? "ফ্ল্যাশ ডিল" : "JOHURUL.BDShop Flash Deals"}
                  </h3>
                  
                  {/* Countdown Timer in JOHURUL.BDShop Blue style */}
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span className="text-gray-400 font-normal">{lang === "bn" ? "শেষ হতে বাকি:" : "Ending in:"}</span>
                    <span className="bg-[#3730a3] text-white px-1.5 py-0.5 rounded text-xs font-mono">
                      {timeLeft.hours.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[#3730a3] font-black">:</span>
                    <span className="bg-[#3730a3] text-white px-1.5 py-0.5 rounded text-xs font-mono">
                      {timeLeft.minutes.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[#3730a3] font-black">:</span>
                    <span className="bg-[#3730a3] text-white px-1.5 py-0.5 rounded text-xs font-mono">
                      {timeLeft.seconds.toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    const el = document.getElementById("just-for-you-anchor");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-xs text-[#3730a3] hover:text-white hover:bg-[#3730a3] font-bold border border-[#3730a3] px-2.5 py-1 rounded transition-all"
                >
                  {lang === "bn" ? "আরও প্রোডাক্ট দেখুন" : "SHOP MORE"}
                </button>
              </div>

              {/* Flash Sale Products Grid with progress meters */}
              <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.slice(0, 3).map((prod) => {
                  const fakeSold = (parseInt(prod.id) * 4) + 2;
                  const percentSold = Math.round((fakeSold / (prod.stock + fakeSold)) * 100);

                  return (
                    <div 
                      key={`flash-${prod.id}`}
                      className="border border-gray-100 hover:border-indigo-800lue-200 p-3 rounded-lg flex gap-4 bg-white relative hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => setSelectedProductDetails(prod)}
                    >
                      {/* Image */}
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        className="w-20 h-20 object-cover rounded border border-gray-50 shrink-0" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Specs */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-800 truncate">
                            {lang === "bn" ? prod.banglaName || prod.name : prod.name}
                          </h4>
                          <div className="flex items-baseline gap-1.5 mt-1">
                            <span className="text-sm font-bold text-[#3730a3]">৳{prod.price}</span>
                            {prod.originalPrice && (
                              <span className="text-[10px] text-gray-400 line-through">৳{prod.originalPrice}</span>
                            )}
                          </div>
                        </div>

                        {/* Sold Meter bar */}
                        <div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
                            <div 
                              className="bg-[#3730a3] h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${percentSold}%` }}
                            ></div>
                          </div>
                          <span className="text-[9px] text-gray-500 font-semibold block mt-1">
                            🔥 {fakeSold} {lang === "bn" ? "টি বিক্রি হয়েছে" : "sold"} · {prod.stock} {lang === "bn" ? "বাকি আছে" : "left"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Accent corner label */}
                      <span className="absolute top-2 right-2 bg-indigo-50 text-indigo-900lue-600lue-600 text-[8px] font-extrabold px-1 py-0.5 rounded">
                        HOT
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* "Just For You" Title Anchor */}
            <div id="just-for-you-anchor" className="pt-4 flex flex-col sm:flex-row items-center justify-between border-indigo-800 border-gray-200 pb-3 gap-3">
              <h2 className="text-indigo-900lue-600ase sm:text-lg font-black text-[#212121] uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-6 bg-[#3730a3] rounded-xs inline-block"></span>
                {lang === "bn" ? "জাস্ট ফর ইউ (প্রোডাক্ট কালেকশন)" : "Just For You (Personalized Catalog)"}
              </h2>
              
              {/* Category Filters inside Just For You */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
                {categories.map((cat) => (
                  <button
                    id={`cat-btn-${cat}`}
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded text-[10px] sm:text-xs font-bold tracking-wide uppercase shrink-0 cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? "bg-[#3730a3] text-white shadow-xs"
                        : "bg-white text-gray-500 hover:text-[#3730a3] border border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {getCategoryDisplayName(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Store Grid of Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-indigo-900enter py-16 bg-white border border-gray-100 rounded-lg p-6">
                <span className="text-indigo-900lue-600xl">🔍</span>
                <h3 className="mt-4 text-indigo-900lue-600ase font-bold text-gray-800">{lang === "bn" ? "কোনো প্রোডাক্ট পাওয়া যায়নি" : "No products match your search"}</h3>
                <p className="text-xs text-gray-400 mt-1">{lang === "bn" ? "অনুগ্রহ করে অন্য কোনো ক্যাটাগরি ট্রাই করুন।" : "Try checking other categories or tags."}</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
                {filteredProducts.map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    lang={lang}
                    onViewDetails={setSelectedProductDetails}
                    onAddToCart={(p) => handleAddToCart(p, 1)}
                    onOrderNow={handleOrderNow}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: ORDER TRACKER */}
        {currentView === "track" && (
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* Search Lookup card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="text-indigo-900enter max-w-md mx-auto space-y-2">
                <span className="text-3xl">🔍</span>
                <h2 className="text-xl font-bold text-gray-900">
                  {lang === "bn" ? "আপনার কুরিয়ার অর্ডার ট্র্যাক করুন" : "Track Your Shipments"}
                </h2>
                <p className="text-xs text-gray-500">
                  {lang === "bn" 
                    ? "আপনার অর্ডারের বর্তমান কুরিয়ার ট্রানজিট অবস্থা দেখতে ৫ ডিজিটের ট্র্যাকিং আইডি (যেমনঃ TRK-12345) লিখুন।" 
                    : "Enter your 5-digit invoice tracking number to see instant live shipping milestones."}
                </p>
              </div>

              <form onSubmit={handleTrackSearch} className="flex bg-gray-50 border border-gray-200 rounded-2xl p-1 overflow-hidden max-w-md mx-auto">
                <input
                  id="tracking-search-input"
                  type="text"
                  required
                  placeholder="e.g. TRK-92438"
                  value={trackingSearchId}
                  onChange={(e) => setTrackingSearchId(e.target.value)}
                  className="w-full bg-transparent border-none text-sm font-semibold tracking-wider font-mono text-gray-800 px-4 py-3 outline-none"
                />
                <button
                  id="tracking-search-submit"
                  type="submit"
                  className="bg-[#3730a3] hover:bg-[#4338ca] text-white font-bold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer"
                >
                  {lang === "bn" ? "খুঁজুন" : "Track Info"}
                </button>
              </form>

              {/* Quick shortcut to active orders if any */}
              {orders.length > 0 && (
                <div className="pt-4 border-t border-gray-50 text-indigo-900enter">
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                    {lang === "bn" ? "আপনার সাম্প্রতিক অর্ডারসমূহ" : "Quick Access Recent Orders"}
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {orders.slice(0, 3).map((order) => (
                      <button
                        id={`quick-track-${order.id}`}
                        key={order.id}
                        onClick={() => {
                          setTrackingSearchId(order.id);
                          setSelectedOrderToTrack(order);
                        }}
                        className="bg-[#3730a3]/5 hover:bg-[#3730a3]/15 text-[#3730a3] font-mono text-xs font-bold px-3 py-1.5 rounded-lg border border-[#3730a3]/10 transition-colors cursor-pointer"
                      >
                        {order.id} ({order.customerName.split(" ")[0]})
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timeline results display */}
            {selectedOrderToTrack ? (
              <TrackingTimeline order={selectedOrderToTrack} lang={lang} />
            ) : (
              orders.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-indigo-900enter">
                  <p className="text-xs text-gray-400 italic">
                    {lang === "bn" ? "অনুগ্রহ করে ওপরে ট্র্যাকিং নম্বর দিয়ে সার্চ করুন অথবা সাম্প্রতিক অর্ডার বাটনে ক্লিক করুন।" : "Please input a tracking number above or click on your recent invoices to track."}
                  </p>
                </div>
              )
            )}
          </div>
        )}

        {/* VIEW 3: CAMPAIGN AD CREATOR */}
        {currentView === "campaign" && (
          <div className="space-y-6">
            {/* Context Hero */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden flex items-center justify-between gap-4">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none"></div>
              <div>
                <span className="text-[10px] font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full text-indigo-100">
                  Smart Facebook Promotion
                </span>
                <h2 className="text-xl sm:text-indigo-900lue-600xl font-black mt-3">
                  {lang === "bn" ? "ফেসবুক অ্যাড ক্যাম্পেইন ক্রিয়েটর (AI)" : "AI-Powered Facebook Ad Campaign Builder"}
                </h2>
                <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mt-1">
                  {lang === "bn"
                    ? "ওপেন সোর্স সলিউশন দিয়ে সহজেই ফেসবুক পেজে ক্যাম্পেইন করুন। জেনারেট করুন আকর্ষণীয় ট্র্যাকিং ল্যান্ডিং লিংক যা কাস্টমারকে সরাসরি পণ্যের চেকআউটে নিয়ে আসবে!"
                    : "Create highly professional Facebook copy and unique tracking URLs that deep-link users directly to target items on this platform."}
                </p>
              </div>
              <span className="text-indigo-900lue-600xl hidden md:block">📢</span>
            </div>

            {/* Campaign Widget */}
            <FacebookAdPreview products={products} lang={lang} />
          </div>
        )}

        {/* VIEW 4: ADMIN CONTROLLER */}
        {currentView === "admin" && (
          <div className="space-y-6">
            {!isAdminAuthenticated ? (
              <div className="max-w-md mx-auto py-12 px-4">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl text-center space-y-6 animate-fade-in">
                  <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-gray-900">
                      {lang === "bn" ? "অ্যাডমিন প্যানেল লগইন" : "Admin Portal Login"}
                    </h2>
                    <p className="text-xs text-gray-500 mt-2">
                      {lang === "bn" 
                        ? "আপনার রেজিস্টার্ড লগইন আইডি এবং পাসওয়ার্ড দিয়ে প্রবেশ করুন।" 
                        : "Sign in with your registered admin credentials to access the panel."}
                    </p>
                  </div>

                  <form onSubmit={handleAdminLogin} className="space-y-4 text-left">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 px-1">
                        {lang === "bn" ? "লগইন আইডি (ইমেইল)" : "Login ID (Email)"}
                      </label>
                      <input
                        id="admin-email-input"
                        type="email"
                        required
                        placeholder="admin@gms.com"
                        value={typedEmail}
                        onChange={(e) => setTypedEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1 px-1">
                        <label className="block text-xs font-bold text-gray-500 uppercase">
                          {lang === "bn" ? "পাসওয়ার্ড" : "Password"}
                        </label>
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-bold focus:outline-none"
                        >
                          {showPassword ? (lang === "bn" ? "লুকান" : "Hide") : (lang === "bn" ? "দেখুন" : "Show")}
                        </button>
                      </div>
                      <input
                        id="admin-password-input"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={typedPassword}
                        onChange={(e) => setTypedPassword(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 outline-none transition-all font-medium"
                      />
                    </div>

                    {loginError && (
                      <p className="text-xs text-red-500 font-bold bg-red-50 p-2.5 rounded-xl border border-red-100 animate-pulse">
                        ⚠️ {loginError}
                      </p>
                    )}

                    <button
                      id="admin-login-submit"
                      type="submit"
                      className="w-full bg-[#3730a3] hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm text-sm"
                    >
                      🔑 {lang === "bn" ? "লগইন করুন" : "Sign In"}
                    </button>
                  </form>

                  <div className="pt-2 border-t border-gray-100 text-[10px] text-gray-400 font-medium space-y-1">
                    <p>
                      {lang === "bn" 
                        ? "* লগইন আইডি: admin@gms.com" 
                        : "* Login ID: admin@gms.com"}
                    </p>
                    <p>
                      {lang === "bn" 
                        ? "* পাসওয়ার্ড: ruma7862" 
                        : "* Password: ruma7862"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {authWarning && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fade-in shadow-sm">
                    <span className="text-base">💡</span>
                    <div>
                      {authWarning}
                    </div>
                  </div>
                )}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="text-xl">🛠️</span>
                      {lang === "bn" ? "অ্যাডমিন ম্যানেজমেন্ট পোর্টাল" : "Store Admin Management Console"}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                      {lang === "bn"
                        ? "প্রোডাক্ট ক্যাটালগ এডিট করুন, স্টক ট্র্যাক করুন এবং গ্রাহকদের অর্ডারের লাইভ শিপিং ট্র্যাকিং স্ট্যাটাস আপডেট করুন।"
                        : "Update live courier statuses, track overall storefront revenues, and add/delete catalog item records."}
                    </p>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      onClick={() => setIsChangingPassword(!isChangingPassword)}
                      className="bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      🔑 {lang === "bn" ? "পিন পরিবর্তন" : "Change PIN"}
                    </button>
                    <button
                      onClick={handleAdminLogout}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-2.5 px-4 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      🚪 {lang === "bn" ? "লগআউট" : "Logout"}
                    </button>
                  </div>
                </div>

                {isChangingPassword && (
                  <div className="bg-purple-50/50 border border-purple-100/40 p-5 rounded-3xl space-y-3 animate-fade-in">
                    <h3 className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                      {lang === "bn" ? "নতুন সিকিউরিটি পিন নির্ধারণ করুন" : "Set New Security PIN"}
                    </h3>
                    <form onSubmit={handlePasswordChange} className="flex flex-col sm:flex-row gap-2 max-w-md">
                      <input
                        type="text"
                        required
                        placeholder={lang === "bn" ? "৪ অক্ষরের পিন কোড" : "4-digit PIN code"}
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-purple-500 w-full"
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer shrink-0"
                        >
                          {lang === "bn" ? "সেভ করুন" : "Save PIN"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingPassword(false);
                            setNewPasswordInput("");
                          }}
                          className="bg-white hover:bg-gray-100 text-gray-600 border border-gray-200 text-xs font-bold px-3 py-2 rounded-xl cursor-pointer"
                        >
                          {lang === "bn" ? "বাতিল" : "Cancel"}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Render Admin Manager tabs */}
                <AdminPanel 
                  products={products}
                  orders={orders}
                  onUpdateProducts={updateProductsAndSync}
                  onUpdateOrders={updateOrdersAndSync}
                  lang={lang}
                  fbPixelId={fbPixelId}
                  onChangeFbPixelId={setFbPixelId}
                  ttPixelId={ttPixelId}
                  onChangeTtPixelId={setTtPixelId}
                  heroImageUrl={heroImageUrl}
                  onChangeHeroImageUrl={setHeroImageUrl}
                />
              </div>
            )}
          </div>
        )}

      </main>

      {/* DETAIL MODAL: Product Details */}
      {selectedProductDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100">
            
            {/* Close button */}
            <button
              id="close-details-modal"
              onClick={() => setSelectedProductDetails(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-full transition-colors z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Body */}
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Photo */}
              <div className="aspect-square relative bg-gray-50">
                <img
                  src={selectedProductDetails.image}
                  alt={selectedProductDetails.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Specs */}
              <div className="p-6 sm:p-8 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#3730a3] bg-[#3730a3]/10 px-2.5 py-1 rounded-md uppercase">
                      {selectedProductDetails.category}
                    </span>
                    <h3 className="text-xl sm:text-indigo-900lue-600xl font-black text-gray-900 mt-2">
                      {lang === "bn" 
                        ? selectedProductDetails.banglaName || selectedProductDetails.name 
                        : selectedProductDetails.name}
                    </h3>
                  </div>

                  {/* Rating block */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-gray-800">{selectedProductDetails.rating}</span>
                    <div className="flex text-blue-800mber-400">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>★</span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({selectedProductDetails.reviewsCount} {lang === "bn" ? "রিভিউ" : "Reviews"})</span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-indigo-900lue-600xl font-extrabold text-[#3730a3]">৳{selectedProductDetails.price}</span>
                    {selectedProductDetails.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">৳{selectedProductDetails.originalPrice}</span>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{lang === "bn" ? "পণ্য পরিচিতি" : "Description"}</h4>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {lang === "bn" 
                        ? selectedProductDetails.banglaDescription || selectedProductDetails.description 
                        : selectedProductDetails.description}
                    </p>
                  </div>

                  {/* Security Highlights */}
                  <div className="bg-[#3730a3]/5 border border-[#3730a3]/10 p-3 rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-[#3730a3] font-bold">
                      <ShieldCheck className="w-4 h-4 text-[#3730a3]" />
                      <span>{lang === "bn" ? "ক্যাশ অন ডেলিভারি (COD) এভেলেবল" : "Cash on Delivery Available"}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 pl-6">
                      {lang === "bn" 
                        ? "সারা বাংলাদেশে পণ্য হাতে পেয়ে টাকা পরিশোধ করুন। লাইভ অর্ডার ট্র্যাকিং লিংক প্রদান করা হবে।" 
                        : "No advance payment required. Inspect parcel then pay courier. Tracking ID included."}
                    </p>
                  </div>
                </div>

                 {/* Add to Cart Footer inside modal */}
                <div className="mt-8 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="text-xs shrink-0">
                    <p className="text-gray-400 font-semibold">{lang === "bn" ? "স্টক অবস্থা:" : "Availability:"}</p>
                    {selectedProductDetails.stock > 0 ? (
                      <span className="text-[#3730a3] font-bold">{lang === "bn" ? `${selectedProductDetails.stock} পিস স্টক আছে` : `${selectedProductDetails.stock} items remaining`}</span>
                    ) : (
                      <span className="text-indigo-900lue-600lue-600 font-bold">{lang === "bn" ? "স্টক শেষ" : "Out of Stock"}</span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row gap-2">
                    <button
                      id="modal-add-to-cart-btn"
                      disabled={selectedProductDetails.stock === 0}
                      onClick={() => {
                        handleAddToCart(selectedProductDetails, 1);
                        setSelectedProductDetails(null);
                      }}
                      className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 text-gray-700 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-gray-200"
                    >
                      <ShoppingCart className="w-4 h-4 text-gray-500" />
                      <span>{lang === "bn" ? "কার্টে যোগ করুন" : "Add to Cart"}</span>
                    </button>

                    <button
                      id="modal-order-now-btn"
                      disabled={selectedProductDetails.stock === 0}
                      onClick={() => {
                        handleOrderNow(selectedProductDetails);
                      }}
                      className="flex-1 bg-[#3730a3] hover:bg-[#4338ca] disabled:bg-gray-300 text-white font-black text-xs sm:text-sm py-3 px-5 rounded-xl flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer uppercase tracking-wider"
                    >
                      <span>🛍️</span>
                      <span>{lang === "bn" ? "অর্ডার করুন" : "ORDER NOW"}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-gray-100">
            
            {/* Header */}
            <div className="p-5 border-indigo-800 border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#3730a3]" />
                <h3 className="font-bold text-gray-900 text-indigo-900lue-600ase">
                  {lang === "bn" ? "আপনার শপিং কার্ট" : "Shopping Basket"}
                </h3>
                <span className="bg-[#3730a3]/10 text-[#3730a3] text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                id="close-cart-drawer"
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-indigo-900enter space-y-3">
                  <span className="text-indigo-900lue-600xl">🛒</span>
                  <p className="text-gray-500 font-bold">{lang === "bn" ? "আপনার কার্টটি খালি!" : "Your cart is currently empty"}</p>
                  <button
                    id="start-shopping-btn"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#3730a3] text-white font-bold text-xs py-2 px-4 rounded shadow-xs"
                  >
                    {lang === "bn" ? "কেনাকাটা শুরু করুন" : "Continue Browsing"}
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50 border border-gray-100 rounded-lg relative group">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded object-cover border border-gray-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm truncate">
                          {lang === "bn" ? item.product.banglaName || item.product.name : item.product.name}
                        </h4>
                        <span className="text-xs text-gray-400 font-semibold block mt-0.5">৳{item.product.price}</span>
                      </div>

                      {/* Quantity selector */}
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          id={`dec-qty-${item.product.id}`}
                          onClick={() => handleUpdateCartQty(item.product.id, -1)}
                          className="p-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-md"
                        >
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-4 text-indigo-900enter">{item.quantity}</span>
                        <button
                          id={`inc-qty-${item.product.id}`}
                          onClick={() => handleUpdateCartQty(item.product.id, 1)}
                          className="p-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-md"
                        >
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>

                    {/* Delete button */}
                    <button
                      id={`remove-item-${item.product.id}`}
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="absolute top-3 right-3 text-gray-400 hover:text-[#3730a3] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Calculations Footer */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-gray-100 bg-gray-50/50 space-y-4">
                {/* Coupon input */}
                <div className="flex bg-white border border-gray-200 rounded-lg p-1 overflow-hidden">
                  <input
                    id="coupon-code-input"
                    type="text"
                    placeholder={lang === "bn" ? "কুপন কোড (যেমনঃ FB20)" : "Promo code (try FB20)"}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-transparent border-none text-xs font-bold text-gray-800 px-3 py-2 outline-none"
                  />
                  {couponCode && (
                    <button
                      id="clear-coupon-btn"
                      onClick={() => setCouponCode("")}
                      className="p-2 hover:bg-gray-100 text-gray-400 rounded-lg flex items-center justify-center"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {couponCode.toUpperCase() === "FB20" && (
                  <p className="text-[11px] text-[#3730a3] font-bold flex items-center gap-1 bg-[#3730a3]/5 border border-[#3730a3]/15 p-2 rounded-lg">
                    <span>🎉</span>
                    {lang === "bn" ? "ফেসবুক অ্যাড স্পেশাল ২০% ডিসকাউন্ট সক্রিয়!" : "FB20: 20% discount successfully applied!"}
                  </p>
                )}

                <div className="space-y-2 text-xs font-medium text-gray-500">
                  <div className="flex justify-between">
                    <span>{lang === "bn" ? "সাবটোটাল" : "Basket Subtotal"}</span>
                    <span className="text-gray-800 font-bold">৳{cartSubtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#3730a3]">
                      <span>{lang === "bn" ? "ডিসকাউন্ট (২০%)" : "Promo discount (20%)"}</span>
                      <span className="font-bold">-৳{discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>
                      {lang === "bn" ? "ডেলিভারি চার্জ" : "Shipping courier fee"}{" "}
                      <span className="text-[10px] text-gray-400">({customerDistrict.split(" ")[0]})</span>
                    </span>
                    <span className="text-gray-800 font-bold">৳{deliveryCharge}</span>
                  </div>
                  <div className="flex justify-between text-indigo-900lue-600ase font-black text-gray-900 pt-2 border-t border-gray-100">
                    <span>{lang === "bn" ? "সর্বমোট মূল্য" : "Payable Amount"}</span>
                    <span>৳{cartTotal}</span>
                  </div>
                </div>

                <button
                  id="checkout-drawer-submit"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="w-full bg-[#3730a3] hover:bg-[#4338ca] text-white font-bold text-sm py-3.5 rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{lang === "bn" ? "ক্যাশ অন চেকআউটে যান" : "Proceed to Secure Checkout"}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* SECURE CHECKOUT OVERLAY PANEL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100">

            {/* Header */}
            <div className="p-5 border-indigo-800 border-gray-100 flex justify-between items-center bg-[#fbfbfb]">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#3730a3]" />
                <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
                  {lang === "bn" ? "ক্যাশ অন ডেলিভারি চেকআউট" : "Express Secure Checkout"}
                </h3>
              </div>
              <button
                id="close-checkout-modal"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full text-gray-500 animate-pulse"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handlePlaceOrder} className="p-5 space-y-4 text-xs font-medium">

              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-gray-500 font-bold block">{lang === "bn" ? "আপনার নাম *" : "Full Name *"}</label>
                <input
                  id="checkout-name-input"
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-red-500 focus:ring-[#3730a3] focus:bg-white transition-all"
                  placeholder={lang === "bn" ? "যেমনঃ তানজিম আহমেদ" : "e.g. Tanzim Ahmed"}
                />
              </div>

              {/* Phone number */}
              <div className="space-y-1.5">
                <label className="text-gray-500 font-bold block">{lang === "bn" ? "মোবাইল নম্বর *" : "Active Phone Number *"}</label>
                <input
                  id="checkout-phone-input"
                  type="tel"
                  required
                  pattern="[0-9+]*"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-gray-800 font-bold tracking-wider focus:outline-none focus:ring-red-500 focus:ring-[#3730a3] focus:bg-white transition-all"
                  placeholder="e.g. 01712345678"
                />
              </div>

              {/* Division Select */}
              <div className="space-y-1.5">
                <label className="text-gray-500 font-bold block">{lang === "bn" ? "বিভাগ নির্ধারণ করুন *" : "Delivery Division *"}</label>
                <select
                  id="checkout-division-select"
                  value={customerDivision}
                  onChange={(e) => setCustomerDivision(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:ring-red-500 focus:ring-[#3730a3] focus:bg-white transition-all"
                >
                  {BANGLADESH_DIVISIONS.map((div) => (
                    <option key={div} value={div}>
                      {div}
                    </option>
                  ))}
                </select>
              </div>

              {/* District Select */}
              <div className="space-y-1.5">
                <label className="text-gray-500 font-bold block">{lang === "bn" ? "জেলা নির্ধারণ করুন *" : "Delivery District *"}</label>
                <select
                  id="checkout-district-select"
                  value={customerDistrict}
                  onChange={(e) => setCustomerDistrict(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:ring-red-500 focus:ring-[#3730a3] focus:bg-white transition-all"
                >
                  {(DIVISION_TO_DISTRICTS[customerDivision] || []).map((dist) => (
                    <option key={dist} value={dist}>
                      {dist}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-gray-400 block mt-1">
                  {lang === "bn" 
                    ? "* ঢাকা জেলায় ডেলিভারি চার্জ ৮০ টাকা, ঢাকার বাইরে কুরিয়ার চার্জ ১৫০ টাকা।" 
                    : "* Delivery inside Dhaka: 80 BDT, outside Dhaka: 150 BDT."}
                </span>
              </div>

              {/* Thana/Upazila */}
              <div className="space-y-1.5">
                <label className="text-gray-500 font-bold block">{lang === "bn" ? "থানা নির্ধারণ করুন *" : "Thana / Upazila *"}</label>
                <select
                  id="checkout-thana-input"
                  required
                  value={customerThana}
                  onChange={(e) => setCustomerThana(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-gray-800 font-bold focus:outline-none focus:ring-red-500 focus:ring-[#3730a3] focus:bg-white transition-all"
                >
                  {(DISTRICT_TO_THANAS[customerDistrict] || []).map((thana) => (
                    <option key={thana} value={thana}>
                      {thana}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full address */}
              <div className="space-y-1.5">
                <label className="text-gray-500 font-bold block">{lang === "bn" ? "বিস্তারিত ঠিকানা *" : "Complete Shipping Address *"}</label>
                <textarea
                  id="checkout-address-input"
                  required
                  rows={2}
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded px-4 py-3 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-red-500 focus:ring-[#3730a3] focus:bg-white resize-none transition-all"
                  placeholder={lang === "bn" ? "বাড়ি নং, রোড নং, এলাকা, থানা" : "House number, Street, Area, Thana"}
                />
              </div>

              {/* Amount Info summary */}
              <div className="bg-gray-50 border border-gray-100 p-4 rounded flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">{lang === "bn" ? "সর্বমোট সংগ্রহযোগ্য মূল্য" : "Total COD Payable"}</span>
                  <span className="text-lg font-black text-[#3730a3]">৳{cartTotal}</span>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 text-[10px] font-bold bg-[#3730a3]/10 text-[#3730a3] rounded uppercase tracking-wider">
                    {lang === "bn" ? "হাতে পেয়ে টাকা দিন" : "Pay Cash on Delivery"}
                  </span>
                </div>
              </div>

              {/* Confirm order button */}
              <button
                id="checkout-form-submit"
                type="submit"
                className="w-full bg-[#3730a3] hover:bg-[#4338ca] text-white font-bold text-sm py-3.5 rounded shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>{lang === "bn" ? "অর্ডার নিশ্চিত করুন (৳ক্যাশ অন ডেলিভারি)" : "Confirm Order & Save Track ID"}</span>
              </button>
            </form>

          </div>
        </div>
      )}

      {/* SUCCESS MODAL with WhatsApp Redirect Button */}
      {orderSuccessDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in animate-duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-green-100 text-center space-y-6">
            
            {/* Success Icon */}
            <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center border border-green-100 text-green-500">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                {lang === "bn" ? "অর্ডার সফলভাবে গ্রহণ করা হয়েছে! 🎉" : "Order Successfully Received! 🎉"}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {lang === "bn" 
                  ? "আপনার অর্ডারটি আমাদের ডাটাবেজে রেকর্ড করা হয়েছে। নিশ্চিতকরণের জন্য দয়া করে নিচের বোতামে ক্লিক করে আমাদের হোয়াটসঅ্যাপে মেসেজ পাঠান।" 
                  : "Your order is successfully recorded. Please tap the button below to confirm with us on WhatsApp."}
              </p>
            </div>

            {/* Tracking Card */}
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-1">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                {lang === "bn" ? "আপনার ট্র্যাকিং আইডি (Tracking ID)" : "YOUR TRACKING ID"}
              </span>
              <span className="text-lg font-mono font-black text-red-500 block">
                {orderSuccessDetails.id}
              </span>
              <span className="text-xs text-gray-400 block font-medium">
                {lang === "bn" ? "(এই আইডি দিয়ে হোমপেজে লাইভ কুরিয়ার ট্র্যাক করতে পারবেন)" : "(Use this ID to track your parcel live on our site)"}
              </span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col gap-3">
              {/* WhatsApp Button */}
              <a
                href={orderSuccessDetails.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOrderSuccessDetails(null)}
                className="w-full bg-[#25D366] hover:bg-[#20ba56] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2.5 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98] duration-200 group"
              >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-bold">
                  {lang === "bn" ? "হোয়াটসঅ্যাপে অর্ডার নিশ্চিত করুন" : "Confirm Order on WhatsApp"}
                </span>
              </a>

              {/* Keep on system only button */}
              <button
                onClick={() => setOrderSuccessDetails(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold py-3.5 px-6 rounded-2xl text-xs transition-colors cursor-pointer"
              >
                {lang === "bn" ? "শুধুমাত্র সিস্টেমে সেভ রাখুন (হোয়াটসঅ্যাপ ছাড়া)" : "Save on System Only (No WhatsApp)"}
              </button>
            </div>

            <p className="text-[10px] text-gray-400">
              {lang === "bn" 
                ? "* হোয়াটসঅ্যাপে অর্ডার কনফার্ম করলে আপনার কুরিয়ার প্রসেসিং আরও দ্রুত হবে।" 
                : "* WhatsApp verification ensures faster shipping processing."}
            </p>
          </div>
        </div>
      )}

      {/* Footer Branding */}
      <footer className="mt-auto bg-white border-t border-gray-100 py-8 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p onClick={handleBrandClick} className="font-semibold text-gray-500 cursor-pointer select-none">
            © 2026 {lang === "bn" ? "জহুরুল বিডি-শপ ই-কমার্স" : "JOHURUL.BDShop Open Source E-Commerce System"}. {lang === "bn" ? "সর্বস্বত্ব সংরক্ষিত।" : "All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-gray-400 font-medium">
            <span className="hover:text-[#3730a3] transition-colors cursor-pointer" onClick={() => setCurrentView("shop")}>🛍️ {lang === "bn" ? "হোম পেজ" : "Home Storefront"}</span>
            <span>·</span>
            <span className="hover:text-[#3730a3] transition-colors cursor-pointer" onClick={() => setCurrentView("track")}>🔍 {lang === "bn" ? "লাইভ কুরিয়ার ট্র্যাকিং" : "Courier Tracking"}</span>
            <span>·</span>
            <span className="hover:text-[#3730a3] transition-colors cursor-pointer" onClick={() => setCurrentView("campaign")}>📢 {lang === "bn" ? "ফেসবুক মার্কেটিং টুল" : "FB Ads Assistant"}</span>
            {showAdminEntryPoints && (
              <>
                <span>·</span>
                <span className="hover:text-purple-600 transition-colors cursor-pointer" onClick={() => setCurrentView("admin")}>🛠️ {lang === "bn" ? "অ্যাডমিন ড্যাশবোর্ড" : "Owner Panel"}</span>
              </>
            )}
          </div>
          <p className="text-[10px] text-gray-300">
            {lang === "bn" 
              ? "এই অ্যাপ্লিকেশনটি সম্পূর্ণ বিনামূল্যে ও ওপেন সোর্স প্রযুক্তিতে তৈরি। ফেসবুক বিজ্ঞাপনের সাথে সামঞ্জস্যপূর্ণ।" 
              : "Built using Google AI Studio Build environment, fully optimized for Facebook campaign landing page integration."}
          </p>
        </div>
      </footer>
    </div>
  );
}
