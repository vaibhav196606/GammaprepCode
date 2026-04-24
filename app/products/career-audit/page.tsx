import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileSearch,
  Shield,
  Star,
  Upload,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Career Audit - Expert Resume & LinkedIn Review for Engineers",
  description:
    "Get an expert review of your resume and LinkedIn profile. Find out exactly what's blocking your interviews - for just ₹499. Results in 24–48 hours.",
  keywords: [
    "career audit India",
    "resume review software engineer",
    "LinkedIn audit India",
    "resume feedback India",
    "career gap analysis",
    "resume review India",
    "ATS resume India",
    "interview shortlist India",
  ],
  alternates: {
    canonical: "https://gammaprep.com/products/career-audit",
  },
  openGraph: {
    title: "Career Audit - ₹499 Expert Review for Software Engineers",
    description:
      "Find out exactly what's blocking your interviews. Expert resume + LinkedIn audit with a 7-day action plan.",
    url: "https://gammaprep.com/products/career-audit",
  },
};

const FEATURES = [
  {
    title: "Resume review with clear improvement points",
    description:
      "Line-by-line feedback on what's hurting your ATS score and recruiter impression.",
  },
  {
    title: "LinkedIn profile audit",
    description:
      "Headline, About, Experience - everything recruiters look at when they find you.",
  },
  {
    title: "Profile score out of 10",
    description:
      "A clear benchmark so you know exactly where you stand vs. shortlisted candidates.",
  },
  {
    title: "Target role fit analysis",
    description:
      "How aligned is your profile with the roles you're targeting? We'll tell you honestly.",
  },
  {
    title: "Top 5 gaps blocking your interviews",
    description:
      "The specific things holding you back - prioritized so you know what to fix first.",
  },
  {
    title: "7-day action plan",
    description:
      "A concrete daily plan to address your gaps and get your profile shortlist-ready.",
  },
  {
    title: "1 live 1:1 discussion with mentor",
    description:
      "A focused live call to walk through your audit results and answer your specific questions.",
  },
  {
    title: "Next steps recommendation",
    description:
      "Based on your profile, we'll recommend whether you need Sprint, Mentorship, or can go solo.",
  },
];

const PROCESS_STEPS = [
  {
    icon: Upload,
    title: "You submit",
    description:
      "After purchase, upload your resume PDF and paste your LinkedIn URL in your dashboard.",
  },
  {
    icon: FileSearch,
    title: "We review (24–48h)",
    description:
      "Our expert analyzes your resume, LinkedIn, and target role alignment in detail.",
  },
  {
    icon: CheckCircle2,
    title: "You get your report",
    description:
      "A detailed PDF report lands in your dashboard with your score, gaps, and action plan.",
  },
];

const TESTIMONIALS = [
  {
    name: "Maneesha Reddy",
    role: "Placed @ Barclays",
    quote:
      "Best ₹499 I ever spent. The 7-day action plan from the audit made everything crystal clear - no more guessing what to work on.",
  },
  {
    name: "Sumit Ashish",
    role: "Placed @ Jio",
    quote:
      "I had 3 critical gaps in my resume that I had no idea about. Fixed them in a week, got 4 interview calls the next month.",
  },
];

