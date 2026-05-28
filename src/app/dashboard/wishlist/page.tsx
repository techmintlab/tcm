"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, ShoppingCart, Trash2, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockWishlist = [
  {
    id: "1",
    name: "Next.js E-commerce Starter",
    category: "Web Development",
    price: 3499,
    rating: 4.8,
    inStock: true,
  },
  {
    id: "2",
    name: "AI Content Generator API",
    category: "AI Solutions",
    price: 5999,
    rating: 4.6,
    inStock: true,
  },
  {
    id: "3",
    name: "React Native Mobile Kit",
    category: "Mobile App Development",
    price: 4499,
    rating: 4.7,
    inStock: false,
  },
  {
    id: "4",
    name: "DevOps Deployment Scripts",
    category: "DevOps",
    price: 1999,
    rating: 4.5,
    inStock: true,
  },
  {
    id: "5",
    name: "UI Component Library Pro",
    category: "UI/UX Design",
    price: 2499,
    rating: 4.9,
    inStock: true,
  },
];

export default function WishlistPage() {
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
            <h1 className="text-2xl font-bold">My Wishlist</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Products you&apos;ve saved for later — {mockWishlist.length} items
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Browse All Products
            </Button>
          </Link>
        </div>

        {/* Wishlist Items */}
        {mockWishlist.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Heart className="w-12 h-12 mx-auto text-zinc-300 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
              <p className="text-zinc-500 mb-6">
                Save your favorite products here and come back to buy them later.
              </p>
              <Link href="/products">
                <Button>
                  Explore Products
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockWishlist.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="h-full group hover:border-emerald-500/50 transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500/10 to-purple-500/10 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-rose-500" fill="currentColor" />
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <h3 className="font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-zinc-500 mb-3">{item.category}</p>

                    <div className="flex items-center mb-3">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium ml-1">{item.rating}</span>
                      <Badge
                        variant={item.inStock ? "default" : "outline"}
                        className={`ml-2 ${
                          item.inStock
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                            : "text-zinc-400 border-zinc-200 dark:border-zinc-700"
                        }`}
                      >
                        {item.inStock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">
                        ₹{(item.price / 100).toLocaleString("en-IN")}
                      </span>
                      <Button size="sm" disabled={!item.inStock}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add to Cart
                      </Button>
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
