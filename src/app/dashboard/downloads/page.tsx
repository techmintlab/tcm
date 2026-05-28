"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";
import { Download, FileText, Archive, Clock, ChevronRight, HardDrive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const mockDownloads = [
  {
    id: "1",
    name: "SaaS Boilerplate Pro v2.1",
    type: "ZIP",
    size: "45.2 MB",
    downloadedAt: "2025-03-20",
    version: "2.1",
    expiresIn: "30 days",
  },
  {
    id: "2",
    name: "AI Chat Widget v1.4",
    type: "ZIP",
    size: "12.8 MB",
    downloadedAt: "2025-02-25",
    version: "1.4",
    expiresIn: "15 days",
  },
  {
    id: "3",
    name: "CRM Dashboard Kit v3.0",
    type: "ZIP",
    size: "28.3 MB",
    downloadedAt: "2025-01-15",
    version: "3.0",
    expiresIn: "45 days",
  },
  {
    id: "4",
    name: "E-commerce Template v1.0",
    type: "ZIP",
    size: "56.1 MB",
    downloadedAt: "2024-12-10",
    version: "1.0",
    expiresIn: "Expired",
  },
  {
    id: "5",
    name: "Admin Dashboard Pro v2.3",
    type: "ZIP",
    size: "34.7 MB",
    downloadedAt: "2024-11-05",
    version: "2.3",
    expiresIn: "Expired",
  },
];

const fileTypeIcons: Record<string, typeof FileText> = {
  ZIP: Archive,
  PDF: FileText,
  DOC: FileText,
};

export default function DownloadsPage() {
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
            <h1 className="text-2xl font-bold">Downloads</h1>
            <p className="text-sm text-zinc-500 mt-1">
              Access and download your purchased files
            </p>
          </div>
          <Link href="/dashboard/purchases">
            <Button variant="outline">
              View Purchases
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockDownloads.length}</p>
                <p className="text-sm text-zinc-500">Total Files</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">177.1 MB</p>
                <p className="text-sm text-zinc-500">Total Size</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {mockDownloads.filter((d) => !d.expiresIn.includes("Expired")).length}
                </p>
                <p className="text-sm text-zinc-500">Active Downloads</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Downloads List */}
        <div className="space-y-3">
          {mockDownloads.map((download, i) => {
            const Icon = fileTypeIcons[download.type] || FileText;
            const isExpired = download.expiresIn === "Expired";

            return (
              <motion.div
                key={download.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card className={`group hover:border-emerald-500/50 transition-all ${isExpired ? "opacity-60" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-4 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-emerald-500/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <h3 className="font-medium truncate">{download.name}</h3>
                            <span className="text-xs text-zinc-400 flex-shrink-0">
                              v{download.version}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <span>{download.type}</span>
                            <span>&middot;</span>
                            <span>{download.size}</span>
                            <span>&middot;</span>
                            <span>Downloaded {new Date(download.downloadedAt).toLocaleDateString("en-IN")}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <Badge
                          variant={isExpired ? "outline" : "default"}
                          className={
                            isExpired
                              ? "text-zinc-400 border-zinc-200 dark:border-zinc-700"
                              : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          }
                        >
                          {download.expiresIn}
                        </Badge>
                        {!isExpired && (
                          <Button size="sm">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
