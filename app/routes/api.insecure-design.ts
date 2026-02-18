import type { Route } from "./+types/api.insecure-design";

// Insecure Design - Business logic flaw: order confirmation without payment
export async function action({ request, context }: Route.ActionArgs) {
  const db = context.cloudflare.env.DB;

  try {
    let orderId: string;
    let paymentVerified: boolean = false;

    // Support both JSON and FormData
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const body = await request.json() as { order_id: string; payment_verified?: boolean };
      orderId = body.order_id;
      paymentVerified = body.payment_verified || false;
    } else {
      const formData = await request.formData();
      orderId = formData.get("order_id") as string;
      paymentVerified = formData.get("payment_verified") === "true";
    }

    if (!orderId) {
      return new Response(
        JSON.stringify({ success: false, error: "Order ID required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // VULNERABLE: No workflow state validation
    // Order can be confirmed without payment verification
    // No check if order was actually paid for
    
    // Store the order (simulated)
    await db
      .prepare("INSERT OR REPLACE INTO orders (id, status, payment_verified, created_at) VALUES (?, ?, ?, datetime('now'))")
      .bind(orderId, "confirmed", paymentVerified)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: `Order ${orderId} confirmed!`,
        order: {
          id: orderId,
          status: "confirmed",
          payment_verified: paymentVerified,
          vulnerability: "Insecure Design - No workflow validation",
        },
        warning: paymentVerified 
          ? "Payment was verified"
          : "WARNING: Order confirmed WITHOUT payment verification!",
        exploit: "Send request without payment_verified=true to get free items",
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

// Also support GET to check order status
export async function loader({ request, context }: Route.LoaderArgs) {
  const db = context.cloudflare.env.DB;
  const url = new URL(request.url);
  const orderId = url.searchParams.get("id");

  if (!orderId) {
    return new Response(
      JSON.stringify({
        message: "Insecure Design API - Business logic flaw demo",
        usage: "POST with order_id to confirm without payment verification",
        example: `curl -X POST "<your-worker-url>/api/insecure-design" -d '{"order_id":"123"}'`,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const order = await db
      .prepare("SELECT * FROM orders WHERE id = ?")
      .bind(orderId)
      .first();

    return new Response(
      JSON.stringify({
        success: true,
        order: order || { id: orderId, status: "not_found" },
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
