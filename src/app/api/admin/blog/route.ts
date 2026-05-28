import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import Blog from "@/models/Blog";
import slugify from "slugify";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin();
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const published = searchParams.get("published");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort") || "-createdAt";

    const query: any = {};
    if (published === "true") query.published = true;
    if (published === "false") query.published = false;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Blog.countDocuments(query);
    const posts = await Blog.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      posts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error: any) {
    console.error("Admin blog fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch posts" },
      { status: error.message?.includes("Admin") ? 403 : 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    await connectDB();

    const slug = body.slug || slugify(body.title, { lower: true, strict: true });

    if (body.content) {
      const wordsPerMinute = 200;
      const wordCount = body.content.split(/\s+/).length;
      body.readingTime = Math.ceil(wordCount / wordsPerMinute);
    }

    const post = await Blog.create({ ...body, slug });
    return NextResponse.json({ post }, { status: 201 });
  } catch (error: any) {
    console.error("Admin blog create error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create post" },
      { status: error.code === 11000 ? 409 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { postId, ...updateData } = body;
    await connectDB();

    const post = await Blog.findByIdAndUpdate(postId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ post });
  } catch (error: any) {
    console.error("Admin blog update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const { postId } = body;
    await connectDB();

    const post = await Blog.findByIdAndDelete(postId);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin blog delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete post" },
      { status: 500 }
    );
  }
}
