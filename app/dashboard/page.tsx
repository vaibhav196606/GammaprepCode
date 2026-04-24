import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  FileSearch,
  Rocket,
  Trophy,
} from "lucide-react";

const PRODUCT_INFO = [
  {
    slug: "career_audit",
    name: "Career Audit",
    icon: FileSearch,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    dashboardHref: "/dashboard/career-audit",
    productHref: "/products/career-audit",
    fallbackPrice: 499,
    tagline: "Resume & LinkedIn expert review",
  },
  {
    slug: "interview_sprint",
    name: "Interview Sprint",
    icon: Rocket,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    dashboardHref: "/dashboard/interview-sprint",
    productHref: "/products/interview-sprint",
    fallbackPrice: 9999,
    tagline: "21-day interview prep program",
  },
  {
    slug: "placement_mentorship",
    name: "Placement Mentorship",
    icon: Trophy,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    dashboardHref: "/dashboard/placement-mentorship",
    productHref: "/products/placement-mentorship",
    fallbackPrice: 14999,
    tagline: "Full 1:1 support until placed",
  },
];

export default async function DashboardPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("name")
    .eq("id", user!.id)
    .single();

  const [{ data: enrollments }, { data: dbProducts }, { data: settings }] = await Promise.all([
    supabase
      .from("enrollments")
      .select("id, products(slug, name)")
      .eq("user_id", user!.id)
      .eq("is_active", true),
    supabase
      .from("products")
      .select("slug, price_inr")
      .eq("is_active", true),
    supabase
      .from("site_settings")
      .select("key, value")
      .in("key", ["show_gst"]),
  ]);

  const mentorshipAppResult = await supabase
    .from("mentorship_applications")
    .select("status")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const mentorshipAppStatus = ((mentorshipAppResult.data as { status: string } | null)?.status ?? null) as import("@/lib/supabase/types").MentorshipApplicationStatus | null;

  const settingsMap = Object.fromEntries(
    (settings ?? []).map((s) => [s.key, s.value])
  );
  const showGst = (settingsMap.show_gst as boolean) ?? true;

  const priceMap = Object.fromEntries(
    (dbProducts ?? []).map((p) => [p.slug, p.price_inr])
  );

  const products = PRODUCT_INFO.map((p) => ({
    ...p,
    price: priceMap[p.slug] ?? p.fallbackPrice,
  }));

  const enrolledSlugs =
    enrollments?.map(
      (e) => (e.products as { slug: string } | null)?.slug ?? ""
    ) ?? [];

  const enrolled = products.filter((p) => enrolledSlugs.includes(p.slug));
  const notEnrolled = products.filter(
    (p) => !enrolledSlugs.includes(p.slug)
  );

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, {profile?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here&apos;s your career coaching dashboard.
        </p>
      </div>

      {/* Enrolled products */}
      {enrolled.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
            Your Products
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {enrolled.map((product) => {
              const Icon = product.icon;
              return (
                <Card
                  key={product.slug}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-lg ${product.iconBg} flex-shrink-0`}
                      >
                        <Icon className={`h-5 w-5 ${product.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-semibold text-sm">
                            {product.name}
                          </div>
                          <Badge variant="success" className="text-xs">
                            Active
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {product.tagline}
                        </div>
                      </div>
                    </div>
                    <Link href={product.dashboardHref} className="block mt-4">
                      <Button size="sm" variant="outline" className="w-full">
                        Open Dashboard
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Not enrolled - upsell */}
      {notEnrolled.length > 0 && (
        <div>
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
            {enrolled.length === 0 ? "Get Started" : "Upgrade Your Journey"}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {notEnrolled.map((product) => {
              const Icon = product.icon;
              const isMentorship = product.slug === "placement_mentorship";
              const appStatus = isMentorship ? mentorshipAppStatus : null;

              return (
                <Card
                  key={product.slug}
                  className="border-dashed hover:border-primary/50 transition-colors"
                >
                  <CardContent className="p-5">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${product.iconBg} mb-3`}
                    >
                      <Icon className={`h-5 w-5 ${product.iconColor} opacity-60`} />
                    </div>
                    <div className="font-semibold text-sm">{product.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5 mb-3">
                      {product.tagline}
                    </div>

                    {/* Application status chip */}
                    {appStatus === "pending" && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-2.5 py-1.5 mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                        Requested — under review
                      </div>
                    )}
                    {appStatus === "invited" && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-md px-2.5 py-1.5 mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                        Invited — complete enrollment
                      </div>
                    )}
                    {appStatus === "rejected" && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted border rounded-md px-2.5 py-1.5 mb-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                        Not selected — re-apply after 90 days
                      </div>
                    )}

                    {!isMentorship && (
                      <div className="font-bold mb-3">
                        ₹{product.price.toLocaleString("en-IN")}
                        {showGst && (
                          <span className="text-xs font-normal text-muted-foreground ml-1">
                            + GST
                          </span>
                        )}
                      </div>
                    )}
                    {isMentorship && !appStatus && (
                      <div className="text-xs text-amber-600 font-medium mb-3">
                        ₹{product.price.toLocaleString("en-IN")} — on approval
                      </div>
                    )}

                    {appStatus === "pending" ? (
                      <Link href="/dashboard/placement-mentorship">
                        <Button size="sm" variant="outline" className="w-full">
                          View Status
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : appStatus === "invited" ? (
                      <Link href="/checkout/placement-mentorship">
                        <Button size="sm" className="w-full">
                          Complete Enrollment
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : isMentorship ? (
                      <Link href="/apply/placement-mentorship">
                        <Button size="sm" variant="outline" className="w-full">
                          Request Invite
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    ) : (
                      <Link href={product.productHref}>
                        <Button size="sm" className="w-full">
                          Learn More
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
