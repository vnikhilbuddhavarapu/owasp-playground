import { Link } from "react-router";
import { 
  Database, Code, Lock, Terminal, 
  FileJson, Key, Network, Fingerprint, Bug, ShieldAlert, Eye, ExternalLink
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const vulnerabilities = [
  {
    id: "sqli",
    title: "SQL Injection",
    owaspId: "A03",
    description: "Vulnerable login form with direct SQL concatenation",
    icon: Database,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
    path: "/login",
  },
  {
    id: "xss",
    title: "Cross-Site Scripting",
    owaspId: "A03",
    description: "Stored XSS via unsanitized comment rendering",
    icon: Code,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
    path: "/comments",
  },
  {
    id: "cmdi",
    title: "Command Injection",
    owaspId: "A03",
    description: "Ping utility passing input to shell commands",
    icon: Terminal,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
    path: "/ping",
  },
  {
    id: "csrf",
    title: "CSRF",
    owaspId: "A08",
    description: "No CSRF tokens on state-changing admin operations",
    icon: Lock,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
    path: "/admin",
  },
  {
    id: "broken-access",
    title: "Broken Access Control",
    owaspId: "A01",
    description: "Direct object references allow accessing any user's data",
    icon: Eye,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    path: "/access-control",
  },
  {
    id: "crypto-failures",
    title: "Cryptographic Failures",
    owaspId: "A02",
    description: "Plaintext password storage and weak encryption",
    icon: Key,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/20",
    path: "/crypto",
  },
  {
    id: "insecure-design",
    title: "Insecure Design",
    owaspId: "A04",
    description: "Business logic flaws allowing unlimited transfers",
    icon: ShieldAlert,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/20",
    path: "/insecure-design",
  },
  {
    id: "security-misconfig",
    title: "Security Misconfiguration",
    owaspId: "A05",
    description: "Default credentials, verbose errors, exposed stack traces",
    icon: Bug,
    color: "text-lime-500",
    bgColor: "bg-lime-500/10",
    borderColor: "border-lime-500/20",
    path: "/misconfig",
  },
  {
    id: "vulnerable-components",
    title: "Vulnerable Components",
    owaspId: "A06",
    description: "Outdated libraries with known CVE vulnerabilities",
    icon: FileJson,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
    path: "/vulnerable-components",
  },
  {
    id: "auth-failures",
    title: "Authentication Failures",
    owaspId: "A07",
    description: "Weak passwords, no MFA, brute force allowed",
    icon: Fingerprint,
    color: "text-teal-500",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/20",
    path: "/auth-failures",
  },
];

export default function IndexPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between px-6 lg:px-8">
            <Link to="/" className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
              <svg className="h-8 w-8" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="8" fill="#0f172a"/>
                <path d="M16 5L7 9v7c0 6 4 11 9 12 5-1 9-6 9-12V9L16 5z" stroke="#06b6d4" strokeWidth="2" fill="#06b6d4" fillOpacity="0.1"/>
                <ellipse cx="16" cy="14" rx="3" ry="4" fill="#06b6d4"/>
                <path d="M14 12c-2-1-3-3-3-3s2 1 4 2M18 12c2-1 3-3 3-3s-2 1-4 2" stroke="#06b6d4" strokeWidth="1.5" fill="none"/>
                <path d="M14 16c-2 1-3 3-3 3s2-1 4-2M18 16c2 1 3 3 3 3s-2-1-4-2" stroke="#06b6d4" strokeWidth="1.5" fill="none"/>
                <line x1="13" y1="14" x2="19" y2="14" stroke="#0f172a" strokeWidth="1"/>
                <line x1="13" y1="16" x2="19" y2="16" stroke="#0f172a" strokeWidth="1"/>
              </svg>
              <span className="text-lg font-semibold text-white tracking-tight">OWASP Playground</span>
            </Link>
            <a
              href="https://owasp.org/Top10/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-slate-800/60 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              OWASP Top 10
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-12 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse"/>
            <span className="text-sm font-medium text-cyan-400">Cloudflare WAF Demo</span>
          </div>
          <h1 className="mb-5 text-5xl font-bold tracking-tight text-white sm:text-6xl">
            OWASP Top 10
            <span className="block mt-2 text-transparent bg-linear-to-r from-cyan-400 to-purple-500 bg-clip-text">
              Vulnerability Playground
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400 leading-relaxed">
            Explore all 10 OWASP security risks with hands-on exploits. 
            Then deploy with Cloudflare WAF and watch attacks get blocked at the edge.
          </p>
        </div>
      </section>

      {/* Vulnerability Grid */}
      <section className="px-6 lg:px-8 pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {vulnerabilities.map((vuln) => (
              <Link
                key={vuln.id}
                to={vuln.path}
                className={`group relative overflow-hidden rounded-xl border ${vuln.borderColor} ${vuln.bgColor} p-5 transition-all duration-200 hover:scale-[1.02] hover:border-opacity-50`}
              >
                <div className="absolute right-3 top-3 text-xs font-bold text-slate-500">
                  {vuln.owaspId}
                </div>
                <div className={`mb-4 inline-flex rounded-lg ${vuln.bgColor} p-3`}>
                  <vuln.icon className={`h-6 w-6 ${vuln.color}`} />
                </div>
                <h3 className={`mb-2 font-semibold ${vuln.color}`}>{vuln.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{vuln.description}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-slate-300 transition-colors">
                  <span>Exploit</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t border-slate-800 bg-slate-950 px-6 lg:px-8 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400">Three phases from exploitation to protection</p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="border-cyan-500/20 bg-linear-to-b from-cyan-500/5 to-transparent">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-xl font-bold text-cyan-500">
                  1
                </div>
                <CardTitle className="text-cyan-400">Explore</CardTitle>
                <CardDescription className="text-slate-400">
                  Navigate through 10 intentionally vulnerable features. Understand why each security flaw exists and how attackers exploit them.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-purple-500/20 bg-linear-to-b from-purple-500/5 to-transparent">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-xl font-bold text-purple-500">
                  2
                </div>
                <CardTitle className="text-purple-400">Exploit</CardTitle>
                <CardDescription className="text-slate-400">
                  Use built-in forms or copy-paste cURL commands to attack. Each vulnerability has working exploits you can trigger immediately.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-emerald-500/20 bg-linear-to-b from-emerald-500/5 to-transparent">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-xl font-bold text-emerald-500">
                  3
                </div>
                <CardTitle className="text-emerald-400">Protect</CardTitle>
                <CardDescription className="text-slate-400">
                  Enable Cloudflare WAF OWASP Core Ruleset and Bot Management. Re-run exploits and watch them get blocked at the edge.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-slate-800 pt-10">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">10</div>
              <div className="text-sm text-slate-500">OWASP Risks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">15+</div>
              <div className="text-sm text-slate-500">Exploit Vectors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-1">11</div>
              <div className="text-sm text-slate-500">API Endpoints</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Built for Cloudflare security demonstrations. Not for production use.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="https://developers.cloudflare.com/waf/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Cloudflare WAF
            </a>
            <a
              href="https://github.com/vnikhilbuddhavarapu/owasp-playground"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
