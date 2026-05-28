import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Understand TechMintLab's refund policy for digital products, subscriptions, and custom development services. 7-day refund window and technical issue handling.",
  openGraph: {
    title: "Refund Policy | TechMintLab",
    description:
      "Understand TechMintLab's refund policy for digital products and services.",
    url: "/refund-policy",
    siteName: "TechMintLab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | TechMintLab",
    description:
      "Understand TechMintLab's refund policy for digital products and services.",
  },
  alternates: {
    canonical: "/refund-policy",
  },
};

export default function RefundPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/refund-policy#webpage`,
        url: `${siteConfig.url}/refund-policy`,
        name: "Refund Policy | TechMintLab",
        description:
          "Understand TechMintLab's refund policy for digital products and services.",
        isPartOf: { "@id": `${siteConfig.url}#website` },
        about: { "@type": "Thing", name: "Refund Policy" },
        dateModified: "2025-01-01",
        inLanguage: "en-US",
        breadcrumb: { "@id": `${siteConfig.url}/refund-policy#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/refund-policy#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Refund Policy", item: `${siteConfig.url}/refund-policy` },
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
          <span className="text-zinc-900 dark:text-zinc-100">Refund Policy</span>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Refund Eligibility</h2>
          <p>
            We want you to be satisfied with your purchase. If you encounter any issues, please review our refund eligibility criteria below.
          </p>
          <ul>
            <li><strong>7-Day Refund Window:</strong> You may request a refund within 7 days of your purchase date.</li>
            <li><strong>Technical Issues:</strong> If the product has significant technical issues that prevent its intended use and our support team cannot resolve them.</li>
            <li><strong>Misrepresentation:</strong> If the product does not match its description on our marketplace.</li>
          </ul>

          <h2>2. Non-Refundable Items</h2>
          <p>The following are not eligible for refunds:</p>
          <ul>
            <li><strong>Digital Downloads:</strong> Once a digital product has been downloaded, it is generally non-refundable due to the nature of digital goods.</li>
            <li><strong>Custom Development:</strong> Custom development services are non-refundable once work has commenced.</li>
            <li><strong>Subscription Services:</strong> Partial refunds for subscription services are handled on a case-by-case basis.</li>
            <li><strong>Change of Mind:</strong> Refunds cannot be issued simply because you changed your mind after purchase.</li>
          </ul>

          <h2>3. Duplicate Payment Handling</h2>
          <p>
            If you are charged twice for the same product due to a technical error:
          </p>
          <ul>
            <li>Contact our support team immediately</li>
            <li>Provide your order ID and payment details</li>
            <li>We will verify and process the refund within 5-7 business days</li>
          </ul>

          <h2>4. Technical Issue Handling</h2>
          <p>
            If you experience technical issues with a purchased product:
          </p>
          <ol>
            <li>Contact our support team detailing the issue</li>
            <li>Allow 24-48 hours for our team to investigate</li>
            <li>If the issue cannot be resolved, we will process a full refund</li>
          </ol>

          <h2>5. Refund Process</h2>
          <p>
            To request a refund, contact us at refunds@techmintlab.com with your order ID and reason for the refund request. We will process approved refunds within 5-10 business days to your original payment method.
          </p>

          <h2>6. Contact</h2>
          <p>
            For refund-related inquiries: refunds@techmintlab.com
          </p>
        </div>
      </div>
    </div>
  );
}
