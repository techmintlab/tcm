"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  ShoppingBag,
  Heart,
  Settings,
  User,
  Package,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";

const dashboardLinks = [
  {
    title: "My Purchases",
    description: "View your purchased products and download links",
    icon: Package,
    href: "/dashboard/purchases",
    count: "3",
  },
  {
    title: "Downloads",
    description: "Access your downloadable files",
    icon: Download,
    href: "/dashboard/downloads",
    count: "5",
  },
  {
    title: "Wishlist",
    description: "Products you've saved for later",
    icon: Heart,
    href: "/dashboard/wishlist",
    count: "2",
  },
  {
    title: "Orders",
    description: "View your order history",
    icon: ShoppingBag,
    href: "/dashboard/orders",
    count: "3",
  },
  {
    title: "Billing",
    description: "Payment methods and invoices",
    icon: CreditCard,
    href: "/dashboard/billing",
  },
  {
    title: "Profile",
    description: "Manage your account settings",
    icon: User,
    href: "/dashboard/profile",
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") {
    redirect("/auth/login");
  }

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
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 sm:h-16 sm:w-16">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-lg">
                {session?.user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Welcome back, {session?.user?.name}</h1>
              <p className="text-sm text-zinc-500">{session?.user?.email}</p>
            </div>
          </div>
          <Link href="/products" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">
              Browse Products
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Purchases", value: "3", icon: ShoppingBag },
            { label: "Downloads", value: "5", icon: Download },
            { label: "Wishlist", value: "2", icon: Heart },
            { label: "Orders", value: "3", icon: Package },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-zinc-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Dashboard Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardLinks.map((link, i) => (
            <motion.div
              key={link.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={link.href}>
                <Card className="h-full group hover:border-emerald-500/50 transition-all cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <link.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      {link.count && (
                        <Badge variant="default">{link.count}</Badge>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-sm text-zinc-500">{link.description}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
          <Card>
            <CardContent className="p-8 text-center text-zinc-500">
              <p>No recent activity yet. Start by exploring our products!</p>
              <Link href="/products">
                <Button variant="outline" className="mt-4">
                  Browse Marketplace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
