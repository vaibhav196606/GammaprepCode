"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";

interface Props {
  userEmail: string;
  userName: string;
  userPhone: string;
  prefillRole: string;
  prefillCompany: string;
  prefillTargetRole: string;
}

const TIMELINE_OPTIONS = [
  { value: "immediate", label: "Immediately — actively interviewing" },
  { value: "1_to_3_months", label: "1–3 months" },
  { value: "3_to_6_months", label: "3–6 months" },
  { value: "exploring", label: "Just exploring options" },
];

const HEARD_FROM_OPTIONS = [
  "Google",
  "Friend / Referral",
  "LinkedIn",
  "Instagram",
  "YouTube",
  "Other",
];

export default function ApplicationForm({
  userEmail,
  userName,
  userPhone,
  prefillRole,
  prefillCompany,
  prefillTargetRole,
}: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [submitting, setSubmitting] = useState(false);

  // Step 1: About you
  const [fullName, setFullName] = useState(userName);
  const [phone, setPhone] = useState(userPhone);
  const [currentRole, setCurrentRole] = useState(prefillRole);
  const [currentCompany, setCurrentCompany] = useState(prefillCompany);
  const [yearsExp, setYearsExp] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Step 2: What you're looking for
  const [targetRole, setTargetRole] = useState(prefillTargetRole);
  const [targetCompanies, setTargetCompanies] = useState("");
  const [timeline, setTimeline] = useState("");
  const [goals, setGoals] = useState("");
  const [motivation, setMotivation] = useState("");
  const [heardFrom, setHeardFrom] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5MB.");
      return;
    }
    setResumeFile(file);
  };

  const validateStep1 = () => {
    if (!fullName.trim()) { toast.error("Please enter your name."); return false; }
    if (!currentRole.trim()) { toast.error("Please enter your current role."); return false; }
    if (yearsExp === "" || isNaN(Number(yearsExp)) || Number(yearsExp) < 0) {
      toast.error("Please enter valid years of experience.");
      return false;
    }
    if (linkedinUrl && !linkedinUrl.includes("linkedin.com")) {
      toast.error("Please enter a valid LinkedIn URL.");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!targetRole.trim()) { toast.error("Please enter your target role."); return false; }
    if (!timeline) { toast.error("Please select your timeline."); return false; }
    if (goals.trim().length < 30) { toast.error("Please write at least 30 characters for your goals."); return false; }
    if (motivation.trim().length < 30) { toast.error("Please write at least 30 characters for your motivation."); return false; }
    return true;
  };

  const handleNext = () => {
    if (!validateStep1()) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setSubmitting(true);

    try {
      let resumeUrl: string | null = null;

      if (resumeFile) {
        const formData = new FormData();
        formData.append("file", resumeFile);
        const uploadRes = await fetch("/api/mentorship-application/upload-resume", {
          method: "POST",
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error ?? "Resume upload failed.");
        resumeUrl = uploadData.resumeUrl;
      }

      const res = await fetch("/api/mentorship-application/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone: phone.trim() || null,
          current_role: currentRole.trim(),
          current_company: currentCompany.trim() || null,
          years_experience: Number(yearsExp),
          target_role: targetRole.trim(),
          timeline,
          goals: goals.trim(),
          motivation: motivation.trim(),
          linkedin_url: linkedinUrl.trim() || null,
          github_url: githubUrl.trim() || null,
          resume_url: resumeUrl,
          target_companies: targetCompanies.trim() || null,
          heard_from: heardFrom || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Submission failed.");

      router.push("/apply/placement-mentorship/submitted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step indicators */}
      <div className="flex gap-3 mb-2">
        {([1, 2] as const).map((s) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              s <= step ? "bg-primary" : "bg-muted"
            }`}
          />
        ))}
      </div>
      <div className="text-xs text-muted-foreground mb-4">
        Step {step} of 2 — {step === 1 ? "About you" : "What you're looking for"}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">About you</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full name *</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={userEmail} disabled className="bg-muted/50 text-muted-foreground" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Current role *</Label>
                <Input value={currentRole} onChange={(e) => setCurrentRole(e.target.value)} placeholder="e.g. Backend Engineer" />
              </div>
              <div className="space-y-1.5">
                <Label>Current company</Label>
                <Input value={currentCompany} onChange={(e) => setCurrentCompany(e.target.value)} placeholder="e.g. Infosys" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Years of relevant experience *</Label>
              <Input
                type="number"
                min={0}
                max={50}
                value={yearsExp}
                onChange={(e) => setYearsExp(e.target.value)}
                placeholder="e.g. 2"
                className="max-w-[120px]"
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                LinkedIn URL{" "}
                <span className="text-muted-foreground font-normal text-xs">(optional)</span>
              </Label>
              <Input
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                GitHub / Portfolio URL{" "}
                <span className="text-muted-foreground font-normal text-xs">(optional)</span>
              </Label>
              <Input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/yourprofile"
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                Resume{" "}
                <span className="text-muted-foreground font-normal text-xs">(optional — PDF, max 5MB)</span>
              </Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileRef.current?.click()}
              >
                {resumeFile ? (
                  <div className="flex items-center justify-center gap-2 text-sm font-medium text-primary">
                    <span>{resumeFile.name}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-5 w-5 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">Click to upload your resume (PDF)</div>
                  </div>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <Button onClick={handleNext} size="lg" className="w-full">
              Next — What you&apos;re looking for →
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">What you&apos;re looking for</CardTitle>
              <button
                onClick={() => setStep(1)}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                ← Edit step 1
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label>Target role *</Label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Software Engineer at a product company"
              />
            </div>

            <div className="space-y-1.5">
              <Label>
                Target companies{" "}
                <span className="text-muted-foreground font-normal text-xs">(optional — comma separated)</span>
              </Label>
              <Input
                value={targetCompanies}
                onChange={(e) => setTargetCompanies(e.target.value)}
                placeholder="e.g. Google, Microsoft, Zepto"
              />
            </div>

            <div className="space-y-2">
              <Label>When are you looking to move? *</Label>
              <div className="space-y-2">
                {TIMELINE_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="timeline"
                      value={opt.value}
                      checked={timeline === opt.value}
                      onChange={() => setTimeline(opt.value)}
                      className="accent-primary"
                    />
                    <span className="text-sm group-hover:text-foreground text-muted-foreground transition-colors">
                      {opt.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>
                What are you hoping to achieve? *{" "}
                <span className="text-muted-foreground font-normal text-xs">({goals.length}/1000)</span>
              </Label>
              <Textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value.slice(0, 1000))}
                placeholder="e.g. I want to move from a service company to a product company within 3 months. I need help with my resume, interview prep, and referrals..."
                rows={4}
              />
              {goals.length > 0 && goals.length < 30 && (
                <p className="text-xs text-amber-600">Please write at least 30 characters.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                Why this program, and why now? *{" "}
                <span className="text-muted-foreground font-normal text-xs">({motivation.length}/1000)</span>
              </Label>
              <Textarea
                value={motivation}
                onChange={(e) => setMotivation(e.target.value.slice(0, 1000))}
                placeholder="e.g. I've been preparing on my own for 6 months and I'm stuck. I need structured 1:1 accountability and someone who has actually placed at these companies..."
                rows={4}
              />
              {motivation.length > 0 && motivation.length < 30 && (
                <p className="text-xs text-amber-600">Please write at least 30 characters.</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>
                How did you hear about us?{" "}
                <span className="text-muted-foreground font-normal text-xs">(optional)</span>
              </Label>
              <select
                value={heardFrom}
                onChange={(e) => setHeardFrom(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select an option</option>
                {HEARD_FROM_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <Button onClick={handleSubmit} disabled={submitting} size="lg" className="w-full">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You&apos;ll hear back within 3 business days. No spam, ever.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
