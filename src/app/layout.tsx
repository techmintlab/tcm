import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SiteLayoutWrapper } from "@/components/layout/SiteLayoutWrapper";
import { siteConfig } from "@/config/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - Premium Software Marketplace & Digital Products`,
    template: `%s | ${siteConfig.name}`,
  },
  description:
    "Premium software marketplace and digital product platform offering cutting-edge solutions. Build Faster. Scale Smarter. Explore our collection of software, SaaS products, and development services.",
  keywords: [
    "software marketplace",
    "digital products",
    "web development",
    "SaaS",
    "tech solutions",
    "India software",
    "TechMintLab",
    "software development",
    "mobile apps",
    "AI solutions",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - Premium Software Marketplace & Digital Products`,
    description:
      "Premium software marketplace and digital product platform. Build Faster. Scale Smarter.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - Premium Software Marketplace`,
    description:
      "Premium software marketplace and digital product platform. Build Faster. Scale Smarter.",
    images: ["/logo.png"],
    creator: "@techmintlab",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${poppins.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href={siteConfig.url} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/logo.png`,
              description: siteConfig.description,
              address: {
                "@type": "PostalAddress",
                addressLocality: "Bengaluru",
                addressRegion: "Karnataka",
                addressCountry: "India",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: siteConfig.contact.email,
                telephone: siteConfig.contact.phone,
                contactType: "sales",
              },
              sameAs: [
                siteConfig.links.twitter,
                siteConfig.links.github,
                siteConfig.links.linkedin,
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <SiteLayoutWrapper>{children}</SiteLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
