"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  ShoppingBag,
  Package,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface DashboardStats {
  revenue: number;
  orders: number;
  users: number;
  products: number;
  unreadMessages: number;
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((data) => {
        if (data.stats) setStats(data.stats);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-zinc-400">Loading dashboard...</div>
      </div>
    );
  }

  if (status === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  const statCards = [
    {
      label: "Total Revenue",
      value: stats ? `₹${(stats.revenue / 100).toLocaleString("en-IN")}` : "₹0",
      icon: IndianRupee,
      change: "+12.5%",
      trend: "up" as const,
      color: "emerald",
    },
    {
      label: "Orders",
      value: stats?.orders?.toLocaleString() || "0",
      icon: ShoppingBag,
      change: "+8.2%",
      trend: "up" as const,
      color: "blue",
    },
    {
      label: "Users",
      value: stats?.users?.toLocaleString() || "0",
      icon: Users,
      change: "+15.3%",
      trend: "up" as const,
      color: "violet",
    },
    {
      label: "Products",
      value: stats?.products?.toLocaleString() || "0",
      icon: Package,
      change: "+3",
      trend: "up" as const,
      color: "amber",
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-500 mt-1">Welcome back, {session?.user?.name}</p>
        </div>
        <div className="flex items-center gap-3">
          {stats && stats.unreadMessages > 0 && (
            <Link href="/admin/messages">
              <Button variant="outline" className="relative">
                <MessageSquare className="h-4 w-4 mr-2" />
                Messages
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {stats.unreadMessages}
                </Badge>
              </Button>
            </Link>
          )}
          <Link href="/admin/products">
            <Button>
              <Package className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center`}
                >
                  <stat.icon
                    className={`w-5 h-5 text-${stat.color}-600 dark:text-${stat.color}-400`}
                  />
                </div>
                <span
                  className={`text-sm font-medium flex items-center ${
                    stat.trend === "up"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-zinc-500">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "Products",
            desc: "Manage your software products",
            icon: Package,
            href: "/admin/products",
            color: "from-emerald-500/10 to-blue-500/10",
          },
          {
            title: "Orders",
            desc: "View and manage orders",
            icon: ShoppingBag,
            href: "/admin/orders",
            color: "from-blue-500/10 to-violet-500/10",
          },
          {
            title: "Blog Posts",
            desc: "Create and manage content",
            icon: ArrowUpRight,
            href: "/admin/blog",
            color: "from-amber-500/10 to-orange-500/10",
          },
          {
            title: "Users",
            desc: "Manage registered users",
            icon: Users,
            href: "/admin/users",
            color: "from-violet-500/10 to-pink-500/10",
          },
          {
            title: "Categories",
            desc: "Organize product categories",
            icon: Package,
            href: "/admin/categories",
            color: "from-cyan-500/10 to-emerald-500/10",
          },
          {
            title: "Coupons",
            desc: "Create discount campaigns",
            icon: Package,
            href: "/admin/coupons",
            color: "from-rose-500/10 to-purple-500/10",
          },
        ].map((item) => (
          <Link key={item.title} href={item.href}>
            <Card className="h-full group hover:border-emerald-500/50 transition-all cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <item.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-zinc-500">{item.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
