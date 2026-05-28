import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review the terms and conditions for using TechMintLab's marketplace and services. Includes digital product licensing, payment terms, and user responsibilities.",
  openGraph: {
    title: "Terms & Conditions | TechMintLab",
    description:
      "Review the terms and conditions for using TechMintLab's marketplace and services.",
    url: "/terms",
    siteName: "TechMintLab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | TechMintLab",
    description:
      "Review the terms and conditions for using TechMintLab's marketplace and services.",
  },
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/terms#webpage`,
        url: `${siteConfig.url}/terms`,
        name: "Terms & Conditions | TechMintLab",
        description:
          "Review the terms and conditions for using TechMintLab's marketplace and services.",
        isPartOf: {
          "@id": `${siteConfig.url}#website`,
        },
        about: {
          "@type": "Thing",
          name: "Terms & Conditions",
        },
        dateModified: "2025-01-01",
        inLanguage: "en-US",
        breadcrumb: {
          "@id": `${siteConfig.url}/terms#breadcrumb`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/terms#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Terms & Conditions",
            item: `${siteConfig.url}/terms`,
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
          <span className="text-zinc-900 dark:text-zinc-100">Terms & Conditions</span>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TechMintLab ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.
          </p>

          <h2>2. User Responsibilities</h2>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Use the Platform in compliance with applicable laws</li>
            <li>Not engage in any unauthorized or illegal activities</li>
            <li>Not attempt to access restricted areas without authorization</li>
          </ul>

          <h2>3. Digital Products Policy</h2>
          <p>
            All digital products purchased on TechMintLab are provided "as is" without any express or implied warranty. Upon purchase, you receive a license to use the product subject to the following:
          </p>
          <ul>
            <li>Products are for personal or business use as specified in the license</li>
            <li>You may not resell, redistribute, or sublicense products without permission</li>
            <li>You may not claim the products as your own original work</li>
          </ul>

          <h2>4. Account Rules</h2>
          <p>
            You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts for violations.
          </p>

          <h2>5. Payment Conditions</h2>
          <p>
            All payments are processed through Razorpay. By making a purchase, you agree to:
          </p>
          <ul>
            <li>Pay all charges at the prices listed at the time of purchase</li>
            <li>Provide valid payment information</li>
            <li>Authorize us to charge your chosen payment method</li>
          </ul>

          <h2>6. License Restrictions</h2>
          <p>
            Purchased products are licensed, not sold. The license is non-exclusive, non-transferable, and subject to these terms. You may not:
          </p>
          <ul>
            <li>Modify or create derivative works from the product code</li>
            <li>Distribute the product source code publicly</li>
            <li>Remove copyright or proprietary notices</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            All content, trademarks, and intellectual property on the Platform are owned by TechMintLab or our licensors. You may not use our intellectual property without prior written consent.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            TechMintLab shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or products.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the Platform constitutes acceptance of updated terms.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these terms, contact us at legal@techmintlab.com
          </p>
        </div>
      </div>
    </div>
  );
}
