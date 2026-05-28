import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import Order from "@/models/Order";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("paymentStatus");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "-createdAt";

    const query: any = {};
    if (status) query.paymentStatus = status;
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "customerDetails.email": { $regex: search, $options: "i" } },
        { "customerDetails.name": { $regex: search, $options: "i" } },
      ];
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("products.product", "title slug")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      orders,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: error.message?.includes("Admin") ? 403 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { orderId, paymentStatus, orderStatus } = body;
    await connectDB();

    const update: any = {};
    if (paymentStatus) update.paymentStatus = paymentStatus;
    if (orderStatus) update.orderStatus = orderStatus;

    const order = await Order.findByIdAndUpdate(orderId, update, {
      new: true,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Admin order update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
