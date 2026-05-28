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
