import React, { useState, useEffect } from "react";
import { 
  User, 
  MapPin, 
  Package, 
  Edit3, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Truck, 
  ChevronRight, 
  Phone, 
  Mail, 
  Heart, 
  CheckCircle2, 
  Map, 
  ExternalLink,
  ShieldAlert,
  ShoppingBag
} from "lucide-react";
import { Order, OrderStatus, Product } from "../types";

interface CustomerDashboardProps {
  orders: Order[];
  onCancelOrder?: (orderId: string) => void;
  lang: "bn" | "en";
  products: Product[];
  onSelectProduct: (product: Product) => void;
  setCurrentView: (view: "shop" | "track" | "campaign" | "admin" | "account") => void;
}

interface CustomerProfile {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  bio: string;
}

interface SavedAddress {
  id: string;
  label: "Home" | "Work" | "Other";
  customLabel?: string;
  name: string;
  phone: string;
  address: string;
  district: string;
  thana?: string;
  isDefault: boolean;
}

const PRESET_AVATARS = [
  "🧑‍💻", "👩‍💼", "🌟", "🔥", "⚡", "🛍️", "🦊", "🦁", "🐼", "👑"
];

export default function CustomerDashboard({
  orders,
  onCancelOrder,
  lang,
  products,
  onSelectProduct,
  setCurrentView
}: CustomerDashboardProps) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "addresses" | "orders">("profile");

  // Load / Save Profile
  const [profile, setProfile] = useState<CustomerProfile>(() => {
    const saved = localStorage.getItem("mystore_customer_profile");
    return saved ? JSON.parse(saved) : {
      name: "Tanjim Rahman",
      phone: "01795339373",
      email: "tanjim7862@gmail.com",
      avatar: "🧑‍💻",
      bio: "Dedicated online shopper loving high-quality original items."
    };
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState<CustomerProfile>({ ...profile });

  // Load / Save Addresses
  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem("mystore_customer_addresses");
    return saved ? JSON.parse(saved) : [
      {
        id: "addr-1",
        label: "Home",
        name: "Tanjim Rahman",
        phone: "01795339373",
        address: "House 45, Road 12, Sector 3, Uttara",
        district: "Dhaka",
        thana: "Uttara",
        isDefault: true
      },
      {
        id: "addr-2",
        label: "Work",
        name: "Tanjim Rahman (Office)",
        phone: "01795339373",
        address: "Dhaka Trade Center, 11th Floor, Kawran Bazar",
        district: "Dhaka",
        thana: "Tejgaon",
        isDefault: false
      }
    ];
  });

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, "id">>({
    label: "Home",
    customLabel: "",
    name: "",
    phone: "",
    address: "",
    district: "Dhaka",
    thana: "",
    isDefault: false
  });

  // Persist Profile and Addresses to localStorage on change
  useEffect(() => {
    localStorage.setItem("mystore_customer_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("mystore_customer_addresses", JSON.stringify(addresses));
  }, [addresses]);

  // Find user orders matching their phone number
  const userOrders = orders.filter(
    (order) => order.customerPhone.trim().replace(/^(88)?0/, "") === profile.phone.trim().replace(/^(88)?0/, "")
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculations for Gamified Customer Tiers
  const totalSpent = userOrders
    .filter(order => order.status !== OrderStatus.CANCELLED)
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const getTier = () => {
    if (totalSpent >= 20000) return { nameEn: "VIP Royal", nameBn: "ভিআইপি রয়েল", color: "from-amber-500 to-yellow-600", min: 20000 };
    if (totalSpent >= 8000) return { nameEn: "Gold Explorer", nameBn: "গোল্ড এক্সপ্লোরার", color: "from-indigo-500 to-indigo-700", min: 8000 };
    return { nameEn: "Silver Shopper", nameBn: "সিলভার শপার", color: "from-slate-500 to-slate-700", min: 0 };
  };

  const currentTier = getTier();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditingProfile(false);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: SavedAddress = {
      ...addressForm,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0 ? true : addressForm.isDefault
    };

    let updated = [...addresses];
    if (newAddr.isDefault) {
      updated = updated.map(addr => ({ ...addr, isDefault: false }));
    }
    updated.push(newAddr);
    setAddresses(updated);
    setIsAddingAddress(false);
    // Reset Form
    setAddressForm({
      label: "Home",
      customLabel: "",
      name: "",
      phone: "",
      address: "",
      district: "Dhaka",
      thana: "",
      isDefault: false
    });
  };

  const handleDeleteAddress = (id: string) => {
    const filter = addresses.filter(addr => addr.id !== id);
    // If we deleted the default one, pick the first remaining as default
    if (addresses.find(addr => addr.id === id)?.isDefault && filter.length > 0) {
      filter[0].isDefault = true;
    }
    setAddresses(filter);
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
  };

  // Pipeline configuration mapping
  const PIPELINE_STAGES: { status: OrderStatus; labelEn: string; labelBn: string; color: string; descEn: string; descBn: string; icon: string }[] = [
    { 
      status: OrderStatus.RECEIVED, 
      labelEn: "Received", 
      labelBn: "অর্ডার গৃহীত", 
      color: "indigo",
      descEn: "Order submitted and awaiting verification.",
      descBn: "আপনার অর্ডারটি গৃহীত হয়েছে এবং ভেরিফিকেশনের অপেক্ষায় আছে।",
      icon: "📥"
    },
    { 
      status: OrderStatus.PROCESSING, 
      labelEn: "Processing", 
      labelBn: "প্যাকেজিং হচ্ছে", 
      color: "amber",
      descEn: "We are packaging and quality checking your parcel.",
      descBn: "আপনার পণ্যটি গুণগত মান যাচাই করে প্যাকেজিং করা হচ্ছে।",
      icon: "⚙️"
    },
    { 
      status: OrderStatus.SHIPPED, 
      labelEn: "Shipped", 
      labelBn: "কুরিয়ারে পাঠানো হয়েছে", 
      color: "blue",
      descEn: "Handed over to the courier service.",
      descBn: "পণ্যটি সুন্দরবন/রেডেক্স কুরিয়ার সার্ভিসে হস্তান্তর করা হয়েছে।",
      icon: "🚚"
    },
    { 
      status: OrderStatus.OUT_FOR_DELIVERY, 
      labelEn: "Out for Delivery", 
      labelBn: "ডেলিভারি ম্যানের কাছে", 
      color: "orange",
      descEn: "The delivery rider is on the way to your door.",
      descBn: "ডেলিভারি ম্যান পণ্যটি নিয়ে আপনার ঠিকানার উদ্দেশ্যে রওনা হয়েছে।",
      icon: "🛵"
    },
    { 
      status: OrderStatus.DELIVERED, 
      labelEn: "Delivered", 
      labelBn: "ডেলিভারি সম্পন্ন", 
      color: "emerald",
      descEn: "Successfully delivered and payment completed.",
      descBn: "পণ্যটি কাস্টমারের নিকট সফলভাবে হস্তান্তর এবং পেমেন্ট সম্পন্ন হয়েছে।",
      icon: "✅"
    }
  ];

  // Helper to determine active index of stages
  const getStageIndex = (status: OrderStatus) => {
    return PIPELINE_STAGES.findIndex(stage => stage.status === status);
  };

  return (
    <div id="customer-dashboard-container" className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      
      {/* 1. Header Banner Card */}
      <div className="bg-gradient-to-r from-[#3730a3] via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        {/* Glow Effects */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl"></div>

        <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar Selector */}
            <div className="relative group">
              <div className="w-20 h-20 bg-white/10 rounded-full border-4 border-white/20 flex items-center justify-center text-4xl shadow-md transition-transform duration-300 group-hover:scale-105">
                {profile.avatar}
              </div>
              <button 
                onClick={() => {
                  setIsEditingProfile(true);
                  setActiveSubTab("profile");
                }}
                className="absolute -bottom-1 -right-1 p-1.5 bg-white text-[#3730a3] hover:bg-gray-50 rounded-full shadow-lg border border-gray-100 transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-black">{profile.name}</h2>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r ${currentTier.color} text-white shadow-xs`}>
                  👑 {lang === "bn" ? currentTier.nameBn : currentTier.nameEn}
                </span>
              </div>
              <p className="text-xs text-indigo-200 font-medium font-mono">{profile.phone} • {profile.email}</p>
              <p className="text-xs text-slate-300 italic max-w-md line-clamp-1">"{profile.bio}"</p>
            </div>
          </div>

          {/* Gamified stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 bg-white/5 backdrop-blur-xs border border-white/10 p-4 rounded-2xl w-full md:w-auto text-center">
            <div>
              <span className="block text-[10px] text-indigo-200 font-bold uppercase tracking-wider">
                {lang === "bn" ? "অর্ডার সংখ্যা" : "Orders"}
              </span>
              <span className="text-lg sm:text-xl font-black text-white">{userOrders.length}</span>
            </div>
            <div className="border-x border-white/10 px-3 sm:px-6">
              <span className="block text-[10px] text-indigo-200 font-bold uppercase tracking-wider">
                {lang === "bn" ? "মোট খরচ" : "Total Spent"}
              </span>
              <span className="text-lg sm:text-xl font-black text-amber-300 font-mono">৳{totalSpent}</span>
            </div>
            <div>
              <span className="block text-[10px] text-indigo-200 font-bold uppercase tracking-wider">
                {lang === "bn" ? "ঠিকানা সংখ্যা" : "Addresses"}
              </span>
              <span className="text-lg sm:text-xl font-black text-white">{addresses.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Sub Navigation Tabs */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl">
        <button
          onClick={() => {
            setActiveSubTab("profile");
            setIsEditingProfile(false);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === "profile"
              ? "bg-white text-[#3730a3] shadow-sm font-black"
              : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
          }`}
        >
          <User className="w-4 h-4" />
          <span>{lang === "bn" ? "আমার প্রোফাইল" : "Profile Settings"}</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab("addresses");
            setIsAddingAddress(false);
          }}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === "addresses"
              ? "bg-white text-[#3730a3] shadow-sm font-black"
              : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>{lang === "bn" ? "ঠিকানা বই" : "Address Book"}</span>
        </button>
        <button
          onClick={() => setActiveSubTab("orders")}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeSubTab === "orders"
              ? "bg-white text-[#3730a3] shadow-sm font-black"
              : "text-gray-600 hover:bg-white/50 hover:text-gray-900"
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="relative">
            {lang === "bn" ? "অর্ডার ট্র্যাকিং" : "Order Tracking"}
            {userOrders.some(o => o.status !== OrderStatus.DELIVERED && o.status !== OrderStatus.CANCELLED) && (
              <span className="absolute top-0 -right-2 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
            )}
          </span>
        </button>
      </div>

      {/* 3. Core Tab Content Panels */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xs">
        
        {/* ================= PROFILE TAB ================= */}
        {activeSubTab === "profile" && (
          <div className="space-y-6">
            {!isEditingProfile ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{lang === "bn" ? "প্রোফাইল তথ্য" : "Profile Details"}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{lang === "bn" ? "আপনার যোগাযোগের সাধারণ তথ্য" : "Your general contact preferences."}</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditForm({ ...profile });
                      setIsEditingProfile(true);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-black text-[#3730a3] hover:text-[#4338ca] border border-[#3730a3]/20 hover:border-[#3730a3]/50 px-3 py-1.5 rounded-xl transition-all cursor-pointer bg-[#3730a3]/5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{lang === "bn" ? "প্রোফাইল পরিবর্তন" : "Edit Profile"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal info items */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-gray-50 rounded-xl text-gray-500">
                        <User className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">{lang === "bn" ? "কাস্টমারের নাম" : "Full Name"}</span>
                        <p className="text-sm font-bold text-gray-800">{profile.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-gray-50 rounded-xl text-gray-500">
                        <Phone className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">{lang === "bn" ? "মোবাইল নম্বর" : "Phone Number"}</span>
                        <p className="text-sm font-bold text-gray-800 font-mono">{profile.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-2.5 bg-gray-50 rounded-xl text-gray-500">
                        <Mail className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">{lang === "bn" ? "ইমেইল এড্রেস" : "Email Address"}</span>
                        <p className="text-sm font-bold text-gray-800 font-mono">{profile.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Loyalty perks and context */}
                  <div className="bg-[#3730a3]/5 border border-[#3730a3]/10 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black text-[#3730a3] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {lang === "bn" ? "গ্রাহক ক্যাটাগরি ও অফার" : "Customer Tier & Benefits"}
                      </h4>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {lang === "bn" 
                          ? `আপনি একজন সম্মানিত "${currentTier.nameBn}"। বেশি বেশি শপিং করুন এবং রয়্যালটি প্রমোশনাল বোনাস লুফে নিন!` 
                          : `You are currently enjoying the perks of a "${currentTier.nameEn}" client. Shop more to upgrade privileges!`}
                      </p>
                    </div>

                    {/* Progress to next tier */}
                    {currentTier.min < 20000 && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500">
                          <span>{lang === "bn" ? "পরবর্তী ধাপ: গোল্ড/রয়েল" : "Next Tier Progress"}</span>
                          <span className="font-mono">৳{totalSpent} / ৳{currentTier.min === 0 ? "8,000" : "20,000"}</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-[#3730a3]" 
                            style={{ width: `${Math.min((totalSpent / (currentTier.min === 0 ? 8000 : 20000)) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="border-b border-gray-50 pb-4">
                  <h3 className="text-lg font-black text-gray-900">{lang === "bn" ? "প্রোফাইল পরিবর্তন করুন" : "Update Profile Information"}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "পুরো নাম" : "Full Name"}</label>
                      <input
                        type="text"
                        required
                        value={editForm.name}
                        onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "মোবাইল নম্বর" : "Phone Number"}</label>
                      <input
                        type="text"
                        required
                        value={editForm.phone}
                        onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800 font-mono"
                      />
                      <span className="text-[10px] text-gray-400 font-medium block">
                        {lang === "bn" ? "* কুরিয়ার এবং ট্র্যাকিং এর জন্য এই নম্বর ব্যবহৃত হবে।" : "* Will match your orders for tracking automatically."}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "ইমেইল এড্রেস" : "Email Address"}</label>
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Avatar selection */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "প্রোফাইল ইমোজি সিলেক্ট করুন" : "Choose Profile Emoji"}</label>
                      <div className="grid grid-cols-5 gap-2.5">
                        {PRESET_AVATARS.map((emoji) => (
                          <button
                            key={emoji}
                            type="button"
                            onClick={() => setEditForm(f => ({ ...f, avatar: emoji }))}
                            className={`w-11 h-11 text-xl flex items-center justify-center rounded-xl transition-all cursor-pointer border ${
                              editForm.avatar === emoji 
                                ? "bg-indigo-50 border-[#3730a3] scale-110 shadow-sm" 
                                : "bg-gray-50 hover:bg-gray-100 border-gray-200"
                            }`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "নিজের সম্পর্কে কিছু লিখুন" : "Short Bio"}</label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(f => ({ ...f, bio: e.target.value }))}
                        rows={2}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800 leading-relaxed"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-50 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider"
                  >
                    {lang === "bn" ? "বাতিল" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#3730a3] hover:bg-[#4338ca] text-white font-black py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {lang === "bn" ? "প্রোফাইল সেভ করুন" : "Save Settings"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ================= ADDRESSES TAB ================= */}
        {activeSubTab === "addresses" && (
          <div className="space-y-6">
            {!isAddingAddress ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-gray-900">{lang === "bn" ? "আমার সেভকৃত ঠিকানাসমূহ" : "Shipping Address Book"}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">{lang === "bn" ? "চেকআউট করার সময় ঠিকানাগুলো সহজে সিলেক্ট করতে পারবেন।" : "Addresses to select during checkout for fast purchase."}</p>
                  </div>
                  <button
                    onClick={() => setIsAddingAddress(true)}
                    className="inline-flex items-center gap-1 text-xs font-black text-[#3730a3] hover:text-[#4338ca] border border-[#3730a3]/20 hover:border-[#3730a3]/50 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer bg-[#3730a3]/5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{lang === "bn" ? "নতুন ঠিকানা যোগ করুন" : "Add Address"}</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-3">
                    <Map className="w-10 h-10 text-gray-300 mx-auto" />
                    <p className="text-sm font-bold text-gray-500">{lang === "bn" ? "আপনার কোনো ঠিকানা সেভ করা নেই!" : "No addresses saved yet!"}</p>
                    <button
                      onClick={() => setIsAddingAddress(true)}
                      className="text-xs bg-[#3730a3] text-white hover:bg-[#4338ca] px-4 py-2 rounded-xl font-bold cursor-pointer transition-all"
                    >
                      {lang === "bn" ? "প্রথম ঠিকানা যোগ করুন" : "Add Your First Address"}
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div 
                        key={addr.id}
                        className={`border rounded-2xl p-5 space-y-4 relative transition-all ${
                          addr.isDefault 
                            ? "border-[#3730a3] bg-indigo-50/5 shadow-sm" 
                            : "border-gray-100 hover:border-gray-200 bg-white"
                        }`}
                      >
                        {/* Address Label Header */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                              addr.label === "Home" 
                                ? "bg-[#3730a3]/10 text-[#3730a3]" 
                                : addr.label === "Work" 
                                  ? "bg-purple-100 text-purple-700" 
                                  : "bg-slate-100 text-slate-700"
                            }`}>
                              {addr.label === "Home" ? (lang === "bn" ? "🏠 বাসা" : "Home") : addr.label === "Work" ? (lang === "bn" ? "💼 অফিস" : "Work") : (lang === "bn" ? "📍 অন্যান্য" : "Other")}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                {lang === "bn" ? "ডিফল্ট" : "Default"}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {!addr.isDefault && (
                              <button
                                onClick={() => handleSetDefaultAddress(addr.id)}
                                className="text-[10px] font-bold text-gray-400 hover:text-[#3730a3] px-2 py-1 transition-all cursor-pointer"
                              >
                                {lang === "bn" ? "ডিফল্ট করুন" : "Set Default"}
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Address Details */}
                        <div className="space-y-1.5 text-xs">
                          <p className="font-bold text-gray-800">{addr.name}</p>
                          <p className="text-gray-500 font-mono text-[11px] flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            {addr.phone}
                          </p>
                          <p className="text-gray-600 font-medium leading-relaxed flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#3730a3] shrink-0 mt-0.5" />
                            <span>
                              {addr.address}, {addr.thana ? `${addr.thana}, ` : ""}{addr.district}
                            </span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleAddAddress} className="space-y-6">
                <div className="border-b border-gray-50 pb-4">
                  <h3 className="text-lg font-black text-gray-900">{lang === "bn" ? "নতুন শিপিং ঠিকানা" : "Add New Shipping Address"}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "ঠিকানার নাম / লেবেল" : "Address Label"}</label>
                    <div className="flex gap-2.5">
                      {(["Home", "Work", "Other"] as const).map((lbl) => (
                        <button
                          key={lbl}
                          type="button"
                          onClick={() => setAddressForm(f => ({ ...f, label: lbl }))}
                          className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            addressForm.label === lbl 
                              ? "bg-indigo-50 border-[#3730a3] text-[#3730a3] font-black" 
                              : "bg-white hover:bg-gray-50 border-gray-200 text-gray-600"
                          }`}
                        >
                          {lbl === "Home" ? "🏠 Home" : lbl === "Work" ? "💼 Work" : "📍 Other"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "প্রাপকের নাম" : "Recipient's Name"}</label>
                    <input
                      type="text"
                      required
                      value={addressForm.name}
                      onChange={(e) => setAddressForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="e.g. Tanjim Rahman"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "প্রাপকের মোবাইল নম্বর" : "Recipient's Phone"}</label>
                    <input
                      type="text"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="e.g. 01795339373"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "জেলা" : "District"}</label>
                      <input
                        type="text"
                        required
                        value={addressForm.district}
                        onChange={(e) => setAddressForm(f => ({ ...f, district: e.target.value }))}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "থানা" : "Thana / Area"}</label>
                      <input
                        type="text"
                        value={addressForm.thana}
                        onChange={(e) => setAddressForm(f => ({ ...f, thana: e.target.value }))}
                        placeholder="e.g. Uttara"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">{lang === "bn" ? "বিস্তারিত ঠিকানা" : "Detailed Street Address"}</label>
                    <input
                      type="text"
                      required
                      value={addressForm.address}
                      onChange={(e) => setAddressForm(f => ({ ...f, address: e.target.value }))}
                      placeholder="e.g. House 45, Road 12, Sector 3"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-sm text-gray-800"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2 md:col-span-2">
                    <input
                      type="checkbox"
                      id="is-default-addr"
                      checked={addressForm.isDefault}
                      onChange={(e) => setAddressForm(f => ({ ...f, isDefault: e.target.checked }))}
                      className="w-4 h-4 text-[#3730a3] border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <label htmlFor="is-default-addr" className="text-xs text-gray-500 font-bold cursor-pointer select-none">
                      {lang === "bn" ? "এটি আমার ডিফল্ট শিপিং ঠিকানা হিসেবে সেট করুন" : "Set as primary default delivery address"}
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-50 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAddingAddress(false)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl transition-all cursor-pointer text-xs uppercase tracking-wider"
                  >
                    {lang === "bn" ? "বাতিল" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#3730a3] hover:bg-[#4338ca] text-white font-black py-3 px-8 rounded-xl transition-all cursor-pointer shadow-md text-xs uppercase tracking-wider hover:scale-[1.01] active:scale-[0.99]"
                  >
                    {lang === "bn" ? "ঠিকানা সেভ করুন" : "Save Address"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ================= ORDERS / TRACKING TAB ================= */}
        {activeSubTab === "orders" && (
          <div className="space-y-6">
            <div className="border-b border-gray-50 pb-4">
              <h3 className="text-lg font-black text-gray-900">{lang === "bn" ? "আমার অর্ডার হিস্ট্রি এবং ট্র্যাকিং" : "My Orders & Tracking Pipeline"}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {lang === "bn" 
                  ? `আপনার প্রোফাইলের মোবাইল নম্বর (${profile.phone}) মিল রেখে কাস্টম অর্ডারের তালিকা দেখতে পাচ্ছেন।` 
                  : `Showing live pipeline status for purchase receipts corresponding to ${profile.phone}.`}
              </p>
            </div>

            {userOrders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200 space-y-4">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-gray-500">
                  {lang === "bn" ? `আপনার এই নম্বরে (${profile.phone}) এখনো কোনো অর্ডার পাওয়া যায়নি!` : "No matching order logs registered for this profile yet!"}
                </p>
                <button
                  onClick={() => setCurrentView("shop")}
                  className="text-xs bg-[#3730a3] text-white hover:bg-[#4338ca] px-5 py-3 rounded-xl font-black uppercase tracking-wider cursor-pointer transition-all shadow-md"
                >
                  {lang === "bn" ? "প্রোডাক্ট কিনুন" : "Start Shopping Now"}
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {userOrders.map((order) => {
                  const currentStageIdx = getStageIndex(order.status);
                  const isCancelled = order.status === OrderStatus.CANCELLED;

                  return (
                    <div 
                      key={order.id} 
                      className="border border-gray-100 rounded-3xl p-5 sm:p-6 bg-white shadow-xs hover:shadow-md transition-all space-y-5"
                    >
                      {/* Order Core Meta Header */}
                      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 p-3 sm:px-4 sm:py-3.5 rounded-2xl">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">{lang === "bn" ? "অর্ডার আইডি (ORDER ID)" : "ORDER IDENTIFICATION"}</span>
                          <span className="text-xs font-mono font-black text-[#3730a3] block">{order.id}</span>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">{lang === "bn" ? "অর্ডারের তারিখ" : "ORDER DATE"}</span>
                          <span className="text-xs font-bold text-gray-600 block">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">{lang === "bn" ? "সর্বমোট বিল" : "TOTAL AMOUNT"}</span>
                          <span className="text-sm font-extrabold text-[#3730a3] block font-mono">৳{order.totalAmount}</span>
                        </div>

                        {/* Status tag */}
                        <div>
                          {isCancelled ? (
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                              ❌ {lang === "bn" ? "বাতিল হয়েছে" : "Cancelled"}
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100 animate-pulse">
                              ⚡ {lang === "bn" ? order.status : order.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Items Ordered List */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">{lang === "bn" ? "অর্ডারকৃত পণ্যসমূহ" : "Purchased Line Items"}</h4>
                        <div className="divide-y divide-gray-50">
                          {order.cartItems.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 py-2">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name} 
                                className="w-9 h-9 rounded-lg object-cover border border-gray-100 bg-gray-50 cursor-pointer"
                                onClick={() => onSelectProduct(item.product)}
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <p 
                                  className="text-xs font-bold text-gray-800 truncate hover:text-[#3730a3] cursor-pointer"
                                  onClick={() => onSelectProduct(item.product)}
                                >
                                  {lang === "bn" ? item.product.banglaName || item.product.name : item.product.name}
                                </p>
                                <p className="text-[10px] text-gray-400 font-semibold font-mono">
                                  {item.selectedSize ? `${lang === "bn" ? "সাইজ: " : "Size: "}${item.selectedSize}` : ""}
                                  {item.selectedColor ? ` • ${lang === "bn" ? "কালার: " : "Color: "}${item.selectedColor}` : ""}
                                </p>
                              </div>
                              <div className="text-right text-xs font-semibold text-gray-600">
                                {item.quantity} x ৳{item.price || item.product.price}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Live Pipeline Status Progress Pipeline */}
                      {!isCancelled && (
                        <div className="space-y-5 pt-3 border-t border-gray-50">
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">
                            {lang === "bn" ? "লাইভ ডেলিভারি ট্র্যাকিং পাইপলাইন" : "Live Logistics Status Pipeline"}
                          </h4>
                          
                          {/* Horizontal Timeline Pipeline */}
                          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-2">
                            {/* Connector Line for Desktop */}
                            <div className="hidden md:block absolute top-[14px] left-8 right-8 h-1 bg-gray-200 z-0">
                              <div 
                                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                                style={{ width: `${(currentStageIdx / (PIPELINE_STAGES.length - 1)) * 100}%` }}
                              />
                            </div>

                            {/* Individual Pipeline Nodes */}
                            {PIPELINE_STAGES.map((stage, idx) => {
                              const isCompleted = idx <= currentStageIdx;
                              const isActive = idx === currentStageIdx;

                              return (
                                <div key={idx} className="flex md:flex-col items-center md:text-center gap-3 md:gap-2 relative z-10 flex-1 w-full md:w-auto">
                                  {/* Node Dot Circle */}
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-sm ${
                                    isCompleted 
                                      ? "bg-[#3730a3] text-white ring-4 ring-indigo-100" 
                                      : "bg-gray-100 text-gray-400 border border-gray-200"
                                  } ${isActive ? "animate-pulse scale-110 ring-4 ring-emerald-100 !bg-emerald-600 text-white" : ""}`}>
                                    {isCompleted ? <Check className="w-4 h-4 text-white" /> : <span>{idx + 1}</span>}
                                  </div>

                                  {/* Node description info text */}
                                  <div className="text-left md:text-center">
                                    <p className={`text-xs font-black leading-tight ${isCompleted ? "text-gray-900" : "text-gray-400"} ${isActive ? "text-emerald-600" : ""}`}>
                                      {lang === "bn" ? stage.labelBn : stage.labelEn}
                                    </p>
                                    <p className="text-[9px] text-gray-400 max-w-[130px] hidden md:block mt-0.5 leading-tight font-medium">
                                      {lang === "bn" ? stage.descBn : stage.descEn}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Cancel Order Action Shortcut if status is still received */}
                      {order.status === OrderStatus.RECEIVED && onCancelOrder && (
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50 bg-rose-50/50 p-4 rounded-2xl border border-dashed border-rose-100">
                          <div className="flex items-center gap-2 text-rose-600">
                            <ShieldAlert className="w-4 h-4 shrink-0" />
                            <span className="text-xs font-semibold text-rose-700">
                              {lang === "bn" ? "অর্ডারটি কুরিয়ারে পাঠানোর পূর্বে বাতিল করতে পারেন।" : "This order can be canceled before shipment."}
                            </span>
                          </div>
                          <button
                            onClick={() => {
                              if (confirm(lang === "bn" ? "আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান?" : "Are you sure you want to cancel this order?")) {
                                onCancelOrder(order.id);
                              }
                            }}
                            className="bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-sm active:scale-95 uppercase tracking-wide shrink-0"
                          >
                            {lang === "bn" ? "অর্ডার বাতিল করুন" : "Cancel Order"}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
      </div>

    </div>
  );
}
