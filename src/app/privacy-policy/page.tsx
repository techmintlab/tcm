import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how TechMintLab collects, uses, and protects your personal data. Our privacy policy covers cookies, data security, third-party services, and your rights.",
  openGraph: {
    title: "Privacy Policy | TechMintLab",
    description:
      "Learn how TechMintLab collects, uses, and protects your personal data.",
    url: "/privacy-policy",
    siteName: "TechMintLab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | TechMintLab",
    description:
      "Learn how TechMintLab collects, uses, and protects your personal data.",
  },
  alternates: {
    canonical: "/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/privacy-policy#webpage`,
        url: `${siteConfig.url}/privacy-policy`,
        name: "Privacy Policy | TechMintLab",
        description:
          "Learn how TechMintLab collects, uses, and protects your personal data.",
        isPartOf: { "@id": `${siteConfig.url}#website` },
        about: { "@type": "Thing", name: "Privacy Policy" },
        dateModified: "2025-01-01",
        inLanguage: "en-US",
        breadcrumb: { "@id": `${siteConfig.url}/privacy-policy#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/privacy-policy#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Privacy Policy", item: `${siteConfig.url}/privacy-policy` },
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
          <span className="text-zinc-900 dark:text-zinc-100">Privacy Policy</span>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            TechMintLab ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website techmintlab.com (the "Site") and use our services.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>Personal Data</h3>
          <p>We may collect personal identification information, such as:</p>
          <ul>
            <li>Name and email address</li>
            <li>Phone number and company name</li>
            <li>Billing and payment information</li>
            <li>Account credentials</li>
          </ul>

          <h3>Usage Data</h3>
          <p>We automatically collect certain information when you visit our Site:</p>
          <ul>
            <li>IP address and browser type</li>
            <li>Device information</li>
            <li>Pages visited and time spent</li>
            <li>Referring URLs</li>
          </ul>

          <h2>3. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our Site and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
          </p>

          <h2>4. How We Use Your Information</h2>
          <p>We use the collected information for various purposes:</p>
          <ul>
            <li>To provide and maintain our services</li>
            <li>To process transactions and send invoices</li>
            <li>To send administrative information</li>
            <li>To improve user experience</li>
            <li>To send marketing communications (with consent)</li>
            <li>To detect and prevent fraud</li>
          </ul>

          <h2>5. Payment Processing</h2>
          <p>
            We use Razorpay as our payment processor. Payment information is securely transmitted directly to Razorpay and is not stored on our servers. Razorpay's privacy policy governs the handling of your payment data.
          </p>

          <h2>6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information, including:
          </p>
          <ul>
            <li>SSL/TLS encryption for data transmission</li>
            <li>Encrypted storage of sensitive data</li>
            <li>Regular security audits</li>
            <li>Access controls and authentication</li>
          </ul>

          <h2>7. Your Rights</h2>
          <p>Under applicable data protection laws, you have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Delete your data</li>
            <li>Restrict processing</li>
            <li>Data portability</li>
            <li>Object to processing</li>
            <li>Withdraw consent at any time</li>
          </ul>

          <h2>8. Third-Party Services</h2>
          <p>We use the following third-party services:</p>
          <ul>
            <li>MongoDB Atlas - Database hosting</li>
            <li>Cloudinary - Image and video storage</li>
            <li>Razorpay - Payment processing</li>
            <li>Google Analytics - Website analytics</li>
            <li>Vercel - Website hosting</li>
          </ul>

          <h2>9. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at:
            <br />
            Email: privacy@techmintlab.com
            <br />
            Address: Bengaluru, Karnataka, India
          </p>
        </div>
      </div>
    </div>
  );
}
