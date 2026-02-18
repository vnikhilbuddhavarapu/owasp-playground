import type { Route } from "./+types/api.auth-failures";

// Authentication Failures - Weak session management and brute force vulnerability
export async function loader({ request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "info";

  // VULNERABLE: Predictable session ID generation
  const generateSessionId = (userId: number) => {
    // VULNERABLE: Sequential session IDs
    return (1000 + userId).toString();
  };

  if (action === "session") {
    const userId = url.searchParams.get("user_id") || "1";
    const sessionId = generateSessionId(parseInt(userId));

    return new Response(
      JSON.stringify({
        success: true,
        session: {
          user_id: userId,
          session_id: sessionId,
          predictable: true,
          pattern: "Sequential IDs: 1001, 1002, 1003...",
        },
        vulnerability: "Predictable Session IDs",
        exploit: `Try session_id=${parseInt(sessionId) + 1} to access another user's session`,
        note: "Real apps should use cryptographically random session tokens",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  if (action === "brute-force") {
    const username = url.searchParams.get("username") || "admin";
    const password = url.searchParams.get("password") || "password";

    // VULNERABLE: No rate limiting, no account lockout
    // Check against actual database
    const user = await db
      .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
      .bind(username, password)
      .first();

    return new Response(
      JSON.stringify({
        success: !!user,
        user: user
          ? {
              id: (user as any).id,
              username: (user as any).username,
              role: (user as any).role,
            }
          : null,
        attempt: { username, password },
        vulnerability: "No brute force protection",
        issues: [
          "No rate limiting on login attempts",
          "No account lockout after failed attempts",
          "No CAPTCHA after suspicious activity",
          "Can try unlimited passwords",
        ],
        recommendation: "Try automated brute force with common passwords",
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  // Default: return info
  return new Response(
    JSON.stringify({
      message: "Authentication Failures API",
      endpoints: {
        "Predictable Session IDs": "/api/auth-failures?action=session&user_id=1",
        "Brute Force Test": "/api/auth-failures?action=brute-force&username=admin&password=password123",
      },
      vulnerabilities: [
        "Predictable session IDs (sequential)",
        "No brute force protection",
        "Weak password policy",
        "No multi-factor authentication",
        "Session fixation possible",
      ],
    }),
    { headers: { "Content-Type": "application/json" } }
  );
}

// POST for login attempts without brute force protection
export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;

  try {
    const body = await request.json() as { username?: string; password?: string };
    const { username = "", password = "" } = body;

    // VULNERABLE: No rate limiting, logs all attempts
    const user = await db
      .prepare("SELECT * FROM users WHERE username = ? AND password = ?")
      .bind(username, password)
      .first();

    // Log the attempt (vulnerable logging)
    await db
      .prepare(
        "INSERT INTO logs (action, username, password, success, timestamp) VALUES (?, ?, ?, ?, datetime('now'))"
      )
      .bind("login_attempt", username, password, user ? 1 : 0)
      .run();

    return new Response(
      JSON.stringify({
        success: !!user,
        message: user ? "Login successful" : "Invalid credentials",
        vulnerability: "Authentication Failures",
        issues: [
          "Passwords stored in plaintext logs",
          "No rate limiting",
          "No account lockout",
        ],
        note: "Password was logged in plaintext for debugging!",
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
