import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, DollarSign, FileSearch, Users } from "lucide-react";

export default async function AdminPage() {
  const supabase = createClient();

  // Stats queries in parallel
  const [
    { count: totalUsers },
    { data: enrollmentsByProduct },
    { data: revenueByProduct },
    { data: pendingAudits },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("enrollments")
      .select("products(name, slug)", { count: "exact" })
      .eq("is_active", true),
    supabase
      .from("orders")
      .select("amount_inr, products(name, slug)")
      .eq("status", "SUCCESS"),
    supabase
      .from("career_audits")
      .select("id, submitted_at, submission_status, profiles(name)")
      .in("submission_status", ["submitted", "under_review"])
      .order("submitted_at", { ascending: true })
      .limit(5),
  ]);

  // Process revenue
  const revenueMap: Record<string, { name: string; total: number; count: number }> = {};
  (revenueByProduct ?? []).forEach((order) => {
    const p = order.products as { name: string; slug: string } | null;
    if (!p) return;
    if (!revenueMap[p.slug]) revenueMap[p.slug] = { name: p.name, total: 0, count: 0 };
    revenueMap[p.slug].total += order.amount_inr;
    revenueMap[p.slug].count += 1;
  });

  // Process enrollments
  const enrollMap: Record<string, { name: string; count: number }> = {};
  (enrollmentsByProduct ?? []).forEach((e) => {
    const p = e.products as { name: string; slug: string } | null;
    if (!p) return;
    if (!enrollMap[p.slug]) enrollMap[p.slug] = { name: p.name, count: 0 };
    enrollMap[p.slug].count += 1;
  });

  const totalRevenue = Object.values(revenueMap).reduce((a, b) => a + b.total, 0);

  const now = new Date();
  const overdueSlaCount = (pendingAudits ?? []).filter((a) => {
    if (!a.submitted_at) return false;
    const submitted = new Date(a.submitted_at);
    return (now.getTime() - submitted.getTime()) > 48 * 60 * 60 * 1000;
  }).length;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-muted-foreground mt-1">
          Platform summary and key metrics.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{totalUsers ?? 0}</div>
                <div className="text-xs text-muted-foreground">Total users</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {formatCurrency(totalRevenue)}
                </div>
                <div className="text-xs text-muted-foreground">Total revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100">
                <FileSearch className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {(pendingAudits ?? []).length}
                </div>
                <div className="text-xs text-muted-foreground">Pending audits</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {overdueSlaCount > 0 && (
          <Card className="border-red-200">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {overdueSlaCount}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Overdue (48h SLA)
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Revenue by product */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["career_audit", "interview_sprint", "placement_mentorship"].map(
                (slug) => {
                  const data = revenueMap[slug];
                  return (
                    <div key={slug} className="flex items-center gap-3">
                      <div className="flex-1 text-sm">
                        {data?.name ??
                          slug.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                      </div>
                      <div className="text-sm font-semibold">
                        {formatCurrency(data?.total ?? 0)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {data?.count ?? 0} sales
                      </Badge>
                    </div>
                  );
                }
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pending audits */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Pending Audits</CardTitle>
              <Link
                href="/admin/career-audits"
                className="text-xs text-primary hover:underline"
              >
                View all →
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {!pendingAudits || pendingAudits.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No pending audits. All caught up!
              </div>
            ) : (
              <div className="space-y-2">
                {pendingAudits.map((audit) => {
                  const isOverdue =
                    audit.submitted_at &&
                    now.getTime() - new Date(audit.submitted_at).getTime() >
                      48 * 60 * 60 * 1000;
                  const profile = audit.profiles as { name: string } | null;
                  return (
                    <Link
                      key={audit.id}
                      href={`/admin/career-audits/${audit.id}`}
                      className="flex items-center gap-2 p-2 rounded hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex-1 text-sm font-medium">
                        {profile?.name ?? "Unknown"}
                      </div>
                      <Badge
                        variant={isOverdue ? "destructive" : "warning"}
                        className="text-xs"
                      >
                        {isOverdue ? "Overdue" : "Pending"}
                      </Badge>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
