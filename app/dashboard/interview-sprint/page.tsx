import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  Rocket,
  Trophy,
  Video,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function InterviewSprintDashboard() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, enrolled_at, products(slug)")
    .eq("user_id", user!.id)
    .eq("is_active", true)
    .filter("products.slug", "eq", "interview_sprint")
    .single();

  if (!enrollment) redirect("/products/interview-sprint");

  const { data: sessions } = await supabase
    .from("sprint_sessions")
    .select("*")
    .eq("is_published", true)
    .order("session_order", { ascending: true });

  const { data: attendance } = await supabase
    .from("sprint_session_attendance")
    .select("session_id, attended")
    .eq("user_id", user!.id);

  const attendedIds = new Set(
    (attendance ?? []).filter((a) => a.attended).map((a) => a.session_id)
  );
  const hasAttendedSession1 =
    sessions && sessions.length > 0
      ? attendedIds.has(sessions[0]?.id ?? "")
      : false;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Rocket className="h-6 w-6 text-violet-600" />
          Interview Sprint
        </h1>
        <p className="text-muted-foreground mt-1">
          21-day interview prep program • Enrolled{" "}
          {formatDate(enrollment.enrolled_at)}
        </p>
      </div>

      {/* Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            Your Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!sessions || sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                Session schedule will be published soon. Check back shortly.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session, i) => {
                const attended = attendedIds.has(session.id);
                const isPast = session.scheduled_at
                  ? new Date(session.scheduled_at) < new Date()
                  : false;

                return (
                  <div
                    key={session.id}
                    className="flex items-start gap-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold flex-shrink-0 ${
                        attended
                          ? "bg-green-100 text-green-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {attended ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-medium text-sm">{session.title}</div>
                        <Badge
                          variant={
                            session.session_type === "mock_interview"
                              ? "default"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {session.session_type === "mock_interview"
                            ? "Mock Interview"
                            : "Group Session"}
                        </Badge>
                        {attended && (
                          <Badge variant="success" className="text-xs">
                            Attended
                          </Badge>
                        )}
                      </div>
                      {session.scheduled_at && (
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {formatDate(session.scheduled_at)} •{" "}
                          {session.duration_minutes} mins
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {session.meeting_link && !isPast && (
                        <a
                          href={session.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline" className="gap-1">
                            <Video className="h-3.5 w-3.5" />
                            Join
                          </Button>
                        </a>
                      )}
                      {session.recording_url && (
                        <a
                          href={session.recording_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="ghost" className="gap-1">
                            <ExternalLink className="h-3.5 w-3.5" />
                            Recording
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Session materials and resources will appear here as the program
            progresses. Your mentor will share links during sessions.
          </div>
        </CardContent>
      </Card>

      {/* Upsell to Placement Mentorship - shown after Session 1 attended */}
      {hasAttendedSession1 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 flex-shrink-0">
                <Trophy className="h-5 w-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1">
                  Want 1:1 accountability and real referrals?
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Placement Mentorship adds weekly personal calls, 2 more mock
                  interviews, direct referral contacts, and full support until
                  you get placed.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/checkout/placement-mentorship">
                    <Button size="sm">
                      Get Placement Mentorship - ₹29,999
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                  <Link href="/products/placement-mentorship">
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
