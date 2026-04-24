import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { ClipboardList, Paperclip } from "lucide-react";
import type { MentorshipApplicationStatus } from "@/lib/supabase/types";

const COLUMNS: { status: MentorshipApplicationStatus; label: string }[] = [
  { status: "pending", label: "Pending Review" },
  { status: "invited", label: "Invited" },
  { status: "enrolled", label: "Enrolled" },
];

const STATUS_BADGE: Record<MentorshipApplicationStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  invited: "bg-blue-100 text-blue-800 border-blue-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  enrolled: "bg-green-100 text-green-800 border-green-200",
};

export default async function AdminMentorshipApplicationsPage() {
  const supabase = createClient();

  const { data: applications } = await supabase
    .from("mentorship_applications")
    .select("id, full_name, target_role, years_experience, timeline, submitted_at, status, resume_url")
    .in("status", ["pending", "invited", "enrolled"])
    .order("submitted_at", { ascending: true });

  const { data: rejectedApps } = await supabase
    .from("mentorship_applications")
    .select("id, full_name, target_role, submitted_at, rejected_at")
    .eq("status", "rejected")
    .order("rejected_at", { ascending: false })
    .limit(20);

  const now = new Date();

  const byStatus = (status: MentorshipApplicationStatus) =>
    (applications ?? []).filter((a) => a.status === status);

  const getSlaVariant = (submittedAt: string) => {
    const days = (now.getTime() - new Date(submittedAt).getTime()) / (1000 * 60 * 60 * 24);
    if (days > 3) return "destructive" as const;
    if (days > 2) return "warning" as const;
    return "success" as const;
  };

  const timelineLabels: Record<string, string> = {
    immediate: "Immediate",
    "1_to_3_months": "1–3 mo",
    "3_to_6_months": "3–6 mo",
    exploring: "Exploring",
  };

  const pendingCount = byStatus("pending").length;

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ClipboardList className="h-6 w-6" />
          Mentorship Applications
        </h1>
        <p className="text-muted-foreground mt-1">
          Review applications for Placement Mentorship. SLA: respond within 3 days.
          {pendingCount > 0 && (
            <span className="ml-2 bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full">
              {pendingCount} pending
            </span>
          )}
        </p>
      </div>

      {/* Kanban */}
      <div className="grid md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const colApps = byStatus(col.status);
          return (
            <div key={col.status}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm">{col.label}</h2>
                <Badge variant="secondary">{colApps.length}</Badge>
              </div>
              <div className="space-y-3">
                {colApps.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
                    No applications
                  </div>
                ) : (
                  colApps.map((app) => {
                    const slaVariant = col.status === "pending" ? getSlaVariant(app.submitted_at) : null;
                    return (
                      <Link key={app.id} href={`/admin/mentorship-applications/${app.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4 space-y-1.5">
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-semibold text-sm">{app.full_name}</div>
                              {app.resume_url && (
                                <Paperclip className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">{app.target_role}</div>
                            <div className="text-xs text-muted-foreground">
                              {app.years_experience} yrs · {timelineLabels[app.timeline] ?? app.timeline}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Applied: {formatDate(app.submitted_at)}
                            </div>
                            {slaVariant && (
                              <Badge variant={slaVariant} className="text-xs">
                                {slaVariant === "destructive" ? "Overdue" : slaVariant === "warning" ? ">2 days" : "On time"}
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rejected (collapsed list) */}
      {(rejectedApps ?? []).length > 0 && (
        <div>
          <h2 className="font-semibold text-sm mb-3 text-muted-foreground">Recently Rejected</h2>
          <div className="space-y-2">
            {(rejectedApps ?? []).map((app) => (
              <Link key={app.id} href={`/admin/mentorship-applications/${app.id}`}>
                <Card className="hover:shadow-sm transition-shadow cursor-pointer opacity-70 hover:opacity-100">
                  <CardContent className="p-3 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-sm font-medium">{app.full_name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{app.target_role}</span>
                    </div>
                    <Badge variant="outline" className={STATUS_BADGE.rejected}>Rejected</Badge>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
