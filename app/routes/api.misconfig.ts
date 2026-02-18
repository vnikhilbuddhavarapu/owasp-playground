import type { Route } from "./+types/api.misconfig";

// Security Misconfiguration - Exposes sensitive configuration data
export async function loader({ request, context }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const endpoint = url.searchParams.get("endpoint") || "env";

  // VULNERABLE: Exposes sensitive configuration information
  // Simulates common misconfigurations found in production apps

  const misconfigData: Record<string, any> = {
    env: {
      NODE_ENV: "production",
      DEBUG: "true",
      SECRET_KEY: "hardcoded-secret-key-12345",
      DB_PASSWORD: "SuperSecret123!",
      API_KEYS: {
        stripe: "sk_live_1234567890abcdef",
        aws: "AKIAIOSFODNN7EXAMPLE",
      },
      vulnerability: "Exposed .env file with secrets",
    },
    debug: {
      debug_mode: true,
      stack_traces: true,
      error_details: "verbose",
      recent_errors: [
        "TypeError: Cannot read property 'id' of undefined at /app/routes/users.js:45:12",
        "ReferenceError: db is not defined at /app/models/order.js:23:5",
      ],
      server_info: {
        framework: "Express 4.17.1",
        node_version: "16.14.0",
        database: "PostgreSQL 13.2",
        os: "Ubuntu 20.04.3 LTS",
      },
      vulnerability: "Verbose error messages with stack traces",
    },
    config: {
      admin_panel: {
        enabled: true,
        path: "/admin",
        default_creds: { username: "admin", password: "admin" },
        ip_whitelist: null,
      },
      security: {
        rate_limiting: false,
        csrf_protection: false,
        xss_filter: false,
      },
      vulnerability: "Default credentials and disabled security features",
    },
    git: {
      repository: "github.com/company/secret-project",
      last_commit: "a1b2c3d - Added customer credit card processing",
      branch: "master",
      config: "[core] repositoryformatversion = 0",
      vulnerability: "Exposed .git directory",
    },
  };

  const data = misconfigData[endpoint] || {
    error: "Unknown endpoint",
    available: Object.keys(misconfigData),
  };

  return new Response(
    JSON.stringify(
      {
        success: true,
        endpoint,
        data,
        warning: "SECURITY MISCONFIGURATION: Sensitive data exposed!",
        note: "Try ?endpoint=env, ?endpoint=debug, ?endpoint=config, ?endpoint=git",
      },
      null,
      2
    ),
    { headers: { "Content-Type": "application/json" } }
  );
}
