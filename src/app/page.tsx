"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Star,
  Code2,
  Smartphone,
  Cloud,
  ArrowUpRight,
  Quote,
  Shield,
  Zap,
  Users,
  BarChart3,
  Layers,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { servicesList, technologiesList, siteConfig } from "@/config/site";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useSEO } from "@/hooks/useSEO";

import type { Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};



const testimonials = [
  {
    name: "Rajesh Kumar",
    company: "TechVentures India",
    designation: "CTO",
    content:
      "TechMintLab's SaaS boilerplate saved us months of development time. The code quality is exceptional and the support team is incredibly responsive.",
    rating: 5,
    avatar: "/api/placeholder/100/100",
  },
  {
    name: "Priya Sharma",
    company: "DigitalFirst Agency",
    designation: "Product Manager",
    content:
      "We've been using their e-commerce solution for our clients. It's robust, scalable, and the documentation is top-notch.",
    rating: 5,
    avatar: "/api/placeholder/100/100",
  },
  {
    name: "Amit Patel",
    company: "StartupHub",
    designation: "Founder",
    content:
      "The AI chat assistant transformed our customer support. Integration was seamless and the results exceeded our expectations.",
    rating: 5,
    avatar: "/api/placeholder/100/100",
  },
];

const stats = [
  { label: "Products", key: "products" as const, value: "50+" },
  { label: "Happy Clients", key: "clients" as const, value: "500+" },
  { label: "Downloads", key: "downloads" as const, value: "10K+" },
  { label: "Countries", key: "countries" as const, value: "25+" },
];

const whyChooseUs = [
  {
    icon: Shield,
    title: "Premium Quality",
    description: "Every product undergoes rigorous testing and code review before release.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for performance with 90+ Lighthouse scores across all products.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "24/7 customer support with average response time under 2 hours.",
  },
  {
    icon: BarChart3,
    title: "Regular Updates",
    description: "Continuous improvements with monthly updates and new features.",
  },
  {
    icon: Layers,
    title: "Modular Architecture",
    description: "Well-documented, modular code that's easy to customize and extend.",
  },
  {
    icon: Code2,
    title: "Clean Code",
    description: "Industry best practices, TypeScript throughout, and comprehensive testing.",
  },
];

