import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techmintlab.com";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Service pages
    ...["web-development", "mobile-app-development", "saas-development", "crm-erp-development", "ui-ux-design", "ai-solutions", "devops", "digital-marketing", "seo-services"].map(
      (slug) => ({
        url: `${baseUrl}/services/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })
    ),
    // Legal pages
    ...[
      "privacy-policy",
      "terms",
      "refund-policy",
      "shipping-policy",
      "cancellation-policy",
      "disclaimer",
    ].map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
  ];

  // Dynamic blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    await connectDB();
    const posts = await Blog.find({ published: true })
      .select("slug updatedAt createdAt")
      .sort({ createdAt: -1 })
      .lean();

    blogPages = posts.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap blog fetch error:", error);
  }

  // Dynamic product pages
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await Product.find({ status: "active" })
      .select("slug updatedAt createdAt")
      .sort({ createdAt: -1 })
      .lean();

    productPages = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt || product.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Sitemap product fetch error:", error);
  }

  return [...staticPages, ...blogPages, ...productPages];
}
