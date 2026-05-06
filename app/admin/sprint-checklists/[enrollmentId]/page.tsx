import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import ChecklistEditor from "./ChecklistEditor";

export default async function AdminChecklistEditorPage({
  params,
}: {
  params: { enrollmentId: string };
}) {
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

  const { data: enrollment } = await serviceSupabase
    .from("enrollments")
    .select("id, user_id, created_at, profiles(name, phone)")
    .eq("id", params.enrollmentId)
    .single();

  if (!enrollment) notFound();

  const studentProfile = enrollment.profiles as
    | { name: string | null; phone: string | null }
    | null;

  const { data: items } = await serviceSupabase
    .from("sprint_checklist_items")
    .select(
      "id, day_number, title, description, sort_order, completed"
    )
    .eq("enrollment_id", enrollment.id)
    .order("day_number", { ascending: true })
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/sprint-checklists"
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to all students
        </Link>
        <h1 className="text-2xl font-bold mt-2">
          {studentProfile?.name ?? "Unnamed"}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {studentProfile?.phone ?? "no phone"} • enrolled{" "}
          {formatDate(enrollment.created_at)}
        </p>
      </div>

      <ChecklistEditor
        enrollmentId={enrollment.id}
        userId={enrollment.user_id}
        initialItems={items ?? []}
      />
    </div>
  );
}
