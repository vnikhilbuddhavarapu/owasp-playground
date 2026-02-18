import type { Route } from "./+types/api.comment";

export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;

  try {
    let content: string;

    if (request.headers.get("content-type")?.includes("application/json")) {
      const body = (await request.json()) as { content: string };
      content = body.content;
    } else {
      const formData = await request.formData();
      content = formData.get("content") as string;
    }

    if (!content) {
      return new Response(
        JSON.stringify({ success: false, error: "Content is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // VULNERABLE: No input sanitization - content stored as-is
    await db
      .prepare("INSERT INTO comments (user_id, content) VALUES (?, ?)")
      .bind(2, content) // Default to user_id 2 (john_doe)
      .run();

    return new Response(
      JSON.stringify({ success: true, message: "Comment posted" }),
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
