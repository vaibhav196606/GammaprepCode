import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  MessageSquare,
  Mic,
  Shield,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import type { MentorshipApplicationStatus } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Placement Mentorship - 1:1 Career Coaching Until You Get Placed",
  description:
    "Full 1:1 placement mentorship for software engineers. Weekly calls, mock interviews, job referrals, and complete profile rebuild. ₹29,999.",
  keywords: [
    "placement mentorship India",
    "1:1 career coaching software engineer",
    "job referral India",
    "placement support engineer",
    "career mentor India",
    "software engineer placement India",
    "get placed at product company India",
    "interview coaching until placement",
  ],
  alternates: {
    canonical: "https://gammaprep.com/products/placement-mentorship",
  },
  openGraph: {
    title: "Placement Mentorship - 1:1 Support Until You Get Placed",
    description:
      "Weekly calls, 2–3 mock interviews, referrals, and complete profile rebuild. Full 1:1 mentorship for engineers.",
    url: "https://gammaprep.com/products/placement-mentorship",
  },
};

const FEATURES = [
  {
    icon: Trophy,
    title: "Complete profile rebuild",
    description: "Resume + LinkedIn repositioned from the ground up",
  },
  {
    icon: BriefcaseBusiness,
    title: "Project & skill strategy",
    description: "What to build and highlight to actually get shortlisted",
  },
  {
    icon: Users,
    title: "Weekly live mentoring calls",
    description: "1:1 weekly sessions to track progress and adjust strategy",
  },
  {
    icon: Mic,
    title: "2–3 mock interviews",
    description: "Full simulation with detailed written + verbal feedback",
  },
  {
    icon: CheckCircle2,
    title: "Job application strategy",
    description: "Where to apply, how to apply, how to prioritize",
  },
  {
    icon: MessageSquare,
    title: "Referral & cold outreach templates",
    description: "Proven templates to get referrals at top companies",
  },
  {
    icon: CheckCircle2,
    title: "Interview tracking system",
    description: "Track every application, round, and outcome in one place",
  },
  {
    icon: MessageSquare,
    title: "Direct mentor access",
    description: "Async support for doubts and feedback between sessions",
  },
];

const TESTIMONIALS = [
  {
    name: "Ritika Patil",
    role: "Placed @ Microsoft",
    quote:
      "Went from 0 shortlists in 3 months to 2 offers in 6 weeks after the Placement Mentorship. The referral network is real.",
  },
  {
    name: "Nishant Padhi",
    role: "Placed @ Walmart",
    quote:
      "The cold outreach templates from Mentorship literally got me 3 referrals in 2 weeks. I'd never done this before.",
  },
];

