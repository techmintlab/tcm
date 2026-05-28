import { Badge } from "@/components/ui/badge";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="default" className="mb-4">Legal</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Disclaimer</h1>
          <p className="text-zinc-500">Last updated: January 1, 2025</p>
        </div>
        <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Limitation of Liability</h2>
          <p>
            TechMintLab provides digital products and services on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the merchantability, fitness for a particular purpose, or non-infringement of any product sold on our platform.
          </p>
          <h2>2. Third-Party Tools</h2>
          <p>
            Our products may integrate with third-party tools and services. We are not responsible for any issues arising from the use of third-party tools, including but not limited to:
          </p>
          <ul>
            <li>Service outages or downtime</li>
            <li>Data loss or security breaches</li>
            <li>Changes in API or service terms</li>
          </ul>
          <h2>3. Software Usage Risks</h2>
          <p>
            By using any software purchased from TechMintLab, you acknowledge and accept the following risks:
          </p>
          <ul>
            <li>Software may contain bugs or errors</li>
            <li>Compatibility issues with your existing systems</li>
            <li>Performance variations based on hosting environment</li>
          </ul>
          <h2>4. No Professional Advice</h2>
          <p>
            Content on our website, including blog posts and documentation, is for informational purposes only and does not constitute professional advice. You should consult qualified professionals for specific advice.
          </p>
          <h2>5. External Links</h2>
          <p>
            Our website may contain links to external sites. We are not responsible for the content or practices of these third-party websites.
          </p>
        </div>
      </div>
    </div>
  );
}
