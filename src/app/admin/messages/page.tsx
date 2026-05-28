"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MessageSquare,
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (filter) params.set("isRead", filter);
      const res = await fetch(`/api/admin/messages?${params}`);
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const toggleRead = async (messageId: string, currentRead: boolean) => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, isRead: !currentRead }),
      });
      if (res.ok) {
        fetchMessages();
      }
    } catch {
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (messageId: string) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch("/api/admin/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });
      if (res.ok) {
        toast.success("Message deleted");
        if (selectedMessage?._id === messageId) setShowMessageModal(false);
        fetchMessages();
      } else {
        toast.error("Failed to delete message");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const openMessage = (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setShowMessageModal(true);
    if (!msg.isRead) {
      toggleRead(msg._id, false);
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-zinc-500 mt-1">
            {messages.length} messages
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">{unreadCount} unread</Badge>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by name, email, subject..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", "false", "true"].map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => { setFilter(f); setPage(1); }}
              className="text-xs sm:text-sm"
            >
              {f === "" ? "All" : f === "false" ? "Unread" : "Read"}
            </Button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-zinc-400" />
                <p className="text-zinc-500">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center text-zinc-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
                <p className="font-medium mb-1">No messages yet</p>
                <p className="text-sm">Contact form submissions will appear here.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <button
                  key={msg._id}
                  onClick={() => openMessage(msg)}
                  className={`w-full text-left p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors ${
                    !msg.isRead ? "bg-emerald-50/50 dark:bg-emerald-950/10" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarFallback className={!msg.isRead ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600"}>
                        {msg.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{msg.name}</span>
                          {!msg.isRead && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-zinc-400 flex-shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-0.5">{msg.subject}</p>
                      <p className="text-sm text-zinc-500 line-clamp-1">{msg.message}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-xs text-zinc-400 flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {msg.email}
                        </span>
                        {msg.phone && (
                          <span className="text-xs text-zinc-400 flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {msg.phone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </CardContent>
      </Card>

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

      {/* Message Detail Modal */}
      <Dialog open={showMessageModal} onOpenChange={setShowMessageModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Message from {selectedMessage?.name}</span>
              <Badge className={selectedMessage?.isRead ? "bg-zinc-500/10 text-zinc-600" : "bg-emerald-500/10 text-emerald-600"}>
                {selectedMessage?.isRead ? "Read" : "New"}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Name</p>
                  <p className="text-sm font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="text-sm text-emerald-600 hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Phone</p>
                    <p className="text-sm">{selectedMessage.phone}</p>
                  </div>
                )}
                {selectedMessage.company && (
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">Company</p>
                    <p className="text-sm">{selectedMessage.company}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-zinc-500 mb-1">Date</p>
                  <p className="text-sm">
                    {new Date(selectedMessage.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Subject & Message */}
              <div>
                <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wider font-medium">Subject</p>
                <p className="font-medium">{selectedMessage.subject}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1.5 uppercase tracking-wider font-medium">Message</p>
                <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900 text-sm whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleRead(selectedMessage._id, selectedMessage.isRead)}
                  >
                    {selectedMessage.isRead ? (
                      <><Mail className="h-4 w-4 mr-1" /> Mark Unread</>
                    ) : (
                      <><MailOpen className="h-4 w-4 mr-1" /> Mark Read</>
                    )}
                  </Button>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <Reply className="h-4 w-4 mr-1" />
                      Reply via Email
                    </Button>
                  </a>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
