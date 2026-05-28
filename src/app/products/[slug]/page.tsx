"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Star,
  Check,
  ShoppingCart,
  Play,
  Download,
  Code2,
  ChevronRight,
  Shield,
  Zap,
  Clock,
  Minus,
  Plus,
  ShoppingBag,
  FileText,
  ExternalLink,
  Hash,
  Layers,
  Tags,
  Monitor,
  MessageSquare,
  Verified,
  User as UserIcon,
  Edit3,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/useCartStore";
import { useSEO } from "@/hooks/useSEO";
import { useSession, signIn } from "next-auth/react";
import toast from "react-hot-toast";

function GitHubIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Review state
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsPagination, setReviewsPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [reviewForm, setReviewForm] = useState({ rating: 0, title: "", content: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editReviewId, setEditReviewId] = useState<string | null>(null);

  useEffect(() => {
    fetchProduct();
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`/api/products/${params.slug}`);
      const data = await res.json();
      setProduct(data.product);
      if (data.product?.pricingPlans?.length > 0) {
        setSelectedPlan(data.product.pricingPlans[0].name);
      }
    } catch (error) {
      console.error("Failed to fetch product:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async (page = 1) => {
    if (!product?._id) return;
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/products/${params.slug}/reviews?page=${page}&limit=10`);
      const data = await res.json();
      if (page === 1) {
        setReviews(data.reviews || []);
      } else {
        setReviews((prev) => [...prev, ...(data.reviews || [])]);
      }
      setReviewsPagination(data.pagination || { page: 1, totalPages: 1, total: 0 });
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      signIn();
      return;
    }
    if (reviewForm.rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewForm.title.trim()) {
      toast.error("Please enter a review title");
      return;
    }
    if (!reviewForm.content.trim()) {
      toast.error("Please enter your review");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${params.slug}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewForm),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to submit review");
        return;
      }
      toast.success(data.message || "Review submitted successfully!");
      setReviewForm({ rating: 0, title: "", content: "" });
      setEditReviewId(null);
      fetchReviews(1);
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBuy = () => {
    if (!product) return;
    const plan = product.pricingPlans?.find((p: any) => p.name === selectedPlan);
    const price = plan?.price || product.salePrice || product.price;
    addItem({
      productId: product._id,
      title: product.title,
      price,
      thumbnail: product.thumbnail,
      quantity,
      plan: selectedPlan || undefined,
    });
    toast.success(
      <div className="flex items-center gap-2">
        <ShoppingCart className="h-4 w-4" />
        <span>Added {quantity} item{quantity > 1 ? "s" : ""} to cart!</span>
      </div>
    );
  };

  // Reset quantity when plan changes
  useEffect(() => {
    setQuantity(1);
  }, [selectedPlan]);

  // Fetch reviews when tab switches to reviews
  useEffect(() => {
    if (activeTab === "reviews" && product) {
      fetchReviews(1);
    }
  }, [activeTab, product?._id]);

  // SEO
  const allImages = product
    ? [product.thumbnail, ...(product.images || [])].filter(Boolean)
    : [];
  useSEO({
    title: product?.seoTitle || product?.title,
    description: product?.seoDescription || product?.description,
    image: product?.thumbnail || "/logo.png",
    url: product ? `/products/${product.slug}` : undefined,
    type: "product",
    schema: product
      ? {
          "@type": "Product",
          name: product.title,
          description: product.description,
          image: product.thumbnail,
          sku: product._id,
          brand: { "@type": "Brand", name: "TechMintLab" },
          offers: {
            "@type": "Offer",
            price: product.salePrice || product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
          },
          ...(product.reviewCount > 0
            ? {
                aggregateRating: {
                  "@type": "AggregateRating",
                  ratingValue: product.rating,
                  reviewCount: product.reviewCount,
                },
              }
            : {}),
        }
      : undefined,
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Skeleton className="aspect-video rounded-2xl" />
              <div className="flex gap-3 mt-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="w-20 h-16 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center">
          <Code2 className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-zinc-500 mb-6">The product you're looking for doesn't exist.</p>
          <Link href="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const price = product.salePrice || product.price;
  const unitPrice = product.pricingPlans?.find((p: any) => p.name === selectedPlan)?.price || price;
  const totalPrice = unitPrice * quantity;
  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center space-x-2 text-sm text-zinc-500 flex-wrap">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="hover:text-emerald-600">Products</Link>
          <ChevronRight className="h-4 w-4" />
          {product.category && (
            <>
              <Link href={`/products?category=${product.category._id}`} className="hover:text-emerald-600">
                {product.category.name}
              </Link>
              <ChevronRight className="h-4 w-4" />
            </>
          )}
          <span className="text-zinc-900 dark:text-zinc-100 truncate">{product.title}</span>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 aspect-video">
              {allImages[selectedImage] ? (
                <img
                  src={allImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Code2 className="w-24 h-24 text-zinc-300 dark:text-zinc-600" />
                </div>
              )}
              {/* Overlay badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {product.isFeatured && <Badge variant="premium">Featured</Badge>}
                {discount > 0 && (
                  <Badge className="bg-red-500/90 text-white border-0">
                    -{discount}% Off
                  </Badge>
                )}
              </div>
              {/* Demo & Video buttons */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {product.demoUrl && (
                  <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="secondary">
                      <Monitor className="mr-1.5 h-4 w-4" />
                      Live Demo
                    </Button>
                  </a>
                )}
                {product.videoUrl && (
                  <a href={product.videoUrl} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="secondary">
                      <Play className="mr-1.5 h-4 w-4" />
                      Watch Video
                    </Button>
                  </a>
                )}
              </div>
            </div>

            {/* Thumbnail strip */}
            {allImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {allImages.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      selectedImage === i
                        ? "border-emerald-500 ring-2 ring-emerald-500/20"
                        : "border-transparent hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right - Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <Badge variant="default" className="mb-4">
              {product.category?.name || "Product"}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>

            {/* Rating & Stats */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.round(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-zinc-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
                <span className="ml-2 text-sm text-zinc-500">
                  {product.rating} ({product.reviewCount || 0} reviews)
                </span>
              </div>
              <span className="text-sm text-zinc-400">
                <Download className="inline h-4 w-4 mr-1" />
                {product.downloads || 0} downloads
              </span>
              {product.version && (
                <Badge variant="secondary" className="text-xs">
                  <Hash className="h-3 w-3 mr-1" />
                  v{product.version}
                </Badge>
              )}
            </div>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
              {product.description}
            </p>

            {/* Quick Info Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {product.technologies?.slice(0, 5).map((tech: string) => (
                <Badge key={tech} variant="secondary" className="text-xs gap-1">
                  <Code2 className="h-3 w-3" />
                  {tech}
                </Badge>
              ))}
              {product.technologies?.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{product.technologies.length - 5} more
                </Badge>
              )}
            </div>

            {/* Pricing Plans Selector */}
            {product.pricingPlans?.length > 0 ? (
              <div className="mb-8">
                <p className="text-sm font-medium text-zinc-500 mb-3">Select Plan</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.pricingPlans.map((plan: any, i: number) => {
                    const isSelected = selectedPlan === plan.name;
                    return (
                      <button
                        key={i}
                        onClick={() => setSelectedPlan(plan.name)}
                        className={`relative text-left p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-md shadow-emerald-500/10"
                            : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-600"
                        }`}
                      >
                        {plan.isPopular && (
                          <Badge variant="premium" className="absolute -top-2.5 right-3 text-[10px]">
                            Popular
                          </Badge>
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{plan.name}</span>
                          {isSelected && <Check className="h-4 w-4 text-emerald-500" />}
                        </div>
                        <p className="text-2xl font-bold">₹{plan.price?.toLocaleString()}</p>
                        <p className="text-xs text-zinc-500 mt-1 line-clamp-1">{plan.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-bold text-gradient">
                  ₹{price?.toLocaleString()}
                </span>
                {product.salePrice && (
                  <span className="text-xl text-zinc-400 line-through">
                    ₹{product.price?.toLocaleString()}
                  </span>
                )}
                {discount > 0 && (
                  <Badge className="bg-red-500/10 text-red-600 border-0">
                    Save {discount}%
                  </Badge>
                )}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium text-zinc-500 mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-l-xl"
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </button>
                  <span className="px-5 py-3 text-lg font-semibold min-w-[3rem] text-center tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-r-xl"
                  >
                    <Plus className="h-4 w-4 text-zinc-600 dark:text-zinc-400" />
                  </button>
                </div>
                <span className="text-sm text-zinc-400">
                  {quantity > 1 ? `${quantity} licenses` : "1 license"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-4">
              <Button size="xl" className="flex-1 gap-2" onClick={handleBuy}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
              <Link href="/cart">
                <Button size="xl" variant="outline" className="gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  View Cart
                </Button>
              </Link>
            </div>

            {/* Price Summary */}
            <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">
                  {selectedPlan || product.title}
                  {quantity > 1 ? ` × ${quantity}` : ""}
                </span>
                <span className="font-semibold">₹{totalPrice.toLocaleString()}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{totalPrice.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-zinc-500">
              <span className="flex items-center">
                <Shield className="mr-1.5 h-4 w-4 text-emerald-500" />
                Secure Payment
              </span>
              <span className="flex items-center">
                <Zap className="mr-1.5 h-4 w-4 text-emerald-500" />
                Instant Download
              </span>
              <span className="flex items-center">
                <Clock className="mr-1.5 h-4 w-4 text-emerald-500" />
                Lifetime Access
              </span>
            </div>
          </motion.div>
        </div>

        {/* ===TABS SECTION=== */}
        <div className="mt-16">
          <div className="flex space-x-1 border-b border-zinc-200 dark:border-zinc-800 mb-8 overflow-x-auto">
            {[
              { key: "overview", label: "Overview" },
              { key: "features", label: `Features (${product.features?.length || 0})` },
              { key: "pricing", label: "Pricing" },
              { key: "faq", label: `FAQ (${product.faqs?.length || 0})` },
              { key: "reviews", label: `Reviews (${product.reviewCount || 0})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">About This Product</h2>
                  <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
                    {product.content || product.description}
                  </div>

                  {product.technologies?.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <Code2 className="h-5 w-5 text-emerald-500" />
                        Technologies
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {product.technologies.map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Side info card */}
              <div>
                <Card>
                  <CardContent className="p-6 space-y-5">
                    <h3 className="font-semibold">Product Info</h3>
                    <div className="space-y-4 text-sm">
                      {product.category && (
                        <div className="flex items-center gap-3">
                          <Tags className="h-4 w-4 text-zinc-400" />
                          <div>
                            <p className="text-zinc-500">Category</p>
                            <p className="font-medium">{product.category.name}</p>
                          </div>
                        </div>
                      )}
                      {product.version && (
                        <div className="flex items-center gap-3">
                          <Hash className="h-4 w-4 text-zinc-400" />
                          <div>
                            <p className="text-zinc-500">Version</p>
                            <p className="font-medium">v{product.version}</p>
                          </div>
                        </div>
                      )}
                      {product.fileSize && (
                        <div className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-zinc-400" />
                          <div>
                            <p className="text-zinc-500">File Size</p>
                            <p className="font-medium">{product.fileSize}</p>
                          </div>
                        </div>
                      )}
                      {product.downloads > 0 && (
                        <div className="flex items-center gap-3">
                          <Download className="h-4 w-4 text-zinc-400" />
                          <div>
                            <p className="text-zinc-500">Downloads</p>
                            <p className="font-medium">{product.downloads}</p>
                          </div>
                        </div>
                      )}
                      {product.updatedAt && (
                        <div className="flex items-center gap-3">
                          <Clock className="h-4 w-4 text-zinc-400" />
                          <div>
                            <p className="text-zinc-500">Last Updated</p>
                            <p className="font-medium">
                              {new Date(product.updatedAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Separator />

                    {/* Links */}
                    <div className="space-y-2">
                      {product.demoUrl && (
                        <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                            <ExternalLink className="h-4 w-4" />
                            Live Demo
                          </Button>
                        </a>
                      )}
                      {product.githubUrl && (
                        <a href={product.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                            <GitHubIcon className="h-4 w-4" />
                            View on GitHub
                          </Button>
                        </a>
                      )}
                      {product.documentation && (
                        <a href={product.documentation} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                            <FileText className="h-4 w-4" />
                            Documentation
                          </Button>
                        </a>
                      )}
                      {product.fileUrl && (
                        <a href={product.fileUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                            <Download className="h-4 w-4" />
                            Download File
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Tab: Features */}
          {activeTab === "features" && (
            <div>
              {product.features?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.features.map((feature: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-5 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <Check className="h-4 w-4 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-zinc-700 dark:text-zinc-300">{feature}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-zinc-500">No features listed yet.</p>
              )}
            </div>
          )}

          {/* Tab: Pricing */}
          {activeTab === "pricing" && (
            <div>
              {product.pricingPlans?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {product.pricingPlans.map((plan: any, i: number) => (
                    <Card
                      key={i}
                      className={`relative cursor-pointer transition-all ${
                        selectedPlan === plan.name
                          ? "ring-2 ring-emerald-500 shadow-lg shadow-emerald-500/10"
                          : plan.isPopular
                            ? "border-emerald-500 shadow-lg shadow-emerald-500/10"
                            : ""
                      }`}
                      onClick={() => setSelectedPlan(plan.name)}
                    >
                      {plan.isPopular && (
                        <Badge variant="premium" className="absolute -top-3 left-1/2 -translate-x-1/2">
                          Most Popular
                        </Badge>
                      )}
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          {selectedPlan === plan.name && (
                            <Check className="h-5 w-5 text-emerald-500" />
                          )}
                        </div>
                        <p className="text-3xl font-bold mb-2">₹{plan.price?.toLocaleString()}</p>
                        <p className="text-sm text-zinc-500 mb-4">{plan.description}</p>
                        <ul className="space-y-2 mb-6">
                          {plan.features?.map((feature: string, j: number) => (
                            <li key={j} className="flex items-start gap-2 text-sm">
                              <Check className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className="w-full gap-2"
                          variant={plan.isPopular || selectedPlan === plan.name ? "default" : "outline"}
                          onClick={() => {
                            setSelectedPlan(plan.name);
                            handleBuy();
                          }}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          {selectedPlan === plan.name ? "Add to Cart" : plan.buttonText || "Buy Now"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">
                    ₹{price?.toLocaleString()}
                  </p>
                  <p className="text-sm text-zinc-500 mt-1">One-time payment, lifetime access</p>
                  <Button size="lg" className="mt-6 gap-2" onClick={handleBuy}>
                    <ShoppingCart className="h-5 w-5" />
                    Buy Now
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Tab: FAQ */}
          {activeTab === "faq" && (
            <div>
              {product.faqs?.length > 0 ? (
                <div className="max-w-3xl space-y-4">
                  {product.faqs.map((faq: any, i: number) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <h4 className="font-semibold mb-2">{faq.question}</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-center py-12 text-zinc-500">No FAQs available for this product.</p>
              )}
            </div>
          )}

          {/* Tab: Reviews */}
          {activeTab === "reviews" && (
            <div className="max-w-4xl mx-auto">
              {/* Review Summary */}
              {!reviewsLoading && reviews.length > 0 && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 mb-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-emerald-600 dark:text-emerald-400">
                      {product.rating}
                    </div>
                    <div className="flex items-center justify-center gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(product.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-zinc-300 dark:text-zinc-700"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-zinc-500 mt-1">
                      {reviewsPagination.total} review{reviewsPagination.total !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <div className="flex-1 w-full">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = reviews.filter((r: any) => Math.round(r.rating) === star).length;
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-2 text-sm">
                          <span className="text-zinc-500 w-8 text-right">{star}</span>
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <div className="flex-1 h-2 rounded-full bg-zinc-200 dark:bg-zinc-700 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-yellow-400 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-zinc-400 w-6 text-xs">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Write Review Form */}
              <div className="mb-8 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-emerald-500" />
                  {session ? "Write a Review" : "Share Your Experience"}
                </h3>
                {session ? (
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Star Rating */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 mb-2">
                        Your Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                            className="p-1 transition-all hover:scale-110 active:scale-95"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= reviewForm.rating
                                  ? "fill-yellow-400 text-yellow-400 drop-shadow-sm"
                                  : "text-zinc-300 dark:text-zinc-700 hover:text-yellow-300"
                              } transition-colors`}
                            />
                          </button>
                        ))}
                        {reviewForm.rating > 0 && (
                          <span className="ml-2 text-sm text-zinc-500 self-center">
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][reviewForm.rating]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 mb-1">
                        Review Title
                      </label>
                      <input
                        type="text"
                        value={reviewForm.title}
                        onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                        placeholder="Summarize your experience"
                        maxLength={120}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                      />
                      <p className="text-xs text-zinc-400 mt-1 text-right">
                        {reviewForm.title.length}/120
                      </p>
                    </div>

                    {/* Content */}
                    <div>
                      <label className="block text-sm font-medium text-zinc-500 mb-1">
                        Your Review
                      </label>
                      <textarea
                        value={reviewForm.content}
                        onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                        placeholder="Tell others about your experience. What did you like or dislike?"
                        rows={4}
                        maxLength={2000}
                        className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all resize-none"
                      />
                      <p className="text-xs text-zinc-400 mt-1 text-right">
                        {reviewForm.content.length}/2000
                      </p>
                    </div>

                    <Button
                      type="submit"
                      disabled={submittingReview}
                      className="gap-2"
                    >
                      {submittingReview ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Review
                        </>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <MessageSquare className="w-12 h-12 mx-auto text-zinc-300 dark:text-zinc-700 mb-3" />
                    <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                      Sign in to share your experience with this product.
                    </p>
                    <Button onClick={() => signIn()} variant="outline" className="gap-2">
                      <UserIcon className="h-4 w-4" />
                      Sign In to Review
                    </Button>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Customer Reviews
                  {reviewsPagination.total > 0 && (
                    <span className="text-sm font-normal text-zinc-400 ml-2">
                      ({reviewsPagination.total} total)
                    </span>
                  )}
                </h3>

                {reviewsLoading && reviews.length === 0 ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 animate-pulse">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                          <div className="flex-1">
                            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-700 rounded mb-1" />
                            <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-700 rounded" />
                          </div>
                        </div>
                        <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
                        <div className="h-3 w-full bg-zinc-200 dark:bg-zinc-700 rounded mb-1" />
                        <div className="h-3 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review: any) => (
                      <div
                        key={review._id}
                        className="p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 dark:bg-emerald-900/50 flex-shrink-0">
                              {review.user?.image ? (
                                <img
                                  src={review.user.image}
                                  alt={review.user.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <UserIcon className="w-5 h-5 text-emerald-500" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-sm truncate">
                                  {review.user?.name || "Anonymous"}
                                </p>
                                {review.isVerified && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-1.5 py-0.5 rounded-full">
                                    <Verified className="w-3 h-3" />
                                    Verified
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center gap-0.5">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-3.5 h-3.5 ${
                                        i < review.rating
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-zinc-200 dark:text-zinc-700"
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-[11px] text-zinc-400">
                                  {new Date(review.createdAt).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <h4 className="font-semibold text-sm mt-3">{review.title}</h4>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                          {review.content}
                        </p>
                      </div>
                    ))}

                    {/* Load More */}
                    {reviewsPagination.page < reviewsPagination.totalPages && (
                      <div className="text-center pt-2">
                        <Button
                          variant="outline"
                          onClick={() => fetchReviews(reviewsPagination.page + 1)}
                          disabled={reviewsLoading}
                          className="gap-2"
                        >
                          {reviewsLoading ? (
                            <>
                              <div className="h-4 w-4 border-2 border-zinc-400 border-t-zinc-800 dark:border-t-zinc-200 rounded-full animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="h-4 w-4" />
                              Load More Reviews ({reviewsPagination.total - reviews.length} remaining)
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                    <MessageSquare className="w-16 h-16 mx-auto text-zinc-300 dark:text-zinc-700 mb-4" />
                    <h4 className="text-lg font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
                      No Reviews Yet
                    </h4>
                    <p className="text-sm text-zinc-500 max-w-md mx-auto">
                      Be the first to share your experience with this product. Your review helps other customers make informed decisions.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
