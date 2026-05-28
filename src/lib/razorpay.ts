import Razorpay from "razorpay";

function getRazorpay(): Razorpay | null {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    console.warn("Razorpay not configured: missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET");
    return null;
  }
  return new Razorpay({ key_id, key_secret });
}

export async function createRazorpayOrder(amount: number, receipt: string) {
  const razorpay = getRazorpay();
  if (!razorpay) {
    throw new Error("Razorpay is not configured");
  }
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      receipt,
      payment_capture: true,
    });
    return order;
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    throw error;
  }
}

export async function verifyRazorpayPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  const crypto = require("crypto");
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  return expectedSignature === signature;
}

export async function getRazorpayPayment(paymentId: string) {
  const razorpay = getRazorpay();
  if (!razorpay) {
    throw new Error("Razorpay is not configured");
  }
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return payment;
  } catch (error) {
    console.error("Razorpay payment fetch error:", error);
    throw error;
  }
}
