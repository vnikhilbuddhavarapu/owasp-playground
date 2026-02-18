import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { CodeBlock } from "~/components/ui/code-block";
import { Link } from "react-router";

export default function InsecureDesignPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 px-4 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md bg-slate-800/50 px-3 py-2 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white cursor-pointer transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-amber-500/10 p-2">
              <ShieldAlert className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Insecure Design</h1>
              <p className="text-sm text-slate-400">A04:2021 - Architecture & design flaws</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is this vulnerability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What is Insecure Design?</CardTitle>
            <CardDescription>
              Insecure design is a broad category representing different weaknesses, expressed as a missing 
              or ineffective control design. These are flaws in the fundamental architecture of the application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Design Flaws:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>Missing or insufficient workflow validation</li>
                <li>Business logic flaws (e.g., confirm order without payment)</li>
                <li>Insecure default configurations</li>
                <li>No threat modeling or secure design patterns</li>
                <li>Trusting client-side data without server validation</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-rose-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without proper workflow validation, business logic can be bypassed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Step 1: Bypass Payment Workflow</h4>
              <CodeBlock code={`# Confirm order WITHOUT payment verification
curl -X POST "<your-worker-url>/api/insecure-design" \\
  -H "Content-Type: application/json" \\
  -d '{"order_id":"12345"}'

# Response shows order confirmed even though payment was never verified!`} />
            </div>
            <div className="rounded-md bg-rose-500/10 p-3">
              <p className="text-sm text-rose-400">
                <strong>Vulnerability:</strong> API confirms orders without checking payment status.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              Cloudflare WAF can detect and block suspicious request patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Create custom rules for workflow enforcement</li>
                <li>Enable "Anomaly Detection" for API abuse</li>
                <li>Configure rate limiting on state-changing endpoints</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> Suspicious workflow bypass attempts are detected and blocked.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cloudflare Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Cloudflare Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Custom Rules:</strong> Enforce business logic at the edge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Rate Limiting:</strong> Prevent automated abuse of workflows</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>API Shield:</strong> Detect anomalous API behavior</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
