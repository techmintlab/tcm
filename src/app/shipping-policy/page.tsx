import { Badge } from "@/components/ui/badge";

export default function ShippingPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shipping & Delivery Policy</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Digital Delivery</h2>
          <p>
            All products purchased on TechMintLab are digital goods and are delivered electronically. Physical products are not shipped.
          </p>
          <h2>2. Instant Download</h2>
          <p>
            Upon successful payment verification, you will receive:
          </p>
          <ul>
            <li>Immediate access to download your purchased product from your dashboard</li>
            <li>A confirmation email with download instructions</li>
            <li>An invoice for your records</li>
          </ul>
          <h2>3. Email Delivery</h2>
          <p>
            Download links and purchase confirmations are sent to the email address used during checkout. If you do not receive the email within 15 minutes, please check your spam folder and contact support.
          </p>
          <h2>4. Access Time</h2>
          <p>
            All purchased products remain accessible in your account dashboard indefinitely. You can download your products at any time after purchase.
          </p>
          <h2>5. Technical Issues</h2>
          <p>
            If you experience any issues with accessing or downloading your purchased products, please contact our support team at support@techmintlab.com for immediate assistance.
          </p>
        </div>
      </div>
    </div>
  );
}
