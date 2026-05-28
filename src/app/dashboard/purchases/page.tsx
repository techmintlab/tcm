"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Package, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const mockPurchases = [
  {
    id: "1",
    name: "SaaS Boilerplate Pro",
    category: "Web Development",
    purchasedAt: "2025-03-15",
    price: 4999,
    status: "active",
    downloadsLeft: 5,
    image: null,
  },
  {
    id: "2",
    name: "AI Chat Widget",
    category: "AI Solutions",
    purchasedAt: "2025-02-20",
    price: 2999,
    status: "active",
    downloadsLeft: 3,
    image: null,
  },
  {
    id: "3",
    name: "CRM Dashboard Kit",
    category: "SaaS Development",
    purchasedAt: "2025-01-10",
    price: 3999,
    status: "active",
    downloadsLeft: 8,
    image: null,
  },
];

export default function PurchasesPage() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");

  if (status === "unauthenticated") redirect("/auth/login");
  if (status === "loading") {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    );
  }

  const filteredPurchases = mockPurchases.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Purchases</h1>
            <p className="text-sm text-zinc-500 mt-1">
              View and manage all your purchased products
            </p>
          </div>
          <Link href="/products">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search purchases..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">Total Purchases</p>
              <p className="text-2xl font-bold mt-1">{mockPurchases.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">Active</p>
              <p className="text-2xl font-bold mt-1 text-emerald-600">
                {mockPurchases.filter((p) => p.status === "active").length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-zinc-500">Total Spent</p>
              <p className="text-2xl font-bold mt-1">
                ₹{(mockPurchases.reduce((a, p) => a + p.price, 0) / 100).toLocaleString("en-IN")}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Purchases List */}
        {filteredPurchases.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No purchases found</h3>
              <p className="text-zinc-500 mb-6">
                {searchQuery
                  ? "No purchases match your search. Try a different query."
                  : "You haven't purchased any products yet."}
              </p>
              <Link href="/products">
                <Button>
                  Browse Marketplace
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPurchases.map((purchase, i) => (
              <motion.div
                key={purchase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group hover:border-emerald-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0">
                          <Package className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold truncate">{purchase.name}</h3>
                            <Badge variant="default" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                              Active
                            </Badge>
                          </div>
                          <p className="text-sm text-zinc-500 mb-1">
                            {purchase.category} &middot; Purchased {new Date(purchase.purchasedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                          </p>
                          <p className="text-sm text-zinc-400">
                            Downloads left: {purchase.downloadsLeft} &middot; Price: ₹{(purchase.price / 100).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button size="sm" variant="outline">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
