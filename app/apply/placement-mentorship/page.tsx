import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import ApplicationForm from "./ApplicationForm";
import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Apply — Placement Mentorship",
  robots: { index: false, follow: false },
};

export default async function ApplyPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/apply/placement-mentorship");
  }

  const serviceSupabase = createServiceClient();

  const [{ data: profile }, { data: onboarding }, { data: existingApp }] =
    await Promise.all([
      supabase.from("profiles").select("name, phone").eq("id", user.id).single(),
      supabase
        .from("onboarding_responses")
        .select("current_role, current_company, target_role, target_companies")
        .eq("user_id", user.id)
        .maybeSingle(),
      serviceSupabase
        .from("mentorship_applications")
        .select("id, status, submitted_at, target_role")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  // Already enrolled — redirect to dashboard
  if (existingApp?.status === "enrolled") {
    redirect("/dashboard/placement-mentorship");
  }

  // Invited — show invitation banner
  if (existingApp?.status === "invited") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background py-16 px-4">
        <div className="container max-w-lg text-center space-y-6">
          <div className="text-5xl">🎉</div>
          <h1 className="text-2xl font-bold">You&apos;re invited!</h1>
          <p className="text-muted-foreground">
            We&apos;ve reviewed your application and would love to have you in Placement Mentorship.
            Complete your enrollment to lock in your spot.
          </p>
          <Link href="/checkout/placement-mentorship">
            <Button size="lg" className="shadow-lg shadow-primary/20">
              Complete Enrollment →
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            Questions? WhatsApp us at{" "}
            <a href="https://wa.me/918890240404" className="text-primary hover:underline">
              +91 88902 40404
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Pending — show review banner
  if (existingApp?.status === "pending") {
    const submittedAt = existingApp.submitted_at
      ? new Date(existingApp.submitted_at)
      : new Date();
    const replyBy = new Date(submittedAt);
    replyBy.setDate(replyBy.getDate() + 5); // generous buffer for display
    const replyByStr = replyBy.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background py-16 px-4">
        <div className="container max-w-lg text-center space-y-6">
          <div className="text-5xl">⏳</div>
          <h1 className="text-2xl font-bold">Application under review</h1>
          <p className="text-muted-foreground">
            Your application for <strong>{existingApp.target_role}</strong> is being reviewed.
            You&apos;ll hear from us by <strong>{replyByStr}</strong>.
          </p>
          <p className="text-sm text-muted-foreground">
            Questions? WhatsApp us at{" "}
            <a href="https://wa.me/918890240404" className="text-primary hover:underline">
              +91 88902 40404
            </a>
          </p>
          <Link href="/dashboard">
            <Button variant="outline">← Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background py-16 px-4">
      <div className="container max-w-2xl">
        <div className="mb-8 text-center">
          <div className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Invite Only
          </div>
          <h1 className="text-3xl font-bold mb-2">Apply for Placement Mentorship</h1>
          <p className="text-muted-foreground">
            We read every application. You&apos;ll hear back within 3 business days.
          </p>
        </div>

        <ApplicationForm
          userEmail={user.email ?? ""}
          userName={profile?.name ?? ""}
          userPhone={profile?.phone ?? ""}
          prefillRole={onboarding?.current_role ?? ""}
          prefillCompany={onboarding?.current_company ?? ""}
          prefillTargetRole={onboarding?.target_role ?? ""}
        />
      </div>
    </div>
  );
}
