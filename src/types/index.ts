import type { ReactNode } from "react";

// User Types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: "user" | "admin";
  emailVerified?: Date;
  phone?: string;
  company?: string;
  purchases: string[];
  downloads: string[];
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Product Types
export interface IProduct {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: ICategory | string;
  price: number;
  salePrice?: number;
  currency: string;
  thumbnail: string;
  images: string[];
  videoUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  features: string[];
  technologies: string[];
  rating: number;
  reviewCount: number;
  downloads: number;
  isFeatured: boolean;
  isTrending: boolean;
  status: "active" | "draft" | "archived";
  version: string;
  fileUrl: string;
  fileSize: string;
  documentation?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  faqs: IFAQ[];
  pricingPlans: IPricingPlan[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPricingPlan {
  name: string;
  price: number;
  description: string;
  features: string[];
  isPopular: boolean;
  buttonText: string;
}

export interface IFAQ {
  question: string;
  answer: string;
}

// Category Types
export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  parent?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

// Order Types
export interface IOrder {
  _id: string;
  orderId: string;
  user: IUser | string;
  products: { product: IProduct | string; price: number; plan?: string }[];
  totalAmount: number;
  discountAmount: number;
  couponCode?: string;
  paymentMethod: string;
  paymentId: string;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "processing" | "completed" | "cancelled";
  razorpayOrderId?: string;
  invoiceUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Blog Types
export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: number;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface IReview {
  _id: string;
  product: IProduct | string;
  user: IUser | string;
  rating: number;
  title: string;
  content: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: Date;
}

// Coupon Types
export interface ICoupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: Date;
  createdAt: Date;
}

// Testimonial Types
export interface ITestimonial {
  _id: string;
  name: string;
  company: string;
  designation: string;
  content: string;
  avatar: string;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
}

// Contact Types
export interface IContact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

// FAQ Types
export interface IFAQCategory {
  _id: string;
  category: string;
  faqs: IFAQ[];
  order: number;
  isActive: boolean;
  createdAt: Date;
}

// Navigation Types
export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: ReactNode;
  label?: string;
  children?: NavItem[];
}

// Site Config
export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  logo: string;
  links: {
    twitter: string;
    github: string;
    linkedin: string;
  };
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  monthlyRevenue: { month: string; revenue: number }[];
  recentOrders: IOrder[];
  popularProducts: IProduct[];
}
