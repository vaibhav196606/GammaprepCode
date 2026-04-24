import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Tag } from "lucide-react";
import PromoCodesManager from "./PromoCodesManager";

export default async function AdminPromoCodesPage() {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/dashboard");

  const { data: promoCodes } = await serviceSupabase
    .from("promo_codes")
    .select("id, code, discount_pct, max_uses, used_count, is_active, valid_from, valid_until, product_id, products(slug, name)")
    .order("created_at", { ascending: false });

  const { data: products } = await serviceSupabase
    .from("products")
    .select("id, slug, name")
    .eq("is_active", true);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Tag className="h-6 w-6" />
          Promo Codes
        </h1>
        <p className="text-muted-foreground mt-1">
          {promoCodes?.length ?? 0} codes total
        </p>
      </div>

      <PromoCodesManager
        promoCodes={promoCodes ?? []}
        products={products ?? []}
      />
    </div>
  );
}
