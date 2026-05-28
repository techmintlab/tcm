import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import Coupon from "@/models/Coupon";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const isActive = searchParams.get("isActive");

    const query: any = {};
    if (isActive === "true") query.isActive = true;
    if (isActive === "false") query.isActive = false;

    const total = await Coupon.countDocuments(query);
    const coupons = await Coupon.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      coupons,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin coupons fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch coupons" },
      { status: error.message?.includes("Admin") ? 403 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    await connectDB();

    const coupon = await Coupon.create(body);
    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error: any) {
    console.error("Admin coupon create error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create coupon" },
      { status: error.code === 11000 ? 409 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { couponId, ...updateData } = body;
    await connectDB();

    const coupon = await Coupon.findByIdAndUpdate(couponId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error: any) {
    console.error("Admin coupon update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update coupon" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { couponId } = body;
    await connectDB();

    const coupon = await Coupon.findByIdAndDelete(couponId);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin coupon delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
