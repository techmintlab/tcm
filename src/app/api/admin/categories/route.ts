import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import Category from "@/models/Category";
import slugify from "slugify";

export async function GET() {
  try {
    await requireAdmin();
    await connectDB();

    const categories = await Category.find()
      .sort({ order: 1 })
      .lean();

    return NextResponse.json({ categories });
  } catch (error: any) {
    console.error("Admin categories fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch categories" },
      { status: error.message?.includes("Admin") ? 403 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    await connectDB();

    const slug = body.slug || slugify(body.name, { lower: true, strict: true });

    const category = await Category.create({ ...body, slug });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error("Admin category create error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create category" },
      { status: error.code === 11000 ? 409 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { categoryId, ...updateData } = body;
    await connectDB();

    const category = await Category.findByIdAndUpdate(categoryId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error: any) {
    console.error("Admin category update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { categoryId } = body;
    await connectDB();

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin category delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete category" },
      { status: 500 }
    );
  }
}