const faqs = [
  {
    question: "How do I download purchased products?",
    answer: "After purchase, you can instantly download your products from your dashboard. You'll also receive a download link via email.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit/debit cards, UPI, Net Banking, and Wallets through our secure Razorpay payment gateway.",
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes, we offer a 7-day refund policy for most products. Please check our refund policy page for detailed terms and conditions.",
  },
  {
    question: "Do you offer customization services?",
    answer: "Yes! We provide customization and development services. Contact us with your requirements for a custom quote.",
  },
  {
    question: "Are the products self-hosted?",
    answer: "Yes, all our products are self-hosted. You get the full source code and can deploy them on your own infrastructure.",
  },
  {
    question: "Do you provide installation support?",
    answer: "Yes, we provide detailed documentation and support to help you with installation and setup.",
  },
];

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useIntersectionObserver({ threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HomePage() {
  // SEO with FAQPage schema for the FAQ section
  useSEO({
    title: undefined,
    description: undefined,
    url: "/",
    schema: {
      "@type": "FAQPage",
      name: "Frequently Asked Questions - TechMintLab",
      description:
        "Everything you need to know about TechMintLab's products and services.",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  });

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [counts, setCounts] = useState({ products: 0, clients: 0, downloads: 0, countries: 0 });
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const res = await fetch("/api/products?featured=true&limit=6");
      const data = await res.json();
      setFeaturedProducts(data.products || []);
    } catch {}
  };

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        products: Math.floor(50 * easeOutCubic(Math.min(progress, 1))),
        clients: Math.floor(500 * easeOutCubic(Math.min(progress, 1))),
        downloads: Math.floor(10000 * easeOutCubic(Math.min(progress, 1))),
        countries: Math.floor(25 * easeOutCubic(Math.min(progress, 1))),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-950">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-grid" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-emerald-500/5 to-blue-500/5 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            >
              <Badge variant="default" className="mb-6 px-4 py-2 text-sm">
                🚀 Premium Software Marketplace
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Build Faster.
                <br />
                <span className="text-gradient">Scale Smarter.</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-xl leading-relaxed">
                Discover premium software products, SaaS solutions, and digital
                tools crafted for modern businesses. Launch your next project
                with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="xl" className="w-full sm:w-auto group">
                    Explore Products
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/services">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    View Services
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-6 mt-10">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-gradient-to-br from-emerald-400 to-blue-400"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Trusted by 500+ businesses
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="space-y-4">
                    <div className="h-4 w-3/4 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    <div className="h-4 w-1/2 rounded-full bg-zinc-200 dark:bg-zinc-700 animate-pulse" />
                    <div className="h-32 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 flex items-center justify-center">
                      <Code2 className="w-12 h-12 text-emerald-500/40" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 glass rounded-xl p-4 shadow-lg animate-float">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs text-zinc-500">Performance</p>
                      <p className="text-sm font-semibold">99.9% Uptime</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 glass rounded-xl p-4 shadow-lg animate-float-delayed">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-xs text-zinc-500">Security</p>
                      <p className="text-sm font-semibold">Enterprise Grade</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <AnimatedSection className="relative py-20 border-y border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                custom={i}
                variants={fadeInUp}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {counts[stat.key]}+
                </div>
                <div className="text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge variant="default" className="mb-4">
              Featured Products
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Premium Software Solutions
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Hand-picked products that meet our highest quality standards. Start building with confidence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                custom={i}
                variants={fadeInUp}
                className="group"
              >
                <Card className="overflow-hidden h-full hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">                    <div className="relative overflow-hidden">
                    <div className="aspect-video bg-zinc-100 dark:bg-zinc-800">
                      {product.thumbnail ? (
                        <img
                          src={product.thumbnail}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Code2 className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                      <Link href={`/products/${product.slug}`}>
                        <Button size="sm" variant="secondary">
                          View Details
                          <ArrowUpRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <div className="absolute top-3 left-3 flex gap-2">
                      {product.salePrice && (
                        <Badge variant="premium">Sale</Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {product.category.name}
                      </Badge>
                      <div className="flex items-center text-sm text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-zinc-600 dark:text-zinc-400">
                          {product.rating}
                        </span>
                        <span className="ml-1 text-zinc-400">({product.reviewCount})</span>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {product.salePrice ? (
                          <>
                            <span className="text-2xl font-bold text-gradient">
                              ₹{product.salePrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-zinc-400 line-through">
                              ₹{product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-2xl font-bold text-gradient">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeInUp} className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline">
                View All Products
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </AnimatedSection>

      {/* Services Section */}
      <AnimatedSection className="relative py-24 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge variant="default" className="mb-4">
              Our Services
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              End-to-End Development
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              From concept to deployment, we deliver exceptional digital solutions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.slice(0, 6).map((service, i) => (
              <motion.div
                key={service.slug}
                custom={i}
                variants={fadeInUp}
              >
                <Link href={`/services/${service.slug}`}>
                  <Card className="h-full group hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 cursor-pointer">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Code2 className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                        {service.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.slice(0, 3).map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge variant="default" className="mb-4">
              Why TechMintLab
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for Excellence
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              We combine technical expertise with business understanding to deliver exceptional results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, i) => (
              <motion.div
                key={item.title}
                custom={i}
                variants={fadeInUp}
                className="group"
              >
                <div className="glass-card rounded-2xl p-6 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 dark:from-emerald-500/20 dark:to-blue-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Technologies */}
      <AnimatedSection className="relative py-24 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge variant="default" className="mb-4">
              Technologies
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Cutting-Edge Stack
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              We work with the latest technologies to deliver modern, scalable solutions.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {technologiesList.map((tech, i) => (
              <motion.div
                key={tech.name}
                custom={i}
                variants={fadeInUp}
                className="glass-card rounded-xl px-5 py-3 flex items-center space-x-2"
              >
                <span className="text-sm font-medium">{tech.name}</span>
                <span className="text-[10px] uppercase tracking-wider text-zinc-400">
                  {tech.category}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge variant="default" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted by Innovators
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              See what our clients say about their experience with TechMintLab.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                custom={i}
                variants={fadeInUp}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-emerald-500/30 mb-4" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                      {testimonial.content}
                    </p>
                    <div className="flex items-center space-x-1 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-400" />
                      <div>
                        <p className="text-sm font-semibold">{testimonial.name}</p>
                        <p className="text-xs text-zinc-500">
                          {testimonial.designation}, {testimonial.company}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* FAQ Section */}
      <AnimatedSection className="relative py-24 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <Badge variant="default" className="mb-4">
              FAQ
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Everything you need to know about our products and services.
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={fadeInUp}
                className="glass-card rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium pr-8">{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-zinc-400 transition-transform ${
                      activeFaq === i ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-blue-600" />
        <div className="absolute inset-0 bg-grid opacity-10" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Faster?
            </h2>
            <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
              Join thousands of businesses that trust TechMintLab for their
              software needs. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/products">
                <Button
                  size="xl"
                  className="bg-white text-emerald-700 hover:bg-zinc-100 shadow-xl w-full sm:w-auto"
                >
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 w-full sm:w-auto"
                >
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
