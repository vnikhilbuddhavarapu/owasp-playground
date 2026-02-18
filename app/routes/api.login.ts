import type { Route } from "./+types/api.login";

// Vulnerable SQL login - directly concatenates user input
export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;

  try {
    let username: string;
    let password: string;

    // Support both FormData and JSON payloads
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = (await request.json()) as {
        username: string;
        password: string;
      };
      username = body.username;
      password = body.password;
    } else {
      const formData = await request.formData();
      username = formData.get("username") as string;
      password = formData.get("password") as string;
    }

    if (!username || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Username and password required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // VULNERABLE: Direct string concatenation - DO NOT USE IN PRODUCTION
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    // Execute the vulnerable query
    const result = await db.prepare(query).all();

    if (result.results && result.results.length > 0) {
      const user = result.results[0];
      return new Response(
        JSON.stringify({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          query: query,
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid credentials",
          query: query,
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Database error: ${error instanceof Error ? error.message : String(error)}`,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

// Also support GET requests with query params (even more vulnerable)
export async function loader({ request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  const password = url.searchParams.get("password");

  if (!username) {
    return new Response(
      JSON.stringify({
        message:
          "Vulnerable login API. Use POST or GET with ?username=&password=",
      }),
      { headers: { "Content-Type": "application/json" } },
    );
  }

  // VULNERABLE: Direct string concatenation via GET params
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password || ""}'`;

  try {
    const result = await db.prepare(query).all();

    if (result.results && result.results.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          users: result.results,
          query: query,
          method: "GET",
        }),
        { headers: { "Content-Type": "application/json" } },
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid credentials",
          query: query,
          method: "GET",
        }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: `Database error: ${error instanceof Error ? error.message : String(error)}`,
        query: query,
        method: "GET",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
