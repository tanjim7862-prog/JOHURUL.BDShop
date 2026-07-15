import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { Product, Order } from "../types";

// Firebase Config provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyA-LRsWtyFwEDHMoJyKBJ4wq2Gj2r_NqL8",
  authDomain: "johurul-bdshop.firebaseapp.com",
  projectId: "johurul-bdshop",
  storageBucket: "johurul-bdshop.firebasestorage.app",
  messagingSenderId: "720864526290",
  appId: "1:720864526290:web:708adcdf21bfb7f456920b",
  measurementId: "G-61Z8PMHKZY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Collection References
const PRODUCTS_COLL = "products";
const ORDERS_COLL = "orders";

/**
 * Fetch all products from Firestore
 */
export async function getProductsFromFirebase(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLL));
    const products: Product[] = [];
    querySnapshot.forEach((docSnap) => {
      products.push(docSnap.data() as Product);
    });
    return products;
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    throw error;
  }
}

/**
 * Recursively removes all undefined fields from an object to prevent Firestore serialization errors.
 */
function removeUndefinedFields<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => removeUndefinedFields(item)) as unknown as T;
  }
  
  if (typeof obj === "object") {
    const newObj = {} as any;
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const val = obj[key];
        if (val !== undefined) {
          newObj[key] = removeUndefinedFields(val);
        }
      }
    }
    return newObj as T;
  }
  
  return obj;
}

/**
 * Save or update a product in Firestore
 */
export async function saveProductToFirebase(product: Product): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLL, product.id);
    const cleanedProduct = removeUndefinedFields(product);
    await setDoc(productRef, cleanedProduct);
  } catch (error) {
    console.error(`Error saving product ${product.id} to Firestore:`, error);
    throw error;
  }
}

/**
 * Delete a product from Firestore
 */
export async function deleteProductFromFirebase(productId: string): Promise<void> {
  try {
    const productRef = doc(db, PRODUCTS_COLL, productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error(`Error deleting product ${productId} from Firestore:`, error);
    throw error;
  }
}

/**
 * Fetch all orders from Firestore
 */
export async function getOrdersFromFirebase(): Promise<Order[]> {
  try {
    const querySnapshot = await getDocs(collection(db, ORDERS_COLL));
    const orders: Order[] = [];
    querySnapshot.forEach((docSnap) => {
      orders.push(docSnap.data() as Order);
    });
    // Sort by creation date descending
    return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    console.error("Error fetching orders from Firestore:", error);
    throw error;
  }
}

/**
 * Save or update an order in Firestore
 */
export async function saveOrderToFirebase(order: Order): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLL, order.id);
    const cleanedOrder = removeUndefinedFields(order);
    await setDoc(orderRef, cleanedOrder);
  } catch (error) {
    console.error(`Error saving order ${order.id} to Firestore:`, error);
    throw error;
  }
}

/**
 * Update specific fields of an order (like status, trackingHistory)
 */
export async function updateOrderInFirebase(orderId: string, updates: Partial<Order>): Promise<void> {
  try {
    const orderRef = doc(db, ORDERS_COLL, orderId);
    const cleanedUpdates = removeUndefinedFields(updates);
    await updateDoc(orderRef, cleanedUpdates as any);
  } catch (error) {
    console.error(`Error updating order ${orderId} in Firestore:`, error);
    throw error;
  }
}
