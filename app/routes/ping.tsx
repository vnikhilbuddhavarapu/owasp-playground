import { Link, useFetcher } from "react-router";
import { Terminal, ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { CodeBlock } from "../components/ui/code-block";

export default function PingPage() {
  const fetcher = useFetcher();
  const result = fetcher.data;
  const isSubmitting = fetcher.state === "submitting";

  const curlExample = `curl "https://<your-worker-url>/api/ping?host=google.com"

# Try command injection:
curl "https://<your-worker-url>/api/ping?host=;cat /etc/passwd"
curl "https://<your-worker-url>/api/ping?host=\`whoami\`"
curl "https://<your-worker-url>/api/ping?host=| ls -la"`;

  const injectionPayloads = [
    { name: "Command Chaining", payload: "; cat /etc/passwd", description: "Execute arbitrary commands" },
    { name: "Backticks", payload: "`whoami`", description: "Command substitution" },
    { name: "Pipe Operator", payload: "| ls -la", description: "Pipe output to another command" },
    { name: "AND Operator", payload: "&& id", description: "Execute if first succeeds" },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
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
            <div className="rounded-lg bg-cyan-500/10 p-2">
              <Terminal className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Command Injection</h1>
              <p className="text-sm text-slate-400">A03:2021 - OS command injection</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is Command Injection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What is Command Injection?</CardTitle>
            <CardDescription>
              Command injection occurs when an application passes unsafe user input directly to a system shell. 
              Attackers can execute arbitrary system commands, leading to full server compromise.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Exploits:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>Command chaining with semicolons (;)</li>
                <li>Command substitution with backticks (`)</li>
                <li>Pipe output to other commands (|)</li>
                <li>Conditional execution (&&, ||)</li>
                <li>Read files with cat, less, or similar</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-cyan-500/20 bg-cyan-500/5">
          <CardHeader>
            <CardTitle className="text-cyan-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, shell commands execute on the server
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-slate-300">Try Command Injection:</h4>
                <fetcher.Form method="get" action="/api/ping" className="space-y-3">
                  <Input name="host" placeholder="; cat /etc/passwd" required />
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 disabled:opacity-50">
                    {isSubmitting ? "Injecting..." : "Execute Command"}
                  </button>
                </fetcher.Form>
                {result && !result.error && (
                  <div className="mt-3 rounded-md border border-slate-800 bg-slate-900/50 p-3">
                    <p className="text-xs text-slate-500">Command: {result.command}</p>
                    {result.vulnerability?.detected && (
                      <p className="mt-1 text-xs text-rose-400">
                        ⚠️ Injection detected: {result.vulnerability.type}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div>
                <h4 className="mb-2 font-medium text-slate-300">Or use cURL:</h4>
                <CodeBlock code={`# Semicolon command chaining
curl "<your-worker-url>/api/ping?host=;whoami"

# Backtick command substitution
curl "<your-worker-url>/api/ping?host=\`id\`"

# Pipe to other commands
curl "<your-worker-url>/api/ping?host=|cat /etc/passwd"

# Command substitution with $()
curl "<your-worker-url>/api/ping?host=\$(ls -la)"`} />
              </div>
            </div>
            <div className="rounded-md bg-cyan-500/10 p-3">
              <p className="text-sm text-cyan-400">
                <strong>Vulnerability:</strong> User input directly concatenated into shell command without sanitization.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF, shell metacharacters are blocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Enable "Cloudflare Managed Ruleset"</li>
                <li>Enable "OWASP Core Ruleset"</li>
                <li>Command injection rules block shell metacharacters</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> Requests with shell metacharacters (;, |, `, $) are blocked at the edge.
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
                <span><strong>Shell Character Blocking:</strong> Block ; | & && || ` $()</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Command Detection:</strong> Block common shell commands in params</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>OWASP Rules:</strong> Comprehensive injection protection</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
