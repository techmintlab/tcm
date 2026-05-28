"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  Minus,
  Plus,
  ArrowLeft,
  Tag,
  Loader2,
  ShoppingBag,
  Shield,
  Zap,
  Clock,
  ChevronRight,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, removeItem, clearCart, getTotal, getItemCount } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string;
    discountType: string;
    discountValue: number;
    discountAmount: number;
  } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-48 mb-8" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full mb-4 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const discount = appliedCoupon?.discountAmount || 0;
  const total = Math.max(0, subtotal - discount);
  const itemCount = getItemCount();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError("");

    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), orderAmount: subtotal }),
      });

      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon(data.coupon);
        toast.success(`Coupon applied! ${data.coupon.description}`);
      } else {
        setCouponError(data.error || "Invalid coupon");
      }
    } catch {
      setCouponError("Failed to validate coupon");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleCheckout = () => {
    if (!session?.user) {
      toast.error("Please sign in to checkout");
      router.push("/auth/login");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-900 dark:text-zinc-100">Cart</span>
        </div>

        {items.length === 0 ? (
          // Empty Cart
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold mb-3">Your Cart is Empty</h1>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any products yet. Browse our collection and find something you love.
            </p>
            <Link href="/products">
              <Button size="lg" className="gap-2">
                <ShoppingBag className="h-5 w-5" />
                Browse Products
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold">Shopping Cart</h1>
                  <p className="text-sm text-zinc-500">{itemCount} item{itemCount !== 1 ? "s" : ""}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    clearCart();
                    toast.success("Cart cleared");
                  }}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Thumbnail */}
                            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {item.thumbnail ? (
                                <img
                                  src={item.thumbnail}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <ShoppingCart className="w-8 h-8 text-zinc-400" />
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/products/${item.productId}`}
                                className="font-semibold hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-1"
                              >
                                {item.title}
                              </Link>
                              {item.plan && (
                                <p className="text-sm text-zinc-500 mt-0.5">
                                  Plan: {item.plan}
                                </p>
                              )}
                              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                                {formatPrice(item.price)}
                              </p>
                            </div>

                            {/* Quantity & Remove */}
                            <div className="flex items-center gap-3 self-end sm:self-auto">
                              <CartQuantity
                                productId={item.productId}
                                quantity={item.quantity}
                              />
                              <button
                                onClick={() => {
                                  removeItem(item.productId);
                                  toast.success("Item removed from cart");
                                }}
                                className="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="inline-flex items-center text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 mt-6 group"
              >
                <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>

                      {discount > 0 && (
                        <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                          <span>Discount</span>
                          <span>-{formatPrice(discount)}</span>
                        </div>
                      )}

                      <Separator />

                      <div className="flex justify-between text-base">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg">{formatPrice(total)}</span>
                      </div>

                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Secure checkout via Razorpay
                      </p>
                    </div>

                    {/* Coupon Code */}
                    <div className="mt-6">
                      {!appliedCoupon ? (
                        <div className="space-y-2">
                          <label className="text-sm font-medium flex items-center gap-1.5">
                            <Tag className="h-4 w-4" />
                            Have a coupon?
                          </label>
                          <div className="flex gap-2">
                            <Input
                              value={couponCode}
                              onChange={(e) => {
                                setCouponCode(e.target.value.toUpperCase());
                                setCouponError("");
                              }}
                              placeholder="Enter code"
                              className="flex-1 uppercase"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleApplyCoupon();
                              }}
                            />
                            <Button
                              variant="outline"
                              onClick={handleApplyCoupon}
                              disabled={validatingCoupon || !couponCode.trim()}
                            >
                              {validatingCoupon ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Apply"
                              )}
                            </Button>
                          </div>
                          {couponError && (
                            <p className="text-xs text-red-500">{couponError}</p>
                          )}
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Percent className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              <div>
                                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                  {appliedCoupon.code}
                                </p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">
                                  {appliedCoupon.description}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handleRemoveCoupon}
                              className="text-zinc-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      size="lg"
                      className="w-full mt-6 gap-2"
                      onClick={handleCheckout}
                    >
                      <Zap className="h-5 w-5" />
                      Proceed to Checkout
                    </Button>

                    {/* Trust badges */}
                    <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        Secure
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Instant
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Lifetime
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartQuantity({
  productId,
  quantity,
}: {
  productId: string;
  quantity: number;
}) {
  const updateItemQuantity = useCartStore((s) => s.updateItemQuantity);

  return (
    <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg">
      <button
        onClick={() => {
          if (quantity <= 1) {
            useCartStore.getState().removeItem(productId);
          } else {
            updateItemQuantity(productId, quantity - 1);
          }
        }}
        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-l-lg"
      >
        <Minus className="h-3 w-3" />
      </button>
      <span className="px-3 py-2 text-sm font-medium min-w-[2rem] text-center">
        {quantity}
      </span>
      <button
        onClick={() => updateItemQuantity(productId, quantity + 1)}
        className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors rounded-r-lg"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}
