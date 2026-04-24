"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Clock,
  Download,
  FileSearch,
  Loader2,
  Phone,
  Rocket,
  Upload,
} from "lucide-react";
import type { AuditStatus, BiggestChallenge, MentorCallStatus, ProductSlug } from "@/lib/supabase/types";
import { formatCurrency } from "@/lib/utils";

const ROLES = [
  "Fresher / Student",
  "SDE-1 (0–2 years)",
  "SDE-2 (2–5 years)",
  "SDE-3 / Senior (5+ years)",
  "ML / Data Engineer",
  "Other",
];

const TARGET_COMPANIES = [
  "Google",
  "Microsoft",
  "Amazon",
  "Meta",
  "Apple",
  "Flipkart",
  "Meesho",
  "Swiggy / Zomato",
  "Startups (Series A-C)",
  "MNC / Service",
  "Any good company",
];

const CHALLENGES: {
  value: BiggestChallenge;
  label: string;
  description: string;
  emoji: string;
}[] = [
  {
    value: "resume_not_shortlisted",
    label: "Resume not getting shortlisted",
    description: "I apply but rarely hear back. Something is wrong with my profile.",
    emoji: "📄",
  },
  {
    value: "interview_rejections",
    label: "Getting rejected in interviews",
    description: "I get calls but fail at coding rounds, system design, or HR.",
    emoji: "💬",
  },
  {
    value: "no_clarity_on_prep",
    label: "No clarity on what to prepare",
    description: "I don't know what to focus on or where to start.",
    emoji: "🧭",
  },
];

function getRecommendation(challenge: BiggestChallenge): ProductSlug {
  if (challenge === "interview_rejections") return "interview_sprint";
  return "career_audit";
}

interface AuditRecord {
  id: string;
  submission_status: AuditStatus;
  resume_url: string | null;
  linkedin_url: string | null;
  report_url: string | null;
  submitted_at: string | null;
  report_uploaded_at: string | null;
}

interface OnboardingData {
  current_role: string | null;
  current_company: string | null;
  target_companies: string[] | null;
  target_role: string | null;
  biggest_challenge: BiggestChallenge | null;
}

interface CallRequestData {
  id: string;
  preferred_slots: string[];
  status: MentorCallStatus;
  confirmed_slot: string | null;
  meeting_link: string | null;
  created_at: string;
}

interface Props {
  audit: AuditRecord | null;
  enrollmentId: string;
  onboarding: OnboardingData | null;
  callRequest: CallRequestData | null;
  interviewSprintPrice: number;
}

const STATUS_CONFIG: Record<
  AuditStatus,
  { label: string; variant: "default" | "warning" | "success" | "secondary" }
> = {
  awaiting_submission: { label: "Action needed", variant: "warning" },
  submitted: { label: "Submitted", variant: "secondary" },
  under_review: { label: "In review", variant: "default" },
  report_ready: { label: "Report ready!", variant: "success" },
};

const formatIST = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));

