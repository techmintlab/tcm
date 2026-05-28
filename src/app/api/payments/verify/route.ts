import { NextResponse } from "next/server";
import { verifyRazorpayPayment } from "@/lib/razorpay";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { auth } from "@/lib/auth";
import { sendEmail, getInvoiceEmailHtml } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      orderId,
      products,
      amount,
    } = await req.json();

    // Verify payment signature
    const isValid = await verifyRazorpayPayment(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await connectDB();

    // Create order
    const order = await Order.create({
      orderId,
      user: (session.user as any).id,
      products: products.map((p: any) => ({
        product: p.productId,
        price: p.price,
        plan: p.plan,
      })),
      totalAmount: amount,
      paymentMethod: "Razorpay",
      paymentId: razorpayPaymentId,
      paymentStatus: "paid",
      orderStatus: "completed",
      razorpayOrderId,
    });

    // Update user's purchases
    await User.findByIdAndUpdate((session.user as any).id, {
      $push: {
        purchases: order._id,
        downloads: { $each: products.map((p: any) => p.productId) },
      },
    });

    // Update product download counts
    for (const p of products) {
      await Product.findByIdAndUpdate(p.productId, {
        $inc: { downloads: 1 },
      });
    }

    // Send invoice email
    if (session.user.email) {
      const productDetails = await Product.find({
        _id: { $in: products.map((p: any) => p.productId) },
      }).lean();

      const emailHtml = getInvoiceEmailHtml({
        orderId,
        totalAmount: amount,
        customerName: session.user.name || "Customer",
        products: productDetails.map((p) => ({
          title: p.title,
          price: products.find(
            (pp: any) => pp.productId === p._id.toString()
          )?.price || 0,
        })),
      });

      await sendEmail({
        to: session.user.email,
        subject: `Order Confirmed - ${orderId}`,
        html: emailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      message: "Payment verified and order created successfully",
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { error: "Payment verification failed" },
      { status: 500 }
    );
  }
}
