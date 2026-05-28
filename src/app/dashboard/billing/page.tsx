"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Receipt,
  Download,
  Plus,
  CheckCircle2,
  Building2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockInvoices = [
  {
    id: "INV-2025-001",
    product: "SaaS Boilerplate Pro",
    amount: 4999,
    gst: 899.82,
    total: 5898.82,
    date: "2025-03-15",
    status: "paid",
  },
  {
    id: "INV-2025-002",
    product: "AI Chat Widget",
    amount: 2999,
    gst: 539.82,
    total: 3538.82,
    date: "2025-02-20",
    status: "paid",
  },
  {
    id: "INV-2025-003",
    product: "CRM Dashboard Kit",
    amount: 3999,
    gst: 719.82,
    total: 4718.82,
    date: "2025-01-10",
    status: "paid",
  },
];

export default function BillingPage() {
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Billing & Invoices</h1>
          <p className="text-sm text-zinc-500 mt-1">
            View your payment history and download invoices
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Billing Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Payment Methods */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Payment Methods</CardTitle>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-7 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Razorpay</p>
                      <p className="text-xs text-zinc-500">Default payment method</p>
                    </div>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3 mb-4">
                  <Building2 className="w-5 h-5 text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{session?.user?.name || "Your Name"}</p>
                    <p className="text-sm text-zinc-500">
                      123 Business Park, Sector 12<br />
                      Mumbai, Maharashtra 400001<br />
                      India
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Edit Address
                </Button>
              </CardContent>
            </Card>

            {/* Tax Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tax Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">GST Registered</span>
                    <span className="font-medium">Yes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">GSTIN</span>
                    <span className="font-medium">27ABCDE1234F1Z5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">PAN</span>
                    <span className="font-medium">ABCDE1234F</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right - Invoice History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Invoice History</CardTitle>
                  <Badge variant="outline">{mockInvoices.length} invoices</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {mockInvoices.length === 0 ? (
                  <div className="text-center py-8 text-zinc-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-zinc-300" />
                    <p>No invoices yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {mockInvoices.map((invoice, i) => (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500/50 transition-colors"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center">
                            <Receipt className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <p className="font-medium">{invoice.product}</p>
                            <div className="flex items-center gap-3 text-sm text-zinc-500 mt-0.5">
                              <span>{invoice.id}</span>
                              <span>&middot;</span>
                              <span>{new Date(invoice.date).toLocaleDateString("en-IN")}</span>
                              <span>&middot;</span>
                              <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                                {invoice.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-zinc-500 mt-0.5">
                              Subtotal: ₹{(invoice.amount / 100).toLocaleString("en-IN")} + GST: ₹{invoice.gst.toLocaleString("en-IN")}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold">
                            ₹{(invoice.total / 100).toLocaleString("en-IN")}
                          </span>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
