import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Mic,
  Rocket,
  Shield,
  Star,
  Users,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createServiceClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Interview Sprint - 21-Day Interview Prep Program for Engineers",
  description:
    "Go from zero to interview-ready in 21 days. Live sessions, mock interview, structured prep plan for software engineers. ₹9,999.",
  keywords: [
    "interview preparation course India",
    "mock interview software engineer",
    "interview sprint online",
    "coding interview prep India",
    "system design interview prep",
    "21 day interview prep",
    "DSA preparation India",
    "interview coaching program India",
  ],
  alternates: {
    canonical: "https://gammaprep.com/products/interview-sprint",
  },
  openGraph: {
    title: "Interview Sprint - 21-Day Interview Prep for Engineers",
    description:
      "Live sessions, mock interview, and a structured 21-day plan to get interview-ready fast.",
    url: "https://gammaprep.com/products/interview-sprint",
  },
};

const FEATURES = [
  {
    icon: CheckCircle2,
    title: "Resume + LinkedIn optimization",
    description: "Practical fixes based on your audit gaps",
  },
  {
    icon: Rocket,
    title: "Target role clarity",
    description: "Exactly what to prepare and what to ignore",
  },
  {
    icon: CheckCircle2,
    title: "Interview questions framework",
    description: "The most-asked questions by type, with answer structures",
  },
  {
    icon: Users,
    title: "2–3 live group sessions",
    description: "Interactive sessions with expert instructors",
  },
  {
    icon: Mic,
    title: "1 mock interview",
    description: "A real interview simulation with detailed feedback",
  },
  {
    icon: Calendar,
    title: "14–21 day execution system",
    description: "A daily plan so you know exactly what to do each day",
  },
];

const TIMELINE = [
  {
    week: "Week 1",
    label: "Profile & Foundation",
    items: [
      "Resume & LinkedIn rewrite",
      "Identify your target role stack",
      "Set your 3-week prep goals",
    ],
  },
  {
    week: "Week 2",
    label: "Technical Prep",
    items: [
      "DSA fundamentals + most-asked patterns",
      "System design intro",
      "Live Group Session 1",
    ],
  },
  {
    week: "Week 3",
    label: "Interview Simulation",
    items: [
      "Mock interview + full feedback",
      "HR & behavioral prep",
      "Final session + strategy for applications",
    ],
  },
];

const TESTIMONIALS = [
  {
    name: "Priyanshi Goyal",
    role: "Placed @ Deloitte",
    quote:
      "Interview Sprint in 3 weeks, offer in week 4. The mock interview feedback was brutally honest and exactly what I needed.",
  },
  {
    name: "Brinda A",
    role: "Placed @ Zoho",
    quote:
      "The group sessions are high quality and the instructor actually knows what interviewers at top companies look for.",
  },
];

export default async function InterviewSprintPage() {
  const serviceSupabase = createServiceClient();
  const [{ data: dbProduct }, { data: settingsRows }] = await Promise.all([
    serviceSupabase.from("products").select("price_inr, original_price").eq("slug", "interview_sprint").eq("is_active", true).single(),
    serviceSupabase.from("site_settings").select("key, value"),
  ]);
  const PRICE = dbProduct?.price_inr ?? 9999;
  const ORIGINAL_PRICE = (dbProduct?.original_price as number | null) ?? null;
  const siteSettings: Record<string, unknown> = {};
  (settingsRows ?? []).forEach((r: { key: string; value: unknown }) => { siteSettings[r.key] = r.value; });
  const showGst = (siteSettings.show_gst as boolean) ?? true;
  const GST = showGst ? Math.round(PRICE * 0.18) : 0;
  const TOTAL = PRICE + GST;

  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-violet-50/80 to-background">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-violet-600">Most popular</Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Go from zero to{" "}
                <span className="gradient-primary-text">interview-ready</span>{" "}
                in 21 days
              </h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                A structured 3-week program with live sessions, a mock
                interview, and daily execution plan designed for software
                engineers targeting product companies.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/checkout/interview-sprint">
                  <Button size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                    Start Sprint - {formatCurrency(PRICE)}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-violet-500" />
                  Small groups (max 20 per batch)
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
                    <span className="text-5xl font-black gradient-primary-text">₹{PRICE.toLocaleString("en-IN")}</span>
                    {ORIGINAL_PRICE != null && ORIGINAL_PRICE > PRICE && (
                      <span className="text-xl text-muted-foreground line-through">₹{ORIGINAL_PRICE.toLocaleString("en-IN")}</span>
                    )}
                  </div>
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
                <Link href="/checkout/interview-sprint" className="block">
                  <Button className="w-full" size="lg">
                    Start Your Sprint
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  New batch starts every 2 weeks. Limited seats per batch.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4 border-y">
        <div className="container max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            Your 21-day roadmap
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TIMELINE.map((week, i) => (
              <Card key={week.week} className="p-6 relative">
                <div className="text-xs font-bold text-primary mb-1">{week.week}</div>
                <h3 className="font-semibold mb-4">{week.label}</h3>
                <ul className="space-y-2">
                  {week.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container max-w-3xl">
          <h2 className="text-2xl font-bold text-center mb-10">
            Sprint success stories
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

      {/* Audit nudge */}
      <section className="py-10 px-4">
        <div className="container max-w-3xl">
          <Card className="border-dashed border-2 p-6 flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1">
              <div className="font-semibold mb-1">
                Haven&apos;t done your Career Audit yet?
              </div>
              <p className="text-sm text-muted-foreground">
                Start with the ₹499 Audit to find your specific gaps. Then use the
                Sprint to fix them - it&apos;s 2x more effective that way.
              </p>
            </div>
            <Link href="/products/career-audit">
              <Button variant="outline" className="whitespace-nowrap">
                View Career Audit
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to get interview-ready?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join the next batch. Limited seats per cohort.
          </p>
          <Link href="/checkout/interview-sprint">
            <Button size="xl" className="shadow-lg shadow-primary/20">
              Start Interview Sprint - {formatCurrency(PRICE)}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "@id": "https://gammaprep.com/products/interview-sprint#product",
            "name": "Interview Sprint",
            "description":
              "21-day structured interview prep program for software engineers. Live group sessions, 1 mock interview with detailed feedback, DSA prep, and a daily execution plan.",
            "brand": { "@type": "Organization", "name": "Gammaprep" },
            "url": "https://gammaprep.com/products/interview-sprint",
            "offers": {
              "@type": "Offer",
              "url": "https://gammaprep.com/products/interview-sprint",
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
                "author": { "@type": "Person", "name": "Priyanshi Goyal" },
                "reviewBody":
                  "Interview Sprint in 3 weeks, offer in week 4. The mock interview feedback was brutally honest and exactly what I needed.",
              },
              {
                "@type": "Review",
                "reviewRating": {
                  "@type": "Rating",
                  "ratingValue": "5",
                  "bestRating": "5",
                },
                "author": { "@type": "Person", "name": "Brinda A" },
                "reviewBody":
                  "The group sessions are high quality and the instructor actually knows what interviewers at top companies look for.",
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
                "name": "Interview Sprint",
                "item": "https://gammaprep.com/products/interview-sprint",
              },
            ],
          }),
        }}
      />
    </div>
  );
}
