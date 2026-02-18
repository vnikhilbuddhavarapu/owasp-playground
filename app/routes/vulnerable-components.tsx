import { FileJson, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { CodeBlock } from "~/components/ui/code-block";
import { Link } from "react-router";

export default function VulnerableComponentsPage() {
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
            <div className="rounded-lg bg-teal-500/10 p-2">
              <FileJson className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Vulnerable Components</h1>
              <p className="text-sm text-slate-400">A06:2021 - Outdated dependencies</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is this vulnerability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What are Vulnerable Components?</CardTitle>
            <CardDescription>
              Using components (libraries, frameworks, software modules) with known security vulnerabilities.
              This includes outdated dependencies with published CVEs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Risks:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>Prototype pollution in lodash/underscore</li>
                <li>Remote code execution in outdated frameworks</li>
                <li>DoS via regex in validation libraries</li>
                <li>XSS in jQuery and other client-side libraries</li>
                <li>Known CVEs with public exploits</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-rose-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, vulnerable dependencies can be exploited
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Step 1: Exploit Prototype Pollution</h4>
              <CodeBlock code={`# View vulnerable package versions
curl "<your-worker-url>/api/vulnerable-components"

# Exploit CVE-2019-10744 - Prototype Pollution in lodash
curl -X POST "<your-worker-url>/api/vulnerable-components" \\
  -H "Content-Type: application/json" \\
  -d '{"__proto__": {"isAdmin": true}}'

# View prototype pollution demo
curl "<your-worker-url>/api/vulnerable-components?demo=pollute"`} />
            </div>
            <div className="rounded-md bg-rose-500/10 p-3">
              <p className="text-sm text-rose-400">
                <strong>Vulnerability:</strong> Outdated lodash allows prototype pollution attacks.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF, known CVE exploit patterns are blocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Enable "Cloudflare Managed Ruleset"</li>
                <li>Enable rules for prototype pollution attacks</li>
                <li>Monitor for CVE exploit patterns</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> Known CVE exploit patterns are blocked at the edge.
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
                <span><strong>CVE Detection:</strong> Block known vulnerability exploits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Prototype Pollution:</strong> Detect and block __proto__ attacks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>API Shield:</strong> Anomalous API behavior detection</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
