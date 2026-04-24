import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code, productSlug } = await req.json();

  if (!code) {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const { data: promo } = await supabase
    .from("promo_codes")
    .select("*, products(slug)")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (!promo) {
    return NextResponse.json(
      { error: "Invalid or expired promo code." },
      { status: 400 }
    );
  }

  const now = new Date();
  const validFrom = new Date(promo.valid_from);
  const validUntil = promo.valid_until ? new Date(promo.valid_until) : null;

  if (now < validFrom) {
    return NextResponse.json(
      { error: "This promo code is not yet active." },
      { status: 400 }
    );
  }
  if (validUntil && now > validUntil) {
    return NextResponse.json(
      { error: "This promo code has expired." },
      { status: 400 }
    );
  }
  if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
    return NextResponse.json(
      { error: "This promo code has reached its usage limit." },
      { status: 400 }
    );
  }

  // Check product restriction
  if (promo.product_id && productSlug) {
    const slug = productSlug.replace(/-/g, "_");
    const promoProduct = promo.products as { slug: string } | null;
    if (promoProduct && promoProduct.slug !== slug) {
      return NextResponse.json(
        { error: "This promo code is not valid for this product." },
        { status: 400 }
      );
    }
  }

  return NextResponse.json({
    valid: true,
    discountPct: promo.discount_pct,
    description: promo.description,
  });
}
