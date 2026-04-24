import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CareerAuditDashboard from "./CareerAuditDashboard";

export default async function CareerAuditDashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, products(slug)")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .filter("products.slug", "eq", "career_audit")
    .single();

  if (!enrollment) redirect("/products/career-audit");

  // Get audit record
  const { data: audit } = await supabase
    .from("career_audits")
    .select("*")
    .eq("user_id", user!.id)
    .single();

  // Get onboarding answers to show in the submission step
  const { data: onboarding } = await supabase
    .from("onboarding_responses")
    .select("current_role, current_company, target_companies, target_role, biggest_challenge")
    .eq("user_id", user!.id)
    .single();

  // Get mentor call request if audit exists
  const { data: callRequest } = audit
    ? await supabase
        .from("mentor_call_requests")
        .select("id, preferred_slots, status, confirmed_slot, meeting_link, created_at")
        .eq("audit_id", audit.id)
        .maybeSingle()
    : { data: null };

  return (
    <CareerAuditDashboard
      audit={audit}
      enrollmentId={enrollment.id}
      onboarding={onboarding}
      callRequest={callRequest ?? null}
    />
  );
}
