import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  MessageSquare,
  Trophy,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { ApplicationStatus } from "@/lib/supabase/types";

const STATUS_COLORS: Record<ApplicationStatus, string> = {
  applied: "secondary",
  oa: "default",
  interview: "warning",
  offer: "success",
  rejected: "destructive",
};

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  applied: "Applied",
  oa: "OA",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

export default async function PlacementMentorshipDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, enrolled_at, products(slug)")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .filter("products.slug", "eq", "placement_mentorship")
    .single();

  if (!enrollment) redirect("/products/placement-mentorship");

  const { data: currentWeek } = await supabase
    .from("mentorship_weeks")
    .select("*")
    .eq("enrollment_id", enrollment.id)
    .order("week_number", { ascending: false })
    .limit(1)
    .single();

  const { data: applications } = await supabase
    .from("job_applications")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-600" />
          Placement Mentorship
        </h1>
        <p className="text-muted-foreground mt-1">
          Full 1:1 support • Enrolled {formatDate(enrollment.enrolled_at)}
        </p>
      </div>

      {/* This Week */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            This Week
            {currentWeek && (
              <Badge variant="secondary">Week {currentWeek.week_number}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!currentWeek ? (
            <div className="text-sm text-muted-foreground">
              Your mentor will set up your first weekly session soon. Check your
              email for scheduling instructions.
            </div>
          ) : (
            <div className="space-y-4">
              {currentWeek.call_scheduled && (
                <div className="flex items-center gap-2 p-3 bg-muted/40 rounded-lg">
                  <CalendarDays className="h-4 w-4 text-amber-600" />
                  <div>
                    <div className="text-sm font-medium">
                      Weekly call scheduled
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(currentWeek.call_scheduled)}
                    </div>
                  </div>
                </div>
              )}

              {currentWeek.goals && currentWeek.goals.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">
                    This week&apos;s goals
                  </div>
                  <div className="space-y-2">
                    {currentWeek.goals.map((goal: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded ${
                            currentWeek.goals_met?.[i]
                              ? "bg-green-100"
                              : "border"
                          }`}
                        >
                          {currentWeek.goals_met?.[i] && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          )}
                        </div>
                        <span className="text-sm">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentWeek.call_notes && (
                <div className="text-sm text-muted-foreground border-t pt-3">
                  <strong>Last call notes:</strong> {currentWeek.call_notes}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Tracker */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <BriefcaseBusiness className="h-4 w-4" />
              Job Tracker
            </CardTitle>
            <Link href="/dashboard/placement-mentorship/add-application">
              <Button size="sm" variant="outline">
                <ArrowRight className="h-3.5 w-3.5" />
                Add Application
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {!applications || applications.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <BriefcaseBusiness className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                No applications tracked yet. Start applying!
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{app.company}</div>
                    <div className="text-xs text-muted-foreground">
                      {app.role} •{" "}
                      {app.applied_at ? formatDate(app.applied_at) : "-"}
                    </div>
                  </div>
                  <Badge
                    variant={
                      (STATUS_COLORS[app.status as ApplicationStatus] ??
                        "secondary") as "default" | "secondary" | "outline" | "destructive"
                    }
                    className="text-xs"
                  >
                    {STATUS_LABELS[app.status as ApplicationStatus] ?? app.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="bg-muted/20">
        <CardContent className="p-5">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-muted-foreground" />
            <div className="flex-1">
              <div className="font-medium text-sm">Need help?</div>
              <div className="text-xs text-muted-foreground">
                Reach your mentor directly on WhatsApp.
              </div>
            </div>
            <a
              href="https://wa.me/918890240404"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline">
                <ExternalLink className="h-3.5 w-3.5" />
                WhatsApp
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
