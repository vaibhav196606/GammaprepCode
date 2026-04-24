import { NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import {
  sendApplicationReceivedEmail,
  sendAdminApplicationNotification,
} from "@/lib/email";
import type { MentorshipTimeline } from "@/lib/supabase/types";

const VALID_TIMELINES: MentorshipTimeline[] = [
  "immediate",
  "1_to_3_months",
  "3_to_6_months",
  "exploring",
];

function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const {
    full_name,
    phone,
    current_role,
    current_company,
    years_experience,
    target_role,
    timeline,
    goals,
    motivation,
    linkedin_url,
    github_url,
    portfolio_url,
    resume_url,
    target_companies,
    heard_from,
  } = body;

  // Required field validation
  if (
    !full_name?.trim() ||
    !current_role?.trim() ||
    !target_role?.trim() ||
    !goals?.trim() ||
    !motivation?.trim() ||
    years_experience == null ||
    !timeline
  ) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  if (!VALID_TIMELINES.includes(timeline)) {
    return NextResponse.json({ error: "Invalid timeline value." }, { status: 400 });
  }

  const exp = Number(years_experience);
  if (isNaN(exp) || exp < 0 || exp > 50) {
    return NextResponse.json(
      { error: "Years of experience must be between 0 and 50." },
      { status: 400 }
    );
  }

  if (goals.trim().length < 30) {
    return NextResponse.json(
      { error: "Goals must be at least 30 characters." },
      { status: 400 }
    );
  }

  if (motivation.trim().length < 30) {
    return NextResponse.json(
      { error: "Motivation must be at least 30 characters." },
      { status: 400 }
    );
  }

  if (linkedin_url && !linkedin_url.includes("linkedin.com")) {
    return NextResponse.json(
      { error: "Please enter a valid LinkedIn URL." },
      { status: 400 }
    );
  }

  const serviceSupabase = createServiceClient();

  // Check for existing active (pending/invited) application
  const { data: activeApp } = await serviceSupabase
    .from("mentorship_applications")
    .select("id, status")
    .eq("user_id", user.id)
    .in("status", ["pending", "invited"])
    .maybeSingle();

  if (activeApp) {
    return NextResponse.json(
      { error: "You already have an active application under review." },
      { status: 409 }
    );
  }

  // Check for enrolled status
  const { data: enrolledApp } = await serviceSupabase
    .from("mentorship_applications")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "enrolled")
    .maybeSingle();

  if (enrolledApp) {
    return NextResponse.json(
      { error: "You are already enrolled in Placement Mentorship." },
      { status: 409 }
    );
  }

  // Check 90-day cooldown for rejected applicants
  const { data: recentRejection } = await serviceSupabase
    .from("mentorship_applications")
    .select("rejected_at")
    .eq("user_id", user.id)
    .eq("status", "rejected")
    .order("rejected_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (recentRejection?.rejected_at) {
    const rejectedAt = new Date(recentRejection.rejected_at);
    const cooldownEnd = new Date(rejectedAt);
    cooldownEnd.setDate(cooldownEnd.getDate() + 90);
    if (new Date() < cooldownEnd) {
      const retryDate = cooldownEnd.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      return NextResponse.json(
        { error: `You can re-apply after ${retryDate}.` },
        { status: 403 }
      );
    }
  }

  // Get user email
  const { data: authUser } = await serviceSupabase.auth.admin.getUserById(user.id);
  const userEmail = authUser?.user?.email ?? user.email ?? "";

  // Insert application
  const { data: application, error: insertError } = await serviceSupabase
    .from("mentorship_applications")
    .insert({
      user_id: user.id,
      full_name: full_name.trim(),
      email: userEmail,
      phone: phone?.trim() || null,
      current_role: current_role.trim(),
      current_company: current_company?.trim() || null,
      years_experience: exp,
      target_role: target_role.trim(),
      timeline,
      goals: goals.trim(),
      motivation: motivation.trim(),
      linkedin_url: linkedin_url?.trim() || null,
      github_url: github_url?.trim() || null,
      portfolio_url: portfolio_url?.trim() || null,
      resume_url: resume_url?.trim() || null,
      target_companies: target_companies?.trim() || null,
      heard_from: heard_from?.trim() || null,
    })
    .select("id")
    .single();

  if (insertError || !application) {
    console.error("Application insert error:", insertError);
    if (insertError?.code === "23505") {
      return NextResponse.json(
        { error: "You already have an active application under review." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    );
  }

  // Fire emails (non-blocking)
  const replyByDate = addBusinessDays(new Date(), 3).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  await Promise.allSettled([
    sendApplicationReceivedEmail({
      to: userEmail,
      name: full_name.trim(),
      targetRole: target_role.trim(),
      replyByDate,
    }),
    sendAdminApplicationNotification({
      userName: full_name.trim(),
      userEmail,
      applicationId: application.id,
      targetRole: target_role.trim(),
      yearsExperience: exp,
      timeline,
    }),
  ]);

  return NextResponse.json({ applicationId: application.id });
}
