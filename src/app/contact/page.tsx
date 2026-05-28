"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSEO } from "@/hooks/useSEO";
import { siteConfig } from "@/config/site";
import toast from "react-hot-toast";

export default function ContactPage() {
  // SEO with ContactPage + LocalBusiness schema
  useSEO({
    title: "Contact Us",
    description:
      "Get in touch with TechMintLab. Send us a message and we'll respond within 24 hours. Reach us via email, phone, or WhatsApp.",
    url: "/contact",
    type: "website",
    schema: {
      "@graph": [
        {
          "@type": "ContactPage",
          name: "Contact TechMintLab",
          description:
            "Contact page for TechMintLab - premium software marketplace and development studio.",
          mainEntity: {
            "@id": `${siteConfig.url}#business`,
          },
        },
        {
          "@type": "LocalBusiness",
          "@id": `${siteConfig.url}#business`,
          name: siteConfig.name,
          description: siteConfig.description,
          url: siteConfig.url,
          logo: `${siteConfig.url}/logo.png`,
          image: `${siteConfig.url}/logo.png`,
          email: siteConfig.contact.email,
          telephone: siteConfig.contact.phone,
          priceRange: "$$",
          currenciesAccepted: "INR, USD",
          paymentAccepted: ["Visa", "Mastercard", "UPI", "Net Banking", "Razorpay"],
          foundingDate: "2024",
          areaServed: ["India", "United States", "United Kingdom", "Canada", "Australia"],
          sameAs: Object.values(siteConfig.links),
          contactPoint: {
            "@type": "ContactPoint",
            telephone: siteConfig.contact.phone,
            contactType: "customer service",
            email: siteConfig.contact.email,
            availableLanguage: ["English", "Hindi"],
          },
          address: {
            "@type": "PostalAddress",
            addressLocality: "Bengaluru",
            addressRegion: "Karnataka",
            addressCountry: "India",
          },
          openingHoursSpecification: [
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              opens: "09:00",
              closes: "18:00",
            },
            {
              "@type": "OpeningHoursSpecification",
              dayOfWeek: "Saturday",
              opens: "10:00",
              closes: "14:00",
            },
          ],
        },
      ],
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        setForm({ name: "", email: "", phone: "", company: "", subject: "", message: "" });
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center space-x-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-900 dark:text-zinc-100">Contact</span>
        </div>
        {/* Breadcrumb structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
                { "@type": "ListItem", position: 2, name: "Contact", item: `${siteConfig.url}/contact` },
              ],
            }),
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950/50 dark:to-zinc-950">
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="default" className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear from you. Send us a message and
            we'll respond within 24 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <Card>
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Acme Inc."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your project..."
                      required
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    <Send className="mr-2 h-4 w-4" />
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "hello@techmintlab.com", href: "mailto:hello@techmintlab.com" },
                  { icon: Phone, label: "Phone", value: "+91-XXXXXXXXXX", href: "tel:+91-XXXXXXXXXX" },
                  { icon: MapPin, label: "Office", value: "Bengaluru, Karnataka, India" },
                  { icon: Clock, label: "Response Time", value: "Within 24 hours" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm text-zinc-500">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="font-medium hover:text-emerald-600 transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/91XXXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all">
                <div className="flex items-center space-x-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-700 dark:text-green-400">Chat on WhatsApp</p>
                    <p className="text-sm text-green-600/70">Quick replies during business hours</p>
                  </div>
                </div>
              </div>
            </a>

            {/* Map Placeholder */}
            <div className="aspect-video rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-zinc-400" />
              <span className="ml-2 text-zinc-400">Bengaluru, India</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
