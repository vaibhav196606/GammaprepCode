import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import CheckoutClient from "./CheckoutClient";

type ProductParam = "career-audit" | "interview-sprint" | "placement-mentorship";

const SLUG_MAP: Record<ProductParam, string> = {
  "career-audit": "career_audit",
  "interview-sprint": "interview_sprint",
  "placement-mentorship": "placement_mentorship",
};

const PRODUCT_INFO: Record<
  ProductParam,
  { name: string; tagline: string; fallbackPrice: number }
> = {
  "career-audit": {
    name: "Career Audit",
    tagline: "Expert resume & LinkedIn review with gap analysis and action plan",
    fallbackPrice: 499,
  },
  "interview-sprint": {
    name: "Interview Sprint",
    tagline: "21-day structured interview prep with live sessions & mock interview",
    fallbackPrice: 9999,
  },
  "placement-mentorship": {
    name: "Placement Mentorship",
    tagline: "Full 1:1 support with weekly calls, mock interviews & job referrals",
    fallbackPrice: 29999,
  },
};

export function generateMetadata({
  params,
}: {
  params: { product: string };
}): Metadata {
  return {
    title: "Checkout",
    robots: { index: false, follow: false },
  };
}

export default async function CheckoutPage({
  params,
}: {
  params: { product: string };
}) {
  const product = params.product as ProductParam;
  if (!SLUG_MAP[product]) notFound();

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/checkout/${product}`);
  }

  // Check if already enrolled in this specific product
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("products(slug)")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const enrolledSlugs = (enrollments ?? []).map(
    (e) => (e.products as { slug: string } | null)?.slug ?? ""
  );

  if (enrolledSlugs.includes(SLUG_MAP[product])) {
    redirect("/dashboard");
  }

  const info = PRODUCT_INFO[product];
  const serviceSupabase = createServiceClient();

  const [{ data: profile }, { data: dbProduct }, { data: settingsRows }] =
    await Promise.all([
      supabase.from("profiles").select("name, phone").eq("id", user.id).single(),
      serviceSupabase
        .from("products")
        .select("price_inr")
        .eq("slug", SLUG_MAP[product])
        .eq("is_active", true)
        .single(),
      serviceSupabase.from("site_settings").select("key, value"),
    ]);

  const basePrice = dbProduct?.price_inr ?? info.fallbackPrice;

  const siteSettings: Record<string, unknown> = {};
  (settingsRows ?? []).forEach((r) => { siteSettings[r.key] = r.value; });
  const showGst = (siteSettings.show_gst as boolean) ?? true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/30 to-background py-16 px-4">
      <div className="container max-w-4xl">
        <CheckoutClient
          productSlug={product}
          productName={info.name}
          productTagline={info.tagline}
          basePrice={basePrice}
          showGst={showGst}
          userEmail={user.email ?? ""}
          userName={profile?.name ?? ""}
          userPhone={profile?.phone ?? ""}
        />
      </div>
    </div>
  );
}
