import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { sendAuditReportEmail } from "@/lib/email";
import type { AuditStatus } from "@/lib/supabase/types";

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

  const formData = await req.formData();
  const status = formData.get("status") as AuditStatus;
  const adminNotes = formData.get("adminNotes") as string;
  const userId = formData.get("userId") as string;
  const reportFile = formData.get("reportFile") as File | null;

  // Fetch current state to detect status transition and get existing report_url
  const { data: currentAudit } = await serviceSupabase
    .from("career_audits")
    .select("submission_status, report_url")
    .eq("id", params.auditId)
    .single();

  const updatePayload: Record<string, unknown> = {
    submission_status: status,
    admin_notes: adminNotes,
  };

  // Upload report if provided
  if (reportFile && reportFile.size > 0) {
    const buffer = await reportFile.arrayBuffer();
    const fileName = `audit-reports/${userId}/${params.auditId}/report.pdf`;

    const { error: uploadError } = await serviceSupabase.storage
      .from("audit-reports")
      .upload(fileName, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: "Failed to upload report." },
        { status: 500 }
      );
    }

    const { data: urlData } = serviceSupabase.storage
      .from("audit-reports")
      .getPublicUrl(fileName);

    updatePayload.report_url = urlData.publicUrl;
    updatePayload.report_uploaded_at = new Date().toISOString();
  }

  if (status === "report_ready") {
    updatePayload.report_uploaded_at =
      updatePayload.report_uploaded_at ?? new Date().toISOString();
  }

  // Update audit record
  const { error: updateError } = await serviceSupabase
    .from("career_audits")
    .update(updatePayload)
    .eq("id", params.auditId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // Send email only when transitioning TO report_ready (prevents duplicate emails)
  const isTransitioningToReady =
    status === "report_ready" && currentAudit?.submission_status !== "report_ready";
  const reportUrl =
    (updatePayload.report_url as string | undefined) ?? currentAudit?.report_url ?? null;

  if (isTransitioningToReady && reportUrl) {
    const { data: authUser } = await serviceSupabase.auth.admin.getUserById(userId);
    const { data: userProfile } = await serviceSupabase
      .from("profiles")
      .select("name")
      .eq("id", userId)
      .single();

    if (authUser?.user?.email) {
      await sendAuditReportEmail({
        to: authUser.user.email,
        name: userProfile?.name ?? "there",
        reportUrl,
      }).catch(console.error);
    }
  }

  return NextResponse.json({ success: true });
}
