import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendCallConfirmedEmail } from "@/lib/email";
import type { MentorCallStatus } from "@/lib/supabase/types";

export async function PUT(
  req: Request,
  { params }: { params: { auditId: string } }
) {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { action, confirmedSlot, meetingLink, adminNotes } = await req.json();

  if (action !== "confirm" && action !== "complete") {
    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  }

  if (action === "confirm") {
    if (!confirmedSlot || !meetingLink) {
      return NextResponse.json(
        { error: "confirmedSlot and meetingLink are required to confirm a call." },
        { status: 400 }
      );
    }
    if (isNaN(new Date(confirmedSlot).getTime())) {
      return NextResponse.json({ error: "Invalid confirmedSlot date." }, { status: 400 });
    }
  }

  // Fetch the call request for this audit
  const { data: callRequest } = await serviceSupabase
    .from("mentor_call_requests")
    .select("id, user_id, status")
    .eq("audit_id", params.auditId)
    .single();

  if (!callRequest) {
    return NextResponse.json({ error: "No call request found for this audit." }, { status: 404 });
  }

  const updatePayload: {
    status: MentorCallStatus;
    confirmed_slot?: string;
    meeting_link?: string;
    admin_notes?: string;
  } =
    action === "confirm"
      ? {
          status: "confirmed" as MentorCallStatus,
          confirmed_slot: confirmedSlot,
          meeting_link: meetingLink,
          ...(adminNotes !== undefined && { admin_notes: adminNotes }),
        }
      : { status: "completed" as MentorCallStatus };

  const { error } = await serviceSupabase
    .from("mentor_call_requests")
    .update(updatePayload)
    .eq("audit_id", params.auditId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send confirmation email to user when admin confirms
  if (action === "confirm") {
    const { data: authUser } = await serviceSupabase.auth.admin.getUserById(
      callRequest.user_id
    );
    const { data: userProfile } = await serviceSupabase
      .from("profiles")
      .select("name")
      .eq("id", callRequest.user_id)
      .single();

    if (authUser?.user?.email) {
      await sendCallConfirmedEmail({
        to: authUser.user.email,
        name: userProfile?.name ?? "there",
        confirmedSlot,
        meetingLink,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ success: true });
}
