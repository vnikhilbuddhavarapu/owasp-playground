import type { Route } from "./+types/api.crypto";

// Cryptographic Failures - Exposes sensitive data without encryption
export async function loader({ request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;

  try {
    // VULNERABLE: Query returns plaintext sensitive data
    // In a real scenario, this might be credit cards, SSNs, etc.
    const users = await db
      .prepare("SELECT id, username, email, password as plaintext_password, role FROM users LIMIT 5")
      .all();

    // Simulate weak MD5 hashing (in real app, this would be actual weak hashes)
    const weakHashes = users.results?.map((user: any) => ({
      ...user,
      password_hash: `5f4dcc3b5aa765d61d8327deb882cf99`, // MD5 of "password"
      hash_type: "MD5 (no salt)",
      crackable: true,
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: weakHashes,
        vulnerability: "Cryptographic Failures",
        issues: [
          "Plaintext password exposure",
          "Weak MD5 hashing without salt",
          "No encryption of sensitive data at rest",
          "Can be cracked with rainbow tables"
        ],
        note: "Real passwords would be hashed, but here we show plaintext to demonstrate the risk",
      }, null, 2),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
