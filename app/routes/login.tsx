import { useState } from "react";
import { Link, useFetcher } from "react-router";
import { Database, ArrowLeft, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { CodeBlock } from "../components/ui/code-block";

export default function LoginPage() {
  const fetcher = useFetcher();
  const [showPassword, setShowPassword] = useState(false);
  const [showQuery, setShowQuery] = useState(false);

  const isSubmitting = fetcher.state === "submitting";
  const result = fetcher.data;

  const curlExample = `curl -X POST "https://<your-worker-url>/api/login" \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin'\\''--","password":"anything"}'`;

  const sqlInjectionPayloads = [
    { name: "Comment Out", payload: "admin'--", description: "Bypass password check" },
    { name: "OR 1=1", payload: "' OR '1'='1", description: "Always true condition" },
    { name: "Union Select", payload: "' UNION SELECT * FROM users--", description: "Extract all users" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 px-4 py-4">
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
              <Database className="h-6 w-6 text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">SQL Injection</h1>
              <p className="text-sm text-slate-400">A03:2021 - Database injection attacks</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is SQL Injection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What is SQL Injection?</CardTitle>
            <CardDescription>
              SQL injection occurs when untrusted user input is concatenated into database queries. 
              Attackers can manipulate queries to bypass authentication, extract data, or modify database contents.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Exploits:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>Bypass authentication with ' OR '1'='1</li>
                <li>Extract data with UNION SELECT statements</li>
                <li>Modify data with DROP TABLE or DELETE</li>
                <li>Execute commands with xp_cmdshell</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-rose-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, SQL injection payloads execute successfully
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-slate-300">Try SQL Injection:</h4>
                <fetcher.Form method="post" action="/api/login" className="space-y-3">
                  <Input name="username" placeholder="admin'--" required />
                  <Input name="password" type="password" placeholder="anything" required />
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50 cursor-pointer">
                    {isSubmitting ? "Trying..." : "Login with Injection"}
                  </button>
                </fetcher.Form>
                {result && (
                  <div className={`mt-3 rounded-md p-3 text-sm ${result.success ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    {result.success ? "Login Successful! Admin access granted." : "Login Failed"}
                  </div>
                )}
              </div>
              <div>
                <h4 className="mb-2 font-medium text-slate-300">Or use cURL:</h4>
                <CodeBlock code={`# Bypass authentication
curl -X POST "<your-worker-url>/api/login" \\
  -H "Content-Type: application/json" \\
  -d '{"username":"admin'\''--","password":"anything"}'

# Result: {"success":true,"role":"admin"}
# Payload commented out password check!`} />
              </div>
            </div>
            <div className="rounded-md bg-rose-500/10 p-3">
              <p className="text-sm text-rose-400">
                <strong>Vulnerability:</strong> User input concatenated directly into SQL query without sanitization.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF OWASP Core Ruleset, SQL injection is blocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Enable "OWASP Core Ruleset"</li>
                <li>Set SQL Injection sensitivity to "High"</li>
                <li>Re-run the exploit - it will be blocked with 403</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> SQL injection patterns (', --, UNION, OR 1=1) are blocked at the edge.
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
                <span><strong>SQL Injection Rules:</strong> Block common SQLi patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Input Sanitization:</strong> Detect suspicious characters</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>OWASP Core Ruleset:</strong> Comprehensive attack protection</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
