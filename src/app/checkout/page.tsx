"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingCart,
  ChevronRight,
  Loader2,
  Shield,
  CheckCircle2,
  ArrowLeft,
  User,
  Mail,
  CreditCard,
  Lock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, getTotal, clearCart } = useCartStore();
  const [processing, setProcessing] = useState(false);
  const [razorpayError, setRazorpayError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Load Razorpay checkout script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onerror = () => setRazorpayError(true);
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // Redirect unauthenticated users
  useEffect(() => {
    if (mounted && status === "unauthenticated") {
      toast.error("Please sign in to checkout");
      router.push("/auth/login?callbackUrl=/checkout");
    }
  }, [mounted, status, router]);

  // Redirect to cart if empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/cart");
    }
  }, [mounted, items.length, router]);

  if (!mounted || status === "loading") {
    return (
      <div className="min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || items.length === 0) {
    return null; // Will redirect
  }

  const subtotal = getTotal();
  const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

  const handlePayment = async () => {
    if (!razorpayKey) {
      toast.error("Payment gateway is not configured. Please contact support.");
      return;
    }

    if (!window.Razorpay) {
      toast.error("Payment gateway is loading. Please try again.");
      return;
    }

    setProcessing(true);

    try {
      // 1. Create order on backend
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: subtotal,
          products: items.map((item) => ({
            productId: item.productId,
            price: item.price,
            plan: item.plan,
            quantity: item.quantity,
          })),
        }),
      });

      if (!orderRes.ok) {
        const errData = await orderRes.json();
        throw new Error(errData.error || "Failed to create order");
      }

      const orderData = await orderRes.json();

      // 2. Open Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "TechMintLab",
        description: `Purchase of ${items.length} item(s)`,
        order_id: orderData.razorpayOrderId,
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: {
          color: "#059669",
        },
        handler: async function (response: any) {
          // 3. Verify payment on backend
          try {
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  orderId: orderData.orderId,
                  amount: subtotal,
                  products: items.map((item) => ({
                    productId: item.productId,
                    price: item.price,
                    plan: item.plan,
                    quantity: item.quantity,
                  })),
                }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              clearCart();
              router.push(`/checkout/success?orderId=${verifyData.orderId}`);
            } else {
              throw new Error(verifyData.error || "Payment verification failed");
            }
          } catch (error: any) {
            toast.error(error.message || "Payment verification failed");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
            toast("Payment cancelled", { icon: "ℹ️" });
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment");
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/cart" className="hover:text-emerald-600">Cart</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-zinc-900 dark:text-zinc-100">Checkout</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Customer Info & Payment */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-2xl font-bold mb-6">Checkout</h1>

              {/* Contact Info */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-emerald-500" />
                    Contact Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                      <User className="h-5 w-5 text-zinc-400" />
                      <span className="text-sm font-medium">{session?.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                      <Mail className="h-5 w-5 text-zinc-400" />
                      <span className="text-sm font-medium">{session?.user?.email}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Razorpay Load Warning */}
              {razorpayError && (
                <Card className="mb-6 border-red-200 dark:border-red-800">
                  <CardContent className="p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        Payment gateway failed to load
                      </p>
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        Please check your internet connection, disable any ad blockers, and refresh the page. If the issue persists, contact support.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Payment Method */}
              <Card className="mb-6">
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <CreditCard className="h-5 w-5 text-emerald-500" />
                    Payment Method
                  </h2>
                  <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 rounded-lg bg-white dark:bg-zinc-800 flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                        <CreditCard className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Razorpay</p>
                        <p className="text-xs text-zinc-500">
                          Pay via UPI, Cards, Net Banking, or Wallets
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items Review */}
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                    <ShoppingCart className="h-5 w-5 text-emerald-500" />
                    Items ({items.length})
                  </h2>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700 flex-shrink-0 flex items-center justify-center overflow-hidden">
                            {item.thumbnail ? (
                              <img
                                src={item.thumbnail}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ShoppingCart className="w-5 h-5 text-zinc-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{item.title}</p>
                            {item.plan && (
                              <p className="text-xs text-zinc-500">{item.plan}</p>
                            )}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-sm font-semibold">{formatPrice(item.price)}</p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-zinc-500">× {item.quantity}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Subtotal</span>
                        <span className="font-medium">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Tax</span>
                        <span className="text-green-600 font-medium">Included</span>
                      </div>

                      <Separator />

                      <div className="flex justify-between text-base">
                        <span className="font-semibold">Total</span>
                        <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                          {formatPrice(subtotal)}
                        </span>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <Button
                      size="lg"
                      className="w-full mt-6 gap-2"
                      onClick={handlePayment}
                      disabled={processing}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="h-5 w-5" />
                          Pay {formatPrice(subtotal)}
                        </>
                      )}
                    </Button>

                    {/* Security Info */}
                    <div className="mt-4 space-y-2">
                      <div className="flex items-start gap-2 text-xs text-zinc-500">
                        <Shield className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>
                          Your payment is securely processed by Razorpay. We do not store your card details.
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-zinc-500">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>
                          Instant access after payment — download your products immediately.
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-zinc-500">
                        <AlertCircle className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                        <span>
                          7-day refund policy. Contact support if you have any issues.
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Back to Cart */}
                <Link
                  href="/cart"
                  className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 mt-4 group"
                >
                  <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  Back to Cart
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
