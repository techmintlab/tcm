"use client";

import { useEffect } from "react";
import { siteConfig } from "@/config/site";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  publishedAt?: string;
  author?: string;
  schema?: Record<string, any>;
}

export function useSEO({
  title,
  description,
  image = "/logo.png",
  url,
  type = "website",
  publishedAt,
  author,
  schema,
}: SEOProps = {}) {
  useEffect(() => {
    const pageTitle = title
      ? `${title} | ${siteConfig.name}`
      : `${siteConfig.name} - Premium Software Marketplace & Digital Products`;
    const pageDesc = description || siteConfig.description;
    const pageUrl = url || siteConfig.url;
    const fullImage = image.startsWith("http") ? image : `${siteConfig.url}${image}`;

    document.title = pageTitle;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Basic meta
    setMeta("description", pageDesc);
    setMeta("keywords", `TechMintLab, software marketplace, digital products, SaaS, ${title || ""}`);

    // Open Graph
    setMeta("og:title", pageTitle, true);
    setMeta("og:description", pageDesc, true);
    setMeta("og:image", fullImage, true);
    setMeta("og:url", pageUrl, true);
    setMeta("og:type", type, true);
    setMeta("og:site_name", siteConfig.name, true);

    // Twitter
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", pageTitle);
    setMeta("twitter:description", pageDesc);
    setMeta("twitter:image", fullImage);

    // Article meta
    if (publishedAt) {
      setMeta("article:published_time", publishedAt, true);
    }
    if (author) {
      setMeta("article:author", author, true);
    }

    // JSON-LD Schema
    if (schema) {
      let schemaEl = document.querySelector("#seo-schema");
      if (!schemaEl) {
        schemaEl = document.createElement("script");
        schemaEl.setAttribute("id", "seo-schema");
        schemaEl.setAttribute("type", "application/ld+json");
        document.head.appendChild(schemaEl);
      }
      schemaEl.textContent = JSON.stringify({
        "@context": "https://schema.org",
        ...schema,
      });
    }

    // Canonical URL
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    return () => {
      // Cleanup: reset title on unmount
      document.title = `${siteConfig.name} - Premium Software Marketplace & Digital Products`;
    };
  }, [title, description, image, url, type, publishedAt, author, schema]);
}
