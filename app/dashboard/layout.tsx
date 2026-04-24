import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardSidebar from "./DashboardSidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, is_admin, onboarding_done")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_done) redirect("/onboarding");

  // Get enrollments
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("id, products(slug, name)")
    .eq("user_id", user.id)
    .eq("is_active", true);

  const enrolledSlugs =
    enrollments?.map(
      (e) => (e.products as { slug: string } | null)?.slug ?? ""
    ) ?? [];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <DashboardSidebar
        name={profile?.name ?? ""}
        enrolledSlugs={enrolledSlugs}
        isAdmin={profile?.is_admin ?? false}
      />
      <main className="flex-1 p-6 md:p-8 overflow-auto bg-muted/20">
        {children}
      </main>
    </div>
  );
}
