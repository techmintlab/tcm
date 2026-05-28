"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  X,
  Save,
  Eye,
  EyeOff,
  Star,
  Loader2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Calendar,
  Clock,
  Tag,
  Image,
  Settings,
  Tags,
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

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  category: string;
  tags: string[];
  readingTime: number;
  published: boolean;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
  schemaType?: "Article" | "TechArticle" | "BlogPosting" | "NewsArticle";
  createdAt: string;
}

type FormTab = "content" | "media" | "seo" | "settings";

const FORM_TABS: { id: FormTab; label: string; icon: any }[] = [
  { id: "content", label: "Content", icon: FileText },
  { id: "media", label: "Media", icon: Image },
  { id: "seo", label: "SEO", icon: Tags },
  { id: "settings", label: "Settings", icon: Settings },
];

function ArrayInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (vals: string[]) => void;
  placeholder?: string;
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

export default function AdminBlogPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<FormTab>("content");
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    author: "",
    category: "",
    tags: [] as string[],
    published: false,
    featured: false,
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [] as string[],
    ogImage: "",
    canonicalUrl: "",
    schemaType: "Article" as "Article" | "TechArticle" | "BlogPosting" | "NewsArticle",
  });

  const updateForm = (partial: Partial<typeof form>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "15" });
      if (search) params.set("search", search);
      if (filter) params.set("published", filter);
      const res = await fetch(`/api/admin/blog?${params}`);
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    if (showModal) setActiveTab("content");
  }, [showModal]);

  const openCreate = () => {
    setEditingPost(null);
    setForm({
      title: "",
      excerpt: "",
      content: "",
      coverImage: "",
      author: session?.user?.name || "",
      category: "",
      tags: [],
      published: false,
      featured: false,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: [],
      ogImage: "",
      canonicalUrl: "",
      schemaType: "Article",
    });
    setShowModal(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingPost(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt || "",
      content: post.content,
      coverImage: post.coverImage || "",
      author: post.author,
      category: post.category,
      tags: post.tags || [],
      published: post.published,
      featured: post.featured,
      seoTitle: post.seoTitle || "",
      seoDescription: post.seoDescription || "",
      seoKeywords: post.seoKeywords || [],
      ogImage: post.ogImage || "",
      canonicalUrl: post.canonicalUrl || "",
      schemaType: post.schemaType || "Article",
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const body: any = {
        title: form.title,
        excerpt: form.excerpt || form.content.slice(0, 200),
        content: form.content,
        coverImage: form.coverImage || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
        author: form.author || "Admin",
        category: form.category || "General",
        tags: form.tags,
        published: form.published,
        featured: form.featured,
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
        seoKeywords: form.seoKeywords.length > 0 ? form.seoKeywords : undefined,
        ogImage: form.ogImage || undefined,
        canonicalUrl: form.canonicalUrl || undefined,
        schemaType: form.schemaType || undefined,
      };

      let res;
      if (editingPost) {
        res = await fetch("/api/admin/blog", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: editingPost._id, ...body }),
        });
      } else {
        res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
      }

      if (res.ok) {
        toast.success(editingPost ? "Post updated!" : "Post created!");
        setShowModal(false);
        fetchPosts();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save post");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const togglePublished = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, published: !post.published }),
      });
      if (res.ok) {
        toast.success(post.published ? "Unpublished" : "Published");
        fetchPosts();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const toggleFeatured = async (post: BlogPost) => {
    try {
      const res = await fetch("/api/admin/blog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, featured: !post.featured }),
      });
      if (res.ok) {
        toast.success(post.featured ? "Unfeatured" : "Featured");
        fetchPosts();
      }
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Delete this post? This action cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/blog", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      if (res.ok) {
        toast.success("Post deleted");
        fetchPosts();
      } else {
        toast.error("Failed to delete post");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "content":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => updateForm({ title: e.target.value })}
                placeholder="Post title"
              />
              {form.title && (
                <p className="text-xs text-zinc-500">
                  Slug: {form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={form.author}
                  onChange={(e) => updateForm({ author: e.target.value })}
                  placeholder="Author name"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input
                  value={form.category}
                  onChange={(e) => updateForm({ category: e.target.value })}
                  placeholder="e.g., Technology, Design"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => updateForm({ excerpt: e.target.value })}
                placeholder="Brief description for card previews (auto-generated from content if empty)"
                rows={2}
              />
              <p className="text-xs text-zinc-500">
                {form.excerpt?.length || 0}/200 characters
              </p>
            </div>
            <div className="space-y-2">
              <Label>Content (Markdown/HTML) *</Label>
              <Textarea
                value={form.content}
                onChange={(e) => updateForm({ content: e.target.value })}
                placeholder="Write your post content here... Supports markdown and HTML."
                rows={14}
                className="font-mono text-sm"
              />
              {form.content && (
                <p className="text-xs text-zinc-500">
                  ~{Math.ceil(form.content.split(/\s+/).length / 200)} min read ·{" "}
                  {form.content.split(/\s+/).length} words
                </p>
              )}
            </div>
          </div>
        );

      case "media":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Cover Image URL</Label>
              <Input
                value={form.coverImage}
                onChange={(e) => updateForm({ coverImage: e.target.value })}
                placeholder="https://images.unsplash.com/..."
              />
              {form.coverImage && (
                <div className="mt-2 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 w-full aspect-video max-w-md">
                  <img
                    src={form.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
            <ArrayInput
              label="Tags"
              values={form.tags}
              onChange={(vals) => updateForm({ tags: vals })}
              placeholder="e.g. Next.js, React, SaaS"
            />
          </div>
        );

      case "seo":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 mb-4">
              <h4 className="font-semibold text-sm text-emerald-700 dark:text-emerald-400 mb-1">
                SEO Preview
              </h4>
              <div className="mt-2 p-3 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="text-xs text-blue-600 truncate">
                  {process.env.NEXT_PUBLIC_SITE_URL || "https://techmintlab.com"}/blog/{form.title ? form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "post-slug"}
                </p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {form.seoTitle || form.title || "Post Title"}
                </p>
                <p className="text-xs text-zinc-500 line-clamp-2">
                  {form.seoDescription || form.excerpt || "Meta description will appear here..."}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input
                value={form.seoTitle}
                onChange={(e) => updateForm({ seoTitle: e.target.value })}
                placeholder="Custom meta title (leave empty to use post title)"
              />
              <p className={`text-xs ${(form.seoTitle?.length || 0) > 60 ? "text-amber-500" : "text-zinc-500"}`}>
                {form.seoTitle?.length || 0}/60 characters recommended
              </p>
            </div>
            <div className="space-y-2">
              <Label>SEO Description</Label>
              <Textarea
                value={form.seoDescription}
                onChange={(e) => updateForm({ seoDescription: e.target.value })}
                placeholder="Meta description for search engines (leave empty to use excerpt)"
                rows={3}
              />
              <p className={`text-xs ${(form.seoDescription?.length || 0) > 160 ? "text-amber-500" : "text-zinc-500"}`}>
                {form.seoDescription?.length || 0}/160 characters recommended
              </p>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <ArrayInput
                label="SEO Keywords"
                values={form.seoKeywords}
                onChange={(vals) => updateForm({ seoKeywords: vals })}
                placeholder="e.g. next.js tutorial, react guide"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Add relevant keywords separated by pressing Enter
              </p>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <div className="space-y-2">
                <Label>Schema Type</Label>
                <select
                  value={form.schemaType}
                  onChange={(e) => updateForm({ schemaType: e.target.value as any })}
                  className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                >
                  <option value="Article">Article</option>
                  <option value="TechArticle">Tech Article</option>
                  <option value="BlogPosting">Blog Posting</option>
                  <option value="NewsArticle">News Article</option>
                </select>
                <p className="text-xs text-zinc-500">
                  Schema.org type for structured data
                </p>
              </div>
            </div>
            <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4 space-y-4">
              <div className="space-y-2">
                <Label>Custom OG Image URL</Label>
                <Input
                  value={form.ogImage}
                  onChange={(e) => updateForm({ ogImage: e.target.value })}
                  placeholder="Leave empty to use cover image"
                />
                <p className="text-xs text-zinc-500">
                  Image shown when shared on social media (1200×630px recommended)
                </p>
                {form.ogImage && (
                  <div className="mt-2 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 w-full max-w-sm aspect-video">
                    <img
                      src={form.ogImage}
                      alt="OG preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Canonical URL</Label>
                <Input
                  value={form.canonicalUrl}
                  onChange={(e) => updateForm({ canonicalUrl: e.target.value })}
                  placeholder="Leave empty to auto-generate from slug"
                />
                <p className="text-xs text-zinc-500">
                  Custom canonical URL if this post is syndicated from another source
                </p>
              </div>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <div className="space-y-3 mt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => updateForm({ published: e.target.checked })}
                      className="rounded border-zinc-300"
                    />
                    <Eye className="h-3.5 w-3.5 text-emerald-500" />
                    Published
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => updateForm({ featured: e.target.checked })}
                      className="rounded border-zinc-300"
                    />
                    <Star className="h-3.5 w-3.5 text-amber-500" />
                    Featured Post
                  </label>
                </div>
              </div>
            </div>
            {form.content && (
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <Label className="text-base mb-3 block">Post Stats</Label>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                    <p className="text-zinc-500 text-xs mb-1">Words</p>
                    <p className="font-semibold">{form.content.split(/\s+/).length}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                    <p className="text-zinc-500 text-xs mb-1">Reading Time</p>
                    <p className="font-semibold">
                      ~{Math.ceil(form.content.split(/\s+/).length / 200)} min
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                    <p className="text-zinc-500 text-xs mb-1">Characters</p>
                    <p className="font-semibold">{form.content.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-zinc-500 mt-1">{posts.length} posts total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", "true", "false"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter(f); setPage(1); }}
              className="text-xs sm:text-sm"
            >
              {f === "" ? "All" : f === "true" ? "Published" : "Drafts"}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-zinc-400" />
              <p className="text-zinc-500">Loading posts...</p>
            </CardContent>
          </Card>
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
              <p className="font-medium mb-1">No blog posts yet</p>
              <p className="text-sm text-zinc-500 mb-4">Create your first blog post to get started.</p>
              <Button onClick={openCreate} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post._id} className="group hover:border-emerald-500/30 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={post.published ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"}>
                        {post.published ? "Published" : "Draft"}
                      </Badge>
                      {post.featured && (
                        <Badge className="bg-blue-500/10 text-blue-600">
                          <Star className="h-3 w-3 mr-1" fill="currentColor" />
                          Featured
                        </Badge>
                      )}
                      <span className="text-xs text-zinc-400">{post.category}</span>
                    </div>
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-zinc-500 line-clamp-2 mb-2">{post.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readingTime || "?"} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3" />
                        {post.tags?.length || 0} tags
                      </span>
                      <span>By {post.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => togglePublished(post)}
                      className="h-8 w-8"
                      title={post.published ? "Unpublish" : "Publish"}
                    >
                      {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => toggleFeatured(post)}
                      className={`h-8 w-8 ${post.featured ? "text-amber-500" : ""}`}
                      title={post.featured ? "Unfeature" : "Feature"}
                    >
                      <Star className="h-4 w-4" fill={post.featured ? "currentColor" : "none"} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(post)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(post._id)}
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
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

      {/* Create/Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Post" : "Create New Post"}</DialogTitle>
            <DialogDescription>
              {editingPost ? "Update your blog post content, media, SEO, and settings." : "Write a new blog post for your audience."}
            </DialogDescription>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800 -mx-6 px-6 shrink-0">
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
                  <><Save className="h-4 w-4 mr-2" />{editingPost ? "Update" : "Create"}</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
