"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Link2,
  X as XIcon,
  GitBranch,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { siteConfig, mainNavItems } from "@/config/site";
import toast from "react-hot-toast";

const footerLinks = {
  products: {
    title: "Products",
    links: [
      { title: "All Products", href: "/products" },
      { title: "Featured", href: "/products?filter=featured" },
      { title: "Trending", href: "/products?filter=trending" },
      { title: "New Releases", href: "/products?filter=new" },
    ],
  },
  services: {
    title: "Services",
    links: [
      { title: "Web Development", href: "/services/web-development" },
      { title: "Mobile Apps", href: "/services/mobile-app-development" },
      { title: "SaaS Development", href: "/services/saas-development" },
      { title: "AI Solutions", href: "/services/ai-solutions" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { title: "About Us", href: "/about" },
      { title: "Blog", href: "/blog" },
      { title: "Contact", href: "/contact" },
      { title: "Careers", href: "#" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { title: "Privacy Policy", href: "/privacy-policy" },
      { title: "Terms & Conditions", href: "/terms" },
      { title: "Refund Policy", href: "/refund-policy" },
      { title: "Disclaimer", href: "/disclaimer" },
    ],
  },
};

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribing(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="relative border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <Image
                src="/logo.png"
                alt="TechMintLab"
                width={32}
                height={32}
                className="h-8 w-8 rounded-lg object-contain"
              />
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-blue-400">
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 max-w-sm">
              Premium software marketplace and digital product platform. Build
              Faster. Scale Smarter.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span>{siteConfig.contact.email}</span>
              </a>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>{siteConfig.contact.phone}</span>
              </a>
              <div className="flex items-center space-x-3 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="h-4 w-4" />
                <span>{siteConfig.contact.address}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a
                href={siteConfig.links.twitter}
                className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-all"
              >
                <XIcon className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.github}
                className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-all"
              >
                <GitBranch className="h-4 w-4" />
              </a>
              <a
                href={siteConfig.links.linkedin}
                className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-all"
              >
                <Link2 className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4 text-sm uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/20 dark:to-blue-950/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                Stay Updated
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Get the latest updates on new products, services, and tech insights.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 sm:space-x-2 sm:gap-0">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button type="submit" disabled={isSubscribing}>
                {isSubscribing ? (
                  "Subscribing..."
                ) : (
                  <>
                    Subscribe <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-500 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-500" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
}
