import React, { useState } from "react";
import { Product, Order, OrderStatus } from "../types";
import { createDefaultTrackingHistory, updateTrackingHistory } from "../data";
import { 
  DollarSign, Package, ShoppingBag, TrendingUp, Edit3, Trash2, Plus, 
  X, Check, AlertCircle, ShoppingCart, Upload, Facebook, Code, ExternalLink, Copy, Share2
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
  onChangeHeroImageUrl
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"analytics" | "orders" | "products" | "pixel">("analytics");
  
  // Local state for pixel settings inputs (uncommitted until save)
  const [inputFbPixel, setInputFbPixel] = useState(fbPixelId);
  const [inputTtPixel, setInputTtPixel] = useState(ttPixelId);
  const [isPixelSaved, setIsPixelSaved] = useState(false);
  
  // Local state for banner image settings
  const [inputHeroImage, setInputHeroImage] = useState(heroImageUrl);
  const [isBannerSaved, setIsBannerSaved] = useState(false);
  
  // Product state
  const [isEditingProduct, setIsEditingProduct] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  
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
        stock: editingProduct.stock !== undefined ? Number(editingProduct.stock) : 10
      };
      onUpdateProducts([newProduct, ...products]);
    }
    setIsEditingProduct(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100 pb-px gap-6 overflow-x-auto">
        <button
          id="admin-tab-analytics"
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 font-bold text-sm tracking-wide transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "analytics"
              ? "border-[#3730a3] text-[#3730a3]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          📈 {lang === "bn" ? "অ্যানালিটিক্স ড্যাশবোর্ড" : "Analytics & Overview"}
        </button>
        <button
          id="admin-tab-orders"
          onClick={() => setActiveTab("orders")}
          className={`pb-3 font-bold text-sm tracking-wide transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "orders"
              ? "border-[#3730a3] text-[#3730a3]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          📦 {lang === "bn" ? "অর্ডার ম্যানেজমেন্ট" : "Orders Dashboard"}
          {activeOrdersCount > 0 && (
            <span className="ml-2 bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {activeOrdersCount}
            </span>
          )}
        </button>
        <button
          id="admin-tab-products"
          onClick={() => setActiveTab("products")}
          className={`pb-3 font-bold text-sm tracking-wide transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "products"
              ? "border-[#3730a3] text-[#3730a3]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          🛍️ {lang === "bn" ? "প্রোডাক্ট ম্যানেজার" : "Product Catalog"}
        </button>
        <button
          id="admin-tab-pixel"
          onClick={() => setActiveTab("pixel")}
          className={`pb-3 font-bold text-sm tracking-wide transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "pixel"
              ? "border-[#3730a3] text-[#3730a3]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          🚀 {lang === "bn" ? "মার্কেটিং ও পিক্সেল বুস্টিং" : "Facebook & TikTok Pixels"}
        </button>
      </div>

      {/* RENDER ANALYTICS */}
      {activeTab === "analytics" && (
        <div className="space-y-6">
          {/* Business Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{lang === "bn" ? "মোট বিক্রি" : "Total Revenue"}</span>
                <h4 className="text-indigo-900lue-600xl font-black text-gray-900 mt-1">৳{totalRevenue}</h4>
                <p className="text-[10px] text-[#3730a3] font-bold flex items-center gap-0.5 mt-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +12.5% {lang === "bn" ? "বৃদ্ধি" : "increase"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#3730a3] flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{lang === "bn" ? "মোট অর্ডার" : "Total Orders"}</span>
                <h4 className="text-indigo-900lue-600xl font-black text-gray-900 mt-1">{orders.length}</h4>
                <p className="text-[10px] text-gray-400 mt-1">
                  {lang === "bn" ? `ডিজিটাল ট্র্যাকিং সক্রিয়` : "Real-time logged"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{lang === "bn" ? "চলমান ডেলিভারি" : "Active Delivery"}</span>
                <h4 className="text-indigo-900lue-600xl font-black text-gray-900 mt-1">{activeOrdersCount}</h4>
                <p className="text-[10px] text-blue-800mber-600 font-semibold mt-1">
                  {lang === "bn" ? "কুরিয়ার ট্রানজিটে আছে" : "In-route with courier"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-blue-800mber-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">{lang === "bn" ? "গড় অর্ডারের মূল্য" : "Avg Order Value"}</span>
                <h4 className="text-indigo-900lue-600xl font-black text-gray-900 mt-1">৳{averageOrderValue}</h4>
                <p className="text-[10px] text-gray-400 mt-1">
                  {lang === "bn" ? "প্রতি কাস্টমার লেনদেন" : "Per-shopper basket size"}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Quick Orders Stream Table */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-indigo-900lue-600ase font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span>🚀</span> {lang === "bn" ? "সাম্প্রতিক বিক্রয় কার্যক্রম" : "Live Storefront Order Stream"}
            </h3>

            {orders.length === 0 ? (
              <div className="text-indigo-900enter py-8 text-gray-400 text-sm">
                {lang === "bn" ? "এখনও কোনো অর্ডার আসেনি।" : "No logged sales activities yet."}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-indigo-800 border-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3">{lang === "bn" ? "আইডি" : "Order ID"}</th>
                      <th className="pb-3">{lang === "bn" ? "গ্রাহক" : "Customer"}</th>
                      <th className="pb-3">{lang === "bn" ? "মোট মূল্য" : "Amount"}</th>
                      <th className="pb-3">{lang === "bn" ? "বর্তমান অবস্থা" : "Status"}</th>
                      <th className="pb-3">{lang === "bn" ? "প্রচার মাধ্যম" : "Referrer"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/50">
                        <td className="py-3.5 font-mono text-xs font-bold text-[#3730a3]">{order.id}</td>
                        <td className="py-3.5 font-medium">{order.customerName}</td>
                        <td className="py-3.5 font-semibold">৳{order.totalAmount}</td>
                        <td className="py-3.5">
                          <span className={`inline-block px-2.5 py-1 text-[10px] font-bold rounded-full ${
                            order.status === OrderStatus.DELIVERED
                              ? "bg-indigo-50 text-red-700 border border-indigo-800lue-100"
                              : order.status === OrderStatus.CANCELLED
                              ? "bg-indigo-50 text-red-700 border border-indigo-800lue-100"
                              : "bg-amber-50 text-blue-800mber-700 border border-amber-100"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-xs text-gray-400 font-semibold">
                          {order.fbCampaignRef ? (
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md font-mono">
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
      )}

      {/* RENDER ORDERS MANAGER */}
      {activeTab === "orders" && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-4 border-indigo-800 border-gray-100">
            <h3 className="text-indigo-900lue-600ase font-bold text-gray-800">
              {lang === "bn" ? "গ্রাহক অর্ডারের তালিকা" : "Manage Store Shipments"}
            </h3>
            <span className="text-xs text-gray-400 font-semibold">
              {lang === "bn" ? `সর্বমোট ${orders.length} টি অর্ডার` : `Total ${orders.length} orders recorded`}
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="text-indigo-900enter py-12 text-gray-400 text-sm">
              {lang === "bn" ? "কোনো অর্ডার পাওয়া যায়নি।" : "No client invoices found."}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {orders.map((order) => (
                <div key={order.id} className="py-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-gray-100 text-gray-800 px-2.5 py-0.5 rounded">
                        ID: {order.id}
                      </span>
                      {order.fbCampaignRef && (
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                          Facebook Campaign
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-gray-900 text-sm">{order.customerName} — {order.customerPhone}</h4>
                    <p className="text-xs text-gray-500">
                      📍 {order.customerAddress}, {order.customerThana ? `${order.customerThana}, ` : ""}{order.customerDistrict}{order.customerDivision ? `, ${order.customerDivision}` : ""}
                    </p>
                    {/* Cart summary */}
                    <p className="text-xs text-gray-400 truncate max-w-lg">
                      📦 {order.cartItems.map(item => `${item.product.name} (x${item.quantity})`).join(", ")}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full lg:w-auto justify-between lg:justify-end">
                    <div className="text-left lg:text-right">
                      <span className="text-xs text-gray-400 block">{lang === "bn" ? "মোট সংগ্রহ" : "COD Amount"}</span>
                      <span className="text-indigo-900lue-600ase font-bold text-gray-800">৳{order.totalAmount}</span>
                    </div>

                    {/* Status Select dropdown */}
                    <div className="flex items-center gap-2">
                      <select
                        id={`status-select-${order.id}`}
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-bold rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-red-500 ${
                          order.status === OrderStatus.DELIVERED
                            ? "bg-indigo-50 border-indigo-800lue-200 text-red-700"
                            : order.status === OrderStatus.CANCELLED
                            ? "bg-indigo-50 border-indigo-800lue-200 text-red-700"
                            : "bg-amber-50 border-amber-200 text-blue-800mber-700"
                        }`}
                      >
                        <option value={OrderStatus.RECEIVED}>Order Received</option>
                        <option value={OrderStatus.PROCESSING}>Processing</option>
                        <option value={OrderStatus.SHIPPED}>Shipped</option>
                        <option value={OrderStatus.OUT_FOR_DELIVERY}>Out for Delivery</option>
                        <option value={OrderStatus.DELIVERED}>Delivered</option>
                        <option value={OrderStatus.CANCELLED}>Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
                        <span className="text-[10px] font-mono text-gray-400 block">ID: {p.id}</span>
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
      {activeTab === "pixel" && (
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
                          setInputHeroImage("/src/assets/images/watch_banner_1784030925146.jpg");
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
    </div>
  );
}
