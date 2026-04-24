import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HelpCircle } from "lucide-react";
import FaqsManager from "./FaqsManager";

export default async function AdminFaqsPage() {
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

  const { data: faqs } = await serviceSupabase
    .from("faqs")
    .select("id, question, answer, product_id, sort_order, products(slug, name)")
    .order("sort_order", { ascending: true });

  const { data: products } = await serviceSupabase
    .from("products")
    .select("id, slug, name")
    .eq("is_active", true);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <HelpCircle className="h-6 w-6" />
          FAQs
        </h1>
        <p className="text-muted-foreground mt-1">{faqs?.length ?? 0} questions</p>
      </div>

      <FaqsManager faqs={faqs ?? []} products={products ?? []} />
    </div>
  );
}
