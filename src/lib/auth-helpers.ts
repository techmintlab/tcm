import { connectDB } from "./db";
import User from "@/models/User";
import { auth } from "./auth";

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  await connectDB();
  const user = await User.findOne({ email: session.user.email });
  return user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === "admin";
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
}
