/**
 * TechMintLab — Database Seed Script
 *
 * Populates all MongoDB models with realistic sample data.
 *
 * Usage:
 *   npx tsx src/scripts/seed.ts
 *
 * Environment Variables Required:
 *   MONGODB_URI (from .env.local)
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Environment variables are loaded via: tsx --env-file=.env.local src/scripts/seed.ts

// ─── Model Imports ────────────────────────────────────────────────────
import User from "../models/User";
import Category from "../models/Category";
import Product from "../models/Product";
import Blog from "../models/Blog";
import Order from "../models/Order";
import Review from "../models/Review";
import Testimonial from "../models/Testimonial";
import Coupon from "../models/Coupon";
import Contact from "../models/Contact";
import FAQ from "../models/FAQ";
import Newsletter from "../models/Newsletter";

// ─── Seed Data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: "Web Development",
    slug: "web-development",
    description: "Production-ready web applications, dashboards, and full-stack solutions built with modern frameworks.",
    icon: "Code2",
    order: 0,
  },
  {
    name: "Mobile Apps",
    slug: "mobile-apps",
    description: "Cross-platform mobile applications built with React Native and Flutter.",
    icon: "Smartphone",
    order: 1,
  },
  {
    name: "SaaS Solutions",
    slug: "saas-solutions",
    description: "Scalable software-as-a-service platforms with multi-tenancy and subscription management.",
    icon: "Cloud",
    order: 2,
  },
  {
    name: "APIs & Backend",
    slug: "apis-backend",
    description: "RESTful and GraphQL APIs with robust authentication, caching, and microservices architecture.",
    icon: "Globe",
    order: 3,
  },
  {
    name: "UI/UX Design",
    slug: "ui-ux-design",
    description: "Beautiful, user-centric design systems, component libraries, and interactive prototypes.",
    icon: "Palette",
    order: 4,
  },
  {
    name: "DevOps & Cloud",
    slug: "devops-cloud",
    description: "Infrastructure automation, CI/CD pipelines, and cloud deployment configurations.",
    icon: "Server",
    order: 5,
  },
];

const USERS = [
  {
    name: "Admin User",
    email: "admin@techmintlab.com",
    password: "admin123",
    role: "admin" as const,
    company: "TechMintLab",
    emailVerified: new Date("2025-01-01"),
  },
  {
    name: "Rahul Sharma",
    email: "rahul@example.com",
    password: "user123",
    role: "user" as const,
    company: "InnovateTech",
    emailVerified: new Date("2025-02-15"),
  },
  {
    name: "Priya Patel",
    email: "priya@example.com",
    password: "user123",
    role: "user" as const,
    company: "DigitalFlow Solutions",
    emailVerified: new Date("2025-03-10"),
  },
  {
    name: "Arun Kumar",
    email: "arun@example.com",
    password: "user123",
    role: "user" as const,
    company: "Freelance Developer",
    emailVerified: null,
  },
];

const PRODUCTS_TEMPLATES = [
  {
    title: "NextStore Pro",
    slug: "nextstore-pro",
    description: "A complete e-commerce solution built with Next.js 16, featuring multi-vendor support, real-time inventory management, and integrated payment processing.",
    content: `## Overview\n\nNextStore Pro is a premium e-commerce platform that enables businesses to launch their online stores quickly.\n\n## Key Features\n\n- **Multi-Vendor Marketplace**: Allow multiple sellers to register and manage their products\n- **Real-Time Inventory**: Track stock levels with automatic low-stock alerts\n- **Payment Integration**: Razorpay, Stripe, and PayPal support out of the box\n- **Order Management**: Complete order lifecycle from placement to delivery\n- **Analytics Dashboard**: Real-time sales reports and customer insights\n\n## Tech Stack\n\nBuilt with Next.js 16, TypeScript, MongoDB, Tailwind CSS, and Redis for caching.`,
    categorySlug: "web-development",
    price: 499900,
    salePrice: 399900,
    thumbnail: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800", "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800"],
    features: ["Multi-vendor marketplace", "Real-time inventory tracking", "Razorpay & Stripe integration", "Advanced analytics dashboard", "SEO optimized", "Mobile responsive"],
    technologies: ["Next.js 16", "TypeScript", "MongoDB", "Tailwind CSS", "Redis", "Razorpay"],
    version: "2.1.0",
    fileSize: "45 MB",
    isFeatured: true,
    isTrending: true,
    pricingPlans: [
      { name: "Starter", price: 399900, description: "Single store, basic features", features: ["1 Store", "Up to 100 Products", "Basic Analytics", "Email Support"], isPopular: false, buttonText: "Get Started" },
      { name: "Business", price: 499900, description: "Multi-vendor, advanced features", features: ["Unlimited Products", "Multi-Vendor", "Advanced Analytics", "Priority Support", "API Access"], isPopular: true, buttonText: "Buy Now" },
      { name: "Enterprise", price: 999900, description: "Custom solutions, dedicated support", features: ["Everything in Business", "Custom Integrations", "Dedicated Manager", "SLA Guarantee", "White Label"], isPopular: false, buttonText: "Contact Us" },
    ],
    faqs: [
      { question: "Can I use this for my existing store?", answer: "Yes, NextStore Pro includes migration tools for WooCommerce, Shopify, and custom stores." },
      { question: "Is hosting included?", answer: "No, but we provide one-click deployment guides for Vercel, AWS, and DigitalOcean." },
    ],
  },
  {
    title: "TaskFlow Manager",
    slug: "taskflow-manager",
    description: "Enterprise project management platform with Kanban boards, Gantt charts, time tracking, and team collaboration features.",
    content: `## Overview\n\nTaskFlow Manager is a comprehensive project management solution for teams of all sizes.\n\n## Key Features\n\n- **Kanban Boards**: Drag-and-drop task management\n- **Gantt Charts**: Visual project timelines and dependencies\n- **Time Tracking**: Built-in timer and timesheet management\n- **Team Chat**: Real-time messaging and file sharing\n- **Resource Management**: Allocate team members and track capacity`,
    categorySlug: "saas-solutions",
    price: 299900,
    salePrice: 249900,
    thumbnail: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800"],
    features: ["Kanban & Gantt charts", "Time tracking", "Team collaboration", "Resource management", "Reporting & analytics", "API & integrations"],
    technologies: ["React", "Node.js", "PostgreSQL", "Socket.io", "Docker"],
    version: "3.0.0",
    fileSize: "32 MB",
    isFeatured: true,
    isTrending: false,
    pricingPlans: [
      { name: "Free", price: 0, description: "Up to 5 team members", features: ["5 Users", "Kanban Board", "Basic Reports"], isPopular: false, buttonText: "Free" },
      { name: "Pro", price: 249900, description: "Unlimited team members", features: ["Unlimited Users", "Gantt Charts", "Time Tracking", "API Access", "Priority Support"], isPopular: true, buttonText: "Buy Now" },
    ],
    faqs: [
      { question: "Can I self-host this?", answer: "Yes, TaskFlow Manager supports Docker-based self-hosting with detailed setup documentation." },
    ],
  },
  {
    title: "APIForge Generator",
    slug: "apiforge-generator",
    description: "Rapid API development toolkit that generates production-ready REST and GraphQL APIs from database schemas with authentication and documentation.",
    content: `## Overview\n\nAPIForge Generator accelerates backend development by generating complete API layers from your database schema.\n\n## Key Features\n\n- **Schema Import**: Generate APIs from Prisma, Mongoose, or SQL schemas\n- **Authentication**: JWT, OAuth2, and API key authentication built-in\n- **GraphQL Support**: Auto-generate GraphQL resolvers from REST endpoints\n- **API Documentation**: Swagger/OpenAPI docs generated automatically\n- **Rate Limiting**: Built-in rate limiting and request validation`,
    categorySlug: "apis-backend",
    price: 199900,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800"],
    features: ["Schema-to-API generation", "JWT & OAuth2 auth", "GraphQL & REST", "Auto-generated docs", "Rate limiting", "Request validation"],
    technologies: ["Node.js", "TypeScript", "GraphQL", "Prisma", "Docker"],
    version: "1.5.0",
    fileSize: "18 MB",
    isFeatured: false,
    isTrending: true,
    pricingPlans: [
      { name: "Developer", price: 199900, description: "Individual developer license", features: ["Single Project", "REST & GraphQL", "Basic Auth", "Email Support"], isPopular: false, buttonText: "Buy Now" },
      { name: "Team", price: 499900, description: "Up to 5 developers", features: ["5 Developers", "Unlimited Projects", "Advanced Auth", "Priority Support", "Custom Templates"], isPopular: true, buttonText: "Buy Now" },
    ],
    faqs: [
      { question: "Which databases are supported?", answer: "Currently supports PostgreSQL, MySQL, MongoDB, and SQLite schemas." },
    ],
  },
  {
    title: "DesignSystem UI",
    slug: "designsystem-ui",
    description: "A comprehensive React component library with 200+ accessible, customizable UI components and Figma design files.",
    content: `## Overview\n\nDesignSystem UI is a production-ready component library for building beautiful, accessible web applications.\n\n## Key Features\n\n- **200+ Components**: Buttons, forms, modals, tables, charts, and more\n- **Accessibility**: WCAG 2.1 AA compliant components\n- **Customizable**: Full theming with CSS variables and Tailwind support\n- **Figma Integration**: Complete Figma design system included\n- **Documentation**: Storybook-based interactive documentation`,
    categorySlug: "ui-ux-design",
    price: 149900,
    salePrice: 99900,
    thumbnail: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800"],
    features: ["200+ components", "WCAG 2.1 AA compliant", "Full theming support", "Figma design files", "Storybook docs", "TypeScript support"],
    technologies: ["React", "TypeScript", "Tailwind CSS", "Storybook", "Figma"],
    version: "4.2.0",
    fileSize: "12 MB",
    isFeatured: true,
    isTrending: false,
    pricingPlans: [
      { name: "Basic", price: 99900, description: "Core component library", features: ["200+ Components", "TypeScript", "Basic Themes", "Email Support"], isPopular: false, buttonText: "Buy Now" },
      { name: "Pro", price: 249900, description: "Full library + Figma files", features: ["Everything in Basic", "Figma Design System", "Advanced Themes", "Priority Support", "Custom Components"], isPopular: true, buttonText: "Buy Now" },
    ],
    faqs: [
      { question: "Can I use this with any React framework?", answer: "Yes, it works with Next.js, Vite, Remix, and any React-based framework." },
    ],
  },
  {
    title: "CloudDeploy Pro",
    slug: "clouddeploy-pro",
    description: "Automated cloud infrastructure deployment tool supporting AWS, GCP, and Azure with CI/CD pipelines and monitoring.",
    content: `## Overview\n\nCloudDeploy Pro simplifies cloud infrastructure management with Infrastructure as Code templates and automated deployments.\n\n## Key Features\n\n- **Multi-Cloud Support**: AWS, GCP, and Azure templates included\n- **CI/CD Integration**: GitHub Actions, GitLab CI, Jenkins pipelines\n- **Monitoring**: Built-in health checks, alerts, and dashboards\n- **Cost Management**: Budget tracking and cost optimization recommendations\n- **Security**: Automated security scans and compliance reporting`,
    categorySlug: "devops-cloud",
    price: 399900,
    thumbnail: "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800"],
    features: ["Multi-cloud support", "CI/CD pipelines", "Monitoring & alerts", "Cost optimization", "Security compliance", "Infrastructure as Code"],
    technologies: ["Terraform", "Docker", "Kubernetes", "GitHub Actions", "AWS", "GCP"],
    version: "2.0.0",
    fileSize: "28 MB",
    isFeatured: false,
    isTrending: true,
    pricingPlans: [
      { name: "Starter", price: 399900, description: "Single cloud provider", features: ["1 Cloud Provider", "Basic CI/CD", "Monitoring", "Email Support"], isPopular: false, buttonText: "Get Started" },
      { name: "Business", price: 899900, description: "Multi-cloud + advanced features", features: ["All Cloud Providers", "Advanced CI/CD", "Security Scanning", "Priority Support", "Custom Templates"], isPopular: true, buttonText: "Buy Now" },
    ],
    faqs: [
      { question: "Can I add custom cloud providers?", answer: "Yes, the plug-in architecture supports custom provider templates." },
    ],
  },
  {
    title: "SocialPulse Dashboard",
    slug: "socialpulse-dashboard",
    description: "Social media analytics and management platform with scheduling, sentiment analysis, and competitor tracking.",
    content: `## Overview\n\nSocialPulse Dashboard empowers marketing teams with actionable social media insights and management tools.\n\n## Key Features\n\n- **Multi-Platform**: Twitter, Instagram, LinkedIn, Facebook, YouTube\n- **Content Scheduling**: Drag-and-drop calendar with auto-posting\n- **Sentiment Analysis**: AI-powered sentiment tracking and trend detection\n- **Competitor Analysis**: Track competitor performance and engagement\n- **Custom Reports**: White-label PDF and CSV report exports`,
    categorySlug: "saas-solutions",
    price: 249900,
    salePrice: 199900,
    thumbnail: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800"],
    features: ["Multi-platform support", "Content scheduling", "AI sentiment analysis", "Competitor tracking", "Custom reports", "Team collaboration"],
    technologies: ["React", "Python", "PostgreSQL", "Redis", "Docker"],
    version: "1.8.0",
    fileSize: "22 MB",
    isFeatured: false,
    isTrending: false,
    pricingPlans: [
      { name: "Growth", price: 199900, description: "For growing teams", features: ["5 Social Accounts", "Basic Analytics", "Scheduling", "Email Support"], isPopular: false, buttonText: "Buy Now" },
      { name: "Agency", price: 499900, description: "For agencies & enterprises", features: ["Unlimited Accounts", "Advanced Analytics", "Competitor Tracking", "White Label Reports", "API Access"], isPopular: true, buttonText: "Buy Now" },
    ],
    faqs: [
      { question: "Does it support Instagram Reels scheduling?", answer: "Yes, Reels scheduling is supported with preview capabilities." },
    ],
  },
  {
    title: "HealthTrack Mobile",
    slug: "healthtrack-mobile",
    description: "Cross-platform health and fitness tracking app with workout plans, nutrition tracking, and progress analytics.",
    content: `## Overview\n\nHealthTrack Mobile is a comprehensive health and fitness application built with React Native.\n\n## Key Features\n\n- **Workout Plans**: Customizable exercise routines with video demonstrations\n- **Nutrition Tracking**: Calorie counter with barcode scanning\n- **Progress Analytics**: Charts and insights for weight, measurements, and goals\n- **Social Features**: Friend challenges and community leaderboards\n- **Wearable Integration**: Syncs with Apple Watch, Fitbit, and Garmin`,
    categorySlug: "mobile-apps",
    price: 349900,
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800"],
    features: ["Custom workout plans", "Nutrition tracking", "Progress analytics", "Social challenges", "Wearable sync", "Offline mode"],
    technologies: ["React Native", "TypeScript", "Firebase", "Node.js", "MongoDB"],
    version: "2.3.0",
    fileSize: "38 MB",
    isFeatured: true,
    isTrending: false,
    pricingPlans: [
      { name: "Basic", price: 349900, description: "Full app source code", features: ["Complete Source Code", "API Backend", "Documentation", "Email Support"], isPopular: false, buttonText: "Buy Now" },
      { name: "Commercial", price: 699900, description: "Resell rights + white label", features: ["Everything in Basic", "White Label Rights", "Resell License", "Priority Support", "Custom Branding"], isPopular: true, buttonText: "Buy Now" },
    ],
    faqs: [
      { question: "Can I publish this to the App Store?", answer: "Yes, the app is App Store and Play Store ready with all required configurations." },
    ],
  },
  {
    title: "ChatEngine SDK",
    slug: "chatengine-sdk",
    description: "Real-time messaging SDK with WebSocket support, file sharing, read receipts, and push notifications.",
    content: `## Overview\n\nChatEngine SDK provides a complete real-time messaging infrastructure for any application.\n\n## Key Features\n\n- **Real-Time Messaging**: WebSocket-based instant messaging\n- **File Sharing**: Image, video, and document sharing with preview\n- **Read Receipts**: Delivery status and read indicators\n- **Push Notifications**: FCM and APNS support included\n- **Moderation**: Profanity filter, message reporting, and admin controls`,
    categorySlug: "apis-backend",
    price: 179900,
    salePrice: 149900,
    thumbnail: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=600&h=400&fit=crop",
    images: ["https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800"],
    features: ["Real-time messaging", "File sharing", "Read receipts", "Push notifications", "Message moderation", "Multi-platform SDK"],
    technologies: ["Node.js", "Socket.io", "Redis", "MongoDB", "Firebase"],
    version: "3.1.0",
    fileSize: "15 MB",
    isFeatured: false,
    isTrending: true,
    pricingPlans: [
      { name: "Developer", price: 149900, description: "Single application license", features: ["1 App", "Up to 1K Users", "Basic Features", "Email Support"], isPopular: false, buttonText: "Buy Now" },
      { name: "Business", price: 499900, description: "Unlimited applications", features: ["Unlimited Apps", "Unlimited Users", "All Features", "Priority Support", "Custom Branding"], isPopular: true, buttonText: "Buy Now" },
    ],
    faqs: [
      { question: "What platforms does the SDK support?", answer: "JavaScript/TypeScript, React Native, Flutter, iOS (Swift), and Android (Kotlin) SDKs included." },
    ],
  },
];

const BLOG_POSTS = [
  {
    title: "Building Scalable Microservices with Next.js 16",
    slug: "building-scalable-microservices-nextjs-16",
    content: `# Building Scalable Microservices with Next.js 16\n\nNext.js 16 introduces powerful new features for building microservices architectures. In this post, we'll explore how to leverage server actions, middleware, and the new routing system.\n\n## Why Microservices?\n\nMicroservices architecture allows teams to deploy independent services, scale components separately, and use different technologies for different problems.\n\n## Getting Started\n\nFirst, let's set up a basic microservice using Next.js 16's API routes...\n\n## Conclusion\n\nNext.js 16 provides an excellent platform for building microservices with its powerful API routes, middleware, and deployment flexibility.`,
    excerpt: "Explore how Next.js 16's new features make it an excellent choice for building scalable microservices architectures.",
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    author: "Admin User",
    category: "Web Development",
    tags: ["Next.js", "Microservices", "Architecture", "TypeScript"],
    published: true,
    featured: true,
  },
  {
    title: "The Ultimate Guide to MongoDB Aggregation Pipelines",
    slug: "ultimate-guide-mongodb-aggregation-pipelines",
    content: `# The Ultimate Guide to MongoDB Aggregation Pipelines\n\nMongoDB's aggregation framework is a powerful tool for data processing and analysis.\n\n## Understanding the Pipeline\n\nAn aggregation pipeline consists of stages, each transforming the documents as they pass through...\n\n## Common Stages\n\n- **$match**: Filter documents\n- **$group**: Group documents by a specified expression\n- **$sort**: Sort documents\n- **$project**: Reshape documents\n- **$lookup**: Perform left outer joins\n\n## Performance Tips\n\nAlways place $match and $sort stages early in the pipeline to reduce the number of documents processed...`,
    excerpt: "Master MongoDB aggregation pipelines with practical examples and performance optimization tips.",
    coverImage: "https://images.unsplash.com/photo-1623479322729-28b25c16b011?w=800&h=400&fit=crop",
    author: "Rahul Sharma",
    category: "APIs & Backend",
    tags: ["MongoDB", "Database", "Backend", "Performance"],
    published: true,
    featured: true,
  },
  {
    title: "React Native vs Flutter: Which One Should You Choose in 2026?",
    slug: "react-native-vs-flutter-2026",
    content: `# React Native vs Flutter: Which One Should You Choose in 2026?\n\nBoth frameworks have matured significantly. Let's compare them across several dimensions.\n\n## Performance\n\nBoth frameworks now offer near-native performance, but they achieve it differently...\n\n## Developer Experience\n\nReact Native benefits from the vast JavaScript ecosystem, while Flutter offers better tooling out of the box...\n\n## Community & Ecosystem\n\nReact Native has a larger community and more third-party packages, but Flutter is catching up fast...\n\n## Conclusion\n\nChoose React Native if you need a larger ecosystem and web skills reuse. Choose Flutter if you want better performance and UI consistency.`,
    excerpt: "A comprehensive comparison of React Native and Flutter for cross-platform mobile development in 2026.",
    coverImage: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=400&fit=crop",
    author: "Priya Patel",
    category: "Mobile Apps",
    tags: ["React Native", "Flutter", "Mobile", "Comparison"],
    published: true,
    featured: false,
  },
  {
    title: "Implementing CI/CD Pipelines with GitHub Actions",
    slug: "cicd-pipelines-github-actions",
    content: `# Implementing CI/CD Pipelines with GitHub Actions\n\nContinuous integration and deployment are essential for modern software development.\n\n## What is CI/CD?\n\nCI/CD automates the process of building, testing, and deploying your code...\n\n## Setting Up Your First Pipeline\n\nCreate a .github/workflows directory in your repository and add a YAML file...\n\n## Best Practices\n\n- Run tests in parallel\n- Cache dependencies\n- Use matrix builds for multiple environments\n- Implement deployment gates\n- Monitor pipeline performance`,
    excerpt: "Learn how to set up automated CI/CD pipelines using GitHub Actions for your projects.",
    coverImage: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&h=400&fit=crop",
    author: "Arun Kumar",
    category: "DevOps & Cloud",
    tags: ["DevOps", "CI/CD", "GitHub Actions", "Automation"],
    published: true,
    featured: false,
  },
  {
    title: "Designing Accessible Web Applications",
    slug: "designing-accessible-web-applications",
    content: `# Designing Accessible Web Applications\n\nAccessibility is not just a nice-to-have—it's essential for reaching all users.\n\n## Why Accessibility Matters\n\nOver 1 billion people worldwide have some form of disability. Accessible design benefits everyone...\n\n## Key Principles\n\n- **Perceivable**: Information must be presentable to users\n- **Operable**: UI components must be operable\n- **Understandable**: Information and UI must be understandable\n- **Robust**: Content must be interpretable by assistive technologies`,
    excerpt: "Best practices for building web applications that are accessible to all users, following WCAG guidelines.",
    coverImage: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&h=400&fit=crop",
    author: "Priya Patel",
    category: "UI/UX Design",
    tags: ["Accessibility", "WCAG", "UI/UX", "Web Design"],
    published: true,
    featured: false,
  },
  {
    title: "Getting Started with Tailwind CSS v4",
    slug: "getting-started-tailwind-css-v4",
    content: `# Getting Started with Tailwind CSS v4\n\nTailwind CSS v4 introduces a completely new engine and many exciting features.\n\n## What's New in v4?\n\n- CSS-first configuration\n- Improved performance with the new engine\n- New utility classes and variants\n- Better customization options\n\n## Migration from v3\n\nThe upgrade process is straightforward. Here's what you need to know...\n\n## Building Your First Component\n\nLet's create a modern card component using Tailwind v4...`,
    excerpt: "A beginner-friendly guide to Tailwind CSS v4 with practical examples and migration tips from v3.",
    coverImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&h=400&fit=crop",
    author: "Admin User",
    category: "Web Development",
    tags: ["Tailwind CSS", "CSS", "Frontend", "Design"],
    published: false,
    featured: false,
  },
];

const TESTIMONIALS = [
  {
    name: "Vikram Mehta",
    company: "TechVentures India",
    designation: "CTO",
    content: "TechMintLab's NextStore Pro transformed our e-commerce business. The multi-vendor setup was seamless, and their support team was incredibly responsive. We've seen a 3x increase in sales since switching.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    isFeatured: true,
  },
  {
    name: "Ananya Singh",
    company: "DesignCraft Studio",
    designation: "Lead Designer",
    content: "The DesignSystem UI library saved us months of development time. The components are beautiful, accessible, and incredibly well-documented. The Figma integration is a game-changer for our design team.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    isFeatured: true,
  },
  {
    name: "Rajesh Krishnan",
    company: "CloudBase Solutions",
    designation: "DevOps Engineer",
    content: "CloudDeploy Pro simplified our multi-cloud deployment process significantly. The CI/CD templates worked out of the box, and the monitoring dashboards gave us the visibility we needed.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 4,
    isFeatured: false,
  },
  {
    name: "Sneha Reddy",
    company: "FitStartup",
    designation: "Product Manager",
    content: "HealthTrack Mobile gave us a head start in the fitness app market. The React Native codebase is clean and well-structured. We were able to customize and launch within weeks.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    isFeatured: true,
  },
];

const COUPONS = [
  { code: "LAUNCH20", description: "20% off on all products - Launch Special", discountType: "percentage" as const, discountValue: 20, minOrderAmount: 100000, maxDiscount: 5000000, usageLimit: 100, usedCount: 45, expiresAt: new Date("2026-12-31") },
  { code: "FLAT500", description: "₹500 flat discount on orders above ₹2,499", discountType: "fixed" as const, discountValue: 50000, minOrderAmount: 249900, usageLimit: 50, usedCount: 12, expiresAt: new Date("2026-09-30") },
  { code: "DEV50", description: "50% off for developers - limited time", discountType: "percentage" as const, discountValue: 50, minOrderAmount: 50000, maxDiscount: 2500000, usageLimit: 200, usedCount: 0, isActive: true, expiresAt: new Date("2026-06-30") },
  { code: "EXPIRED20", description: "Expired 20% discount", discountType: "percentage" as const, discountValue: 20, minOrderAmount: 0, usageLimit: 100, usedCount: 78, expiresAt: new Date("2025-01-01") },
];

const CONTACT_MESSAGES = [
  { name: "Amit Joshi", email: "amit@example.com", phone: "+91-9876543210", company: "WebWorks Agency", subject: "Partnership Inquiry", message: "Hi, I'm interested in becoming a reseller for your products. We have a client base of over 200 businesses who could benefit from your solutions. Please let me know the partnership terms and discount structure for bulk purchases.", isRead: false },
  { name: "Neha Gupta", email: "neha@example.com", subject: "Custom Development Project", message: "We need a custom learning management system for our institute. Looking for something similar to your TaskFlow but customized for educational content delivery, student management, and assessment tools. Can you take on custom projects?", isRead: true },
  { name: "Karan Malhotra", email: "karan@example.com", company: "StartupIgnite", subject: "Technical Question - APIForge", message: "We're evaluating APIForge for our microservices architecture. Does it support Kafka integration for event-driven communication between services? Also, what's the performance overhead compared to hand-written APIs?", isRead: true },
];

const FAQ_ITEMS = [
  { category: "General", question: "How do I get access to my purchased products?", answer: "After purchase, you can download your products from the Dashboard > Downloads section. You'll also receive an email with download links.", order: 0 },
  { category: "General", question: "Do you offer refunds?", answer: "Yes, we offer a 7-day refund policy for most products. If the product doesn't meet your expectations, contact our support team for assistance.", order: 1 },
  { category: "General", question: "Can I upgrade my license later?", answer: "Absolutely! You can upgrade from Starter to Business or any higher tier at any time. You'll only pay the difference in price.", order: 2 },
  { category: "Technical", question: "Do you provide installation support?", answer: "Yes, all products come with detailed documentation. Premium plans include priority email support and optional video call assistance.", order: 0 },
  { category: "Technical", question: "Are your products self-hosted?", answer: "Most of our products are self-hosted, giving you full control over your data and infrastructure. We provide one-click deployment guides.", order: 1 },
  { category: "Billing", question: "What payment methods do you accept?", answer: "We accept all major credit/debit cards, UPI, Net Banking, and PayPal. All payments are processed securely through Razorpay.", order: 0 },
];

const NEWSLETTER_SUBSCRIBERS = [
  { email: "subscriber1@example.com", isActive: true },
  { email: "subscriber2@example.com", isActive: true },
  { email: "unsubscribed@example.com", isActive: false },
];

const REVIEWS = [
  { rating: 5, title: "Excellent product!", content: "NextStore Pro exceeded our expectations. The multi-vendor feature works flawlessly and the support team is very responsive." },
  { rating: 4, title: "Great but needs some improvements", content: "TaskFlow Manager is a solid project management tool. The Kanban boards are great, but I wish the Gantt charts had more customization options." },
  { rating: 5, title: "API development made easy", content: "APIForge saved us weeks of development time. The generated APIs are clean, well-documented, and production-ready." },
  { rating: 5, title: "Beautiful components", content: "DesignSystem UI has the cleanest React components I've ever used. The accessibility features are a huge plus." },
  { rating: 4, title: "Good deployment tool", content: "CloudDeploy Pro works well for standard deployments. The monitoring dashboard is excellent." },
  { rating: 5, title: "Perfect for social media management", content: "SocialPulse Dashboard is incredibly intuitive. The sentiment analysis feature is surprisingly accurate." },
  { rating: 4, title: "Solid mobile app template", content: "HealthTrack Mobile is well-architected. The wearable integration was easy to set up." },
  { rating: 5, title: "Best chat SDK available", content: "ChatEngine SDK is feature-rich and well-documented. WebSocket implementation is rock solid." },
];

// ─── Main Seed Function ────────────────────────────────────────────────────

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI environment variable is required.");
    console.error("   Create a .env.local file with your MongoDB connection string.");
    process.exit(1);
  }

  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected to MongoDB\n");

  // Clear existing data
  console.log("🧹 Clearing existing data...");
  const allModels: any[] = [User, Category, Product, Blog, Order, Review, Testimonial, Coupon, Contact, FAQ, Newsletter];
  for (const model of allModels) {
    await model.deleteMany({});
  }
  console.log("✅ All collections cleared\n");

  // ── 1. Seed Categories ──
  console.log("📁 Seeding Categories...");
  const createdCategories = await Category.insertMany(CATEGORIES);
  const categoryMap = Object.fromEntries(
    createdCategories.map((c: any) => [c.slug, c._id])
  ) as Record<string, any>;
  console.log(`   ✅ ${createdCategories.length} categories created`);

  // ── 2. Seed Users ──
  console.log("\n👤 Seeding Users...");
  const hashedUsers = await Promise.all(
    USERS.map(async (u) => ({
      ...u,
      password: await bcrypt.hash(u.password, 12),
    }))
  );
  const createdUsers = await User.insertMany(hashedUsers);
  const userMap = Object.fromEntries(
    createdUsers.map((u: any) => [u.email.split("@")[0], u._id])
  ) as Record<string, any>;
  console.log(`   ✅ ${createdUsers.length} users created`);
  console.log("   📧 Admin: admin@techmintlab.com / admin123");
  console.log("   📧 Users: rahul@example.com, priya@example.com, arun@example.com / user123");

  // ── 3. Seed Products ──
  console.log("\n📦 Seeding Products...");
  const productsData = PRODUCTS_TEMPLATES.map((p) => ({
    title: p.title,
    slug: p.slug,
    description: p.description,
    content: p.content,
    category: categoryMap[p.categorySlug],
    price: p.price,
    salePrice: p.salePrice,
    currency: "INR",
    thumbnail: p.thumbnail,
    images: p.images,
    features: p.features,
    technologies: p.technologies,
    version: p.version,
    fileSize: p.fileSize,
    fileUrl: `https://files.techmintlab.com/downloads/${p.slug}-v${p.version}.zip`,
    isFeatured: p.isFeatured,
    isTrending: p.isTrending,
    status: "active",
    rating: 0,
    reviewCount: 0,
    downloads: Math.floor(Math.random() * 500),
    pricingPlans: p.pricingPlans,
    faqs: p.faqs,
  }));
  const createdProducts = await Product.insertMany(productsData);
  const productMap = Object.fromEntries(
    createdProducts.map((p: any) => [p.slug, p._id])
  ) as Record<string, any>;
  console.log(`   ✅ ${createdProducts.length} products created`);

  // ── 4. Seed Blog Posts ──
  console.log("\n📝 Seeding Blog Posts...");
  const blogData = BLOG_POSTS.map((post) => {
    const wordCount = post.content.split(/\s+/).length;
    return {
      ...post,
      readingTime: Math.ceil(wordCount / 200),
      seoTitle: post.title,
      seoDescription: post.excerpt,
    };
  });
  const createdBlogs = await Blog.insertMany(blogData);
  console.log(`   ✅ ${createdBlogs.length} blog posts created`);

  // ── 5. Seed Testimonials ──
  console.log("\n⭐ Seeding Testimonials...");
  const createdTestimonials = await Testimonial.insertMany(TESTIMONIALS);
  console.log(`   ✅ ${createdTestimonials.length} testimonials created`);

  // ── 6. Seed Coupons ──
  console.log("\n🏷️  Seeding Coupons...");
  const createdCoupons = await Coupon.insertMany(COUPONS);
  console.log(`   ✅ ${createdCoupons.length} coupons created`);

  // ── 7. Seed Contact Messages ──
  console.log("\n✉️  Seeding Contact Messages...");
  const createdContacts = await Contact.insertMany(CONTACT_MESSAGES);
  console.log(`   ✅ ${createdContacts.length} contact messages created`);

  // ── 8. Seed FAQ Items ──
  console.log("\n❓ Seeding FAQ Items...");
  const createdFAQs = await FAQ.insertMany(FAQ_ITEMS);
  console.log(`   ✅ ${createdFAQs.length} FAQ items created`);

  // ── 9. Seed Newsletter Subscribers ──
  console.log("\n📬 Seeding Newsletter Subscribers...");
  const createdNewsletters = await Newsletter.insertMany(NEWSLETTER_SUBSCRIBERS);
  console.log(`   ✅ ${createdNewsletters.length} subscribers created`);

  // ── 10. Seed Orders ──
  console.log("\n🛒 Seeding Orders...");
  const orderSeeds = [
    {
      user: userMap["rahul"],
      products: [{ product: productMap["nextstore-pro"], price: 399900, plan: "Business" }],
      totalAmount: 399900,
      discountAmount: 0,
      paymentStatus: "paid" as const,
      orderStatus: "completed" as const,
      paymentId: "pay_rahul_001",
      customerDetails: { name: "Rahul Sharma", email: "rahul@example.com" },
    },
    {
      user: userMap["priya"],
      products: [
        { product: productMap["designsystem-ui"], price: 99900, plan: "Basic" },
        { product: productMap["apiforge-generator"], price: 199900, plan: "Developer" },
      ],
      totalAmount: 299800,
      discountAmount: 0,
      paymentStatus: "paid" as const,
      orderStatus: "completed" as const,
      paymentId: "pay_priya_001",
      customerDetails: { name: "Priya Patel", email: "priya@example.com" },
    },
    {
      user: userMap["arun"],
      products: [{ product: productMap["taskflow-manager"], price: 249900, plan: "Pro" }],
      totalAmount: 199920,
      discountAmount: 49980,
      couponCode: "LAUNCH20",
      paymentStatus: "paid" as const,
      orderStatus: "processing" as const,
      paymentId: "pay_arun_001",
      customerDetails: { name: "Arun Kumar", email: "arun@example.com" },
    },
    {
      user: userMap["admin"],
      products: [{ product: productMap["clouddeploy-pro"], price: 399900, plan: "Starter" }],
      totalAmount: 399900,
      discountAmount: 0,
      paymentStatus: "pending" as const,
      orderStatus: "processing" as const,
      customerDetails: { name: "Admin User", email: "admin@techmintlab.com" },
    },
    {
      user: userMap["priya"],
      products: [{ product: productMap["chatengine-sdk"], price: 149900, plan: "Developer" }],
      totalAmount: 149900,
      discountAmount: 0,
      paymentStatus: "failed" as const,
      orderStatus: "cancelled" as const,
      paymentId: "pay_priya_fail",
      customerDetails: { name: "Priya Patel", email: "priya@example.com" },
    },
  ];

  const ordersWithIds = orderSeeds.map((order, i) => ({
    ...order,
    orderId: `TCM-${String(1000 + i).padStart(4, "0")}`,
    paymentMethod: "Razorpay",
    razorpayOrderId: `order_${Date.now()}_${i}`,
    invoiceUrl: `https://invoices.techmintlab.com/TCM-${String(1000 + i).padStart(4, "0")}.pdf`,
    createdAt: new Date(Date.now() - i * 86400000), // Each order a day apart
  }));

  const createdOrders = await Order.insertMany(ordersWithIds);
  console.log(`   ✅ ${createdOrders.length} orders created`);

  // Update user purchases and downloads
  for (const order of createdOrders) {
    const userObj: any = await User.findById(order.user);
    if (userObj) {
      userObj.purchases.push(order._id);
      for (const item of order.products) {
        if (!userObj.downloads.includes(item.product)) {
          userObj.downloads.push(item.product);
        }
      }
      await userObj.save();
    }
  }

  // Update product review counts and ratings
  const productIds = Object.values(productMap);

  // ── 11. Seed Reviews ──
  console.log("\n💬 Seeding Reviews...");
  const reviewSeeds = REVIEWS.map((review, i) => ({
    product: productIds[i % productIds.length],
    user: [userMap["rahul"], userMap["priya"], userMap["arun"]][i % 3],
    rating: review.rating,
    title: review.title,
    content: review.content,
    isVerified: true,
    isApproved: true,
  }));
  const createdReviews = await Review.insertMany(reviewSeeds);
  console.log(`   ✅ ${createdReviews.length} reviews created`);

  // Update product ratings based on reviews
  for (const prodId of productIds) {
    const prodReviews = createdReviews.filter((r: any) => r.product.toString() === prodId.toString());
    if (prodReviews.length > 0) {
      const avgRating = prodReviews.reduce((sum: number, r: any) => sum + r.rating, 0) / prodReviews.length;
      await Product.findByIdAndUpdate(prodId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: prodReviews.length,
      });
    }
  }

  // ── Summary ──
  console.log("\n" + "=".repeat(50));
  console.log("🎉  SEED COMPLETE!");
  console.log("=".repeat(50));
  const summary = {
    Categories: createdCategories.length,
    Users: createdUsers.length,
    Products: createdProducts.length,
    "Blog Posts": createdBlogs.length,
    Testimonials: createdTestimonials.length,
    Coupons: createdCoupons.length,
    "Contact Messages": createdContacts.length,
    "FAQ Items": createdFAQs.length,
    "Newsletter Subscribers": createdNewsletters.length,
    Orders: createdOrders.length,
    Reviews: createdReviews.length,
  };
  for (const [key, value] of Object.entries(summary)) {
    console.log(`   ${key.padEnd(22)} ${value}`);
  }
  console.log("=".repeat(50));

  await mongoose.disconnect();
  console.log("\n🔌 Disconnected from MongoDB. Goodbye!");
}

seed().catch((error) => {
  console.error("\n❌ Seed failed:", error);
  process.exit(1);
});
