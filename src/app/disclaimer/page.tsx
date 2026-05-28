import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description:
    "TechMintLab's disclaimer covering limitation of liability, third-party tool usage, software risks, and external links. Information provided for informational purposes only.",
  openGraph: {
    title: "Disclaimer | TechMintLab",
    description:
      "TechMintLab's disclaimer covering limitation of liability and software usage risks.",
    url: "/disclaimer",
    siteName: "TechMintLab",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer | TechMintLab",
    description:
      "TechMintLab's disclaimer covering limitation of liability and software usage risks.",
  },
  alternates: {
    canonical: "/disclaimer",
  },
};

export default function DisclaimerPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${siteConfig.url}/disclaimer#webpage`,
        url: `${siteConfig.url}/disclaimer`,
        name: "Disclaimer | TechMintLab",
        description:
          "TechMintLab's disclaimer covering limitation of liability and software usage risks.",
        isPartOf: { "@id": `${siteConfig.url}#website` },
        about: { "@type": "Thing", name: "Disclaimer" },
        dateModified: "2025-01-01",
        inLanguage: "en-US",
        breadcrumb: { "@id": `${siteConfig.url}/disclaimer#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${siteConfig.url}/disclaimer#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
          { "@type": "ListItem", position: 2, name: "Disclaimer", item: `${siteConfig.url}/disclaimer` },
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
          <span className="text-zinc-900 dark:text-zinc-100">Disclaimer</span>
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Limitation of Liability</h2>
          <p>
            TechMintLab provides digital products and services on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the merchantability, fitness for a particular purpose, or non-infringement of any product sold on our platform.
          </p>
          <h2>2. Third-Party Tools</h2>
          <p>
            Our products may integrate with third-party tools and services. We are not responsible for any issues arising from the use of third-party tools, including but not limited to:
          </p>
          <ul>
            <li>Service outages or downtime</li>
            <li>Data loss or security breaches</li>
            <li>Changes in API or service terms</li>
          </ul>
          <h2>3. Software Usage Risks</h2>
          <p>
            By using any software purchased from TechMintLab, you acknowledge and accept the following risks:
          </p>
          <ul>
            <li>Software may contain bugs or errors</li>
            <li>Compatibility issues with your existing systems</li>
            <li>Performance variations based on hosting environment</li>
          </ul>
          <h2>4. No Professional Advice</h2>
          <p>
            Content on our website, including blog posts and documentation, is for informational purposes only and does not constitute professional advice. You should consult qualified professionals for specific advice.
          </p>
          <h2>5. External Links</h2>
          <p>
            Our website may contain links to external sites. We are not responsible for the content or practices of these third-party websites.
          </p>
        </div>
      </div>
    </div>
  );
}
