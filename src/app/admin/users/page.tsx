"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Users,
  Shield,
  ShieldOff,
  Trash2,
  Mail,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import toast from "react-hot-toast";

interface AppUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  purchases: string[];
  createdAt: string;
}

export default function AdminUsersPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
        setTotalPages(data.pagination.totalPages);
      }
    } catch {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) {
        toast.success(`User role changed to ${newRole}`);
        fetchUsers();
      } else {
        toast.error("Failed to update user");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm("Delete this user? This action cannot be undone.")) return;
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      if (res.ok) {
        toast.success("User deleted");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (sessionStatus === "unauthenticated" || (session?.user as any)?.role !== "admin") {
    redirect("/auth/login");
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-zinc-500 mt-1">{users.length} users</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["", "user", "admin"].map((r) => (
            <Button
              key={r}
              variant={roleFilter === r ? "default" : "outline"}
              size="sm"
              onClick={() => { setRoleFilter(r); setPage(1); }}
              className="text-xs sm:text-sm"
            >
              {r || "All"}
            </Button>
          ))}
        </div>
      </div>

      {/* Users Table (Desktop) */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-800">
                  <th className="text-left p-4 text-sm font-medium text-zinc-500">User</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden md:table-cell">Role</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden lg:table-cell">Purchases</th>
                  <th className="text-left p-4 text-sm font-medium text-zinc-500 hidden lg:table-cell">Joined</th>
                  <th className="text-right p-4 text-sm font-medium text-zinc-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-zinc-500">
                      <Users className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
                      <p>No users found</p>
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={user.image || ""} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                              {user.name?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-zinc-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <Badge className={user.role === "admin" ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-500/10 text-zinc-600"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-sm">{user.purchases?.length || 0}</span>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className="text-sm text-zinc-500">
                          {new Date(user.createdAt).toLocaleDateString("en-IN")}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleRole(user._id, user.role)}
                          >
                            {user.role === "admin" ? (
                              <><ShieldOff className="h-3 w-3 mr-1" />Demote</>
                            ) : (
                              <><Shield className="h-3 w-3 mr-1" />Make Admin</>
                            )}
                          </Button>
                          {user.email !== session?.user?.email && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleDelete(user._id)}
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
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

      {/* Mobile Users Cards */}
      <div className="block md:hidden space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
            </CardContent>
          </Card>
        ) : users.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-zinc-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-zinc-300" />
              <p>No users found</p>
            </CardContent>
          </Card>
        ) : (
          users.map((u) => (
            <Card key={u._id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={u.image || ""} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                      {u.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm truncate">{u.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{u.email}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge className={u.role === "admin" ? "bg-emerald-500/10 text-emerald-600" : "bg-zinc-500/10 text-zinc-600"}>
                        {u.role}
                      </Badge>
                      <span className="text-xs text-zinc-400">
                        {u.purchases?.length || 0} purchases
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <span className="text-xs text-zinc-400">
                    Joined {new Date(u.createdAt).toLocaleDateString("en-IN")}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRole(u._id, u.role)}
                      className="h-8 text-xs"
                    >
                      {u.role === "admin" ? (
                        <><ShieldOff className="h-3 w-3 mr-1" />Demote</>
                      ) : (
                        <><Shield className="h-3 w-3 mr-1" />Make Admin</>
                      )}
                    </Button>
                    {u.email !== session?.user?.email && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(u._id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

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
    </div>
  );
}
