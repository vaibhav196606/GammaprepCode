import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { BiggestChallenge, ProductSlug } from "@/lib/supabase/types";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    current_role,
    current_company,
    target_companies,
    target_role,
    biggest_challenge,
    recommended_product,
  }: {
    current_role: string;
    current_company: string;
    target_companies: string[];
    target_role: string;
    biggest_challenge: BiggestChallenge;
    recommended_product: ProductSlug;
  } = body;

  if (!biggest_challenge || !recommended_product) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Upsert onboarding response (idempotent)
  const { error: insertError } = await supabase
    .from("onboarding_responses")
    .upsert(
      {
        user_id: user.id,
        current_role,
        current_company,
        target_companies,
        target_role,
        biggest_challenge,
        recommended_product,
      },
      { onConflict: "user_id" }
    );

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  // Mark onboarding as done on the profile
  await supabase
    .from("profiles")
    .update({ onboarding_done: true })
    .eq("id", user.id);

  return NextResponse.json({ success: true, recommended_product });
}
