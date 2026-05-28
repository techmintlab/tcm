import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy",
  description:
    "Review TechMintLab's cancellation policy for digital products, subscriptions, and custom development services. Learn how to cancel subscriptions from your dashboard.",
  openGraph: {
    title: "Cancellation Policy | TechMintLab",
    description:
      "Review TechMintLab's cancellation policy for digital products and services.",
    url: "/cancellation-policy",
    siteName: "TechMintLab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cancellation Policy | TechMintLab",
    description:
      "Review TechMintLab's cancellation policy for digital products and services.",
  },
  alternates: {
    canonical: "/cancellation-policy",
  },
};

export default function CancellationPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/cancellation-policy#webpage`,
        url: `${siteConfig.url}/cancellation-policy`,
        name: "Cancellation Policy | TechMintLab",
        description:
          "Review TechMintLab's cancellation policy for digital products and services.",
        isPartOf: { "@id": `${siteConfig.url}#website` },
        about: { "@type": "Thing", name: "Cancellation Policy" },
        dateModified: "2025-01-01",
        inLanguage: "en-US",
        breadcrumb: { "@id": `${siteConfig.url}/cancellation-policy#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/cancellation-policy#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cancellation Policy",
            item: `${siteConfig.url}/cancellation-policy`,
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
          <span className="text-zinc-900 dark:text-zinc-100">Cancellation Policy</span>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cancellation Policy</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Order Cancellation</h2>
          <p>
            Since our products are digital and delivered instantly, orders cannot be cancelled once payment is processed and the product is delivered.
          </p>
          <h2>2. Subscription Cancellation</h2>
          <p>
            For subscription-based services, you can cancel your subscription at any time from your dashboard. Cancellation will take effect at the end of the current billing period.
          </p>
          <h2>3. Service Cancellation</h2>
          <p>
            For custom development services, cancellation terms are defined in the service agreement. Please refer to your specific contract for details.
          </p>
          <h2>4. How to Cancel</h2>
          <p>
            To cancel a subscription: Log into your dashboard, go to Subscriptions, and click Cancel.
            <br />
            For service cancellations: Contact us at support@techmintlab.com
          </p>
        </div>
      </div>
    </div>
  );
}
