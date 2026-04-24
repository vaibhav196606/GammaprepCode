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
import { formatCurrency } from "@/lib/utils";
import { createServiceClient } from "@/lib/supabase/server";

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
  const serviceSupabase = createServiceClient();
  const [{ data: dbProduct }, { data: settingsRows }] = await Promise.all([
    serviceSupabase.from("products").select("price_inr, original_price").eq("slug", "placement_mentorship").eq("is_active", true).single(),
    serviceSupabase.from("site_settings").select("key, value"),
  ]);
  const PRICE = dbProduct?.price_inr ?? 29999;
  const ORIGINAL_PRICE = (dbProduct?.original_price as number | null) ?? null;
  const siteSettings: Record<string, unknown> = {};
  (settingsRows ?? []).forEach((r: { key: string; value: unknown }) => { siteSettings[r.key] = r.value; });
  const showGst = (siteSettings.show_gst as boolean) ?? true;
  const GST = showGst ? Math.round(PRICE * 0.18) : 0;
  const TOTAL = PRICE + GST;

  return (
    <div>
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-b from-amber-50/80 to-background">
        <div className="container max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-amber-600">Premium - Full support</Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Full 1:1 support until{" "}
                <span className="gradient-primary-text">you get the offer</span>
              </h1>
              <p className="text-lg text-muted-foreground mt-4 leading-relaxed">
                Complete profile rebuild, weekly personal calls, 2–3 mock
                interviews, job referrals, and direct mentor access. Everything
                you need to stop trying alone and start getting placed.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/checkout/placement-mentorship">
                  <Button size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                    Get Mentored - {formatCurrency(PRICE)}
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
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
                <Link href="/checkout/placement-mentorship" className="block">
                  <Button className="w-full" size="lg">
                    Start Your Mentorship
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-4">
                  Limited spots. Not sure? Chat with us on WhatsApp first.
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
                Start with the Interview Sprint at ₹9,999. Many students upgrade
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

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready for full 1:1 support?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Limited to 5 mentees at a time. Apply now to secure your spot.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/checkout/placement-mentorship">
              <Button size="xl" className="shadow-lg shadow-primary/20">
                Get Mentored - {formatCurrency(PRICE)}
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
