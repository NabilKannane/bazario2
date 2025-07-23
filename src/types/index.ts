export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'vendor' | 'buyer';
  avatar?: string;
  isVerified: boolean;
  profile: {
    phone?: string;
    address?: Address;
    bio?: string;
    socialLinks?: SocialLinks;
  };
  vendorInfo?: VendorInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorInfo {
  businessName: string;
  businessDescription: string;
  specialties: string[];
  isApproved: boolean;
  rating: number;
  totalSales: number;
  commission: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SocialLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string | Category;
  vendor: string | User;
  tags: string[];
  specifications: Record<string, any>;
  inventory: Inventory;
  shipping: ShippingInfo;
  status: 'draft' | 'active' | 'inactive' | 'sold_out';
  featured: boolean;
  views: number;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Inventory {
  stock: number;
  sku: string;
  isUnlimited: boolean;
  lowStockAlert: number;
}

export interface ShippingInfo {
  weight: number;
  dimensions: Dimensions;
  freeShipping: boolean;
  shippingCost: number;
  processingTime: string;
}

export interface Dimensions {
  length: number;
  width: number;
  height: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyer: string | User;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  paymentIntentId?: string;
  notes?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  product: string | Product;
  quantity: number;
  price: number;
  vendor: string | User;
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Review {
  _id: string;
  product: string | Product;
  buyer: string | User;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  createdAt: Date;
}
