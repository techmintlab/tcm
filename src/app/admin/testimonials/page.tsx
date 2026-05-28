"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Star,
  Save,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import toast from "react-hot-toast";

interface Testimonial {
  _id: string;
  name: string;
  company: string;
  designation: string;
  content: string;
  avatar: string;
  rating: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
}

export default function AdminTestimonialsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    designation: "",
    content: "",
    avatar: "",
    rating: "5",
    isFeatured: false,
    isActive: true,
  });

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter) params.set("isActive", filter);
      const res = await fetch(`/api/admin/testimonials?${params}`);
      const data = await res.json();
      if (data.testimonials) setTestimonials(data.testimonials);
    } catch {
      toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const openCreate = () => {
    setEditingTestimonial(null);
    setForm({ name: "", company: "", designation: "", content: "", avatar: "", rating: "5", isFeatured: false, isActive: true });
    setShowModal(true);
  };

  const openEdit = (t: Testimonial) => {
    setEditingTestimonial(t);
    setForm({
      name: t.name,
      company: t.company || "",
      designation: t.designation || "",
      content: t.content,
      avatar: t.avatar || "",
      rating: String(t.rating),
      isFeatured: t.isFeatured,
      isActive: t.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.content) {
      toast.error("Name and testimonial content are required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        company: form.company,
        designation: form.designation,
        content: form.content,
        avatar: form.avatar || undefined,
        rating: parseInt(form.rating) || 5,
        isFeatured: form.isFeatured,
        isActive: form.isActive,
      };

      let res;
      if (editingTestimonial) {
        res = await fetch("/api/admin/testimonials", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ testimonialId: editingTestimonial._id, ...body }),
        });
      } else {
        res = await fetch("/api/admin/testimonials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        toast.success(editingTestimonial ? "Testimonial updated!" : "Testimonial created!");
        setShowModal(false);
        fetchTestimonials();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save testimonial");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (testimonialId: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId }),
      });
      if (res.ok) {
        toast.success("Testimonial deleted");
        fetchTestimonials();
      }
    } catch {
      toast.error("Failed to delete");
    }
  };

  const toggleFeatured = async (t: Testimonial) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId: t._id, isFeatured: !t.isFeatured }),
      });
      if (res.ok) {
        toast.success(t.isFeatured ? "Unfeatured" : "Featured");
        fetchTestimonials();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const toggleActive = async (t: Testimonial) => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId: t._id, isActive: !t.isActive }),
      });
      if (res.ok) {
        toast.success(t.isActive ? "Disabled" : "Enabled");
        fetchTestimonials();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-3.5 w-3.5 ${i < rating ? "text-amber-500 fill-amber-500" : "text-zinc-300"}`} />
    ));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-zinc-500 mt-1">{testimonials.length} testimonials</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Testimonial
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

      {/* Testimonials Grid */}
      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-zinc-400" />
            <p className="text-zinc-500">Loading testimonials...</p>
          </CardContent>
        </Card>
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Quote className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
            <p className="font-medium mb-1">No testimonials yet</p>
            <p className="text-sm text-zinc-500 mb-4">Add testimonials to showcase customer feedback.</p>
            <Button onClick={openCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <Card key={t._id} className={`group hover:border-emerald-500/30 transition-colors ${!t.isActive ? "opacity-60" : ""}`}>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={t.avatar || ""} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-sm">
                        {t.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">{t.name}</h3>
                      <p className="text-xs text-zinc-500">
                        {t.designation}{t.designation && t.company ? " at " : ""}{t.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">{renderStars(t.rating)}</div>
                </div>

                <div className="relative mb-3">
                  <Quote className="absolute -top-1 -left-1 h-6 w-6 text-emerald-200 dark:text-emerald-800/50 -z-0" />
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 italic pl-4 relative z-10 line-clamp-3">
                    "{t.content}"
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Badge className={t.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-500/10 text-zinc-600"}>
                      {t.isActive ? "Active" : "Hidden"}
                    </Badge>
                    {t.isFeatured && (
                      <Badge className="bg-amber-500/10 text-amber-600">
                        <Star className="h-3 w-3 mr-1" fill="currentColor" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => toggleFeatured(t)} className="h-7 w-7" title="Toggle featured">
                      <Star className={`h-3.5 w-3.5 ${t.isFeatured ? "text-amber-500 fill-amber-500" : ""}`} />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => toggleActive(t)} className="h-7 w-7" title="Toggle active">
                      <Badge variant="outline" className="px-1.5 py-0 text-xs">{t.isActive ? "Hide" : "Show"}</Badge>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(t)} className="h-7 w-7">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(t._id)} className="h-7 w-7 text-red-500">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            <DialogDescription>Add customer feedback or review.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Client name" />
              </div>
              <div className="space-y-2">
                <Label>Rating</Label>
                <select
                  value={form.rating}
                  onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company</Label>
                <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} placeholder="e.g., CEO" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Testimonial *</Label>
              <Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="What they said..." rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Avatar URL</Label>
              <Input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="rounded border-zinc-300" />
                <span className="text-sm">Featured</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-zinc-300" />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />{editingTestimonial ? "Update" : "Create"}</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
