"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowRight, Loader2, Zap } from "lucide-react";
import type { BiggestChallenge, ProductSlug } from "@/lib/supabase/types";

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
    description:
      "I apply but rarely hear back. Something is wrong with my profile.",
    emoji: "📄",
  },
  {
    value: "interview_rejections",
    label: "Getting rejected in interviews",
    description:
      "I get calls but fail at coding rounds, system design, or HR.",
    emoji: "💬",
  },
  {
    value: "no_clarity_on_prep",
    label: "No clarity on what to prepare",
    description:
      "I don't know what to focus on or where to start.",
    emoji: "🧭",
  },
];

function getRecommendation(challenge: BiggestChallenge): ProductSlug {
  if (challenge === "interview_rejections") return "interview_sprint";
  return "career_audit";
}

const PRODUCT_REDIRECTS: Record<ProductSlug, string> = {
  career_audit: "/products/career-audit",
  interview_sprint: "/products/interview-sprint",
  placement_mentorship: "/products/placement-mentorship",
};

export default function OnboardingWizard({
  redirect,
}: {
  redirect?: string;
}) {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [currentRole, setCurrentRole] = useState("");
  const [currentCompany, setCurrentCompany] = useState("");
  const [targetCompanies, setTargetCompanies] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [challenge, setChallenge] = useState<BiggestChallenge | null>(null);

  const toggleCompany = (company: string) => {
    setTargetCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

  const handleSubmit = async () => {
    if (!challenge) return;
    setLoading(true);

    const recommendedProduct = getRecommendation(challenge);

    const { error } = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_role: currentRole,
        current_company: currentCompany,
        target_companies: targetCompanies,
        target_role: targetRole,
        biggest_challenge: challenge,
        recommended_product: recommendedProduct,
      }),
    }).then((r) => r.json());

    if (error) {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    if (redirect) {
      router.push(redirect);
    } else {
      router.push(PRODUCT_REDIRECTS[recommendedProduct]);
    }
    router.refresh();
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        <div className="flex items-center gap-2 mr-auto">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Zap className="h-4 w-4" />
          </div>
          <span className="font-bold text-lg gradient-primary-text">Gammaprep</span>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s <= step
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground ml-2">
          {step} of 3
        </span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {/* Step 1: Role */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Where are you right now?</h2>
              <p className="text-muted-foreground mt-1">
                This helps us understand your starting point.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Your current role
              </label>
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                Current company{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. Infosys, TCS, or a startup"
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={currentCompany}
                onChange={(e) => setCurrentCompany(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!currentRole}
              onClick={() => setStep(2)}
            >
              Continue <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Step 2: Targets */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Where do you want to go?</h2>
              <p className="text-muted-foreground mt-1">
                Select all the companies you&apos;re targeting.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Target companies{" "}
                <span className="text-muted-foreground font-normal">
                  (select all that apply)
                </span>
              </label>
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

            <div>
              <label className="text-sm font-medium mb-2 block">
                Target role{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <input
                type="text"
                placeholder="e.g. SDE-2, ML Engineer, Backend Engineer"
                className="w-full px-3 py-2 border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                size="lg"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                size="lg"
                disabled={targetCompanies.length === 0}
                onClick={() => setStep(3)}
              >
                Continue <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Challenge */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">
                What&apos;s your biggest challenge right now?
              </h2>
              <p className="text-muted-foreground mt-1">
                We&apos;ll recommend the best starting point for you.
              </p>
            </div>

            <div className="space-y-3">
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
                    <span className="text-2xl">{c.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm">{c.label}</div>
                      <div className="text-muted-foreground text-xs mt-0.5">
                        {c.description}
                      </div>
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

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                size="lg"
                onClick={() => setStep(2)}
              >
                Back
              </Button>
              <Button
                className="flex-1"
                size="lg"
                disabled={!challenge || loading}
                onClick={handleSubmit}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    See my recommendation <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
