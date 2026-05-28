import { connectDB } from "./db";
import Newsletter from "@/models/Newsletter";

export async function subscribeToNewsletter(email: string) {
  await connectDB();

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    return { success: false, message: "Already subscribed!" };
  }

  await Newsletter.create({ email });
  return { success: true, message: "Subscribed successfully!" };
}

export async function sendNewsletter(
  subject: string,
  html: string
) {
  await connectDB();
  const subscribers = await Newsletter.find({ isActive: true });
  return subscribers;
}
