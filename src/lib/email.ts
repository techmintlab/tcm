import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: SendEmailParams) {
  try {
    await transporter.sendMail({
      from: from || `"TechMintLab" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export function getContactConfirmationEmailHtml(data: {
  name: string;
  subject: string;
  message: string;
}) {
  const messagePreview = data.message.length > 200 ? data.message.slice(0, 200) + "..." : data.message;
  return `
    <div style="font-family: 'Inter', 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #f9fafb;">
      <!-- Header with Logo -->
      <div style="text-align: center; margin-bottom: 32px;">
        <div style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; padding: 16px 32px; margin-bottom: 8px;">
          <h1 style="color: white; font-size: 24px; margin: 0;">TechMintLab</h1>
        </div>
        <p style="color: #6b7280; font-size: 14px; margin: 8px 0 0;">Build Faster. Scale Smarter.</p>
      </div>

      <!-- Main Content -->
      <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.08);">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 64px; height: 64px; background: #d1fae5; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="font-size: 32px;">✅</span>
          </div>
          <h2 style="color: #111827; font-size: 22px; margin: 0 0 8px;">We've Received Your Message! 🙏</h2>
          <p style="color: #6b7280; font-size: 15px; margin: 0; line-height: 1.6;">
            Namaste ${data.name}! <br/>
            Thank you for reaching out to TechMintLab. <br/>
            We have received your message and will get back to you within 24 hours.
          </p>
        </div>

        <!-- Message Summary -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #059669; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px;">📋 आपका संदेश (Your Message)</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 13px; width: 80px; vertical-align: top;">Subject:</td>
              <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 600;">${data.subject}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-size: 13px; vertical-align: top;">Message:</td>
              <td style="padding: 8px 0; color: #374151; font-size: 14px; line-height: 1.6;">${messagePreview}</td>
            </tr>
          </table>
        </div>

        <!-- What happens next -->
        <div style="margin-bottom: 24px;">
          <h3 style="color: #111827; font-size: 16px; margin: 0 0 16px;">⏳ आगे क्या होगा? (What Happens Next?)</h3>
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <div style="width: 28px; height: 28px; background: #dbeafe; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: #2563eb; font-size: 14px; font-weight: 700;">1</span>
            </div>
            <div>
              <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0 0 2px;">Review</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">Our team will review your message</p>
            </div>
          </div>
          <div style="display: flex; gap: 12px; margin-bottom: 16px;">
            <div style="width: 28px; height: 28px; background: #fef3c7; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: #d97706; font-size: 14px; font-weight: 700;">2</span>
            </div>
            <div>
              <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0 0 2px;">Contact</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">We'll reach out to you at your email address</p>
            </div>
          </div>
          <div style="display: flex; gap: 12px;">
            <div style="width: 28px; height: 28px; background: #d1fae5; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
              <span style="color: #059669; font-size: 14px; font-weight: 700;">3</span>
            </div>
            <div>
              <p style="color: #111827; font-size: 14px; font-weight: 600; margin: 0 0 2px;">Solution</p>
              <p style="color: #6b7280; font-size: 13px; margin: 0;">We'll help you find the best solution!</p>
            </div>
          </div>
        </div>

        <!-- Separator -->
        <div style="height: 1px; background: #e5e7eb; margin: 24px 0;"></div>

        <!-- Quick Links -->
        <div style="text-align: center;">
          <p style="color: #6b7280; font-size: 13px; margin: 0 0 16px;">
            In the meantime, feel free to explore our products and services:
          </p>
          <div style="display: inline-flex; gap: 12px; flex-wrap: wrap; justify-content: center;">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://techmintlab.com'}/products" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">Browse Products</a>
            <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://techmintlab.com'}/services" style="display: inline-block; padding: 10px 20px; background: #f3f4f6; color: #374151; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500;">Our Services</a>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 24px;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0 0 4px;">
          TechMintLab — Build Faster. Scale Smarter.
        </p>
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          Need immediate help? <a href="mailto:${process.env.EMAIL_FROM || 'hello@techmintlab.com'}" style="color: #10b981; text-decoration: underline;">Reply to this email</a>
        </p>
      </div>
    </div>
  `;
}

export function getInvoiceEmailHtml(order: {
  orderId: string;
  totalAmount: number;
  customerName: string;
  products: { title: string; price: number }[];
}) {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="color: #10b981; font-size: 28px; margin: 0;">TechMintLab</h1>
        <p style="color: #6b7280; font-size: 14px;">Build Faster. Scale Smarter.</p>
      </div>
      
      <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 12px; padding: 30px; color: white; text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0 0 10px; font-size: 22px;">Payment Successful! 🎉</h2>
        <p style="margin: 0; opacity: 0.9;">Thank you for your purchase, ${order.customerName}</p>
      </div>

      <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="color: #111827; font-size: 18px; margin: 0 0 16px;">Order Summary</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">Order ID: <strong>${order.orderId}</strong></p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <thead>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <th style="text-align: left; padding: 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Product</th>
              <th style="text-align: right; padding: 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${order.products.map(p => `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; color: #111827;">${p.title}</td>
                <td style="padding: 12px 0; text-align: right; color: #111827; font-weight: 600;">₹${p.price.toLocaleString()}</td>
              </tr>
            `).join("")}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 12px 0; color: #111827; font-weight: 600;">Total</td>
              <td style="padding: 12px 0; text-align: right; color: #10b981; font-weight: 700; font-size: 18px;">₹${order.totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <h3 style="color: #111827; font-size: 18px; margin: 0 0 12px;">📥 Download Your Products</h3>
        <p style="color: #6b7280; font-size: 14px; margin: 0;">You can download your purchased products from your <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard" style="color: #10b981; text-decoration: underline;">dashboard</a>.</p>
      </div>

      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #e5e7eb;">
        <p style="color: #9ca3af; font-size: 12px; margin: 0;">
          TechMintLab - Build Faster. Scale Smarter.<br/>
          Need help? <a href="mailto:support@techmintlab.com" style="color: #10b981;">support@techmintlab.com</a>
        </p>
      </div>
    </div>
  `;
}
