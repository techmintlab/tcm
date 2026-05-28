import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductDocument extends Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  category: mongoose.Types.ObjectId;
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
  faqs: { question: string; answer: string }[];
  pricingPlans: {
    name: string;
    price: number;
    description: string;
    features: string[];
    isPopular: boolean;
    buttonText: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const pricingPlanSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    features: [{ type: String }],
    isPopular: { type: Boolean, default: false },
    buttonText: { type: String, default: "Buy Now" },
  },
  { _id: false }
);

const faqSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new Schema<IProductDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    thumbnail: {
      type: String,
      required: true,
    },
    images: [{ type: String }],
    videoUrl: { type: String },
    demoUrl: { type: String },
    githubUrl: { type: String },
    features: [{ type: String }],
    technologies: [{ type: String }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    downloads: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isTrending: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "active",
    },
    version: { type: String, default: "1.0.0" },
    fileUrl: { type: String },
    fileSize: { type: String },
    documentation: { type: String },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],
    faqs: [faqSchema],
    pricingPlans: [pricingPlanSchema],
  },
  {
    timestamps: true,
  }
);

productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ isFeatured: 1, isTrending: 1, status: 1 });
productSchema.index({ price: 1 });
productSchema.index(
  { title: "text", description: "text", "seoKeywords": "text" },
  { weights: { title: 10, description: 5, seoKeywords: 3 } }
);

const Product: Model<IProductDocument> =
  mongoose.models.Product ||
  mongoose.model<IProductDocument>("Product", productSchema);

export default Product;
