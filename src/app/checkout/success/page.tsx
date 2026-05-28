"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Download,
  LayoutDashboard,
  ShoppingBag,
  ChevronRight,
  PartyPopper,
  FileText,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!orderId) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/30 dark:to-orange-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-3">No Order Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">
            We couldn&apos;t find your order details. Please check your dashboard for your orders.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/dashboard/orders">
              <Button variant="outline">View Orders</Button>
            </Link>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-zinc-500 mb-8">
          <Link href="/" className="hover:text-emerald-600">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/cart" className="hover:text-emerald-600">Cart</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">Order Confirmed</span>
        </div>

        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-xl shadow-emerald-500/5">
            <CardContent className="p-8 sm:p-12 text-center">
              {/* Animated Check */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/25"
              >
                <PartyPopper className="w-10 h-10 text-white" />
              </motion.div>

              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mb-2">
                Thank you for your purchase. Your order has been confirmed.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                Order ID: {orderId}
              </div>

              <Separator className="my-8" />

              {/* What's Next */}
              <div className="text-left space-y-4 mb-8">
                <h3 className="font-semibold text-base">What&apos;s Next?</h3>

                <div className="grid gap-3">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                      <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Download Your Products</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Access your purchased products from the Dashboard &gt; Downloads section.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Check Your Email</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        We&apos;ve sent an invoice and download instructions to your email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Need Help?</p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        Contact our support team if you have any questions or issues.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard/downloads" className="flex-1">
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Go to Downloads
                  </Button>
                </Link>
                <Link href="/dashboard/orders" className="flex-1">
                  <Button variant="outline" className="w-full gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    View Orders
                  </Button>
                </Link>
              </div>

              <div className="mt-4">
                <Link href="/products">
                  <Button variant="ghost" className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading...</div>
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
