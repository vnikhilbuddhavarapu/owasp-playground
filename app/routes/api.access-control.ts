import type { Route } from "./+types/api.access-control";

// Broken Access Control - Returns any user's data without authentication
export async function loader({ request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const userId = url.searchParams.get("id");

  if (!userId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "User ID required. Try ?id=1, ?id=2, etc.",
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // VULNERABLE: No authentication check, no authorization verification
    // Anyone can access any user's data by changing the ID
    const user = await db
      .prepare("SELECT id, username, email, role, created_at FROM users WHERE id = ?")
      .bind(userId)
      .first();

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "User not found",
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user,
        message: "Access granted without authentication!",
        vulnerability: "Broken Access Control - IDOR (Insecure Direct Object Reference)",
        note: "Change the id parameter to access other users' data",
      }),
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
