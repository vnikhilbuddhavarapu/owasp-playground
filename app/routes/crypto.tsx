import { Key, ArrowLeft } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card";
import { CodeBlock } from "~/components/ui/code-block";
import { Button } from "~/components/ui/button";
import { Link, useFetcher } from "react-router";
import { useState } from "react";

export default function CryptoFailuresPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchExposedData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/crypto");
      if (res.status === 403) {
        setError("🔒 Cloudflare WAF blocked this request! The OWASP rule detected sensitive data exposure attempt.");
        setData(null);
      } else {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      setError("Network error - WAF may be blocking");
    }
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
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Key className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Cryptographic Failures</h1>
              <p className="text-sm text-slate-400">A02:2021 - Weak encryption & data exposure</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is this vulnerability */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What are Cryptographic Failures?</CardTitle>
            <CardDescription>
              Failures related to cryptography (or lack thereof) that allow attackers to access sensitive data.
              This includes weak hashing algorithms, plaintext storage, and improper key management.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Issues:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>Weak hashing (MD5, SHA1) without salt</li>
                <li>Plaintext password storage</li>
                <li>Unencrypted sensitive data at rest or in transit</li>
                <li>Hardcoded encryption keys</li>
                <li>Deprecated cryptographic protocols</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-rose-500/20 bg-rose-500/5">
          <CardHeader>
            <CardTitle className="text-rose-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, sensitive data is exposed and weakly protected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Step 1: View Exposed Sensitive Data</h4>
              <Button onClick={fetchExposedData} disabled={loading} variant="destructive" className="mb-4">
                {loading ? "Loading..." : "View Exposed Data"}
              </Button>
              {error && (
                <div className="mt-3 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3">
                  <p className="text-sm text-emerald-300">{error}</p>
                </div>
              )}
              {data && (
                <div className="mt-3 rounded-md border border-rose-500/30 bg-rose-500/10 p-3">
                  <pre className="text-xs text-rose-300 overflow-auto">{JSON.stringify(data, null, 2)}</pre>
                </div>
              )}
              <CodeBlock code={`# API returns plaintext passwords and weak hashes
"<your-worker-url>/api/crypto"

# Response shows:
# - Plaintext passwords
# - MD5 hashes without salt
# - Crackable with rainbow tables`} />
            </div>
            <div className="rounded-md bg-rose-500/10 p-3">
              <p className="text-sm text-rose-400">
                <strong>Vulnerability:</strong> Data stored without encryption, weak hashing, and exposed via API.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF and SSL/TLS enabled, data is encrypted in transit
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → SSL/TLS</li>
                <li>Set encryption mode to "Full (Strict)"</li>
                <li>Enable "Always Use HTTPS"</li>
                <li>Enable "Automatic HTTPS Rewrites"</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> All traffic is encrypted with TLS 1.3. HTTP requests redirect to HTTPS.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cloudflare Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Cloudflare Security Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Automatic HTTPS:</strong> Enforces encryption for all traffic</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>TLS 1.3:</strong> Modern cryptographic protocol</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Certificate Management:</strong> Automatic SSL certificate provisioning</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
