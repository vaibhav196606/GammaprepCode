import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Users } from "lucide-react";

export default async function AdminUsersPage() {
  const supabase = createClient();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, name, phone, is_admin, onboarding_done, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("user_id, products(slug)");

  const enrollMap: Record<string, string[]> = {};
  (enrollments ?? []).forEach((e) => {
    const slug = (e.products as { slug: string } | null)?.slug ?? "";
    if (!enrollMap[e.user_id]) enrollMap[e.user_id] = [];
    if (slug) enrollMap[e.user_id].push(slug);
  });

  const SLUG_LABELS: Record<string, string> = {
    career_audit: "Audit",
    interview_sprint: "Sprint",
    placement_mentorship: "Mentorship",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6" />
          Users
        </h1>
        <p className="text-muted-foreground mt-1">
          {profiles?.length ?? 0} total users
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-background">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-xs text-muted-foreground">
              <th className="px-4 py-3 text-left font-medium">Name</th>
              <th className="px-4 py-3 text-left font-medium">Phone</th>
              <th className="px-4 py-3 text-left font-medium">Enrolled in</th>
              <th className="px-4 py-3 text-left font-medium">Joined</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {(profiles ?? []).map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {p.phone ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(enrollMap[p.id] ?? []).length === 0 ? (
                      <span className="text-muted-foreground">None</span>
                    ) : (
                      (enrollMap[p.id] ?? []).map((slug) => (
                        <Badge key={slug} variant="secondary" className="text-xs">
                          {SLUG_LABELS[slug] ?? slug}
                        </Badge>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(p.created_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {p.is_admin && (
                      <Badge variant="default" className="text-xs">
                        Admin
                      </Badge>
                    )}
                    {!p.onboarding_done && (
                      <Badge variant="outline" className="text-xs">
                        No onboarding
                      </Badge>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
