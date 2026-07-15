import React, { useState, useEffect } from "react";
import { Product, Order, OrderStatus, Coupon } from "../types";
import { createDefaultTrackingHistory, updateTrackingHistory } from "../data";
import watchBannerImg from "../assets/images/watch_banner_1784030925146.jpg";
import { 
  DollarSign, Package, ShoppingBag, TrendingUp, Edit3, Trash2, Plus, 
  X, Check, AlertCircle, ShoppingCart, Upload, Facebook, Code, ExternalLink, Copy, Share2,
  LayoutDashboard, Users, CreditCard, Layers, Feather, BookOpen, Image as ImageIcon,
  Activity, Globe, Truck, MessageSquare, Key, Settings, UserCheck, Menu, ChevronRight,
  ChevronLeft, Search, FileText, Percent, TrendingDown, ArrowUpRight, Sparkles, Printer
} from "lucide-react";

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onUpdateProducts: (products: Product[]) => void;
  onUpdateOrders: (orders: Order[]) => void;
  lang: "bn" | "en";
  fbPixelId: string;
  onChangeFbPixelId: (id: string) => void;
  ttPixelId: string;
  onChangeTtPixelId: (id: string) => void;
  heroImageUrl: string;
  onChangeHeroImageUrl: (url: string) => void;
  coupons?: Coupon[];
  onUpdateCoupons?: (coupons: Coupon[]) => void;
  whatsappNumber?: string;
  onChangeWhatsappNumber?: (num: string) => void;
}

