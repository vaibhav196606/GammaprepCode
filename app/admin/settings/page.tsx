import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Settings } from "lucide-react";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
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

  // Fetch all site settings
  const { data: settingsRows } = await serviceSupabase
    .from("site_settings")
    .select("key, value");

  const settings: Record<string, unknown> = {};
  (settingsRows ?? []).forEach((r) => {
    settings[r.key] = r.value;
  });

  // Fetch products for price editing
  const { data: products } = await serviceSupabase
    .from("products")
    .select("id, slug, name, price_inr, original_price, is_active")
    .order("price_inr", { ascending: true });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Site-wide configuration and product pricing
        </p>
      </div>

      <SettingsClient settings={settings} products={products ?? []} />
    </div>
  );
}
