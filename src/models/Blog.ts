import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogDocument extends Document {
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
  // SEO fields
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  schemaType?: "Article" | "TechArticle" | "BlogPosting" | "NewsArticle";
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlogDocument>(
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
    content: {
      type: String,
      required: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [{ type: String }],
    readingTime: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    seoTitle: { type: String },
    seoDescription: { type: String },
    seoKeywords: [{ type: String }],
    ogImage: { type: String },
    canonicalUrl: { type: String },
    schemaType: {
      type: String,
      enum: ["Article", "TechArticle", "BlogPosting", "NewsArticle"],
      default: "Article",
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.index({ slug: 1 });
blogSchema.index({ published: 1, category: 1 });
blogSchema.index({ tags: 1 });
blogSchema.index(
  { title: "text", content: "text", excerpt: "text" },
  { weights: { title: 10, content: 5, excerpt: 3 } }
);

const Blog: Model<IBlogDocument> =
  mongoose.models.Blog || mongoose.model<IBlogDocument>("Blog", blogSchema);

export default Blog;
