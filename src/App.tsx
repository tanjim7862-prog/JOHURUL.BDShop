import React, { useState, useEffect, useMemo } from "react";
import { Product, CartItem, Order, OrderStatus, Coupon } from "./types";
import { INITIAL_PRODUCTS, BANGLADESH_DIVISIONS, DIVISION_TO_DISTRICTS, DISTRICT_TO_THANAS, createDefaultTrackingHistory } from "./data";
import ProductCard from "./components/ProductCard";
import FlashSale from "./components/FlashSale";
import FilterSidebar, { FilterSettings } from "./components/FilterSidebar";
import ProductDetails from "./components/ProductDetails";
import TrackingTimeline from "./components/TrackingTimeline";
import FacebookAdPreview from "./components/FacebookAdPreview";
import AdminPanel from "./components/AdminPanel";
import SmartSearchBar from "./components/SmartSearchBar";
import CustomerDashboard from "./components/CustomerDashboard";
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
  const [currentView, setCurrentView] = useState<"shop" | "track" | "admin" | "account">("shop");

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

  const [savedForLater, setSavedForLater] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("mystore_saved_for_later");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("mystore_saved_for_later", JSON.stringify(savedForLater));
  }, [savedForLater]);

  // Wishlist and Filter States
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("mystore_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 5000;
    const prices = products.map((p) => p.isFlashSale && p.flashSalePrice ? p.flashSalePrice : p.price);
    return Math.max(...prices, 5000);
  }, [products]);

  const [filters, setFilters] = useState<FilterSettings>(() => ({
    priceMin: 0,
    priceMax: 10000, // will be updated dynamically or high default
    minRating: 0,
    stockStatus: "all",
    sortBy: "popularity"
  }));

  // Ensure default priceMax fits max product price on mount
  useEffect(() => {
    setFilters(f => ({ ...f, priceMax: maxProductPrice }));
  }, [maxProductPrice]);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const handleToggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const updated = prev.includes(product.id)
        ? prev.filter((id) => id !== product.id)
        : [...prev, product.id];
      localStorage.setItem("mystore_wishlist", JSON.stringify(updated));
      return updated;
    });
  };

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

  const handleCancelOrder = async (orderId: string) => {
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          status: OrderStatus.CANCELLED,
          trackingHistory: [
            ...o.trackingHistory,
            {
              status: OrderStatus.CANCELLED,
              title: "Order Cancelled",
              banglaTitle: "অর্ডার বাতিল",
              description: "Customer requested order cancellation.",
              banglaDescription: "গ্রাহকের অনুরোধে অর্ডারটি বাতিল করা হয়েছে।",
              timestamp: new Date().toLocaleString(),
              completed: true
            }
          ]
        };
      }
      return o;
    });
    await updateOrdersAndSync(updatedOrders);
  };

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // AI Semantic Search States & Logic
  const [semanticSearchResults, setSemanticSearchResults] = useState<Product[] | null>(null);
  const [isSemanticSearching, setIsSemanticSearching] = useState<boolean>(false);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSemanticSearchResults(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setIsSemanticSearching(true);
      fetch(`/api/ai/search?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.products) {
            setSemanticSearchResults(data.products);
          }
        })
        .catch(err => {
          console.error("AI Semantic search failed:", err);
        })
        .finally(() => {
          setIsSemanticSearching(false);
        });
    }, 450); // 450ms debounce

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [trackingSearchId, setTrackingSearchId] = useState<string>("");
  const [selectedOrderToTrack, setSelectedOrderToTrack] = useState<Order | null>(null);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<{ id: string; whatsappUrl: string } | null>(null);

  // Marketing Pixel Settings States
  const [fbPixelId, setFbPixelId] = useState<string>(() => localStorage.getItem("mystore_fb_pixel") || "");
  const [ttPixelId, setTtPixelId] = useState<string>(() => localStorage.getItem("mystore_tt_pixel") || "");
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() => localStorage.getItem("mystore_whatsapp") || "8801795339373");

  useEffect(() => {
    if (whatsappNumber) {
      localStorage.setItem("mystore_whatsapp", whatsappNumber);
    } else {
      localStorage.removeItem("mystore_whatsapp");
    }
  }, [whatsappNumber]);

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
  const [customerEmail, setCustomerEmail] = useState<string>("");
  const [customerAddress, setCustomerAddress] = useState<string>("");
  const [customerDivision, setCustomerDivision] = useState<string>("Dhaka (ঢাকা)");
  const [customerDistrict, setCustomerDistrict] = useState<string>("Dhaka (ঢাকা)");
  const [customerThana, setCustomerThana] = useState<string>("Mirpur (মিরপুর)");
  const [couponCode, setCouponCode] = useState<string>("");
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<"cod" | "online">("cod");
  const [onlineGatewayType, setOnlineGatewayType] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [paymentTransactionId, setPaymentTransactionId] = useState<string>("");
  const [activeCouponNotification, setActiveCouponNotification] = useState<string | null>(null);

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem("mystore_coupons");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return [
      {
        id: "c-1",
        code: "FB20",
        type: "percentage",
        value: 20,
        minPurchase: 0,
        expiryDate: "2026-12-31",
        descriptionEn: "Facebook Ad Campaign Special 20% discount",
        descriptionBn: "ফেসবুক অ্যাড স্পেশাল ২০% ডিসকাউন্ট",
        isActive: true
      },
      {
        id: "c-2",
        code: "SAVE100",
        type: "flat",
        value: 100,
        minPurchase: 1000,
        expiryDate: "2026-12-31",
        descriptionEn: "Get 100 BDT flat discount on minimum purchase of 1000 BDT",
        descriptionBn: "১০০০ টাকা ক্রয়ে ১০০ টাকা ফ্ল্যাট ডিসকাউন্ট",
        isActive: true
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("mystore_coupons", JSON.stringify(coupons));
  }, [coupons]);

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
      const upperCoupon = coupon.trim().toUpperCase();
      setCouponCode(upperCoupon);
      const matched = coupons.find(c => c.code.toUpperCase() === upperCoupon && c.isActive);
      if (matched) {
        setActiveCouponNotification(
          lang === "bn" 
            ? `🔥 কুপন কোড '${matched.code}' যোগ করা হয়েছে! (${matched.descriptionBn})` 
            : `🔥 Coupon code '${matched.code}' applied successfully! (${matched.descriptionEn})`
        );
      } else if (upperCoupon === "FB20") {
        setActiveCouponNotification(
          lang === "bn" 
            ? "🔥 ফেসবুক ক্যাম্পেইন অফার অ্যাক্টিভ! ২০% ডিসকাউন্ট যোগ হয়েছে।" 
            : "🔥 Facebook Campaign Active! 20% discount coupon applied."
        );
      }
    }
  }, [products, lang, coupons]);

  // Cart operations
  const handleAddToCart = (
    product: Product, 
    quantity: number = 1, 
    selectedSize?: string, 
    selectedColor?: string, 
    price?: number
  ) => {
    if (product.stock === 0) return;

    const finalPrice = price !== undefined ? price : (product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price);

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => 
        item.product.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );
      if (existingIdx > -1) {
        const newQty = prevCart[existingIdx].quantity + quantity;
        if (newQty > product.stock) return prevCart; // Exceeds stock
        const updated = [...prevCart];
        updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedSize, selectedColor, price: finalPrice }];
      }
    });

    // Track AddToCart Pixel event
    trackPixelEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      value: finalPrice * quantity,
      currency: "BDT"
    });

    // Notify user elegantly
    const toast = document.createElement("div");
    toast.className = "fixed bottom-5 right-5 bg-indigo-800 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg z-50 animate-fade-in flex items-center gap-2";
    toast.innerHTML = `<span>✔️</span> ${lang === "bn" ? "কার্টে যোগ করা হয়েছে!" : "Added to cart successfully!"}`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  const handleOrderNow = (
    product: Product, 
    selectedSize?: string, 
    selectedColor?: string, 
    price?: number
  ) => {
    if (product.stock === 0) return;

    const finalPrice = price !== undefined ? price : (product.isFlashSale && product.flashSalePrice ? product.flashSalePrice : product.price);

    // Check if product is already in cart with same variations, if not, add it
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => 
        item.product.id === product.id && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor
      );
      if (existingIdx > -1) {
        return prevCart;
      } else {
        return [...prevCart, { product, quantity: 1, selectedSize, selectedColor, price: finalPrice }];
      }
    });

    // Track AddToCart Pixel event for immediate order/buy now
    trackPixelEvent("AddToCart", {
      content_name: product.name,
      content_ids: [product.id],
      value: finalPrice,
      currency: "BDT"
    });

    // Close details modal if open
    setSelectedProductDetails(null);
    // Open checkout immediately!
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQty = (productId: string, delta: number, selectedSize?: string, selectedColor?: string) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (
          item.product.id === productId &&
          item.selectedSize === selectedSize &&
          item.selectedColor === selectedColor
        ) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) return item; // Exceeds stock
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter((item): item is CartItem => item !== null);
    });
  };

  const handleRemoveFromCart = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setCart((prevCart) => prevCart.filter((item) => 
      !(item.product.id === productId && 
        item.selectedSize === selectedSize && 
        item.selectedColor === selectedColor)
    ));
  };

  const handleSaveForLater = (item: CartItem) => {
    setCart((prevCart) => prevCart.filter((cartItem) => 
      !(cartItem.product.id === item.product.id && 
        cartItem.selectedSize === item.selectedSize && 
        cartItem.selectedColor === item.selectedColor)
    ));
    setSavedForLater((prevSaved) => {
      const exists = prevSaved.some((savedItem) => 
        savedItem.product.id === item.product.id && 
        savedItem.selectedSize === item.selectedSize && 
        savedItem.selectedColor === item.selectedColor
      );
      if (exists) return prevSaved;
      return [...prevSaved, item];
    });
  };

  const handleMoveToCart = (item: CartItem) => {
    setSavedForLater((prevSaved) => prevSaved.filter((savedItem) => 
      !(savedItem.product.id === item.product.id && 
        savedItem.selectedSize === item.selectedSize && 
        savedItem.selectedColor === item.selectedColor)
    ));
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((cartItem) => 
        cartItem.product.id === item.product.id && 
        cartItem.selectedSize === item.selectedSize && 
        cartItem.selectedColor === item.selectedColor
      );
      if (existingIdx > -1) {
        return prevCart;
      } else {
        return [...prevCart, item];
      }
    });
  };

  const handleRemoveFromSavedForLater = (productId: string, selectedSize?: string, selectedColor?: string) => {
    setSavedForLater((prevSaved) => prevSaved.filter((savedItem) => 
      !(savedItem.product.id === productId && 
        savedItem.selectedSize === selectedSize && 
        savedItem.selectedColor === selectedColor)
    ));
  };

  // Cart math
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.price !== undefined ? item.price : (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price)) * item.quantity, 0);
  
  // Find matching active coupon
  const matchedCoupon = useMemo(() => {
    const cleanCode = couponCode.trim().toUpperCase();
    if (!cleanCode) return null;
    return coupons.find(c => c.code.toUpperCase() === cleanCode && c.isActive);
  }, [couponCode, coupons]);

  const discountAmount = useMemo(() => {
    if (!matchedCoupon) {
      if (couponCode.toUpperCase() === "FB20") {
        return Math.round(cartSubtotal * 0.20);
      }
      return 0;
    }
    if (cartSubtotal < matchedCoupon.minPurchase) return 0;
    if (matchedCoupon.type === "percentage") {
      return Math.round(cartSubtotal * (matchedCoupon.value / 100));
    } else {
      return Math.min(matchedCoupon.value, cartSubtotal);
    }
  }, [matchedCoupon, couponCode, cartSubtotal]);

  // Dhaka delivery is 80 BDT, outside Dhaka is 150 BDT. Free delivery on orders over 3000 BDT!
  const deliveryCharge = useMemo(() => {
    if (cart.length === 0) return 0;
    if (cartSubtotal >= 3000) return 0;
    return customerDistrict.toLowerCase().includes("dhaka") ? 80 : 150;
  }, [customerDistrict, cart, cartSubtotal]);

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
          item_price: item.price || (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price),
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
    const sourceProducts = semanticSearchResults !== null ? semanticSearchResults : products;
    const result = sourceProducts.filter((p) => {
      const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
      
      const term = searchQuery.toLowerCase();
      // If we are using semantic search results, we don't need secondary text filter because AI already filtered it!
      const matchesSearch = semanticSearchResults !== null ? true : (
        p.name.toLowerCase().includes(term) || 
        (p.banglaName && p.banglaName.toLowerCase().includes(term)) ||
        p.category.toLowerCase().includes(term)
      );

      const activePrice = p.isFlashSale && p.flashSalePrice ? p.flashSalePrice : p.price;
      const matchesPrice = activePrice >= filters.priceMin && activePrice <= filters.priceMax;

      const matchesRating = p.rating >= filters.minRating;

      let matchesStock = true;
      if (filters.stockStatus === "in_stock") {
        matchesStock = p.stock > 0;
      } else if (filters.stockStatus === "out_of_stock") {
        matchesStock = p.stock <= 0;
      }

      return matchesCategory && matchesSearch && matchesPrice && matchesRating && matchesStock;
    });

    // Apply sorting
    if (filters.sortBy === "newest") {
      return [...result].sort((a, b) => Number(b.id) - Number(a.id));
    } else if (filters.sortBy === "price_low_high") {
      return [...result].sort((a, b) => {
        const ap = a.isFlashSale && a.flashSalePrice ? a.flashSalePrice : a.price;
        const bp = b.isFlashSale && b.flashSalePrice ? b.flashSalePrice : b.price;
        return ap - bp;
      });
    } else if (filters.sortBy === "price_high_low") {
      return [...result].sort((a, b) => {
        const ap = a.isFlashSale && a.flashSalePrice ? a.flashSalePrice : a.price;
        const bp = b.isFlashSale && b.flashSalePrice ? b.flashSalePrice : b.price;
        return bp - ap;
      });
    } else {
      // default: popularity / salesCount desc
      return [...result].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
    }
  }, [products, selectedCategory, searchQuery, filters, semanticSearchResults]);

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

    if (checkoutPaymentMethod === "online" && !paymentTransactionId.trim()) {
      alert(lang === "bn" ? "দয়া করে পেমেন্টের ট্রানজেকশন আইডি দিন!" : "Please enter the payment Transaction ID!");
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
      paymentMethod: checkoutPaymentMethod,
      onlineGatewayType: checkoutPaymentMethod === "online" ? onlineGatewayType : undefined,
      paymentTransactionId: checkoutPaymentMethod === "online" ? paymentTransactionId : undefined,
      status: OrderStatus.RECEIVED,
      trackingHistory: createDefaultTrackingHistory(new Date()),
      createdAt: new Date().toISOString(),
      fbCampaignRef: campaignRef,
      customerEmail: customerEmail || undefined
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
      const itemPrice = item.price || (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price);
      waMessage += `${index + 1}. *${prodName}*\n`;
      waMessage += `   - পরিমাণ (Qty): ${item.quantity} x ৳${itemPrice}\n`;
      if (item.selectedSize) {
        waMessage += `   - সাইজ (Size): ${item.selectedSize}\n`;
      }
      if (item.selectedColor) {
        waMessage += `   - কালার (Color): ${item.selectedColor}\n`;
      }
      if (item.product.image) {
        waMessage += `   - ছবি (Image URL): ${item.product.image}\n`;
      }
    });
    
    waMessage += `\n*পেমেন্ট পদ্ধতি (Payment):* ${
      checkoutPaymentMethod === "online" 
        ? `Manual Online Payment (${onlineGatewayType.toUpperCase()})` 
        : "Cash on Delivery (ক্যাশ অন ডেলিভারি)"
    }\n`;
    if (checkoutPaymentMethod === "online") {
      waMessage += `*ট্রানজেকশন আইডি (Transaction ID):* ${paymentTransactionId}\n`;
    }
    waMessage += `\n*ডেলিভারি চার্জ (Delivery):* ৳${deliveryCharge}\n`;
    if (discountAmount > 0) {
      waMessage += `*ডিসকাউন্ট (Discount):* -৳${discountAmount}\n`;
    }
    waMessage += `*সর্বমোট সংগ্রহযোগ্য মূল্য (Total Payable):* ৳${cartTotal}\n\n`;
    waMessage += `ধন্যবাদ! (Thank you for ordering from JOHURUL.BDShop)`;

    const encodedMessage = encodeURIComponent(waMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;

    // Track Purchase event with Facebook/TikTok pixels
    trackPixelEvent("Purchase", {
      content_ids: cart.map(item => item.product.id),
      value: cartTotal,
      currency: "BDT",
      contents: cart.map(item => ({
        id: item.product.id,
        quantity: item.quantity,
        item_price: item.price || (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price),
        name: item.product.name
      }))
    });

    // Sync order registration with backend Express API
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        customerPhone,
        customerAddress,
        customerDivision,
        customerDistrict,
        customerThana,
        cartItems: [...cart],
        couponCode,
        paymentMethod: checkoutPaymentMethod,
        onlineGatewayType: checkoutPaymentMethod === "online" ? onlineGatewayType : undefined,
        paymentTransactionId: checkoutPaymentMethod === "online" ? paymentTransactionId : undefined,
        fbCampaignRef: campaignRef,
        customerEmail: customerEmail || undefined
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log("Order logged on Express backend server:", data);
    })
    .catch(err => {
      console.error("Express backend server checkout logging failed:", err);
    });

    updateProductsAndSync(updatedProducts);
    updateOrdersAndSync([newOrder, ...orders]);
    setCart([]);
    setCustomerEmail("");
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

  // Supplier Print Intercept Logic
  const printParams = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const supplier = params.get("print_supplier");
    const date = params.get("print_date");
    const orderId = params.get("print_order_id");
    const token = params.get("token");

    if (orderId) {
      return { orderId, supplier, token, type: "single" as const };
    }
    if (supplier && date) {
      return { supplier, date, type: "batch" as const };
    }
    return null;
  }, []);

  const isTokenValid = useMemo(() => {
    if (!printParams || printParams.type !== "single") return true;
    const found = orders.find(o => o.id === printParams.orderId);
    if (!found) return false;
    const expectedToken = btoa(`${found.id}-${found.createdAt || "secure-seed"}`).replace(/=/g, '');
    return printParams.token === expectedToken;
  }, [printParams, orders]);

  const matchingPrintOrders = useMemo(() => {
    if (!printParams) return [];
    
    if (printParams.type === "single") {
      if (!isTokenValid) return [];
      const found = orders.find(o => o.id === printParams.orderId);
      return found ? [found] : [];
    }

    return orders.filter(order => {
      // Check date match
      const isDateOk = (() => {
        if (!order.createdAt) return false;
        try {
          const orderDate = new Date(order.createdAt);
          const y = orderDate.getFullYear();
          const m = String(orderDate.getMonth() + 1).padStart(2, '0');
          const d = String(orderDate.getDate()).padStart(2, '0');
          return `${y}-${m}-${d}` === printParams.date;
        } catch {
          return false;
        }
      })();
      if (!isDateOk) return false;

      // Check supplier match
      return order.cartItems.some(item => {
        const prod = products.find(p => p.id === item.product.id) || item.product;
        return (prod.supplierShop || "").trim().toLowerCase() === printParams.supplier!.trim().toLowerCase();
      });
    });
  }, [printParams, orders, products, isTokenValid]);

  if (printParams) {
    if (printParams.type === "single" && !isTokenValid) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans text-white">
          <div className="max-w-md w-full bg-slate-900 border border-slate-850 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500"></div>
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto text-3xl font-bold mb-4 border border-red-500/20">
              🔒
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              {lang === "bn" ? "রসিদ স্লিপ এক্সেস লকড" : "Access Denied / Invalid Token"}
            </h2>
            <p className="text-xs text-slate-400 mt-2 font-semibold leading-relaxed">
              {lang === "bn"
                ? "এই রসিদ স্লিপ লিংকটি অবৈধ অথবা মেয়াদোত্তীর্ণ হয়েছে। শপ অনারকে একটি নতুন স্লিপ রিকোয়েস্ট লিংক পাঠাতে বলুন।"
                : "This order receipt link has an invalid or expired secure signature. Please ask the shop admin to dispatch a fresh print link."}
            </p>
            <div className="mt-6">
              <button
                onClick={() => {
                  window.location.href = window.location.origin + window.location.pathname;
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-2xl transition-all border border-slate-750 cursor-pointer"
              >
                {lang === "bn" ? "হোম পেজে যান" : "Go to Storefront"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    const formattedDate = (() => {
      if (printParams.type === "single") {
        const order = matchingPrintOrders[0];
        if (!order) return "";
        return new Date(order.createdAt).toLocaleDateString(lang === "bn" ? 'bn-BD' : 'en-US', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      }
      return new Date(printParams.date!).toLocaleDateString(lang === "bn" ? 'bn-BD' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    })();

    const displaySupplier = printParams.supplier || (matchingPrintOrders[0] ? "Multiple" : "N/A");

    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-8 font-sans text-gray-900 print:bg-white print:p-0">
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            .no-print { display: none !important; }
            .print-page { 
              padding: 0 !important; 
              margin: 0 !important; 
              background: white !important;
            }
            .print-card {
              border: 2px solid #000 !important;
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              margin-bottom: 20px !important;
              background: white !important;
              color: black !important;
              border-radius: 0 !important;
              box-shadow: none !important;
            }
          }
        `}} />

        {/* Top Control Bar - Hidden during printing */}
        <div className="no-print max-w-4xl mx-auto mb-6 bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🖨️</span>
              <h1 className="text-lg font-black text-[#3730a3]">
                {lang === "bn" ? "সরবরাহকারী রসিদ প্রিন্ট পোর্টাল" : "Supplier Order Slips Print Console"}
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1 font-bold">
              {lang === "bn"
                ? `শপ: ${displaySupplier.toUpperCase()} | তারিখ: ${formattedDate}`
                : `Shop: ${displaySupplier.toUpperCase()} | Date: ${formattedDate}`}
              {" "}({matchingPrintOrders.length} {lang === "bn" ? "টি পার্সেল পাওয়া গেছে" : "parcels found"})
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => window.print()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
            >
              <span>🖨️</span> {lang === "bn" ? "সব স্লিপ প্রিন্ট করুন" : "Print All Slips"}
            </button>
            <button
              onClick={() => {
                window.location.href = window.location.origin + window.location.pathname;
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs px-4 py-3 rounded-xl transition-all cursor-pointer border border-gray-200"
            >
              {lang === "bn" ? "স্টোরে ফিরে যান" : "Go to Main Store"}
            </button>
          </div>
        </div>

        {/* Slips List Container */}
        <div className="print-page max-w-4xl mx-auto space-y-6">
          {matchingPrintOrders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center shadow-sm">
              <span className="text-5xl">📦</span>
              <h2 className="text-lg font-bold text-gray-700 mt-4">
                {lang === "bn" ? "কোনো রসিদ পাওয়া যায়নি!" : "No slips found!"}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {lang === "bn"
                  ? "নির্বাচিত তারিখে এই সরবরাহকারীর জন্য কোনো অর্ডার পাওয়া যায়নি।"
                  : "No orders found for this supplier on the selected date."}
              </p>
            </div>
          ) : (
            matchingPrintOrders.map((order, idx) => {
              // Filter cart items to only show products belonging to THIS supplier
              const supplierItems = order.cartItems.filter(item => {
                if (!printParams.supplier) return true;
                const prod = products.find(p => p.id === item.product.id) || item.product;
                return (prod.supplierShop || "").trim().toLowerCase() === printParams.supplier.trim().toLowerCase();
              });

              return (
                <div key={order.id} className="print-card bg-white border-2 border-gray-300 rounded-2xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
                  {/* Decorative Scissors Line on Screen */}
                  <div className="no-print absolute top-0 left-0 right-0 h-1 bg-slate-200 border-t border-dashed border-slate-400"></div>
                  
                  {/* Slip Header */}
                  <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded bg-[#3730a3] text-white flex items-center justify-center font-bold text-[10px]">
                          J
                        </div>
                        <span className="text-xs font-black tracking-tight text-gray-900">
                          JOHURUL<span className="text-[#3730a3]">.BDShop</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                        {printParams.supplier 
                          ? (lang === "bn" ? `সরবরাহকারী: ${printParams.supplier}` : `Supplier: ${printParams.supplier}`)
                          : (lang === "bn" ? "সকল সরবরাহকারী" : "All Suppliers")}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="bg-slate-100 px-3 py-1 rounded text-[11px] font-black font-mono text-slate-800 border border-slate-200 inline-block">
                        ORDER ID: #{order.id}
                      </div>
                      <p className="text-[9px] text-gray-400 mt-1 font-semibold">
                        {lang === "bn" ? `রসিদ নং: ${idx + 1} / ${matchingPrintOrders.length}` : `Slip: ${idx + 1} of ${matchingPrintOrders.length}`}
                        {" | "} {formattedDate}
                      </p>
                    </div>
                  </div>

                  {/* Slip Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Side: Delivery Address */}
                    <div className="space-y-3 border-r border-gray-100 pr-0 md:pr-4 print:border-r">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                        <span>📍</span> {lang === "bn" ? "প্রাপকের বিবরণী (Shipping Info)" : "Receiver Details"}
                      </h3>
                      
                      <div className="space-y-1 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100 print:bg-white">
                        <p className="text-sm font-extrabold text-gray-900">
                          {order.customerName}
                        </p>
                        
                        {/* Huge highlight mobile number */}
                        <p className="text-base font-black text-[#3730a3] font-mono tracking-wide py-0.5 print:text-black">
                          📞 {order.customerPhone}
                        </p>
                        
                        <p className="text-xs text-gray-700 font-medium leading-relaxed mt-1">
                          {order.customerAddress}
                        </p>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 pt-1 border-t border-dashed border-gray-200 mt-1">
                          <div>
                            <span className="text-[9px] text-gray-400 uppercase block">{lang === "bn" ? "থানা" : "Thana"}</span>
                            <span className="text-gray-800 font-extrabold">{order.customerThana || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-gray-400 uppercase block">{lang === "bn" ? "জেলা" : "District"}</span>
                            <span className="text-gray-800 font-extrabold">{order.customerDistrict}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Products to Pack */}
                    <div className="space-y-3 flex flex-col justify-between">
                      <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <span>📦</span> {lang === "bn" ? "পণ্য ও বিবরণী (Items to Pack)" : "Products to Pack"}
                        </h3>

                        <div className="space-y-2 mt-2">
                          {supplierItems.map((item, itemIdx) => {
                            const prod = products.find(p => p.id === item.product.id) || item.product;
                            const pName = lang === "bn" ? prod.banglaName || prod.name : prod.name;
                            return (
                              <div key={itemIdx} className="flex gap-3 bg-white p-2 rounded-xl border border-gray-100 items-center justify-between">
                                <div className="flex gap-2.5 items-center min-w-0">
                                  {prod.image && (
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="w-10 h-10 rounded-md object-cover border border-gray-150 shrink-0"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-gray-900 truncate">
                                      {pName}
                                    </p>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {item.selectedSize && (
                                        <span className="text-[8px] font-black bg-slate-100 text-slate-700 px-1 py-0.2 rounded">
                                          Size: {item.selectedSize}
                                        </span>
                                      )}
                                      {item.selectedColor && (
                                        <span className="text-[8px] font-black bg-slate-100 text-slate-700 px-1 py-0.2 rounded">
                                          Color: {item.selectedColor}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span className="text-xs font-black text-white bg-slate-900 px-2.5 py-1 rounded font-mono print:text-black print:border print:bg-white">
                                    QTY: {item.quantity}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Checkboxes for the packer */}
                      <div className="border-t border-dashed border-gray-200 pt-3 flex items-center justify-between gap-2 mt-2">
                        <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
                          {lang === "bn" ? "প্যাকিং চেকলিস্ট:" : "Packer Checklist:"}
                        </span>
                        <div className="flex gap-3 text-[10px] font-black text-gray-600">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" className="rounded text-[#3730a3] focus:ring-[#3730a3] w-3.5 h-3.5" />
                            <span>{lang === "bn" ? "প্যাকড" : "Packed"}</span>
                          </label>
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" className="rounded text-[#3730a3] focus:ring-[#3730a3] w-3.5 h-3.5" />
                            <span>{lang === "bn" ? "ভেরিফাইড" : "Verified"}</span>
                          </label>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Slip Footer Message / Cut indicator */}
                  <div className="border-t border-gray-100 pt-3 mt-4 flex justify-between items-center text-[9px] text-gray-400 font-bold">
                    <span>JOHURUL.BDShop - {lang === "bn" ? "ধন্যবাদ!" : "Thank you!"}</span>
                    <span className="no-print italic flex items-center gap-1">
                      ✂️ ------------------------------------------------------------------------------------------
                    </span>
                    <span className="print:block hidden">
                      Powered by JOHURUL.BDShop OS
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>
      </div>
    );
  }

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

          {/* JOHURUL.BDShop iconic Smart Search Bar with Auto-suggestions inside Header */}
          <SmartSearchBar
            products={products}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSelectProduct={(product) => setSelectedProductDetails(product)}
            lang={lang}
            setCurrentView={setCurrentView}
          />

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
            id="nav-tab-account"
            onClick={() => setCurrentView("account")}
            className={`px-4 py-1.5 rounded-sm text-xs font-bold tracking-wide transition-all uppercase flex items-center gap-1 ${
              currentView === "account"
                ? "bg-[#3730a3] text-white shadow-sm"
                : "text-gray-700 hover:bg-gray-50 hover:text-[#3730a3]"
            }`}
          >
            👤 {lang === "bn" ? "আমার অ্যাকাউন্ট" : "My Account"}
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
          id="mobile-nav-account"
          onClick={() => setCurrentView("account")}
          className={`flex flex-col items-center gap-0.5 ${currentView === "account" ? "text-[#3730a3]" : "text-gray-400"}`}
        >
          <span className="text-lg">👤</span>
          <span>{lang === "bn" ? "প্রোফাইল" : "Profile"}</span>
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
            <FlashSale
              products={products}
              lang={lang}
              onViewDetails={setSelectedProductDetails}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onOrderNow={handleOrderNow}
              wishlistIds={wishlist}
              onToggleWishlist={handleToggleWishlist}
            />

            {/* "Just For You" Title Anchor */}
            <div id="just-for-you-anchor" className="pt-4 flex flex-col sm:flex-row items-center justify-between border-indigo-800 border-gray-200 pb-3 gap-3">
              <h2 className="text-indigo-900 sm:text-lg font-black text-[#212121] uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-6 bg-[#3730a3] rounded-xs inline-block"></span>
                {lang === "bn" ? "জাস্ট ফর ইউ (প্রোডাক্ট কালেকশন)" : "Just For You (Personalized Catalog)"}
              </h2>
            </div>

            {/* Advanced Filtering & Product Catalog Layout */}
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Sidebar Filter Panel */}
              <FilterSidebar
                filters={filters}
                onChangeFilters={setFilters}
                maxProductPrice={maxProductPrice}
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                getCategoryDisplayName={getCategoryDisplayName}
                lang={lang}
                isOpenMobile={isFilterDrawerOpen}
                onCloseMobile={() => setIsFilterDrawerOpen(false)}
              />

              {/* Catalog Product Grid Container */}
              <div className="flex-1 w-full space-y-4">
                
                {/* AI Semantic Search Status Banner */}
                {searchQuery.trim() && (
                  <div className="bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-white p-1.5 rounded-xl shadow-xs border border-indigo-100">
                        <span className="text-sm shrink-0">🤖</span>
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-[#3730a3] tracking-tight">
                          {lang === "bn" ? `"${searchQuery}" এর জন্য জেমিনি এআই সার্চ` : `AI Semantic Search for "${searchQuery}"`}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {isSemanticSearching 
                            ? (lang === "bn" ? "বানান ভুল সংশোধন করে সঠিক পণ্য খোঁজা হচ্ছে..." : "Gemini is correcting typos and interpreting semantic intent...") 
                            : (lang === "bn" ? "শব্দার্থ ও বানান বিশ্লেষণ সফলভাবে সম্পন্ন হয়েছে (Gemini v3.5-Flash)" : "Typo correction and semantic mapping completed via Gemini v3.5-Flash")}
                        </p>
                      </div>
                    </div>
                    {isSemanticSearching && (
                      <div className="w-4 h-4 border-2 border-[#3730a3] border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                )}

                {/* Mobile Filter Button and active count */}
                <div className="flex items-center justify-between gap-3 md:hidden">
                  <button
                    onClick={() => setIsFilterDrawerOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-[#3730a3] rounded-xl text-xs font-black transition-all border border-indigo-100 cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "ফিল্টার ও সর্ট" : "Filters & Sorting"}</span>
                  </button>

                  <span className="text-[10px] text-gray-400 font-bold">
                    {filteredProducts.length} {lang === "bn" ? "টি প্রোডাক্ট পাওয়া গেছে" : "Products Found"}
                  </span>
                </div>

                {/* Grid List of Catalog Products */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-100 rounded-3xl p-6">
                    <span className="text-3xl">🔍</span>
                    <h3 className="mt-4 text-base font-bold text-gray-800">
                      {lang === "bn" ? "কোনো প্রোডাক্ট পাওয়া যায়নি" : "No products match your filters"}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {lang === "bn" ? "অনুগ্রহ করে ফিল্টারের মান পরিবর্তন করে চেষ্টা করুন।" : "Try adjusting your price range, ratings, or stock filters."}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                    {filteredProducts.map((prod) => {
                      const isWishlisted = wishlist.includes(prod.id);
                      return (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          lang={lang}
                          onViewDetails={setSelectedProductDetails}
                          onAddToCart={(p) => handleAddToCart(p, 1)}
                          onOrderNow={handleOrderNow}
                          isWishlisted={isWishlisted}
                          onToggleWishlist={handleToggleWishlist}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
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
                        placeholder={lang === "bn" ? "ইমেইল অ্যাড্রেস" : "Email Address"}
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

                  {/* Removed visible default login credentials block */}
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
                  coupons={coupons}
                  onUpdateCoupons={setCoupons}
                  whatsappNumber={whatsappNumber}
                  onChangeWhatsappNumber={setWhatsappNumber}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: CUSTOMER ACCOUNT DASHBOARD */}
        {currentView === "account" && (
          <CustomerDashboard
            orders={orders}
            onCancelOrder={handleCancelOrder}
            lang={lang}
            products={products}
            onSelectProduct={(product) => setSelectedProductDetails(product)}
            setCurrentView={setCurrentView}
          />
        )}

      </main>

      {/* DETAIL MODAL: Product Details */}
      {selectedProductDetails && (
        <ProductDetails
          product={selectedProductDetails}
          lang={lang}
          onClose={() => setSelectedProductDetails(null)}
          onAddToCart={handleAddToCart}
          onOrderNow={handleOrderNow}
          wishlistIds={wishlist}
          onToggleWishlist={handleToggleWishlist}
          whatsappNumber={whatsappNumber}
          onSelectProduct={(p) => setSelectedProductDetails(p)}
        />
      )}

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in flex justify-end">
          <div className="bg-white w-full max-w-md h-full flex flex-col justify-between shadow-2xl border-l border-gray-100">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-[#3730a3]" />
                <h3 className="font-bold text-gray-900 text-indigo-900">
                  {lang === "bn" ? "আপনার শপিং কার্ট" : "Shopping Basket"}
                </h3>
                <span className="bg-[#3730a3]/10 text-[#3730a3] text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              <button
                id="close-cart-drawer"
                onClick={() => setIsCartOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                  <span className="text-4xl">🛒</span>
                  <p className="text-gray-500 font-bold">{lang === "bn" ? "আপনার কার্টটি খালি!" : "Your cart is currently empty"}</p>
                  <button
                    id="start-shopping-btn"
                    onClick={() => setIsCartOpen(false)}
                    className="bg-[#3730a3] text-white font-bold text-xs py-2 px-4 rounded shadow-xs cursor-pointer"
                  >
                    {lang === "bn" ? "কেনাকাটা শুরু করুন" : "Continue Browsing"}
                  </button>
                </div>
              ) : (
                cart.map((item) => {
                  const itemKey = `${item.product.id}-${item.selectedSize || ""}-${item.selectedColor || ""}`;
                  const itemPrice = item.price !== undefined ? item.price : (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price);
                  
                  return (
                    <div key={itemKey} className="flex gap-4 p-3 bg-gray-50 border border-gray-100 rounded-lg relative group">
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
                          
                          {/* Variations indicators */}
                          {(item.selectedSize || item.selectedColor) && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {item.selectedSize && (
                                <span className="text-[9px] font-black bg-[#3730a3]/5 text-[#3730a3] px-1.5 py-0.5 rounded-md">
                                  {lang === "bn" ? `সাইজ: ${item.selectedSize}` : `Size: ${item.selectedSize}`}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="text-[9px] font-black bg-[#3730a3]/5 text-[#3730a3] px-1.5 py-0.5 rounded-md">
                                  {lang === "bn" ? `রঙ: ${item.selectedColor}` : `Color: ${item.selectedColor}`}
                                </span>
                              )}
                            </div>
                          )}

                          <span className="text-xs text-gray-500 font-bold block mt-1">৳{itemPrice}</span>
                        </div>

                        {/* Quantity selector and Save for Later */}
                        <div className="flex items-center justify-between mt-1">
                          <div className="flex items-center gap-2">
                            <button
                              id={`dec-qty-${itemKey}`}
                              onClick={() => handleUpdateCartQty(item.product.id, -1, item.selectedSize, item.selectedColor)}
                              className="p-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-md cursor-pointer"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="text-xs font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                            <button
                              id={`inc-qty-${itemKey}`}
                              onClick={() => handleUpdateCartQty(item.product.id, 1, item.selectedSize, item.selectedColor)}
                              className="p-1 bg-white hover:bg-gray-100 border border-gray-200 rounded-md cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>

                          <button
                            id={`save-later-${itemKey}`}
                            onClick={() => handleSaveForLater(item)}
                            className="text-[10px] text-indigo-700 hover:text-[#3730a3] hover:underline font-bold cursor-pointer transition-all"
                          >
                            {lang === "bn" ? "পরে কিনুন" : "Save for later"}
                          </button>
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        id={`remove-item-${itemKey}`}
                        onClick={() => handleRemoveFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                        className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}

              {/* SAVED FOR LATER SECTION */}
              {savedForLater.length > 0 && (
                <div className="pt-6 border-t border-gray-100 mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <span>✨</span>
                      {lang === "bn" ? `পরে কেনার জন্য সংরক্ষিত (${savedForLater.length})` : `Saved For Later (${savedForLater.length})`}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {savedForLater.map((item) => {
                      const itemKey = `saved-${item.product.id}-${item.selectedSize || ""}-${item.selectedColor || ""}`;
                      const itemPrice = item.price !== undefined ? item.price : (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price);
                      
                      return (
                        <div key={itemKey} className="flex gap-4 p-3 bg-indigo-50/20 border border-dashed border-indigo-200/50 rounded-lg relative group">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 rounded object-cover border border-gray-100 shrink-0 grayscale-[15%]"
                            referrerPolicy="no-referrer"
                          />

                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-gray-800 text-xs truncate">
                                {lang === "bn" ? item.product.banglaName || item.product.name : item.product.name}
                              </h4>
                              {(item.selectedSize || item.selectedColor) && (
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {item.selectedSize && (
                                    <span className="text-[8px] font-bold bg-[#3730a3]/5 text-[#3730a3] px-1 py-0.2 rounded">
                                      {item.selectedSize}
                                    </span>
                                  )}
                                  {item.selectedColor && (
                                    <span className="text-[8px] font-bold bg-[#3730a3]/5 text-[#3730a3] px-1 py-0.2 rounded">
                                      {item.selectedColor}
                                    </span>
                                  )}
                                </div>
                              )}
                              <span className="text-xs text-[#3730a3] font-bold block mt-0.5">৳{itemPrice}</span>
                            </div>

                            <div className="flex items-center justify-between gap-2 mt-1">
                              <button
                                id={`move-to-cart-${itemKey}`}
                                onClick={() => handleMoveToCart(item)}
                                className="text-[10px] text-emerald-700 hover:text-emerald-800 hover:underline font-extrabold flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                {lang === "bn" ? "কার্টে যোগ করুন" : "Add to Basket"}
                              </button>
                            </div>
                          </div>

                          {/* Remove button */}
                          <button
                            id={`remove-saved-${itemKey}`}
                            onClick={() => handleRemoveFromSavedForLater(item.product.id, item.selectedSize, item.selectedColor)}
                            className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
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

                {matchedCoupon && cartSubtotal >= matchedCoupon.minPurchase ? (
                  <p className="text-[11px] text-[#3730a3] font-bold flex items-center gap-1 bg-[#3730a3]/5 border border-[#3730a3]/15 p-2 rounded-lg">
                    <span>🎉</span>
                    <span>
                      {matchedCoupon.code}: {lang === "bn" ? matchedCoupon.descriptionBn : matchedCoupon.descriptionEn}
                    </span>
                  </p>
                ) : couponCode && matchedCoupon && cartSubtotal < matchedCoupon.minPurchase ? (
                  <p className="text-[11px] text-amber-800 font-bold flex items-center gap-1 bg-amber-50 border border-amber-200 p-2 rounded-lg">
                    <span>⚠️</span>
                    <span>
                      {lang === "bn" 
                        ? `ন্যূনতম ৳${matchedCoupon.minPurchase} কিনতে হবে (প্রয়োজন আরও ৳${matchedCoupon.minPurchase - cartSubtotal})` 
                        : `Min spend of ৳${matchedCoupon.minPurchase} required (needs ৳${matchedCoupon.minPurchase - cartSubtotal} more)`}
                    </span>
                  </p>
                ) : couponCode && !matchedCoupon && couponCode.toUpperCase() === "FB20" ? (
                  <p className="text-[11px] text-[#3730a3] font-bold flex items-center gap-1 bg-[#3730a3]/5 border border-[#3730a3]/15 p-2 rounded-lg">
                    <span>🎉</span>
                    {lang === "bn" ? "ফেসবুক অ্যাড স্পেশাল ২০% ডিসকাউন্ট সক্রিয়!" : "FB20: 20% discount successfully applied!"}
                  </p>
                ) : couponCode && !matchedCoupon ? (
                  <p className="text-[11px] text-red-600 font-bold flex items-center gap-1 bg-red-50 border border-red-100 p-2 rounded-lg">
                    <span>❌</span>
                    <span>
                      {lang === "bn" ? "কুপন কোডটি সঠিক নয়" : "Invalid coupon code"}
                    </span>
                  </p>
                ) : null}

                <div className="space-y-2 text-xs font-medium text-gray-500">
                  <div className="flex justify-between">
                    <span>{lang === "bn" ? "সাবটোটাল" : "Basket Subtotal"}</span>
                    <span className="text-gray-800 font-bold">৳{cartSubtotal}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#3730a3]">
                      <span>
                        {lang === "bn" ? "ডিসকাউন্ট" : "Promo discount"}{" "}
                        {matchedCoupon ? `(${matchedCoupon.code})` : "(FB20)"}
                      </span>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-fade-in flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-gray-100 my-auto">

            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-[#fbfbfb] shrink-0">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#3730a3]" />
                <h3 className="font-bold text-gray-800 text-sm tracking-wide uppercase">
                  {lang === "bn" ? "এক্সপ্রেস চেকআউট এবং পেমেন্ট" : "Express Secure Checkout"}
                </h3>
              </div>
              <button
                id="close-checkout-modal"
                onClick={() => setIsCheckoutOpen(false)}
                className="p-1 hover:bg-gray-200 rounded-full text-gray-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-100">
              
              {/* Left Column: Order Summary & Coupon */}
              <div className="w-full md:w-1/2 p-5 bg-gray-50/50 flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="font-bold text-gray-800 text-xs uppercase tracking-wider mb-3 pb-1 border-b border-gray-100 flex items-center gap-1">
                    <span>📦</span> {lang === "bn" ? "অর্ডার সারাংশ" : "Order Summary"}
                  </h4>
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {cart.map((item) => {
                      const itemKey = `checkout-summary-${item.product.id}-${item.selectedSize || ""}-${item.selectedColor || ""}`;
                      const itemPrice = item.price !== undefined ? item.price : (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price);
                      return (
                        <div key={itemKey} className="flex gap-2 items-center text-[11px] bg-white p-2 rounded-lg border border-gray-100">
                          <img src={item.product.image} className="w-8 h-8 rounded object-cover shrink-0 border border-gray-100" referrerPolicy="no-referrer" />
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-700 truncate">{lang === "bn" ? item.product.banglaName || item.product.name : item.product.name}</p>
                            <p className="text-[9px] text-gray-400 font-medium">
                              {item.selectedSize && `${lang === "bn" ? "সাইজ" : "Size"}: ${item.selectedSize}`}
                              {item.selectedSize && item.selectedColor && " | "}
                              {item.selectedColor && `${lang === "bn" ? "রঙ" : "Color"}: ${item.selectedColor}`}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-bold text-gray-800 block">৳{itemPrice * item.quantity}</span>
                            <span className="text-[9px] text-gray-400 block">{item.quantity} x ৳{itemPrice}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-200/60">
                  {/* Coupon input right in checkout */}
                  <div className="space-y-1">
                    <label className="text-gray-400 font-bold block text-[10px] uppercase tracking-wider">{lang === "bn" ? "কুপন কোড ব্যবহার করুন" : "Have a Promo Code?"}</label>
                    <div className="flex bg-white border border-gray-200 rounded-lg p-1 overflow-hidden">
                      <input
                        id="checkout-coupon-input"
                        type="text"
                        placeholder={lang === "bn" ? "কুপন কোড (যেমনঃ FB20)" : "Promo code (try FB20)"}
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="w-full bg-transparent border-none text-[10px] font-bold text-gray-800 px-2 py-1.5 outline-none"
                      />
                      {couponCode && (
                        <button
                          type="button"
                          onClick={() => setCouponCode("")}
                          className="p-1 hover:bg-gray-100 text-gray-400 rounded flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {matchedCoupon && cartSubtotal >= matchedCoupon.minPurchase ? (
                    <p className="text-[10px] text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-100 p-1.5 rounded">
                      <span>🎉</span>
                      <span>{matchedCoupon.code}: -৳{discountAmount} ({lang === "bn" ? "ডিসকাউন্ট সক্রিয়" : "Discount applied"})</span>
                    </p>
                  ) : couponCode && matchedCoupon && cartSubtotal < matchedCoupon.minPurchase ? (
                    <p className="text-[10px] text-amber-800 font-bold flex items-center gap-1 bg-amber-50 border border-amber-100 p-1.5 rounded">
                      <span>⚠️</span>
                      <span>{lang === "bn" ? `মিনিমাম ৳${matchedCoupon.minPurchase} প্রয়োজন` : `Min ৳${matchedCoupon.minPurchase} needed`}</span>
                    </p>
                  ) : couponCode && !matchedCoupon ? (
                    <p className="text-[10px] text-red-600 font-bold flex items-center gap-1 bg-red-50 border border-red-100 p-1.5 rounded">
                      <span>❌</span>
                      <span>{lang === "bn" ? "কুপনটি সঠিক নয়" : "Invalid coupon"}</span>
                    </p>
                  ) : null}

                  {/* Order Pricing Summary */}
                  <div className="space-y-1.5 text-[11px] font-semibold text-gray-500">
                    <div className="flex justify-between">
                      <span>{lang === "bn" ? "সাবটোটাল" : "Subtotal"}</span>
                      <span className="text-gray-800 font-bold">৳{cartSubtotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-indigo-900">
                        <span>{lang === "bn" ? "ডিসকাউন্ট" : "Discount"}</span>
                        <span className="font-bold">-৳{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>
                        {lang === "bn" ? "ডেলিভারি চার্জ" : "Shipping Fee"}{" "}
                        <span className="text-[9px] text-gray-400">({customerDistrict.split(" ")[0]})</span>
                      </span>
                      <span className="text-gray-800 font-bold">৳{deliveryCharge}</span>
                    </div>
                    <div className="flex justify-between text-xs font-black text-gray-900 pt-1.5 border-t border-gray-200">
                      <span>{lang === "bn" ? "সর্বমোট পরিশোধযোগ্য মূল্য" : "Payable Total"}</span>
                      <span className="text-indigo-900">৳{cartTotal}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Form & Payment Method Selection */}
              <form onSubmit={handlePlaceOrder} className="w-full md:w-1/2 p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-3 max-h-[50vh] md:max-h-none overflow-y-auto pr-1">
                  
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-gray-500 font-bold block">{lang === "bn" ? "আপনার নাম *" : "Full Name *"}</label>
                    <input
                      id="checkout-name-input"
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#3730a3] focus:bg-white transition-all"
                      placeholder={lang === "bn" ? "যেমনঃ তানজিম আহমেদ" : "e.g. Tanzim Ahmed"}
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-gray-500 font-bold block">{lang === "bn" ? "মোবাইল নম্বর *" : "Phone Number *"}</label>
                    <input
                      id="checkout-phone-input"
                      type="tel"
                      required
                      pattern="[0-9+]*"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#3730a3] focus:bg-white transition-all"
                      placeholder="e.g. 01712345678"
                    />
                  </div>

                  {/* Email (Optional) */}
                  <div className="space-y-1">
                    <label className="text-gray-500 font-bold block flex items-center justify-between">
                      <span>{lang === "bn" ? "ইমেইল ঠিকানা (ঐচ্ছিক)" : "Email Address (Optional)"}</span>
                      <span className="text-[9px] text-[#3730a3] font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded-full">
                        {lang === "bn" ? "ফ্রি অর্ডার রিসিট" : "Free Order Receipt"}
                      </span>
                    </label>
                    <input
                      id="checkout-email-input"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#3730a3] focus:bg-white transition-all"
                      placeholder={lang === "bn" ? "যেমনঃ client@domain.com" : "e.g. buyer@example.com"}
                    />
                  </div>

                  {/* division, district, thana grid */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-gray-500 font-bold block">{lang === "bn" ? "বিভাগ *" : "Division *"}</label>
                      <select
                        id="checkout-division-select"
                        value={customerDivision}
                        onChange={(e) => setCustomerDivision(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-[11px] text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#3730a3]"
                      >
                        {BANGLADESH_DIVISIONS.map((div) => (
                          <option key={div} value={div}>{div}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-500 font-bold block">{lang === "bn" ? "জেলা *" : "District *"}</label>
                      <select
                        id="checkout-district-select"
                        value={customerDistrict}
                        onChange={(e) => setCustomerDistrict(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-[11px] text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#3730a3]"
                      >
                        {(DIVISION_TO_DISTRICTS[customerDivision] || []).map((dist) => (
                          <option key={dist} value={dist}>{dist}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-500 font-bold block">{lang === "bn" ? "থানা নির্ধারণ করুন *" : "Thana / Upazila *"}</label>
                    <select
                      id="checkout-thana-input"
                      required
                      value={customerThana}
                      onChange={(e) => setCustomerThana(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-[11px] text-gray-800 font-bold focus:outline-none focus:ring-1 focus:ring-[#3730a3]"
                    >
                      {(DISTRICT_TO_THANAS[customerDistrict] || []).map((thana) => (
                        <option key={thana} value={thana}>{thana}</option>
                      ))}
                    </select>
                  </div>

                  {/* Detailed Address */}
                  <div className="space-y-1">
                    <label className="text-gray-500 font-bold block">{lang === "bn" ? "বিস্তারিত ঠিকানা *" : "Complete Address *"}</label>
                    <textarea
                      id="checkout-address-input"
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-xs text-gray-800 font-semibold focus:outline-none focus:ring-1 focus:ring-[#3730a3] focus:bg-white resize-none transition-all"
                      placeholder={lang === "bn" ? "বাড়ি নং, রোড নং, এলাকা" : "House number, Street, Area"}
                    />
                  </div>

                  {/* PAYMENT METHOD SELECTION */}
                  <div className="space-y-2 pt-1.5 border-t border-gray-100">
                    <label className="text-gray-500 font-bold block text-[11px]">{lang === "bn" ? "পেমেন্ট পদ্ধতি নির্ধারণ করুন *" : "Select Payment Method *"}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setCheckoutPaymentMethod("cod")}
                        className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                          checkoutPaymentMethod === "cod"
                            ? "border-[#3730a3] bg-indigo-50/50 text-[#3730a3]"
                            : "border-gray-200 hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        <p className="text-xs">💵 {lang === "bn" ? "ক্যাশ অন ডেলিভারি" : "Cash on Delivery"}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCheckoutPaymentMethod("online")}
                        className={`p-2 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                          checkoutPaymentMethod === "online"
                            ? "border-[#3730a3] bg-indigo-50/50 text-[#3730a3]"
                            : "border-gray-200 hover:bg-gray-50 text-gray-600"
                        }`}
                      >
                        <p className="text-xs">📱 {lang === "bn" ? "মোবাইল পেমেন্ট" : "Mobile Pay"}</p>
                      </button>
                    </div>

                    {checkoutPaymentMethod === "online" && (
                      <div className="bg-indigo-50/30 border border-indigo-100 rounded-lg p-2.5 space-y-2 animate-slide-up">
                        <p className="text-[10px] text-indigo-950 font-bold leading-relaxed">
                          {lang === "bn"
                            ? `⚠️ আমাদের দেওয়া নম্বরে (${whatsappNumber}) সেন্ড মানি করুন। এরপর নিচে পেমেন্ট গেটওয়ে এবং ট্রানজেকশন আইডি প্রদান করুন:`
                            : `⚠️ Send money to our official number (${whatsappNumber}). Then select gateway and provide Transaction ID:`}
                        </p>
                        
                        <div className="grid grid-cols-3 gap-1.5">
                          {(["bkash", "nagad", "rocket"] as const).map((gw) => (
                            <button
                              type="button"
                              key={gw}
                              onClick={() => setOnlineGatewayType(gw)}
                              className={`py-1 rounded text-[10px] font-black border uppercase text-center cursor-pointer ${
                                onlineGatewayType === gw
                                  ? "bg-[#3730a3] text-white border-[#3730a3]"
                                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              {gw}
                            </button>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <input
                            type="text"
                            required
                            placeholder={lang === "bn" ? "ট্রানজেকশন আইডি (যেমনঃ Trx998X)" : "Transaction ID (e.g. Trx998X)"}
                            value={paymentTransactionId}
                            onChange={(e) => setPaymentTransactionId(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-[11px] font-black tracking-wider text-gray-800 outline-none focus:ring-1 focus:ring-[#3730a3]"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                </div>

                {/* Submit button */}
                <button
                  id="checkout-form-submit"
                  type="submit"
                  className="w-full bg-[#3730a3] hover:bg-[#4338ca] text-white font-bold text-xs py-3 rounded shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer mt-2 shrink-0"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {checkoutPaymentMethod === "online"
                      ? (lang === "bn" ? "পেমেন্টসহ অর্ডার নিশ্চিত করুন" : "Confirm Order with Mobile Payment")
                      : (lang === "bn" ? "ক্যাশ অন ডেলিভারি অর্ডার নিশ্চিত করুন" : "Confirm Cash on Delivery Order")}
                  </span>
                </button>
              </form>
            </div>

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
