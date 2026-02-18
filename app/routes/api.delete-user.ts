import type { Route } from "./+types/api.delete-user";

export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;

  try {
    let userId: string;

    // Support both JSON and FormData
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        userId?: string;
        user_id?: string;
      };
      userId = body.userId || body.user_id || "";
    } else {
      const formData = await request.formData();
      userId = (formData.get("userId") || formData.get("user_id")) as string;
    }

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "User ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // VULNERABLE: No authentication check, no CSRF token validation
    // This would delete any user without verifying the requester has permission
    await db.prepare("DELETE FROM users WHERE id = ?").bind(userId).run();

    return new Response(
      JSON.stringify({ success: true, message: `User ${userId} deleted` }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