export default function CareerAuditDashboard({ audit, enrollmentId, onboarding, callRequest, interviewSprintPrice }: Props) {
  const [linkedinUrl, setLinkedinUrl] = useState(audit?.linkedin_url ?? "");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formStep, setFormStep] = useState<1 | 2>(1);
  const fileRef = useRef<HTMLInputElement>(null);

  const [showScheduler, setShowScheduler] = useState(false);
  const [slot1, setSlot1] = useState("");
  const [slot2, setSlot2] = useState("");
  const [slot3, setSlot3] = useState("");
  const [submittingCall, setSubmittingCall] = useState(false);

  const handleSubmitCallRequest = async () => {
    const slots = [slot1, slot2, slot3].filter(Boolean).map((s) => new Date(s).toISOString());
    if (slots.length === 0) {
      toast.error("Please select at least one preferred time slot.");
      return;
    }
    setSubmittingCall(true);
    try {
      const res = await fetch("/api/career-audit/call-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId: audit!.id, preferredSlots: slots }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      toast.success("Time preferences submitted! We'll confirm your slot soon.");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit request.");
    }
    setSubmittingCall(false);
  };

  // Onboarding fields — pre-filled from DB
  const [currentRole, setCurrentRole] = useState(onboarding?.current_role ?? "");
  const [currentCompany, setCurrentCompany] = useState(onboarding?.current_company ?? "");
  const [targetCompanies, setTargetCompanies] = useState<string[]>(
    onboarding?.target_companies ?? []
  );
  const [targetRole, setTargetRole] = useState(onboarding?.target_role ?? "");
  const [challenge, setChallenge] = useState<BiggestChallenge | null>(
    onboarding?.biggest_challenge ?? null
  );

  const status: AuditStatus = audit?.submission_status ?? "awaiting_submission";
  const statusConfig = STATUS_CONFIG[status];

  const toggleCompany = (company: string) => {
    setTargetCompanies((prev) =>
      prev.includes(company) ? prev.filter((c) => c !== company) : [...prev, company]
    );
  };

  const handleNext = () => {
    if (!resumeFile && !audit?.resume_url) {
      toast.error("Please upload your resume PDF.");
      return;
    }
    if (!linkedinUrl.includes("linkedin.com")) {
      toast.error("Please enter a valid LinkedIn URL.");
      return;
    }
    setFormStep(2);
  };

  const handleSubmit = async () => {
    setUploading(true);

    try {
      let resumeUrl = audit?.resume_url ?? "";

      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);
        const uploadRes = await fetch("/api/career-audit/upload-resume", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (uploadData.error) throw new Error(uploadData.error);
        resumeUrl = uploadData.resumeUrl;
      }

      // Save updated onboarding answers alongside the submission
      if (challenge) {
        await fetch("/api/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            current_role: currentRole,
            current_company: currentCompany,
            target_companies: targetCompanies,
            target_role: targetRole,
            biggest_challenge: challenge,
            recommended_product: getRecommendation(challenge),
          }),
        });
      }

      const res = await fetch("/api/career-audit/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeUrl, linkedinUrl, enrollmentId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      toast.success("Submitted! Our expert will review within 24–48 hours.");
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed.");
    }

    setUploading(false);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-indigo-600" />
            Career Audit
          </h1>
          <p className="text-muted-foreground mt-1">
            Expert resume & LinkedIn review
          </p>
        </div>
        <Badge variant={statusConfig.variant as "default" | "secondary" | "outline" | "destructive"}>
          {statusConfig.label}
        </Badge>
      </div>

      {/* Timeline */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-0">
            {(
              [
                { key: "awaiting_submission", label: "Submit" },
                { key: "submitted", label: "Submitted" },
                { key: "under_review", label: "In Review" },
                { key: "report_ready", label: "Report Ready" },
              ] as { key: AuditStatus; label: string }[]
            ).map((step, i, arr) => {
              const statusOrder: AuditStatus[] = [
                "awaiting_submission",
                "submitted",
                "under_review",
                "report_ready",
              ];
              const currentIdx = statusOrder.indexOf(status);
              const stepIdx = statusOrder.indexOf(step.key);
              const done = stepIdx <= currentIdx;
              const active = stepIdx === currentIdx;

              return (
                <div key={step.key} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        done
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                    </div>
                    <div
                      className={`text-xs mt-1 text-center ${
                        active ? "font-semibold text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-2 ${
                        stepIdx < currentIdx ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* State 1: Awaiting submission */}
      {status === "awaiting_submission" && (
        <Card className="border-indigo-200 border-2">
          {/* Sub-step indicator */}
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                {formStep === 1 ? "Submit your resume & LinkedIn" : "Confirm your profile details"}
              </CardTitle>
              <div className="flex gap-1.5 items-center">
                <div className={`h-2 w-6 rounded-full transition-all ${formStep >= 1 ? "bg-primary" : "bg-muted"}`} />
                <div className={`h-2 w-6 rounded-full transition-all ${formStep >= 2 ? "bg-primary" : "bg-muted"}`} />
                <span className="text-xs text-muted-foreground ml-1">{formStep} / 2</span>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* Step 1: Resume + LinkedIn */}
            {formStep === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label>Resume (PDF only, max 5MB)</Label>
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileRef.current?.click()}
                  >
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    {resumeFile ? (
                      <div className="text-sm font-medium text-primary">{resumeFile.name}</div>
                    ) : audit?.resume_url ? (
                      <div>
                        <div className="text-sm font-medium text-green-700">Resume already uploaded</div>
                        <div className="text-xs text-muted-foreground mt-1">Click to replace</div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-sm font-medium">Click to upload or drag & drop</div>
                        <div className="text-xs text-muted-foreground mt-1">PDF files only</div>
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn profile URL</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/yourname"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                  />
                </div>

                <Button type="button" className="w-full" size="lg" onClick={handleNext}>
                  Next — Review your profile
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Step 2: Onboarding answers review/edit */}
            {formStep === 2 && (
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">
                  These answers help our expert personalise your audit. Update anything that has changed.
                </p>

                {/* Current role */}
                <div className="space-y-2">
                  <Label>Your current role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setCurrentRole(role)}
                        className={`text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                          currentRole === role
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Current company */}
                <div className="space-y-2">
                  <Label>
                    Current company{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. Infosys, TCS, or a startup"
                    value={currentCompany}
                    onChange={(e) => setCurrentCompany(e.target.value)}
                  />
                </div>

                {/* Target companies */}
                <div className="space-y-2">
                  <Label>
                    Target companies{" "}
                    <span className="text-muted-foreground font-normal">(select all that apply)</span>
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {TARGET_COMPANIES.map((company) => (
                      <button
                        key={company}
                        type="button"
                        onClick={() => toggleCompany(company)}
                        className={`px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
                          targetCompanies.includes(company)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Target role */}
                <div className="space-y-2">
                  <Label>
                    Target role{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g. SDE-2, ML Engineer, Backend Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>

                {/* Biggest challenge */}
                <div className="space-y-2">
                  <Label>Biggest challenge right now</Label>
                  <div className="space-y-2">
                    {CHALLENGES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setChallenge(c.value)}
                        className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                          challenge === c.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{c.emoji}</span>
                          <div>
                            <div className="font-semibold text-sm">{c.label}</div>
                            <div className="text-muted-foreground text-xs mt-0.5">{c.description}</div>
                          </div>
                          {challenge === c.value && (
                            <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground flex-shrink-0">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    size="lg"
                    onClick={() => setFormStep(1)}
                    disabled={uploading}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    size="lg"
                    disabled={uploading}
                    onClick={handleSubmit}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        Submit for Review
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* State 2: Submitted / Under Review */}
      {(status === "submitted" || status === "under_review") && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
                <Clock className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            <h2 className="text-xl font-bold mb-2">
              {status === "submitted"
                ? "Resume received!"
                : "Expert review in progress"}
            </h2>
            <p className="text-muted-foreground mb-6">
              Our expert is reviewing your resume and LinkedIn profile.
              You&apos;ll receive an email when your report is ready -
              typically within 24–48 hours.
            </p>
            <div className="bg-muted/40 rounded-xl p-4 text-left space-y-2">
              <div className="text-sm font-medium">While you wait:</div>
              <ul className="text-sm text-muted-foreground space-y-1.5">
                <li>• Update your LinkedIn headline with your target role</li>
                <li>• List 3 projects you want to highlight in interviews</li>
                <li>• Write down 5 roles you&apos;re actively targeting</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* State 3: Report ready */}
      {status === "report_ready" && audit?.report_url && (
        <div className="space-y-4">
          <Card className="border-green-200 border-2">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold">Your Career Audit Report is Ready!</div>
                  <div className="text-sm text-muted-foreground">
                    Tap below to view your detailed gap analysis and action plan.
                  </div>
                </div>
              </div>
              <a
                href={audit.report_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <Button className="w-full" size="lg">
                  <Download className="h-4 w-4" />
                  View My Report
                </Button>
              </a>
            </CardContent>
          </Card>

          {/* Upsell to Interview Sprint */}
          <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 flex-shrink-0">
                  <Rocket className="h-5 w-5 text-violet-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">
                    Ready to fix these gaps fast?
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    The Interview Sprint is a 21-day structured program designed
                    to address exactly the gaps in your report - with live
                    sessions, a mock interview, and a daily execution plan.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Link href="/checkout/interview-sprint">
                      <Button size="sm">
                        Start Interview Sprint - {formatCurrency(interviewSprintPrice)}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Link href="/products/interview-sprint">
                      <Button size="sm" variant="outline">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Schedule a call with mentor */}
          {callRequest?.status === "completed" ? (
            <Card className="border-muted">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="font-semibold">Strategy Call Completed</div>
                    <Badge variant="secondary" className="mt-1">Call Completed</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : callRequest?.status === "confirmed" ? (
            <Card className="border-green-200 border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <CalendarClock className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Your Call is Confirmed!</div>
                    <Badge className="mt-1 bg-green-100 text-green-800 border-green-200">Confirmed</Badge>
                  </div>
                </div>
                {callRequest.confirmed_slot && (
                  <p className="text-sm text-muted-foreground mb-4">
                    <span className="font-medium">📅 </span>
                    {formatIST(callRequest.confirmed_slot)} (IST)
                  </p>
                )}
                {callRequest.meeting_link && (
                  <a href={callRequest.meeting_link} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full" size="lg">
                      <Phone className="h-4 w-4" />
                      Join Call
                    </Button>
                  </a>
                )}
              </CardContent>
            </Card>
          ) : callRequest?.status === "pending" ? (
            <Card className="border-amber-200 border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Call Request Received</div>
                    <div className="text-sm text-muted-foreground">
                      We&apos;ll confirm one of your preferred slots within 24 hours.
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Your preferred slots</p>
                  {callRequest.preferred_slots.map((slot, i) => (
                    <p key={i} className="text-sm text-foreground">
                      {i + 1}. {formatIST(slot)} (IST)
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-indigo-200 border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    <Phone className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-semibold">Schedule a Free Strategy Call with Your Mentor</div>
                    <div className="text-sm text-muted-foreground">
                      Book a 30-minute 1:1 call to walk through your audit findings and create a personalised action plan.
                    </div>
                  </div>
                </div>

                {!showScheduler ? (
                  <Button className="w-full mt-2" variant="outline" onClick={() => setShowScheduler(true)}>
                    <CalendarClock className="h-4 w-4" />
                    Choose My Time Slots
                  </Button>
                ) : (
                  <div className="mt-4 space-y-4">
                    <p className="text-xs text-muted-foreground">
                      Select up to 3 preferred date and time slots (IST). We&apos;ll confirm one of them.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="slot1" className="text-sm">Slot 1 <span className="text-red-500">*</span></Label>
                        <Input
                          id="slot1"
                          type="datetime-local"
                          value={slot1}
                          onChange={(e) => setSlot1(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slot2" className="text-sm">Slot 2 <span className="text-muted-foreground">(optional)</span></Label>
                        <Input
                          id="slot2"
                          type="datetime-local"
                          value={slot2}
                          onChange={(e) => setSlot2(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="slot3" className="text-sm">Slot 3 <span className="text-muted-foreground">(optional)</span></Label>
                        <Input
                          id="slot3"
                          type="datetime-local"
                          value={slot3}
                          onChange={(e) => setSlot3(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Button
                        className="flex-1"
                        onClick={handleSubmitCallRequest}
                        disabled={submittingCall || !slot1}
                      >
                        {submittingCall && <Loader2 className="h-4 w-4 animate-spin" />}
                        Confirm Request
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => { setShowScheduler(false); setSlot1(""); setSlot2(""); setSlot3(""); }}
                        disabled={submittingCall}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
