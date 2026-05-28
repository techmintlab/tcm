import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth-helpers";
import Review from "@/models/Review";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    await connectDB();

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const total = await Review.countDocuments({
      product: product._id,
      isApproved: true,
    });

    const reviews = await Review.find({ product: product._id, isApproved: true })
      .populate("user", "name image")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Reviews fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to submit a review" },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const { rating, title, content } = await req.json();

    if (!rating || !title || !content) {
      return NextResponse.json(
        { error: "Rating, title, and content are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    if (title.length > 120) {
      return NextResponse.json(
        { error: "Title must be under 120 characters" },
        { status: 400 }
      );
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: "Review content must be under 2000 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.findOne({ slug });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: product._id,
      user: user._id,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product. You can edit your existing review instead." },
        { status: 409 }
      );
    }

    // Check if user has purchased this product (for verified badge)
    const hasPurchased = await Order.findOne({
      user: user._id,
      "products.product": product._id,
      paymentStatus: "paid",
    });

    const review = await Review.create({
      product: product._id,
      user: user._id,
      rating,
      title,
      content,
      isVerified: !!hasPurchased,
      isApproved: true, // Auto-approve for now
    });

    // Update product average rating and review count
    const allReviews = await Review.find({
      product: product._id,
      isApproved: true,
    });

    const avgRating =
      allReviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
      allReviews.length;

    await Product.findByIdAndUpdate(product._id, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: allReviews.length,
    });

    const populatedReview = await Review.findById(review._id)
      .populate("user", "name image")
      .lean();

    return NextResponse.json(
      { review: populatedReview, message: "Review submitted successfully!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }
}
