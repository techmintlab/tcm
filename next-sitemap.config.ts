import type { IConfig, ISitemapField } from "next-sitemap";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://techmintlab.com";

const config: IConfig = {
  siteUrl,
  generateRobotsTxt: true,

  exclude: [
    "/admin/*",
    "/dashboard/*",
    "/api/*",
    "/auth/*",
    "/cart",
    "/checkout",
    "/checkout/success",
    "/checkout/*",
  ],

  transform: async (_config, path) => {
    if (path === "/") {
      return { loc: path, changefreq: "daily", priority: 1.0, lastmod: new Date().toISOString() };
    }
    if (path === "/products") {
      return { loc: path, changefreq: "daily", priority: 0.9, lastmod: new Date().toISOString() };
    }
    if (path === "/blog") {
      return { loc: path, changefreq: "weekly", priority: 0.9, lastmod: new Date().toISOString() };
    }
    if (path === "/services") {
      return { loc: path, changefreq: "weekly", priority: 0.8, lastmod: new Date().toISOString() };
    }
    if (path === "/about" || path === "/contact") {
      return { loc: path, changefreq: "monthly", priority: 0.6, lastmod: new Date().toISOString() };
    }
    const legalPages = [
      "/privacy-policy",
      "/terms",
      "/refund-policy",
      "/shipping-policy",
      "/cancellation-policy",
      "/disclaimer",
    ];
    if (legalPages.includes(path)) {
      return { loc: path, changefreq: "yearly", priority: 0.3, lastmod: new Date().toISOString() };
    }
    return { loc: path, changefreq: "weekly", priority: 0.7, lastmod: new Date().toISOString() };
  },

  additionalPaths: async (_config) => {
    const paths: ISitemapField[] = [];

    // ── Service pages ──
    const services = [
      "web-development",
      "mobile-app-development",
      "saas-development",
      "crm-erp-development",
      "ui-ux-design",
      "ai-solutions",
      "devops",
      "digital-marketing",
      "seo-services",
    ];
    for (const slug of services) {
      paths.push({
        loc: `/services/${slug}`,
        changefreq: "monthly",
        priority: 0.7,
        lastmod: new Date().toISOString(),
      });
    }

    // ── Dynamic pages from DB ──
    try {
      const { connectDB } = await import("./src/lib/db");
      const Blog = (await import("./src/models/Blog")).default;
      const Product = (await import("./src/models/Product")).default;
      await connectDB();

      // Blog posts
      const posts = await Blog.find({ published: true })
        .select("slug updatedAt createdAt")
        .sort({ createdAt: -1 })
        .lean();

      for (const post of posts) {
        paths.push({
          loc: `/blog/${post.slug}`,
          changefreq: "monthly",
          priority: 0.8,
          lastmod: (post.updatedAt || post.createdAt).toISOString(),
        });
      }
    } catch (error) {
      console.error("next-sitemap: Failed to fetch blog posts:", error);
    }

    // ── Product pages from DB ──
    try {
      const Product = (await import("./src/models/Product")).default;
      const products = await Product.find({ status: "active" })
        .select("slug updatedAt createdAt")
        .sort({ createdAt: -1 })
        .lean();

      for (const product of products) {
        paths.push({
          loc: `/products/${product.slug}`,
          changefreq: "weekly",
          priority: 0.8,
          lastmod: (product.updatedAt || product.createdAt).toISOString(),
        });
      }
    } catch (error) {
      console.error("next-sitemap: Failed to fetch products:", error);
    }

    return paths;
  },

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/auth/", "/checkout/", "/cart"],
      },
    ],
    additionalSitemaps: [],
  },
};

export default config;
