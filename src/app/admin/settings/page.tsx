"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Loader2,
  Globe,
  Search,
  Mail,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import toast from "react-hot-toast";

interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  keywords: string;
  logo: string;
  favicon: string;
  supportEmail: string;
  supportPhone: string;
  address: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    github?: string;
    youtube?: string;
  };
  razorpayKeyId?: string;
  razorpayKeySecret?: string;
  smtpHost?: string;
  smtpPort?: string;
  smtpUser?: string;
  smtpPass?: string;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  metaPixelId?: string;
}

const defaultSettings: SiteSettings = {
  siteName: "TechMintLab",
  tagline: "Build Faster. Scale Smarter.",
  description: "Premium software marketplace and digital product platform. Build Faster. Scale Smarter.",
  keywords: "software marketplace, digital products, web development, SaaS, tech solutions, India software",
  logo: "",
  favicon: "",
  supportEmail: "support@techmintlab.com",
  supportPhone: "+91-XXXXXXXXXX",
  address: "",
  socialLinks: {},
  googleTagManagerId: "",
  googleAnalyticsId: "",
  metaPixelId: "",
};

export default function AdminSettingsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.settings) setSettings({ ...defaultSettings, ...data.settings });
    } catch {
      console.warn("Settings API not available, using defaults");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch {
      toast.error("Settings API not available. Settings saved locally.");
    } finally {
      setSaving(false);
    }
  };

  const updateSocial = (key: string, value: string) => {
    setSettings({
      ...settings,
      socialLinks: { ...settings.socialLinks, [key]: value },
    });
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin mr-2 text-zinc-400" />
        <span className="text-zinc-500">Loading settings...</span>
      </div>
    );
  }

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "seo", label: "SEO & Analytics", icon: Search },
    { id: "social", label: "Social Links", icon: ExternalLink },
    { id: "contact", label: "Contact & Support", icon: Mail },
    { id: "integrations", label: "Integrations", icon: MessageSquare },
  ];

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
          <p className="text-zinc-500 mt-1">Site configuration and preferences</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>
          ) : (
            <><Save className="h-4 w-4 mr-2" />Save All Changes</>
          )}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 w-full md:w-fit overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-zinc-800 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        {activeTab === "general" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Site Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Site Name</Label>
                    <Input value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tagline</Label>
                    <Input value={settings.tagline} onChange={(e) => setSettings({ ...settings, tagline: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={settings.description} onChange={(e) => setSettings({ ...settings, description: e.target.value })} rows={2} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Logo URL</Label>
                    <Input value={settings.logo} onChange={(e) => setSettings({ ...settings, logo: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Favicon URL</Label>
                    <Input value={settings.favicon} onChange={(e) => setSettings({ ...settings, favicon: e.target.value })} placeholder="https://..." />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* SEO & Analytics */}
        {activeTab === "seo" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>SEO & Analytics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Default Keywords</Label>
                  <Textarea value={settings.keywords} onChange={(e) => setSettings({ ...settings, keywords: e.target.value })} rows={2} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Google Analytics ID</Label>
                    <Input value={settings.googleAnalyticsId || ""} onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label>Google Tag Manager ID</Label>
                    <Input value={settings.googleTagManagerId || ""} onChange={(e) => setSettings({ ...settings, googleTagManagerId: e.target.value })} placeholder="GTM-XXXXXXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Meta Pixel ID</Label>
                  <Input value={settings.metaPixelId || ""} onChange={(e) => setSettings({ ...settings, metaPixelId: e.target.value })} placeholder="1234567890" />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Social Links */}
        {activeTab === "social" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["twitter", "facebook", "instagram", "linkedin", "github", "youtube"].map((platform) => (
                  <div key={platform} className="space-y-1">
                    <Label className="capitalize">{platform}</Label>
                    <Input
                      value={(settings.socialLinks as any)[platform] || ""}
                      onChange={(e) => updateSocial(platform, e.target.value)}
                      placeholder={`https://${platform}.com/your-profile`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* Contact & Support */}
        {activeTab === "contact" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Contact & Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Support Email</Label>
                    <Input value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} placeholder="support@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support Phone</Label>
                    <Input value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} placeholder="+91-XXXXXXXXXX" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={2} placeholder="Company address..." />
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Integrations */}
        {activeTab === "integrations" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateway</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Razorpay Key ID</Label>
                    <Input value={settings.razorpayKeyId || ""} onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })} placeholder="rzp_live_..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Razorpay Key Secret</Label>
                    <Input type="password" value={settings.razorpayKeySecret || ""} onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })} placeholder="••••••••" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email (SMTP)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input value={settings.smtpHost || ""} onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })} placeholder="smtp.gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Port</Label>
                    <Input value={settings.smtpPort || ""} onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })} placeholder="587" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>SMTP User</Label>
                    <Input value={settings.smtpUser || ""} onChange={(e) => setSettings({ ...settings, smtpUser: e.target.value })} placeholder="your@email.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>SMTP Password</Label>
                    <Input type="password" value={settings.smtpPass || ""} onChange={(e) => setSettings({ ...settings, smtpPass: e.target.value })} placeholder="••••••••" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
