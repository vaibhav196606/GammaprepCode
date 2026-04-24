import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendAdminAuditNotification } from "@/lib/email";

export async function POST(req: Request) {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { resumeUrl, linkedinUrl, enrollmentId } = await req.json();
  if (!resumeUrl || !linkedinUrl) {
    return NextResponse.json(
      { error: "Resume URL and LinkedIn URL are required." },
      { status: 400 }
    );
  }

  // Verify enrollment belongs to this user
  if (enrollmentId) {
    const { data: enrollment } = await serviceSupabase
      .from("enrollments")
      .select("id")
      .eq("id", enrollmentId)
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();
    if (!enrollment) {
      return NextResponse.json({ error: "Invalid enrollment." }, { status: 403 });
    }
  }

  // Check existing audit row
  const { data: existing } = await serviceSupabase
    .from("career_audits")
    .select("id, submission_status")
    .eq("user_id", user.id)
    .single();

  if (existing && existing.submission_status !== "awaiting_submission") {
    return NextResponse.json(
      { error: "Audit already submitted." },
      { status: 400 }
    );
  }

  let audit: { id: string } | null = null;

  if (existing) {
    // Row exists — update it
    const { data, error } = await serviceSupabase
      .from("career_audits")
      .update({
        resume_url: resumeUrl,
        linkedin_url: linkedinUrl,
        submission_status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select("id")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Update failed. Please try again." }, { status: 500 });
    }
    audit = data;
  } else if (enrollmentId) {
    // No row yet — create it (e.g. manual enrollment without payment webhook)
    const { data, error } = await serviceSupabase
      .from("career_audits")
      .insert({
        user_id: user.id,
        enrollment_id: enrollmentId,
        resume_url: resumeUrl,
        linkedin_url: linkedinUrl,
        submission_status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    if (error || !data) {
      return NextResponse.json({ error: "Could not create audit record." }, { status: 500 });
    }
    audit = data;
  } else {
    return NextResponse.json(
      { error: "No audit record found. Please contact support." },
      { status: 400 }
    );
  }

  // Notify admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user.id)
    .single();

  await sendAdminAuditNotification({
    userName: profile?.name ?? "Unknown",
    userEmail: user.email ?? "",
    auditId: audit.id,
  }).catch(console.error);

  return NextResponse.json({ success: true });
}
