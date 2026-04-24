import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { sendEnrollmentEmail } from "@/lib/email";
import { getCashfreeConfig } from "@/lib/cashfree";
import crypto from "crypto";

function verifyWebhookSignature(
  body: string,
  timestamp: string,
  signature: string,
  secretKey: string
): boolean {
  const message = `${timestamp}${body}`;
  const expected = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
  return expected === signature;
}

export async function POST(req: Request) {
  const body = await req.text();
  const timestamp = req.headers.get("x-webhook-timestamp") ?? "";
  const signature = req.headers.get("x-webhook-signature") ?? "";

  const cfConfig = await getCashfreeConfig();

  if (!verifyWebhookSignature(body, timestamp, signature, cfConfig.secretKey)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const eventType = payload.type;

  if (
    eventType !== "PAYMENT_SUCCESS_WEBHOOK" &&
    eventType !== "ORDER_PAID"
  ) {
    return NextResponse.json({ received: true });
  }

  const orderId =
    payload.data?.order?.order_id ?? payload.data?.payment?.order_id;

  if (!orderId) {
    return NextResponse.json({ received: true });
  }

  const serviceSupabase = createServiceClient();

  const { data: order } = await serviceSupabase
    .from("orders")
    .select("*, products(slug, name)")
    .eq("cashfree_order_id", orderId)
    .single();

  if (!order || order.status === "SUCCESS") {
    return NextResponse.json({ received: true });
  }

  // Update order
  await serviceSupabase
    .from("orders")
    .update({
      status: "SUCCESS",
      payment_time: new Date().toISOString(),
      webhook_payload: payload,
    })
    .eq("cashfree_order_id", orderId);

  // Create enrollment
  await serviceSupabase.from("enrollments").upsert(
    {
      user_id: order.user_id,
      product_id: order.product_id,
      order_id: order.id,
      is_active: true,
    },
    { onConflict: "user_id,product_id" }
  );

  // Career audit row
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

  // Promo usage
  if (order.promo_code) {
    await serviceSupabase.rpc("increment_promo_usage", {
      promo_code_value: order.promo_code,
    });
  }

  // Send email
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

  return NextResponse.json({ received: true });
}
