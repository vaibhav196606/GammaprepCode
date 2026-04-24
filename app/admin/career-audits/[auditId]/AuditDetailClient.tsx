"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  CalendarCheck,
  Download,
  ExternalLink,
  Loader2,
  Phone,
  Upload,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { AuditStatus, MentorCallStatus } from "@/lib/supabase/types";

interface CallRequestData {
  id: string;
  preferred_slots: string[];
  status: MentorCallStatus;
  confirmed_slot: string | null;
  meeting_link: string | null;
  admin_notes: string | null;
}

interface Props {
  audit: {
    id: string;
    user_id: string;
    submission_status: AuditStatus;
    resume_url: string | null;
    linkedin_url: string | null;
    report_url: string | null;
    submitted_at: string | null;
    report_uploaded_at: string | null;
    admin_notes: string | null;
  };
  profile: { name: string; phone: string | null } | null;
  email: string;
  onboarding: {
    current_role: string | null;
    current_company: string | null;
    target_companies: string[] | null;
    target_role: string | null;
    biggest_challenge: string | null;
  } | null;
  callRequest: CallRequestData | null;
}

const formatIST = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));

const CALL_STATUS_BADGE: Record<MentorCallStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-amber-100 text-amber-800 border-amber-200" },
  confirmed: { label: "Confirmed", className: "bg-green-100 text-green-800 border-green-200" },
  completed: { label: "Completed", className: "" },
};

const STATUS_OPTIONS: AuditStatus[] = [
  "submitted",
  "under_review",
  "report_ready",
];

const STATUS_LABELS: Record<AuditStatus, string> = {
  awaiting_submission: "Awaiting Submission",
  submitted: "Submitted",
  under_review: "Under Review",
  report_ready: "Report Ready",
};

