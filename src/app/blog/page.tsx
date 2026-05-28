"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SafeImage from "@/components/ui/SafeImage";
import { useSEO } from "@/hooks/useSEO";
import { siteConfig } from "@/config/site";

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
  published: boolean;
  featured: boolean;
  createdAt: string;
}

function BlogCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-6">
        <Skeleton className="h-5 w-24 mb-3" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-2/3 mb-4" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);

  // SEO
  const featuredPosts = allPosts.filter(p => p.featured && p.published).slice(0, 3);
  useSEO({
    title: "Blog & Resources",
    description: "Explore tutorials, guides, and insights from the TechMintLab team on web development, SaaS, AI, mobile apps, and more. Stay ahead with expert tips and best practices.",
    url: "/blog",
    type: "website",
    schema: {
      "@type": "CollectionPage",
      name: "TechMintLab Blog",
      description: "Tutorials, guides, and insights from the TechMintLab team.",
      url: `${siteConfig.url}/blog`,
      ...(featuredPosts.length > 0 ? {
        mainEntity: featuredPosts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          description: p.excerpt,
          image: p.coverImage,
          datePublished: p.createdAt,
          author: { "@type": "Person", name: p.author },
        })),
      } : {}),
    },
  });

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ page: String(page), limit: "9" });
      if (activeCategory !== "All") params.set("category", activeCategory);
      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        setError(data.error || "Failed to load posts");
      }
    } catch {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (posts.length > 0) {
      setAllPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newPosts = posts.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newPosts];
      });
    }
  }, [posts]);

  // Extract unique categories from posts
  const categories = ["All", ...new Set(posts.map((p) => p.category).filter(Boolean))];

  // Client-side search filter
  const filtered = search
    ? posts.filter((post) =>
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
      )
    : posts;

  // Reset page when category changes
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950/50 dark:to-zinc-950">
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="default" className="mb-4">Our Blog</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Insights & Resources</h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
            Tutorials, guides, and insights from the TechMintLab team on web development,
            SaaS, AI, and more.
          </p>
          <div className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
            <Input
              type="search"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <Card className="p-12 text-center">
            <p className="text-zinc-500 mb-4">{error}</p>
            <Button onClick={fetchPosts} variant="outline">
              Try Again
            </Button>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-zinc-500 mb-2 font-medium">No posts found</p>
            <p className="text-sm text-zinc-400 mb-4">
              {search ? "Try a different search term" : "Check back later for new content."}
            </p>
            {search && (
              <Button onClick={() => setSearch("")} variant="outline" size="sm">
                Clear Search
              </Button>
            )}
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((post, i) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/blog/${post.slug}`}>
                    <Card className="h-full group overflow-hidden hover:shadow-xl transition-all duration-500">
                      <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                        <SafeImage
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          wrapperClassName="w-full h-full bg-zinc-100 dark:bg-zinc-800"
                        />
                      </div>
                      <CardContent className="p-6">
                        <Badge variant="secondary" className="mb-3">{post.category}</Badge>
                        <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {post.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-zinc-500">
                          <div className="flex items-center space-x-3">
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {new Date(post.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {post.readingTime || "?"} min read
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-zinc-500 px-4">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
