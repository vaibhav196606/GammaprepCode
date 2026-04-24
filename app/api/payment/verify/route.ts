import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendEnrollmentEmail } from "@/lib/email";
import { getCashfreeConfig } from "@/lib/cashfree";

async function fetchCashfreeOrder(baseUrl: string, appId: string, secretKey: string, orderId: string) {
  const res = await fetch(`${baseUrl}/orders/${orderId}`, {
    headers: {
      "x-api-version": "2023-08-01",
      "x-client-id": appId,
      "x-client-secret": secretKey,
    },
  });
  return res.json();
}

async function processSuccessfulOrder(
  serviceSupabase: ReturnType<typeof createServiceClient>,
  orderId: string,
  cfData: Record<string, unknown>
) {
  // Get our order
  const { data: order } = await serviceSupabase
    .from("orders")
    .select("*, products(slug, name)")
    .eq("cashfree_order_id", orderId)
    .single();

  if (!order) return null;
  if (order.status === "SUCCESS") return order; // Already processed (idempotent)

  // Update order status
  await serviceSupabase
    .from("orders")
    .update({
      status: "SUCCESS",
      payment_method: (cfData as Record<string, unknown>).payment_method as string ?? null,
      cf_transaction_id: (cfData as Record<string, unknown>).cf_order_id as string ?? null,
      payment_time: new Date().toISOString(),
      webhook_payload: cfData,
    })
    .eq("cashfree_order_id", orderId);

  // Create enrollment (UNIQUE constraint prevents duplicates)
  await serviceSupabase.from("enrollments").upsert(
    {
      user_id: order.user_id,
      product_id: order.product_id,
      order_id: order.id,
      is_active: true,
    },
    { onConflict: "user_id,product_id" }
  );

  // Create product-specific delivery row
  const product = order.products as { slug: string; name: string } | null;
  if (product?.slug === "career_audit") {
    const { data: enrollment } = await serviceSupabase
      .from("enrollments")
      .select("id")
      .eq("user_id", order.user_id)
      .eq("product_id", order.product_id)
      .single();

    if (enrollment) {
      await serviceSupabase.from("career_audits").upsert(
        {
          user_id: order.user_id,
          enrollment_id: enrollment.id,
          submission_status: "awaiting_submission",
        },
        { onConflict: "enrollment_id" }
      );
    }
  }

  // Increment promo code usage
  if (order.promo_code) {
    await serviceSupabase.rpc("increment_promo_usage", {
      promo_code_value: order.promo_code,
    });
  }

  // Send confirmation email
  const { data: profile } = await serviceSupabase
    .from("profiles")
    .select("name")
    .eq("id", order.user_id)
    .single();

  const { data: authUser } = await serviceSupabase.auth.admin.getUserById(
    order.user_id
  );

  if (authUser?.user?.email) {
    await sendEnrollmentEmail({
      to: authUser.user.email,
      name: profile?.name ?? "there",
      productName: product?.name ?? "your product",
      orderId: order.cashfree_order_id,
      amount: order.amount_inr,
    }).catch(console.error);
  }

  return order;
}

export async function POST(req: Request) {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderId } = await req.json();
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  // Verify the order belongs to this user
  const { data: order } = await supabase
    .from("orders")
    .select("*, products(slug)")
    .eq("cashfree_order_id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const cfConfig = await getCashfreeConfig();

  // Fetch payment status from Cashfree
  const cfData = await fetchCashfreeOrder(cfConfig.baseUrl, cfConfig.appId, cfConfig.secretKey, orderId);
  const orderStatus = cfData.order_status;

  if (orderStatus === "PAID") {
    const processed = await processSuccessfulOrder(
      serviceSupabase,
      orderId,
      cfData
    );
    const productSlug = (order.products as { slug: string } | null)?.slug ?? "";
    return NextResponse.json({
      success: true,
      status: "PAID",
      productSlug,
    });
  }

  if (orderStatus === "ACTIVE") {
    return NextResponse.json({ success: false, status: "PENDING" });
  }

  // EXPIRED or CANCELLED
  await serviceSupabase
    .from("orders")
    .update({ status: "CANCELLED" })
    .eq("cashfree_order_id", orderId);

  return NextResponse.json({ success: false, status: "CANCELLED" });
}
