import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  sendApplicationInviteEmail,
  sendApplicationRejectedEmail,
} from "@/lib/email";
import type { MentorshipApplicationStatus } from "@/lib/supabase/types";

const VALID_STATUSES: MentorshipApplicationStatus[] = ["pending", "invited", "rejected", "enrolled"];

export async function PUT(
  req: Request,
  { params }: { params: { applicationId: string } }
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { status, adminNotes } = await req.json();

  if (status && !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }

  const serviceSupabase = createServiceClient();

  // Fetch current application
  const { data: application } = await serviceSupabase
    .from("mentorship_applications")
    .select("*")
    .eq("id", params.applicationId)
    .single();

  if (!application) {
    return NextResponse.json({ error: "Application not found." }, { status: 404 });
  }

  const now = new Date().toISOString();
  const updatePayload: Record<string, unknown> = {
    admin_notes: adminNotes ?? application.admin_notes,
    reviewed_at: now,
  };

  if (status) {
    updatePayload.status = status;
    if (status === "invited") updatePayload.invited_at = now;
    if (status === "rejected") updatePayload.rejected_at = now;
    if (status === "enrolled") updatePayload.enrolled_at = now;
  }

  const { error: updateError } = await serviceSupabase
    .from("mentorship_applications")
    .update(updatePayload)
    .eq("id", params.applicationId);

  if (updateError) {
    console.error("Application update error:", updateError);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }

  // Send emails on status transitions
  if (status && status !== application.status) {
    if (status === "invited") {
      sendApplicationInviteEmail({
        to: application.email,
        name: application.full_name,
      }).catch(console.error);
    } else if (status === "rejected") {
      sendApplicationRejectedEmail({
        to: application.email,
        name: application.full_name,
        adminNotes: adminNotes || application.admin_notes,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ success: true });
}
