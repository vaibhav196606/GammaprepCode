import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListChecks, ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

type EnrollmentRow = {
  id: string;
  user_id: string;
  enrolled_at: string;
  profiles: { name: string | null; phone: string | null } | null;
};

export default async function AdminSprintChecklistsPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) redirect("/dashboard");

  const serviceSupabase = createServiceClient();

  const { data: sprintProduct } = await serviceSupabase
    .from("products")
    .select("id")
    .eq("slug", "interview_sprint")
    .single();

  const enrollments = sprintProduct
    ? ((
        await serviceSupabase
          .from("enrollments")
          .select("id, user_id, enrolled_at, profiles(name, phone)")
          .eq("product_id", sprintProduct.id)
          .eq("is_active", true)
          .order("enrolled_at", { ascending: false })
      ).data as EnrollmentRow[] | null) ?? []
    : [];

  const enrollmentIds = enrollments.map((e) => e.id);
  const { data: items } = enrollmentIds.length
    ? await serviceSupabase
        .from("sprint_checklist_items")
        .select("enrollment_id, completed")
        .in("enrollment_id", enrollmentIds)
    : { data: [] as { enrollment_id: string; completed: boolean }[] };

  const counts: Record<string, { total: number; done: number }> = {};
  (items ?? []).forEach((it) => {
    const c = counts[it.enrollment_id] ?? { total: 0, done: 0 };
    c.total += 1;
    if (it.completed) c.done += 1;
    counts[it.enrollment_id] = c;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <ListChecks className="h-6 w-6" />
          Sprint Checklists
        </h1>
        <p className="text-muted-foreground mt-1">
          {enrollments.length} Sprint student
          {enrollments.length === 1 ? "" : "s"} • assign a 21-day plan to each
        </p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No active Interview Sprint enrollments yet.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {enrollments.map((e) => {
            const c = counts[e.id] ?? { total: 0, done: 0 };
            return (
              <Card key={e.id}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {e.profiles?.name ?? "Unnamed"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {e.profiles?.phone ?? "no phone"} • enrolled{" "}
                      {formatDate(e.enrolled_at)}
                    </div>
                  </div>
                  <Badge variant={c.total === 0 ? "outline" : "secondary"}>
                    {c.total === 0
                      ? "No plan yet"
                      : `${c.done} / ${c.total} done`}
                  </Badge>
                  <Link href={`/admin/sprint-checklists/${e.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      Edit plan
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
