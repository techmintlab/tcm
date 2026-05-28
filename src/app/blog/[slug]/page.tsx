"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  Tag,
  Loader2,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import SafeImage from "@/components/ui/SafeImage";
import { marked } from "marked";
import { useSEO } from "@/hooks/useSEO";
import { siteConfig } from "@/config/site";
import toast from "react-hot-toast";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  readingTime: number;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  schemaType?: "Article" | "TechArticle" | "BlogPosting" | "NewsArticle";
  createdAt: string;
  updatedAt?: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!params.slug) return;
    setLoading(true);
    setError("");
    fetch(`/api/blog/${params.slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Post not found");
        return res.json();
      })
      .then((data) => {
        if (data.post) setPost(data.post);
        else throw new Error("Post not found");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.slug]);

  // Advanced SEO with full schema markup
  useSEO({
    title: post?.seoTitle || post?.title,
    description: post?.seoDescription || post?.excerpt,
    image: post?.ogImage || post?.coverImage || "/logo.png",
    url: `/blog/${post?.slug}`,
    type: "article",
    publishedAt: post?.createdAt,
    author: post?.author,
    schema: post
      ? {
          "@type": post.schemaType || "Article",
          headline: post.seoTitle || post.title,
          description: post.seoDescription || post.excerpt,
          image: post.ogImage || post.coverImage,
          datePublished: post.createdAt,
          dateModified: post.updatedAt || post.createdAt,
          author: {
            "@type": "Person",
            name: post.author,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            logo: {
              "@type": "ImageObject",
              url: `${siteConfig.url}${siteConfig.logo}`,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${siteConfig.url}/blog/${post.slug}`,
          },
          ...(post.tags?.length > 0
            ? {
                keywords: post.seoKeywords?.join(", ") || post.tags.join(", "),
              }
            : {}),
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-5 w-24 mb-8" />
          <Skeleton className="h-5 w-20 mb-8" />
          <Skeleton className="h-10 w-3/4 mb-3" />
          <Skeleton className="h-10 w-1/2 mb-6" />
          <div className="flex gap-4 mb-12">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="aspect-video w-full rounded-2xl mb-12" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </article>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center py-20">
          <p className="text-zinc-500 mb-4 text-lg">{error || "Post not found"}</p>
          <Link href="/blog">
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
        </article>
      </div>
    );
  }

  // Render markdown content
  const renderedContent = marked(post.content, { async: false }) as string;

  return (
    <div className="min-h-screen pt-24 pb-20">
      <article className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center text-sm text-zinc-500 hover:text-emerald-600 transition-colors mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Badge variant="default" className="mb-4">
            {post.category}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {post.readingTime || "?"} min read
            </span>
            <span>By {post.author}</span>
          </div>
        </motion.div>

        {/* Cover Image */}
        <div className="aspect-video rounded-2xl overflow-hidden mb-12 bg-zinc-100 dark:bg-zinc-800">
          <SafeImage
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
            wrapperClassName="w-full h-full"
          />
        </div>

        {/* Content - Rendered Markdown */}
        {post.excerpt && (
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            {post.excerpt}
          </p>
        )}
        <div
          className="prose prose-zinc dark:prose-invert max-w-none mb-12
            prose-headings:font-bold prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400
            prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
            prose-code:bg-zinc-100 dark:prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-950 prose-pre:text-zinc-100 prose-pre:rounded-xl prose-pre:p-4
            prose-img:rounded-xl prose-img:my-8
            prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 dark:prose-blockquote:bg-emerald-950/20 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
            prose-ul:space-y-1 prose-li:text-zinc-600 dark:prose-li:text-zinc-400
            prose-strong:text-zinc-800 dark:prose-strong:text-zinc-200"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="px-3 py-1">
                <Tag className="w-3 h-3 mr-1.5" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Social Share */}
        <div className="flex flex-wrap items-center gap-3 mb-12 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
          <span className="text-sm font-medium text-zinc-500 flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share this article
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              X (Twitter)
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteConfig.url}/blog/${post.slug}`)}`,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => {
                navigator.clipboard.writeText(`${siteConfig.url}/blog/${post.slug}`);
                toast.success("Link copied to clipboard!");
              }}
            >
              <LinkIcon className="h-3.5 w-3.5" />
              Copy Link
            </Button>
          </div>
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
                { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
                { "@type": "ListItem", position: 3, name: post.title, item: `${siteConfig.url}/blog/${post.slug}` },
              ],
            }),
          }}
        />

        <Separator className="mb-12" />

        {/* Navigation */}
        <div className="flex justify-between">
          <Link href="/blog">
            <Button variant="outline" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