export default async function PlacementMentorshipPage() {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: dbProduct }, { data: dbSprint }, { data: settingsRows }] = await Promise.all([
    serviceSupabase.from("products").select("price_inr, original_price").eq("slug", "placement_mentorship").eq("is_active", true).single(),
    serviceSupabase.from("products").select("price_inr").eq("slug", "interview_sprint").eq("is_active", true).single(),
    serviceSupabase.from("site_settings").select("key, value"),
  ]);
  const PRICE = dbProduct?.price_inr ?? 14999;
  const ORIGINAL_PRICE = (dbProduct?.original_price as number | null) ?? null;
  const SPRINT_PRICE = dbSprint?.price_inr ?? 9999;

  let appStatus: MentorshipApplicationStatus | null = null;
  if (user) {
    const appResult = await supabase
      .from("mentorship_applications")
      .select("status")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    appStatus = ((appResult.data as { status: string } | null)?.status as MentorshipApplicationStatus) ?? null;
  }
  const siteSettings: Record<string, unknown> = {};
  (settingsRows ?? []).forEach((r: { key: string; value: unknown }) => { siteSettings[r.key] = r.value; });
  const showGst = (siteSettings.show_gst as boolean) ?? true;
  const GST = showGst ? Math.round(PRICE * 0.18) : 0;
  const TOTAL = PRICE + GST;

  return (
    <div>
      {/* Exclusivity banner */}
      <div className="bg-amber-50 border-b border-amber-200 py-3 px-4 text-center text-sm text-amber-800">
        <strong>By application only</strong> — we accept a limited number of mentees each month to keep 1:1 quality high.
      </div>

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50/80 to-background">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-amber-600">Invite Only</Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Full 1:1 support until{" "}
                <span className="gradient-primary-text">you get the offer</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Complete profile rebuild, weekly personal calls, 2–3 mock
                interviews, job referrals, and direct mentor access. Everything
                you need to stop trying alone and start getting placed.
              </p>

              {/* 3-step process strip */}
              <div className="mt-6 mb-6 flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium text-xs">1. Apply (5 min)</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium text-xs">2. Review (3 days)</span>
                <ArrowRight className="h-3 w-3 shrink-0" />
                <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium text-xs">3. Enroll if invited</span>
              </div>

              {/* Application status chip */}
              {appStatus === "pending" && (
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
                  Application submitted — under review. You&apos;ll hear from us shortly.
                </div>
              )}
              {appStatus === "invited" && (
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                  You&apos;re invited! Complete your enrollment below.
                </div>
              )}
              {appStatus === "rejected" && (
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted border rounded-lg px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/40 shrink-0" />
                  Your application wasn&apos;t selected this time. You may re-apply after 90 days.
                </div>
              )}

              <div className="mt-4 flex flex-col sm:flex-row gap-4">
                {appStatus === "invited" ? (
                  <Link href="/checkout/placement-mentorship">
                    <Button size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                      Complete Enrollment
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                ) : appStatus === "pending" ? (
                  <Button size="xl" disabled className="w-full sm:w-auto opacity-60">
                    Requested
                  </Button>
                ) : (
                  <Link href="/apply/placement-mentorship">
                    <Button size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                      Request Invite
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <a href="https://wa.me/918890240404" target="_blank" rel="noopener noreferrer">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    Talk to us first
                  </Button>
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-amber-500" />
                  Maximum 5 mentees at a time
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-green-500" />
                  We read every application
                </div>
              </div>
            </div>

            {/* Price card */}
            <Card className="border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black gradient-primary-text">₹{PRICE.toLocaleString("en-IN")}</span>
                    {ORIGINAL_PRICE != null && ORIGINAL_PRICE > PRICE && (
                      <span className="text-xl text-muted-foreground line-through">₹{ORIGINAL_PRICE.toLocaleString("en-IN")}</span>
                    )}
                  </div>
                  <div className="text-amber-600 text-sm font-medium mt-1">on approval — invite only</div>
                  {showGst && (
                    <div className="text-muted-foreground text-sm mt-1">
                      + ₹{GST.toLocaleString("en-IN")} GST = ₹{TOTAL.toLocaleString("en-IN")} total
                    </div>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {FEATURES.map((f) => (
                    <li key={f.title} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>
                        <span className="font-medium">{f.title}</span>
                        {" - "}
                        <span className="text-muted-foreground">{f.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                {appStatus === "invited" ? (
                  <Link href="/checkout/placement-mentorship" className="block">
                    <Button className="w-full" size="lg">
                      Complete Enrollment
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : appStatus === "pending" ? (
                  <Button className="w-full" size="lg" disabled>
                    Requested
                  </Button>
                ) : (
                  <Link href="/apply/placement-mentorship" className="block">
                    <Button className="w-full" size="lg">
                      Request Invite
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <p className="text-xs text-muted-foreground text-center mt-4">
                  {appStatus === "pending"
                    ? "Under review — you'll hear back within 3 business days."
                    : appStatus === "invited"
                    ? "Your invite is ready. Lock in your spot now."
                    : "Hear back within 3 business days."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            Mentorship success stories
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="p-6">
                <div className="flex mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed mb-4">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sprint nudge */}
      <section className="py-10 px-4">
        <div className="container max-w-3xl">
          <Card className="border-dashed border-2 p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold mb-1">
                Not sure if Mentorship is right for you yet?
              </div>
              <p className="text-sm text-muted-foreground">
                Start with the Interview Sprint at ₹{SPRINT_PRICE.toLocaleString("en-IN")}. Many students upgrade
                to Mentorship after their first mock interview.
              </p>
            </div>
            <Link href="/products/interview-sprint">
              <Button variant="outline" className="whitespace-nowrap">
                View Interview Sprint
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Who we're looking for */}
      <section className="py-10 px-4 bg-amber-50/40">
        <div className="container max-w-3xl">
          <h2 className="text-xl font-bold mb-4">Who we&apos;re looking for</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              Targeting a tech role at a renowned MNC or top product company (Google, Microsoft, Amazon, Flipkart, Zepto, etc.)
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              Looking to move in the next 6 months — not just curious
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              Open to a weekly commitment (calls, assignments, feedback)
            </li>
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for full 1:1 support?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Limited to 5 mentees at a time. Apply and hear back in 3 business days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply/placement-mentorship">
              <Button size="xl" className="shadow-lg shadow-primary/20">
                Request Invite
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <a href="https://wa.me/918890240404" target="_blank" rel="noopener noreferrer">
              <Button size="xl" variant="outline">
                Chat with us first
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "@id":
              "https://gammaprep.com/products/placement-mentorship#product",
            "name": "Placement Mentorship",
            "description":
              "Full 1:1 placement mentorship for software engineers. Complete profile rebuild, weekly personal calls, 2–3 mock interviews, job referrals, and direct mentor access until you get placed.",
            "brand": { "@type": "Organization", "name": "Gammaprep" },
            "url": "https://gammaprep.com/products/placement-mentorship",
            "offers": {
              "@type": "Offer",
              "url": "https://gammaprep.com/products/placement-mentorship",
              "priceCurrency": "INR",
              "price": PRICE.toString(),
              "priceValidUntil": "2026-12-31",
              "availability": "https://schema.org/InStock",
              "seller": { "@type": "Organization", "name": "Gammaprep" },
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "200",
              "bestRating": "5",
            },
            "review": [
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                },
                "author": { "@type": "Person", "name": "Ritika Patil" },
                "reviewBody":
                  "Went from 0 shortlists in 3 months to 2 offers in 6 weeks after the Placement Mentorship. The referral network is real.",
              },
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                },
                "author": { "@type": "Person", "name": "Nishant Padhi" },
                "reviewBody":
                  "The cold outreach templates from Mentorship literally got me 3 referrals in 2 weeks. I'd never done this before.",
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://gammaprep.com",
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Placement Mentorship",
                "item":
                  "https://gammaprep.com/products/placement-mentorship",
              },
            ],
          }),
        }}
      />
    </div>
  );
}
