import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AuditDetailClient from "./AuditDetailClient";

export default async function AuditDetailPage({
  params,
}: {
  params: { auditId: string };
}) {
  const supabase = createClient();

  const { data: audit } = await supabase
    .from("career_audits")
    .select("*, profiles(name, phone), enrollments(id)")
    .eq("id", params.auditId)
    .single();

  if (!audit) notFound();

  // Get onboarding data
  const { data: onboarding } = await supabase
    .from("onboarding_responses")
    .select("current_role, current_company, target_companies, target_role, biggest_challenge")
    .eq("user_id", audit.user_id)
    .single();

  // Get auth email via user_id - need admin route
  const { data: authUser } = await supabase.auth.admin.getUserById(audit.user_id);

  // Get mentor call request if any
  const { data: callRequest } = await supabase
    .from("mentor_call_requests")
    .select("id, preferred_slots, status, confirmed_slot, meeting_link, admin_notes")
    .eq("audit_id", params.auditId)
    .maybeSingle();

  return (
    <AuditDetailClient
      audit={audit}
      profile={audit.profiles as { name: string; phone: string | null } | null}
      email={authUser?.user?.email ?? ""}
      onboarding={onboarding}
      callRequest={callRequest ?? null}
    />
  );
}
