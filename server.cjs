var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/data.ts
var INITIAL_PRODUCTS = [
  {
    id: "1",
    name: "Premium Leather Wallet",
    banglaName: "\u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u099A\u09BE\u09AE\u09DC\u09BE\u09B0 \u0993\u09DF\u09BE\u09B2\u09C7\u099F",
    description: "Crafted from 100% genuine top-grain leather. Sleek design with RFID blocking technology, 6 card slots, and an easy-access ID window.",
    banglaDescription: "\u09E7\u09E6\u09E6% \u0996\u09BE\u0981\u099F\u09BF \u099A\u09BE\u09AE\u09DC\u09BE \u09A6\u09BF\u09DF\u09C7 \u09A4\u09C8\u09B0\u09BF \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0993\u09DF\u09BE\u09B2\u09C7\u099F\u0964 \u098F\u09A4\u09C7 \u0986\u099B\u09C7 \u0986\u09B0\u098F\u09AB\u0986\u0987\u09A1\u09BF \u09AC\u09CD\u09B2\u0995\u09BF\u0982 \u09AA\u09CD\u09B0\u09AF\u09C1\u0995\u09CD\u09A4\u09BF, \u09E9\u099F\u09BF \u0995\u09BE\u09B0\u09CD\u09A1 \u09B8\u09CD\u09B2\u099F \u098F\u09AC\u0982 \u098F\u0995\u099F\u09BF \u09B8\u09B9\u099C\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09C7\u09B0 \u0989\u09AA\u09AF\u09CB\u0997\u09C0 \u0986\u0987\u09A1\u09BF \u0989\u0987\u09A8\u09CD\u09A1\u09CB\u0964",
    price: 1250,
    originalPrice: 1850,
    image: "https://images.unsplash.com/photo-1627124718515-053ef11b7f03?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    rating: 4.8,
    reviewsCount: 142,
    stock: 25,
    badge: "new",
    salesCount: 280,
    colors: [
      { name: "Black", hex: "#1f2937" },
      { name: "Deep Brown", hex: "#451a03" },
      { name: "Tan Vintage", hex: "#b45309" }
    ]
  },
  {
    id: "2",
    name: "True Wireless Earbuds",
    banglaName: "\u099F\u09CD\u09B0\u09C1 \u0993\u09DF\u09CD\u09AF\u09BE\u09B0\u09B2\u09C7\u09B8 \u0987\u09DF\u09BE\u09B0\u09AC\u09BE\u09A1\u09B8",
    description: "Active noise cancellation, ultra-low latency gaming mode, 30-hour combined battery life, and crystal clear call quality with quad mics.",
    banglaDescription: "\u0985\u09CD\u09AF\u09BE\u0995\u09CD\u099F\u09BF\u09AD \u09A8\u09DF\u09C7\u099C \u0995\u09CD\u09AF\u09BE\u09A8\u09CD\u09B8\u09C7\u09B2\u09C7\u09B6\u09A8, \u0997\u09C7\u09AE\u09BE\u09B0\u09A6\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0986\u09B2\u09CD\u099F\u09CD\u09B0\u09BE-\u09B2\u09CB \u09B2\u09CD\u09AF\u09BE\u099F\u09C7\u09A8\u09CD\u09B8\u09BF \u09AE\u09CB\u09A1, \u099A\u09BE\u09B0\u09CD\u099C\u09BF\u0982 \u0995\u09C7\u09B8\u09B8\u09B9 \u09E9\u09E6 \u0998\u09A3\u09CD\u099F\u09BE \u09AC\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09BF \u09B2\u09BE\u0987\u09AB \u098F\u09AC\u0982 \u09EA\u099F\u09BF \u098F\u0987\u099A\u09A1\u09BF \u09AE\u09BE\u0987\u0995\u09CD\u09B0\u09CB\u09AB\u09CB\u09A8 \u09AF\u09C1\u0995\u09CD\u09A4 \u099A\u09AE\u09CE\u0995\u09BE\u09B0 \u0987\u09DF\u09BE\u09B0\u09AC\u09BE\u09A1\u09B8\u0964",
    price: 2490,
    originalPrice: 3500,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
    category: "Electronics",
    rating: 4.6,
    reviewsCount: 89,
    stock: 18,
    badge: "hot",
    isFlashSale: true,
    flashSalePrice: 2190,
    salesCount: 450,
    colors: [
      { name: "Glossy White", hex: "#f8fafc" },
      { name: "Matte Black", hex: "#0f172a" }
    ]
  },
  {
    id: "3",
    name: "Minimalist Smart Watch",
    banglaName: "\u09AE\u09BF\u09A8\u09BF\u09AE\u09BE\u09B2\u09BF\u09B8\u09CD\u099F \u09B8\u09CD\u09AE\u09BE\u09B0\u09CD\u099F \u0993\u09DF\u09BE\u099A",
    description: "AMOLED full-touch display, Spo2 blood oxygen monitoring, 24/7 heart-rate tracker, 12 sports modes, and up to 10 days of standby battery.",
    banglaDescription: "\u0985\u09CD\u09AF\u09BE\u09AE\u09CB\u09B2\u09C7\u09A1 \u09AB\u09C1\u09B2-\u099F\u09BE\u099A \u09A1\u09BF\u09B8\u09AA\u09CD\u09B2\u09C7, \u09B0\u0995\u09CD\u09A4\u09C7 \u0985\u0995\u09CD\u09B8\u09BF\u099C\u09C7\u09A8\u09C7\u09B0 \u09AE\u09BE\u09A4\u09CD\u09B0\u09BE (Spo2) \u09AE\u09A8\u09BF\u099F\u09B0\u09BF\u0982, \u09B9\u09BE\u09B0\u09CD\u099F-\u09B0\u09C7\u099F \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BE\u09B0, \u09E7\u09E8\u099F\u09BF \u09B8\u09CD\u09AA\u09CB\u09B0\u09CD\u099F\u09B8 \u09AE\u09CB\u09A1 \u098F\u09AC\u0982 \u09E7\u09E6 \u09A6\u09BF\u09A8\u09C7\u09B0 \u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1\u09AC\u09BE\u0987 \u09AC\u09CD\u09AF\u09BE\u099F\u09BE\u09B0\u09BF \u09B2\u09BE\u0987\u09AB \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u09B8\u09CD\u09AE\u09BE\u09B0\u09CD\u099F \u0993\u09DF\u09BE\u099A\u0964",
    price: 3200,
    originalPrice: 4500,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600",
    category: "Electronics",
    rating: 4.7,
    reviewsCount: 210,
    stock: 12,
    badge: "sale",
    isFlashSale: true,
    flashSalePrice: 2890,
    salesCount: 520,
    colors: [
      { name: "Carbon Grey", hex: "#475569" },
      { name: "Space Black", hex: "#020617" },
      { name: "Rose Gold", hex: "#fda4af" }
    ]
  },
  {
    id: "4",
    name: "Premium Cotton Panjabi",
    banglaName: "\u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u099F\u09A8 \u09AA\u09BE\u099E\u09CD\u099C\u09BE\u09AC\u09BF",
    description: "Breathable, high-quality organic cotton fabric with elegant embroidery on collar and placket. Perfect for festivals, Fridays, and special events.",
    banglaDescription: "\u09B6\u09A4\u09AD\u09BE\u0997 \u0986\u09B0\u09BE\u09AE\u09A6\u09BE\u09DF\u0995 \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u0995\u099F\u09A8 \u09A6\u09BF\u09DF\u09C7 \u09A4\u09C8\u09B0\u09BF \u09AA\u09BE\u099E\u09CD\u099C\u09BE\u09AC\u09BF\u0964 \u0995\u09B2\u09BE\u09B0 \u098F\u09AC\u0982 \u09AC\u09C1\u0995\u09C7 \u09B8\u09C2\u0995\u09CD\u09B7\u09CD\u09AE \u0993 \u09AE\u09BE\u09B0\u09CD\u099C\u09BF\u09A4 \u098F\u09AE\u09AC\u09CD\u09B0\u09DF\u09A1\u09BE\u09B0\u09BF \u0995\u09BE\u099C \u0995\u09B0\u09BE\u0964 \u0989\u09CE\u09B8\u09AC-\u09AA\u09BE\u09B0\u09CD\u09AC\u09A3 \u0993 \u099C\u09C1\u09AE\u09CD\u09AE\u09BE\u09B0 \u09A8\u09BE\u09AE\u09BE\u099C\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09C7\u09B0\u09BE \u09AA\u099B\u09A8\u09CD\u09A6\u0964",
    price: 1850,
    originalPrice: 2400,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=600",
    category: "Apparel",
    rating: 4.9,
    reviewsCount: 312,
    stock: 30,
    badge: "hot",
    salesCount: 190,
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: "Pure White", hex: "#ffffff" },
      { name: "Navy Blue", hex: "#1e3a8a" },
      { name: "Olive Green", hex: "#3f6212" },
      { name: "Maroon Rose", hex: "#991b1b" }
    ]
  },
  {
    id: "5",
    name: "Organic Sylhet Tea Leaves",
    banglaName: "\u09B8\u09BF\u09B2\u09C7\u099F\u09C7\u09B0 \u0985\u09B0\u09CD\u0997\u09BE\u09A8\u09BF\u0995 \u099A\u09BE \u09AA\u09BE\u09A4\u09BE",
    description: "Directly sourced from the lush tea gardens of Sreemangal, Sylhet. Premium black tea with an rich aroma and deep golden liquor.",
    banglaDescription: "\u09B6\u09CD\u09B0\u09C0\u09AE\u0999\u09CD\u0997\u09B2\u09C7\u09B0 \u09B8\u09AC\u09C1\u099C\u09C7 \u0998\u09C7\u09B0\u09BE \u099A\u09BE \u09AC\u09BE\u0997\u09BE\u09A8 \u09A5\u09C7\u0995\u09C7 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09B8\u0982\u0997\u09C3\u09B9\u09C0\u09A4 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09AC\u09CD\u09B2\u09CD\u09AF\u09BE\u0995 \u099F\u09BF\u0964 \u099A\u09AE\u09CE\u0995\u09BE\u09B0 \u09B8\u09C1\u09AC\u09BE\u09B8 \u098F\u09AC\u0982 \u0986\u0995\u09B0\u09CD\u09B7\u09A3\u09C0\u09DF \u09B2\u09BF\u0995\u09BE\u09B0\u09C7 \u09AA\u09BE\u09AC\u09C7\u09A8 \u098F\u0995 \u09B8\u09A4\u09C7\u099C \u0985\u09A8\u09C1\u09AD\u09C2\u09A4\u09BF\u0964",
    price: 380,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=600",
    category: "Grocery",
    rating: 4.5,
    reviewsCount: 76,
    stock: 50,
    badge: "new",
    salesCount: 85
  },
  {
    id: "6",
    name: "Waterproof Laptop Backpack",
    banglaName: "\u0993\u09DF\u09BE\u099F\u09BE\u09B0\u09AA\u09CD\u09B0\u09C1\u09AB \u09B2\u09CD\u09AF\u09BE\u09AA\u099F\u09AA \u09AC\u09CD\u09AF\u09BE\u0997",
    description: "High-density water-resistant nylon, multi-compartment storage with dedicated 15.6-inch laptop sleeve, external USB charging port, and anti-theft back pocket.",
    banglaDescription: "\u0989\u099A\u09CD\u099A \u0998\u09A8\u09A4\u09CD\u09AC\u09C7\u09B0 \u0993\u09DF\u09BE\u099F\u09BE\u09B0\u09AA\u09CD\u09B0\u09C1\u09AB \u09A8\u09BE\u0987\u09B2\u09A8 \u0995\u09BE\u09AA\u09DC, \u09B2\u09CD\u09AF\u09BE\u09AA\u099F\u09AA \u09B0\u09BE\u0996\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A1\u09C7\u09A1\u09BF\u0995\u09C7\u099F\u09C7\u09A1 \u09B8\u09C1\u09B0\u0995\u09CD\u09B7\u09BF\u09A4 \u099A\u09C7\u09AE\u09CD\u09AC\u09BE\u09B0, \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u099A\u09BE\u09B0\u09CD\u099C \u09A6\u09C7\u09DF\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u0987\u0989\u098F\u09B8\u09AC\u09BF \u09AA\u09CB\u09B0\u09CD\u099F \u098F\u09AC\u0982 \u099A\u09CB\u09B0-\u09A8\u09BF\u09B0\u09CB\u09A7\u0995 \u09AA\u0995\u09C7\u099F \u09B8\u09AE\u09C3\u09A6\u09CD\u09A7 \u09AC\u09CD\u09AF\u09BE\u0997\u0964",
    price: 1650,
    originalPrice: 2200,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=600",
    category: "Accessories",
    rating: 4.7,
    reviewsCount: 95,
    stock: 0,
    // Out of stock for testing stock filter
    badge: "sale",
    salesCount: 150
  },
  {
    id: "7",
    name: "Comfort Breathable Sneakers",
    banglaName: "\u0995\u09AE\u09AB\u09CB\u09B0\u09CD\u099F \u09AC\u09CD\u09B0\u09BF\u09A6\u09C7\u09B2 \u09B0\u09BE\u09A8\u09BF\u0982 \u09B8\u09CD\u09A8\u09BF\u0995\u09BE\u09B0\u09CD\u09B8",
    description: "Premium casual sneakers with soft cushion support, non-slip rubber soles, and air-mesh fabric. Best choice for daily training, sports and casual styling.",
    banglaDescription: "\u09B8\u09AB\u099F \u0995\u09C1\u09B6\u09A8 \u09B8\u09BE\u09AA\u09CB\u09B0\u09CD\u099F \u0993 \u0997\u09CD\u09B0\u09BF\u09AA\u09B8\u09B9 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09B0\u09BE\u09A8\u09BF\u0982 \u09B8\u09CD\u09A8\u09BF\u0995\u09BE\u09B0\u09CD\u09B8\u0964 \u09AA\u09BE \u0998\u09C7\u09AE\u09C7 \u09AF\u09BE\u0993\u09DF\u09BE \u09B0\u09CB\u09A7 \u0995\u09B0\u09A4\u09C7 \u09AC\u09CD\u09B0\u09BF\u09A6\u09C7\u09B2 \u098F\u09DF\u09BE\u09B0-\u09AE\u09C7\u09B6 \u09AB\u09C7\u09AC\u09CD\u09B0\u09BF\u0995 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964 \u09B9\u09BE\u0981\u099F\u09BE, \u099C\u0997\u09BF\u0982 \u098F\u09AC\u0982 \u09B8\u09CD\u099F\u09BE\u0987\u09B2\u09BF\u09B6 \u0995\u09CD\u09AF\u09BE\u099C\u09C1\u09DF\u09BE\u09B2 \u09AB\u09CD\u09AF\u09BE\u09B6\u09A8\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u09B8\u09C7\u09B0\u09BE \u099C\u09C1\u09A4\u09CB\u0964",
    price: 1850,
    originalPrice: 2500,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    category: "Shoes & Footwear",
    rating: 4.9,
    reviewsCount: 156,
    stock: 14,
    badge: "hot",
    isFlashSale: true,
    flashSalePrice: 1690,
    salesCount: 380,
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: [
      { name: "Flame Red", hex: "#dc2626" },
      { name: "Stealth Black", hex: "#111827" },
      { name: "Triple White", hex: "#f9fafb" }
    ]
  },
  {
    id: "8",
    name: "Natural Glow Face Serum",
    banglaName: "\u09A8\u09CD\u09AF\u09BE\u099A\u09BE\u09B0\u09BE\u09B2 \u0997\u09CD\u09B2\u09CB \u09AB\u09C7\u09B8 \u09B8\u09BF\u09B0\u09BE\u09AE",
    description: "Formulated with 10% Vitamin C and hyaluronic acid. Evens skin tone, reduces fine lines, and delivers healthy natural glowing skin within 2 weeks.",
    banglaDescription: "\u09E7\u09E6% \u09AD\u09BF\u099F\u09BE\u09AE\u09BF\u09A8-\u09B8\u09BF \u098F\u09AC\u0982 \u09B9\u09BE\u09DF\u09BE\u09B2\u09C1\u09B0\u09CB\u09A8\u09BF\u0995 \u0985\u09CD\u09AF\u09BE\u09B8\u09BF\u09A1\u09C7\u09B0 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09BE\u09B0\u09C0 \u09AB\u09B0\u09CD\u09AE\u09C1\u09B2\u09BE\u0964 \u09A4\u09CD\u09AC\u0995\u09C7\u09B0 \u0995\u09BE\u09B2\u09CB \u09A6\u09BE\u0997 \u09A6\u09C2\u09B0 \u0995\u09B0\u09C7 \u098F\u09AC\u0982 \u09E8 \u09B8\u09AA\u09CD\u09A4\u09BE\u09B9\u09C7\u09B0 \u09AE\u09A7\u09CD\u09AF\u09C7 \u098F\u0995\u099F\u09BF \u09B8\u09CD\u09AC\u09BE\u09B8\u09CD\u09A5\u09CD\u09AF\u0995\u09B0 \u0989\u099C\u09CD\u099C\u09CD\u09AC\u09B2 \u0986\u09AD\u09BE \u09AB\u09C1\u099F\u09BF\u09DF\u09C7 \u09A4\u09CB\u09B2\u09C7\u0964",
    price: 950,
    originalPrice: 1400,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=600",
    category: "Cosmetics & Beauty",
    rating: 4.8,
    reviewsCount: 112,
    stock: 20,
    badge: "new",
    salesCount: 110
  }
];
function createDefaultTrackingHistory(createdAt = /* @__PURE__ */ new Date()) {
  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };
  return [
    {
      status: "Order Received" /* RECEIVED */,
      title: "Order Placed Successfully",
      banglaTitle: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7",
      description: "Your order has been received and is waiting for confirmation.",
      banglaDescription: "\u0986\u09AA\u09A8\u09BE\u09B0 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u099F\u09BF \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u09BF\u09B8\u09CD\u099F\u09C7\u09AE\u09C7 \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AF\u09C1\u0995\u09CD\u09A4 \u09B9\u09DF\u09C7\u099B\u09C7 \u098F\u09AC\u0982 \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4\u0995\u09B0\u09A3\u09C7\u09B0 \u099C\u09A8\u09CD\u09AF \u0985\u09AA\u09C7\u0995\u09CD\u09B7\u09AE\u09BE\u09A8 \u09B0\u09DF\u09C7\u099B\u09C7\u0964",
      timestamp: formatTime(createdAt),
      completed: true
    },
    {
      status: "Processing" /* PROCESSING */,
      title: "Processing Order",
      banglaTitle: "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u09AA\u09CD\u09B0\u09B8\u09C7\u09B8\u09BF\u0982 \u099A\u09B2\u099B\u09C7",
      description: "Our quality assurance team is preparing your package.",
      banglaDescription: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u099F\u09BF\u09AE \u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BF \u09AA\u09B0\u09C0\u0995\u09CD\u09B7\u09BE \u0995\u09B0\u099B\u09C7 \u098F\u09AC\u0982 \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u09BF\u0982 \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09C7\u099B\u09C7\u0964",
      timestamp: "--",
      completed: false
    },
    {
      status: "Shipped" /* SHIPPED */,
      title: "Handed over to Delivery Partner",
      banglaTitle: "\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09AA\u09BE\u09B0\u09CD\u099F\u09A8\u09BE\u09B0\u09C7\u09B0 \u0995\u09BE\u099B\u09C7 \u09B9\u09B8\u09CD\u09A4\u09BE\u09A8\u09CD\u09A4\u09B0\u09BF\u09A4",
      description: "Parcel dispatched and handed over to courier service.",
      banglaDescription: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09BE\u09B0\u09CD\u09B8\u09C7\u09B2\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u09AA\u09CD\u09AF\u09BE\u0995\u09C7\u099C\u09BF\u0982 \u09B6\u09C7\u09B7\u09C7 \u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0 \u09B8\u09BE\u09B0\u09CD\u09AD\u09BF\u09B8\u09C7\u09B0 \u0995\u09BE\u099B\u09C7 \u09B9\u09B8\u09CD\u09A4\u09BE\u09A8\u09CD\u09A4\u09B0 \u0995\u09B0\u09BE \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
      timestamp: "--",
      completed: false
    },
    {
      status: "Out for Delivery" /* OUT_FOR_DELIVERY */,
      title: "Out for Delivery",
      banglaTitle: "\u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09A6\u09BF\u09A4\u09C7 \u09AC\u09C7\u09B0 \u09B9\u09DF\u09C7\u099B\u09C7",
      description: "Delivery hero is near your location. Keep your phone active.",
      banglaDescription: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09AE\u09CD\u09AF\u09BE\u09A8 \u0986\u09AA\u09A8\u09BE\u09B0 \u098F\u09B2\u09BE\u0995\u09BE\u09DF \u09AA\u09CD\u09B0\u09AC\u09C7\u09B6 \u0995\u09B0\u09C7\u099B\u09C7\u0964 \u0985\u09A8\u09C1\u0997\u09CD\u09B0\u09B9 \u0995\u09B0\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u09AE\u09CB\u09AC\u09BE\u0987\u09B2 \u09B8\u099A\u09B2 \u09B0\u09BE\u0996\u09C1\u09A8\u0964",
      timestamp: "--",
      completed: false
    },
    {
      status: "Delivered" /* DELIVERED */,
      title: "Package Delivered",
      banglaTitle: "\u09AA\u09BE\u09B0\u09CD\u09B8\u09C7\u09B2 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09B8\u09AE\u09CD\u09AA\u09A8\u09CD\u09A8",
      description: "Thank you for shopping with us! Cash collected.",
      banglaDescription: "\u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u09B6\u09AA\u09BF\u0982 \u0995\u09B0\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A7\u09A8\u09CD\u09AF\u09AC\u09BE\u09A6! \u09AA\u09BE\u09B0\u09CD\u09B8\u09C7\u09B2\u099F\u09BF \u09B8\u09AB\u09B2\u09AD\u09BE\u09AC\u09C7 \u0986\u09AA\u09A8\u09BE\u09B0 \u0995\u09BE\u099B\u09C7 \u09AA\u09CC\u0981\u099B\u09BE\u09A8\u09CB \u09B9\u09DF\u09C7\u099B\u09C7\u0964",
      timestamp: "--",
      completed: false
    }
  ];
}

