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
import_dotenv.default.config();
var app = (0, import_express.default)();
app.use(import_express.default.json());
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
    fbCampaignRef
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
    fbCampaignRef
  };
  backendOrders = [newOrder, ...backendOrders];
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
