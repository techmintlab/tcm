"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  TicketPercent,
  Save,
  Copy,
  Clock,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export default function AdminCouponsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    minOrderAmount: "0",
    maxDiscount: "",
    usageLimit: "100",
    isActive: true,
    expiresAt: "",
  });

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set("isActive", filter);
      const res = await fetch(`/api/admin/coupons?${params}`);
      const data = await res.json();
      if (data.coupons) setCoupons(data.coupons);
    } catch {
      toast.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchCoupons(); }, [fetchCoupons]);

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setForm({ ...form, code });
  };

  const openCreate = () => {
    setEditingCoupon(null);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 30);
    setForm({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minOrderAmount: "0",
      maxDiscount: "",
      usageLimit: "100",
      isActive: true,
      expiresAt: tomorrow.toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description,
      discountType: coupon.discountType,
      discountValue: String(coupon.discountValue),
      minOrderAmount: String(coupon.minOrderAmount),
      maxDiscount: coupon.maxDiscount ? String(coupon.maxDiscount) : "",
      usageLimit: String(coupon.usageLimit),
      isActive: coupon.isActive,
      expiresAt: new Date(coupon.expiresAt).toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.discountValue) {
      toast.error("Code and discount value are required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        code: form.code.toUpperCase(),
        description: form.description,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue),
        minOrderAmount: parseFloat(form.minOrderAmount) || 0,
        maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
        usageLimit: parseInt(form.usageLimit) || 100,
        isActive: form.isActive,
        expiresAt: new Date(form.expiresAt).toISOString(),
      };

      let res;
      if (editingCoupon) {
        res = await fetch("/api/admin/coupons", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ couponId: editingCoupon._id, ...body }),
        });
      } else {
        res = await fetch("/api/admin/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        toast.success(editingCoupon ? "Coupon updated!" : "Coupon created!");
        setShowModal(false);
        fetchCoupons();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save coupon");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (couponId: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId }),
      });
      if (res.ok) {
        toast.success("Coupon deleted");
        fetchCoupons();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId: coupon._id, isActive: !coupon.isActive }),
      });
      if (res.ok) {
        toast.success(coupon.isActive ? "Deactivated" : "Activated");
        fetchCoupons();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied!");
  };

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Coupons</h1>
          <p className="text-zinc-500 mt-1">{coupons.length} coupons</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Coupon
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {["", "true", "false"].map((f) => (
          <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="text-xs sm:text-sm">
            {f === "" ? "All" : f === "true" ? "Active" : "Inactive"}
          </Button>
        ))}
      </div>

      {/* Coupons Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-zinc-400" />
            <p className="text-zinc-500">Loading coupons...</p>
          </CardContent>
        </Card>
      ) : coupons.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <TicketPercent className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
            <p className="font-medium mb-1">No coupons yet</p>
            <p className="text-sm text-zinc-500 mb-4">Create discount coupons to boost sales.</p>
            <Button onClick={openCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map((coupon) => {
            const expired = isExpired(coupon.expiresAt);
            return (
              <Card key={coupon._id} className={`group hover:border-emerald-500/30 transition-colors ${!coupon.isActive || expired ? "opacity-60" : ""}`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <code className="px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-sm font-mono font-bold tracking-wider">
                          {coupon.code}
                        </code>
                        <button onClick={() => copyCode(coupon.code)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
                          <Copy className="h-3.5 w-3.5 text-zinc-400" />
                        </button>
                      </div>
                      {coupon.description && (
                        <p className="text-xs text-zinc-500 mt-1">{coupon.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-2xl font-bold">
                      {coupon.discountType === "percentage"
                        ? `${coupon.discountValue}%`
                        : `₹${(coupon.discountValue / 100).toLocaleString("en-IN")}`}
                    </span>
                    <span className="text-xs text-zinc-500">OFF</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-500">
                    {coupon.minOrderAmount > 0 && (
                      <p>Min order: ₹{(coupon.minOrderAmount / 100).toLocaleString("en-IN")}</p>
                    )}
                    {coupon.maxDiscount > 0 && coupon.discountType === "percentage" && (
                      <p>Max discount: ₹{(coupon.maxDiscount / 100).toLocaleString("en-IN")}</p>
                    )}
                    <p className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      Used {coupon.usedCount}/{coupon.usageLimit}
                    </p>
                    <p className={`flex items-center gap-1 ${expired ? "text-red-500" : ""}`}>
                      <Clock className="h-3 w-3" />
                      {expired ? "Expired" : `Expires ${new Date(coupon.expiresAt).toLocaleDateString("en-IN")}`}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                    <Badge className={coupon.isActive && !expired ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"}>
                      {!coupon.isActive ? "Inactive" : expired ? "Expired" : "Active"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" onClick={() => toggleActive(coupon)} className="h-7 w-7">
                        <Badge variant="outline" className="px-1.5 py-0 text-xs">
                          {coupon.isActive ? "Deactivate" : "Activate"}
                        </Badge>
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(coupon)} className="h-7 w-7">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(coupon._id)} className="h-7 w-7 text-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
            <DialogDescription>Configure discount coupon details and restrictions.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Coupon Code *</Label>
              <div className="flex gap-2">
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="SAVE20"
                  className="font-mono font-bold uppercase"
                />
                <Button variant="outline" onClick={generateCode} size="sm" className="shrink-0">
                  Generate
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's this coupon for?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <select
                  value={form.discountType}
                  onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Discount Value *</Label>
                <Input
                  type="number"
                  value={form.discountValue}
                  onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                  placeholder={form.discountType === "percentage" ? "20" : "49900"}
                />
                <p className="text-xs text-zinc-400">
                  {form.discountType === "percentage" ? "Enter percentage (e.g., 20)" : "Enter amount in paise (e.g., 49900 = ₹499)"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Min Order Amount (paise)</Label>
                <Input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label>Max Discount (paise)</Label>
                <Input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="Unlimited" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Usage Limit</Label>
                <Input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="100" />
              </div>
              <div className="space-y-2">
                <Label>Expiry Date *</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-zinc-300" />
              <span className="text-sm">Active immediately</span>
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />{editingCoupon ? "Update" : "Create"}</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
