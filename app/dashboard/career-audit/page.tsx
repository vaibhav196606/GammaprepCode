import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
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

  const serviceSupabase = createServiceClient();
  const [{ data: callRequest }, { data: interviewSprintProduct }] = await Promise.all([
    audit
      ? supabase
          .from("mentor_call_requests")
          .select("id, preferred_slots, status, confirmed_slot, meeting_link, created_at")
          .eq("audit_id", audit.id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    serviceSupabase
      .from("products")
      .select("price_inr")
      .eq("slug", "interview_sprint")
      .eq("is_active", true)
      .single(),
  ]);

  return (
    <CareerAuditDashboard
      audit={audit}
      enrollmentId={enrollment.id}
      onboarding={onboarding}
      callRequest={callRequest ?? null}
      interviewSprintPrice={interviewSprintProduct?.price_inr ?? 9999}
    />
  );
}
