export interface Product {
  id: string;
  name: string;
  banglaName?: string;
  description: string;
  banglaDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  supplierShop?: string;
  images?: string[]; // Multiple additional landing page images (3-4 images)
  landingDescription?: string; // Long landing page custom description
  banglaLandingDescription?: string; // Long landing page custom description in Bangla
}

export enum OrderStatus {
  RECEIVED = "Order Received",
  PROCESSING = "Processing",
  SHIPPED = "Shipped",
  OUT_FOR_DELIVERY = "Out for Delivery",
  DELIVERED = "Delivered",
  CANCELLED = "Cancelled"
}

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  banglaTitle: string;
  description: string;
  banglaDescription: string;
  timestamp: string;
  completed: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerDistrict: string;
  customerThana?: string;
  customerDivision?: string;
  cartItems: CartItem[];
  totalAmount: number;
  paymentMethod: "cod" | "card";
  status: OrderStatus;
  trackingHistory: TrackingStep[];
  createdAt: string;
  fbCampaignRef?: string;
}
