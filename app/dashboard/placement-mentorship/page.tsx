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
  Clock,
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

  if (!user) redirect("/login");

  const [{ data: enrollment }, { data: application }] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id, enrolled_at, products(slug)")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .filter("products.slug", "eq", "placement_mentorship")
      .maybeSingle(),
    supabase
      .from("mentorship_applications")
      .select("status, submitted_at, target_role")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  // Not enrolled — show invite-only state based on application status
  if (!enrollment) {
    if (application?.status === "pending") {
      const submittedAt = application.submitted_at ? new Date(application.submitted_at) : new Date();
      const replyBy = new Date(submittedAt);
      replyBy.setDate(replyBy.getDate() + 5);
      const replyByStr = replyBy.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

      return (
        <div className="max-w-lg space-y-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-600" />
            <h1 className="text-2xl font-bold">Placement Mentorship</h1>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">Invite Only</Badge>
          </div>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <Clock className="h-10 w-10 text-amber-500" />
              <div>
                <div className="font-semibold text-lg mb-1">Application under review</div>
                <p className="text-muted-foreground text-sm">
                  Your application for <strong>{application.target_role}</strong> is being reviewed.
                  You&apos;ll hear from us by <strong>{replyByStr}</strong>.
                </p>
              </div>
              <a href="https://wa.me/918890240404" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">Any questions? WhatsApp us</Button>
              </a>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (application?.status === "invited") {
      return (
        <div className="max-w-lg space-y-6">
          <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-amber-600" />
            <h1 className="text-2xl font-bold">Placement Mentorship</h1>
            <Badge className="bg-amber-100 text-amber-800 border-amber-200">Invite Only</Badge>
          </div>
          <Card className="border-green-200">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <div className="text-4xl">🎉</div>
              <div>
                <div className="font-semibold text-lg mb-1">You&apos;re invited!</div>
                <p className="text-muted-foreground text-sm">
                  We&apos;ve reviewed your application and would love to have you. Complete enrollment to lock in your spot.
                </p>
              </div>
              <Link href="/checkout/placement-mentorship">
                <Button size="lg" className="shadow-lg shadow-primary/20">
                  Complete Enrollment
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      );
    }

    // No application or rejected
    return (
      <div className="max-w-lg space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-amber-600" />
          <h1 className="text-2xl font-bold">Placement Mentorship</h1>
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">Invite Only</Badge>
        </div>
        <Card>
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">
              Full 1:1 support until you get the offer — weekly calls, mock interviews, referrals, and complete profile rebuild.
              This program is invite-only to keep quality high.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Complete profile rebuild</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Weekly live mentoring calls</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> 2–3 mock interviews with detailed feedback</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" /> Job referrals &amp; cold outreach templates</li>
            </ul>
            {application?.status === "rejected" && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded px-3 py-2">
                Your previous application wasn&apos;t selected. You can re-apply after 90 days.
              </p>
            )}
            <Link href="/apply/placement-mentorship" className="block">
              <Button className="w-full" size="lg">
                Request Invite
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground text-center">
              5-min application · Hear back in 3 business days
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
