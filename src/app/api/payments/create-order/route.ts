import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay";
import { auth } from "@/lib/auth";
import { generateOrderId } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { amount, products } = await req.json();

    if (!amount || !products?.length) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const orderId = generateOrderId();
    const razorpayOrder = await createRazorpayOrder(amount, orderId);

    return NextResponse.json({
      orderId: orderId,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });
  } catch (error) {
    console.error("Payment order creation error:", error);
    return NextResponse.json(
      { error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
