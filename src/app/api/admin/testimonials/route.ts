import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import Testimonial from "@/models/Testimonial";

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

    const total = await Testimonial.countDocuments(query);
    const testimonials = await Testimonial.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      testimonials,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin testimonials fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch testimonials" },
      { status: error.message?.includes("Admin") ? 403 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    await connectDB();

    const testimonial = await Testimonial.create(body);
    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error: any) {
    console.error("Admin testimonial create error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { testimonialId, ...updateData } = body;
    await connectDB();

    const testimonial = await Testimonial.findByIdAndUpdate(testimonialId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error("Admin testimonial update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { testimonialId } = body;
    await connectDB();

    const testimonial = await Testimonial.findByIdAndDelete(testimonialId);
    if (!testimonial) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin testimonial delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
