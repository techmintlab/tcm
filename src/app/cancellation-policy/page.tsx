import { Badge } from "@/components/ui/badge";

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Cancellation Policy</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Order Cancellation</h2>
          <p>
            Since our products are digital and delivered instantly, orders cannot be cancelled once payment is processed and the product is delivered.
          </p>
          <h2>2. Subscription Cancellation</h2>
          <p>
            For subscription-based services, you can cancel your subscription at any time from your dashboard. Cancellation will take effect at the end of the current billing period.
          </p>
          <h2>3. Service Cancellation</h2>
          <p>
            For custom development services, cancellation terms are defined in the service agreement. Please refer to your specific contract for details.
          </p>
          <h2>4. How to Cancel</h2>
          <p>
            To cancel a subscription: Log into your dashboard, go to Subscriptions, and click Cancel.
            <br />
            For service cancellations: Contact us at support@techmintlab.com
          </p>
        </div>
      </div>
    </div>
  );
}
