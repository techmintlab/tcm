import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    await connectDB();

    switch (event.event) {
      case "payment.captured":
        await Order.findOneAndUpdate(
          { razorpayOrderId: event.payload.payment.entity.order_id },
          {
            paymentStatus: "paid",
            paymentId: event.payload.payment.entity.id,
          }
        );
        break;

      case "payment.failed":
        await Order.findOneAndUpdate(
          { razorpayOrderId: event.payload.payment.entity.order_id },
          { paymentStatus: "failed" }
        );
        break;

      case "refund.created":
        await Order.findOneAndUpdate(
          { paymentId: event.payload.refund.entity.payment_id },
          { paymentStatus: "refunded" }
        );
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
