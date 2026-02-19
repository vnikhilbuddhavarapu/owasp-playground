import { Bug, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { CodeBlock } from "~/components/ui/code-block";
import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { useState } from "react";

export default function SecurityMisconfigPage() {
  const [endpoint, setEndpoint] = useState("env");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const endpoints = ["env", "debug", "config", "git"];

  const fetchMisconfig = async (ep: string) => {
    setLoading(true);
    setEndpoint(ep);
    const res = await fetch(`/api/misconfig?endpoint=${ep}`);
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

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
            <div className="rounded-lg bg-orange-500/10 p-2">
              <Bug className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Security Misconfiguration</h1>
              <p className="text-sm text-slate-400">A05:2021 - Default configs & verbose errors</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is this vulnerability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What is Security Misconfiguration?</CardTitle>
            <CardDescription>
              The application might be vulnerable if the application is missing appropriate security hardening 
              across any part of the application stack, or has insecure default configurations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Misconfigurations:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>Default credentials (admin/admin)</li>
                <li>Verbose error messages with stack traces</li>
                <li>Unnecessary features enabled</li>
                <li>Exposed .env files or .git directories</li>
                <li>Missing security headers</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-rose-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, sensitive configuration data is exposed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Step 1: Access Exposed Configuration</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {endpoints.map((ep) => (
                  <Button 
                    key={ep}
                    onClick={() => fetchMisconfig(ep)} 
                    disabled={loading} 
                    variant={endpoint === ep ? "destructive" : "outline"}
                    size="sm"
                  >
                    {loading && endpoint === ep ? "Loading..." : `View ${ep}`}
                  </Button>
                ))}
              </div>
              {data && (
                <div className="mt-3 rounded-md border border-rose-500/30 bg-rose-500/10 p-3">
                  <pre className="text-xs text-rose-300 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
              <CodeBlock code={`# View exposed .env secrets
/api/misconfig?endpoint=env

# View verbose debug info with stack traces
/api/misconfig?endpoint=debug

# View insecure default config
/api/misconfig?endpoint=config

# View exposed git info
/api/misconfig?endpoint=git`} />
            </div>
            <div className="rounded-md bg-rose-500/10 p-3">
              <p className="text-sm text-rose-400">
                <strong>Vulnerability:</strong> API exposes secrets, stack traces, and configuration data.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF Managed Rules, common misconfigurations are blocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Enable "Cloudflare Managed Ruleset"</li>
                <li>Enable rules for .env, .git, and config file access</li>
                <li>Configure security headers at the edge</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> Requests for sensitive files and paths are blocked with 403 Forbidden.
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
                <span><strong>File Access Rules:</strong> Block .env, .git, and config files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Security Headers:</strong> Add HSTS, CSP, X-Frame-Options</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Information Disclosure:</strong> Hide server/version details</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
