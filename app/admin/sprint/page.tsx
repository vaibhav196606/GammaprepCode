import { createClient, createServiceClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SprintSessionManager from "./SprintSessionManager";

export default async function AdminSprintPage() {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

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

  const { data: sessions } = await serviceSupabase
    .from("sprint_sessions")
    .select("id, title, session_type, scheduled_at, meeting_link, recording_url, is_published")
    .order("scheduled_at", { ascending: false });

  const { data: attendanceCounts } = await serviceSupabase
    .from("sprint_session_attendance")
    .select("session_id")
    .eq("attended", true);

  const countMap: Record<string, number> = {};
  (attendanceCounts ?? []).forEach((a) => {
    countMap[a.session_id] = (countMap[a.session_id] ?? 0) + 1;
  });

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Video className="h-6 w-6" />
            Sprint Sessions
          </h1>
          <p className="text-muted-foreground mt-1">
            {sessions?.length ?? 0} sessions total
          </p>
        </div>
      </div>

      <SprintSessionManager sessions={sessions ?? []} attendanceCounts={countMap} />
    </div>
  );
}
