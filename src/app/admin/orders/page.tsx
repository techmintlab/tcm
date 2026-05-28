"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface Order {
  _id: string;
  orderId: string;
  user: { _id: string; name: string; email: string };
  products: { product: { _id: string; title: string }; price: number }[];
  totalAmount: number;
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  orderStatus: "processing" | "completed" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

export default function AdminOrdersPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (filter) params.set("paymentStatus", filter);
      const res = await fetch(`/api/admin/orders?${params}`);
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const updateOrderStatus = async (orderId: string, updates: any) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, ...updates }),
      });
      if (res.ok) {
        toast.success("Order updated");
        fetchOrders();
      } else {
        toast.error("Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  const paymentStatusColors: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    pending: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    failed: "bg-red-500/10 text-red-600 dark:text-red-400",
    refunded: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  };

  const orderStatusColors: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    processing: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    cancelled: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-zinc-500 mt-1">{orders.length} orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by order ID, email, name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", "paid", "pending", "failed", "refunded"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter(f); setPage(1); }}
              className="text-xs sm:text-sm"
            >
              {f || "All"}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders Table (Desktop) */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Order ID</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Customer</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden md:table-cell">Amount</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden md:table-cell">Payment</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden lg:table-cell">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden lg:table-cell">Date</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-zinc-500">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading orders...
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center text-zinc-500">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
                      <p className="font-medium mb-1">No orders yet</p>
                      <p className="text-sm">Orders will appear here after customers make purchases.</p>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order._id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4">
                        <span className="text-sm font-mono">{order.orderId}</span>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-medium">{order.user?.name || "Guest"}</p>
                        <p className="text-xs text-zinc-500">{order.user?.email || "—"}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="font-medium">₹{(order.totalAmount / 100).toLocaleString("en-IN")}</span>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge className={paymentStatusColors[order.paymentStatus] || ""}>
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => updateOrderStatus(order._id, { orderStatus: e.target.value })}
                          className="text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1"
                        >
                          <option value="processing">Processing</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-sm text-zinc-500">
                          {new Date(order.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button size="sm" variant="outline">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Orders Cards */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading orders...
            </CardContent>
          </Card>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-zinc-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
              <p className="font-medium mb-1">No orders yet</p>
              <p className="text-sm">Orders will appear here after customers make purchases.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-mono text-zinc-500 mb-0.5">{order.orderId}</p>
                    <p className="font-medium text-sm truncate">{order.user?.name || "Guest"}</p>
                    <p className="text-xs text-zinc-500 truncate">{order.user?.email || "—"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge className={paymentStatusColors[order.paymentStatus] || ""}>
                      {order.paymentStatus}
                    </Badge>
                    <Button size="icon" variant="ghost" className="h-7 w-7">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    ₹{(order.totalAmount / 100).toLocaleString("en-IN")}
                  </span>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order._id, { orderStatus: e.target.value })}
                      className="text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2 py-1.5"
                    >
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <span className="text-xs text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-zinc-500">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