export default async function CareerAuditPage() {
  const serviceSupabase = createServiceClient();
  const [{ data: dbProduct }, { data: settingsRows }] = await Promise.all([
    serviceSupabase.from("products").select("price_inr, original_price").eq("slug", "career_audit").eq("is_active", true).single(),
    serviceSupabase.from("site_settings").select("key, value"),
  ]);
  const PRICE = dbProduct?.price_inr ?? 499;
  const ORIGINAL_PRICE = (dbProduct?.original_price as number | null) ?? null;
  const siteSettings: Record<string, unknown> = {};
  (settingsRows ?? []).forEach((r: { key: string; value: unknown }) => { siteSettings[r.key] = r.value; });
  const showGst = (siteSettings.show_gst as boolean) ?? true;
  const GST = showGst ? Math.round(PRICE * 0.18) : 0;
  const TOTAL = PRICE + GST;

  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-indigo-50/80 to-background">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Start here - most engineers do</Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Find out exactly what&apos;s{" "}
                <span className="gradient-primary-text">blocking your interviews</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Our experts review your resume and LinkedIn profile, identify the
                top gaps costing you interviews, and give you a clear 7-day
                action plan to fix them.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 items-center">
                <Link href="/checkout/career-audit">
                  <Button size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                    Get My Audit - {formatCurrency(PRICE)}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                {ORIGINAL_PRICE != null && ORIGINAL_PRICE > PRICE && (
                  <span className="text-muted-foreground text-sm line-through">
                    {formatCurrency(ORIGINAL_PRICE)}
                  </span>
                )}
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-green-500" />
                  Results in 24–48 hours
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-green-500" />
                  Secure payment via Cashfree
                </div>
              </div>
            </div>

            {/* Price card */}
            <Card className="border-2 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black gradient-primary-text">₹{PRICE}</span>
                    {ORIGINAL_PRICE != null && ORIGINAL_PRICE > PRICE && (
                      <span className="text-xl text-muted-foreground line-through">₹{ORIGINAL_PRICE}</span>
                    )}
                  </div>
                  {showGst && (
                    <div className="text-muted-foreground text-sm mt-1">
                      + ₹{GST} GST = ₹{TOTAL} total
                    </div>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {FEATURES.slice(0, 5).map((f) => (
                    <li key={f.title} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {f.title}
                    </li>
                  ))}
                </ul>

                <Link href="/checkout/career-audit" className="block">
                  <Button className="w-full" size="lg">
                    Get My Career Audit
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  One-time payment. No subscription. Report in your dashboard within 48h.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 px-4 border-y">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            How it works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {PROCESS_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="text-center">
                  <div className="flex justify-center mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
                      <Icon className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="text-xs font-bold text-primary mb-1">
                    Step {i + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            Everything in your audit
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex gap-3 p-4 rounded-lg border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">{f.title}</div>
                  <div className="text-muted-foreground text-xs mt-0.5">
                    {f.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            What engineers say
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

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Stop wondering. Start fixing.
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            For ₹{PRICE}, you&apos;ll know exactly what to change. Most engineers
            see results within 2 weeks of acting on the report.
          </p>
          <Link href="/checkout/career-audit">
            <Button size="xl" className="shadow-lg shadow-primary/20">
              Get My Career Audit - ₹{PRICE}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-4">
            Questions?{" "}
            <a
              href="https://wa.me/918890240404"
              className="text-primary hover:underline"
            >
              Chat with us on WhatsApp
            </a>
          </p>
        </div>
      </section>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": "https://gammaprep.com/products/career-audit#product",
            "name": "Career Audit",
            "description":
              "Expert review of your resume and LinkedIn profile. Identifies the top 5 gaps blocking your interviews and delivers a 7-day action plan. Results in 24–48 hours.",
            "brand": { "@type": "Organization", "name": "Gammaprep" },
            "url": "https://gammaprep.com/products/career-audit",
            "offers": {
              "@type": "Offer",
              "url": "https://gammaprep.com/products/career-audit",
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
                "author": { "@type": "Person", "name": "Maneesha Reddy" },
                "reviewBody":
                  "Best ₹499 I ever spent. The 7-day action plan from the audit made everything crystal clear - no more guessing what to work on.",
              },
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                },
                "author": { "@type": "Person", "name": "Sumit Ashish" },
                "reviewBody":
                  "I had 3 critical gaps in my resume that I had no idea about. Fixed them in a week, got 4 interview calls the next month.",
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
                "name": "Career Audit",
                "item": "https://gammaprep.com/products/career-audit",
              },
            ],
          }),
        }}
      />
    </div>
  );
}
