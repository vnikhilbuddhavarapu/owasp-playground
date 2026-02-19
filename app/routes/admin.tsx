import { Link, useFetcher, useLoaderData } from "react-router";
import { Lock, ArrowLeft, AlertTriangle, Trash2, Settings, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { CodeBlock } from "../components/ui/code-block";
import type { Route } from "./+types/admin";

export async function loader({ context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const users = await db.prepare("SELECT id, username, email, role FROM users").all();
  const settings = await db.prepare("SELECT * FROM settings").all();
  return { 
    users: users.results || [], 
    settings: settings.results || [] 
  };
}

export default function AdminPage() {
  const { users, settings } = useLoaderData<typeof loader>();
  const deleteFetcher = useFetcher();
  const settingsFetcher = useFetcher();

  // Get response data from fetchers
  const deleteData = deleteFetcher.data;
  const settingsData = settingsFetcher.data;

  const csrfCurlExample = `# Delete a user (no CSRF token required)
curl -X POST "https://<your-worker-url>/api/delete-user" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "userId=2" \\
  -H "Origin: https://evil.com"

# Toggle debug mode
curl -X POST "https://<your-worker-url>/api/settings" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "key=debug_mode&value=true"`;

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
            <div className="rounded-lg bg-purple-500/10 p-2">
              <Lock className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">CSRF (Cross-Site Request Forgery)</h1>
              <p className="text-sm text-slate-400">A08:2021 - No token validation</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        {/* What is CSRF */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">What is Cross-Site Request Forgery (CSRF)?</CardTitle>
            <CardDescription>
              CSRF attacks force authenticated users to submit unwanted requests on web applications 
              where they are currently authenticated. These attacks exploit the trust a web application has in the user's browser.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-300">How It Works:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-slate-400">
                <li>User is authenticated on victim site (has valid session cookie)</li>
                <li>User visits malicious attacker-controlled website</li>
                <li>Malicious site submits form to victim site on user's behalf</li>
                <li>Browser automatically includes session cookies</li>
                <li>Victim site processes the unauthorized request</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Before WAF */}
        <Card className="border-purple-500/20 bg-purple-500/5">
          <CardHeader>
            <CardTitle className="text-purple-400">Before WAF: Vulnerable</CardTitle>
            <CardDescription>
              Without Cloudflare WAF, state-changing requests execute without validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div>
                <h4 className="mb-2 font-medium text-slate-300">Perform Admin Actions (No CSRF Token):</h4>
                <div className="space-y-3">
                  {users.slice(0, 2).map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/30 p-2">
                      <span className="text-sm text-slate-300">{user.username}</span>
                      <deleteFetcher.Form method="post" action="/api/delete-user">
                        <input type="hidden" name="userId" value={user.id} />
                        <button type="submit" disabled={deleteFetcher.state !== "idle"} className="flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/20 cursor-pointer disabled:opacity-50">
                          <Trash2 className="h-3 w-3" />
                          {deleteFetcher.state !== "idle" ? "Deleting..." : "Delete (No Token)"}
                        </button>
                      </deleteFetcher.Form>
                    </div>
                  ))}
                  {deleteData && (
                    <div className={`mt-2 rounded-md p-2 text-xs ${deleteData.success ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                      {deleteData.message || deleteData.error}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium text-slate-300">Or use cURL (Cross-Origin):</h4>
                <CodeBlock code={`# Delete user without CSRF token
curl -X POST "<your-worker-url>/api/delete-user" \\
  -H "Content-Type: application/json" \\
  -H "Origin: https://evil.com" \\
  -d '{"user_id":2}'

# Toggle settings without validation
curl -X POST "<your-worker-url>/api/settings" \\
  -d '{"setting":"debug_mode","value":"true"}'`} />
              </div>
            </div>
            <div className="rounded-md bg-purple-500/10 p-3">
              <p className="text-sm text-purple-400">
                <strong>Vulnerability:</strong> No CSRF tokens, no SameSite cookies, no origin validation on POST requests.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Management and Settings */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-white">User Management (Vulnerable)</CardTitle>
              <CardDescription>Delete users without CSRF protection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {users.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/30 p-2">
                    <div>
                      <p className="font-medium text-sm text-slate-300">{user.username}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                    <deleteFetcher.Form method="post" action="/api/delete-user">
                      <input type="hidden" name="userId" value={user.id} />
                      <button type="submit" className="flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-1 text-xs text-rose-400 hover:bg-rose-500/20 cursor-pointer">
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </deleteFetcher.Form>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-white">Settings (Vulnerable)</CardTitle>
              <CardDescription>Toggle settings without CSRF protection</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {settings.map((setting: any) => (
                  <div key={setting.id} className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-900/30 p-2">
                    <div>
                      <p className="font-medium text-sm text-slate-300">{setting.key}</p>
                      <p className="text-xs text-slate-500">Current: {setting.value}</p>
                    </div>
                    <settingsFetcher.Form method="post" action="/api/settings">
                      <input type="hidden" name="key" value={setting.key} />
                      <input type="hidden" name="value" value={setting.value === "true" ? "false" : "true"} />
                      <button type="submit" disabled={settingsFetcher.state !== "idle"} className="w-full rounded-md bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 cursor-pointer disabled:opacity-50">
                        {settingsFetcher.state !== "idle" ? "Toggling..." : "Toggle"}
                      </button>
                    </settingsFetcher.Form>
                  </div>
                ))}
                {settingsData && (
                  <div className={`mt-2 rounded-md p-2 text-xs ${settingsData.success ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    {settingsData.message || settingsData.error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* After WAF */}
        <Card className="border-emerald-500/20 bg-emerald-500/5">
          <CardHeader>
            <CardTitle className="text-emerald-400">After WAF: Protected</CardTitle>
            <CardDescription>
              With Cloudflare WAF, cross-origin requests are detected and blocked
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium text-slate-300">Enable Cloudflare Protection:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-slate-400">
                <li>Go to Cloudflare Dashboard → Security → WAF</li>
                <li>Enable "Cloudflare Managed Ruleset"</li>
                <li>Create custom rule: Block requests with Origin header ≠ your domain</li>
                <li>Configure Security Headers: X-Frame-Options, CSP</li>
              </ol>
            </div>
            <div className="rounded-md bg-emerald-500/10 p-3">
              <p className="text-sm text-emerald-400">
                <strong>Result:</strong> Cross-origin state-changing requests are blocked with 403 Forbidden.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Cloudflare Features */}
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Cloudflare CSRF Protection</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Origin Validation:</strong> Verify request Origin header matches your domain</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Referer Checking:</strong> Block requests from external sites</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400">✓</span>
                <span><strong>Custom Rules:</strong> Require custom headers for sensitive operations</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
