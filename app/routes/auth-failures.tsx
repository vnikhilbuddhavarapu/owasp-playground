import { Fingerprint, AlertTriangle, Lock, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { CodeBlock } from "~/components/ui/code-block";
import { Link } from "react-router";

export default function AuthFailuresPage() {
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
            <div className="rounded-lg bg-rose-500/10 p-2">
              <Fingerprint className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Authentication Failures</h1>
              <p className="text-sm text-slate-400">A07:2021 - Broken auth mechanisms</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is this vulnerability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What are Authentication Failures?</CardTitle>
            <CardDescription>
              Authentication failures occur when application functions related to authentication and session management 
              are implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Issues:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>No brute force protection - unlimited login attempts</li>
                <li>Predictable session IDs (sequential numbers)</li>
                <li>Weak password policies</li>
                <li>Plaintext password storage in logs</li>
                <li>No multi-factor authentication</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-rose-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, authentication is easily bypassed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Step 1: Brute Force Attack</h4>
              <CodeBlock code={`# Try unlimited login attempts - no rate limiting
curl "<your-worker-url>/api/auth-failures?action=brute-force&username=admin&password=password123"

# View predictable session IDs
curl "<your-worker-url>/api/auth-failures?action=session&user_id=1"

# Post login with plaintext logging (vulnerable logging)
curl -X POST "<your-worker-url>/api/auth-failures" \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin","password":"SuperSecret123!"}'`} />
            </div>
            <div className="rounded-md bg-rose-500/10 p-3">
              <p className="text-sm text-rose-400">
                <strong>Vulnerability:</strong> No rate limiting, predictable session IDs, passwords logged in plaintext.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF, brute force and automated attacks are blocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Configure Rate Limiting on /api/login (5 requests per minute)</li>
                <li>Enable "Bot Fight Mode" to detect automated attacks</li>
                <li>Turn on "Super Bot Fight Mode" for advanced protection</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> Brute force attempts are rate-limited and blocked. CAPTCHA challenges for suspicious traffic.
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
                <span><strong>Rate Limiting:</strong> Block brute force attempts</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Bot Fight Mode:</strong> Detect and block automated attacks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Turnstile:</strong> Invisible CAPTCHA for suspicious requests</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
