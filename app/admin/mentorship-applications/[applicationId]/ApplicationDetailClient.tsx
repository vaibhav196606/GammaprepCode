"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft, Download, ExternalLink, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { MentorshipApplicationStatus } from "@/lib/supabase/types";

type Application = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  current_role: string;
  current_company: string | null;
  years_experience: number;
  target_role: string;
  timeline: string;
  goals: string;
  motivation: string;
  linkedin_url: string | null;
  github_url: string | null;
  portfolio_url: string | null;
  resume_url: string | null;
  target_companies: string | null;
  heard_from: string | null;
  status: MentorshipApplicationStatus;
  admin_notes: string | null;
  submitted_at: string;
};

const STATUS_OPTIONS: MentorshipApplicationStatus[] = ["pending", "invited", "rejected", "enrolled"];
const STATUS_LABELS: Record<MentorshipApplicationStatus, string> = {
  pending: "Pending",
  invited: "Invited",
  rejected: "Rejected",
  enrolled: "Enrolled",
};
const STATUS_BADGE: Record<MentorshipApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  invited: "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
  enrolled: "bg-green-100 text-green-800",
};

const TIMELINE_LABELS: Record<string, string> = {
  immediate: "Immediately",
  "1_to_3_months": "1–3 months",
  "3_to_6_months": "3–6 months",
  exploring: "Just exploring",
};

export default function ApplicationDetailClient({ application }: { application: Application }) {
  const [status, setStatus] = useState<MentorshipApplicationStatus>(application.status);
  const [adminNotes, setAdminNotes] = useState(application.admin_notes ?? "");
  const [saving, setSaving] = useState(false);

  const handleAction = async (newStatus: "invited" | "rejected") => {
    const action = newStatus === "invited" ? "invite" : "reject";
    const confirmed = window.confirm(
      newStatus === "invited"
        ? `Invite ${application.full_name}? This will send them an invite email with a checkout link.`
        : `Reject ${application.full_name}? This will send them a polite rejection email.`
    );
    if (!confirmed) return;
    await save(newStatus);
  };

  const save = async (overrideStatus?: MentorshipApplicationStatus) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/mentorship-applications/${application.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: overrideStatus ?? status,
          adminNotes,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      if (overrideStatus) setStatus(overrideStatus);
      toast.success(
        overrideStatus === "invited"
          ? "Application approved. Invite email sent."
          : overrideStatus === "rejected"
          ? "Application rejected. Email sent."
          : "Application updated."
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <Link href="/admin/mentorship-applications">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold">{application.full_name}</h1>
          <div className="text-sm text-muted-foreground">{application.email}</div>
        </div>
        <Badge className={`ml-auto ${STATUS_BADGE[status]}`}>{STATUS_LABELS[status]}</Badge>
      </div>

      {/* Application details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Application Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <div className="text-muted-foreground text-xs">Current role</div>
            <div>{application.current_role}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Current company</div>
            <div>{application.current_company ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Years of experience</div>
            <div>{application.years_experience}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Timeline</div>
            <div>{TIMELINE_LABELS[application.timeline] ?? application.timeline}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Target role</div>
            <div>{application.target_role}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Target companies</div>
            <div>{application.target_companies ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Phone</div>
            <div>{application.phone ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Heard from</div>
            <div>{application.heard_from ?? "—"}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-xs">Submitted</div>
            <div>{formatDate(application.submitted_at)}</div>
          </div>
        </CardContent>
      </Card>

      {/* Written answers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Written Answers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div>
            <div className="text-muted-foreground text-xs mb-1">What they hope to achieve</div>
            <p className="leading-relaxed whitespace-pre-wrap">{application.goals}</p>
          </div>
          <div>
            <div className="text-muted-foreground text-xs mb-1">Why this program, why now</div>
            <p className="leading-relaxed whitespace-pre-wrap">{application.motivation}</p>
          </div>
        </CardContent>
      </Card>

      {/* Links & resume */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Links & Documents</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {application.resume_url && (
            <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
                Resume
              </Button>
            </a>
          )}
          {application.linkedin_url && (
            <a href={application.linkedin_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
                LinkedIn
              </Button>
            </a>
          )}
          {application.github_url && (
            <a href={application.github_url} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4" />
                GitHub / Portfolio
              </Button>
            </a>
          )}
          {!application.resume_url && !application.linkedin_url && !application.github_url && (
            <p className="text-sm text-muted-foreground">No links provided.</p>
          )}
        </CardContent>
      </Card>

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
              onChange={(e) => setStatus(e.target.value as MentorshipApplicationStatus)}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>
              Admin notes{" "}
              <span className="text-muted-foreground font-normal">(included in rejection email if provided)</span>
            </Label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes or feedback for rejection email..."
              rows={4}
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => handleAction("invited")}
              disabled={saving || status === "invited" || status === "enrolled"}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Invite"}
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleAction("rejected")}
              disabled={saving || status === "rejected"}
              className="flex-1"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={() => save()}
            disabled={saving}
            className="w-full"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Notes / Status"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
