import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { calculatePricing } from "@/lib/utils";
import { getCashfreeConfig } from "@/lib/cashfree";
import type { ProductSlug } from "@/lib/supabase/types";

async function cashfreeRequest(
  baseUrl: string,
  appId: string,
  secretKey: string,
  path: string,
  method: string,
  body?: Record<string, unknown>
) {
  const res = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      "x-api-version": "2023-08-01",
      "x-client-id": appId,
      "x-client-secret": secretKey,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
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

  const cfConfig = await getCashfreeConfig();

  const { productSlug, promoCode } = await req.json();

  if (!productSlug) {
    return NextResponse.json({ error: "Missing productSlug" }, { status: 400 });
  }

  // Get product
  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, name, price_inr, slug")
    .eq("slug", productSlug as ProductSlug)
    .eq("is_active", true)
    .single();

  if (productError || !product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  // Check for existing active enrollment for this product
  const { data: existingEnrollment } = await supabase
    .from("enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", product.id)
    .eq("is_active", true)
    .single();

  if (existingEnrollment) {
    return NextResponse.json(
      { error: "You are already enrolled in this product." },
      { status: 400 }
    );
  }

  // Validate promo code
  let discountPct = 0;
  if (promoCode) {
    const { data: promo } = await supabase
      .from("promo_codes")
      .select("*")
      .eq("code", promoCode.toUpperCase())
      .eq("is_active", true)
      .single();

    if (promo) {
      const now = new Date();
      const validFrom = new Date(promo.valid_from);
      const validUntil = promo.valid_until ? new Date(promo.valid_until) : null;

      const isExpired = validUntil && now > validUntil;
      const notStarted = now < validFrom;
      const maxUsed =
        promo.max_uses !== null && promo.used_count >= promo.max_uses;
      const wrongProduct =
        promo.product_id && promo.product_id !== product.id;

      if (!isExpired && !notStarted && !maxUsed && !wrongProduct) {
        discountPct = promo.discount_pct;
      }
    }
  }

  const { data: settingsRows } = await serviceSupabase
    .from("site_settings")
    .select("key, value");
  const siteSettings: Record<string, unknown> = {};
  (settingsRows ?? []).forEach((r) => { siteSettings[r.key] = r.value; });
  const showGst = (siteSettings.show_gst as boolean) ?? true;

  const pricing = calculatePricing(product.price_inr, discountPct, showGst);

  // Get profile for customer details
  const { data: profile } = await supabase
    .from("profiles")
    .select("name, phone")
    .eq("id", user.id)
    .single();

  const orderId = `GPREP_${Date.now()}_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  // Create Cashfree order
  const cfOrder = await cashfreeRequest(cfConfig.baseUrl, cfConfig.appId, cfConfig.secretKey, "/orders", "POST", {
    order_id: orderId,
    order_amount: pricing.totalAmount,
    order_currency: "INR",
    customer_details: {
      customer_id: user.id,
      customer_email: user.email,
      customer_name: profile?.name || "Customer",
      customer_phone: profile?.phone || "9999999999",
    },
    order_meta: {
      return_url: `${cfConfig.isTestMode ? process.env.NEXT_PUBLIC_APP_URL : (process.env.NEXT_PUBLIC_PROD_APP_URL || process.env.NEXT_PUBLIC_APP_URL)}/checkout/verify?order_id=${orderId}`,
    },
  });

  if (!cfOrder.payment_session_id) {
    console.error("Cashfree error:", cfOrder);
    return NextResponse.json(
      { error: "Payment initiation failed. Please try again." },
      { status: 500 }
    );
  }

  // Insert order into DB using service role (bypasses RLS)
  const { error: insertError } = await serviceSupabase.from("orders").insert({
    user_id: user.id,
    product_id: product.id,
    cashfree_order_id: orderId,
    payment_session_id: cfOrder.payment_session_id,
    amount_inr: pricing.totalAmount,
    base_amount: pricing.baseAmount,
    gst_amount: pricing.gstAmount,
    discount_amount: pricing.discountAmount,
    promo_code: promoCode ? promoCode.toUpperCase() : null,
    promo_discount_pct: discountPct,
    status: "PENDING",
  });

  if (insertError) {
    console.error("DB insert error:", insertError);
    return NextResponse.json(
      { error: "Order creation failed." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    paymentSessionId: cfOrder.payment_session_id,
    orderId,
    isTestMode: cfConfig.isTestMode,
  });
}
