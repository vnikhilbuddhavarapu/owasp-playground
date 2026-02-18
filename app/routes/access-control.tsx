import { Eye, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { CodeBlock } from "~/components/ui/code-block";
import { Link } from "react-router";

export default function BrokenAccessControlPage() {
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
            <div className="rounded-lg bg-blue-500/10 p-2">
              <Eye className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Broken Access Control</h1>
              <p className="text-sm text-slate-400">A01:2021 - Unauthorized data access</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is this vulnerability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What is Broken Access Control?</CardTitle>
            <CardDescription>
              Access control enforces policy such that users cannot act outside of their intended permissions. 
              Failures typically lead to unauthorized information disclosure, modification, or destruction of all data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Exploits:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>IDOR (Insecure Direct Object Reference) - changing IDs in URLs</li>
                <li>Forced browsing to admin pages without authentication</li>
                <li>Accessing API endpoints without proper authorization</li>
                <li>Privilege escalation by modifying role parameters</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-rose-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, these requests succeed and expose unauthorized data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Step 1: Access User Data Without Auth</h4>
              <CodeBlock code={`# Access any user's data by changing the ID parameter
curl "<your-worker-url>/api/access-control?id=1"
curl "<your-worker-url>/api/access-control?id=2" 
curl "<your-worker-url>/api/access-control?id=3"

# Response shows user's email, role, and other data
# WITHOUT requiring authentication!`} />
            </div>
            <div className="rounded-md bg-rose-500/10 p-3">
              <p className="text-sm text-rose-400">
                <strong>Vulnerability:</strong> API returns data based solely on ID parameter with no session validation.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF Managed Rules enabled, unauthorized access is blocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Enable "Cloudflare Managed Ruleset"</li>
                <li>Enable "OWASP Core Ruleset"</li>
                <li>Set sensitivity to "High"</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> Requests without valid session tokens are blocked with 403 Forbidden response.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cloudflare Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Cloudflare WAF Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Access Control Rules:</strong> Enforce authentication at the edge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Token Validation:</strong> Verify JWT/session tokens before reaching origin</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Rate Limiting:</strong> Prevent brute force ID enumeration</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
