"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Image,
  Code,
  FileText,
  Settings,
  Tags,
  HelpCircle,
  CreditCard,
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

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular: boolean;
  buttonText: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content?: string;
  price: number;
  salePrice?: number;
  currency: string;
  category: { _id: string; name: string; slug: string } | string;
  thumbnail: string;
  images: string[];
  videoUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  features: string[];
  technologies: string[];
  rating: number;
  reviewCount: number;
  downloads: number;
  isFeatured: boolean;
  isTrending: boolean;
  status: "active" | "draft" | "archived";
  version: string;
  fileUrl?: string;
  fileSize?: string;
  documentation?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  faqs: FAQItem[];
  pricingPlans: PricingPlan[];
  createdAt: string;
}

type FormTab = "basic" | "media" | "pricing" | "features" | "seo" | "faq" | "settings";

const FORM_TABS: { id: FormTab; label: string; icon: any }[] = [
  { id: "basic", label: "Basic", icon: FileText },
  { id: "media", label: "Media", icon: Image },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "features", label: "Features", icon: Code },
  { id: "seo", label: "SEO", icon: Tags },
  { id: "faq", label: "FAQ", icon: HelpCircle },
  { id: "settings", label: "Settings", icon: Settings },
];

function ArrayInput({
  label,
  values,
  onChange,
  placeholder,
  addLabel,
}: {
  label: string;
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
  addLabel?: string;
}) {
  const [input, setInput] = useState("");
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder || `Add ${label.toLowerCase()}...`}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              e.preventDefault();
              onChange([...values, input.trim()]);
              setInput("");
            }
          }}
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            if (input.trim()) {
              onChange([...values, input.trim()]);
              setInput("");
            }
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {values.map((v, i) => (
            <Badge key={i} variant="secondary" className="gap-1 pl-3">
              {v}
              <button
                onClick={() => onChange(values.filter((_, j) => j !== i))}
                className="ml-1 hover:text-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminProductsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>("basic");
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [planFeatureInputs, setPlanFeatureInputs] = useState<Record<number, string>>({});
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    price: "",
    salePrice: "",
    currency: "INR",
    status: "active" as "active" | "draft" | "archived",
    isFeatured: false,
    isTrending: false,
    thumbnail: "",
    images: [] as string[],
    videoUrl: "",
    demoUrl: "",
    githubUrl: "",
    features: [] as string[],
    technologies: [] as string[],
    version: "1.0.0",
    fileUrl: "",
    fileSize: "",
    documentation: "",
    rating: "0",
    reviewCount: "0",
    downloads: "0",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [] as string[],
    faqs: [] as FAQItem[],
    pricingPlans: [] as PricingPlan[],
  });

  const updateForm = (partial: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories");
      const data = await res.json();
      if (data.categories) setCategories(data.categories);
    } catch {}
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (showModal) setActiveTab("basic");
  }, [showModal]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm({
      title: "",
      description: "",
      content: "",
      category: categories.length > 0 ? categories[0]._id : "",
      price: "",
      salePrice: "",
      currency: "INR",
      status: "active",
      isFeatured: false,
      isTrending: false,
      thumbnail: "",
      images: [],
      videoUrl: "",
      demoUrl: "",
      githubUrl: "",
      features: [],
      technologies: [],
      version: "1.0.0",
      fileUrl: "",
      fileSize: "",
      documentation: "",
      rating: "0",
      reviewCount: "0",
      downloads: "0",
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],
      faqs: [],
      pricingPlans: [],
    });
    setShowModal(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    const catId = typeof product.category === "object" ? product.category._id : product.category;
    setForm({
      title: product.title,
      description: product.description || "",
      content: product.content || "",
      category: catId || "",
      price: String(product.price),
      salePrice: product.salePrice ? String(product.salePrice) : "",
      currency: product.currency || "INR",
      status: product.status,
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      thumbnail: product.thumbnail || "",
      images: product.images || [],
      videoUrl: product.videoUrl || "",
      demoUrl: product.demoUrl || "",
      githubUrl: product.githubUrl || "",
      features: product.features || [],
      technologies: product.technologies || [],
      version: product.version || "1.0.0",
      fileUrl: product.fileUrl || "",
      fileSize: product.fileSize || "",
      documentation: product.documentation || "",
      rating: String(product.rating || 0),
      reviewCount: String(product.reviewCount || 0),
      downloads: String(product.downloads || 0),
      seoTitle: product.seoTitle || "",
      seoDescription: product.seoDescription || "",
      seoKeywords: product.seoKeywords || [],
      faqs: product.faqs || [],
      pricingPlans: (product.pricingPlans || []).map((p) => ({
        ...p,
        price: String(p.price),
      })),
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.price || !form.description || !form.category || !form.thumbnail) {
      toast.error("Title, description, category, thumbnail, and price are required");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: form.title,
        description: form.description,
        content: form.content || undefined,
        category: form.category,
        price: parseFloat(form.price),
        salePrice: form.salePrice ? parseFloat(form.salePrice) : undefined,
        currency: form.currency,
        status: form.status,
        isFeatured: form.isFeatured,
        isTrending: form.isTrending,
        thumbnail: form.thumbnail,
        images: form.images,
        videoUrl: form.videoUrl || undefined,
        demoUrl: form.demoUrl || undefined,
        githubUrl: form.githubUrl || undefined,
        features: form.features,
        technologies: form.technologies,
        version: form.version || "1.0.0",
        fileUrl: form.fileUrl || undefined,
        fileSize: form.fileSize || undefined,
        documentation: form.documentation || undefined,
        rating: parseFloat(form.rating) || 0,
        reviewCount: parseInt(form.reviewCount) || 0,
        downloads: parseInt(form.downloads) || 0,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        seoKeywords: form.seoKeywords,
        faqs: form.faqs,
        pricingPlans: form.pricingPlans.map((p) => ({
          ...p,
          price: parseFloat(p.price),
          features: p.features,
        })),
      };

      let res;
      if (editingProduct) {
        res = await fetch(`/api/admin/products/${editingProduct._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        toast.success(editingProduct ? "Product updated!" : "Product created!");
        setShowModal(false);
        fetchProducts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save product");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Product deleted");
        fetchProducts();
      } else {
        toast.error("Failed to delete product");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const toggleFeatured = async (product: Product) => {
    try {
      const res = await fetch(`/api/admin/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !product.isFeatured }),
      });
      if (res.ok) {
        toast.success(product.isFeatured ? "Unfeatured" : "Featured");
        fetchProducts();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  const statusColors: Record<string, string> = {
    active: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    draft: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    archived: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder="Product name"
              />
            </div>
            <div className="space-y-2">
              <Label>Description *</Label>
              <Textarea
                value={form.description}
                onChange={(e) => updateForm({ description: e.target.value })}
                placeholder="Short product description"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Full Content (Markdown supported)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => updateForm({ content: e.target.value })}
                placeholder="Detailed product description, markdown supported..."
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <Label>Category *</Label>
              <select
                value={form.category}
                onChange={(e) => updateForm({ category: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>Version</Label>
              <Input
                value={form.version}
                onChange={(e) => updateForm({ version: e.target.value })}
                placeholder="1.0.0"
              />
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Thumbnail URL *</Label>
              <Input
                value={form.thumbnail}
                onChange={(e) => updateForm({ thumbnail: e.target.value })}
                placeholder="https://..."
              />
              {form.thumbnail && (
                <div className="mt-2 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 w-40 h-28">
                  <img
                    src={form.thumbnail}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <ArrayInput
              label="Gallery Images (URLs)"
              values={form.images}
              onChange={(vals) => updateForm({ images: vals })}
              placeholder="https://example.com/image.jpg"
              addLabel="Add Image"
            />
            <div className="space-y-2">
              <Label>Product Video URL</Label>
              <Input
                value={form.videoUrl}
                onChange={(e) => updateForm({ videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </div>
            <div className="space-y-2">
              <Label>Live Demo URL</Label>
              <Input
                value={form.demoUrl}
                onChange={(e) => updateForm({ demoUrl: e.target.value })}
                placeholder="https://demo.example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>GitHub URL</Label>
              <Input
                value={form.githubUrl}
                onChange={(e) => updateForm({ githubUrl: e.target.value })}
                placeholder="https://github.com/username/repo"
              />
            </div>
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (in paise) *</Label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => updateForm({ price: e.target.value })}
                  placeholder="4999"
                />
              </div>
              <div className="space-y-2">
                <Label>Sale Price</Label>
                <Input
                  type="number"
                  value={form.salePrice}
                  onChange={(e) => updateForm({ salePrice: e.target.value })}
                  placeholder="3999"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Currency</Label>
              <select
                value={form.currency}
                onChange={(e) => updateForm({ currency: e.target.value })}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            {/* Pricing Plans */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base">Pricing Plans</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    updateForm({
                      pricingPlans: [
                        ...form.pricingPlans,
                        { name: "", price: "", description: "", features: [], isPopular: false, buttonText: "Buy Now" },
                      ],
                    });
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Plan
                </Button>
              </div>
              {form.pricingPlans.length === 0 && (
                <p className="text-sm text-zinc-500">No pricing plans added yet.</p>
              )}
              <AnimatePresence>
                {form.pricingPlans.map((plan, pi) => (
                  <motion.div
                    key={pi}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 mb-3 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Plan {pi + 1}</span>
                      <button
                        onClick={() =>
                          updateForm({
                            pricingPlans: form.pricingPlans.filter((_, j) => j !== pi),
                          })
                        }
                        className="text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={plan.name}
                        onChange={(e) => {
                          const plans = [...form.pricingPlans];
                          plans[pi] = { ...plans[pi], name: e.target.value };
                          updateForm({ pricingPlans: plans });
                        }}
                        placeholder="Plan name (e.g. Basic, Pro)"
                      />
                      <Input
                        type="number"
                        value={plan.price}
                        onChange={(e) => {
                          const plans = [...form.pricingPlans];
                          plans[pi] = { ...plans[pi], price: e.target.value };
                          updateForm({ pricingPlans: plans });
                        }}
                        placeholder="Price"
                      />
                    </div>
                    <Input
                      value={plan.description}
                      onChange={(e) => {
                        const plans = [...form.pricingPlans];
                        plans[pi] = { ...plans[pi], description: e.target.value };
                        updateForm({ pricingPlans: plans });
                      }}
                      placeholder="Plan description"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        value={plan.buttonText}
                        onChange={(e) => {
                          const plans = [...form.pricingPlans];
                          plans[pi] = { ...plans[pi], buttonText: e.target.value };
                          updateForm({ pricingPlans: plans });
                        }}
                        placeholder="Button text (e.g. Buy Now)"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={plan.isPopular}
                          onChange={(e) => {
                            const plans = [...form.pricingPlans];
                            plans[pi] = { ...plans[pi], isPopular: e.target.checked };
                            updateForm({ pricingPlans: plans });
                          }}
                          className="rounded border-zinc-300"
                        />
                        Popular / Recommended
                      </label>
                    </div>
                    <div>
                      <Label className="text-xs">Plan Features</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          placeholder="Add a feature..."
                          value={planFeatureInputs[pi] || ""}
                          onChange={(e) =>
                            setPlanFeatureInputs((prev) => ({
                              ...prev,
                              [pi]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = (planFeatureInputs[pi] || "").trim();
                              if (val) {
                                const plans = [...form.pricingPlans];
                                plans[pi] = {
                                  ...plans[pi],
                                  features: [...plans[pi].features, val],
                                };
                                updateForm({ pricingPlans: plans });
                                setPlanFeatureInputs((prev) => ({ ...prev, [pi]: "" }));
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const val = (planFeatureInputs[pi] || "").trim();
                            if (val) {
                              const plans = [...form.pricingPlans];
                              plans[pi] = {
                                ...plans[pi],
                                features: [...plans[pi].features, val],
                              };
                              updateForm({ pricingPlans: plans });
                              setPlanFeatureInputs((prev) => ({ ...prev, [pi]: "" }));
                            }
                          }}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      {plan.features.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {plan.features.map((f, fi) => (
                            <Badge key={fi} variant="secondary" className="text-xs gap-1 pl-2">
                              {f}
                              <button
                                onClick={() => {
                                  const plans = [...form.pricingPlans];
                                  plans[pi] = {
                                    ...plans[pi],
                                    features: plans[pi].features.filter((_, k) => k !== fi),
                                  };
                                  updateForm({ pricingPlans: plans });
                                }}
                                className="hover:text-red-500"
                              >
                                <X className="h-2.5 w-2.5" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Downloads */}
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-3">
              <Label className="text-base">Downloads</Label>
              <div className="space-y-2">
                <Label>File URL</Label>
                <Input
                  value={form.fileUrl}
                  onChange={(e) => updateForm({ fileUrl: e.target.value })}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label>File Size</Label>
                <Input
                  value={form.fileSize}
                  onChange={(e) => updateForm({ fileSize: e.target.value })}
                  placeholder="e.g. 15 MB, 2.5 GB"
                />
              </div>
              <div className="space-y-2">
                <Label>Documentation URL</Label>
                <Input
                  value={form.documentation}
                  onChange={(e) => updateForm({ documentation: e.target.value })}
                  placeholder="https://docs.example.com"
                />
              </div>
            </div>
          </div>
        );

      case "features":
        return (
          <div className="space-y-4">
            <ArrayInput
              label="Key Features"
              values={form.features}
              onChange={(vals) => updateForm({ features: vals })}
              placeholder="e.g. Real-time analytics dashboard"
              addLabel="Add Feature"
            />
            <ArrayInput
              label="Technologies / Tech Stack"
              values={form.technologies}
              onChange={(vals) => updateForm({ technologies: vals })}
              placeholder="e.g. React, Node.js, MongoDB"
              addLabel="Add Technology"
            />
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Rating (0-5)</Label>
                <Input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={form.rating}
                  onChange={(e) => updateForm({ rating: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Review Count</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.reviewCount}
                  onChange={(e) => updateForm({ reviewCount: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Download Count</Label>
                <Input
                  type="number"
                  min="0"
                  value={form.downloads}
                  onChange={(e) => updateForm({ downloads: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case "seo":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input
                value={form.seoTitle}
                onChange={(e) => updateForm({ seoTitle: e.target.value })}
                placeholder="Custom meta title (leave empty to use product title)"
              />
              <p className="text-xs text-zinc-500">
                {form.seoTitle?.length || 0}/60 characters recommended
              </p>
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea
                value={form.seoDescription}
                onChange={(e) => updateForm({ seoDescription: e.target.value })}
                placeholder="Custom meta description for search engines"
                rows={3}
              />
              <p className="text-xs text-zinc-500">
                {form.seoDescription?.length || 0}/160 characters recommended
              </p>
            </div>
            <ArrayInput
              label="SEO Keywords"
              values={form.seoKeywords}
              onChange={(vals) => updateForm({ seoKeywords: vals })}
              placeholder="e.g. react dashboard, admin panel"
              addLabel="Add Keyword"
            />
          </div>
        );

      case "faq":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base">Frequently Asked Questions</Label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  updateForm({
                    faqs: [...form.faqs, { question: "", answer: "" }],
                  });
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add FAQ
              </Button>
            </div>
            {form.faqs.length === 0 && (
              <p className="text-sm text-zinc-500 py-4 text-center">
                No FAQs added yet. Click "Add FAQ" to add questions and answers.
              </p>
            )}
            <AnimatePresence>
              {form.faqs.map((faq, fi) => (
                <motion.div
                  key={fi}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">FAQ #{fi + 1}</span>
                    <button
                      onClick={() =>
                        updateForm({
                          faqs: form.faqs.filter((_, j) => j !== fi),
                        })
                      }
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <Input
                    value={faq.question}
                    onChange={(e) => {
                      const items = [...form.faqs];
                      items[fi] = { ...items[fi], question: e.target.value };
                      updateForm({ faqs: items });
                    }}
                    placeholder="Question"
                  />
                  <Textarea
                    value={faq.answer}
                    onChange={(e) => {
                      const items = [...form.faqs];
                      items[fi] = { ...items[fi], answer: e.target.value };
                      updateForm({ faqs: items });
                    }}
                    placeholder="Answer"
                    rows={3}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <select
                  value={form.status}
                  onChange={(e) => updateForm({ status: e.target.value as any })}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Quick Toggles</Label>
                <div className="space-y-3 mt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) => updateForm({ isFeatured: e.target.checked })}
                      className="rounded border-zinc-300"
                    />
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    Featured Product
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isTrending}
                      onChange={(e) => updateForm({ isTrending: e.target.checked })}
                      className="rounded border-zinc-300"
                    />
                    <span className="text-red-500 text-sm">🔥</span>
                    Trending Product
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <Label className="text-base mb-3 block">Stats (override auto values)</Label>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Downloads</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.downloads}
                    onChange={(e) => updateForm({ downloads: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Rating</Label>
                  <Input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={form.rating}
                    onChange={(e) => updateForm({ rating: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reviews</Label>
                  <Input
                    type="number"
                    min="0"
                    value={form.reviewCount}
                    onChange={(e) => updateForm({ reviewCount: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-zinc-500 mt-1">{products.length} products total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="pl-10"
        />
      </div>

      {/* Products Table (Desktop) */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden md:table-cell">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden md:table-cell">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden lg:table-cell">Featured</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500">
                      <PackageIcon className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
                      <p className="font-medium mb-1">No products yet</p>
                      <p className="text-sm mb-4">Create your first product to get started.</p>
                      <Button onClick={openCreate} size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                      </Button>
                    </td>
                  </tr>
                ) : (
                  products.map((product, i) => (
                    <tr
                      key={product._id}
                      className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {product.thumbnail ? (
                              <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <PackageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{product.title}</p>
                            <p className="text-xs text-zinc-500 truncate">{product.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <span className="font-medium">
                          ₹{(product.price / 100).toLocaleString("en-IN")}
                        </span>
                        {product.salePrice && (
                          <span className="text-sm text-zinc-400 line-through ml-2">
                            ₹{(product.salePrice / 100).toLocaleString("en-IN")}
                          </span>
                        )}
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge className={statusColors[product.status] || ""}>
                          {product.status}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleFeatured(product)}
                            className={`p-1 rounded transition-colors ${
                              product.isFeatured
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-zinc-300 hover:text-zinc-500"
                            }`}
                          >
                            <Star className="h-4 w-4" fill={product.isFeatured ? "currentColor" : "none"} />
                          </button>
                          {product.downloads > 0 && (
                            <span className="text-xs text-zinc-500">{product.downloads} dl</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => openEdit(product)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(product._id)}
                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Mobile Products Cards */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center text-zinc-500">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              Loading products...
            </CardContent>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-zinc-500">
              <PackageIcon className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
              <p className="font-medium mb-1">No products yet</p>
              <p className="text-sm mb-4">Create your first product to get started.</p>
              <Button onClick={openCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          products.map((product) => (
            <Card key={product._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 flex items-center justify-center">
                      {product.thumbnail ? (
                        <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <PackageIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{product.title}</p>
                      <p className="text-xs text-zinc-500 truncate">{product.slug}</p>
                    </div>
                  </div>
                  <Badge className={`${statusColors[product.status] || ""} shrink-0`}>
                    {product.status}
                  </Badge>
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{(product.price / 100).toLocaleString("en-IN")}
                    </span>
                    {product.salePrice && (
                      <span className="text-xs text-zinc-400 line-through">
                        ₹{(product.salePrice / 100).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleFeatured(product)}
                    className={`p-1 rounded transition-colors ${
                      product.isFeatured
                        ? "text-amber-500"
                        : "text-zinc-300 dark:text-zinc-600"
                    }`}
                  >
                    <Star className="h-4 w-4" fill={product.isFeatured ? "currentColor" : "none"} />
                  </button>
                </div>

                {product.downloads > 0 && (
                  <p className="text-xs text-zinc-400 mb-3">{product.downloads} downloads</p>
                )}

                <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(product)}
                    className="flex-1"
                  >
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(product._id)}
                    className="flex-1 text-red-500 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-zinc-500">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct
                ? "Update product details, media, pricing, features, SEO, and more."
                : "Fill in all the details to create a comprehensive product listing."}
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 border-b border-zinc-200 dark:border-zinc-800 -mx-6 px-6 shrink-0">
            {FORM_TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? "text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500"
                      : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto py-4 -mx-6 px-6">
            {renderTabContent()}
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800 -mx-6 px-6 shrink-0 gap-3">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={activeTab === FORM_TABS[0].id}
                onClick={() => {
                  const idx = FORM_TABS.findIndex((t) => t.id === activeTab);
                  if (idx > 0) setActiveTab(FORM_TABS[idx - 1].id);
                }}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={activeTab === FORM_TABS[FORM_TABS.length - 1].id}
                onClick={() => {
                  const idx = FORM_TABS.findIndex((t) => t.id === activeTab);
                  if (idx < FORM_TABS.length - 1) setActiveTab(FORM_TABS[idx + 1].id);
                }}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" />{editingProduct ? "Update" : "Create"}</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PackageIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    </svg>
  );
}