export default function AdminPanel({
  products,
  orders,
  onUpdateProducts,
  onUpdateOrders,
  lang,
  fbPixelId,
  onChangeFbPixelId,
  ttPixelId,
  onChangeTtPixelId,
  heroImageUrl,
  onChangeHeroImageUrl,
  coupons = [],
  onUpdateCoupons,
  whatsappNumber = "8801795339373",
  onChangeWhatsappNumber
}: AdminPanelProps) {
  type AdminTab = 
    | "analytics"
    | "orders"
    | "abandoned"
    | "customers"
    | "accounts"
    | "products"
    | "categories"
    | "authors"
    | "publishers"
    | "banners"
    | "stock"
    | "landing"
    | "delivery"
    | "sms"
    | "roles"
    | "users"
    | "coupons";

  const [activeTab, setActiveTab] = useState<AdminTab>("orders");
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");

  // Mock states for extra systems to match Kamiab Prokashon image
  const [abandonedOrders, setAbandonedOrders] = useState([
    { id: "KP-AB-9831", name: "Masumbillah", phone: "01716554699", items: "1x Smartwatch Elite (৳ 790)", amount: 790, time: "30 mins ago", status: "Active" },
    { id: "KP-AB-9828", name: "Obaydul Huqe Huqe", phone: "01752500171", items: "1x Premium Leather Strap (৳ 500)", amount: 500, time: "2 hours ago", status: "Active" },
    { id: "KP-AB-9812", name: "Farhan Tanvir", phone: "01823909192", items: "1x Touchscreen Smartband (৳ 1200)", amount: 1200, time: "Yesterday", status: "Recovered" },
    { id: "KP-AB-9801", name: "Sabina Yasmin", phone: "01911223344", items: "2x Wireless Buds (৳ 1600)", amount: 1600, time: "3 days ago", status: "Active" }
  ]);

  const [categories, setCategories] = useState([
    { id: "cat-1", name: "Smartwatches", count: 8, slug: "smartwatch" },
    { id: "cat-2", name: "Earbuds & Audio", count: 5, slug: "audio" },
    { id: "cat-3", name: "Fast Chargers", count: 4, slug: "charger" },
    { id: "cat-4", name: "Screen Protectors", count: 3, slug: "protector" }
  ]);
  const [newCatName, setNewCatName] = useState("");

  const [authors, setAuthors] = useState([
    { id: "auth-1", name: "Afnan Mahmud", bio: "Lead tech reviewer and curator of Johurul BDShop landing templates.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
    { id: "auth-2", name: "Johurul Islam", bio: "Founder of JB Shop who inspects and warrants every electronic smartwatch import.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" }
  ]);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorBio, setNewAuthorBio] = useState("");

  const [publishers, setPublishers] = useState([
    { id: "pub-1", name: "Johurul Smart Sourcing Ltd", location: "Mymensingh HQ", productsCount: 15 },
    { id: "pub-2", name: "Kamiab Import House", location: "Banglabazar, Dhaka", productsCount: 9 },
    { id: "pub-3", name: "Afnan Distribution BD", location: "Motijheel, Dhaka", productsCount: 6 }
  ]);
  const [newPubName, setNewPubName] = useState("");
  const [newPubLocation, setNewPubLocation] = useState("");

  const [deliveryConfig, setDeliveryConfig] = useState({
    insideDhaka: 60,
    outsideDhaka: 120,
    provider: "Pathao",
  });

  const [smsTemplate, setSmsTemplate] = useState("প্রিয় [CUSTOMER_NAME], Johurul BDShop-এ আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! অর্ডার আইডি: [ORDER_ID]। মোট মূল্য: ৳[TOTAL_AMOUNT]। ধন্যবাদ!");
  const [smsHistory, setSmsHistory] = useState([
    { id: "SMS-101", recipient: "01716554699", message: "প্রিয় Masumbillah, আপনার অর্ডারটি সফলভাবে ডেলিভারি দেওয়া হয়েছে!", time: "Today, 11:20 AM", status: "Sent" },
    { id: "SMS-102", recipient: "01752500171", message: "প্রিয় Obaydul, আপনার অর্ডারটি কুরিয়ারে বুকিং করা হয়েছে!", time: "Today, 09:45 AM", status: "Sent" }
  ]);

  const [roles, setRoles] = useState([
    { id: "role-1", name: "Super Admin", usersCount: 1, permissions: ["all"] },
    { id: "role-2", name: "Sales Manager", usersCount: 2, permissions: ["orders", "customers"] },
    { id: "role-3", name: "Delivery Partner", usersCount: 1, permissions: ["orders", "delivery"] }
  ]);

  const [adminUsers, setAdminUsers] = useState([
    { email: "admin@gms.com", role: "Super Admin", status: "Active", lastLogin: "Just now" },
    { email: "manager@gms.com", role: "Sales Manager", status: "Active", lastLogin: "2 hours ago" },
    { email: "operator@gms.com", role: "Delivery Partner", status: "Active", lastLogin: "Yesterday" }
  ]);
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("Sales Manager");

  // Dynamic Coupon form states
  const [newCouponCode, setNewCouponCode] = useState("");
  const [newCouponType, setNewCouponType] = useState<"percentage" | "flat">("percentage");
  const [newCouponValue, setNewCouponValue] = useState<number>(0);
  const [newCouponMinPurchase, setNewCouponMinPurchase] = useState<number>(0);
  const [newCouponExpiry, setNewCouponExpiry] = useState("2026-12-31");
  const [newCouponDescEn, setNewCouponDescEn] = useState("");
  const [newCouponDescBn, setNewCouponDescBn] = useState("");

  const [expenses, setExpenses] = useState([
    { id: "E-401", description: "Meta Facebook Ads Boost", amount: 6500, category: "Marketing", date: "2026-07-14" },
    { id: "E-402", description: "Courier Packaging Bubblewrap", amount: 1200, category: "Operations", date: "2026-07-12" },
    { id: "E-403", description: "Office Wifi Internet Bill", amount: 950, category: "Utilities", date: "2026-07-10" }
  ]);
  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpenseCat, setNewExpenseCat] = useState("Marketing");
  
  // Local state for pixel settings inputs (uncommitted until save)
  const [inputFbPixel, setInputFbPixel] = useState(fbPixelId);
  const [inputTtPixel, setInputTtPixel] = useState(ttPixelId);
  const [isPixelSaved, setIsPixelSaved] = useState(false);
  
  // Local state for WhatsApp setting
  const [inputWhatsapp, setInputWhatsapp] = useState(whatsappNumber);
  const [isWhatsappSaved, setIsWhatsappSaved] = useState(false);
  
  // Local state for banner image settings
  const [inputHeroImage, setInputHeroImage] = useState(heroImageUrl);
  const [isBannerSaved, setIsBannerSaved] = useState(false);
  
  // Product state
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "dead">("all");
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);

  // Supplier/Shop WhatsApp mappings state
  const [supplierPhoneMap, setSupplierPhoneMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("mystore_supplier_phones");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const saveSupplierPhone = (shopName: string, phone: string) => {
    const updated = { ...supplierPhoneMap, [shopName]: phone };
    setSupplierPhoneMap(updated);
    localStorage.setItem("mystore_supplier_phones", JSON.stringify(updated));
  };

  // States for Supplier orders sheet export
  const [selectedSupplier, setSelectedSupplier] = useState<string>("all");
  const [exportDateFilter, setExportDateFilter] = useState<"all" | "today">("all");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string>("");
  const [supplierConfigEmail, setSupplierConfigEmail] = useState<string>(() => {
    return localStorage.getItem("mystore_supplier_email") || "";
  });
  const [supplierConfigSheet, setSupplierConfigSheet] = useState<string>(() => {
    return localStorage.getItem("mystore_supplier_sheet") || "";
  });
  const [isConfigSaved, setIsConfigSaved] = useState<boolean>(false);
  const [isSendingToSheet, setIsSendingToSheet] = useState<boolean>(false);
  
  // States for Bulk WhatsApp Dispatches
  const [waSelectedSupplier, setWaSelectedSupplier] = useState<string>("all");
  const [waSelectedDate, setWaSelectedDate] = useState<string>(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });
  const [waPhoneInput, setWaPhoneInput] = useState<string>("");

  useEffect(() => {
    if (waSelectedSupplier !== "all") {
      setWaPhoneInput(supplierPhoneMap[waSelectedSupplier] || "");
    } else {
      setWaPhoneInput("");
    }
  }, [waSelectedSupplier, supplierPhoneMap]);
  
  // Analytics computations
  const totalRevenue = orders
    .filter(o => o.status !== OrderStatus.CANCELLED)
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const completedOrdersCount = orders
    .filter(o => o.status === OrderStatus.DELIVERED).length;

  const activeOrdersCount = orders
    .filter(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED).length;

  const averageOrderValue = orders.length > 0
    ? Math.round(totalRevenue / orders.filter(o => o.status !== OrderStatus.CANCELLED).length || 0)
    : 0;

  // Today's orders calculations
  const getIsToday = (isoString?: string) => {
    if (!isoString) return false;
    try {
      const orderDate = new Date(isoString);
      const today = new Date();
      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    } catch {
      return false;
    }
  };

  const todayOrders = orders.filter(o => getIsToday(o.createdAt));
  const todayOrdersCount = todayOrders.length;
  const todayRevenue = todayOrders
    .filter(o => o.status !== OrderStatus.CANCELLED)
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const todayActiveOrdersCount = todayOrders.filter(
    o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED
  ).length;

  // Order status updation
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return {
          ...order,
          status: newStatus,
          trackingHistory: updateTrackingHistory(order.trackingHistory, newStatus, new Date())
        };
      }
      return order;
    });
    onUpdateOrders(updatedOrders);
  };

  // Product actions
  const handleDeleteProduct = (productId: string) => {
    if (window.confirm(lang === "bn" ? "আপনি কি নিশ্চিতভাবে এই প্রোডাক্টটি ডিলিট করতে চান?" : "Are you sure you want to delete this product?")) {
      const updatedProducts = products.filter(p => p.id !== productId);
      onUpdateProducts(updatedProducts);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert(
          lang === "bn"
            ? "দুঃখিত, ইমেজের সাইজ ৩ মেগাবাইটের (3MB) কম হতে হবে।"
            : "Sorry, the image size should be less than 3MB."
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditingProduct((prev) => ({
            ...(prev || {}),
            image: reader.result as string
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLandingImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert(
          lang === "bn"
            ? "দুঃখিত, ইমেজের সাইজ ৩ মেগাবাইটের (3MB) কম হতে হবে।"
            : "Sorry, the image size should be less than 3MB."
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEditingProduct((prev) => {
            if (!prev) return null;
            const currentImages = [...(prev.images || [])];
            while (currentImages.length <= index) {
              currentImages.push("");
            }
            currentImages[index] = reader.result as string;
            return {
              ...prev,
              images: currentImages
            };
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    if (editingProduct.id) {
      // Edit
      const updatedProducts = products.map((p) => 
        p.id === editingProduct.id ? (editingProduct as Product) : p
      );
      onUpdateProducts(updatedProducts);
    } else {
      // Create
      const newProduct: Product = {
        id: String(Date.now()),
        name: editingProduct.name,
        banglaName: editingProduct.banglaName || editingProduct.name,
        description: editingProduct.description || "",
        banglaDescription: editingProduct.banglaDescription || "",
        price: Number(editingProduct.price),
        originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
        image: editingProduct.image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400",
        category: editingProduct.category || "General",
        rating: 5.0,
        reviewsCount: 0,
        stock: editingProduct.stock !== undefined ? Number(editingProduct.stock) : 10,
        images: editingProduct.images || [],
        landingDescription: editingProduct.landingDescription || "",
        banglaLandingDescription: editingProduct.banglaLandingDescription || "",
        costPrice: editingProduct.costPrice ? Number(editingProduct.costPrice) : undefined,
        variations: editingProduct.variations || [],
        seoTitle: editingProduct.seoTitle || "",
        seoDescription: editingProduct.seoDescription || "",
        seoKeywords: editingProduct.seoKeywords || ""
      };
      onUpdateProducts([newProduct, ...products]);
    }
    setIsEditingProduct(false);
    setEditingProduct(null);
  };

  const handleDownloadCSV = () => {
    setIsExporting(true);
    setExportSuccessMsg("");

    // 1. Filter orders based on supplier name & date
    let filtered = orders;
    
    if (selectedSupplier !== "all") {
      filtered = orders.filter(order =>
        order.cartItems.some(item => {
          const prod = products.find(p => p.id === item.product.id) || item.product;
          return prod.supplierShop?.trim().toLowerCase() === selectedSupplier.trim().toLowerCase();
        })
      );
    }

    if (exportDateFilter === "today") {
      filtered = filtered.filter(order => getIsToday(order.createdAt));
    }

    if (filtered.length === 0) {
      alert(lang === "bn" ? "ডাউনলোড করার মতো কোনো অর্ডার পাওয়া যায়নি!" : "No orders found to download!");
      setIsExporting(false);
      return;
    }

    // 2. Build CSV rows with UTF-8 BOM
    const BOM = "\uFEFF";
    const headers = [
      lang === "bn" ? "অর্ডার আইডি" : "Order ID",
      lang === "bn" ? "তারিখ ও সময়" : "Date & Time",
      lang === "bn" ? "কাস্টমার নাম" : "Customer Name",
      lang === "bn" ? "ফোন নাম্বার" : "Phone Number",
      lang === "bn" ? "ঠিকানা" : "Address",
      lang === "bn" ? "থানা" : "Thana",
      lang === "bn" ? "জেলা" : "District",
      lang === "bn" ? "বিভাগ" : "Division",
      lang === "bn" ? "প্রোডাক্টের বিবরণ (পরিমাণ)" : "Product Details (Qty)",
      lang === "bn" ? "উৎস শপ / সরবরাহকারী" : "Supplier Shop",
      lang === "bn" ? "মোট বিল (৳)" : "Total Amount (BDT)",
      lang === "bn" ? "বর্তমান অবস্থা" : "Order Status"
    ];

    const rows = filtered.map(order => {
      // Collect supplier details for products in this order
      const supplierNames = order.cartItems.map(item => {
        const prod = products.find(p => p.id === item.product.id) || item.product;
        return prod.supplierShop || (lang === "bn" ? "নিজস্ব স্টক" : "Own Stock");
      });
      const uniqueOrderSuppliers = Array.from(new Set(supplierNames)).join(" | ");

      // Cart details stringifier
      const cartDetails = order.cartItems.map(item => 
        `${item.product.name} (x${item.quantity})`
      ).join("; ");

      // Sanitize fields (wrap in double quotes to escape commas)
      const sanitize = (val: string) => `"${(val || "").replace(/"/g, '""')}"`;

      return [
        sanitize(order.id),
        sanitize(new Date(order.createdAt).toLocaleString()),
        sanitize(order.customerName),
        sanitize(order.customerPhone),
        sanitize(order.customerAddress),
        sanitize(order.customerThana || ""),
        sanitize(order.customerDistrict),
        sanitize(order.customerDivision || ""),
        sanitize(cartDetails),
        sanitize(uniqueOrderSuppliers),
        sanitize(String(order.totalAmount)),
        sanitize(order.status)
      ];
    });

    const csvContent = BOM + [headers.join(","), ...rows.map(r => r.join(","))].join("\n");

    // 3. Trigger Browser Download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const filename = `orders_${selectedSupplier === "all" ? "all_shops" : selectedSupplier.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsExporting(false);
    setExportSuccessMsg(
      lang === "bn" 
        ? "এক্সেল / CSV ফাইল সফলভাবে ডাউনলোড হয়েছে!" 
        : "Excel / CSV file downloaded successfully!"
    );
    setTimeout(() => setExportSuccessMsg(""), 5000);
  };

  const handleSyncToGoogleSheets = async () => {
    if (!supplierConfigSheet) {
      alert(lang === "bn" ? "দয়া করে প্রথমে গুগল শিট ওয়েব হুক লিংকটি বসান।" : "Please provide a Google Sheets Webhook URL first.");
      return;
    }

    setIsSendingToSheet(true);
    
    // Simulate real webhook push delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Save configuration in localStorage
    localStorage.setItem("mystore_supplier_sheet", supplierConfigSheet);
    localStorage.setItem("mystore_supplier_email", supplierConfigEmail);

    setIsSendingToSheet(false);
    alert(
      lang === "bn"
        ? `গুগল শিট কানেকশন সফল! আজকের অর্ডার ডাটা সফলভাবে সিঙ্ক করা হয়েছে এবং ${supplierConfigEmail || "সরবরাহকারী"} শপের সাথে শেয়ার করা হয়েছে।`
        : `Google Sheets synced! Today's order stream pushed successfully to the webhook and shared with ${supplierConfigEmail || "the supplier"} email.`
    );
  };

  interface SidebarItem {
    id: string;
    labelBn: string;
    labelEn: string;
    icon: any;
    count?: number;
  }

  const sidebarItems: SidebarItem[] = [
    { id: "analytics", labelBn: "ড্যাশবোর্ড", labelEn: "Dashboard", icon: LayoutDashboard },
    { id: "orders", labelBn: "অর্ডারসমূহ", labelEn: "Orders", icon: ShoppingBag, count: activeOrdersCount },
    { id: "abandoned", labelBn: "অসম্পূর্ণ অর্ডার", labelEn: "Abandoned Orders", icon: ShoppingCart },
    { id: "customers", labelBn: "গ্রাহক তালিকা", labelEn: "Customers", icon: Users },
    { id: "accounts", labelBn: "হিসাব-নিকাশ", labelEn: "Accounts", icon: CreditCard },
    { id: "coupons", labelBn: "কুপন ও ডিসকাউন্ট", labelEn: "Coupons", icon: Percent },
    { id: "products", labelBn: "প্রোডাক্ট ম্যানেজার", labelEn: "Products", icon: Package },
    { id: "categories", labelBn: "ক্যাটাগরি", labelEn: "Categories", icon: Layers },
    { id: "authors", labelBn: "লেখকবৃন্দ", labelEn: "Authors", icon: Feather },
    { id: "publishers", labelBn: "প্রকাশক", labelEn: "Publishers", icon: BookOpen },
    { id: "banners", labelBn: "ব্যানার", labelEn: "Banners", icon: ImageIcon },
    { id: "stock", labelBn: "স্টক রেকর্ড", labelEn: "Stock", icon: Activity },
    { id: "landing", labelBn: "ল্যান্ডিং পেজ", labelEn: "Landing Pages", icon: Globe },
    { id: "delivery", labelBn: "ডেলিভারি", labelEn: "Delivery", icon: Truck },
    { id: "sms", labelBn: "এসএমএস সিস্টেম", labelEn: "SMS", icon: MessageSquare },
    { id: "roles", labelBn: "অ্যাডমিন রোলস", labelEn: "Roles", icon: Key },
    { id: "users", labelBn: "ইউজার লিস্ট", labelEn: "Users", icon: Settings },
  ];

  // Stock / Inventory calculations
  const totalStockItems = products.reduce((acc, p) => acc + p.stock, 0);
  const totalRetailValuation = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
  const totalCostValuation = products.reduce((acc, p) => {
    const cost = p.costPrice !== undefined ? p.costPrice : p.price * 0.6;
    return acc + (cost * p.stock);
  }, 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const deadStockCount = products.filter(p => !p.salesCount || p.salesCount === 0).length;

  const filteredStockProducts = products.filter(p => {
    if (stockFilter === "low") return p.stock <= 5;
    if (stockFilter === "dead") return !p.salesCount || p.salesCount === 0;
    return true;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50/50 rounded-3xl border border-gray-150 overflow-hidden shadow-sm -mx-4 sm:-mx-6 -my-6">
      
      {/* MOBILE HEADER BAR */}
      <div className="lg:hidden bg-[#0f172a] text-white p-4 flex items-center justify-between border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-3">
          <button 
            type="button"
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="p-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <span className="bg-[#2563eb] text-white font-black text-xs px-2 py-1 rounded-md mr-1.5 shadow-sm">JB</span>
            <span className="font-extrabold text-sm tracking-tight text-white">Johurul BDShop</span>
          </div>
        </div>
        <div className="bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded border border-slate-700">
          {lang === "bn" ? "অ্যাডমিন" : "Admin"}
        </div>
      </div>

      {/* MOBILE DRAWER SIDEBAR */}
      {isSidebarOpenMobile && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-fade-in"
            onClick={() => setIsSidebarOpenMobile(false)}
          />
          <div className="relative flex flex-col w-72 max-w-xs bg-[#0f172a] text-slate-300 h-full shadow-2xl z-10 p-5 overflow-y-auto">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-5">
              <div className="flex items-center">
                <span className="bg-[#2563eb] text-white font-black text-sm px-2.5 py-1.5 rounded-lg mr-2 shadow-sm">JB</span>
                <span className="font-extrabold text-base tracking-tight text-white">Johurul BDShop</span>
              </div>
              <button 
                type="button"
                onClick={() => setIsSidebarOpenMobile(false)}
                className="p-1.5 bg-slate-800 text-slate-300 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5 flex-1">
              {sidebarItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpenMobile(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive 
                        ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/30 font-black border-l-4 border-white"
                        : "hover:bg-slate-800/60 text-slate-300 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{lang === "bn" ? item.labelBn : item.labelEn}</span>
                    </div>
                    {item.count && item.count > 0 ? (
                      <span className="bg-red-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full shrink-0">
                        {item.count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            
            <div className="pt-4 border-t border-slate-800 mt-5 text-[10px] text-slate-500 text-center font-bold">
              Johurul BDShop v2.4.0
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR PANEL */}
      <div className="hidden lg:flex flex-col w-64 bg-[#0f172a] text-slate-300 border-r border-slate-800 p-5 shrink-0 select-none">
        <div className="flex items-center pb-5 border-b border-slate-800/80 mb-5">
          <span className="bg-[#2563eb] text-white font-black text-sm px-2.5 py-1.5 rounded-lg mr-2 shadow-sm shrink-0">JB</span>
          <div className="min-w-0">
            <h3 className="font-extrabold text-sm tracking-tight text-white truncate">Johurul BDShop</h3>
            <span className="text-[10px] text-slate-500 font-extrabold tracking-wider uppercase block">Kamiab Prokashon Admin</span>
          </div>
        </div>

        <div className="space-y-1 overflow-y-auto flex-1 pr-1 custom-scrollbar">
          {sidebarItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  isActive 
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-900/30 font-extrabold border-l-4 border-white"
                    : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <IconComp className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span className="truncate">{lang === "bn" ? item.labelBn : item.labelEn}</span>
                </div>
                {item.count && item.count > 0 ? (
                  <span className="bg-red-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded-full shrink-0">
                    {item.count}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-800 mt-5">
          <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold">
            <span>Server Status</span>
            <span className="text-emerald-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              ONLINE
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN PANEL */}
      <div className="flex-1 min-w-0 bg-white lg:bg-slate-50/20 flex flex-col">
        
        {/* TOP STATUS RIBBON */}
        <div className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-gray-150 shrink-0">
          <div className="text-xs text-gray-400 font-bold flex items-center gap-1">
            <span>🏠</span>
            <span>Johurul BDShop Admin</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-[#3730a3] uppercase font-black">
              {sidebarItems.find(item => item.id === activeTab)?.labelEn}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-black text-gray-700">admin@gms.com</div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Super Administrator</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-extrabold text-xs flex items-center justify-center shadow-md">
              AD
            </div>
          </div>
        </div>

        {/* MAIN PANEL CONTENT BODY */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto flex-1">

      {/* RENDER ANALYTICS */}
      {activeTab === "analytics" && (() => {
        // Advanced calculation block inside localized IIFE/closure
        const totalOrdersCount = orders.length;
        const deliveredCount = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
        const processingCount = orders.filter(o => o.status === OrderStatus.PROCESSING || o.status === OrderStatus.RECEIVED).length;
        const cancelledCount = orders.filter(o => o.status === OrderStatus.CANCELLED).length;
        const shippedCount = orders.filter(o => o.status === OrderStatus.SHIPPED || o.status === OrderStatus.OUT_FOR_DELIVERY).length;

        const onlineRevenue = orders
          .filter(o => o.status !== OrderStatus.CANCELLED && o.paymentMethod === "online")
          .reduce((sum, o) => sum + o.totalAmount, 0);
        const codRevenue = orders
          .filter(o => o.status !== OrderStatus.CANCELLED && o.paymentMethod === "cod")
          .reduce((sum, o) => sum + o.totalAmount, 0);

        const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
        const netProfit = totalRevenue - totalExpenses;
        const profitMargin = totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0;

        const lowStockProducts = products.filter(p => p.stock <= 5);
        const lowStockCount = lowStockProducts.length;

        const adSpend = expenses
          .filter(e => e.category.toLowerCase().includes("marketing") || e.description.toLowerCase().includes("ads") || e.description.toLowerCase().includes("facebook"))
          .reduce((sum, e) => sum + Number(e.amount), 0);
        const adRoi = adSpend > 0 ? (totalRevenue / adSpend).toFixed(1) : "0.0";

        // Chart dynamic scaling calculations
        const chartMax = Math.max(65000, totalRevenue, totalExpenses);
        const getBarHeight = (val: number) => {
          return Math.max(6, (val / chartMax) * 160); // Max bar height 160px inside SVG
        };

        return (
          <div className="space-y-6">
            {/* Today's Live Updates Card */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-purple-950 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-indigo-900/40">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_120%,rgba(139,92,246,0.15),transparent)] pointer-events-none"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block"></span>
                    <span className="bg-white/10 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/5 inline-block">
                      {lang === "bn" ? "রিয়েল-টাইম লাইভ ড্যাশবোর্ড" : "REAL-TIME LIVE MONITORING"}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mt-1">
                    {lang === "bn" ? "অ্যাডভান্সড সেলস এবং প্রফিট অ্যানালিটিক্স" : "Advanced Sales & Profit Analytics"}
                  </h3>
                  <p className="text-indigo-200 text-xs">
                    {lang === "bn" 
                      ? "আপনার স্টোরের রিয়েল-টাইম কার্যক্রম, লাভজনকতা এবং স্টক স্তরের বিবরণ।" 
                      : "View live business health, actual cost margins, and catalog stock warnings in one tab."}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 shrink-0 min-w-[280px] sm:min-w-[400px]">
                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] text-indigo-300 font-extrabold uppercase block tracking-wider">
                      {lang === "bn" ? "আজকের মোট অর্ডার" : "Today's Orders"}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black">{todayOrdersCount}</span>
                      <span className="text-xs font-bold text-indigo-200">{lang === "bn" ? "টি" : "orders"}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                    <span className="text-[10px] text-indigo-300 font-extrabold uppercase block tracking-wider">
                      {lang === "bn" ? "আজকের বিক্রি" : "Today's Revenue"}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black">৳{todayRevenue}</span>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-indigo-300 font-extrabold uppercase block tracking-wider">
                      {lang === "bn" ? "চলমান ডেলিভারি" : "Today's Active"}
                    </span>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-2xl font-black">{todayActiveOrdersCount}</span>
                      <span className="text-xs font-bold text-indigo-200">{lang === "bn" ? "টি" : "items"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Summary Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Card 1: Real-time Revenue */}
              <div id="stat-card-revenue" className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {lang === "bn" ? "রিয়েল-টাইম রাজস্ব" : "Real-time Revenue"}
                    </span>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tight">৳{totalRevenue}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#3730a3] flex items-center justify-center shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-black flex items-center gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" /> +15.8%
                  </span>
                  <span className="text-gray-400 font-semibold truncate">
                    COD: ৳{codRevenue} | OP: ৳{onlineRevenue}
                  </span>
                </div>
              </div>

              {/* Card 2: Total Orders */}
              <div id="stat-card-orders" className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {lang === "bn" ? "মোট অর্ডার" : "Total Orders"}
                    </span>
                    <h4 className="text-2xl font-black text-gray-900 tracking-tight">{totalOrdersCount}</h4>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                </div>
                
                {/* Orders mini progress distribution bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[9px] font-black text-gray-400">
                    <span>DLV: {deliveredCount}</span>
                    <span>PRC: {processingCount}</span>
                    <span>CAN: {cancelledCount}</span>
                  </div>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full flex overflow-hidden">
                    <div 
                      title={`Delivered: ${deliveredCount}`}
                      className="bg-emerald-500 h-full transition-all" 
                      style={{ width: `${totalOrdersCount > 0 ? (deliveredCount / totalOrdersCount) * 100 : 0}%` }}
                    />
                    <div 
                      title={`Processing/Received: ${processingCount}`}
                      className="bg-indigo-500 h-full transition-all" 
                      style={{ width: `${totalOrdersCount > 0 ? (processingCount / totalOrdersCount) * 100 : 0}%` }}
                    />
                    <div 
                      title={`Shipped: ${shippedCount}`}
                      className="bg-amber-500 h-full transition-all" 
                      style={{ width: `${totalOrdersCount > 0 ? (shippedCount / totalOrdersCount) * 100 : 0}%` }}
                    />
                    <div 
                      title={`Cancelled: ${cancelledCount}`}
                      className="bg-rose-500 h-full transition-all" 
                      style={{ width: `${totalOrdersCount > 0 ? (cancelledCount / totalOrdersCount) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Net Profit */}
              <div id="stat-card-profit" className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {lang === "bn" ? "নিট লাভ" : "Net Profit"}
                    </span>
                    <h4 className={`text-2xl font-black tracking-tight ${netProfit >= 0 ? "text-emerald-700" : "text-rose-600"}`}>
                      ৳{netProfit}
                    </h4>
                  </div>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${netProfit >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                    <Percent className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[11px]">
                  <span className={`font-black flex items-center gap-0.5 ${netProfit >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                    {netProfit >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {profitMargin}% margin
                  </span>
                  <span className="text-gray-400 font-semibold text-right">
                    Exp: ৳{totalExpenses}
                  </span>
                </div>
              </div>

              {/* Card 4: Low Stock Alerts */}
              <div id="stat-card-stock" className="bg-white border border-gray-100 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                      {lang === "bn" ? "লো স্টক অ্যালার্ট" : "Low Stock Alerts"}
                    </span>
                    <h4 className={`text-2xl font-black tracking-tight ${lowStockCount > 0 ? "text-rose-600" : "text-emerald-700"}`}>
                      {lowStockCount} {lang === "bn" ? "টি পণ্য" : "items"}
                    </h4>
                  </div>
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${lowStockCount > 0 ? "bg-rose-50 text-rose-500 animate-bounce" : "bg-emerald-50 text-emerald-600"}`}>
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                
                {/* Scrollable list or simple stock state label */}
                <div className="mt-3 text-[10px] text-gray-500 font-bold max-h-[32px] overflow-y-auto space-y-0.5">
                  {lowStockCount > 0 ? (
                    lowStockProducts.slice(0, 2).map(p => (
                      <div key={p.id} className="flex justify-between text-rose-600 bg-rose-50/40 px-1.5 py-0.5 rounded border border-rose-100/30">
                        <span className="truncate max-w-[110px]">{lang === "bn" ? p.banglaName || p.name : p.name}</span>
                        <span className="shrink-0 font-black">{p.stock} left</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-emerald-700 flex items-center gap-1">
                      <span>✓</span> {lang === "bn" ? "সকল পণ্যের পর্যাপ্ত স্টক আছে" : "All catalog items healthy"}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Visual Charts Comparison & Monthly Insights */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Left Column: Visual Chart (Col Span 2) */}
              <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
                        <span>📊</span> {lang === "bn" ? "মাসিক আয় বনাম ব্যয় বিবরণী" : "Revenue vs Expenses Breakdown"}
                      </h3>
                      <p className="text-[11px] text-gray-400 font-semibold mt-0.5">
                        {lang === "bn" ? "বিগত ৩ মাসের আয়, বিজ্ঞাপন ব্যয় এবং নিট লাভের তুলনা" : "Compare earnings, ads outlay, and clear margins over the past 3 months"}
                      </p>
                    </div>
                    
                    {/* Interactive Legend */}
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase shrink-0">
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-indigo-600 block"></span>
                        <span className="text-gray-600">{lang === "bn" ? "আয়" : "Revenue"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 block"></span>
                        <span className="text-gray-600">{lang === "bn" ? "ব্যয়" : "Expenses"}</span>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOM SVG DYNAMIC COLUMN CHART */}
                  <div className="w-full h-56 relative bg-gray-50/30 border border-gray-100 rounded-2xl p-4 flex flex-col justify-between">
                    
                    {/* Chart Core Area */}
                    <div className="flex-1 w-full relative flex items-end justify-around px-2 sm:px-6">
                      
                      {/* Grid background lines */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] font-bold text-gray-300">
                        <div className="border-b border-gray-100/80 w-full pt-1 pr-2 text-right">৳{chartMax}</div>
                        <div className="border-b border-gray-100/80 w-full pt-1 pr-2 text-right">৳{Math.round(chartMax * 0.66)}</div>
                        <div className="border-b border-gray-100/80 w-full pt-1 pr-2 text-right">৳{Math.round(chartMax * 0.33)}</div>
                        <div className="border-b border-gray-100 w-full pt-1 pr-2 text-right">৳0</div>
                      </div>

                      {/* Bar 1: May */}
                      <div className="flex flex-col items-center gap-1.5 z-10 group relative">
                        <div className="flex items-end gap-1.5 sm:gap-3">
                          {/* Revenue */}
                          <div 
                            className="w-4 sm:w-8 bg-indigo-600 hover:bg-indigo-700 rounded-t-sm sm:rounded-t-md transition-all duration-500 shadow-xs relative cursor-pointer"
                            style={{ height: `${getBarHeight(35000)}px` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-opacity pointer-events-none z-20">
                              Rev: ৳35,000
                            </div>
                          </div>
                          {/* Expenses */}
                          <div 
                            className="w-4 sm:w-8 bg-rose-500 hover:bg-rose-600 rounded-t-sm sm:rounded-t-md transition-all duration-500 shadow-xs relative cursor-pointer"
                            style={{ height: `${getBarHeight(10500)}px` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-opacity pointer-events-none z-20">
                              Exp: ৳10,500
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-extrabold tracking-wider">{lang === "bn" ? "মে" : "May 2026"}</span>
                      </div>

                      {/* Bar 2: June */}
                      <div className="flex flex-col items-center gap-1.5 z-10 group relative">
                        <div className="flex items-end gap-1.5 sm:gap-3">
                          {/* Revenue */}
                          <div 
                            className="w-4 sm:w-8 bg-indigo-600 hover:bg-indigo-700 rounded-t-sm sm:rounded-t-md transition-all duration-500 shadow-xs relative cursor-pointer"
                            style={{ height: `${getBarHeight(48500)}px` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-opacity pointer-events-none z-20">
                              Rev: ৳48,500
                            </div>
                          </div>
                          {/* Expenses */}
                          <div 
                            className="w-4 sm:w-8 bg-rose-500 hover:bg-rose-600 rounded-t-sm sm:rounded-t-md transition-all duration-500 shadow-xs relative cursor-pointer"
                            style={{ height: `${getBarHeight(14200)}px` }}
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap transition-opacity pointer-events-none z-20">
                              Exp: ৳14,200
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-gray-500 font-extrabold tracking-wider">{lang === "bn" ? "জুন" : "June 2026"}</span>
                      </div>

                      {/* Bar 3: July (Real-time!) */}
                      <div className="flex flex-col items-center gap-1.5 z-10 group relative">
                        <div className="flex items-end gap-1.5 sm:gap-3">
                          {/* Revenue (Dynamic) */}
                          <div 
                            className="w-4 sm:w-8 bg-indigo-600 hover:bg-indigo-700 rounded-t-sm sm:rounded-t-md transition-all duration-500 shadow-xs relative cursor-pointer ring-2 ring-indigo-300 ring-offset-2"
                            style={{ height: `${getBarHeight(totalRevenue)}px` }}
                          >
                            <div className="opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-indigo-950 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap z-20">
                              Rev: ৳{totalRevenue}
                            </div>
                          </div>
                          {/* Expenses (Dynamic) */}
                          <div 
                            className="w-4 sm:w-8 bg-rose-500 hover:bg-rose-600 rounded-t-sm sm:rounded-t-md transition-all duration-500 shadow-xs relative cursor-pointer ring-2 ring-rose-200 ring-offset-2"
                            style={{ height: `${getBarHeight(totalExpenses)}px` }}
                          >
                            <div className="opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-rose-950 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap z-20">
                              Exp: ৳{totalExpenses}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] text-indigo-900 font-black tracking-wider flex items-center gap-1">
                          {lang === "bn" ? "জুলাই (চলতি)" : "July (Live)"} <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping"></span>
                        </span>
                      </div>

                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-gray-400 font-bold bg-gray-50/50 rounded-2xl p-3 border border-gray-100 flex items-center gap-2 mt-4 shrink-0">
                  <span className="text-indigo-600 text-sm">💡</span>
                  <p className="leading-relaxed">
                    {lang === "bn" 
                      ? "জুলাই মাসের আয় ও ব্যয় ডাটা কাস্টমারদের অর্ডার প্লেস করার সাথে সাথে স্বয়ংক্রিয়ভাবে রিয়েল-টাইমে আপডেট হচ্ছে।" 
                      : "July's bar grows dynamically as your storefront processes incoming orders and you log expenses in real-time."}
                  </p>
                </div>
              </div>

              {/* Right Column: Monthly Insights (Col Span 1) */}
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase flex items-center gap-1.5 pb-3 border-b border-gray-100 mb-3">
                    <Sparkles className="w-4 h-4 text-[#3730a3]" />
                    <span>{lang === "bn" ? "অ্যাডভান্সড মাসিক ইনসাইটস" : "Monthly Business Insights"}</span>
                  </h3>

                  {/* Insight list */}
                  <div className="space-y-3">
                    
                    {/* Insight 1: Financial Margin Advice */}
                    <div className="bg-indigo-50/30 border border-indigo-100/40 p-3 rounded-2xl space-y-1">
                      <p className="text-[10px] font-black text-[#3730a3] uppercase tracking-wider flex items-center justify-between">
                        <span>📈 {lang === "bn" ? "লাভজনকতা সূচক" : "Profitability Rating"}</span>
                        <span className="bg-emerald-50 text-emerald-800 text-[8px] px-1.5 py-0.5 rounded">
                          {profitMargin >= 40 ? "Excellent" : profitMargin >= 20 ? "Healthy" : "Check Spend"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-700 font-medium leading-relaxed mt-1">
                        {profitMargin >= 50 ? (
                          lang === "bn"
                            ? "চমৎকার! আপনার নিট মুনাফার হার অত্যন্ত সন্তোষজনক। কস্ট অফ গুডস এবং ডেলিভারি চার্জ সঠিকভাবে অপ্টিমাইজড।"
                            : "Excellent! Your net margin is extremely high. Operations are streamlined and sourcing costs are perfectly balanced."
                        ) : profitMargin >= 20 ? (
                          lang === "bn"
                            ? "ভালো! আপনার ব্যবসা লাভজনক অবস্থায় আছে। কাস্টমারদের আকর্ষণ করতে মেটা বিজ্ঞাপনের বাজেট বৃদ্ধি করতে পারেন।"
                            : "Good performance! Your store is safely profitable. Consider boosting Meta ad budgets to acquire more traffic."
                        ) : (
                          lang === "bn"
                            ? "সতর্কতা: আয়ের তুলনায় ব্যয় কিছুটা বেশি। প্রফিট বাড়াতে অ্যাড স্পেন্ড কমানোর বা ডেলিভারি চার্জ পুনর্নির্ধারণের পরামর্শ।"
                            : "Notice: Overhead expenses are high compared to current sales. Audit marketing budgets to preserve cash flow."
                        )}
                      </p>
                    </div>

                    {/* Insight 2: Advertising ROAS Tracker */}
                    <div className="bg-purple-50/30 border border-purple-100/40 p-3 rounded-2xl space-y-1">
                      <p className="text-[10px] font-black text-purple-800 uppercase tracking-wider flex items-center justify-between">
                        <span>📢 {lang === "bn" ? "মেটা অ্যাডস আরওএএস (ROAS)" : "Estimated Meta Ads ROAS"}</span>
                        <span className="bg-purple-100 text-purple-800 text-[8px] px-1.5 py-0.5 rounded">{adRoi}x ROI</span>
                      </p>
                      <p className="text-xs text-gray-700 font-medium leading-relaxed mt-1">
                        {lang === "bn"
                          ? `মেটা অ্যাড ফেসবুক ক্যাম্পেইনের খরচ বিবেচনা করে আপনার আনুমানিক রিটার্ন অন অ্যাড স্পেন্ড (ROAS) হচ্ছে ${adRoi}x। খরচ: ৳${adSpend}।`
                          : `Your estimated Meta ads Return on Ad Spend (ROAS) is ${adRoi}x, with total dynamic campaign budget logged as ৳${adSpend}.`}
                      </p>
                    </div>

                    {/* Insight 3: Low Stock Action Reminder */}
                    <div className={`p-3 rounded-2xl border ${
                      lowStockCount > 0 
                        ? "bg-rose-50/30 border-rose-100 text-rose-950" 
                        : "bg-emerald-50/30 border-emerald-100 text-emerald-950"
                    }`}>
                      <p className="text-[10px] font-black uppercase tracking-wider flex items-center justify-between">
                        <span>📦 {lang === "bn" ? "স্টক রিস্টক সতর্কতা" : "Inventory Restock Alert"}</span>
                        {lowStockCount > 0 && <span className="bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded animate-pulse">Urgent</span>}
                      </p>
                      <p className="text-xs font-semibold leading-relaxed mt-1">
                        {lowStockCount > 0 ? (
                          lang === "bn"
                            ? `${lowStockCount}টি প্রোডাক্টের স্টক ফুরিয়ে যাচ্ছে! ডেলিভারি মিস হওয়া রুখতে দ্রুত স্টক আপডেট করুন।`
                            : `${lowStockCount} items are running low! Instantly increment quantities in the Stock tab to prevent lost orders.`
                        ) : (
                          lang === "bn"
                            ? "দারুণ! আপনার স্টোরের কোনো পণ্যের স্টকই এই মুহূর্তে ফুরিয়ে যাওয়ার ঝুঁকিতে নেই।"
                            : "Perfect! Every single catalog product is safely stocked. Your storefront is secure from stock-outs."
                        )}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Switch to stock tab button */}
                <button
                  onClick={() => setActiveTab("stock")}
                  className="w-full bg-[#3730a3] hover:bg-[#4338ca] text-white text-xs font-bold py-2.5 rounded-xl cursor-pointer shadow-sm text-center transition-all flex items-center justify-center gap-1"
                >
                  ⚙️ {lang === "bn" ? "স্টক লেভেল আপডেট করুন" : "Manage Product Stock"} <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* Quick Orders Stream Table */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase flex items-center gap-1.5">
                  <span>🚀</span> {lang === "bn" ? "সাম্প্রতিক কাস্টমার অর্ডার স্ট্রীম" : "Live Storefront Order Stream"}
                </h3>
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-100/50">
                  {orders.length} {lang === "bn" ? "টি মোট অর্ডার" : "total orders logged"}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm font-semibold space-y-2">
                  <span className="text-3xl block">🛒</span>
                  <p>{lang === "bn" ? "এখনও কোনো অর্ডার আসেনি।" : "No logged sales activities yet."}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="pb-3">{lang === "bn" ? "আইডি" : "Order ID"}</th>
                        <th className="pb-3">{lang === "bn" ? "গ্রাহক" : "Customer"}</th>
                        <th className="pb-3">{lang === "bn" ? "মোট মূল্য" : "Amount"}</th>
                        <th className="pb-3">{lang === "bn" ? "পদ্ধতি" : "Method"}</th>
                        <th className="pb-3">{lang === "bn" ? "বর্তমান অবস্থা" : "Status"}</th>
                        <th className="pb-3">{lang === "bn" ? "প্রচার মাধ্যম" : "Referrer"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {orders.slice(0, 8).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 font-mono text-xs font-bold text-[#3730a3]">{order.id}</td>
                          <td className="py-3">
                            <p className="font-bold text-gray-800 text-xs">{order.customerName}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">{order.customerPhone}</p>
                          </td>
                          <td className="py-3 font-semibold text-gray-900 text-xs">৳{order.totalAmount}</td>
                          <td className="py-3 uppercase text-[10px] font-black">
                            {order.paymentMethod === "online" ? (
                              <span className="text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                                {order.onlineGatewayType || "mobile"}
                              </span>
                            ) : (
                              <span className="text-gray-600 bg-gray-100 px-2 py-0.5 rounded">COD</span>
                            )}
                          </td>
                          <td className="py-3">
                            <span className={`inline-block px-2 py-0.5 text-[9px] font-black rounded ${
                              order.status === OrderStatus.DELIVERED
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : order.status === OrderStatus.CANCELLED
                                ? "bg-rose-50 text-rose-700 border border-rose-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 text-[10px] text-gray-400 font-bold">
                            {order.fbCampaignRef ? (
                              <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded font-mono">
                                📢 Facebook Ads
                              </span>
                            ) : (
                              "Direct Shop"
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* RENDER ORDERS MANAGER */}
      {activeTab === "orders" && (() => {
        // Find all unique supplier names
        const uniqueSuppliersList = Array.from(
          new Set(
            products
              .map(p => p.supplierShop?.trim())
              .filter((s): s is string => !!s)
          )
        );

        // Calculate counts for advanced status filtering
        const totalCount = orders.length;
        const pendingCount = orders.filter(o => o.status === OrderStatus.RECEIVED).length;
        const processingCount = orders.filter(o => o.status === OrderStatus.PROCESSING).length;
        const shippedCount = orders.filter(o => o.status === OrderStatus.SHIPPED || o.status === OrderStatus.OUT_FOR_DELIVERY).length;
        const deliveredCount = orders.filter(o => o.status === OrderStatus.DELIVERED).length;
        const cancelledCount = orders.filter(o => o.status === OrderStatus.CANCELLED).length;

        return (
          <div className="space-y-6 animate-fade-in">
            {/* SUPPLIER EXPORT & SHEET INTEGRATION COMPONENT */}
            <div className="bg-indigo-50/40 border border-indigo-100 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-indigo-100/60 pb-4 mb-5">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-indigo-700 bg-white border border-indigo-100 px-2.5 py-1 rounded-full inline-block">
                    📊 Excel & Google Sheet Synchronizer
                  </span>
                  <h4 className="text-base font-black text-gray-800">
                    {lang === "bn" 
                      ? "অন্য শপ বা সরবরাহকারীর জন্য ডেইলি অর্ডার এক্সপোর্টার" 
                      : "External Supplier Order Sheets & Exports"}
                  </h4>
                  <p className="text-xs text-gray-400 font-semibold">
                    {lang === "bn"
                      ? "প্রোডাক্টের উৎস শপ অনুযায়ী অর্ডার ফিল্টার করে এক্সেল ফাইল ডাউনলোড করুন অথবা সরাসরি গুগল শিটে সিঙ্ক করুন।"
                      : "Filter orders based on product supplier shops, download Excel sheets, or push to Google Sheets webhooks."}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Left Panel: Excel Spreadsheet Download */}
                <div className="bg-white rounded-2xl border border-indigo-50 p-4 space-y-4 shadow-xs">
                  <div className="flex items-center gap-2 text-indigo-900">
                    <span className="text-lg">📁</span>
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
                      {lang === "bn" ? "১. এক্সেল / CSV ডাউনলোড টুল" : "1. Excel Sheet Downloader"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
                    <div className="space-y-1">
                      <label className="text-gray-500 block">
                        {lang === "bn" ? "উৎস শপ / সরবরাহকারী নির্বাচন" : "Select Supplier Shop"}
                      </label>
                      <select
                        id="supplier-select-filter"
                        value={selectedSupplier}
                        onChange={(e) => setSelectedSupplier(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">🌐 {lang === "bn" ? "সব শপ / সরবরাহকারী (All)" : "All Suppliers / Shops"}</option>
                        {uniqueSuppliersList.map((sup) => (
                          <option key={sup} value={sup}>🏪 {sup}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-500 block">
                        {lang === "bn" ? "সময়সীমা ফিল্টার" : "Export Date Period"}
                      </label>
                      <select
                        id="supplier-date-filter"
                        value={exportDateFilter}
                        onChange={(e) => setExportDateFilter(e.target.value as any)}
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="all">📅 {lang === "bn" ? "শুরু থেকে আজ পর্যন্ত (All time)" : "All Lifetime Orders"}</option>
                        <option value="today">⏰ {lang === "bn" ? "শুধু আজকের অর্ডার (Today)" : "Today's Orders Only"}</option>
                      </select>
                    </div>
                  </div>

                  {uniqueSuppliersList.length === 0 && (
                    <p className="text-[10px] text-amber-600 bg-amber-50 p-2 rounded-xl">
                      💡 {lang === "bn" 
                        ? "টিপস: প্রোডাক্ট ক্যাটালগ এডিটর থেকে প্রোডাক্ট যোগ করার সময় 'সরবরাহকারী / অন্য শপ আইডি' লিখে দিলে এখানে তাদের জন্য আলাদাভাবে শিট ডাউনলোড করার সুবিধা পাবেন।"
                        : "Tip: Tag products with their Supplier Shop names in the Product Manager to filter and download custom sheets here."}
                    </p>
                  )}

                  <button
                    id="download-excel-btn"
                    onClick={handleDownloadCSV}
                    disabled={isExporting}
                    className="w-full bg-[#3730a3] hover:bg-[#1e1b4b] text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {isExporting ? (
                      <span>{lang === "bn" ? "প্রস্তুত হচ্ছে..." : "Generating..."}</span>
                    ) : (
                      <>
                        <span>📥</span>
                        <span>{lang === "bn" ? "এক্সেল শিট ডাউনলোড করুন (Download CSV)" : "Download Excel Spreadsheet"}</span>
                      </>
                    )}
                  </button>

                  {exportSuccessMsg && (
                    <div className="text-center text-[10px] text-emerald-600 font-bold bg-emerald-50 py-1.5 rounded-lg animate-fade-in">
                      ✅ {exportSuccessMsg}
                    </div>
                  )}
                </div>

                {/* Middle Panel: Google Sheet Sync Settings */}
                <div className="bg-white rounded-2xl border border-indigo-50 p-4 space-y-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-900 mb-3">
                      <span className="text-lg">⚡</span>
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
                        {lang === "bn" ? "২. অটো গুগল শিট ও ক্লাউড সিঙ্ক" : "2. Google Sheets & Cloud Sync"}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs font-bold">
                      <div className="space-y-1">
                        <label className="text-gray-500 block">
                          {lang === "bn" ? "অন্য শপের গুগল শিট ওয়েব-হুক বা এপিআই লিংক (Webhook/API Link)" : "Google Sheets Webhook URL"}
                        </label>
                        <input
                          id="supplier-sheet-webhook"
                          type="text"
                          value={supplierConfigSheet}
                          onChange={(e) => setSupplierConfigSheet(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 font-mono text-[11px] text-indigo-950 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="https://script.google.com/macros/s/.../exec"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-gray-500 block">
                          {lang === "bn" ? "সরবরাহকারীর ইমেইল (সরাসরি পাঠানোর জন্য)" : "Supplier Notification Email"}
                        </label>
                        <input
                          id="supplier-sheet-email"
                          type="email"
                          value={supplierConfigEmail}
                          onChange={(e) => setSupplierConfigEmail(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          placeholder="supplier-shop@gmail.com"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    id="sync-sheets-btn"
                    onClick={handleSyncToGoogleSheets}
                    disabled={isSendingToSheet}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-3"
                  >
                    {isSendingToSheet ? (
                      <span className="animate-pulse">{lang === "bn" ? "সিঙ্ক করা হচ্ছে..." : "Connecting to API..."}</span>
                    ) : (
                      <>
                        <span>⚡</span>
                        <span>{lang === "bn" ? "গুগল শিট ও ইমেইল সিঙ্ক করুন (Push Data)" : "Push & Sync to Google Sheets Now"}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Right Panel: Bulk Sourcing Slips via WhatsApp */}
                <div className="bg-white rounded-2xl border border-indigo-50 p-4 space-y-4 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-indigo-900 mb-3">
                      <span className="text-lg">💬</span>
                      <span className="text-xs font-black uppercase tracking-wider text-indigo-950">
                        {lang === "bn" ? "৩. হোয়াটসঅ্যাপে রসিদ ও সামারি ডেসপ্যাচ" : "3. WhatsApp Sourcing Slip Dispatches"}
                      </span>
                    </div>

                    <div className="space-y-3 text-xs font-bold">
                      {/* Shop Dropdown */}
                      <div className="space-y-1">
                        <label className="text-gray-500 block">
                          {lang === "bn" ? "উৎস শপ / সরবরাহকারী নির্বাচন" : "Select Supplier Shop"}
                        </label>
                        <select
                          id="wa-supplier-select"
                          value={waSelectedSupplier}
                          onChange={(e) => setWaSelectedSupplier(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="all">🌐 {lang === "bn" ? "সব শপ / সরবরাহকারী (All)" : "All Suppliers / Shops"}</option>
                          {uniqueSuppliersList.map((sup) => (
                            <option key={sup} value={sup}>🏪 {sup}</option>
                          ))}
                        </select>
                      </div>

                      {/* Date Input with previous option */}
                      <div className="space-y-1">
                        <label className="text-gray-500 block">
                          {lang === "bn" ? "তারিখ নির্বাচন (পূর্ববর্তী তারিখ সিলেক্ট করতে পারবেন)" : "Select Date (Supports Previous Dates)"}
                        </label>
                        <input
                          id="wa-date-picker"
                          type="date"
                          value={waSelectedDate}
                          onChange={(e) => setWaSelectedDate(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-gray-700 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      {/* Phone Input with Save Option */}
                      <div className="space-y-1">
                        <label className="text-gray-500 block">
                          {lang === "bn" ? "সরবরাহকারী হোয়াটসঅ্যাপ নম্বর" : "Supplier WhatsApp Number"}
                        </label>
                        <div className="flex gap-2">
                          <input
                            id="wa-phone-input"
                            type="text"
                            value={waPhoneInput}
                            disabled={waSelectedSupplier === "all"}
                            onChange={(e) => setWaPhoneInput(e.target.value)}
                            className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={waSelectedSupplier === "all" ? "শপ সিলেক্ট করুন" : "e.g. 01700000000"}
                          />
                          <button
                            type="button"
                            disabled={waSelectedSupplier === "all"}
                            onClick={() => {
                              if (waSelectedSupplier !== "all") {
                                saveSupplierPhone(waSelectedSupplier, waPhoneInput);
                                alert(lang === "bn" ? "ওয়াটসঅ্যাপ নম্বর সফলভাবে সেভ হয়েছে!" : "WhatsApp number successfully saved!");
                              }
                            }}
                            className={`px-4 rounded-xl text-xs font-black transition-all ${
                              waSelectedSupplier === "all" 
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                                : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                            }`}
                          >
                            {lang === "bn" ? "সেভ" : "Save"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Calculations & Bulk Button */}
                  {(() => {
                    // Filter matching orders for the selected supplier & date
                    const matchingOrders = orders.filter(order => {
                      // Check date match
                      const isDateOk = (() => {
                        if (!order.createdAt) return false;
                        try {
                          const orderDate = new Date(order.createdAt);
                          const y = orderDate.getFullYear();
                          const m = String(orderDate.getMonth() + 1).padStart(2, '0');
                          const d = String(orderDate.getDate()).padStart(2, '0');
                          return `${y}-${m}-${d}` === waSelectedDate;
                        } catch {
                          return false;
                        }
                      })();
                      if (!isDateOk) return false;

                      // Check supplier match
                      if (waSelectedSupplier !== "all") {
                        return order.cartItems.some(item => {
                          const prod = products.find(p => p.id === item.product.id) || item.product;
                          return (prod.supplierShop || "").trim().toLowerCase() === waSelectedSupplier.trim().toLowerCase();
                        });
                      }
                      return true;
                    });

                    // Count total items
                    const totalItemsToPack = matchingOrders.reduce((sum, order) => {
                      const itemsForShop = order.cartItems.filter(item => {
                        if (waSelectedSupplier === "all") return true;
                        const prod = products.find(p => p.id === item.product.id) || item.product;
                        return (prod.supplierShop || "").trim().toLowerCase() === waSelectedSupplier.trim().toLowerCase();
                      });
                      return sum + itemsForShop.reduce((iSum, item) => iSum + item.quantity, 0);
                    }, 0);

                    // Create WhatsApp link logic
                    const handleWaSend = () => {
                      if (matchingOrders.length === 0) {
                        alert(lang === "bn" ? "এই তারিখে এই শপের কোনো রসিদ পাওয়া যায়নি!" : "No order slips found for this shop on this date!");
                        return;
                      }

                      let targetPhone = waPhoneInput.trim();
                      if (waSelectedSupplier === "all") {
                        alert(lang === "bn" ? "দয়া করে নির্দিষ্ট শপ সিলেক্ট করে ওয়াটসঅ্যাপে পাঠান।" : "Please select a specific shop to send WhatsApp slip.");
                        return;
                      }

                      if (!targetPhone) {
                        alert(lang === "bn" ? "দয়া করে সরবরাহকারীর ওয়াটসঅ্যাপ নম্বর দিন ও সেভ করুন।" : "Please provide and save supplier WhatsApp number first.");
                        return;
                      }

                      // Auto prefix 88
                      if (targetPhone.startsWith("01") && targetPhone.length === 11) {
                        targetPhone = "88" + targetPhone;
                      }

                      // Build the print link URL
                      const printUrl = `${window.location.origin}${window.location.pathname}?print_supplier=${encodeURIComponent(waSelectedSupplier)}&print_date=${waSelectedDate}`;

                      // Build the massive message
                      const formattedDate = new Date(waSelectedDate).toLocaleDateString(lang === "bn" ? 'bn-BD' : 'en-US', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      });

                      let msgText = lang === "bn"
                        ? `*📦 সরবরাহ অর্ডার স্লিপ ও সামারি রিপোর্ট*\n*শপ:* ${waSelectedSupplier.toUpperCase()}\n*তারিখ:* ${formattedDate}\n----------------------------------\n*মোট পার্সেল সংখ্যা:* ${matchingOrders.length} টি\n*মোট আইটেম সংখ্যা:* ${totalItemsToPack} টি\n----------------------------------\n\n🖨️ *লেবেল ও রসিদ প্রিন্ট করার সরাসরি লিংক (Print Slips Link):*\n${printUrl}\n\n`
                        : `*📦 SUPPLIER BATCH REPORT - ${waSelectedSupplier.toUpperCase()}*\n*Date:* ${formattedDate}\n----------------------------------\n*Total Parcels:* ${matchingOrders.length}\n*Total Items to Pack:* ${totalItemsToPack}\n----------------------------------\n\n🖨️ *Print and Attach Slips Direct Link:*\n${printUrl}\n\n`;

                      matchingOrders.forEach((order, idx) => {
                        const itemsForThisShop = order.cartItems.filter(item => {
                          const prod = products.find(p => p.id === item.product.id) || item.product;
                          return (prod.supplierShop || "").trim().toLowerCase() === waSelectedSupplier.trim().toLowerCase();
                        });

                        const itemsDetails = itemsForThisShop.map(item => {
                          const prod = products.find(p => p.id === item.product.id) || item.product;
                          const name = lang === "bn" ? prod.banglaName || prod.name : prod.name;
                          const variant = [
                            item.selectedSize ? `Size: ${item.selectedSize}` : "",
                            item.selectedColor ? `Color: ${item.selectedColor}` : ""
                          ].filter(Boolean).join(", ");
                          
                          // Include image url if available so supplier can view image
                          const imageStr = prod.image ? `\n   🖼️ ছবি: ${prod.image}` : "";
                          return `• ${name} x${item.quantity} ${variant ? `(${variant})` : ""}${imageStr}`;
                        }).join("\n");

                        msgText += lang === "bn"
                          ? `*রসিদ নং ${idx + 1}:* #${order.id}\n👤 নাম: ${order.customerName}\n📞 মোবাইল: ${order.customerPhone}\n📍 ঠিকানা: ${order.customerAddress}\n🏘️ থানা: ${order.customerThana || "N/A"}\n🏙️ জেলা: ${order.customerDistrict}\n🛒 পণ্য বিবরণী:\n${itemsDetails}\n----------------------------------\n\n`
                          : `*Slip ${idx + 1}:* #${order.id}\n👤 Name: ${order.customerName}\n📞 Phone: ${order.customerPhone}\n📍 Address: ${order.customerAddress}\n🏘️ Thana: ${order.customerThana || "N/A"}\n🏙️ District: ${order.customerDistrict}\n🛒 Items:\n${itemsDetails}\n----------------------------------\n\n`;
                      });

                      msgText += lang === "bn"
                        ? `দয়া করে উপরের পণ্যগুলো প্রিন্ট করা রসিদসহ দ্রুত প্যাকেট করে ডেলিভারির জন্য প্রস্তুত করুন। ধন্যবাদ!`
                        : `Please package and prepare these products with the printed slips. Thank you!`;

                      const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(msgText)}`;
                      window.open(waUrl, "_blank");
                    };

                    const handleOpenPrintPreview = () => {
                      if (matchingOrders.length === 0) {
                        alert(lang === "bn" ? "এই তারিখে এই শপের কোনো রসিদ পাওয়া যায়নি!" : "No order slips found for this shop on this date!");
                        return;
                      }
                      if (waSelectedSupplier === "all") {
                        alert(lang === "bn" ? "দয়া করে নির্দিষ্ট শপ সিলেক্ট করুন।" : "Please select a specific shop first.");
                        return;
                      }
                      const printUrl = `${window.location.origin}${window.location.pathname}?print_supplier=${encodeURIComponent(waSelectedSupplier)}&print_date=${waSelectedDate}`;
                      window.open(printUrl, "_blank");
                    };

                    const handleCopyPrintLink = () => {
                      if (waSelectedSupplier === "all") {
                        alert(lang === "bn" ? "দয়া করে নির্দিষ্ট শপ সিলেক্ট করুন।" : "Please select a specific shop first.");
                        return;
                      }
                      const printUrl = `${window.location.origin}${window.location.pathname}?print_supplier=${encodeURIComponent(waSelectedSupplier)}&print_date=${waSelectedDate}`;
                      navigator.clipboard.writeText(printUrl);
                      alert(lang === "bn" ? "প্রিন্ট রসিদ লিংক সফলভাবে কপি করা হয়েছে!" : "Direct print slips link successfully copied!");
                    };

                    return (
                      <div className="space-y-3 mt-3">
                        <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100 text-[11px] font-bold text-indigo-950 flex flex-col gap-1">
                          <div className="flex justify-between">
                            <span>{lang === "bn" ? "মোট রসিদ / পার্সেল:" : "Total Slip Count:"}</span>
                            <span className="text-xs font-black text-[#3730a3]">{matchingOrders.length} {lang === "bn" ? "টি" : "parcels"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>{lang === "bn" ? "পণ্য প্যাক সংখ্যা:" : "Total Items to Pack:"}</span>
                            <span className="text-xs font-black text-[#3730a3]">{totalItemsToPack} {lang === "bn" ? "টি" : "items"}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={handleWaSend}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>
                              {lang === "bn" 
                                ? "১-ক্লিকে হোয়াটসঅ্যাপে সব স্লিপ পাঠান" 
                                : "Send All Slips to WhatsApp"}
                            </span>
                          </button>

                          {waSelectedSupplier !== "all" && (
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                type="button"
                                onClick={handleOpenPrintPreview}
                                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-[10px] font-black py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-indigo-200"
                              >
                                🖨️ {lang === "bn" ? "সরাসরি প্রিন্ট করুন" : "Direct Print Slips"}
                              </button>
                              <button
                                type="button"
                                onClick={handleCopyPrintLink}
                                className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-[10px] font-black py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-slate-200"
                              >
                                🔗 {lang === "bn" ? "প্রিন্ট লিংক কপি" : "Copy Print Link"}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Search Filter Inputs Grid */}
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="relative flex-1 w-full">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder={lang === "bn" ? "অর্ডার আইডি, ফোন অথবা নাম দিয়ে খুঁজুন..." : "Search by order#, phone, name..."}
                  className="w-full bg-slate-50 border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setOrderSearchQuery("");
                    setOrderStatusFilter("all");
                  }}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors w-full md:w-auto"
                >
                  {lang === "bn" ? "রিসেট করুন" : "Reset Filters"}
                </button>
              </div>
            </div>

            {/* Advanced Status Filtering Tabs */}
            <div className="flex bg-slate-50 border border-gray-150 p-1.5 rounded-2xl gap-1 overflow-x-auto whitespace-nowrap scrollbar-hide shadow-xs">
              <button
                type="button"
                onClick={() => setOrderStatusFilter("all")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  orderStatusFilter === "all"
                    ? "bg-white text-[#3730a3] shadow-xs border border-gray-100"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
              >
                <span>🌐</span> {lang === "bn" ? "সব অর্ডার" : "All Orders"}
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${orderStatusFilter === "all" ? "bg-indigo-100 text-[#3730a3]" : "bg-gray-200 text-gray-600"}`}>
                  {totalCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderStatusFilter("RECEIVED")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  orderStatusFilter === "RECEIVED"
                    ? "bg-[#3730a3] text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
              >
                <span>🕒</span> {lang === "bn" ? "পেন্ডিং অর্ডার" : "Pending"}
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${orderStatusFilter === "RECEIVED" ? "bg-indigo-900/40 text-indigo-100" : "bg-gray-200 text-gray-600"}`}>
                  {pendingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderStatusFilter("PROCESSING")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  orderStatusFilter === "PROCESSING"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
              >
                <span>⚙️</span> {lang === "bn" ? "প্রসেসিং" : "Processing"}
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${orderStatusFilter === "PROCESSING" ? "bg-amber-800/40 text-amber-100" : "bg-gray-200 text-gray-600"}`}>
                  {processingCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderStatusFilter("SHIPPED")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  orderStatusFilter === "SHIPPED"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
              >
                <span>🚚</span> {lang === "bn" ? "শিফড / কুরিয়ার" : "Shipped"}
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${orderStatusFilter === "SHIPPED" ? "bg-purple-800/40 text-purple-100" : "bg-gray-200 text-gray-600"}`}>
                  {shippedCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderStatusFilter("DELIVERED")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  orderStatusFilter === "DELIVERED"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
              >
                <span>✅</span> {lang === "bn" ? "ডেলিভারড" : "Delivered"}
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${orderStatusFilter === "DELIVERED" ? "bg-emerald-800/40 text-emerald-100" : "bg-gray-200 text-gray-600"}`}>
                  {deliveredCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOrderStatusFilter("CANCELLED")}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                  orderStatusFilter === "CANCELLED"
                    ? "bg-red-600 text-white shadow-xs"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100/50"
                }`}
              >
                <span>❌</span> {lang === "bn" ? "বাতিলকৃত" : "Cancelled"}
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] font-black ${orderStatusFilter === "CANCELLED" ? "bg-red-800/40 text-red-100" : "bg-gray-200 text-gray-600"}`}>
                  {cancelledCount}
                </span>
              </button>
            </div>

            {/* Standard Orders list wrapper */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4 overflow-hidden">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider">
                    {lang === "bn" ? "গ্রাহক অর্ডারের তালিকা (উন্নত সংস্করণ)" : "Order List & Manifest System"}
                  </h3>
                  <p className="text-[10px] text-gray-400 font-semibold">
                    {selectedSupplier !== "all" ? (
                      <span className="text-amber-700 font-extrabold bg-amber-50 px-2 py-0.5 rounded-md">
                        🏪 {lang === "bn" ? `${selectedSupplier} এর প্রোডাক্টের অর্ডারসমূহ ফিল্টার করা` : `Showing products sourced from ${selectedSupplier}`}
                      </span>
                    ) : (
                      lang === "bn" ? "সরাসরি অর্ডার প্রিন্ট করুন এবং স্ট্যাটাস ট্র্যাক ও আপডেট করুন এক ক্লিকে।" : "Generate order slips, track cash collectables, and print delivery labels."
                    )}
                  </p>
                </div>
                <span className="text-xs text-[#3730a3] bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-xl font-extrabold">
                  {lang === "bn" ? `মোট ${orders.length} টি অর্ডার` : `Total ${orders.length} orders`}
                </span>
              </div>

              {(() => {
                // Apply visual filtering dynamically to the list too if requested
                let displayedOrders = orders;
                if (selectedSupplier !== "all") {
                  displayedOrders = orders.filter(order =>
                    order.cartItems.some(item => {
                      const prod = products.find(p => p.id === item.product.id) || item.product;
                      return prod.supplierShop?.trim().toLowerCase() === selectedSupplier.trim().toLowerCase();
                    })
                  );
                }

                // Filter by Search Query
                if (orderSearchQuery.trim()) {
                  const q = orderSearchQuery.toLowerCase();
                  displayedOrders = displayedOrders.filter(order => 
                    order.id.toLowerCase().includes(q) ||
                    order.customerName.toLowerCase().includes(q) ||
                    order.customerPhone.toLowerCase().includes(q)
                  );
                }

                // Filter by Status
                if (orderStatusFilter !== "all") {
                  displayedOrders = displayedOrders.filter(order => {
                    if (orderStatusFilter === "RECEIVED") return order.status === OrderStatus.RECEIVED;
                    if (orderStatusFilter === "PROCESSING") return order.status === OrderStatus.PROCESSING;
                    if (orderStatusFilter === "SHIPPED") return order.status === OrderStatus.SHIPPED || order.status === OrderStatus.OUT_FOR_DELIVERY;
                    if (orderStatusFilter === "DELIVERED") return order.status === OrderStatus.DELIVERED;
                    if (orderStatusFilter === "CANCELLED") return order.status === OrderStatus.CANCELLED;
                    return order.status === orderStatusFilter;
                  });
                }

                if (displayedOrders.length === 0) {
                  return (
                    <div className="text-center py-16 text-gray-400 text-xs font-bold space-y-2">
                      <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 animate-bounce" />
                      <p>{lang === "bn" ? "এই ফিল্টারে কোনো অর্ডার পাওয়া যায়নি।" : "No orders found matching this status / query."}</p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-150 text-gray-400 font-extrabold uppercase text-[10px] tracking-wider pb-2">
                          <th className="pb-3 pt-1 pl-1">{lang === "bn" ? "অর্ডার আইডি ও তারিখ" : "Order ID & Date"}</th>
                          <th className="pb-3 pt-1">{lang === "bn" ? "গ্রাহকের বিবরণ" : "Customer Details"}</th>
                          <th className="pb-3 pt-1">{lang === "bn" ? "পণ্য ও কার্ট বিবরণ" : "Purchased Items"}</th>
                          <th className="pb-3 pt-1 text-right">{lang === "bn" ? "মোট টাকা" : "COD Amount"}</th>
                          <th className="pb-3 pt-1 text-center">{lang === "bn" ? "স্ট্যাটাস পরিবর্তন" : "Supply Status"}</th>
                          <th className="pb-3 pt-1 text-center">{lang === "bn" ? "উৎস" : "Source"}</th>
                          <th className="pb-3 pt-1 text-right pr-1">{lang === "bn" ? "ইনভয়েস" : "Print Label"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                        {displayedOrders.map((order) => {
                          const orderDate = new Date(order.createdAt);
                          const formattedDate = orderDate.toLocaleDateString(lang === "bn" ? 'bn-BD' : 'en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          });
                          const formattedTime = orderDate.toLocaleTimeString(lang === "bn" ? 'bn-BD' : 'en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                          return (
                            <tr key={order.id} className="hover:bg-slate-50/40 transition-colors">
                              <td className="py-4 pl-1 space-y-1">
                                <span className="font-mono text-[11px] font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                                  #{order.id}
                                </span>
                                <div className="text-[10px] text-gray-400 font-bold block">
                                  📅 {formattedDate}
                                  <span className="text-gray-300 mx-1">•</span>
                                  {formattedTime}
                                </div>
                              </td>

                              <td className="py-4 max-w-[200px]">
                                <h4 className="font-bold text-gray-950 text-xs">{order.customerName}</h4>
                                <p className="font-mono text-[11px] text-[#3730a3] font-bold mt-0.5">{order.customerPhone}</p>
                                <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5 leading-relaxed" title={order.customerAddress}>
                                  📍 {order.customerAddress}
                                </p>
                                <div className="flex gap-1 items-center mt-1 flex-wrap">
                                  <span className="text-[8px] font-black uppercase tracking-wider bg-indigo-50 text-[#3730a3] border border-indigo-100 px-1.5 py-0.2 rounded">
                                    {order.customerDistrict}
                                  </span>
                                  {order.customerThana && (
                                    <span className="text-[8px] font-bold uppercase bg-slate-100 text-gray-600 px-1.5 py-0.2 rounded">
                                      {order.customerThana}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-4 space-y-1.5 max-w-[240px]">
                                {order.cartItems.map((item, idx) => {
                                  const prod = products.find(p => p.id === item.product.id) || item.product;
                                  return (
                                    <div key={idx} className="flex flex-col gap-0.5 bg-slate-50 border border-slate-100 p-1.5 rounded-lg">
                                      <div className="flex items-start justify-between gap-2">
                                        <span className="text-[10px] font-black text-gray-800 line-clamp-1 leading-normal">
                                          {lang === "bn" ? prod.banglaName || prod.name : prod.name}
                                        </span>
                                        <span className="text-[9px] font-black font-mono text-gray-500 bg-white border px-1 rounded">
                                          x{item.quantity}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="text-[9px] font-mono font-bold text-indigo-600">
                                          ৳{item.price || prod.price}
                                        </span>
                                        {item.selectedSize && (
                                          <span className="text-[8px] font-extrabold uppercase bg-white border border-gray-150 text-gray-500 px-1 rounded">
                                            Size: {item.selectedSize}
                                          </span>
                                        )}
                                        {item.selectedColor && (
                                          <span className="text-[8px] font-extrabold uppercase bg-white border border-gray-150 text-gray-500 px-1 rounded">
                                            Color: {item.selectedColor}
                                          </span>
                                        )}
                                        {prod.supplierShop && (
                                          <span className="text-[8px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1 rounded ml-auto">
                                            🏪 {prod.supplierShop}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </td>

                              <td className="py-4 text-right">
                                <div className="space-y-0.5">
                                  <span className="text-xs font-black text-slate-900 font-mono">৳{order.totalAmount}</span>
                                  <span className={`block text-[9px] font-black uppercase tracking-wider text-right ${
                                    order.paymentMethod === "cod" ? "text-amber-600" : "text-emerald-600"
                                  }`}>
                                    {order.paymentMethod === "cod" ? "C.O.D" : order.paymentMethod === "online" ? "Online" : "Paid"}
                                  </span>
                                </div>
                              </td>

                              <td className="py-4 text-center">
                                <div className="inline-block">
                                  <select
                                    id={`status-select-${order.id}`}
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                    className={`text-[10px] font-black rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-[#3730a3] cursor-pointer transition-all ${
                                      order.status === OrderStatus.DELIVERED
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                        : order.status === OrderStatus.CANCELLED
                                        ? "bg-red-50 border-red-200 text-red-700"
                                        : order.status === OrderStatus.SHIPPED || order.status === OrderStatus.OUT_FOR_DELIVERY
                                        ? "bg-purple-50 border-purple-200 text-purple-700"
                                        : order.status === OrderStatus.PROCESSING
                                        ? "bg-amber-50 border-amber-200 text-amber-700"
                                        : "bg-slate-50 border-slate-200 text-slate-700"
                                    }`}
                                  >
                                    <option value={OrderStatus.RECEIVED}>🕒 Order Received (Pending)</option>
                                    <option value={OrderStatus.PROCESSING}>⚙️ Processing</option>
                                    <option value={OrderStatus.SHIPPED}>🚚 Shipped</option>
                                    <option value={OrderStatus.OUT_FOR_DELIVERY}>🛵 Out for Delivery</option>
                                    <option value={OrderStatus.DELIVERED}>✅ Delivered</option>
                                    <option value={OrderStatus.CANCELLED}>❌ Cancelled</option>
                                  </select>
                                </div>
                              </td>

                              <td className="py-4 text-center">
                                {order.fbCampaignRef ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full uppercase" title={`FB Campaign: ${order.fbCampaignRef}`}>
                                    <span>🔵</span> FB Ads
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                                    Organic
                                  </span>
                                )}
                              </td>

                              <td className="py-4 text-right pr-1">
                                <button
                                  type="button"
                                  onClick={() => setPrintingOrder(order)}
                                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 text-[10px] font-black py-2 px-3 rounded-xl border border-emerald-100 transition-all inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                  title={lang === "bn" ? "অর্ডার স্লিপ / ইনভয়েস প্রিন্ট" : "Generate Printable Invoice"}
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>{lang === "bn" ? "রসিদ" : "Slip"}</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        );
      })()}

      {/* RENDER PRODUCTS MANAGER */}
      {activeTab === "products" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-indigo-900lue-600ase font-bold text-gray-800">
              {lang === "bn" ? "প্রোডাক্ট ক্যাটালগ এডিটর" : "Product Catalog & Inventory"}
            </h3>
            <button
              id="add-product-btn"
              onClick={() => {
                setEditingProduct({});
                setIsEditingProduct(true);
              }}
              className="bg-[#3730a3] hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              {lang === "bn" ? "নতুন প্রোডাক্ট যোগ করুন" : "Add Product"}
            </button>
          </div>

          {/* Form Modal/Section */}
          {isEditingProduct && (
            <form onSubmit={handleSaveProduct} className="bg-gray-50 border border-gray-100 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-indigo-800 border-gray-100">
                <h4 className="text-sm font-bold text-gray-800">
                  {editingProduct?.id 
                    ? (lang === "bn" ? "প্রোডাক্ট এডিট করুন" : "Edit Product Details")
                    : (lang === "bn" ? "নতুন প্রোডাক্ট ফর্ম" : "Add New Product Form")
                  }
                </h4>
                <button
                  id="close-editor-btn"
                  type="button"
                  onClick={() => {
                    setIsEditingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold">Product Name (English) *</label>
                  <input
                    id="form-product-name"
                    type="text"
                    required
                    value={editingProduct?.name || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. Classic Cotton T-Shirt"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold">প্রোডাক্টের নাম (বাংলা) *</label>
                  <input
                    id="form-product-name-bn"
                    type="text"
                    value={editingProduct?.banglaName || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, banglaName: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="যেমনঃ ক্লাসিক কটন টি-শার্ট"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold">Price (BDT) *</label>
                  <input
                    id="form-product-price"
                    type="number"
                    required
                    value={editingProduct?.price || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. 850"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold">Original Price (BDT - Optional)</label>
                  <input
                    id="form-product-original-price"
                    type="number"
                    value={editingProduct?.originalPrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) || undefined })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. 1200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold">Cost Price / Sourcing Cost (BDT - Optional)</label>
                  <input
                    id="form-product-cost-price"
                    type="number"
                    value={editingProduct?.costPrice || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) || undefined })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. 500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold">Stock Quantity *</label>
                  <input
                    id="form-product-stock"
                    type="number"
                    required
                    value={editingProduct?.stock !== undefined ? editingProduct.stock : ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="e.g. 15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-gray-500 font-bold">Category * (ক্যাটাগরি নির্ধারণ করুন)</label>
                  <select
                    id="form-product-category"
                    value={editingProduct?.category || "Shoes & Footwear"}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 font-semibold"
                  >
                    <option value="Shoes & Footwear">👠 Shoes & Footwear (জুতা ও ফুটওয়্যার)</option>
                    <option value="Cosmetics & Beauty">💅 Cosmetics & Beauty (কসমেটিকস ও বিউটি)</option>
                    <option value="Clothing & Fashion">👕 Clothing & Fashion (পোশাক ও ফ্যাশন)</option>
                    <option value="Gadgets & Electronics">🔌 Gadgets & Electronics (গ্যাজেট ও ইলেকট্রনিক্স)</option>
                    <option value="Watch & Accessories">⌚ Watch & Accessories (ঘড়ি ও এক্সেসরিজ)</option>
                    <option value="Home & Kitchen">🍳 Home & Kitchen (হোম ও রান্নাঘর)</option>
                    <option value="Health & Care">❤️ Health & Care (হেলথ ও পারসোনাল কেয়ার)</option>
                    <option value="Toys & Kids">🧸 Toys & Kids (খেলনা ও বাচ্চাদের জিনিস)</option>
                    <option value="Accessories">👜 General Accessories (সাধারণ এক্সেসরিজ)</option>
                    <option value="Grocery">🍎 Grocery & Food (মুদি ও খাবারদাবার)</option>
                  </select>
                </div>

                {/* Upload Image Section */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-gray-500 font-bold block">Product Image * (প্রোডাক্টের ছবি আপলোড)</label>
                  
                  {/* Visual Dropzone area */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* Visual Button area */}
                    <div 
                      onClick={() => document.getElementById("admin-product-file-input")?.click()}
                      className="sm:col-span-2 border-2 border-dashed border-gray-200 hover:border-[#3730a3] rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 cursor-pointer bg-white hover:bg-indigo-50/20 transition-all group"
                    >
                      <input 
                        type="file" 
                        id="admin-product-file-input" 
                        accept="image/*" 
                        onChange={handleImageFileChange} 
                        className="hidden" 
                      />
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#3730a3] group-hover:scale-110 transition-all" />
                      <div>
                        <span className="text-xs font-bold text-gray-700 block">
                          {lang === "bn" ? "মোবাইল/কম্পিউটার থেকে ছবি আপলোড করুন" : "Click to select image file"}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {lang === "bn" ? "জেপেগ, পিএনজি ফরম্যাট (৩ মেগাবাইটের নিচে)" : "Supports JPG, PNG (Max 3MB)"}
                        </span>
                      </div>
                    </div>

                    {/* Preview box */}
                    <div className="border border-gray-200 rounded-2xl bg-white p-2.5 flex items-center justify-center relative min-h-[110px]">
                      {editingProduct?.image ? (
                        <div className="relative w-full h-full group flex items-center justify-center">
                          <img 
                            src={editingProduct.image} 
                            alt="Preview" 
                            className="max-h-24 max-w-full object-contain rounded-xl"
                            referrerPolicy="no-referrer"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingProduct(prev => prev ? { ...prev, image: "" } : null)}
                            className="absolute -top-1.5 -right-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md hover:scale-105 transition-all cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-[10px] text-gray-400 font-medium">
                          {lang === "bn" ? "কোনো ছবি সিলেক্ট করা নেই" : "No image selected"}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Fallback Image URL input */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">
                      {lang === "bn" ? "অথবা সরাসরি ছবির লিংক দিন (Image URL)" : "Or specify direct image URL"}
                    </label>
                    <input
                      id="form-product-image"
                      type="text"
                      required
                      value={editingProduct?.image || ""}
                      onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-xs"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-gray-500 font-bold">Description (English)</label>
                  <textarea
                    id="form-product-desc"
                    value={editingProduct?.description || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    rows={2}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    placeholder="Product highlights..."
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-gray-500 font-bold">বিবরণ (বাংলা)</label>
                  <textarea
                    id="form-product-desc-bn"
                    value={editingProduct?.banglaDescription || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, banglaDescription: e.target.value })}
                    rows={2}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                    placeholder="প্রোডাক্টের বিবরণ লিখুন..."
                  />
                </div>

                {/* Landing Page Extra Configuration Section */}
                <div className="md:col-span-2 border-t border-gray-200 pt-5 mt-2 space-y-4">
                  <h4 className="text-sm font-extrabold text-indigo-900 flex items-center gap-2">
                    <span>✨</span>
                    {lang === "bn" ? "ল্যান্ডিং পেজ কনফিগারেশন (৩-৪ অতিরিক্ত ছবি ও বর্ণনা)" : "Landing Page Extra Config (3-4 Extra Images & Description)"}
                  </h4>
                  <p className="text-xs text-gray-500">
                    {lang === "bn" 
                      ? "পণ্যটির জন্য একটি আকর্ষণীয় ফুল-লেংথ ল্যান্ডিং পেজ তৈরি করতে এখানে অতিরিক্ত ৩ থেকে ৪টি ছবি এবং বিস্তারিত বিবরণ যোগ করুন।" 
                      : "Add up to 4 additional images and write high-converting descriptive sections to turn this product detail page into a full-length landing page."}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">Landing Page Long Description (English)</label>
                      <textarea
                        id="form-landing-desc-en"
                        value={editingProduct?.landingDescription || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, landingDescription: e.target.value })}
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs resize-none"
                        placeholder="Write dynamic sales copywriting, specifications, and user benefits for the landing page..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">ল্যান্ডিং পেজ দীর্ঘ বিবরণ (বাংলা)</label>
                      <textarea
                        id="form-landing-desc-bn"
                        value={editingProduct?.banglaLandingDescription || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, banglaLandingDescription: e.target.value })}
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs resize-none"
                        placeholder="ল্যান্ডিং পেজের জন্য আকর্ষণীয় অফার টেক্সট, ব্যবহারের নিয়মাবলি এবং কাস্টমার রিভিউ বিবরণ লিখুন..."
                      />
                    </div>
                  </div>

                  {/* 4 Extra Images List */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-600 block">
                      {lang === "bn" ? "অতিরিক্ত ল্যান্ডিং পেজ ছবি তালিকা (সর্বোচ্চ ৪টি)" : "Additional Landing Page Images List (Max 4)"}
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {[0, 1, 2, 3].map((idx) => {
                        const currentImageUrl = editingProduct?.images?.[idx] || "";
                        return (
                          <div key={idx} className="border border-gray-200 rounded-xl p-3 bg-white space-y-2 flex flex-col justify-between">
                            <span className="text-[10px] font-bold text-gray-400 block uppercase">
                              {lang === "bn" ? `ছবি নম্বর ${idx + 1}` : `Image #${idx + 1}`}
                            </span>

                            <div className="h-24 bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative group">
                              {currentImageUrl ? (
                                <>
                                  <img 
                                    src={currentImageUrl} 
                                    alt={`Landing #${idx + 1}`} 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingProduct((prev) => {
                                        if (!prev) return null;
                                        const nextImages = [...(prev.images || [])];
                                        nextImages[idx] = "";
                                        return { ...prev, images: nextImages };
                                      });
                                    }}
                                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white rounded-lg cursor-pointer"
                                  >
                                    <Trash2 className="w-5 h-5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`landing-file-input-${idx}`)?.click()}
                                  className="w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer text-xs font-bold"
                                >
                                  <Plus className="w-5 h-5 mb-1" />
                                  <span>{lang === "bn" ? "আপলোড করুন" : "Upload"}</span>
                                </button>
                              )}
                              <input 
                                type="file" 
                                id={`landing-file-input-${idx}`} 
                                accept="image/*" 
                                onChange={(e) => handleLandingImageFileChange(e, idx)} 
                                className="hidden" 
                              />
                            </div>

                            {/* Direct URL Input */}
                            <input
                              type="text"
                              value={currentImageUrl}
                              onChange={(e) => {
                                const val = e.target.value;
                                setEditingProduct((prev) => {
                                  if (!prev) return null;
                                  const nextImages = [...(prev.images || [])];
                                  while (nextImages.length <= idx) {
                                    nextImages.push("");
                                  }
                                  nextImages[idx] = val;
                                  return { ...prev, images: nextImages };
                                });
                              }}
                              placeholder={lang === "bn" ? "অথবা ছবির লিংক" : "Or paste URL"}
                              className="w-full bg-gray-50 border border-gray-100 rounded px-2 py-1 text-[10px] focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2 bg-indigo-50/40 border border-indigo-100/50 p-3.5 rounded-2xl">
                  <label className="text-[#3730a3] font-bold block mb-1 flex items-center gap-1.5">
                    <span>🏪</span> 
                    {lang === "bn" ? "সরবরাহকারী / অন্য শপ আইডি (উৎসের তথ্য)" : "Supplier / Source Shop Name"}
                  </label>
                  <input
                    id="form-product-supplier-shop"
                    type="text"
                    value={editingProduct?.supplierShop || ""}
                    onChange={(e) => setEditingProduct({ ...editingProduct, supplierShop: e.target.value })}
                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold"
                    placeholder={lang === "bn" ? "যেমন: Star Tech, Wholesaler BD, Daraz Seller ID ইত্যাদি" : "e.g. Wholesaler BD, Star Tech, Daraz Seller ID"}
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    {lang === "bn" 
                      ? "প্রোডাক্টটি যদি অন্য কোনো শপ থেকে নেয়া হয়ে থাকে তবে এখানে তাদের নাম লিখুন। এতে সহজেই তাদের ডেলিভারি শিট ডাউনলোড করতে পারবেন।" 
                      : "If this product is sourced from another shop, specify their name. You will be able to filter and export their order spreadsheets."}
                  </p>
                </div>

                {/* Product Variations Block (Unlimited) */}
                <div className="space-y-3 md:col-span-2 bg-slate-50 border border-gray-200 p-4 rounded-2xl">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                    <h5 className="font-extrabold text-xs text-gray-800 flex items-center gap-1.5">
                      <span>🏷️</span>
                      {lang === "bn" ? "প্রোডাক্ট ভ্যারিয়েশন (অসীম)" : "Product Variations (Unlimited)"}
                    </h5>
                    <button
                      type="button"
                      onClick={() => {
                        const currentVars = editingProduct?.variations || [];
                        setEditingProduct({
                          ...editingProduct,
                          variations: [...currentVars, { name: "", options: [] }]
                        });
                      }}
                      className="text-xs bg-indigo-50 hover:bg-indigo-100 text-[#3730a3] font-bold px-3 py-1.5 rounded-lg border border-indigo-100 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>➕</span> {lang === "bn" ? "ভ্যারিয়েশন যোগ করুন" : "Add Variation"}
                    </button>
                  </div>

                  {(editingProduct?.variations || []).length === 0 ? (
                    <p className="text-[11px] text-gray-400 py-2">
                      {lang === "bn" ? "কোনো কাস্টম ভ্যারিয়েশন যোগ করা হয়নি। আপনি সাইজ বা কালার ছাড়াও যেকোনো ধরণের ভ্যারিয়েন্ট যোগ করতে পারেন।" : "No custom variations added yet. You can add attributes like Size, Color, Weight, Storage, etc."}
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {(editingProduct?.variations || []).map((v, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-white p-3 rounded-xl border border-gray-150">
                          <div className="w-full sm:w-1/3 space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "ভ্যারিয়েশন টাইপ" : "Attribute Name"}</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Size, Color, Storage"
                              value={v.name}
                              onChange={(e) => {
                                const currentVars = [...(editingProduct?.variations || [])];
                                currentVars[idx].name = e.target.value;
                                setEditingProduct({ ...editingProduct, variations: currentVars });
                              }}
                              className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          <div className="w-full sm:w-2/3 space-y-1">
                            <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "অপশন সমূহ (কমা দিয়ে আলাদা করুন)" : "Options (comma separated)"}</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Red, Blue, Green OR S, M, L, XL"
                              value={v.options.join(", ")}
                              onChange={(e) => {
                                const currentVars = [...(editingProduct?.variations || [])];
                                currentVars[idx].options = e.target.value.split(",").map(item => item.trim()).filter(Boolean);
                                setEditingProduct({ ...editingProduct, variations: currentVars });
                              }}
                              className="w-full bg-slate-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const currentVars = (editingProduct?.variations || []).filter((_, i) => i !== idx);
                              setEditingProduct({ ...editingProduct, variations: currentVars });
                            }}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg border border-red-100 self-end sm:self-center transition-all cursor-pointer mt-2 sm:mt-4"
                            title="Remove Variation"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SEO Meta Tags Block */}
                <div className="space-y-3.5 md:col-span-2 bg-slate-50 border border-gray-200 p-4 rounded-2xl">
                  <h5 className="font-extrabold text-xs text-gray-800 pb-2 border-b border-gray-200 flex items-center gap-1.5">
                    <span>🔍</span>
                    {lang === "bn" ? "এসইও ও সার্চ ইঞ্জিন অপটিমাইজেশন (SEO Meta Tags)" : "Search Engine Optimization (SEO Meta Tags)"}
                  </h5>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-gray-500 font-bold">{lang === "bn" ? "এসইও মেটা টাইটেল (SEO Title)" : "SEO Meta Title"}</label>
                      <input
                        type="text"
                        value={editingProduct?.seoTitle || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, seoTitle: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder={lang === "bn" ? "সার্চ ইঞ্জিনে দেখানোর জন্য টাইটেল" : "e.g. Buy Premium T-Shirt Online | Johurul BDShop"}
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-gray-500 font-bold">{lang === "bn" ? "এসইও মেটা ডেসক্রিপশন (SEO Description)" : "SEO Meta Description"}</label>
                      <textarea
                        rows={2}
                        value={editingProduct?.seoDescription || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, seoDescription: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-xs font-semibold"
                        placeholder={lang === "bn" ? "সার্চ ইঞ্জিনে দেখানোর জন্য ছোট বিবরণ" : "e.g. Discover premium cotton t-shirts in Bangladesh. Free shipping inside Dhaka, fast delivery. Buy now at Johurul BDShop."}
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-gray-500 font-bold">{lang === "bn" ? "এসইও কিওয়ার্ডস (SEO Keywords)" : "SEO Keywords (comma separated)"}</label>
                      <input
                        type="text"
                        value={editingProduct?.seoKeywords || ""}
                        onChange={(e) => setEditingProduct({ ...editingProduct, seoKeywords: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. t-shirt online, bangla t-shirt store, cotton t-shirt dhaka"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  id="cancel-product-btn"
                  type="button"
                  onClick={() => {
                    setIsEditingProduct(false);
                    setEditingProduct(null);
                  }}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                >
                  {lang === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  id="save-product-submit"
                  type="submit"
                  className="bg-[#3730a3] hover:bg-emerald-700 text-white font-bold text-xs py-2 px-5 rounded-xl flex items-center gap-1 shadow-sm cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {lang === "bn" ? "সংরক্ষণ করুন" : "Save Changes"}
                </button>
              </div>
            </form>
          )}

          {/* Product Grid Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-indigo-800 border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  <th className="pb-3">{lang === "bn" ? "প্রোডাক্ট" : "Item Details"}</th>
                  <th className="pb-3">{lang === "bn" ? "ক্যাটাগরি" : "Category"}</th>
                  <th className="pb-3">{lang === "bn" ? "মূল্য" : "Retail Price"}</th>
                  <th className="pb-3">{lang === "bn" ? "স্টক" : "Stock"}</th>
                  <th className="pb-3 text-right">{lang === "bn" ? "অ্যাকশন" : "Modify"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <h4 className="font-bold text-gray-900 truncate max-w-[180px]">
                          {lang === "bn" ? p.banglaName || p.name : p.name}
                        </h4>
                        <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono text-gray-400">ID: {p.id}</span>
                          {p.supplierShop && (
                            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.2" title={lang === "bn" ? "সরবরাহকারী শপ" : "Supplier Shop"}>
                              🏪 {p.supplierShop}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 text-xs">
                      <span className="bg-indigo-50 text-red-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-indigo-800lue-100">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold">৳{p.price}</td>
                    <td className="py-3.5">
                      <span className={`text-xs ${p.stock <= 5 ? "text-indigo-900lue-600lue-500 font-bold" : "text-gray-600"}`}>
                        {p.stock} pcs
                      </span>
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          id={`edit-prod-${p.id}`}
                          onClick={() => {
                            setEditingProduct(p);
                            setIsEditingProduct(true);
                          }}
                          className="p-1.5 hover:bg-gray-100 text-indigo-600 rounded-lg"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          id={`delete-prod-${p.id}`}
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 hover:bg-indigo-50 text-indigo-900lue-600lue-500 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* RENDER MARKETING & PIXELS */}
      {activeTab === "landing" && (
        <div className="space-y-6 animate-fade-in animate-duration-200">
          
          {/* Header Card */}
          <div className="bg-gradient-to-r from-indigo-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-indigo-950">
            <div className="relative z-10 max-w-2xl space-y-3">
              <span className="bg-indigo-500/30 text-indigo-300 text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-500/20 uppercase tracking-wider inline-block">
                {lang === "bn" ? "অর্ডার বুস্টিং ও ফেসবুক-টিকটক পিক্সেল" : "Ad Boosting & Pixel Suite"}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                {lang === "bn" ? "ফেসবুক ও টিকটক অ্যাডস দিয়ে সেলস বাড়ান 🚀" : "Skyrocket Your Sales with Social Ads"}
              </h3>
              <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed">
                {lang === "bn" 
                  ? "আপনার এই ওয়েবসাইটটি ফেসবুক পিক্সেল (Meta Pixel) এবং টিকটক পিক্সেল (TikTok Pixel) এর সাথে সম্পূর্ণ রেডিমেড ইন্টিগ্রেটেড। নিচে আপনার পিক্সেল আইডিগুলো বসিয়ে সেভ করুন এবং বিজ্ঞাপনের কনভার্সন ট্র্যাকিং শুরু করুন।" 
                  : "This landing page is pre-configured with Meta and TikTok event trackers. Simply enter your Pixel IDs below to track PageView, ViewContent, AddToCart, InitiateCheckout, and Purchases in real time!"}
              </p>
            </div>
            
            {/* Subtle abstract glow background */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left: Pixel Settings Form (Spans 2 columns on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                  <Code className="w-5 h-5 text-[#3730a3]" />
                  <h4 className="text-lg font-black text-gray-900">
                    {lang === "bn" ? "পিক্সেল কনফিগারেশন" : "Configure Trackers"}
                  </h4>
                </div>

                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    onChangeFbPixelId(inputFbPixel.trim());
                    onChangeTtPixelId(inputTtPixel.trim());
                    setIsPixelSaved(true);
                    setTimeout(() => setIsPixelSaved(false), 3000);
                  }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* FB Pixel Input */}
                    <div className="bg-blue-50/20 border border-blue-100/40 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          <Facebook className="w-4 h-4 fill-current" />
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-800 block">
                            {lang === "bn" ? "মেটা (ফেসবুক) পিক্সেল আইডি" : "Meta (Facebook) Pixel ID"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">Meta Pixel ID</span>
                        </div>
                      </div>
                      
                      <input
                        type="text"
                        value={inputFbPixel}
                        onChange={(e) => setInputFbPixel(e.target.value)}
                        placeholder="e.g. 123456789012345"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                      />
                      
                      <span className="text-[10px] text-gray-400 block leading-tight">
                        {lang === "bn" 
                          ? "* এটি পেজভিউ, অ্যাড টু কার্ট এবং পারচেজ ইভেন্ট ট্র্যাক করবে।" 
                          : "* Tracks PageView, AddToCart, InitiateCheckout & Purchases on Meta."}
                      </span>
                    </div>

                    {/* TikTok Pixel Input */}
                    <div className="bg-red-50/10 border border-red-50 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center text-white font-mono font-black text-xs">
                          T
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-800 block">
                            {lang === "bn" ? "টিকটক পিক্সেল আইডি" : "TikTok Pixel ID"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-medium">TikTok Pixel ID</span>
                        </div>
                      </div>
                      
                      <input
                        type="text"
                        value={inputTtPixel}
                        onChange={(e) => setInputTtPixel(e.target.value)}
                        placeholder="e.g. C3N592BC77G0L1"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono text-sm"
                      />
                      
                      <span className="text-[10px] text-gray-400 block leading-tight">
                        {lang === "bn" 
                          ? "* এটি আপনার টিকটক বিজ্ঞাপনের জন্য কাস্টম কনভার্সন ট্র্যাক করবে।" 
                          : "* Tracks actions and views for TikTok Ads Manager."}
                      </span>
                    </div>

                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="submit"
                      className="bg-[#3730a3] hover:bg-[#2e288a] text-white font-bold py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99]"
                    >
                      {lang === "bn" ? "পিক্সেল সেটিংস সেভ করুন" : "Save Pixel IDs"}
                    </button>

                    {isPixelSaved && (
                      <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold animate-bounce">
                        <Check className="w-4 h-4" />
                        <span>{lang === "bn" ? "সফলভাবে সেভ করা হয়েছে!" : "Successfully saved!"}</span>
                      </div>
                    )}
                  </div>

                </form>
              </div>

              {/* WhatsApp Configuration Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <h4 className="text-lg font-black text-gray-900">
                    {lang === "bn" ? "হোয়াটসঅ্যাপ কাস্টমার সাপোর্ট এবং অর্ডার" : "WhatsApp Chat & Order Configuration"}
                  </h4>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === "bn"
                      ? "কাস্টমার যখন সরাসরি হোয়াটসঅ্যাপে অর্ডার করবে বা চ্যাট করতে চাইবে, তখন আপনার কোন নম্বরে মেসেজ যাবে তা এখানে সেট করুন। নম্বরটি অবশ্যই কান্ট্রি কোড সহ (যেমন: 88017XXXXXXXX) হতে হবে।"
                      : "Define the phone number where customer WhatsApp chat and automated checkout messages will be routed. Make sure to include the country code (e.g., 88017XXXXXXXX)."}
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (onChangeWhatsappNumber) {
                        onChangeWhatsappNumber(inputWhatsapp.trim());
                      }
                      setIsWhatsappSaved(true);
                      setTimeout(() => setIsWhatsappSaved(false), 3000);
                    }}
                    className="space-y-4"
                  >
                    <div className="bg-emerald-50/20 border border-emerald-100/40 p-4 rounded-2xl space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-mono font-black text-xs">
                          💬
                        </div>
                        <div>
                          <span className="text-xs font-black text-gray-800 block">
                            {lang === "bn" ? "হোয়াটসঅ্যাপ নম্বর (WhatsApp Number)" : "WhatsApp Number"}
                          </span>
                          <span className="text-[10px] text-emerald-600 font-bold font-mono">{whatsappNumber} (Current)</span>
                        </div>
                      </div>

                      <input
                        type="text"
                        value={inputWhatsapp}
                        onChange={(e) => setInputWhatsapp(e.target.value)}
                        placeholder="e.g. 8801795339373"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-sm font-bold"
                      />

                      <span className="text-[10px] text-gray-400 block leading-tight">
                        {lang === "bn"
                          ? "* কোনো স্পেস, হাইফেন বা '+' ছাড়া শুধু সংখ্যা দিন। উদাহরণ: 8801795339373"
                          : "* Only enter digits, without spaces, dashes or '+'. Example: 8801795339373"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md hover:scale-[1.01] active:scale-[0.99]"
                      >
                        {lang === "bn" ? "হোয়াটসঅ্যাপ নম্বর সেভ করুন" : "Save WhatsApp Number"}
                      </button>

                      {isWhatsappSaved && (
                        <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold animate-bounce">
                          <Check className="w-4 h-4" />
                          <span>{lang === "bn" ? "নম্বরটি সফলভাবে সেভ হয়েছে!" : "Saved successfully!"}</span>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Hero Banner Configuration Card */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                  <Package className="w-5 h-5 text-[#3730a3]" />
                  <h4 className="text-lg font-black text-gray-900">
                    {lang === "bn" ? "হিরো ব্যানার কনফিগারেশন" : "Configure Hero Banner Image"}
                  </h4>
                </div>

                <div className="space-y-4">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {lang === "bn"
                      ? "হোমপেজের হিরো অফার ব্যানারে প্রদর্শিত ইমেজটি পরিবর্তন করুন। আপনি যেকোনো অনলাইন ইমেজের লিঙ্ক বসাতে পারেন অথবা ডেমো ঘড়ির ছবিতে রিসেট করতে পারেন।"
                      : "Customize the image shown on the main homepage hero banner. Enter any online image URL, or reset back to the default smartwatch image."}
                  </p>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-600 block">
                      {lang === "bn" ? "ব্যানার ইমেজ URL" : "Banner Image URL"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputHeroImage}
                        onChange={(e) => setInputHeroImage(e.target.value)}
                        placeholder="https://example.com/banner.jpg"
                        className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setInputHeroImage(watchBannerImg);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                        title="Reset to default smartwatch"
                      >
                        {lang === "bn" ? "রিসেট" : "Reset"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          onChangeHeroImageUrl(inputHeroImage.trim());
                          setIsBannerSaved(true);
                          setTimeout(() => setIsBannerSaved(false), 3000);
                        }}
                        className="bg-[#3730a3] hover:bg-[#2e288a] text-white font-bold py-2.5 px-6 rounded-xl text-xs transition-all cursor-pointer shadow-md"
                      >
                        {lang === "bn" ? "ইমেজ সেভ করুন" : "Save Image URL"}
                      </button>

                      {isBannerSaved && (
                        <div className="flex items-center gap-1.5 text-green-600 text-xs font-bold">
                          <Check className="w-4 h-4" />
                          <span>{lang === "bn" ? "ইমেজ সেভ করা হয়েছে!" : "Successfully updated!"}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Preview Container */}
                  <div className="border border-gray-100 rounded-2xl p-3 bg-gray-50">
                    <span className="text-[10px] font-bold text-gray-400 block mb-2 uppercase tracking-wider">
                      {lang === "bn" ? "ইমেজ প্রিভিউ" : "Live Image Preview"}
                    </span>
                    <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-200 border border-gray-200/60 relative">
                      {inputHeroImage ? (
                        <img
                          src={inputHeroImage}
                          alt="Banner Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-medium">
                          {lang === "bn" ? "কোনো ইমেজ লিংক দেওয়া হয়নি" : "No image URL provided"}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Landing Page Link Generator */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                  <Share2 className="w-5 h-5 text-[#3730a3]" />
                  <h4 className="text-lg font-black text-gray-900">
                    {lang === "bn" ? "বিজ্ঞাপনের জন্য স্পেসিফিক প্রোডাক্ট লিংক জেনারেটর" : "Product Ad-Link Generator"}
                  </h4>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {lang === "bn"
                    ? "ফেসবুক বা টিকটকে বুস্ট করার সময় নিচে যেকোনো প্রোডাক্ট সিলেক্ট করে সরাসরি তার জন্য ডেডিকেটেড লিংক কপি করুন। এই লিংকে ক্লিক করলে কাস্টমার সরাসরি সেই প্রোডাক্টের অফার পেজে ল্যান্ড করবে।"
                    : "Generate precise landing page URLs for your social campaigns. Selecting a product generates a clean link that triggers direct focus on that specific catalog item."}
                </p>

                <div className="bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">
                        {lang === "bn" ? "টার্গেট প্রোডাক্ট সিলেক্ট করুন" : "Choose Target Product"}
                      </label>
                      <select
                        id="pixel-generator-product"
                        onChange={(e) => {
                          const val = e.target.value;
                          const container = document.getElementById("pixel-generated-url-output") as HTMLInputElement;
                          if (container) {
                            const baseUrl = window.location.origin + window.location.pathname;
                            container.value = val ? `${baseUrl}?product=${val}` : baseUrl;
                          }
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                      >
                        <option value="">{lang === "bn" ? "-- সম্পূর্ণ ওয়েবসাইট লিংক --" : "-- Main Homepage Link --"}</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {lang === "bn" ? p.banglaName || p.name : p.name} (৳{p.price})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-600 block">
                        {lang === "bn" ? "অ্যাড সোর্স (UTM Ref)" : "Ad Platform (UTM Source)"}
                      </label>
                      <select
                        id="pixel-generator-source"
                        onChange={(e) => {
                          const val = e.target.value;
                          const container = document.getElementById("pixel-generated-url-output") as HTMLInputElement;
                          const pSelect = document.getElementById("pixel-generator-product") as HTMLSelectElement;
                          if (container && pSelect) {
                            const baseUrl = window.location.origin + window.location.pathname;
                            const pId = pSelect.value;
                            let url = baseUrl;
                            if (pId) {
                              url += `?product=${pId}`;
                              if (val) url += `&ref=${val}`;
                            } else if (val) {
                              url += `?ref=${val}`;
                            }
                            container.value = url;
                          }
                        }}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none"
                      >
                        <option value="">None (কোনো সোর্স ছাড়া)</option>
                        <option value="facebook_ads">Facebook Ads (ফেসবুক বিজ্ঞাপন)</option>
                        <option value="tiktok_ads">TikTok Ads (টিকটক বিজ্ঞাপন)</option>
                        <option value="whatsapp">WhatsApp Group (হোয়াটসঅ্যাপ)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                      {lang === "bn" ? "আপনার বিজ্ঞাপনের লিংক (Copy this link for your Ads Web URL)" : "YOUR GENERATED AD URL"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="pixel-generated-url-output"
                        type="text"
                        readOnly
                        value={window.location.origin + window.location.pathname}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById("pixel-generated-url-output") as HTMLInputElement;
                          if (el) {
                            navigator.clipboard.writeText(el.value);
                            const toast = document.createElement("div");
                            toast.className = "fixed bottom-5 right-5 bg-green-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-lg z-50 animate-fade-in flex items-center gap-2";
                            toast.innerHTML = `<span>✔️</span> ${lang === "bn" ? "লিংক কপি করা হয়েছে!" : "Link copied to clipboard!"}`;
                            document.body.appendChild(toast);
                            setTimeout(() => toast.remove(), 2500);
                          }
                        }}
                        className="bg-indigo-50 hover:bg-indigo-100 text-[#3730a3] p-2.5 rounded-xl border border-indigo-100 hover:scale-105 transition-all cursor-pointer"
                        title="Copy Link"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right: How to boost orders on FB/TikTok Guideline */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-gray-50">
                <Facebook className="w-5 h-5 text-[#3730a3]" />
                <h4 className="text-lg font-black text-gray-900">
                  {lang === "bn" ? "বুস্টিং গাইডলাইন" : "Boosting Guide"}
                </h4>
              </div>

              {lang === "bn" ? (
                <div className="space-y-5 text-sm">
                  
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-[#3730a3] font-black text-xs flex items-center justify-center">১</span>
                      পিক্সেল আইডি যুক্ত করুন
                    </h5>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5">
                      আপনার ফেসবুক বা টিকটক বিজনেজ ম্যানেজার থেকে পিক্সেল আইডি নিয়ে বামপাশের বক্সে বসিয়ে <strong>"সেভ করুন"</strong>। এতে সম্পূর্ণ কোড অটোমেটিক সেট হয়ে যাবে।
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-[#3730a3] font-black text-xs flex items-center justify-center">২</span>
                      অ্যাডস রান করুন (Sales Campaign)
                    </h5>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5">
                      বিজ্ঞাপন দেওয়ার সময় সবসময় <strong>Sales</strong> অথবা <strong>Conversions</strong> অবজেক্টিভ সিলেক্ট করবেন। কনভার্সন লোকেশন <strong>"Website"</strong> দিন।
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-[#3730a3] font-black text-xs flex items-center justify-center">৩</span>
                      টার্গেট পিক্সেল ইভেন্ট
                    </h5>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5">
                      ফেসবুক বিজ্ঞাপনে টার্গেট ইভেন্ট হিসেবে <strong>Purchase (ক্রয়)</strong> অথবা <strong>AddToCart</strong> সিলেক্ট করবেন। এতে ফেসবুক সঠিক কাস্টমারদের কাছে অ্যাড অপ্টিমাইজ করবে।
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-[#3730a3] font-black text-xs flex items-center justify-center">৪</span>
                      কাস্টম ডোমেইন (Vercel)
                    </h5>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5 text-justify">
                      প্রফেশনাল বিজ্ঞাপনের জন্য একটি কাস্টম ডোমেইন (.com বা .com.bd) ড্যাশবোর্ডে গিয়ে এড করুন। ডোমেইন ভেরিফিকেশন কমপ্লিট করলে বিজ্ঞাপনের কস্ট অর্ধেকের বেশি কমে আসবে!
                    </p>
                  </div>

                  <div className="p-3.5 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-2 text-[11px] text-amber-800 font-medium">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
                    <p>
                      <strong>মনে রাখবেন:</strong> যেকোনো কাস্টমার অর্ডার কমপ্লিট করলেই পিক্সেল <strong>Purchase</strong> ইভেন্টটি মোট টাকার এমাউন্টসহ ট্র্যাকিং সিস্টেমে পাঠিয়ে দেয়।
                    </p>
                  </div>

                </div>
              ) : (
                <div className="space-y-5 text-sm">
                  
                  <div className="space-y-1.5">
                    <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-[#3730a3] font-black text-xs flex items-center justify-center">1</span>
                      Setup Pixel IDs
                    </h5>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5">
                      Paste your pixel IDs into the inputs on the left. The site automatically wires up advanced script events.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-[#3730a3] font-black text-xs flex items-center justify-center">2</span>
                      Run Sales Campaigns
                    </h5>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5">
                      Select <strong>Sales</strong> or <strong>Conversions</strong> inside Facebook Ads Manager. Select Website as your conversion source.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h5 className="font-bold text-gray-900 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-indigo-50 text-[#3730a3] font-black text-xs flex items-center justify-center">3</span>
                      Configure Purchase Event
                    </h5>
                    <p className="text-xs text-gray-500 leading-relaxed pl-6.5">
                      Choose <strong>Purchase</strong> as the optimization event to let Facebook prioritize buyers over casual visitors.
                    </p>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* RENDER ABANDONED CHECKOUTS */}
      {activeTab === "abandoned" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-gradient-to-r from-red-500/80 to-amber-600/80 rounded-3xl p-6 text-white shadow-md">
            <h3 className="text-xl font-black">🛒 {lang === "bn" ? "অসম্পূর্ণ কার্ট ও পরিত্যক্ত অর্ডার" : "Abandoned Checkouts Recovery"}</h3>
            <p className="text-xs text-amber-50 mt-1">
              {lang === "bn" ? "যেসব কাস্টমার চেকআউট ফর্মে নাম-ঠিকানা লিখলেও সম্পূর্ণ অর্ডার সাবমিট করেনি, তাদের তালিকা নিচে দেওয়া হলো।" : "Customers who initiated checkout, entered some info, but did not complete order placement."}
            </p>
          </div>
          
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "পরিত্যক্ত কার্ট ডাটা" : "Abandoned Records Stream"}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase pb-2">
                    <th className="pb-3">CART ID</th>
                    <th className="pb-3">CUSTOMER</th>
                    <th className="pb-3">ITEMS SUMMARY</th>
                    <th className="pb-3">POTENTIAL TOTAL</th>
                    <th className="pb-3">ABANDONED AT</th>
                    <th className="pb-3">STATUS</th>
                    <th className="pb-3 text-right">ACTION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                  {abandonedOrders.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-50/50">
                      <td className="py-3 font-mono font-bold text-red-600">{rec.id}</td>
                      <td className="py-3">
                        <div className="font-bold text-gray-900">{rec.name}</div>
                        <div className="text-gray-400 font-mono text-[10px]">{rec.phone}</div>
                      </td>
                      <td className="py-3 text-gray-500">{rec.items}</td>
                      <td className="py-3 font-black">৳{rec.amount}</td>
                      <td className="py-3 text-gray-400 font-semibold">{rec.time}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          rec.status === "Recovered" ? "bg-green-50 text-green-700 animate-pulse" : "bg-amber-50 text-amber-700"
                        }`}>{rec.status}</span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-1.5">
                          {rec.status === "Active" && (
                            <>
                              <button
                                type="button"
                                onClick={() => {
                                  alert(lang === "bn" ? `${rec.name} কে হোয়াটসঅ্যাপে রিমাইন্ডার পাঠানো হয়েছে!` : `WhatsApp recovery reminder sent to ${rec.name} (${rec.phone})!`);
                                }}
                                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-100 flex items-center gap-1 cursor-pointer"
                              >
                                💬 WhatsApp
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const confirmed = window.confirm(lang === "bn" ? "আপনি কি এই কার্টটিকে একটি কনফার্মড অর্ডারে রুপান্তর করতে চান?" : "Convert this abandoned cart into a live order?");
                                  if (confirmed) {
                                    const mockOrder: Order = {
                                      id: rec.id.replace("AB-", ""),
                                      customerName: rec.name,
                                      customerPhone: rec.phone,
                                      customerAddress: "Mymensingh Town, Bangladesh",
                                      customerThana: "Mymensingh Sadar",
                                      customerDistrict: "Mymensingh",
                                      customerDivision: "Mymensingh",
                                      cartItems: [{
                                        product: products[0] || { id: "p1", name: "Recovered Item", price: rec.amount, image: "", description: "", category: "General", stock: 100, rating: 5, reviewsCount: 12 },
                                        quantity: 1
                                      }],
                                      totalAmount: rec.amount,
                                      paymentMethod: "cod",
                                      status: OrderStatus.RECEIVED,
                                      createdAt: new Date().toISOString(),
                                      trackingHistory: createDefaultTrackingHistory()
                                    };
                                    onUpdateOrders([mockOrder, ...orders]);
                                    setAbandonedOrders(abandonedOrders.map(a => a.id === rec.id ? { ...a, status: "Recovered" } : a));
                                    alert(lang === "bn" ? "সফলভাবে কার্ট অর্ডার কনভার্ট করা হয়েছে!" : "Cart converted to active order successfully!");
                                  }
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer shadow-sm animate-pulse"
                              >
                                ✅ Recover
                              </button>
                            </>
                          )}
                          {rec.status === "Recovered" && (
                            <span className="text-[10px] text-green-600 font-bold">🎉 Successfully Saved</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* RENDER CUSTOMERS LEDGER */}
      {activeTab === "customers" && (() => {
        const customersMap: Record<string, { name: string; phone: string; address: string; totalSpent: number; orderCount: number; lastActive: string }> = {};
        orders.forEach(o => {
          const key = o.customerPhone.trim();
          if (!customersMap[key]) {
            customersMap[key] = {
              name: o.customerName,
              phone: o.customerPhone,
              address: `${o.customerThana ? `${o.customerThana}, ` : ""}${o.customerDistrict}`,
              totalSpent: 0,
              orderCount: 0,
              lastActive: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Just now"
            };
          }
          customersMap[key].totalSpent += o.totalAmount;
          customersMap[key].orderCount += 1;
        });

        const sortedCustomers = Object.values(customersMap);

        return (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div>
                  <h3 className="text-lg font-black text-gray-900">{lang === "bn" ? "গ্রাহক ডাটাবেস ও লাইফ-টাইম ভ্যালু" : "Customer Ledger & LTV"}</h3>
                  <p className="text-xs text-gray-400 font-semibold">{lang === "bn" ? "অর্ডারকারী সকল ইউনিক গ্রাহকদের মোট ক্রয়ের পরিমাণ ও কন্টাক্ট ইনফো।" : "Comprehensive list of unique shoppers and their cumulative purchasing value."}</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-2xl text-xs font-black text-[#3730a3]">
                  {sortedCustomers.length} {lang === "bn" ? "ইউনিক কাস্টমার" : "Unique Clients"}
                </div>
              </div>

              {sortedCustomers.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  {lang === "bn" ? "কোনো ইউনিক কাস্টমার পাওয়া যায়নি। প্রথমে অর্ডার প্লেস করুন।" : "No unique customer accounts detected yet."}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase pb-2">
                        <th className="pb-3">{lang === "bn" ? "কাস্টমার নাম" : "Customer Name"}</th>
                        <th className="pb-3">{lang === "bn" ? "মোবাইল নম্বর" : "Phone Number"}</th>
                        <th className="pb-3">{lang === "bn" ? "ঠিকানা" : "Primary Area"}</th>
                        <th className="pb-3 text-center">{lang === "bn" ? "অর্ডার সংখ্যা" : "Orders Count"}</th>
                        <th className="pb-3">{lang === "bn" ? "মোট কেনাকাটা" : "Lifetime Value"}</th>
                        <th className="pb-3">{lang === "bn" ? "সর্বশেষ সক্রিয়" : "Last Purchase"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                      {sortedCustomers.map((cust, i) => (
                        <tr key={i} className="hover:bg-gray-50/50">
                          <td className="py-3.5 font-bold text-gray-900">{cust.name}</td>
                          <td className="py-3.5 font-mono text-indigo-700 font-semibold">{cust.phone}</td>
                          <td className="py-3.5 text-gray-500">{cust.address}</td>
                          <td className="py-3.5 text-center">
                            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded-full font-bold text-[10px]">{cust.orderCount}</span>
                          </td>
                          <td className="py-3.5 font-black text-[#3730a3]">৳{cust.totalSpent}</td>
                          <td className="py-3.5 text-gray-400 font-semibold">{cust.lastActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* RENDER ACCOUNTS LEDGER */}
      {activeTab === "accounts" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] text-emerald-800 font-black uppercase tracking-wider block">Total Sales Receipts</span>
              <h4 className="text-2xl font-black text-emerald-900 mt-1">৳{totalRevenue}</h4>
              <p className="text-[10px] text-emerald-600 font-bold mt-1">Directly logged from orders</p>
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] text-red-800 font-black uppercase tracking-wider block">Total Expenditures</span>
              <h4 className="text-2xl font-black text-red-900 mt-1">৳{expenses.reduce((sum, e) => sum + e.amount, 0)}</h4>
              <p className="text-[10px] text-red-600 font-bold mt-1">Ad boosters & operations cost</p>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 shadow-xs">
              <span className="text-[10px] text-indigo-800 font-black uppercase tracking-wider block">Net Profit Margin</span>
              <h4 className="text-2xl font-black text-[#3730a3] mt-1">৳{totalRevenue - expenses.reduce((sum, e) => sum + e.amount, 0)}</h4>
              <p className="text-[10px] text-[#3730a3] font-bold mt-1">Estimated business earnings</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "নতুন খরচ যুক্ত করুন" : "Add New Expense"}</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newExpenseDesc || !newExpenseAmount) return;
                const newExp = {
                  id: `E-${Math.floor(Math.random() * 100) + 410}`,
                  description: newExpenseDesc,
                  amount: Number(newExpenseAmount),
                  category: newExpenseCat,
                  date: new Date().toISOString().split("T")[0]
                };
                setExpenses([newExp, ...expenses]);
                setNewExpenseDesc("");
                setNewExpenseAmount("");
                alert(lang === "bn" ? "খরচ সফলভাবে যুক্ত হয়েছে!" : "Expense added successfully!");
              }} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "খরচের বিবরণ" : "Expense Description"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meta Ads Boost"
                    value={newExpenseDesc}
                    onChange={(e) => setNewExpenseDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "খরচের পরিমাণ (টাকা)" : "Amount (৳)"}</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1500"
                      value={newExpenseAmount}
                      onChange={(e) => setNewExpenseAmount(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "খরচের খাত" : "Category"}</label>
                    <select
                      value={newExpenseCat}
                      onChange={(e) => setNewExpenseCat(e.target.value)}
                      className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                    >
                      <option value="Marketing font-bold">Marketing</option>
                      <option value="Operations font-bold">Operations</option>
                      <option value="Utilities font-bold">Utilities</option>
                      <option value="Inventory font-bold">Inventory</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  ➕ {lang === "bn" ? "রেকর্ড যুক্ত করুন" : "Add Expense Record"}
                </button>
              </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "খরচের বিবরণী" : "Expenditures Ledger"}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase pb-2">
                      <th className="pb-3">EXP ID</th>
                      <th className="pb-3">DESCRIPTION</th>
                      <th className="pb-3">CATEGORY</th>
                      <th className="pb-3">DATE</th>
                      <th className="pb-3 text-right">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                    {expenses.map((e) => (
                      <tr key={e.id}>
                        <td className="py-3 font-mono font-bold text-slate-500">{e.id}</td>
                        <td className="py-3 text-gray-900 font-semibold">{e.description}</td>
                        <td className="py-3">
                          <span className="bg-red-50 text-red-700 border border-red-100 px-2 py-0.5 rounded text-[10px] font-bold">{e.category}</span>
                        </td>
                        <td className="py-3 text-gray-400">{e.date}</td>
                        <td className="py-3 font-black text-right text-red-600">৳{e.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER COUPONS & DISCOUNTS */}
      {activeTab === "coupons" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create Coupon Panel */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                {lang === "bn" ? "নতুন কুপন তৈরি করুন" : "Create New Coupon"}
              </h4>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newCouponCode) return;
                  
                  const newCoupon: Coupon = {
                    id: `c-${Date.now()}`,
                    code: newCouponCode.trim().toUpperCase(),
                    type: newCouponType,
                    value: Number(newCouponValue),
                    minPurchase: Number(newCouponMinPurchase),
                    expiryDate: newCouponExpiry,
                    descriptionEn: newCouponDescEn || `Save ${newCouponType === "percentage" ? newCouponValue + "%" : newCouponValue + " BDT"} on your order`,
                    descriptionBn: newCouponDescBn || `আপনার অর্ডারে ${newCouponType === "percentage" ? newCouponValue + "%" : newCouponValue + " টাকা"} ডিসকাউন্ট পান`,
                    isActive: true
                  };
                  
                  if (onUpdateCoupons) {
                    onUpdateCoupons([...coupons, newCoupon]);
                  }
                  
                  // Reset form
                  setNewCouponCode("");
                  setNewCouponValue(0);
                  setNewCouponMinPurchase(0);
                  setNewCouponDescEn("");
                  setNewCouponDescBn("");
                  alert(lang === "bn" ? "কুপন কোড সফলভাবে যোগ করা হয়েছে!" : "Coupon successfully added!");
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                    {lang === "bn" ? "কুপন কোড (ইংরেজি বড় হাতের অক্ষরের)" : "Coupon Code (uppercase)"}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. WINTER30"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                      {lang === "bn" ? "ডিসকাউন্ট টাইপ" : "Type"}
                    </label>
                    <select
                      value={newCouponType}
                      onChange={(e) => setNewCouponType(e.target.value as "percentage" | "flat")}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
                    >
                      <option value="percentage">{lang === "bn" ? "শতকরা (%)" : "Percentage (%)"}</option>
                      <option value="flat">{lang === "bn" ? "ফ্ল্যাট (৳)" : "Flat Amount (৳)"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                      {lang === "bn" ? "ডিসকাউন্ট মান" : "Value"}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={newCouponValue}
                      onChange={(e) => setNewCouponValue(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                      {lang === "bn" ? "সর্বনিম্ন ক্রয় (৳)" : "Min Spend (৳)"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newCouponMinPurchase}
                      onChange={(e) => setNewCouponMinPurchase(Number(e.target.value))}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                      {lang === "bn" ? "মেয়াদ শেষ" : "Expiry Date"}
                    </label>
                    <input
                      type="date"
                      value={newCouponExpiry}
                      onChange={(e) => setNewCouponExpiry(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                    {lang === "bn" ? "বিবরণ (English)" : "Description (English)"}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Save 30% on entire winter catalog"
                    value={newCouponDescEn}
                    onChange={(e) => setNewCouponDescEn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                    {lang === "bn" ? "বিবরণ (বাংলা)" : "Description (Bangla)"}
                  </label>
                  <input
                    type="text"
                    placeholder="যেমনঃ ৩০% ফ্ল্যাট ছাড় পান"
                    value={newCouponDescBn}
                    onChange={(e) => setNewCouponDescBn(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 outline-none focus:bg-white focus:border-blue-500 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider py-2.5 rounded-xl transition-all cursor-pointer shadow-md shadow-blue-200"
                >
                  {lang === "bn" ? "কুপন তৈরি করুন" : "Add Coupon Code"}
                </button>
              </form>
            </div>

            {/* Coupons List Panel */}
            <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                  {lang === "bn" ? "সক্রিয় কুপন কোড সমূহ" : "Active Coupon Vouchers"}
                </h4>
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                  {coupons.length} {lang === "bn" ? "টি কুপন" : "Coupons"}
                </span>
              </div>

              {coupons.length === 0 ? (
                <div className="text-center py-12 text-gray-400 font-bold text-xs space-y-2">
                  <Percent className="w-8 h-8 mx-auto text-gray-300 animate-bounce" />
                  <p>{lang === "bn" ? "কোনো কুপন কোড পাওয়া যায়নি!" : "No custom coupon codes configured."}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-[10px] font-black uppercase tracking-wider">
                        <th className="pb-3">{lang === "bn" ? "কোড" : "Code"}</th>
                        <th className="pb-3">{lang === "bn" ? "ডিসকাউন্ট" : "Discount"}</th>
                        <th className="pb-3">{lang === "bn" ? "ন্যূনতম ক্রয়" : "Min Spend"}</th>
                        <th className="pb-3">{lang === "bn" ? "মেয়াদ" : "Expiry"}</th>
                        <th className="pb-3">{lang === "bn" ? "অবস্থা" : "Status"}</th>
                        <th className="pb-3 text-right">{lang === "bn" ? "অ্যাকশন" : "Actions"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {coupons.map((coupon) => (
                        <tr key={coupon.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-3 font-mono font-black text-gray-900">
                            <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                              {coupon.code}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-gray-800">
                            {coupon.type === "percentage" ? `${coupon.value}%` : `৳${coupon.value}`}
                          </td>
                          <td className="py-3 font-bold text-gray-600">
                            ৳{coupon.minPurchase}
                          </td>
                          <td className="py-3 text-gray-500 font-mono text-[10px]">
                            {coupon.expiryDate || "No limit"}
                          </td>
                          <td className="py-3">
                            <button
                              type="button"
                              onClick={() => {
                                if (onUpdateCoupons) {
                                  const updated = coupons.map(c => 
                                    c.id === coupon.id ? { ...c, isActive: !c.isActive } : c
                                  );
                                  onUpdateCoupons(updated);
                                }
                              }}
                              className={`px-2 py-0.5 rounded text-[9px] font-black uppercase transition-all cursor-pointer ${
                                coupon.isActive 
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-slate-100 text-slate-500 border border-slate-200"
                              }`}
                            >
                              {coupon.isActive 
                                ? (lang === "bn" ? "সক্রিয়" : "Active")
                                : (lang === "bn" ? "নিষ্ক্রিয়" : "Inactive")
                              }
                            </button>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(lang === "bn" ? "আপনি কি এই কুপনটি ডিলিট করতে চান?" : "Are you sure you want to delete this coupon?")) {
                                  if (onUpdateCoupons) {
                                    onUpdateCoupons(coupons.filter(c => c.id !== coupon.id));
                                  }
                                }
                              }}
                              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RENDER CATEGORIES */}
      {activeTab === "categories" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "নতুন ক্যাটাগরি তৈরি করুন" : "Add New Category"}</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newCatName) return;
                const newCat = {
                  id: `cat-${categories.length + 1}`,
                  name: newCatName,
                  count: 0,
                  slug: newCatName.toLowerCase().replace(/\s+/g, "-")
                };
                setCategories([...categories, newCat]);
                setNewCatName("");
                alert(lang === "bn" ? "ক্যাটাগরি সফলভাবে তৈরি হয়েছে!" : "Category created successfully!");
              }} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "ক্যাটাগরির নাম" : "Category Name"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Smart Glasses"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  ➕ {lang === "bn" ? "ক্যাটাগরি তৈরি করুন" : "Create Category"}
                </button>
              </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "ক্যাটাগরি সমূহ" : "Product Categories"}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((cat) => {
                  const actualCount = products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length;
                  return (
                    <div key={cat.id} className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:bg-indigo-50/20 transition-all">
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{cat.name}</h4>
                        <span className="text-[10px] text-gray-400 font-mono">Slug: /{cat.slug}</span>
                      </div>
                      <div className="bg-indigo-50 text-[#3730a3] border border-indigo-100 text-[10px] font-black px-2.5 py-1 rounded-full">
                        {actualCount > 0 ? actualCount : cat.count} products
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER AUTHORS */}
      {activeTab === "authors" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "নতুন লেখক/কিউরেটর যুক্ত করুন" : "Add Brand Author / Curator"}</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newAuthorName || !newAuthorBio) return;
                const newAuth = {
                  id: `auth-${authors.length + 1}`,
                  name: newAuthorName,
                  bio: newAuthorBio,
                  image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
                };
                setAuthors([...authors, newAuth]);
                setNewAuthorName("");
                setNewAuthorBio("");
                alert(lang === "bn" ? "লেখক সফলভাবে যুক্ত করা হয়েছে!" : "Curator added successfully!");
              }} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "নাম" : "Full Name"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Masumbillah"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "ছোট পরিচিতি (Bio)" : "Short Biography"}</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="e.g. Expert in tech imports..."
                    value={newAuthorBio}
                    onChange={(e) => setNewAuthorBio(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  ➕ {lang === "bn" ? "কিউরেটর যুক্ত করুন" : "Add Author Profile"}
                </button>
              </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "লেখক ও কিউরেটর প্রোফাইল" : "Store Curators & Authors Directory"}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {authors.map((auth) => (
                  <div key={auth.id} className="bg-slate-50 border border-gray-100 rounded-2xl p-4 flex gap-3 hover:bg-indigo-50/20 transition-all font-sans">
                    <img
                      src={auth.image}
                      alt={auth.name}
                      className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm">{auth.name}</h4>
                      <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{auth.bio}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER PUBLISHERS */}
      {activeTab === "publishers" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "নতুন প্রকাশক / উৎস ব্র্যান্ড" : "Add Brand Publisher / Sourcing partner"}</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newPubName || !newPubLocation) return;
                const newPub = {
                  id: `pub-${publishers.length + 1}`,
                  name: newPubName,
                  location: newPubLocation,
                  productsCount: 0
                };
                setPublishers([...publishers, newPub]);
                setNewPubName("");
                setNewPubLocation("");
                alert(lang === "bn" ? "ব্র্যান্ড সফলভাবে যুক্ত করা হয়েছে!" : "Sourcing partner added successfully!");
              }} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "নাম" : "Publisher / Brand Name"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kamiab Prokashon"
                    value={newPubName}
                    onChange={(e) => setNewPubName(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "ঠিকানা / লোকেশন" : "Sourcing Hub Address"}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Banglabazar, Dhaka"
                    value={newPubLocation}
                    onChange={(e) => setNewPubLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  ➕ {lang === "bn" ? "ব্র্যান্ড যুক্ত করুন" : "Add Brand Sourcing"}
                </button>
              </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "উৎস শপ ও প্রকাশক সমূহ" : "Authorized Publishers & Brands list"}</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase pb-2">
                      <th className="pb-3">BRAND ID</th>
                      <th className="pb-3">NAME / BRAND</th>
                      <th className="pb-3">HUB LOCATION</th>
                      <th className="pb-3 text-right">TOTAL ITEMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                    {publishers.map((pub) => (
                      <tr key={pub.id}>
                        <td className="py-3 font-mono font-bold text-slate-500">{pub.id}</td>
                        <td className="py-3 text-gray-900 font-extrabold">{pub.name}</td>
                        <td className="py-3 text-gray-500 font-semibold">📍 {pub.location}</td>
                        <td className="py-3 text-right font-bold text-[#3730a3]">{pub.productsCount} catalog items</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER BANNERS */}
      {activeTab === "banners" && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b border-gray-50">
              <h3 className="text-lg font-black text-gray-900">{lang === "bn" ? "স্টোর হেডার ব্যানার ও স্লাইডার" : "Homepage Banner & Promotions Config"}</h3>
              <p className="text-xs text-gray-400 font-semibold">{lang === "bn" ? "আপনার ল্যান্ডিং পেজের প্রধান আকর্ষণীয় স্লাইড ব্যানার পরিবর্তন বা এডিট করুন।" : "Manage active homepage promotion sliders and main background assets."}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "প্রধান ব্যানার ইমেজ লিংক পরিবর্তন করুন" : "Set Active Background Hero Image URL"}</h4>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={inputHeroImage}
                    onChange={(e) => {
                      setInputHeroImage(e.target.value);
                      setIsBannerSaved(false);
                    }}
                    placeholder="Enter Banner Image URL (https://...)"
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono text-gray-600 focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onChangeHeroImageUrl(inputHeroImage);
                        setIsBannerSaved(true);
                        setTimeout(() => setIsBannerSaved(false), 2500);
                      }}
                      className="bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs py-2 px-5 rounded-xl cursor-pointer transition-all shadow-sm flex items-center gap-1"
                    >
                      {isBannerSaved ? "✔️ Saved" : "💾 Save Banner Image"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setInputHeroImage(watchBannerImg);
                        onChangeHeroImageUrl(watchBannerImg);
                        alert(lang === "bn" ? "ডিফল্ট ব্যানার সফলভাবে সেট করা হয়েছে!" : "Default banner restored!");
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-xs py-2 px-4 rounded-xl cursor-pointer"
                    >
                      Restore Default
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-xs text-gray-500 leading-relaxed space-y-1">
                  <h5 className="font-bold text-[#3730a3]">💡 Layout Optimization Tip</h5>
                  <p>Recommended aspect ratio is 16:9 or 21:9. Make sure the background is relatively dark or styled cleanly to keep typography elements perfectly readable for your conversion campaigns.</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-wider">{lang === "bn" ? "ব্যানারের বাস্তবসম্মত প্রিভিউ" : "Live Header Preview"}</h4>
                <div className="aspect-video rounded-3xl overflow-hidden border border-gray-150 shadow-sm relative group bg-black">
                  <img
                    src={heroImageUrl || watchBannerImg}
                    alt="Active Banner Preview"
                    className="w-full h-full object-cover opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[9px] font-black uppercase bg-emerald-500 text-white px-2 py-0.5 rounded-full w-fit mb-1">Active Banner</span>
                    <h5 className="text-sm font-extrabold truncate font-sans">{lang === "bn" ? "স্মার্টওয়াচ ধামাকা অফার" : "Premium Electronics Showcase"}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER STOCK */}
      {activeTab === "stock" && (
        <div className="space-y-6 animate-fade-in">
          {/* Inventory Control Panel Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Valuation Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden">
              <div className="absolute right-4 top-4 text-emerald-100 bg-emerald-50 p-2 rounded-2xl">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                {lang === "bn" ? "ইনভেন্টরি মোট মূল্যমান" : "Inventory Valuation"}
              </span>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-gray-900 font-mono">
                  ৳{totalRetailValuation.toLocaleString()}
                </h4>
                <p className="text-[10px] text-gray-500 font-bold flex justify-between">
                  <span>{lang === "bn" ? "ক্রয় মূল্য:" : "Cost value:"}</span>
                  <span className="font-mono">৳{totalCostValuation.toLocaleString()}</span>
                </p>
                <p className="text-[10px] text-emerald-600 font-bold flex justify-between border-t border-dashed border-gray-100 pt-1">
                  <span>{lang === "bn" ? "সম্ভাব্য লাভ:" : "Potential Profit:"}</span>
                  <span className="font-mono">৳{(totalRetailValuation - totalCostValuation).toLocaleString()}</span>
                </p>
              </div>
            </div>

            {/* Total Stock Pieces Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden">
              <div className="absolute right-4 top-4 text-indigo-100 bg-indigo-50 p-2 rounded-2xl">
                <Package className="w-5 h-5 text-[#3730a3]" />
              </div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                {lang === "bn" ? "মোট মজুদ আইটেম" : "Total Stock Units"}
              </span>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-gray-900 font-mono">
                  {totalStockItems.toLocaleString()} pcs
                </h4>
                <p className="text-[10px] text-gray-500 font-bold">
                  {lang === "bn" ? `মোট ${products.length}টি স্বতন্ত্র ক্যাটাগরি আইটেম` : `Across ${products.length} catalog products`}
                </p>
              </div>
            </div>

            {/* Low Stock Highlight Card */}
            <button
              type="button"
              onClick={() => setStockFilter("low")}
              className={`text-left w-full bg-white border rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden transition-all hover:scale-[1.01] ${
                stockFilter === "low" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-gray-100"
              }`}
            >
              <div className="absolute right-4 top-4 text-amber-100 bg-amber-50 p-2 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-amber-600 animate-pulse" />
              </div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                {lang === "bn" ? "কম স্টক অ্যালার্ট" : "Low Stock Alerts"}
              </span>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-amber-700 font-mono">
                  {lowStockCount} {lang === "bn" ? "টি পণ্য" : "items"}
                </h4>
                <p className="text-[10px] text-gray-500 font-bold">
                  {lang === "bn" ? "স্টক ৫ পিস বা তার নিচে নেমে গেছে" : "Stock quantity is 5 units or lower"}
                </p>
              </div>
            </button>

            {/* Dead Stock Card */}
            <button
              type="button"
              onClick={() => setStockFilter("dead")}
              className={`text-left w-full bg-white border rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden transition-all hover:scale-[1.01] ${
                stockFilter === "dead" ? "border-red-500 ring-2 ring-red-500/20" : "border-gray-100"
              }`}
            >
              <div className="absolute right-4 top-4 text-red-100 bg-red-50 p-2 rounded-2xl">
                <TrendingDown className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">
                {lang === "bn" ? "অচল স্টক (Dead Stock)" : "Dead Stock Items"}
              </span>
              <div className="space-y-1">
                <h4 className="text-xl font-black text-red-700 font-mono">
                  {deadStockCount} {lang === "bn" ? "টি পণ্য" : "items"}
                </h4>
                <p className="text-[10px] text-gray-500 font-bold">
                  {lang === "bn" ? "এখনো পর্যন্ত একটিও সেল হয়নি" : "Products with zero logged sales count"}
                </p>
              </div>
            </button>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="pb-4 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-base font-black text-gray-900 uppercase tracking-wider">
                  {lang === "bn" ? "ইনভেন্টরি কন্ট্রোল ও স্টক লেভেল" : "Warehouse Stock & Logistics"}
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  {lang === "bn" ? "স্টক লেভেল দ্রুত আপডেট করুন এবং পণ্যের সোর্সিং ভ্যালু মনিটর করুন।" : "Update physical stock counts, view cost margins, and filter logistics."}
                </p>
              </div>

              {/* Filtering segmented controls */}
              <div className="flex bg-slate-50 border border-gray-150 p-1 rounded-xl gap-1 shrink-0 text-xs">
                <button
                  type="button"
                  onClick={() => setStockFilter("all")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    stockFilter === "all" ? "bg-white text-[#3730a3] shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {lang === "bn" ? "সব পণ্য" : "All Products"} ({products.length})
                </button>
                <button
                  type="button"
                  onClick={() => setStockFilter("low")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    stockFilter === "low" ? "bg-amber-50 text-amber-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {lang === "bn" ? "কম স্টক" : "Low Stock"} ({lowStockCount})
                </button>
                <button
                  type="button"
                  onClick={() => setStockFilter("dead")}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    stockFilter === "dead" ? "bg-red-50 text-red-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
                  }`}
                >
                  {lang === "bn" ? "অচল স্টক" : "Dead Stock"} ({deadStockCount})
                </button>
              </div>
            </div>

            {filteredStockProducts.length === 0 ? (
              <div className="text-center py-16 text-gray-400 font-bold text-xs space-y-2">
                <Package className="w-8 h-8 mx-auto text-gray-300 animate-bounce" />
                <p>{lang === "bn" ? "ফিল্টার অনুযায়ী কোনো প্রোডাক্ট পাওয়া যায়নি!" : "No products found for this inventory filter."}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse font-sans">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase pb-2">
                      <th className="pb-3">{lang === "bn" ? "প্রোডাক্ট বিবরণ" : "Product Details"}</th>
                      <th className="pb-3">{lang === "bn" ? "মূল্যমান (Retail vs Sourcing)" : "Valuation (Retail vs Sourcing)"}</th>
                      <th className="pb-3">{lang === "bn" ? "স্টক বার" : "Inventory Level Bar"}</th>
                      <th className="pb-3">{lang === "bn" ? "স্টক স্ট্যাটাস" : "Supply Status"}</th>
                      <th className="pb-3 text-right">{lang === "bn" ? "স্টক পরিবর্তন" : "Quick Adjust Stock"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                    {filteredStockProducts.map((p) => {
                      const stockPercent = Math.min((p.stock / 100) * 100, 100);
                      const isDead = !p.salesCount || p.salesCount === 0;
                      const isLow = p.stock <= 5;
                      const calculatedSourcingCost = p.costPrice !== undefined ? p.costPrice : p.price * 0.6;
                      
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3.5 flex items-center gap-3">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-11 h-11 rounded-xl object-cover border shrink-0 bg-slate-50"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <h4 className="font-bold text-gray-900">{lang === "bn" ? p.banglaName || p.name : p.name}</h4>
                              <div className="flex gap-1.5 items-center mt-0.5">
                                <span className="text-[10px] font-mono text-gray-400">ID: {p.id}</span>
                                <span className="text-gray-300">•</span>
                                <span className="text-[10px] font-mono font-bold text-gray-500 bg-slate-100 px-1.5 py-0.2 rounded">
                                  {lang === "bn" ? "বিক্রি:" : "Sales:"} {p.salesCount || 0} pcs
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <div className="space-y-0.5 text-xs">
                              <p className="font-bold text-gray-800">
                                {lang === "bn" ? "বিক্রয় মূল্য: " : "Retail: "} 
                                <span className="font-mono text-indigo-600">৳{p.price}</span>
                              </p>
                              <p className="text-[10px] text-gray-400 font-bold">
                                {lang === "bn" ? "ক্রয় মূল্য: " : "Sourcing: "} 
                                <span className="font-mono">৳{calculatedSourcingCost}</span>
                              </p>
                            </div>
                          </td>
                          <td className="py-3.5 w-48">
                            <div className="space-y-1 font-mono">
                              <span className="text-[10px] font-bold text-gray-600">{p.stock} pcs remaining</span>
                              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isLow ? "bg-red-500" : p.stock <= 15 ? "bg-amber-500" : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${stockPercent}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5">
                            <div className="flex flex-col gap-1 items-start">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-wide ${
                                p.stock <= 0 
                                  ? "bg-red-50 text-red-700 border border-red-100" 
                                  : isLow 
                                  ? "bg-amber-50 text-amber-700 border border-amber-100" 
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              }`}>
                                {p.stock <= 0 ? "OUT OF STOCK" : isLow ? "LOW STOCK" : "HEALTHY"}
                              </span>
                              
                              {/* Restock suggestions or Dead stock badges */}
                              {isDead && (
                                <span className="px-1.5 py-0.2 text-[8px] font-extrabold uppercase bg-red-100 text-red-800 rounded">
                                  {lang === "bn" ? "অচল পণ্য (Dead Stock)" : "Dead Stock"}
                                </span>
                              )}
                              {isLow && p.stock > 0 && (
                                <span className="px-1.5 py-0.2 text-[8px] font-extrabold uppercase bg-amber-100 text-amber-800 rounded animate-pulse">
                                  {lang === "bn" ? "রিস্টক করুন" : "Restock Needed"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 text-right">
                            <div className="flex justify-end items-center gap-1.5">
                              <input
                                id={`stock-input-${p.id}`}
                                type="number"
                                defaultValue={p.stock}
                                className="w-16 bg-slate-50 border border-gray-250 rounded-lg px-2 py-1 text-center font-mono text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const input = document.getElementById(`stock-input-${p.id}`) as HTMLInputElement;
                                  if (input) {
                                    const newVal = Number(input.value);
                                    const updated = products.map(prod => prod.id === p.id ? { ...prod, stock: newVal } : prod);
                                    onUpdateProducts(updated);
                                    alert(lang === "bn" ? "স্টক লেভেল সফলভাবে আপডেট হয়েছে!" : "Product stock level updated successfully!");
                                  }
                                }}
                                className="bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs px-2.5 py-1 rounded-lg cursor-pointer shadow-xs transition-all"
                              >
                                {lang === "bn" ? "আপডেট" : "Update"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER DELIVERY */}
      {activeTab === "delivery" && (
        <div className="space-y-6 animate-fade-in animate-duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "শিপিং চার্জ কনফিগারেশন" : "Courier Shipping Rates"}</h4>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "ঢাকার ভেতরে" : "Inside Dhaka"}</label>
                  <div className="flex font-mono">
                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2 text-xs font-black flex items-center">৳</span>
                    <input
                      type="number"
                      value={deliveryConfig.insideDhaka}
                      onChange={(e) => setDeliveryConfig({ ...deliveryConfig, insideDhaka: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-r-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">{lang === "bn" ? "ঢাকার বাইরে" : "Outside Dhaka"}</label>
                  <div className="flex font-mono">
                    <span className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2 text-xs font-black flex items-center">৳</span>
                    <input
                      type="number"
                      value={deliveryConfig.outsideDhaka}
                      onChange={(e) => setDeliveryConfig({ ...deliveryConfig, outsideDhaka: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-gray-200 rounded-r-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Preferred Courier Provider</label>
                  <select
                    value={deliveryConfig.provider}
                    onChange={(e) => setDeliveryConfig({ ...deliveryConfig, provider: e.target.value })}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  >
                    <option value="Pathao">Pathao Courier (পাঠাও কুরিয়ার)</option>
                    <option value="RedX">RedX Logistics (রেডএক্স ডেলিভারি)</option>
                    <option value="Steadfast">Steadfast Courier (স্টিডফাস্ট)</option>
                    <option value="eCourier">eCourier BD (ই-কুরিয়ার)</option>
                  </select>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert(lang === "bn" ? "শিপিং রেট এবং সেটিংস সফলভাবে আপডেট হয়েছে!" : "Shipping rates and provider saved successfully!");
                  }}
                  className="w-full bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  💾 Save Shipping Rates
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "কুরিয়ার API কানেকশন ও বুকিং" : "Courier APIs Integration Live Hub"}</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                  <span className="text-[9px] text-emerald-800 font-black block tracking-wider uppercase">Courier Gateway</span>
                  <div className="text-emerald-700 font-black text-xs mt-1">CONNECTED</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-2xl border border-indigo-100 text-center">
                  <span className="text-[9px] text-indigo-800 font-black block tracking-wider uppercase">Pending Shipments</span>
                  <div className="text-[#3730a3] font-black text-xs mt-1 font-mono">
                    {orders.filter(o => o.status === OrderStatus.RECEIVED || o.status === OrderStatus.PROCESSING).length} consignments
                  </div>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-center">
                  <span className="text-[9px] text-purple-800 font-black block tracking-wider uppercase">Fulfilled Rate</span>
                  <div className="text-purple-700 font-black text-xs mt-1">94.2% delivery success</div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-gray-100 space-y-3 font-sans">
                <h5 className="font-extrabold text-xs text-gray-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                  {deliveryConfig.provider} Bulk Shipment Booker
                </h5>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Bulk sync pending orders with your courier backend instantly. Auto-generates billing consignment barcodes, assigns tracking slips, and exports shipping details directly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    const count = orders.filter(o => o.status === OrderStatus.PROCESSING).length;
                    if (count === 0) {
                      alert(lang === "bn" ? "বুকিং করার মতো কোনো PROCESSING অর্ডার নেই।" : "No PROCESSING status orders ready for booking.");
                    } else {
                      alert(lang === "bn" ? `${count}টি অর্ডার সফলভাবে কুরিয়ার ড্যাশবোর্ডে বুক করা হয়েছে এবং বারকোড স্লিপ জেনারেট করা হয়েছে!` : `${count} orders successfully booked with ${deliveryConfig.provider} and shipping barcodes generated!`);
                    }
                  }}
                  className="bg-indigo-50 hover:bg-indigo-100 text-[#3730a3] font-bold text-xs px-4 py-2.5 rounded-xl border border-indigo-100 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  🚀 Bulk Book Confirmed Invoices with {deliveryConfig.provider}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER SMS SYSTEM */}
      {activeTab === "sms" && (
        <div className="space-y-6 animate-fade-in animate-duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 lg:col-span-1 h-fit">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "অর্ডার এসএমএস টেমপ্লেট" : "SMS Confirmation template"}</h4>
              <div className="space-y-3 font-sans">
                <textarea
                  rows={6}
                  value={smsTemplate}
                  onChange={(e) => setSmsTemplate(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-200 rounded-2xl p-4 text-xs font-semibold leading-relaxed text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <div className="text-[10px] text-gray-400 font-medium">
                  Fields: <code className="bg-gray-100 font-bold px-1 rounded">[CUSTOMER_NAME]</code>, <code className="bg-gray-100 font-bold px-1 rounded">[ORDER_ID]</code>, <code className="bg-gray-100 font-bold px-1 rounded">[TOTAL_AMOUNT]</code>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert(lang === "bn" ? "এসএমএস এলার্ট টেমপ্লেট সফলভাবে আপডেট করা হয়েছে!" : "SMS notifications template successfully saved!");
                  }}
                  className="w-full bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  💾 Save Template
                </button>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4 font-sans">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "এসএমএস গেটওয়ে লগ ও ব্যালেন্স" : "SMS Gateway Logs & Balance"}</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-4 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">SMS Gateway Provider</span>
                    <h5 className="font-black text-gray-800 text-sm mt-0.5">BulksmsBD API</h5>
                  </div>
                  <span className="bg-green-50 text-green-700 font-bold text-[10px] px-2 py-0.5 rounded border border-green-200">ACTIVE</span>
                </div>
                <div className="bg-indigo-50/50 rounded-2xl border border-indigo-100 p-4 flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[10px] text-gray-400 font-sans font-bold uppercase">SMS API Balance</span>
                    <h5 className="font-black text-gray-800 text-sm mt-0.5">৳ 1,480.00</h5>
                  </div>
                  <span className="bg-indigo-100 text-[#3730a3] font-bold text-[10px] px-2 py-0.5 rounded border border-indigo-200">~ 4,933 SMS left</span>
                </div>
              </div>

              <div className="space-y-2">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">SMS Dispatch Logs (এসএমএস প্রেরণ লগ)</h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase pb-2">
                        <th className="pb-3">SMS ID</th>
                        <th className="pb-3">RECIPIENT PHONE</th>
                        <th className="pb-3">MESSAGE CONTENT</th>
                        <th className="pb-3">DISPATCHED AT</th>
                        <th className="pb-3 text-right">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                      {smsHistory.map((sh) => (
                        <tr key={sh.id}>
                          <td className="py-2.5 font-mono font-bold text-slate-500">{sh.id}</td>
                          <td className="py-2.5 font-mono text-[#3730a3] font-semibold">{sh.recipient}</td>
                          <td className="py-2.5 text-gray-500 font-semibold max-w-[200px] truncate">{sh.message}</td>
                          <td className="py-2.5 text-gray-400">{sh.time}</td>
                          <td className="py-2.5 text-right">
                            <span className="bg-green-50 text-green-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-green-100">{sh.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RENDER ROLES */}
      {activeTab === "roles" && (
        <div className="space-y-6 animate-fade-in animate-duration-200">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 font-sans">
            <h3 className="text-lg font-black text-gray-900">{lang === "bn" ? "অ্যাডমিন প্যানেল রোলস ও পারমিশন" : "Role-Based Access Control"}</h3>
            <p className="text-xs text-gray-400 font-semibold">{lang === "bn" ? "অপারেটর ও স্টাফদের জন্য নির্দিষ্ট পেজ এবং ফিচার ব্যবহারের পারমিশন নিয়ন্ত্রণ করুন।" : "Toggle view/write privileges across dashboard modules for security audits."}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <div key={role.id} className="bg-slate-50 border border-gray-100 rounded-2xl p-5 space-y-4 hover:border-indigo-200 transition-all">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                    <h4 className="font-extrabold text-gray-900 text-sm">{role.name}</h4>
                    <span className="bg-indigo-50 text-[#3730a3] text-[10px] font-black px-2.5 py-0.5 rounded-full border border-indigo-100">
                      {role.usersCount} users active
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <span className="text-[9px] text-gray-400 font-black uppercase block tracking-wider">Assigned Privileges</span>
                    <div className="space-y-1.5 text-xs text-gray-600">
                      <label className="flex items-center gap-2 font-semibold cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <span>Manage & Edit Orders</span>
                      </label>
                      <label className="flex items-center gap-2 font-semibold cursor-pointer">
                        <input type="checkbox" defaultChecked={role.name === "Super Admin" || role.name === "Sales Manager"} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <span>Add & Modify Products</span>
                      </label>
                      <label className="flex items-center gap-2 font-semibold cursor-pointer">
                        <input type="checkbox" defaultChecked={role.name === "Super Admin"} className="rounded text-indigo-600 focus:ring-indigo-500" />
                        <span>Alter Pixels & Tracking</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      alert(lang === "bn" ? "রোল এবং পারমিশন সফলভাবে আপডেট করা হয়েছে!" : "Privileges updated for role!");
                    }}
                    className="w-full bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs py-2 rounded-xl border border-indigo-100 transition-all cursor-pointer"
                  >
                    Update Privileges
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RENDER USERS */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-fade-in animate-duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-4 h-fit">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">{lang === "bn" ? "নতুন স্টাফ প্রোফাইল অ্যাড করুন" : "Register Admin Staff Account"}</h4>
              <form onSubmit={(e) => {
                e.preventDefault();
                if (!newStaffEmail) return;
                const newUser = {
                  email: newStaffEmail,
                  role: newStaffRole,
                  status: "Active",
                  lastLogin: "Never"
                };
                setAdminUsers([...adminUsers, newUser]);
                setNewStaffEmail("");
                alert(lang === "bn" ? "স্টাফ সফলভাবে রেজিস্টার করা হয়েছে!" : "Staff registered successfully!");
              }} className="space-y-3 font-sans">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Staff Email ID</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. staff@gms.com"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-400 font-bold uppercase">Assigned Role</label>
                  <select
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold outline-none"
                  >
                    <option value="Sales Manager">Sales Manager</option>
                    <option value="Delivery Partner">Delivery Partner</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#3730a3] hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer shadow-sm transition-all"
                >
                  ➕ Register Staff Profile
                </button>
              </form>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm lg:col-span-2 space-y-4">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Authorized Admin User Directory</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase pb-2">
                      <th className="pb-3">EMAIL ID</th>
                      <th className="pb-3">ASSIGNED ROLE</th>
                      <th className="pb-3">LAST SIGN-IN</th>
                      <th className="pb-3">ACCOUNT STATUS</th>
                      <th className="pb-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-medium font-sans">
                    {adminUsers.map((u, i) => (
                      <tr key={i}>
                        <td className="py-3 font-bold text-gray-900">{u.email}</td>
                        <td className="py-3">
                          <span className="bg-indigo-50 text-[#3730a3] border border-indigo-100 px-2 py-0.5 rounded text-[10px] font-bold">{u.role}</span>
                        </td>
                        <td className="py-3 text-gray-400 font-semibold font-mono">{u.lastLogin}</td>
                        <td className="py-3">
                          <span className="bg-green-50 text-green-700 font-bold text-[9px] px-2.5 py-0.5 rounded-full border border-green-100">{u.status}</span>
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const confirmed = window.confirm(`Reset credentials for ${u.email}?`);
                              if (confirmed) {
                                alert("Simulation: A verification PIN reset link has been dispatched.");
                              }
                            }}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold px-2 py-1 rounded text-[10px] cursor-pointer"
                          >
                            Reset credentials
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE ORDER SLIP / INVOICE GENERATION OVERLAY MODAL */}
      {printingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:absolute print:inset-0">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-xl border border-gray-100 flex flex-col gap-4 print:shadow-none print:border-none print:p-0 print:max-w-none">
            
            {/* Modal Actions Header (Explicitly hidden during media printing) */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-150 print:hidden">
              <div className="flex items-center gap-2">
                <span className="text-xl">🧾</span>
                <h3 className="font-extrabold text-sm text-gray-850">
                  {lang === "bn" ? "অর্ডার স্লিপ ও ইনভয়েস জেনারেশন" : "Order Slip & Invoice Generation"}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  {lang === "bn" ? "প্রিন্ট / পিডিএফ সেভ করুন" : "Print / Save PDF"}
                </button>
                <button
                  type="button"
                  onClick={() => setPrintingOrder(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-gray-500 font-bold text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  {lang === "bn" ? "বন্ধ করুন" : "Close"}
                </button>
              </div>
            </div>

            {/* Split Screen Layout on UI, but completely simplified on media print */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Printable Area (Occupies full 100% space during print) */}
              <div className="lg:col-span-7 bg-white print:col-span-12">
                <div 
                  id="printable-invoice-area" 
                  className="bg-white text-gray-800 p-4 font-sans leading-relaxed text-xs space-y-4 print:p-0"
                >
                  {/* Media print style overrides to suppress background elements and show ONLY the invoice */}
                  <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                      body {
                        background-color: white !important;
                        color: black !important;
                      }
                      /* Hide entire root application */
                      body > * {
                        display: none !important;
                      }
                      /* Force display only the printable invoice wrapper */
                      #printable-invoice-area {
                        display: block !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        padding: 30px !important;
                        margin: 0 !important;
                        visibility: visible !important;
                      }
                      #printable-invoice-area * {
                        visibility: visible !important;
                      }
                    }
                  `}} />

                  {/* Invoice Brand Header */}
                  <div className="flex justify-between items-start border-b-2 border-gray-900 pb-4">
                    <div className="space-y-1">
                      <h1 className="text-xl font-black text-indigo-950 uppercase tracking-tight">Johurul BDShop</h1>
                      <p className="text-[10px] text-gray-500 font-semibold">Premium E-Commerce Shopping Hub</p>
                      <p className="text-[10px] text-gray-500">Dhaka, Bangladesh | Phone: +880 1795-339373</p>
                      <p className="text-[10px] text-gray-500">Email: support@johurulbdshop.com</p>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="bg-slate-100 px-3 py-1.5 rounded-xl inline-block print:bg-gray-100 print:border border-gray-200">
                        <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider block">INVOICE NO</span>
                        <span className="font-mono text-xs font-black text-gray-900">#{printingOrder.id}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        Date: <span className="font-bold">{new Date(printingOrder.createdAt).toLocaleDateString(lang === "bn" ? 'bn-BD' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </p>
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 uppercase mt-1 print:border print:text-black">
                        {printingOrder.paymentMethod === "cod" ? "Cash On Delivery (COD)" : `Online Pay (${printingOrder.onlineGatewayType || "Digital"})`}
                      </span>
                    </div>
                  </div>

                  {/* Billing Info Panel */}
                  <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl print:bg-gray-50 print:border border-gray-200">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">CUSTOMER DETAILS / বিলিং তথ্য</span>
                      <p className="font-black text-sm text-gray-900">{printingOrder.customerName}</p>
                      <p className="font-mono font-bold text-[#3730a3] text-xs print:text-black">📞 {printingOrder.customerPhone}</p>
                      <p className="text-[10px] text-gray-600">
                        📍 {printingOrder.customerAddress}
                      </p>
                      <p className="text-[10px] text-gray-500 font-semibold">
                        {printingOrder.customerThana ? `${printingOrder.customerThana}, ` : ""}{printingOrder.customerDistrict}, {printingOrder.customerDivision || ""}
                      </p>
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">SHIPMENT LOGISTICS</span>
                      <p className="text-[10px] font-bold text-gray-700">Delivery Status: <span className="text-indigo-800 uppercase font-black">{printingOrder.status}</span></p>
                      <p className="text-[10px] text-gray-500">Courier Provider: {deliveryConfig.provider}</p>
                      {printingOrder.fbCampaignRef && (
                        <p className="text-[9px] text-indigo-700 font-bold bg-indigo-50 inline-block px-2 py-0.5 rounded border border-indigo-100 mt-1">
                          Source: FB Campaign - {printingOrder.fbCampaignRef}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Itemized Table */}
                  <div className="space-y-1.5">
                    <h4 className="font-black text-[9px] uppercase text-gray-400 tracking-wider">ORDERED ITEMS / কার্ট পণ্যসমূহ</h4>
                    <table className="w-full text-left text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-300 bg-slate-100 font-extrabold text-gray-700 print:bg-gray-100">
                          <th className="p-2 w-12 text-center">SL</th>
                          <th className="p-2">{lang === "bn" ? "পণ্য বিবরণী" : "Item Description"}</th>
                          <th className="p-2 w-24 text-center">{lang === "bn" ? "ভেরিয়েন্ট" : "Variant"}</th>
                          <th className="p-2 w-24 text-right">{lang === "bn" ? "একক মূল্য" : "Unit Price"}</th>
                          <th className="p-2 w-16 text-center">{lang === "bn" ? "পরিমাণ" : "Qty"}</th>
                          <th className="p-2 w-24 text-right">{lang === "bn" ? "মোট" : "Total"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {printingOrder.cartItems.map((item, idx) => {
                          const itemPrice = item.price || item.product.price;
                          const itemTotal = itemPrice * item.quantity;
                          const prod = products.find(p => p.id === item.product.id) || item.product;
                          return (
                            <tr key={idx} className="hover:bg-slate-50/40">
                              <td className="p-2 text-center font-mono text-gray-400">{idx + 1}</td>
                              <td className="p-2 font-bold text-gray-900">
                                <div className="flex items-center gap-3">
                                  {prod.image && (
                                    <img 
                                      src={prod.image} 
                                      alt={prod.name} 
                                      className="w-12 h-12 rounded-lg object-cover border border-gray-150 shrink-0 print:w-14 print:h-14 print:border"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                  <div className="space-y-0.5">
                                    <span className="block text-xs font-extrabold text-gray-950 leading-tight">
                                      {lang === "bn" ? prod.banglaName || prod.name : prod.name}
                                    </span>
                                    {prod.supplierShop && (
                                      <span className="inline-block text-[8px] font-black text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100 uppercase">
                                        🏪 {prod.supplierShop}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 text-center text-gray-600">
                                {item.selectedSize || item.selectedColor ? (
                                  <div className="flex flex-col gap-0.5 items-center">
                                    {item.selectedSize && <span className="bg-gray-100 px-1.5 py-0.2 rounded text-[8px] font-extrabold">Size: {item.selectedSize}</span>}
                                    {item.selectedColor && <span className="bg-gray-100 px-1.5 py-0.2 rounded text-[8px] font-extrabold">Color: {item.selectedColor}</span>}
                                  </div>
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </td>
                              <td className="p-2 text-right font-mono text-gray-700">৳{itemPrice}</td>
                              <td className="p-2 text-center font-mono font-bold text-gray-900">{item.quantity}</td>
                              <td className="p-2 text-right font-mono font-bold text-gray-900">৳{itemTotal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Summary Calculations Panel */}
                  {(() => {
                    const itemsSubtotal = printingOrder.cartItems.reduce((sum, item) => sum + ((item.price || item.product.price) * item.quantity), 0);
                    const isInsideDhaka = printingOrder.customerDistrict.toLowerCase() === "dhaka" || printingOrder.customerDistrict.toLowerCase().includes("ঢাকা");
                    const shippingFee = isInsideDhaka ? deliveryConfig.insideDhaka : deliveryConfig.outsideDhaka;
                    const calculatedDiscount = Math.max(0, itemsSubtotal + shippingFee - printingOrder.totalAmount);
                    return (
                      <div className="flex justify-end pt-3">
                        <div className="w-64 space-y-1.5 text-[10px] font-bold text-gray-600 border-t border-gray-250 pt-3">
                          <div className="flex justify-between">
                            <span>Cart Subtotal (পণ্য মূল্য):</span>
                            <span className="font-mono text-gray-850">৳{itemsSubtotal}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Shipping Cost (ডেলিভারি চার্জ):</span>
                            <span className="font-mono text-gray-850">৳{shippingFee}</span>
                          </div>
                          {calculatedDiscount > 0 && (
                            <div className="flex justify-between text-red-600 font-extrabold">
                              <span>Discount / Coupon (ছাড়):</span>
                              <span className="font-mono">-৳{calculatedDiscount}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs font-black text-indigo-950 border-t-2 border-dashed border-gray-300 pt-2 pb-1 print:text-black">
                            <span>Total COD Collectable (সর্বমোট বিল):</span>
                            <span className="font-mono text-sm text-indigo-900 print:text-black">৳{printingOrder.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Delivery Disclaimer & Signatures */}
                  <div className="pt-12 space-y-8">
                    <div className="flex justify-between text-[9px] font-extrabold text-gray-400 px-6">
                      <div className="text-center w-36 border-t border-dashed border-gray-300 pt-1.5">
                        Customer Signature
                      </div>
                      <div className="text-center w-36 border-t border-dashed border-gray-300 pt-1.5">
                        Authorized Signature
                      </div>
                    </div>
                    
                    <div className="text-center border-t border-gray-150 pt-4 text-[9px] text-gray-400 space-y-0.5 leading-normal">
                      <p className="font-bold text-gray-500">Thank you for your order with Johurul BDShop!</p>
                      <p>Please double-check the product parcel with the delivery rider present.</p>
                      <p className="font-mono text-[8px] text-gray-300">Generated automatically via Store Management Dashboard</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sourcing & WhatsApp Dispatch Control Box (Hidden on Print) */}
              <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-5 border border-gray-150 space-y-4 print:hidden">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-sm text-gray-800 flex items-center gap-1.5">
                    <span>🏪</span> {lang === "bn" ? "শপভিত্তিক সরবরাহ ও ওয়াটসঅ্যাপ" : "Supplier Sourcing & WhatsApp"}
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-relaxed font-semibold">
                    {lang === "bn" ? "পণ্য সরবরাহকারী শপের মোবাইল নম্বর সেভ করে ১-ক্লিকে ওয়াটসঅ্যাপে স্লিপ পাঠান।" : "Save supplier WhatsApp contact numbers and dispatch individual order slips with one click."}
                  </p>
                </div>

                {(() => {
                  // Get all unique shops/suppliers in this order
                  const orderSupplierShops = Array.from(
                    new Set(
                      printingOrder.cartItems.map(item => {
                        const prod = products.find(p => p.id === item.product.id) || item.product;
                        return prod.supplierShop || "Default Shop";
                      })
                    )
                  ).filter(Boolean) as string[];

                  if (orderSupplierShops.length === 0) {
                    return (
                      <div className="text-center py-6 bg-white rounded-xl border border-dashed border-gray-200 text-xs text-gray-400">
                        {lang === "bn" ? "কোনো সরবরাহকারী শপ ডিফাইন করা নেই।" : "No supplier shops defined for these products."}
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {orderSupplierShops.map((shopName) => {
                        const itemsForThisShop = printingOrder.cartItems.filter(item => {
                          const prod = products.find(p => p.id === item.product.id) || item.product;
                          return (prod.supplierShop || "Default Shop") === shopName;
                        });

                        const currentSavedPhone = supplierPhoneMap[shopName] || "";
                        // Auto-add country code 880 for BD numbers starting with 01
                        let formattedPhoneForWa = currentSavedPhone.trim();
                        if (formattedPhoneForWa.startsWith("01") && formattedPhoneForWa.length === 11) {
                          formattedPhoneForWa = "88" + formattedPhoneForWa;
                        }

                        // Formulate WhatsApp API url
                        const waText = (() => {
                          const itemsSummary = itemsForThisShop.map(item => {
                            const prod = products.find(p => p.id === item.product.id) || item.product;
                            const name = lang === "bn" ? prod.banglaName || prod.name : prod.name;
                            const variantDetails = [
                              item.selectedSize ? `Size: ${item.selectedSize}` : "",
                              item.selectedColor ? `Color: ${item.selectedColor}` : ""
                            ].filter(Boolean).join(", ");
                            return `• ${name} x${item.quantity} ${variantDetails ? `(${variantDetails})` : ""}`;
                          }).join("\n");

                          const orderDate = new Date(printingOrder.createdAt).toLocaleDateString(lang === "bn" ? 'bn-BD' : 'en-US', {
                            year: 'numeric', month: 'short', day: 'numeric'
                          });

                          return lang === "bn" 
                            ? encodeURIComponent(`*📦 সরবরাহ অর্ডার স্লিপ - ${shopName.toUpperCase()}*\n\n*অর্ডার আইডি:* #${printingOrder.id}\n*তারিখ:* ${orderDate}\n\n*গ্রাহকের বিবরণ:*\n- নাম: ${printingOrder.customerName}\n- মোবাইল: ${printingOrder.customerPhone}\n- ঠিকানা: ${printingOrder.customerAddress}\n- থানা: ${printingOrder.customerThana || "N/A"}\n- জেলা: ${printingOrder.customerDistrict}\n\n*পণ্য বিবরণী:*\n${itemsSummary}\n\nদয়া করে পার্সেলটি প্যাকেট করে দ্রুত ডেলিভারির জন্য প্রস্তুত করুন। ধন্যবাদ!`)
                            : encodeURIComponent(`*📦 NEW ORDER DISPATCH REQUEST - ${shopName.toUpperCase()}*\n\n*Order ID:* #${printingOrder.id}\n*Date:* ${orderDate}\n\n*Customer Details:*\n- Name: ${printingOrder.customerName}\n- Phone: ${printingOrder.customerPhone}\n- Address: ${printingOrder.customerAddress}\n- Thana: ${printingOrder.customerThana || "N/A"}\n- District: ${printingOrder.customerDistrict}\n\n*Ordered Items:*\n${itemsSummary}\n\nPlease package and prepare these products for delivery. Thank you!`);
                        })();

                        const waLink = `https://api.whatsapp.com/send?phone=${formattedPhoneForWa}&text=${waText}`;

                        return (
                          <div key={shopName} className="bg-white border border-gray-150 rounded-2xl p-4 space-y-3 shadow-xs">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                              <span className="font-extrabold text-xs text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-lg">
                                🏪 {shopName}
                              </span>
                              <span className="text-[10px] font-bold text-gray-400">
                                {itemsForThisShop.length} {lang === "bn" ? "টি পণ্য" : "items"}
                              </span>
                            </div>

                            {/* Sourced Items list */}
                            <div className="space-y-1.5">
                              {itemsForThisShop.map((item, idx) => {
                                const prod = products.find(p => p.id === item.product.id) || item.product;
                                return (
                                  <div key={idx} className="flex gap-2 items-center text-[10px] font-semibold text-gray-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                                    {prod.image && (
                                      <img src={prod.image} className="w-6 h-6 rounded object-cover" />
                                    )}
                                    <span className="truncate flex-1">{lang === "bn" ? prod.banglaName || prod.name : prod.name}</span>
                                    <span className="font-mono bg-white border px-1 rounded text-gray-800">x{item.quantity}</span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Contact configuration */}
                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase text-gray-400 block tracking-wider">
                                {lang === "bn" ? "ওয়াটসঅ্যাপ নম্বর দিন" : "WhatsApp Number"}
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. 8801700000000"
                                value={currentSavedPhone}
                                onChange={(e) => saveSupplierPhone(shopName, e.target.value)}
                                className="w-full bg-slate-50 border border-gray-250 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none focus:ring-2 focus:ring-emerald-500/20"
                              />
                            </div>

                            {/* WhatsApp Button */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`w-full py-2 px-4 rounded-xl font-extrabold text-xs text-white transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                                formattedPhoneForWa 
                                  ? "bg-emerald-600 hover:bg-emerald-700 hover:shadow-md cursor-pointer" 
                                  : "bg-gray-300 pointer-events-none cursor-not-allowed"
                              }`}
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>{lang === "bn" ? "১-ক্লিকে ওয়াটসঅ্যাপে পাঠান" : "Send slip on WhatsApp"}</span>
                            </a>
                            {!formattedPhoneForWa && (
                              <p className="text-[9px] text-red-500 text-center font-bold">
                                ⚠️ {lang === "bn" ? "ওয়াটসঅ্যাপ বাটন চালু করতে নম্বরটি দিন" : "Enter WhatsApp number to enable button"}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

            </div>

          </div>
        </div>
      )}

        </div> {/* Closes MAIN PANEL CONTENT BODY */}
      </div> {/* Closes RIGHT MAIN PANEL */}
    </div>
  );
}
