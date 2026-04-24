import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { FileSearch } from "lucide-react";
import type { AuditStatus } from "@/lib/supabase/types";

const COLUMNS: { status: AuditStatus; label: string }[] = [
  { status: "submitted", label: "Submitted" },
  { status: "under_review", label: "Under Review" },
  { status: "report_ready", label: "Report Ready" },
];

export default async function AdminCareerAuditsPage() {
  const supabase = createClient();

  const { data: audits } = await supabase
    .from("career_audits")
    .select("*, profiles(name, phone)")
    .in("submission_status", ["submitted", "under_review", "report_ready"])
    .order("submitted_at", { ascending: true });

  const now = new Date();

  const byStatus = (status: AuditStatus) =>
    (audits ?? []).filter((a) => a.submission_status === status);

  const getSlaVariant = (submittedAt: string | null) => {
    if (!submittedAt) return "secondary" as const;
    const hours =
      (now.getTime() - new Date(submittedAt).getTime()) / (60 * 60 * 1000);
    if (hours > 48) return "destructive" as const;
    if (hours > 24) return "warning" as const;
    return "success" as const;
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileSearch className="h-6 w-6" />
          Career Audits
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and deliver audit reports. SLA: 48 hours from submission.
        </p>
      </div>

      {/* Kanban */}
      <div className="grid md:grid-cols-3 gap-6">
        {COLUMNS.map((col) => {
          const colAudits = byStatus(col.status);
          return (
            <div key={col.status}>
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-semibold text-sm">{col.label}</h2>
                <Badge variant="secondary">{colAudits.length}</Badge>
              </div>
              <div className="space-y-3">
                {colAudits.length === 0 ? (
                  <div className="text-sm text-muted-foreground text-center py-8 border border-dashed rounded-lg">
                    No audits
                  </div>
                ) : (
                  colAudits.map((audit) => {
                    const profile = audit.profiles as { name: string } | null;
                    const slaVariant = getSlaVariant(audit.submitted_at);
                    return (
                      <Link
                        key={audit.id}
                        href={`/admin/career-audits/${audit.id}`}
                      >
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="p-4 space-y-2">
                            <div className="font-semibold text-sm">
                              {profile?.name ?? "Unknown"}
                            </div>
                            {audit.submitted_at && (
                              <div className="text-xs text-muted-foreground">
                                Submitted: {formatDate(audit.submitted_at)}
                              </div>
                            )}
                            {audit.submitted_at && col.status !== "report_ready" && (
                              <Badge variant={slaVariant} className="text-xs">
                                {slaVariant === "destructive"
                                  ? "Overdue"
                                  : slaVariant === "warning"
                                  ? ">24h"
                                  : "On time"}
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
    </div>
  );
}
