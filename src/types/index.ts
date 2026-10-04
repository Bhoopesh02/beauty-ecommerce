export type ProductVariant = {
  id: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  productType: string;
  price: number;
  comparePrice?: number;
  stock: number;
  sku: string;
  size?: string;
  images: string[];
  ingredients: string;
  benefits: string;
  howToUse: string;
  featured: boolean;
  bestseller: boolean;
  active: boolean;
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
  // keeping these for compatibility with existing UI
  type?: string; 
  concerns?: string[];
  image?: string; 
  averageRating?: number;
  reviewCount?: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // stored hashed/plain in mock
  role: "customer" | "admin";
  phone?: string;
  createdAt: string;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  type: "home" | "work" | "other";
  isDefault: boolean;
};

export type CartItem = {
  productId: string;
  variantId?: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
};

export type CheckoutMode = "cart" | "buy-now";

export type OrderItem = CartItem;

export type OrderStatus = "Placed" | "Confirmed" | "Packed" | "Shipped" | "Out for Delivery" | "Delivered" | "Cancelled";

export type StatusHistory = {
  status: OrderStatus;
  timestamp: string;
};

export type Order = {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: "Pending" | "Paid" | "Failed";
  orderStatus: OrderStatus;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
  statusHistory: StatusHistory[];
};
