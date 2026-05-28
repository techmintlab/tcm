import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Contact from "@/models/Contact";
import { sendEmail, getContactConfirmationEmailHtml } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, phone, company, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    await Contact.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
    });

    // Send auto-confirmation email to the submitter
    const emailResult = await sendEmail({
      to: email,
      subject: "✅ We've Received Your Message - TechMintLab",
      html: getContactConfirmationEmailHtml({ name, subject, message }),
    });

    if (!emailResult.success) {
      console.error("Failed to send confirmation email to:", email);
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully! We'll get back to you soon." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
