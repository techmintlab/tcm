"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Package, Download, ChevronRight, Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockOrders = [
  {
    id: "ORD-2025-001",
    product: "SaaS Boilerplate Pro",
    amount: 4999,
    status: "completed",
    date: "2025-03-15",
    paymentMethod: "Razorpay",
    invoice: "#INV-001",
  },
  {
    id: "ORD-2025-002",
    product: "AI Chat Widget",
    amount: 2999,
    status: "completed",
    date: "2025-02-20",
    paymentMethod: "Razorpay",
    invoice: "#INV-002",
  },
  {
    id: "ORD-2025-003",
    product: "CRM Dashboard Kit",
    amount: 3999,
    status: "completed",
    date: "2025-01-10",
    paymentMethod: "Razorpay",
    invoice: "#INV-003",
  },
  {
    id: "ORD-2025-004",
    product: "E-commerce Template Pro",
    amount: 5499,
    status: "pending",
    date: "2025-04-01",
    paymentMethod: "Razorpay",
    invoice: "#INV-004",
  },
  {
    id: "ORD-2025-005",
    product: "DevOps Toolkit",
    amount: 1999,
    status: "failed",
    date: "2025-03-28",
    paymentMethod: "Razorpay",
    invoice: "#INV-005",
  },
];

const statusStyles: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") redirect("/auth/login");
  if (status === "loading") {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">Order History</h1>
            <p className="text-sm text-zinc-500 mt-1">
              View all your orders and their status
            </p>
          </div>
          <Link href="/products">
            <Button>
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop More
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">Total Orders</p>
              <p className="text-2xl font-bold mt-1">{mockOrders.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">Completed</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">
                {mockOrders.filter((o) => o.status === "completed").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">Pending</p>
              <p className="text-2xl font-bold mt-1 text-amber-600">
                {mockOrders.filter((o) => o.status === "pending").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">Total Spent</p>
              <p className="text-2xl font-bold mt-1">
                ₹{(mockOrders.reduce((a, o) => a + o.amount, 0) / 100).toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {mockOrders.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <ShoppingBag className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-zinc-500 mb-6">Start exploring our marketplace and place your first order.</p>
                <Link href="/products">
                  <Button>
                    Browse Products
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            mockOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group hover:border-emerald-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{order.product}</h3>
                            <Badge
                              className={statusStyles[order.status] || ""}
                            >
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-500">
                            <span>Order: {order.id}</span>
                            <span>&middot;</span>
                            <span>{new Date(order.date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</span>
                            <span>&middot;</span>
                            <span>₹{(order.amount / 100).toLocaleString("en-IN")}</span>
                            <span>&middot;</span>
                            <span>{order.paymentMethod}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline">
                          <Receipt className="h-4 w-4 mr-1" />
                          Invoice
                        </Button>
                        {order.status === "completed" && (
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
