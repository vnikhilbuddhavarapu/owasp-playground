import type { Route } from "./+types/api.settings";

export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;

  try {
    let key: string;
    let value: string;

    // Support both JSON and FormData
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = (await request.json()) as { setting: string; value: string };
      key = body.setting;
      value = body.value;
    } else {
      const formData = await request.formData();
      key = formData.get("key") as string;
      value = formData.get("value") as string;
    }

    if (!key || value === null) {
      return new Response(
        JSON.stringify({ success: false, error: "Key and value required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // VULNERABLE: No CSRF token validation, no authentication
    await db
      .prepare(
        "UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = ?",
      )
      .bind(value, key)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Setting ${key} updated to ${value}`,
      }),
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
