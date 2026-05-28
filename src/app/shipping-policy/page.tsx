import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Delivery Policy",
  description:
    "Learn about TechMintLab's digital product delivery process. Instant download access, email confirmation, and lifetime access to purchased products.",
  openGraph: {
    title: "Shipping & Delivery Policy | TechMintLab",
    description:
      "Learn about TechMintLab's digital product delivery process.",
    url: "/shipping-policy",
    siteName: "TechMintLab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shipping & Delivery Policy | TechMintLab",
    description:
      "Learn about TechMintLab's digital product delivery process.",
  },
  alternates: {
    canonical: "/shipping-policy",
  },
};

export default function ShippingPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/shipping-policy#webpage`,
        url: `${siteConfig.url}/shipping-policy`,
        name: "Shipping & Delivery Policy | TechMintLab",
        description:
          "Learn about TechMintLab's digital product delivery process.",
        isPartOf: { "@id": `${siteConfig.url}#website` },
        about: { "@type": "Thing", name: "Shipping & Delivery Policy" },
        dateModified: "2025-01-01",
        inLanguage: "en-US",
        breadcrumb: { "@id": `${siteConfig.url}/shipping-policy#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/shipping-policy#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Shipping & Delivery Policy",
            item: `${siteConfig.url}/shipping-policy`,
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: {
          "@type": "Organization",
          name: siteConfig.name,
          logo: `${siteConfig.url}/logo.png`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center space-x-2 text-sm text-zinc-500">
          <Link href="/" className="hover:text-emerald-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-900 dark:text-zinc-100">Shipping & Delivery Policy</span>
        </div>
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping & Delivery Policy</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Digital Delivery</h2>
          <p>
            All products purchased on TechMintLab are digital goods and are delivered electronically. Physical products are not shipped.
          </p>
          <h2>2. Instant Download</h2>
          <p>
            Upon successful payment verification, you will receive:
          </p>
          <ul>
            <li>Immediate access to download your purchased product from your dashboard</li>
            <li>A confirmation email with download instructions</li>
            <li>An invoice for your records</li>
          </ul>
          <h2>3. Email Delivery</h2>
          <p>
            Download links and purchase confirmations are sent to the email address used during checkout. If you do not receive the email within 15 minutes, please check your spam folder and contact support.
          </p>
          <h2>4. Access Time</h2>
          <p>
            All purchased products remain accessible in your account dashboard indefinitely. You can download your products at any time after purchase.
          </p>
          <h2>5. Technical Issues</h2>
          <p>
            If you experience any issues with accessing or downloading your purchased products, please contact our support team at support@techmintlab.com for immediate assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
