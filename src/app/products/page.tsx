"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Star,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  ArrowUpRight,
  Code2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05 },
  }),
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [activeCategory, setActiveCategory] = useState("all");
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [page, sortBy, activeCategory, searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sort: sortBy,
      });
      if (activeCategory !== "all") params.set("category", activeCategory);
      if (search) params.set("search", search);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Hero */}
      <section className="relative py-16 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950/50 dark:to-zinc-950">
        <div className="absolute inset-0 bg-grid" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="default" className="mb-4">
            Marketplace
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Software Products
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8">
            Discover premium software solutions crafted for modern businesses.
          </p>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-zinc-400" />
              <Input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 h-14 text-lg rounded-xl"
              />
            </div>
          </form>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-20 z-30 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              <button
                onClick={() => { setActiveCategory("all"); setPage(1); }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === "all"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                }`}
              >
                All
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat._id}
                  onClick={() => { setActiveCategory(cat._id); setPage(1); }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    activeCategory === cat._id
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="text-sm bg-transparent border-none focus:outline-none text-zinc-600 dark:text-zinc-400"
              >
                <option value="-createdAt">Newest</option>
                <option value="-price">Price: High to Low</option>
                <option value="price">Price: Low to High</option>
                <option value="-rating">Top Rated</option>
                <option value="-downloads">Most Downloaded</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="aspect-video rounded-none" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <Code2 className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-zinc-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any, i: number) => (
                <motion.div
                  key={product._id}
                  custom={i}
                  variants={fadeInUp}
                  initial="hidden"
                  animate="visible"
                  className="group"
                >
                  <Link href={`/products/${product.slug}`}>
                    <Card className="overflow-hidden h-full hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
                      <div className="relative overflow-hidden">
                        <div className="aspect-video bg-zinc-100 dark:bg-zinc-800">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Code2 className="w-16 h-16 text-zinc-300 dark:text-zinc-600" />
                            </div>
                          )}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                          <Button size="sm" variant="secondary">
                            View Details
                            <ArrowUpRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                        <div className="absolute top-3 left-3 flex gap-2">
                          {product.isFeatured && (
                            <Badge variant="premium">Featured</Badge>
                          )}
                          {product.salePrice && product.salePrice < product.price && (
                            <Badge className="bg-red-500/90 text-white border-0">
                              -{Math.round((1 - product.salePrice / product.price) * 100)}%
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {product.category?.name || "General"}
                          </Badge>
                          <div className="flex items-center text-sm text-yellow-500">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="ml-1 text-zinc-600 dark:text-zinc-400">
                              {product.rating}
                            </span>
                          </div>
                        </div>
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                          {product.title}
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-baseline gap-2">
                            {product.salePrice ? (
                              <>
                                <span className="text-2xl font-bold text-gradient">
                                  ₹{(product.salePrice).toLocaleString("en-IN")}
                                </span>
                                <span className="text-sm text-zinc-400 line-through">
                                  ₹{product.price.toLocaleString("en-IN")}
                                </span>
                              </>
                            ) : (
                              <span className="text-2xl font-bold text-gradient">
                                ₹{product.price?.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-zinc-400">
                            {product.downloads || 0} downloads
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-zinc-500">
                  Page {page} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading products...</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
