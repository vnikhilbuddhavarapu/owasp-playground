import type { Route } from "./+types/api.vulnerable-components";

// Vulnerable and Outdated Components - Lists outdated dependencies with known CVEs
export async function loader({ request, context }: Route.LoaderArgs) {
  // VULNERABLE: Exposes dependency information and vulnerable versions
  // Simulates a typical package.json with known vulnerable packages

  const vulnerablePackages = {
    dependencies: {
      lodash: {
        version: "4.17.10",
        cve: "CVE-2019-10744",
        severity: "Critical",
        issue: "Prototype pollution",
        patched_in: "4.17.12",
      },
      express: {
        version: "4.16.0",
        cve: "CVE-2022-24999",
        severity: "High",
        issue: "qs vulnerable to Prototype Pollution",
        patched_in: "4.17.3",
      },
      axios: {
        version: "0.19.0",
        cve: "CVE-2021-3749",
        severity: "High",
        issue: "Regular expression denial of service",
        patched_in: "0.21.1",
      },
      jquery: {
        version: "3.3.1",
        cve: "CVE-2019-11358",
        severity: "Medium",
        issue: "Prototype pollution",
        patched_in: "3.4.0",
      },
      moment: {
        version: "2.19.0",
        cve: "CVE-2022-31129",
        severity: "Medium",
        issue: "Regular expression denial of service",
        patched_in: "2.29.4",
      },
    },
    devDependencies: {
      "webpack-dev-server": {
        version: "3.1.11",
        cve: "CVE-2018-14732",
        severity: "High",
        issue: "Reverse proxy bypass",
        patched_in: "3.1.14",
      },
    },
  };

  // Prototype pollution demonstration endpoint
  const url = new URL(request.url);
  const demo = url.searchParams.get("demo");

  if (demo === "pollute") {
    // Simulate prototype pollution attack
    const maliciousPayload = {
      __proto__: {
        isAdmin: true,
        role: "admin",
      },
    };

    return new Response(
      JSON.stringify(
        {
          success: true,
          attack: "Prototype Pollution",
          payload: maliciousPayload,
          result: "Object prototype polluted! All objects now have isAdmin=true",
          vulnerability: "Vulnerable lodash merge function allows prototype pollution",
          impact: "Privilege escalation - any user can become admin",
        },
        null,
        2
      ),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify(
      {
        success: true,
        packages: vulnerablePackages,
        total_vulnerabilities: 6,
        critical: 1,
        high: 3,
        medium: 2,
        warning: "VULNERABLE COMPONENTS: Outdated packages with known CVEs!",
        exploit: "Try ?demo=pollute to see prototype pollution attack",
        scanner_recommendation: "Run npm audit or use Snyk to scan dependencies",
      },
      null,
      2
    ),
    { headers: { "Content-Type": "application/json" } }
  );
}

// Support POST for prototype pollution demo
export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;

  try {
    const body = await request.json() as any;

    // VULNERABLE: Unsafe merge that allows prototype pollution
    // Simulating vulnerable lodash merge behavior
    if (body?.__proto__ || body?.constructor?.prototype) {
      return new Response(
        JSON.stringify({
          success: true,
          attack_detected: "Prototype Pollution",
          payload: body,
          result: "Object merged with polluted prototype!",
          vulnerability: "Unsafe object merge allows prototype manipulation",
          impact: "Potential privilege escalation",
          note: "This demonstrates CVE-2019-10744 from lodash",
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Package data received",
        data: body,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
