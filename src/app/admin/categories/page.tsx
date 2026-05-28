"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  FolderTree,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  parent?: { _id: string; name: string; slug: string } | string;
  order: number;
  isActive: boolean;
  createdAt: string;
}

export default function AdminCategoriesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    icon: "",
    order: "0",
    isActive: true,
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const openCreate = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "", image: "", icon: "", order: String(categories.length), isActive: true });
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description,
      image: cat.image || "",
      icon: cat.icon || "",
      order: String(cat.order),
      isActive: cat.isActive,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Category name is required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        image: form.image || undefined,
        icon: form.icon || undefined,
        order: parseInt(form.order) || 0,
        isActive: form.isActive,
      };

      let res;
      if (editingCategory) {
        res = await fetch("/api/admin/categories", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ categoryId: editingCategory._id, ...body }),
        });
      } else {
        res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        toast.success(editingCategory ? "Category updated!" : "Category created!");
        setShowModal(false);
        fetchCategories();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save category");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm("Delete this category? Products in this category may need re-assignment.")) return;
    try {
      const res = await fetch("/api/admin/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId }),
      });
      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error("Failed to delete");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const toggleActive = async (cat: Category) => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: cat._id, isActive: !cat.isActive }),
      });
      if (res.ok) {
        toast.success(cat.isActive ? "Disabled" : "Enabled");
        fetchCategories();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-zinc-500 mt-1">{categories.length} categories</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-zinc-400" />
            <p className="text-zinc-500">Loading categories...</p>
          </CardContent>
        </Card>
      ) : sortedCategories.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FolderTree className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
            <p className="font-medium mb-1">No categories yet</p>
            <p className="text-sm text-zinc-500 mb-4">Create categories to organize your products.</p>
            <Button onClick={openCreate} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCategories.map((cat) => (
            <Card key={cat._id} className="group hover:border-emerald-500/30 transition-colors relative">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center">
                      <FolderTree className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{cat.name}</h3>
                      <p className="text-xs text-zinc-500">/{cat.slug}</p>
                    </div>
                  </div>
                  <Badge className={cat.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-500/10 text-zinc-600"}>
                    {cat.isActive ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500 line-clamp-2 mb-3">{cat.description}</p>
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Order: {cat.order}</span>
                  <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity">
                    <Button size="icon" variant="ghost" onClick={() => toggleActive(cat)} className="h-7 w-7">
                      <Badge variant="outline" className="px-1.5 py-0 text-xs">{cat.isActive ? "Disable" : "Enable"}</Badge>
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(cat)} className="h-7 w-7">
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(cat._id)} className="h-7 w-7 text-red-500">
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
            <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
            <DialogDescription>
              {editingCategory ? "Update category details." : "Create a new product category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Category description" rows={3} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Icon Name</Label>
                <Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="e.g., Code2" />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="rounded border-zinc-300" />
              <span className="text-sm">Active</span>
            </label>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</> : <><Save className="h-4 w-4 mr-2" />{editingCategory ? "Update" : "Create"}</>}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