export default function AuditDetailClient({ audit, profile, email, onboarding, callRequest: initialCallRequest }: Props) {
  const [status, setStatus] = useState<AuditStatus>(audit.submission_status);
  const [adminNotes, setAdminNotes] = useState(audit.admin_notes ?? "");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [callRequest, setCallRequest] = useState<CallRequestData | null>(initialCallRequest);
  const [confirmedSlot, setConfirmedSlot] = useState(initialCallRequest?.confirmed_slot?.slice(0, 16) ?? "");
  const [meetingLink, setMeetingLink] = useState(initialCallRequest?.meeting_link ?? "");
  const [callAdminNotes, setCallAdminNotes] = useState(initialCallRequest?.admin_notes ?? "");
  const [savingCall, setSavingCall] = useState(false);

  const handleCallAction = async (action: "confirm" | "complete") => {
    if (action === "confirm" && (!confirmedSlot || !meetingLink)) {
      toast.error("Please enter both a confirmed slot and a meeting link.");
      return;
    }
    setSavingCall(true);
    try {
      const res = await fetch(`/api/admin/career-audits/${audit.id}/call-request`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          confirmedSlot: confirmedSlot ? new Date(confirmedSlot).toISOString() : undefined,
          meetingLink: meetingLink || undefined,
          adminNotes: callAdminNotes || undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success(
        action === "confirm"
          ? "Call confirmed. Email sent to student."
          : "Call marked as completed."
      );
      setCallRequest((prev) =>
        prev
          ? {
              ...prev,
              status: action === "confirm" ? "confirmed" : "completed",
              confirmed_slot: confirmedSlot ? new Date(confirmedSlot).toISOString() : prev.confirmed_slot,
              meeting_link: meetingLink || prev.meeting_link,
            }
          : prev
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update call.");
    }
    setSavingCall(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("auditId", audit.id);
      formData.append("userId", audit.user_id);
      formData.append("status", status);
      formData.append("adminNotes", adminNotes);
      if (reportFile) formData.append("reportFile", reportFile);

      const res = await fetch(`/api/admin/career-audits/${audit.id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Audit updated successfully.");
      if (status === "report_ready" && reportFile) {
        toast.success("Report delivered. Email sent to student.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/career-audits">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">{profile?.name ?? "Unknown"}</h1>
          <div className="text-sm text-muted-foreground">{email}</div>
        </div>
        <Badge className="ml-auto">{STATUS_LABELS[status]}</Badge>
      </div>

      {/* Student context */}
      {onboarding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Student Context</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <div className="text-muted-foreground text-xs">Current role</div>
              <div>{onboarding.current_role ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Current company</div>
              <div>{onboarding.current_company ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Target role</div>
              <div>{onboarding.target_role ?? "-"}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs">Target companies</div>
              <div>
                {onboarding.target_companies?.join(", ") ?? "-"}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-muted-foreground text-xs">Biggest challenge</div>
              <div>
                {onboarding.biggest_challenge
                  ?.replace(/_/g, " ")
                  .replace(/\b\w/g, (c) => c.toUpperCase()) ?? "-"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submission details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Submission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {audit.submitted_at && (
            <div className="text-sm text-muted-foreground">
              Submitted: {formatDate(audit.submitted_at)}
            </div>
          )}

          {audit.resume_url ? (
            <a
              href={audit.resume_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Download Resume
              </Button>
            </a>
          ) : (
            <div className="text-sm text-muted-foreground">
              Resume not submitted yet.
            </div>
          )}

          {audit.linkedin_url && (
            <a
              href={audit.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
                View LinkedIn
              </Button>
            </a>
          )}
        </CardContent>
      </Card>

      {/* Mentor call request */}
      {callRequest && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Mentor Call Request
              </CardTitle>
              <Badge
                variant={callRequest.status === "completed" ? "secondary" : "outline"}
                className={CALL_STATUS_BADGE[callRequest.status].className}
              >
                {CALL_STATUS_BADGE[callRequest.status].label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Preferred slots from student
              </p>
              <div className="space-y-1">
                {callRequest.preferred_slots.map((slot, i) => (
                  <p key={i} className="text-sm">
                    {i + 1}. {formatIST(slot)} (IST)
                  </p>
                ))}
              </div>
            </div>

            {callRequest.status === "completed" ? (
              <div className="space-y-2 text-sm">
                {callRequest.confirmed_slot && (
                  <p><span className="text-muted-foreground">Confirmed time:</span> {formatIST(callRequest.confirmed_slot)} (IST)</p>
                )}
                {callRequest.meeting_link && (
                  <p>
                    <span className="text-muted-foreground">Meeting link:</span>{" "}
                    <a href={callRequest.meeting_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {callRequest.meeting_link}
                    </a>
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Confirmed slot</Label>
                  <Input
                    type="datetime-local"
                    value={confirmedSlot}
                    onChange={(e) => setConfirmedSlot(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meeting link (Google Meet / Zoom / Calendly)</Label>
                  <Input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Admin notes <span className="text-muted-foreground font-normal">(not visible to student)</span></Label>
                  <Textarea
                    value={callAdminNotes}
                    onChange={(e) => setCallAdminNotes(e.target.value)}
                    placeholder="Internal notes about this call..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-3">
                  {(callRequest.status === "pending" || callRequest.status === "confirmed") && (
                    <Button
                      onClick={() => handleCallAction("confirm")}
                      disabled={savingCall}
                      className="flex-1"
                    >
                      {savingCall ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
                      Confirm Call & Send Email
                    </Button>
                  )}
                  {callRequest.status === "confirmed" && (
                    <Button
                      variant="outline"
                      onClick={() => handleCallAction("complete")}
                      disabled={savingCall}
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Admin actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Admin Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Status</Label>
            <select
              className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              value={status}
              onChange={(e) => setStatus(e.target.value as AuditStatus)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>
              Upload Report PDF{" "}
              <span className="text-muted-foreground font-normal">(required to mark as Report Ready)</span>
            </Label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {reportFile ? (
                <div className="text-sm font-medium text-primary">
                  {reportFile.name}
                </div>
              ) : audit.report_url ? (
                <div className="text-sm text-muted-foreground">
                  Report already uploaded.{" "}
                  <a
                    href={audit.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View
                  </a>{" "}
                  or click to replace.
                </div>
              ) : (
                <div>
                  <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-sm">Click to upload report PDF</div>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setReportFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Internal notes (not visible to student)</Label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes..."
              rows={4}
            />
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