// server.ts
var import_crypto = __toESM(require("crypto"), 1);
var import_fs = __toESM(require("fs"), 1);
import_dotenv.default.config({ override: true });
function getApiKeys() {
  const defaultKeys = {
    brevoApiKey: process.env.BREVO_API_KEY || "",
    brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || "",
    brevoSenderName: process.env.BREVO_SENDER_NAME || "",
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || "",
    cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET || ""
  };
  try {
    if (import_fs.default.existsSync("./keys-config.json")) {
      const saved = JSON.parse(import_fs.default.readFileSync("./keys-config.json", "utf8"));
      return {
        brevoApiKey: saved.brevoApiKey || defaultKeys.brevoApiKey,
        brevoSenderEmail: saved.brevoSenderEmail || defaultKeys.brevoSenderEmail,
        brevoSenderName: saved.brevoSenderName || defaultKeys.brevoSenderName,
        cloudinaryCloudName: saved.cloudinaryCloudName || defaultKeys.cloudinaryCloudName,
        cloudinaryApiKey: saved.cloudinaryApiKey || defaultKeys.cloudinaryApiKey,
        cloudinaryApiSecret: saved.cloudinaryApiSecret || defaultKeys.cloudinaryApiSecret,
        cloudinaryUploadPreset: saved.cloudinaryUploadPreset || defaultKeys.cloudinaryUploadPreset
      };
    }
  } catch (err) {
    console.error("Error reading keys-config.json:", err);
  }
  return defaultKeys;
}
function saveApiKeys(keys) {
  try {
    const current = getApiKeys();
    const updated = { ...current, ...keys };
    import_fs.default.writeFileSync("./keys-config.json", JSON.stringify(updated, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error saving keys-config.json:", err);
    return false;
  }
}
var app = (0, import_express.default)();
app.use(import_express.default.json({ limit: "50mb" }));
app.use(import_express.default.urlencoded({ limit: "50mb", extended: true }));
var backendProducts = [...INITIAL_PRODUCTS];
var backendCoupons = [
  {
    id: "c-1",
    code: "FB20",
    type: "percentage",
    value: 20,
    minPurchase: 0,
    isActive: true,
    descriptionEn: "Facebook Ad Campaign Special 20% discount",
    descriptionBn: "\u09AB\u09C7\u09B8\u09AC\u09C1\u0995 \u0985\u09CD\u09AF\u09BE\u09A1 \u09B8\u09CD\u09AA\u09C7\u09B6\u09BE\u09B2 \u09E8\u09E6% \u09A1\u09BF\u09B8\u0995\u09BE\u0989\u09A8\u09CD\u099F"
  },
  {
    id: "c-2",
    code: "FLASH10",
    type: "percentage",
    value: 10,
    minPurchase: 1500,
    isActive: true,
    descriptionEn: "Flash Sale 10% discount",
    descriptionBn: "\u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u09B6 \u09B8\u09C7\u09B2 \u09E7\u09E6% \u09A1\u09BF\u09B8\u0995\u09BE\u0989\u09A8\u09CD\u099F"
  },
  {
    id: "c-3",
    code: "SAVE200",
    type: "flat",
    value: 200,
    minPurchase: 2e3,
    isActive: true,
    descriptionEn: "Flat 200 Taka discount on orders above 2000 BDT",
    descriptionBn: "\u09E8\u09E6\u09E6\u09E6 \u099F\u09BE\u0995\u09BE\u09B0 \u09AC\u09C7\u09B6\u09BF \u0985\u09B0\u09CD\u09A1\u09BE\u09B0\u09C7 \u09E8\u09E6\u09E6 \u099F\u09BE\u0995\u09BE \u09AB\u09CD\u09B2\u09CD\u09AF\u09BE\u099F \u099B\u09BE\u09DC"
  }
];
var lastBrevoError = null;
var backendOrders = [
  {
    id: "TRK-98312",
    customerName: "Rahim Islam",
    customerPhone: "01712345678",
    customerAddress: "House 12, Road 4, Dhanmondi",
    customerDivision: "Dhaka (\u09A2\u09BE\u0995\u09BE)",
    customerDistrict: "Dhaka (\u09A2\u09BE\u0995\u09BE)",
    customerThana: "Dhanmondi (\u09A7\u09BE\u09A8\u09AE\u09A8\u09CD\u09A1\u09BF)",
    cartItems: [
      {
        product: INITIAL_PRODUCTS[0],
        // Premium Leather Wallet (1250)
        quantity: 1,
        selectedColor: "Black"
      },
      {
        product: INITIAL_PRODUCTS[1],
        // True Wireless Earbuds (2490)
        quantity: 1,
        selectedColor: "Matte Black"
      }
    ],
    totalAmount: 3740,
    paymentMethod: "cod",
    status: "Delivered" /* DELIVERED */,
    trackingHistory: createDefaultTrackingHistory(new Date(Date.now() - 4 * 24 * 60 * 60 * 1e3)),
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "TRK-45129",
    customerName: "Sultana Razia",
    customerPhone: "01823456789",
    customerAddress: "Sector 4, Uttara",
    customerDivision: "Dhaka (\u09A2\u09BE\u0995\u09BE)",
    customerDistrict: "Dhaka (\u09A2\u09BE\u0995\u09BE)",
    customerThana: "Uttara (\u0989\u09A4\u09CD\u09A4\u09B0\u09BE)",
    cartItems: [
      {
        product: INITIAL_PRODUCTS[2],
        // Minimalist Smart Watch (3200)
        quantity: 2,
        selectedColor: "Carbon Grey"
      }
    ],
    totalAmount: 6400,
    paymentMethod: "online",
    onlineGatewayType: "bkash",
    paymentTransactionId: "BKASH_TXN_98231",
    status: "Delivered" /* DELIVERED */,
    trackingHistory: createDefaultTrackingHistory(new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3)),
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "TRK-10293",
    customerName: "Zamil Uddin",
    customerPhone: "01934567890",
    customerAddress: "Halee Shahar, Chattogram",
    customerDivision: "Chattogram (\u099A\u099F\u09CD\u099F\u0997\u09CD\u09B0\u09BE\u09AE)",
    customerDistrict: "Chattogram (\u099A\u099F\u09CD\u099F\u0997\u09CD\u09B0\u09BE\u09AE)",
    customerThana: "Patiya (\u09AA\u099F\u09BF\u09DF\u09BE)",
    cartItems: [
      {
        product: INITIAL_PRODUCTS[3],
        // Premium Cotton Panjabi (1850)
        quantity: 1,
        selectedColor: "Pure White",
        selectedSize: "XL"
      }
    ],
    totalAmount: 1850,
    paymentMethod: "cod",
    status: "Shipped" /* SHIPPED */,
    trackingHistory: createDefaultTrackingHistory(new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3)),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "TRK-88231",
    customerName: "Tanvir Ahmed",
    customerPhone: "01545678901",
    customerAddress: "Sreemangal Road, Moulvibazar",
    customerDivision: "Sylhet (\u09B8\u09BF\u09B2\u09C7\u099F)",
    customerDistrict: "Moulvibazar (\u09AE\u09CC\u09B2\u09AD\u09C0\u09AC\u09BE\u099C\u09BE\u09B0)",
    cartItems: [
      {
        product: INITIAL_PRODUCTS[4],
        // Organic Sylhet Tea Leaves (380)
        quantity: 3
      }
    ],
    totalAmount: 1140,
    paymentMethod: "cod",
    status: "Order Received" /* RECEIVED */,
    trackingHistory: createDefaultTrackingHistory(new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3)),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString()
  },
  {
    id: "TRK-22410",
    customerName: "Mariam Begum",
    customerPhone: "01656789012",
    customerAddress: "Kazipara, Mirpur",
    customerDivision: "Dhaka (\u09A2\u09BE\u0995\u09BE)",
    customerDistrict: "Dhaka (\u09A2\u09BE\u0995\u09BE)",
    customerThana: "Mirpur (\u09AE\u09BF\u09B0\u09AA\u09C1\u09B0)",
    cartItems: [
      {
        product: INITIAL_PRODUCTS[7],
        // Natural Glow Face Serum (950)
        quantity: 1
      }
    ],
    totalAmount: 950,
    paymentMethod: "cod",
    status: "Order Received" /* RECEIVED */,
    trackingHistory: createDefaultTrackingHistory(new Date(Date.now() - 8 * 60 * 60 * 1e3)),
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1e3).toISOString()
  }
];
var PORT = 3e3;
var apiKey = process.env.GEMINI_API_KEY;
var ai = null;
if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new import_genai.GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    console.log("Gemini AI client successfully initialized.");
  } catch (err) {
    console.error("Failed to initialize Gemini AI client:", err);
  }
} else {
  console.log("GEMINI_API_KEY not found or is placeholder. Using fallback simulation for ad copy.");
}
app.post("/api/marketing/ad-copy", async (req, res) => {
  const { productName, description, price, category, language = "bengali", platform = "facebook", style = "ugc_hook" } = req.body;
  if (!productName) {
    return res.status(400).json({ error: "Product name is required" });
  }
  let prompt = "";
  if (platform === "tiktok") {
    prompt = `You are an expert TikTok advertiser and viral video creator specializing in Bangladeshi e-commerce.
Create a highly engaging TikTok video script and ad caption for the following product:
- Name: ${productName}
- Category: ${category || "General"}
- Price: ${price ? price + " Taka" : "Varies"}
- Description: ${description || "High quality product"}
- TikTok Ad Style: ${style} (e.g., ugc_hook, problem_solution, asmr_unboxing, direct_promo)

Format the response exactly with these sections (using appropriate emojis):
1. [Video Concept] A description of the visual theme/idea of the TikTok video (e.g. trending UGC hook, unboxing, pain point).
2. [Video Script & Voiceover] A chronological script with timing markers (e.g. 0:00-0:03 [Visual Description] - Voiceover line, 0:03-0:12, 0:12-0:15) written in an engaging, natural tone (using ${language === "bengali" ? "Bangla/Bengali" : "English"}).
3. [On-Screen Captions] Dynamic, short text prompts to overlay on the TikTok video.
4. [TikTok Post Caption & Hashtags] A viral, punchy post caption under 150 characters with trending hashtags (e.g., #tiktokmademebuyit, #bangladesh, #viral).

Ensure the voiceover sounds like a real, enthusiastic customer or creator (UGC style) from Bangladesh.`;
  } else {
    prompt = `You are an expert social media advertiser specializing in Bangladeshi e-commerce and Facebook ad campaigns.
Create a highly engaging, high-conversion Facebook post / ad copy for the following product:
- Name: ${productName}
- Category: ${category || "General"}
- Price: ${price ? price + " Taka" : "Varies"}
- Description: ${description || "High quality product"}

Format the response exactly with these sections (using appropriate emoji accents):
1. [Hook] A killer opening line in ${language === "bengali" ? "Bangla (Bengali)" : "English"} to stop user scrolling.
2. [Description] 2-3 sentences explaining what makes this product amazing.
3. [Key Features] A bulleted list of 3-4 key benefits/features.
4. [Call To Action] A strong call to action directing them to buy with Cash on Delivery and Order Tracking available. Include placeholders like [Link Here] or [Order Now].

Ensure the style is extremely professional, friendly, and culturally relevant to Bangladeshi online shoppers (e.g., mention "\u0986\u099C\u0987 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8", "\u09B8\u09BE\u09B0\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF", "\u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE").`;
  }
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      const text = response.text;
      return res.json({ success: true, text });
    } catch (error) {
      console.error("Gemini API error:", error);
      return res.status(500).json({
        error: "Failed to generate copy using Gemini. Here is a simulated fallback.",
        fallback: generateSimulatedCopy(productName, price, language, platform, style)
      });
    }
  } else {
    return res.json({
      success: true,
      text: generateSimulatedCopy(productName, price, language, platform, style),
      simulated: true
    });
  }
});
app.post("/api/ai/recommendations", async (req, res) => {
  const { productId, recentlyViewed = [], purchasedIds = [] } = req.body;
  const currentProduct = backendProducts.find((p) => String(p.id) === String(productId));
  if (!currentProduct) {
    return res.json({
      success: true,
      recommendations: backendProducts.slice(0, 3).map((p) => ({
        ...p,
        aiReasonEn: "Popular Collection",
        aiReasonBn: "\u099C\u09A8\u09AA\u09CD\u09B0\u09BF\u09DF \u0995\u09BE\u09B2\u09C7\u0995\u09B6\u09A8"
      }))
    });
  }
  const otherProducts = backendProducts.filter((p) => String(p.id) !== String(currentProduct.id));
  if (ai) {
    try {
      const prompt = `You are an AI-powered Amazon-style personalization and product recommendation engine for a premium Bangladeshi e-commerce store.
Analyze the user's shopping context and recommend the top 3 best matching/complementary products from the available catalog.

Currently viewed product:
- Name: ${currentProduct.name}
- Category: ${currentProduct.category}
- Description: ${currentProduct.description}
- Price: ${currentProduct.price} BDT

User's browsing/purchasing history:
- Recently Viewed IDs: ${recentlyViewed.join(", ")}
- Already Purchased IDs: ${purchasedIds.join(", ")}

Available Catalog (choose EXACTLY 3-4 from these):
${otherProducts.map((p) => `- ID: ${p.id} | Name: ${p.name} | Category: ${p.category} | Price: ${p.price} BDT | Description: ${p.description}`).join("\n")}

Rules:
1. Choose exactly 3 or 4 products from the available catalog that are most relevant (cross-selling, upselling, complementary, same category, or stylistic matches).
2. For each recommendation, provide a short, catchy explanation of why it was recommended (e.g. "Complete your look", "Frequently bought together", "Premium upgrade", "Perfect accessory") in English and also in Bangla.
3. Return the response in strict JSON format.

JSON schema to follow:
{
  "recommendations": [
    {
      "id": "product_id_from_catalog",
      "aiReasonEn": "Why recommended in English",
      "aiReasonBn": "Why recommended in Bangla"
    }
  ]
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              recommendations: {
                type: import_genai.Type.ARRAY,
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    id: { type: import_genai.Type.STRING },
                    aiReasonEn: { type: import_genai.Type.STRING },
                    aiReasonBn: { type: import_genai.Type.STRING }
                  },
                  required: ["id", "aiReasonEn", "aiReasonBn"]
                }
              }
            },
            required: ["recommendations"]
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      const recommendedList = data.recommendations || [];
      const result = recommendedList.map((rec) => {
        const prod = backendProducts.find((p) => String(p.id) === String(rec.id));
        if (prod) {
          return {
            ...prod,
            aiReasonEn: rec.aiReasonEn,
            aiReasonBn: rec.aiReasonBn
          };
        }
        return null;
      }).filter(Boolean);
      if (result.length < 3) {
        const existingIds = result.map((r) => String(r?.id));
        const padItems = otherProducts.filter((p) => !existingIds.includes(String(p.id))).slice(0, 3 - result.length).map((p) => ({
          ...p,
          aiReasonEn: "Customers also viewed this premium item",
          aiReasonBn: "\u0985\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09AF \u0995\u09CD\u09B0\u09C7\u09A4\u09BE\u09B0\u09BE \u098F\u0987 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09AF\u09BC\u09BE\u09AE \u09AA\u09A3\u09CD\u09AF\u099F\u09BF\u0993 \u09A6\u09C7\u0996\u09C7\u099B\u09C7\u09A8"
        }));
        result.push(...padItems);
      }
      return res.json({ success: true, recommendations: result });
    } catch (err) {
      console.error("Gemini Recommendations failed, using fallback:", err);
    }
  }
  const fallbackRecs = otherProducts.filter((p) => p.category === currentProduct.category).slice(0, 3);
  if (fallbackRecs.length < 3) {
    const padCount = 3 - fallbackRecs.length;
    const fallbackIds = fallbackRecs.map((f) => String(f.id));
    const padItems = otherProducts.filter((p) => !fallbackIds.includes(String(p.id))).slice(0, padCount);
    fallbackRecs.push(...padItems);
  }
  const resultFallback = fallbackRecs.map((p) => ({
    ...p,
    aiReasonEn: "Similar Category Recommendation",
    aiReasonBn: "\u098F\u0995\u0987 \u0995\u09CD\u09AF\u09BE\u099F\u09BE\u0997\u09B0\u09BF\u09B0 \u09A6\u09BE\u09B0\u09C1\u09A3 \u09AA\u09A3\u09CD\u09AF"
  }));
  res.json({ success: true, recommendations: resultFallback });
});
app.get("/api/ai/search", async (req, res) => {
  const { q } = req.query;
  const searchStr = q ? String(q).trim() : "";
  if (!searchStr) {
    return res.json({ success: true, products: backendProducts });
  }
  if (ai) {
    try {
      const prompt = `You are a search query semantic analyzer and spell-corrector for an online store in Bangladesh.
The user search query is: "${searchStr}"

Here is the store's full database of products:
${backendProducts.map((p) => `- ID: ${p.id} | Name: ${p.name} | Bangla Name: ${p.banglaName || ""} | Category: ${p.category} | Keywords: ${p.description}`).join("\n")}

Determine which products the user is searching for, correcting typos (e.g. "tshrt" -> "T-Shirt", "punjabi" -> "Panjabi", "serum" -> "Face Serum", "valet" -> "Wallet", etc.) and matching semantic intent (e.g., "winter" -> clothing/tea, "beauty" -> serum, "presents" -> wallets/watches/panjabi).

Return the recommended product IDs sorted by relevance in strict JSON format.

JSON schema to follow:
{
  "matchedIds": ["id1", "id2"]
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              matchedIds: {
                type: import_genai.Type.ARRAY,
                items: { type: import_genai.Type.STRING }
              }
            },
            required: ["matchedIds"]
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      const matchedIds = data.matchedIds || [];
      let matchedProducts2 = matchedIds.map((id) => backendProducts.find((p) => String(p.id) === String(id))).filter(Boolean);
      if (matchedProducts2.length === 0) {
        matchedProducts2 = backendProducts.filter(
          (p) => p.name.toLowerCase().includes(searchStr.toLowerCase()) || p.banglaName && p.banglaName.toLowerCase().includes(searchStr.toLowerCase()) || p.category.toLowerCase().includes(searchStr.toLowerCase()) || p.description.toLowerCase().includes(searchStr.toLowerCase())
        );
      }
      return res.json({ success: true, products: matchedProducts2, method: "semantic" });
    } catch (err) {
      console.error("Gemini Semantic Search failed, falling back:", err);
    }
  }
  const matchedProducts = backendProducts.filter(
    (p) => p.name.toLowerCase().includes(searchStr.toLowerCase()) || p.banglaName && p.banglaName.toLowerCase().includes(searchStr.toLowerCase()) || p.category.toLowerCase().includes(searchStr.toLowerCase()) || p.description.toLowerCase().includes(searchStr.toLowerCase())
  );
  res.json({ success: true, products: matchedProducts, method: "text-fallback" });
});
app.post("/api/ai/copywrite", async (req, res) => {
  const { name, category, price } = req.body;
  if (!name) {
    return res.status(400).json({ error: "Product name is required" });
  }
  if (ai) {
    try {
      const prompt = `You are an expert e-commerce copywriter specializing in SEO-friendly, high-conversion product descriptions for the Bangladeshi market.
Create a premium product description and landing page description for:
- Product Name: ${name}
- Category: ${category || "General"}
- Price: ${price ? price + " BDT" : "Varies"}

Provide descriptions in BOTH English and Bangla (Bengali).
Keep descriptions highly engaging, detailing key benefits, premium feel, and appealing directly to online shoppers in Bangladesh.

Return the response in strict JSON format.

JSON schema to follow:
{
  "descriptionEn": "Catchy 2-3 sentence product description in English",
  "descriptionBn": "Catchy 2-3 sentence product description in Bangla",
  "landingDescriptionEn": "Detailed, rich SEO-friendly landing page text in English (paragraphs and highlights)",
  "landingDescriptionBn": "Detailed, rich SEO-friendly landing page text in Bangla (paragraphs and highlights)"
}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              descriptionEn: { type: import_genai.Type.STRING },
              descriptionBn: { type: import_genai.Type.STRING },
              landingDescriptionEn: { type: import_genai.Type.STRING },
              landingDescriptionBn: { type: import_genai.Type.STRING }
            },
            required: ["descriptionEn", "descriptionBn", "landingDescriptionEn", "landingDescriptionBn"]
          }
        }
      });
      const data = JSON.parse(response.text || "{}");
      return res.json({ success: true, ...data });
    } catch (err) {
      console.error("Gemini copywriting failed:", err);
      return res.status(500).json({ error: err.message || "Failed to generate copy" });
    }
  }
  res.json({
    success: true,
    descriptionEn: `Introducing the premium ${name}. Designed for style, convenience, and superior performance. Buy now with Cash on Delivery across Bangladesh!`,
    descriptionBn: `\u09AA\u09C7\u09B6 \u0995\u09B0\u099B\u09BF \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF\u09B0 ${name}\u0964 \u098F\u099F\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u099C\u09C0\u09AC\u09A8\u09C7 \u09AF\u09CB\u0997 \u0995\u09B0\u09AC\u09C7 \u0986\u09AD\u09BF\u099C\u09BE\u09A4\u09CD\u09AF \u098F\u09AC\u0982 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u0986\u09B0\u09BE\u09AE\u09A6\u09BE\u09DF\u0995 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u0964 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF\u09A4\u09C7 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8 \u0986\u099C\u0987!`,
    landingDescriptionEn: `Discover the ultimate premium ${name}. Handcrafted and carefully curated to ensure the finest quality for online shoppers. Featuring high durability, exceptional design aesthetics, and great value for money. Order now to get fast home delivery and live order tracking.`,
    landingDescriptionBn: `\u0989\u09AA\u09AD\u09CB\u0997 \u0995\u09B0\u09C1\u09A8 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u0985\u09B0\u09BF\u099C\u09BF\u09A8\u09BE\u09B2 \u098F\u09AC\u0982 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF\u09B0 ${name}\u0964 \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u099F\u09BF \u09AA\u09A3\u09CD\u09AF \u0995\u09CD\u09B0\u09C7\u09A4\u09BE\u09A6\u09C7\u09B0 \u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09B8\u09A8\u09CD\u09A4\u09C1\u09B7\u09CD\u099F\u09BF \u09A8\u09BF\u09B6\u09CD\u099A\u09BF\u09A4 \u0995\u09B0\u09A4\u09C7 \u09AC\u09BF\u09B6\u09C7\u09B7\u09AD\u09BE\u09AC\u09C7 \u09AC\u09BE\u099B\u09BE\u0987 \u0995\u09B0\u09BE \u09B9\u09DF\u0964 \u0986\u0995\u09B0\u09CD\u09B7\u09A3\u09C0\u09DF \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u098F\u09AC\u0982 \u09A6\u09C0\u09B0\u09CD\u0998\u09B8\u09CD\u09A5\u09BE\u09DF\u09BF\u09A4\u09CD\u09AC\u09C7\u09B0 \u09A8\u09BF\u09B6\u09CD\u099A\u09DF\u09A4\u09BE\u09B8\u09B9 \u0986\u099C\u0987 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8\u0964 \u09B8\u09BE\u09B0\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u09E9-\u09EB \u09A6\u09BF\u09A8\u09C7 \u09B9\u09CB\u09AE \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u098F\u09AC\u0982 \u09B2\u09BE\u0987\u09AD \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE!`
  });
});
app.get("/api/products/search", (req, res) => {
  const { q, category, priceMin, priceMax, minRating, stockStatus, sortBy } = req.query;
  let result = [...backendProducts];
  if (q) {
    const searchStr = String(q).toLowerCase().trim();
    result = result.filter(
      (p) => p.name.toLowerCase().includes(searchStr) || p.banglaName && p.banglaName.toLowerCase().includes(searchStr) || p.description.toLowerCase().includes(searchStr) || p.banglaDescription && p.banglaDescription.toLowerCase().includes(searchStr) || p.category.toLowerCase().includes(searchStr)
    );
  }
  if (category && category !== "all" && category !== "All") {
    const catStr = String(category).toLowerCase();
    result = result.filter((p) => p.category.toLowerCase() === catStr);
  }
  if (priceMin !== void 0) {
    result = result.filter((p) => {
      const activePrice = p.isFlashSale && p.flashSalePrice ? p.flashSalePrice : p.price;
      return activePrice >= Number(priceMin);
    });
  }
  if (priceMax !== void 0) {
    result = result.filter((p) => {
      const activePrice = p.isFlashSale && p.flashSalePrice ? p.flashSalePrice : p.price;
      return activePrice <= Number(priceMax);
    });
  }
  if (minRating !== void 0) {
    result = result.filter((p) => p.rating >= Number(minRating));
  }
  if (stockStatus) {
    if (stockStatus === "in_stock" || stockStatus === "instock") {
      result = result.filter((p) => p.stock > 0);
    } else if (stockStatus === "out_of_stock" || stockStatus === "outofstock") {
      result = result.filter((p) => p.stock <= 0);
    }
  }
  if (sortBy === "newest") {
    result.sort((a, b) => Number(b.id) - Number(a.id));
  } else if (sortBy === "price_low_high" || sortBy === "priceAsc") {
    result.sort((a, b) => {
      const ap = a.isFlashSale && a.flashSalePrice ? a.flashSalePrice : a.price;
      const bp = b.isFlashSale && b.flashSalePrice ? b.flashSalePrice : b.price;
      return ap - bp;
    });
  } else if (sortBy === "price_high_low" || sortBy === "priceDesc") {
    result.sort((a, b) => {
      const ap = a.isFlashSale && a.flashSalePrice ? a.flashSalePrice : a.price;
      const bp = b.isFlashSale && b.flashSalePrice ? b.flashSalePrice : b.price;
      return bp - ap;
    });
  } else if (sortBy === "rating") {
    result.sort((a, b) => b.rating - a.rating);
  } else {
    result.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
  }
  res.json({
    success: true,
    count: result.length,
    products: result
  });
});
app.post("/api/upload", async (req, res) => {
  const { file } = req.body;
  if (!file) {
    return res.status(400).json({ error: "No image file provided" });
  }
  const keys = getApiKeys();
  const cloudName = keys.cloudinaryCloudName;
  const apiKey2 = keys.cloudinaryApiKey;
  const apiSecret = keys.cloudinaryApiSecret;
  const uploadPreset = keys.cloudinaryUploadPreset;
  const isPlaceholderKey = (val) => {
    if (!val) return true;
    const lower = val.trim().toLowerCase();
    return lower === "" || lower.includes("placeholder") || lower.includes("your_") || lower.includes("<your") || lower.includes("your-") || lower.includes("cloudinary_api_key") || lower.includes("cloudinary_api_secret") || lower.includes("\u0986\u09AA\u09A8\u09BE\u09B0_");
  };
  const isApiPlaceholder = isPlaceholderKey(apiKey2) || isPlaceholderKey(apiSecret);
  if (!cloudName) {
    console.log("Cloudinary is not configured. Falling back to local Base64 storage.");
    return res.json({
      success: true,
      url: file,
      // Keep the base64 string
      fallback: true,
      message: "Using local storage (Base64) because Cloudinary is not configured in your Secrets."
    });
  }
  try {
    const formData = new URLSearchParams();
    formData.append("file", file);
    if (apiKey2 && apiSecret && !isApiPlaceholder) {
      const timestamp = Math.round((/* @__PURE__ */ new Date()).getTime() / 1e3).toString();
      const signatureString = `timestamp=${timestamp}${apiSecret}`;
      const signature = import_crypto.default.createHash("sha1").update(signatureString).digest("hex");
      formData.append("api_key", apiKey2);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
    } else {
      formData.append("upload_preset", uploadPreset);
    }
    console.log(`Uploading to Cloudinary [Cloud: ${cloudName}]...`);
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData
    });
    const data = await response.json();
    if (data && data.secure_url) {
      console.log("Cloudinary Upload Success:", data.secure_url);
      return res.json({
        success: true,
        url: data.secure_url,
        message: "Successfully uploaded to Cloudinary!"
      });
    } else {
      console.error("Cloudinary returned an error:", data);
      return res.status(500).json({
        error: data.error?.message || "Failed to upload to Cloudinary. Check your Cloudinary keys or Preset.",
        fallbackUrl: file
      });
    }
  } catch (err) {
    console.error("Cloudinary connection error:", err);
    return res.status(500).json({
      error: "Cloudinary server communication failed.",
      fallbackUrl: file
    });
  }
});
async function triggerBrevoEmail(order, summary) {
  const keys = getApiKeys();
  const brevoApiKey = keys.brevoApiKey;
  const senderEmail = keys.brevoSenderEmail;
  const senderName = keys.brevoSenderName;
  if (!brevoApiKey || brevoApiKey === "\u0986\u09AA\u09A8\u09BE\u09B0_\u09AC\u09CD\u09B0\u09C7\u09AD\u09CB_\u098F\u09AA\u09BF\u0986\u0987_\u0995\u09BF" || brevoApiKey === "\u0986\u09AA\u09A8\u09BE\u09B0_\u09AC\u09CD\u09B0\u09C7\u09AD\u09CB_\u098F\u09AA\u09BF\u0986\u0987_\u0995\u09BF_\u098F\u0996\u09BE\u09A8\u09C7_\u09A6\u09BF\u09A8") {
    console.log(`[Brevo Simulation] No BREVO_API_KEY set. Order confirmation email for ${order.id} was simulated. CC Admin Alert to: ${senderEmail}`);
    return;
  }
  const itemsHtml = order.cartItems.map((item) => {
    const prodName = item.product.banglaName || item.product.name;
    const itemPrice = item.price || (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price);
    return `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #2d3748;">
          <strong>${prodName}</strong>
          ${item.selectedSize ? `<br/><span style="font-size: 12px; color: #718096;">Size: ${item.selectedSize}</span>` : ""}
          ${item.selectedColor ? `<br/><span style="font-size: 12px; color: #718096;">Color: ${item.selectedColor}</span>` : ""}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #2d3748; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #edf2f7; font-size: 14px; color: #2d3748; text-align: right; font-weight: bold;">
          \u09F3${itemPrice * item.quantity}
        </td>
      </tr>
    `;
  }).join("");
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmed</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7fafc; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
        <!-- Header banner -->
        <div style="background-color: #3730a3; padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">\u{1F389} Order Confirmed!</h1>
          <p style="color: #c7d2fe; margin: 8px 0 0 0; font-size: 14px; font-weight: 500;">Thank you for shopping with ${senderName}</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #2d3748; margin-top: 0;">Hi <strong>${order.customerName}</strong>,</p>
          <p style="font-size: 14px; color: #4a5568; line-height: 1.6;">Your order has been logged in our system. Below are your purchase receipt and shipping details. You can track your shipping milestone in real-time on our website with your tracking number.</p>
          
          <!-- Order ID / Tracking Card -->
          <div style="background-color: #eef2ff; border: 1px solid #e0e7ff; border-radius: 12px; padding: 16px; margin: 20px 0; text-align: center;">
            <span style="font-size: 12px; color: #4338ca; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; display: block;">Tracking Number</span>
            <strong style="font-size: 24px; color: #312e81; font-family: monospace; display: block; margin: 4px 0;">${order.id}</strong>
            <p style="font-size: 11px; color: #6366f1; margin: 4px 0 0 0; font-weight: 600;">Use this tracking ID in our tracking panel to view live updates!</p>
          </div>
          
          <!-- Product Table -->
          <h3 style="font-size: 16px; color: #1a202c; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 24px 0 12px 0;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background-color: #f7fafc;">
                <th style="padding: 10px; text-align: left; font-size: 12px; color: #718096; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Item</th>
                <th style="padding: 10px; text-align: center; font-size: 12px; color: #718096; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Qty</th>
                <th style="padding: 10px; text-align: right; font-size: 12px; color: #718096; text-transform: uppercase; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <!-- Pricing summary -->
          <div style="width: 250px; margin-left: auto; margin-bottom: 24px;">
            <table style="width: 100%; font-size: 14px;">
              <tr>
                <td style="padding: 4px 0; color: #718096;">Subtotal:</td>
                <td style="padding: 4px 0; text-align: right; color: #2d3748; font-weight: 600;">\u09F3${summary.subtotal}</td>
              </tr>
              ${summary.discount > 0 ? `
              <tr>
                <td style="padding: 4px 0; color: #4338ca;">Discount:</td>
                <td style="padding: 4px 0; text-align: right; color: #4338ca; font-weight: 700;">-\u09F3${summary.discount}</td>
              </tr>` : ""}
              <tr>
                <td style="padding: 4px 0; color: #718096;">Shipping Fee:</td>
                <td style="padding: 4px 0; text-align: right; color: #2d3748; font-weight: 600;">\u09F3${summary.deliveryFee}</td>
              </tr>
              <tr style="border-top: 1px solid #edf2f7; font-weight: bold;">
                <td style="padding: 8px 0 0 0; color: #1a202c; font-size: 16px;">Total Paid:</td>
                <td style="padding: 8px 0 0 0; text-align: right; color: #3730a3; font-size: 18px;">\u09F3${summary.total}</td>
              </tr>
            </table>
          </div>
          
          <!-- Delivery Details -->
          <h3 style="font-size: 16px; color: #1a202c; border-bottom: 2px solid #edf2f7; padding-bottom: 8px; margin: 24px 0 12px 0;">Shipping Information</h3>
          <table style="width: 100%; font-size: 14px; border: 1px solid #edf2f7; border-radius: 8px; padding: 12px;">
            <tr>
              <td style="color: #718096; width: 120px; padding: 4px 0; font-weight: 600;">Customer Phone:</td>
              <td style="color: #2d3748; padding: 4px 0;">${order.customerPhone}</td>
            </tr>
            <tr>
              <td style="color: #718096; padding: 4px 0; font-weight: 600; vertical-align: top;">Address:</td>
              <td style="color: #2d3748; padding: 4px 0; line-height: 1.4;">
                ${order.customerAddress}, ${order.customerThana || ""}, ${order.customerDistrict}, ${order.customerDivision || ""}
              </td>
            </tr>
            <tr>
              <td style="color: #718096; padding: 4px 0; font-weight: 600;">Payment Method:</td>
              <td style="color: #2d3748; padding: 4px 0; text-transform: uppercase; font-weight: bold;">
                ${order.paymentMethod === "online" ? `Online (${order.onlineGatewayType?.toUpperCase() || "Manual"})` : "Cash on Delivery"}
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f7fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #a0aec0;">
          <p style="margin: 0 0 8px 0;">This email was sent automatically to confirm your purchase.</p>
          <p style="margin: 0;">&copy; 2026 ${senderName}. All Rights Reserved. Bangladesh.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  const recipients = [];
  if (order.customerEmail) {
    recipients.push({ email: order.customerEmail, name: order.customerName });
  }
  recipients.push({ email: senderEmail, name: `Admin Alert (${senderName})` });
  try {
    console.log(`[Brevo API] Sending transactional emails via Brevo for Order ${order.id}...`);
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: recipients,
        subject: `[JOHURUL BDShop] Order Confirmed - ${order.id} (\u09F3${summary.total})`,
        htmlContent
      })
    });
    if (response.ok) {
      console.log(`[Brevo API] Order confirmation email successfully sent for Order ${order.id}!`);
      lastBrevoError = null;
    } else {
      const errBody = await response.text();
      console.error(`[Brevo API Error] Failed to send email via Brevo:`, errBody);
      lastBrevoError = errBody;
    }
  } catch (error) {
    console.error("[Brevo API Catch Error] Failed to connect to Brevo SMTP servers:", error);
    lastBrevoError = error.message || "Failed to connect to Brevo SMTP servers";
  }
}
app.post("/api/checkout", (req, res) => {
  const {
    customerName,
    customerPhone,
    customerAddress,
    customerDivision = "Dhaka (\u09A2\u09BE\u0995\u09BE)",
    customerDistrict = "Dhaka (\u09A2\u09BE\u0995\u09BE)",
    customerThana,
    cartItems,
    couponCode,
    paymentMethod = "cod",
    onlineGatewayType,
    paymentTransactionId,
    fbCampaignRef,
    customerEmail
  } = req.body;
  if (!customerName || !customerPhone || !customerAddress) {
    return res.status(400).json({ error: "Customer name, phone, and detailed address are required" });
  }
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ error: "Cart items cannot be empty" });
  }
  for (const item of cartItems) {
    const dbProd = backendProducts.find((p) => p.id === item.product.id);
    if (!dbProd) {
      return res.status(404).json({ error: `Product with ID "${item.product.id}" not found.` });
    }
    if (dbProd.stock < item.quantity) {
      return res.status(400).json({
        error: `Insufficient stock for product "${dbProd.name}". Available stock is ${dbProd.stock}.`
      });
    }
  }
  let cartSubtotal = 0;
  cartItems.forEach((item) => {
    const activePrice = item.price || (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price);
    cartSubtotal += activePrice * item.quantity;
  });
  let discountAmount = 0;
  let validatedCoupon = null;
  if (couponCode) {
    const cleanCode = String(couponCode).trim().toUpperCase();
    const coupon = backendCoupons.find((c) => c.code === cleanCode && c.isActive);
    if (coupon) {
      if (cartSubtotal >= coupon.minPurchase) {
        validatedCoupon = coupon;
        if (coupon.type === "percentage") {
          discountAmount = Math.round(cartSubtotal * coupon.value / 100);
        } else {
          discountAmount = coupon.value;
        }
      }
    }
  }
  const isInsideDhaka = customerDistrict.toLowerCase().includes("dhaka") || customerDivision.toLowerCase().includes("dhaka");
  const deliveryCharge = isInsideDhaka ? 60 : 120;
  const finalPayable = Math.max(0, cartSubtotal - discountAmount + deliveryCharge);
  cartItems.forEach((item) => {
    const dbProd = backendProducts.find((p) => p.id === item.product.id);
    dbProd.stock = Math.max(0, dbProd.stock - item.quantity);
    dbProd.salesCount = (dbProd.salesCount || 0) + item.quantity;
  });
  const orderId = `TRK-${Math.floor(1e4 + Math.random() * 9e4)}`;
  const newOrder = {
    id: orderId,
    customerName,
    customerPhone,
    customerAddress,
    customerDivision,
    customerDistrict,
    customerThana,
    cartItems,
    totalAmount: finalPayable,
    paymentMethod,
    onlineGatewayType: paymentMethod === "online" ? onlineGatewayType : void 0,
    paymentTransactionId: paymentMethod === "online" ? paymentTransactionId : void 0,
    status: "Order Received" /* RECEIVED */,
    trackingHistory: createDefaultTrackingHistory(/* @__PURE__ */ new Date()),
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    fbCampaignRef,
    customerEmail
  };
  backendOrders = [newOrder, ...backendOrders];
  triggerBrevoEmail(newOrder, {
    subtotal: cartSubtotal,
    discount: discountAmount,
    deliveryFee: deliveryCharge,
    total: finalPayable
  });
  res.status(201).json({
    success: true,
    message: "Order submitted and processed successfully!",
    orderId,
    order: newOrder,
    summary: {
      subtotal: cartSubtotal,
      discount: discountAmount,
      deliveryFee: deliveryCharge,
      total: finalPayable
    }
  });
});
app.get("/api/admin/analytics", (req, res) => {
  const nonCancelledOrders = backendOrders.filter((o) => o.status !== "Cancelled" /* CANCELLED */);
  const totalRevenue = nonCancelledOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  let totalCOGS = 0;
  let totalShippingCost = 0;
  let totalAdSpend = 0;
  nonCancelledOrders.forEach((order) => {
    order.cartItems.forEach((item) => {
      const activePrice = item.price || (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price);
      const costPrice = item.product.costPrice || Math.round(activePrice * 0.5);
      totalCOGS += costPrice * item.quantity;
    });
    totalShippingCost += 80;
    totalAdSpend += 220;
  });
  const overheadFixedCost = 3500;
  const totalExpenses = totalCOGS + totalShippingCost + totalAdSpend + overheadFixedCost;
  const netProfit = totalRevenue - totalExpenses;
  const totalOrdersCount = backendOrders.length;
  const successfulOrdersCount = backendOrders.filter((o) => o.status === "Delivered" /* DELIVERED */).length;
  const cancelledOrdersCount = backendOrders.filter((o) => o.status === "Cancelled" /* CANCELLED */).length;
  const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const profitMarginPercentage = totalRevenue > 0 ? Number((netProfit / totalRevenue * 100).toFixed(1)) : 0;
  const revenueByCategory = {};
  nonCancelledOrders.forEach((o) => {
    o.cartItems.forEach((item) => {
      const activePrice = item.price || (item.product.isFlashSale && item.product.flashSalePrice ? item.product.flashSalePrice : item.product.price);
      const cat = item.product.category || "General";
      const salesVal = activePrice * item.quantity;
      revenueByCategory[cat] = (revenueByCategory[cat] || 0) + salesVal;
    });
  });
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const salesOverTime = Array.from({ length: 7 }).map((_, idx) => {
    const d = /* @__PURE__ */ new Date();
    d.setDate(d.getDate() - (6 - idx));
    const dateStr = d.toISOString().split("T")[0];
    const dayName = daysOfWeek[d.getDay()];
    const daysOrders = nonCancelledOrders.filter((o) => o.createdAt.startsWith(dateStr));
    const revenue = daysOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const ordersCount = daysOrders.length;
    return {
      date: dateStr,
      day: dayName.substring(0, 3),
      revenue,
      orders: ordersCount
    };
  });
  res.json({
    success: true,
    summary: {
      totalRevenue,
      totalExpenses,
      netProfit,
      profitMarginPercentage,
      averageOrderValue
    },
    ordersStats: {
      totalOrders: totalOrdersCount,
      successfulOrders: successfulOrdersCount,
      cancelledOrders: cancelledOrdersCount,
      processingOrders: backendOrders.filter((o) => o.status === "Processing" /* PROCESSING */ || o.status === "Order Received" /* RECEIVED */).length
    },
    breakdown: {
      cogs: totalCOGS,
      shippingCost: totalShippingCost,
      adSpend: totalAdSpend,
      overheadFixed: overheadFixedCost
    },
    revenueByCategory,
    salesOverTime
  });
});
function generateSimulatedCopy(productName, price, language, platform = "facebook", style = "ugc_hook") {
  const finalPrice = price ? `${price}/- BDT` : "\u09B8\u09BE\u09B6\u09CD\u09B0\u09DF\u09C0 \u09AE\u09C2\u09B2\u09CD\u09AF";
  if (platform === "tiktok") {
    if (language === "bengali" || language === "both") {
      let styleTitle = "\u099F\u09CD\u09B0\u09C7\u09A8\u09CD\u09A1\u09BF\u0982 UGC (\u0987\u0989\u099C\u09BE\u09B0 \u099C\u09C7\u09A8\u09BE\u09B0\u09C7\u099F\u09C7\u09A1 \u0995\u09A8\u09CD\u099F\u09C7\u09A8\u09CD\u099F) \u09B9\u09C1\u0995";
      let hookVO = `"\u09AB\u09C7\u09B8\u09AC\u09C1\u0995 \u0986\u09B0 \u099F\u09BF\u0995\u099F\u0995\u09C7 \u098F\u0987 \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BE \u098F\u09A4\u09AC\u09BE\u09B0 \u09A6\u09C7\u0996\u09C7\u099B\u09BF \u09AF\u09C7 \u09B6\u09C7\u09B7\u09AE\u09C7\u09B6 \u0995\u09BF\u09A8\u09C7\u0987 \u09AB\u09C7\u09B2\u09B2\u09BE\u09AE! \u0986\u09B0 \u09B8\u09A4\u09CD\u09AF\u09BF \u09AC\u09B2\u09A4\u09C7..."`;
      if (style === "problem_solution") {
        styleTitle = "\u09B8\u09AE\u09B8\u09CD\u09AF\u09BE \u0993 \u09B8\u09AE\u09BE\u09A7\u09BE\u09A8 \u09B8\u09CD\u099F\u09BE\u0987\u09B2 (Pain-point Solver)";
        hookVO = `"\u0986\u09AA\u09A8\u09BE\u09B0 \u0995\u09BF \u09AA\u09CD\u09B0\u09A4\u09BF\u09A6\u09BF\u09A8 \u098F\u0987 \u09A7\u09B0\u09A3\u09C7\u09B0 \u09B8\u09AE\u09B8\u09CD\u09AF\u09BE\u09DF \u09AA\u09DC\u09A4\u09C7 \u09B9\u09DF? \u09A4\u09BE\u09B9\u09B2\u09C7 \u098F\u0987 \u09AD\u09BF\u09A1\u09BF\u0993\u099F\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF\u0987!"`;
      } else if (style === "asmr_unboxing") {
        styleTitle = "ASMR \u0993 \u098F\u09B8\u09CD\u09A5\u09C7\u099F\u09BF\u0995 \u0986\u09A8\u09AC\u0995\u09CD\u09B8\u09BF\u0982";
        hookVO = `"*\u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F \u0996\u09CB\u09B2\u09BE\u09B0 \u09B8\u09C1\u09A8\u09CD\u09A6\u09B0 \u09AE\u09C3\u09A6\u09C1 \u09B6\u09AC\u09CD\u09A6* \u0986\u09B9! \u098F\u09AC\u09BE\u09B0 \u09A6\u09C7\u0996\u09C1\u09A8 \u0986\u09B8\u09B2 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u0995\u09BE\u0995\u09C7 \u09AC\u09B2\u09C7..."`;
      } else if (style === "direct_promo") {
        styleTitle = "\u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u09A7\u09BE\u09AE\u09BE\u0995\u09BE \u0985\u09AB\u09BE\u09B0 \u09AA\u09CD\u09B0\u09CB\u09AE\u09CB";
        hookVO = `"\u09A5\u09BE\u09AE\u09C1\u09A8! \u0986\u09AA\u09A8\u09BF \u0995\u09BF \u098F\u0996\u09A8\u0993 \u09AC\u09BE\u099C\u09BE\u09B0\u09C7 \u09B8\u09C7\u09B0\u09BE \u09AE\u09C2\u09B2\u09CD\u09AF\u09C7 \u09B8\u09A0\u09BF\u0995 \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BF \u0996\u09C1\u0981\u099C\u099B\u09C7\u09A8? \u0986\u099C\u0987 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8!"`;
      }
      return `\u{1F3AC} [\u09AD\u09BF\u09A1\u09BF\u0993 \u0986\u0987\u09A1\u09BF\u09DF\u09BE]: ${styleTitle} - "\u0986\u09AE\u09BE\u09B0 \u099C\u09C0\u09AC\u09A8 \u09AC\u09A6\u09B2\u09C7 \u09A6\u09C7\u0993\u09DF\u09BE \u098F\u0995\u099F\u09BF \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F!"

\u{1F552} \u09E6:\u09E6\u09E6 - \u09E6:\u09E6\u09E9 [\u09AD\u09BF\u09A1\u09BF\u0993 \u09A6\u09C3\u09B6\u09CD\u09AF]: \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BF \u0986\u09A8\u09AC\u0995\u09CD\u09B8 \u0995\u09B0\u09BE \u09B9\u099A\u09CD\u099B\u09C7, \u09AC\u09CD\u09AF\u09BE\u0995\u0997\u09CD\u09B0\u09BE\u0989\u09A8\u09CD\u09A1\u09C7 \u098F\u0995\u099F\u09BF \u099F\u09CD\u09B0\u09C7\u09A8\u09CD\u09A1\u09BF\u0982 \u0986\u09AA\u09AC\u09BF\u099F \u09AE\u09BF\u0989\u099C\u09BF\u0995 \u09AC\u09BE\u099C\u099B\u09C7\u0964
\u{1F399}\uFE0F [\u09AD\u09DF\u09C7\u09B8\u0993\u09AD\u09BE\u09B0]: ${hookVO}

\u{1F552} \u09E6:\u09E6\u09E9 - \u09E6:\u09E7\u09E8 [\u09AD\u09BF\u09A1\u09BF\u0993 \u09A6\u09C3\u09B6\u09CD\u09AF]: \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F\u099F\u09BF\u09B0 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u09AB\u09BF\u09A8\u09BF\u09B6 \u0995\u09CD\u09B2\u09CB\u099C-\u0986\u09AA\u09C7 \u09A6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u099A\u09CD\u099B\u09C7 \u098F\u09AC\u0982 \u0995\u09C0\u09AD\u09BE\u09AC\u09C7 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u09B9\u09DF \u09A4\u09BE \u09A6\u09C7\u0996\u09BE\u09A8\u09CB \u09B9\u099A\u09CD\u099B\u09C7\u0964
\u{1F399}\uFE0F [\u09AD\u09DF\u09C7\u09B8\u0993\u09AD\u09BE\u09B0]: "\u098F\u09B0 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u09B8\u09A4\u09CD\u09AF\u09BF\u0987 \u0985\u09B8\u09BE\u09A7\u09BE\u09B0\u09A3! \u098F\u099F\u09BF \u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09A4\u09BF\u09A6\u09BF\u09A8\u09C7\u09B0 \u0995\u09BE\u099C\u0995\u09C7 \u0995\u09B0\u09C7 \u09A4\u09C1\u09B2\u09AC\u09C7 \u0985\u09A8\u09C7\u0995 \u09B8\u09B9\u099C \u0986\u09B0 \u0986\u09B0\u09BE\u09AE\u09A6\u09BE\u09DF\u0995\u0964"

\u{1F552} \u09E6:\u09E7\u09E8 - \u09E6:\u09E7\u09EB [\u09AD\u09BF\u09A1\u09BF\u0993 \u09A6\u09C3\u09B6\u09CD\u09AF]: \u09AB\u09CB\u09A8\u09C7\u09B0 \u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09A8\u09C7 \u09B2\u09BE\u0987\u09AD \u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u0993 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09AA\u09BE\u09B0\u09CD\u09B8\u09C7\u09B2 \u09AA\u09BE\u0993\u09DF\u09BE\u09B0 \u09A6\u09C3\u09B6\u09CD\u09AF\u0964
\u{1F399}\uFE0F [\u09AD\u09DF\u09C7\u09B8\u0993\u09AD\u09BE\u09B0]: "\u09B8\u09AC\u099A\u09C7\u09AF\u09BC\u09C7 \u09AD\u09BE\u09B2\u09CB \u09B2\u09C7\u0997\u09C7\u099B\u09C7 \u098F\u09A6\u09C7\u09B0 \u09B2\u09BE\u0987\u09AD \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u0986\u09B0 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE!"

\u{1F4AC} [\u0985\u09A8-\u09B8\u09CD\u0995\u09CD\u09B0\u09BF\u09A8 \u0995\u09CD\u09AF\u09BE\u09AA\u09B6\u09A8 \u09AC\u09BE \u09B8\u09BE\u09AC\u099F\u09BE\u0987\u099F\u09C7\u09B2]:
\u{1F449} \u09AE\u09BE\u09A4\u09CD\u09B0 ${finalPrice} \u099F\u09BE\u0995\u09BE\u09DF \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF!
\u{1F449} \u09B8\u09BE\u09B0\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF!
\u{1F449} \u0998\u09B0\u09C7 \u09AC\u09B8\u09C7\u0987 \u09B2\u09BE\u0987\u09AD \u0995\u09C1\u09B0\u09BF\u09DF\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE!

\u{1F4DD} [\u099F\u09BF\u0995\u099F\u0995 \u09AA\u09CB\u09B8\u09CD\u099F \u0995\u09CD\u09AF\u09BE\u09AA\u09B6\u09A8]:
TikTok made me buy it! \u{1F631} \u0985\u09AC\u09B6\u09C7\u09B7\u09C7 \u09AA\u09C7\u09DF\u09C7 \u0997\u09C7\u09B2\u09BE\u09AE \u0986\u09B8\u09B2 "${productName}"\u0964 \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u099C\u09BE\u09B8\u09CD\u099F \u0993\u09DF\u09BE\u0993! \u098F\u0996\u09A8\u0987 \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 \u09A8\u09BF\u099A\u09C7\u09B0 "Shop Now" \u09AC\u09BE\u099F\u09A8\u09C7 \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8! \u{1F447}\u2728
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
      return `\u{1F3AC} [Video Idea]: ${styleTitle} - "TikTok Made Me Buy It!"

\u{1F552} 0:00 - 0:03 [Visual]: Fast unboxing with a clean ASMR sound and upbeat trending background music.
\u{1F399}\uFE0F [Voiceover]: ${hookVO}

\u{1F552} 0:03 - 0:12 [Visual]: Close-up showing the premium textures and demonstrating how easily it works in real-time.
\u{1F399}\uFE0F [Voiceover]: "And honestly? It lives up to the hype! The quality is amazing and it literally saves so much time."

\u{1F552} 0:12 - 0:15 [Visual]: Showcasing the dynamic live courier tracking map on a mobile phone screen.
\u{1F399}\uFE0F [Voiceover]: "Plus, they have super fast cash on delivery and real-time live tracking!"

\u{1F4AC} [On-Screen Captions]:
\u{1F449} Premium quality for only ${finalPrice}!
\u{1F449} Fast Cash on Delivery Nationwide!
\u{1F449} Live Order Tracking Link!

\u{1F4DD} [TikTok Post Caption]:
Can't believe I waited this long to get the "${productName}"! \u{1F60D} Game changer and totally worth the hype. Get yours now with Cash on Delivery! \u{1F447}\u2728
#tiktokmademebuyit #trending #shopping #unboxing #ugc #foryoupage #viral`;
    }
  }
  if (language === "bengali" || language === "both") {
    return `\u{1F525} \u09B8\u09C0\u09AE\u09BF\u09A4 \u0985\u09AB\u09BE\u09B0! \u0986\u09AA\u09A8\u09BE\u09B0 \u099C\u09A8\u09CD\u09AF \u09A8\u09BF\u09DF\u09C7 \u098F\u09B2\u09BE\u09AE \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF\u09B0 "${productName}"!

\u{1F6D2} \u0986\u09AA\u09A8\u09BE\u09B0 \u09A6\u09C8\u09A8\u09A8\u09CD\u09A6\u09BF\u09A8 \u099C\u09C0\u09AC\u09A8\u0995\u09C7 \u0986\u09B0\u0993 \u09B8\u09B9\u099C \u0993 \u0986\u09B0\u09BE\u09AE\u09A6\u09BE\u09DF\u0995 \u0995\u09B0\u09A4\u09C7 \u098F\u0987 \u09AA\u09A3\u09CD\u09AF\u099F\u09BF \u0985\u09A4\u09CD\u09AF\u09A8\u09CD\u09A4 \u0995\u09BE\u09B0\u09CD\u09AF\u0995\u09B0\u0964 \u09A8\u09BF\u0996\u09C1\u0981\u09A4 \u09A1\u09BF\u099C\u09BE\u0987\u09A8 \u098F\u09AC\u0982 \u09A6\u09C1\u09B0\u09CD\u09A6\u09BE\u09A8\u09CD\u09A4 \u09B8\u09CD\u09A5\u09BE\u09DF\u09BF\u09A4\u09CD\u09AC\u09C7\u09B0 \u09B8\u09BE\u09A5\u09C7 \u098F\u099F\u09BF \u09A6\u09C7\u09AC\u09C7 \u09A6\u09C0\u09B0\u09CD\u0998\u09A6\u09BF\u09A8\u09C7\u09B0 \u09AC\u09CD\u09AF\u09AC\u09B9\u09BE\u09B0\u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE\u09B0 \u09A8\u09BF\u09B6\u09CD\u099A\u09DF\u09A4\u09BE\u0964

\u0995\u09C7\u09A8 \u0986\u09AE\u09BE\u09A6\u09C7\u09B0 \u09A5\u09C7\u0995\u09C7 "${productName}" \u0995\u09BF\u09A8\u09AC\u09C7\u09A8?
\u2705 \u09AA\u09CD\u09B0\u09BF\u09AE\u09BF\u09DF\u09BE\u09AE \u0995\u09CB\u09DF\u09BE\u09B2\u09BF\u099F\u09BF \u098F\u09AC\u0982 \u0986\u0995\u09B0\u09CD\u09B7\u09A3\u09C0\u09DF \u09AB\u09BF\u09A8\u09BF\u09B6\u09BF\u0982
\u2705 \u09B8\u09C7\u09B0\u09BE \u0993 \u09B8\u09BE\u09B6\u09CD\u09B0\u09DF\u09C0 \u09A6\u09BE\u09AE - \u09AE\u09BE\u09A4\u09CD\u09B0 ${finalPrice}
\u2705 \u09B8\u09BE\u09B0\u09BE \u09AC\u09BE\u0982\u09B2\u09BE\u09A6\u09C7\u09B6\u09C7 \u09A6\u09CD\u09B0\u09C1\u09A4 \u0995\u09CD\u09AF\u09BE\u09B6 \u0985\u09A8 \u09A1\u09C7\u09B2\u09BF\u09AD\u09BE\u09B0\u09BF (Cash on Delivery)
\u2705 \u09B2\u09BE\u0987\u09AD \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u099F\u09CD\u09B0\u09CD\u09AF\u09BE\u0995\u09BF\u0982 \u09B8\u09C1\u09AC\u09BF\u09A7\u09BE (\u0986\u09AA\u09A8\u09BE\u09B0 \u09AA\u09CD\u09B0\u09CB\u09A1\u09BE\u0995\u09CD\u099F \u0995\u09CB\u09A5\u09BE\u09DF \u0986\u099B\u09C7 \u0998\u09B0\u09C7 \u09AC\u09B8\u09C7\u0987 \u09A6\u09C7\u0996\u09C1\u09A8!)

\u{1F381} \u09AC\u09BF\u09B6\u09C7\u09B7 \u099B\u09BE\u09DC \u09AA\u09C7\u09A4\u09C7 \u0986\u099C\u0987 \u09B8\u09B0\u09BE\u09B8\u09B0\u09BF \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8!
\u{1F449} \u0985\u09B0\u09CD\u09A1\u09BE\u09B0 \u0995\u09B0\u09A4\u09C7 "Shop Now" \u09AC\u09BE\u099F\u09A8\u09C7 \u0995\u09CD\u09B2\u09BF\u0995 \u0995\u09B0\u09C1\u09A8 \u0985\u09A5\u09AC\u09BE \u09AA\u09C7\u099C\u09C7 \u0987\u09A8\u09AC\u0995\u09CD\u09B8 \u0995\u09B0\u09C1\u09A8\u0964`;
  } else {
    return `\u{1F525} SPECIAL OFFER! Introducing the Premium "${productName}"!

\u{1F6D2} Designed to make your daily life easier and more comfortable, this product delivers exceptional performance. Built with high-quality materials, it guarantees durability and a modern look.

Why Choose Our "${productName}"?
\u2705 Premium quality with elegant finish
\u2705 Unbeatable price of only ${finalPrice}
\u2705 Super-fast Cash on Delivery all over Bangladesh
\u2705 Live Order Tracking (Track exactly where your parcel is!)

\u{1F381} Click "Shop Now" to place your order or message our page to secure yours today!`;
  }
}
app.get("/api/admin/verify-keys", (req, res) => {
  const keys = getApiKeys();
  const cloudinaryCloudName = keys.cloudinaryCloudName;
  const cloudinaryApiKey = keys.cloudinaryApiKey;
  const cloudinaryApiSecret = keys.cloudinaryApiSecret;
  const cloudinaryUploadPreset = keys.cloudinaryUploadPreset;
  const isPlaceholderKey = (val) => {
    if (!val) return true;
    const lower = val.trim().toLowerCase();
    return lower === "" || lower.includes("placeholder") || lower.includes("your_") || lower.includes("<your") || lower.includes("your-") || lower.includes("cloudinary_api_key") || lower.includes("cloudinary_api_secret") || lower.includes("\u0986\u09AA\u09A8\u09BE\u09B0_");
  };
  const isCloudinaryApiPlaceholder = isPlaceholderKey(cloudinaryApiKey) || isPlaceholderKey(cloudinaryApiSecret);
  const brevoApiKey = keys.brevoApiKey;
  const brevoSenderEmail = keys.brevoSenderEmail;
  const brevoSenderName = keys.brevoSenderName;
  const geminiApiKey = process.env.GEMINI_API_KEY || "";
  res.json({
    success: true,
    cloudinary: {
      configured: !!(cloudinaryCloudName && cloudinaryCloudName !== "\u0986\u09AA\u09A8\u09BE\u09B0_\u0995\u09CD\u09B2\u09BE\u0989\u09A1_\u09A8\u09BE\u09AE"),
      cloudName: cloudinaryCloudName === "\u0986\u09AA\u09A8\u09BE\u09B0_\u0995\u09CD\u09B2\u09BE\u0989\u09A1_\u09A8\u09BE\u09AE" ? "" : cloudinaryCloudName,
      apiKey: cloudinaryApiKey && !isPlaceholderKey(cloudinaryApiKey) ? `${cloudinaryApiKey.slice(0, 4)}...${cloudinaryApiKey.slice(-2)}` : "",
      hasSecret: !!(cloudinaryApiSecret && !isPlaceholderKey(cloudinaryApiSecret)),
      uploadPreset: cloudinaryUploadPreset,
      isUnsignedOnly: isCloudinaryApiPlaceholder
    },
    brevo: {
      configured: !!(brevoApiKey && brevoApiKey !== "\u0986\u09AA\u09A8\u09BE\u09B0_\u09AC\u09CD\u09B0\u09C7\u09AD\u09CB_\u098F\u09AA\u09BF\u0986\u0987_\u0995\u09BF" && brevoApiKey !== "\u0986\u09AA\u09A8\u09BE\u09B0_\u09AC\u09CD\u09B0\u09C7\u09AD\u09CB_\u098F\u09AA\u09BF\u0986\u0987_\u0995\u09BF_\u098F\u0996\u09BE\u09A8\u09C7_\u09A6\u09BF\u09A8"),
      apiKey: brevoApiKey && brevoApiKey !== "\u0986\u09AA\u09A8\u09BE\u09B0_\u09AC\u09CD\u09B0\u09C7\u09AD\u09CB_\u098F\u09AA\u09BF\u0986\u0987_\u0995\u09BF" && brevoApiKey !== "\u0986\u09AA\u09A8\u09BE\u09B0_\u09AC\u09CD\u09B0\u09C7\u09AD\u09CB_\u098F\u09AA\u09BF\u0986\u0987_\u0995\u09BF_\u098F\u0996\u09BE\u09A8\u09C7_\u09A6\u09BF\u09A8" ? `${brevoApiKey.slice(0, 5)}...${brevoApiKey.slice(-2)}` : "",
      senderEmail: brevoSenderEmail,
      senderName: brevoSenderName,
      lastError: lastBrevoError
    },
    gemini: {
      configured: !!(geminiApiKey && geminiApiKey !== "MY_GEMINI_API_KEY")
    }
  });
});
app.post("/api/admin/test-email", async (req, res) => {
  const keys = getApiKeys();
  const brevoApiKey = keys.brevoApiKey;
  const senderEmail = keys.brevoSenderEmail;
  const senderName = keys.brevoSenderName;
  const { testEmail } = req.body;
  if (!brevoApiKey || brevoApiKey === "\u0986\u09AA\u09A8\u09BE\u09B0_\u09AC\u09CD\u09B0\u09C7\u09AD\u09CB_\u098F\u09AA\u09BF\u0986\u0987_\u0995\u09BF" || brevoApiKey === "\u0986\u09AA\u09A8\u09BE\u09B0_\u09AC\u09CD\u09B0\u09C7\u09AD\u09CB_\u098F\u09AA\u09BF\u0986\u0987_\u0995\u09BF_\u098F\u0996\u09BE\u09A8\u09C7_\u09A6\u09BF\u09A8") {
    return res.status(400).json({ error: "Brevo API Key is not configured on the server." });
  }
  const targetEmail = testEmail || senderEmail;
  const testHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Brevo API Integration Test</title>
    </head>
    <body style="font-family: sans-serif; background-color: #f3f4f6; padding: 30px;">
      <div style="max-width: 550px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; padding: 30px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="background-color: #e0e7ff; color: #4f46e5; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 6px 12px; border-radius: 9999px;">Diagnostics Pass</span>
          <h2 style="color: #1e1b4b; margin-top: 15px; font-size: 22px; font-weight: 800;">\u{1F680} Brevo Integration Works!</h2>
        </div>
        <p style="color: #374151; font-size: 15px; line-height: 1.6;">Hello,</p>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">This is an automated verification email sent by your e-commerce application <strong>${senderName}</strong>.</p>
        <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">If you received this email, it confirms that your <strong>BREVO_API_KEY</strong> is fully functional and successfully connected to Brevo's Transactional SMTP gateway!</p>
        
        <div style="background-color: #f9fafb; border-left: 4px solid #4f46e5; padding: 15px; margin: 25px 0; border-radius: 0 8px 8px 0;">
          <strong style="font-size: 12px; color: #4b5563; display: block; text-transform: uppercase; letter-spacing: 0.5px;">Test Details:</strong>
          <span style="font-size: 13px; color: #1f2937; font-family: monospace; display: block; margin-top: 4px;">Timestamp: ${(/* @__PURE__ */ new Date()).toLocaleString("en-US", { timeZone: "Asia/Dhaka" })} BST</span>
          <span style="font-size: 13px; color: #1f2937; font-family: monospace; display: block;">Sender: ${senderName} &lt;${senderEmail}&gt;</span>
        </div>

        <p style="color: #9ca3af; font-size: 11px; border-top: 1px solid #f3f4f6; padding-top: 15px; margin-top: 25px; text-align: center;">
          Johurul BDShop Admin Settings | Mymensingh, Bangladesh
        </p>
      </div>
    </body>
    </html>
  `;
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": brevoApiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: targetEmail, name: "Shop Admin / Test User" }],
        subject: `\u{1F514} [Johurul BDShop] Brevo SMTP API Connection Test - Success!`,
        htmlContent: testHtml
      })
    });
    if (response.ok) {
      lastBrevoError = null;
      return res.json({ success: true, message: `Successfully sent test email to ${targetEmail}!` });
    } else {
      const errBody = await response.text();
      lastBrevoError = errBody;
      return res.status(500).json({ error: `Brevo API returned error: ${errBody}` });
    }
  } catch (error) {
    lastBrevoError = error.message || "Failed to reach Brevo SMTP servers.";
    return res.status(500).json({ error: error.message || "Failed to reach Brevo SMTP servers." });
  }
});
app.post("/api/admin/save-keys", (req, res) => {
  const {
    brevoApiKey,
    brevoSenderEmail,
    brevoSenderName,
    cloudinaryCloudName,
    cloudinaryApiKey,
    cloudinaryApiSecret,
    cloudinaryUploadPreset
  } = req.body;
  const success = saveApiKeys({
    brevoApiKey: brevoApiKey ? brevoApiKey.trim() : void 0,
    brevoSenderEmail: brevoSenderEmail ? brevoSenderEmail.trim() : void 0,
    brevoSenderName: brevoSenderName ? brevoSenderName.trim() : void 0,
    cloudinaryCloudName: cloudinaryCloudName ? cloudinaryCloudName.trim() : void 0,
    cloudinaryApiKey: cloudinaryApiKey ? cloudinaryApiKey.trim() : void 0,
    cloudinaryApiSecret: cloudinaryApiSecret ? cloudinaryApiSecret.trim() : void 0,
    cloudinaryUploadPreset: cloudinaryUploadPreset ? cloudinaryUploadPreset.trim() : void 0
  });
  if (success) {
    return res.json({ success: true, message: "Settings saved successfully to keys-config.json!" });
  } else {
    return res.status(500).json({ error: "Failed to write keys-config.json file." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("Vite middleware mounted in Development mode.");
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
    console.log("Serving production static build.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
//# sourceMappingURL=server.cjs.map
