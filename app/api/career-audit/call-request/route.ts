import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendAdminCallRequestNotification } from "@/lib/email";

export async function POST(req: Request) {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { auditId, preferredSlots } = await req.json();

  if (!auditId || !Array.isArray(preferredSlots) || preferredSlots.length === 0) {
    return NextResponse.json(
      { error: "auditId and at least one preferredSlot are required." },
      { status: 400 }
    );
  }

  if (preferredSlots.length > 3) {
    return NextResponse.json(
      { error: "You can select a maximum of 3 preferred time slots." },
      { status: 400 }
    );
  }

  // Validate each slot is a parseable date string
  for (const slot of preferredSlots) {
    if (isNaN(new Date(slot).getTime())) {
      return NextResponse.json({ error: "Invalid date format in preferred slots." }, { status: 400 });
    }
  }

  // Verify the audit belongs to this user and the report is ready
  const { data: audit } = await serviceSupabase
    .from("career_audits")
    .select("id, submission_status")
    .eq("id", auditId)
    .eq("user_id", user.id)
    .single();

  if (!audit) {
    return NextResponse.json({ error: "Audit not found." }, { status: 404 });
  }

  if (audit.submission_status !== "report_ready") {
    return NextResponse.json(
      { error: "You can only schedule a call after your report is ready." },
      { status: 400 }
    );
  }

  // Upsert — insert or update preferred_slots if already submitted
  const { error } = await serviceSupabase
    .from("mentor_call_requests")
    .upsert(
      { user_id: user.id, audit_id: auditId, preferred_slots: preferredSlots },
      { onConflict: "audit_id" }
    );

  if (error) {
    return NextResponse.json({ error: "Could not save your request. Please try again." }, { status: 500 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  await sendAdminCallRequestNotification({
    userName: profile?.name ?? "Unknown",
    userEmail: user.email ?? "",
    auditId,
  }).catch(console.error);

  return NextResponse.json({ success: true });
}
