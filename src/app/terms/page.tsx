import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>

        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TechMintLab ("the Platform"), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.
          </p>

          <h2>2. User Responsibilities</h2>
          <ul>
            <li>Provide accurate and complete registration information</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Use the Platform in compliance with applicable laws</li>
            <li>Not engage in any unauthorized or illegal activities</li>
            <li>Not attempt to access restricted areas without authorization</li>
          </ul>

          <h2>3. Digital Products Policy</h2>
          <p>
            All digital products purchased on TechMintLab are provided "as is" without any express or implied warranty. Upon purchase, you receive a license to use the product subject to the following:
          </p>
          <ul>
            <li>Products are for personal or business use as specified in the license</li>
            <li>You may not resell, redistribute, or sublicense products without permission</li>
            <li>You may not claim the products as your own original work</li>
          </ul>

          <h2>4. Account Rules</h2>
          <p>
            You are responsible for all activities that occur under your account. Notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts for violations.
          </p>

          <h2>5. Payment Conditions</h2>
          <p>
            All payments are processed through Razorpay. By making a purchase, you agree to:
          </p>
          <ul>
            <li>Pay all charges at the prices listed at the time of purchase</li>
            <li>Provide valid payment information</li>
            <li>Authorize us to charge your chosen payment method</li>
          </ul>

          <h2>6. License Restrictions</h2>
          <p>
            Purchased products are licensed, not sold. The license is non-exclusive, non-transferable, and subject to these terms. You may not:
          </p>
          <ul>
            <li>Modify or create derivative works from the product code</li>
            <li>Distribute the product source code publicly</li>
            <li>Remove copyright or proprietary notices</li>
          </ul>

          <h2>7. Intellectual Property</h2>
          <p>
            All content, trademarks, and intellectual property on the Platform are owned by TechMintLab or our licensors. You may not use our intellectual property without prior written consent.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            TechMintLab shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform or products.
          </p>

          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. Continued use of the Platform constitutes acceptance of updated terms.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these terms, contact us at legal@techmintlab.com
          </p>
        </div>
      </div>
    </div>
  );
}
