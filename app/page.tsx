import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import TestimonialMarquee from "@/components/TestimonialMarquee";
import {
  ArrowRight,
  CheckCircle2,
  Star,
  FileSearch,
  Rocket,
  Trophy,
  ChevronDown,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { createServiceClient } from "@/lib/supabase/server";

const COMPANY_LOGOS = [
  { name: "Amazon", src: "/logos/amazon.svg" },
  { name: "Microsoft", src: "/logos/microsoft.svg" },
  { name: "Google", src: "/logos/google.svg" },
  { name: "Meta", src: "/logos/meta.svg" },
  { name: "Apple", src: "/logos/apple.svg" },
  { name: "Netflix", src: "/logos/netflix.svg" },
  { name: "Uber", src: "/logos/uber.svg" },
  { name: "Adobe", src: "/logos/adobe.svg" },
  { name: "Salesforce", src: "/logos/salesforce.svg" },
  { name: "Oracle", src: "/logos/oracle.svg" },
];

export const metadata: Metadata = {
  title: "Gammaprep - Career Coaching for Software Engineers in India",
  description:
    "Get interview-ready with expert career coaching. Start with a ₹499 Career Audit, advance with our Interview Sprint, or fast-track with 1:1 Placement Mentorship.",
  alternates: {
    canonical: "https://gammaprep.com",
  },
  openGraph: {
    title: "Gammaprep - Career Coaching for Software Engineers",
    description:
      "Expert career coaching for software engineers. Resume audit, interview prep, and placement mentorship.",
  },
};

const PRODUCTS = [
  {
    slug: "career_audit",
    href: "/products/career-audit",
    icon: FileSearch,
    badge: "Start here",
    badgeVariant: "default" as const,
    name: "Career Audit",
    defaultPrice: 499,
    ctaVerb: "Get My Audit",
    tagline: "Find out exactly what's blocking your interviews",
    features: [
      "Resume review with clear improvement points",
      "LinkedIn profile audit",
      "Profile score (out of 10)",
      "Top 5 gaps blocking interviews",
      "7-day action plan",
      "1 live 1:1 discussion with mentor",
      "Recommendation on next steps",
    ],
    color: "from-blue-50 to-indigo-50",
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100",
  },
  {
    slug: "interview_sprint",
    href: "/products/interview-sprint",
    icon: Rocket,
    badge: "Most popular",
    badgeVariant: "default" as const,
    name: "Interview Sprint",
    defaultPrice: 9999,
    ctaVerb: "Start Sprint",
    tagline: "Go from zero to interview-ready in 21 days",
    features: [
      "Resume + LinkedIn optimization",
      "Target role clarity & prep strategy",
      "Most-asked questions framework",
      "2–3 live group sessions",
      "1 mock interview with feedback",
      "14–21 day execution system",
    ],
    color: "from-violet-50 to-purple-50",
    iconColor: "text-violet-600",
    iconBg: "bg-violet-100",
    highlight: true,
  },
  {
    slug: "placement_mentorship",
    href: "/products/placement-mentorship",
    icon: Trophy,
    badge: "Premium",
    badgeVariant: "secondary" as const,
    name: "Placement Mentorship",
    defaultPrice: 29999,
    ctaVerb: "Get Mentored",
    tagline: "Full 1:1 support until you get the offer",
    features: [
      "Complete profile rebuild",
      "Weekly live mentoring calls",
      "2–3 mock interviews (detailed feedback)",
      "Job application strategy + referrals",
      "Cold outreach templates",
      "Direct access for doubts",
    ],
    color: "from-amber-50 to-orange-50",
    iconColor: "text-amber-600",
    iconBg: "bg-amber-100",
  },
];


const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Get your Career Audit",
    description:
      "Start with a ₹499 expert review. Upload your resume and LinkedIn. Our experts send back a detailed gap analysis within 48 hours.",
  },
  {
    step: "02",
    title: "Follow the Interview Sprint",
    description:
      "Use the audit insights to power through our 21-day system - live sessions, mock interviews, and a daily execution plan.",
  },
  {
    step: "03",
    title: "Land your offer",
    description:
      "Apply smarter with referrals, cold outreach templates, and 1:1 mentorship keeping you accountable every week.",
  },
];

const TESTIMONIALS = [
  {
    name: "Maneesha Reddy",
    role: "Placed @ Barclays",
    quote:
      "Gammaprep's accelerated program helped me strengthen C++, OOPs, and data structures through project-based learning and made me placement-ready.",
    rating: 5,
  },
  {
    name: "Sumit Ashish",
    role: "Placed @ Jio",
    quote:
      "This course improved my data structures and algorithm skills, cleared core coding concepts, and helped me crack technical interview rounds.",
    rating: 5,
  },
  {
    name: "Priyanshi Goyal",
    role: "Placed @ Deloitte",
    quote:
      "Gammaprep made my DSA basics clear, and the interactive classes helped me improve communication and clear case-study rounds.",
    rating: 5,
  },
  {
    name: "Ritika Patil",
    role: "Placed @ Microsoft",
    quote:
      "The placement bootcamp gave me a deep understanding of coding and DSA, and mentorship support helped me at every step.",
    rating: 5,
  },
  {
    name: "Nishant Padhi",
    role: "Placed @ Walmart",
    quote:
      "The course starts from basics and includes homework, live classes, and projects. The mentor guidance was consistently supportive.",
    rating: 5,
  },
  {
    name: "Brinda A",
    role: "Placed @ Zoho",
    quote:
      "This program improved my data structures understanding and helped me solve problems on LeetCode and GeeksforGeeks during interviews.",
    rating: 5,
  },
];

function interpolatePrices(text: string, priceMap: Map<string, number>): string {
  const fmt = (slug: string, fallback: number) =>
    `₹${(priceMap.get(slug) ?? fallback).toLocaleString("en-IN")}`;
  return text
    .replace(/\{career_audit_price\}/g, fmt("career_audit", 499))
    .replace(/\{interview_sprint_price\}/g, fmt("interview_sprint", 9999))
    .replace(/\{placement_mentorship_price\}/g, fmt("placement_mentorship", 29999));
}

export default async function HomePage() {
  const serviceSupabase = createServiceClient();
  const [{ data: dbProducts }, { data: settingsRows }, { data: dbFaqs }] = await Promise.all([
    serviceSupabase.from("products").select("slug, price_inr, original_price").eq("is_active", true),
    serviceSupabase.from("site_settings").select("key, value"),
    serviceSupabase.from("faqs").select("id, question, answer").is("product_id", null).order("sort_order", { ascending: true }),
  ]);

  const priceMap = new Map((dbProducts ?? []).map((p) => [p.slug, p.price_inr]));
  const originalPriceMap = new Map((dbProducts ?? []).map((p) => [p.slug, p.original_price as number | null]));

  const settings: Record<string, unknown> = {};
  (settingsRows ?? []).forEach((r) => { settings[r.key] = r.value; });
  const showGst = (settings.show_gst as boolean) ?? true;

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/80 to-background" />
        <div className="container max-w-5xl text-center">
          <Badge className="mb-6 text-sm px-4 py-1.5">
            🚀 Career coaching for software engineers in India
          </Badge>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
            Stop guessing.{" "}
            <span className="gradient-primary-text">
              Start getting interviews.
            </span>
          </h1>
          <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Expert career coaching for software engineers. Find your gaps,
            fix them fast, and land the job you deserve.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products/career-audit">
              <Button size="xl" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                Start with Career Audit - ₹499
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="xl" variant="outline" className="w-full sm:w-auto">
                How it works
                <ChevronDown className="h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Social proof bar */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="font-medium">4.9/5</span> from 200+ reviews
            </div>
            <span className="hidden sm:block text-border">|</span>
            <span>3000+ engineers coached</span>
            <span className="hidden sm:block text-border">|</span>
            <span>Mentored by a Microsoft engineer</span>
          </div>
        </div>
      </section>

      {/* Companies bar */}
      <section className="py-14 md:py-16 border-y bg-muted/30">
        <div className="container max-w-7xl px-4">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              Our Students Work At
            </h2>
            <p className="mt-3 text-base md:text-xl text-muted-foreground">
              Top product-based companies where our alumni have been placed
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
            {COMPANY_LOGOS.map((co) => (
              <div
                key={co.name}
                className="group h-28 md:h-32 rounded-2xl border bg-card/80 flex items-center justify-center px-4 md:px-6"
              >
                <Image
                  src={co.src}
                  alt={co.name}
                  width={220}
                  height={72}
                  className="h-12 md:h-14 w-auto max-w-full object-contain grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Products */}
      <section id="products" className="py-20 px-4">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Three ways to get interview-ready
            </h2>
            <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
              Start where you are. We&apos;ll take you where you want to go.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRODUCTS.map((product) => {
              const Icon = product.icon;
              const price = priceMap.get(product.slug) ?? product.defaultPrice;
              const originalPrice = originalPriceMap.get(product.slug);
              const hasDiscount = originalPrice != null && originalPrice > price;
              return (
                <Card
                  key={product.slug}
                  className={`relative flex flex-col transition-shadow hover:shadow-lg ${
                    product.highlight
                      ? "ring-2 ring-primary shadow-lg"
                      : ""
                  }`}
                >
                  {product.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="shadow-sm px-3">Most Popular</Badge>
                    </div>
                  )}
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${product.iconBg} mb-4`}>
                      <Icon className={`h-6 w-6 ${product.iconColor}`} />
                    </div>
                    <div className="mb-1">
                      <Badge variant="outline" className="text-xs mb-2">
                        {product.badge}
                      </Badge>
                      <h3 className="text-xl font-bold">{product.name}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      {product.tagline}
                    </p>
                    <div className="mb-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold">{formatCurrency(price)}</span>
                        {hasDiscount && (
                          <span className="text-lg text-muted-foreground line-through">
                            {formatCurrency(originalPrice!)}
                          </span>
                        )}
                      </div>
                      {showGst && (
                        <span className="text-sm text-muted-foreground">+ 18% GST</span>
                      )}
                    </div>
                    <ul className="space-y-2.5 mb-8 flex-1">
                      {product.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Link href={product.href} className="mt-auto">
                      <Button
                        className="w-full"
                        variant={product.highlight ? "default" : "outline"}
                        size="lg"
                      >
                        {product.ctaVerb} - {formatCurrency(price)}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mentor */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="container max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold">Meet your mentor</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Coached by someone who&apos;s been on both sides of the interview table.
            </p>
          </div>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 shrink-0">
                  <Image
                    src="/mentor_vaibhav.png"
                    alt="Vaibhav Goyal - Career Mentor at Gammaprep"
                    width={256}
                    height={320}
                    className="w-full h-64 md:h-full object-cover object-top"
                  />
                </div>
                <div className="p-8 flex-1">
                  <h3 className="text-2xl font-bold">Vaibhav Goyal</h3>
                  <p className="text-muted-foreground text-sm mb-4">Career Coach</p>
                  <div className="flex flex-wrap gap-3 mb-5">
                    <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-sm font-semibold text-blue-800">
                      <Image src="/logos/microsoft.svg" alt="Microsoft" width={16} height={16} className="h-4 w-auto" />
                      SDE2
                    </div>
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-semibold text-red-800">
                      <Image src="/logos/oracle.svg" alt="Oracle" width={16} height={16} className="h-4 w-auto" />
                      Ex-SDE
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-6 text-sm">
                    With hands-on experience at Microsoft and Oracle, Vaibhav has been on both
                    sides of the interview table. He&apos;s personally coached 3000+ engineers,
                    helping them land roles at top product companies across India. No fluff —
                    just the exact system that works.
                  </p>
                  <a
                    href="https://www.linkedin.com/in/vaibgoyl/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <svg className="h-4 w-4 text-[#0077B5]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      Connect on LinkedIn
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-20 px-4 bg-gradient-to-b from-background to-muted/30"
      >
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">How it works</h2>
            <p className="text-muted-foreground mt-3 text-lg">
              A clear path from stuck to placed.
            </p>
          </div>

          <div className="grid md:grid-cols-3">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="relative flex flex-col items-center text-center px-4 md:px-6 pb-10 last:pb-0 md:pb-0">
                {/* Vertical connector between steps on mobile */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="md:hidden absolute left-1/2 -translate-x-1/2 top-12 bottom-0 w-px bg-border" />
                )}
                {/* Circle + horizontal connectors on desktop */}
                <div className="flex items-center justify-center w-full mb-5 relative z-10">
                  <div className={`hidden md:block flex-1 h-px ${i === 0 ? "opacity-0" : "bg-border"}`} />
                  <div className="shrink-0 h-12 w-12 flex items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm mx-2 shadow-md shadow-primary/20">
                    {step.step}
                  </div>
                  <div className={`hidden md:block flex-1 h-px ${i === HOW_IT_WORKS.length - 1 ? "opacity-0" : "bg-border"}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Link href="/products/career-audit">
              <Button size="lg" className="shadow-md shadow-primary/20">
                Start with Career Audit for ₹499 <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 overflow-hidden">
        <div className="container max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Engineers who made it happen
            </h2>
            <p className="text-muted-foreground mt-3 text-lg">
              Real results from real people.
            </p>
          </div>

          {/* Mobile: auto-scrolling marquee */}
          <div className="md:hidden -mx-4 overflow-hidden">
            <style>{`
              @keyframes testimonial-scroll {
                0%   { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .testimonial-track {
                animation: testimonial-scroll 28s linear infinite;
              }
              .testimonial-track:hover { animation-play-state: paused; }
            `}</style>
            <div className="flex testimonial-track gap-4 w-max px-4">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={`${t.name}-${i}`} className="flex-shrink-0 w-72">
                  <Card className="p-5 h-full">
                    <div className="flex mb-3">
                      {[...Array(t.rating)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground mb-4 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-muted-foreground text-xs">{t.role}</div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="p-6">
                <div className="flex mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-foreground mb-4 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-muted-foreground text-xs">{t.role}</div>
                </div>
              </Card>
            ))}
          </div>

        </div>

        {/* Screenshot marquee */}
        <div className="mt-12 -mx-4">
          <p className="text-center text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Real screenshots from our students
          </p>
          <TestimonialMarquee />
          <div className="text-center mt-8">
            <Link href="/stories" className="text-primary text-sm hover:underline font-medium">
              Read all reviews →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Frequently asked questions
            </h2>
          </div>

          <div className="space-y-4">
            {(dbFaqs ?? []).map((faq) => (
              <details
                key={faq.id}
                className="group bg-background rounded-xl border p-6 open:shadow-sm"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none font-semibold">
                  {faq.question}
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180 flex-shrink-0 ml-4" />
                </summary>
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                  {interpolatePrices(faq.answer, priceMap)}
                </p>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq" className="text-primary text-sm hover:underline font-medium">
              View all FAQs →
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4">
        <div className="container max-w-3xl text-center">
          <div className="gradient-primary rounded-3xl px-6 py-10 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Ready to find out what&apos;s blocking you?
            </h2>
            <p className="text-white/80 text-base sm:text-lg mb-8">
              Start with a ₹499 Career Audit. Get your gaps, your action plan,
              and clarity - in 48 hours.
            </p>
            <Link href="/products/career-audit" className="block w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto sm:text-base sm:h-14 sm:px-10 sm:font-semibold bg-white text-primary hover:bg-white/90 shadow-lg"
              >
                Get My Career Audit - ₹499
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <p className="mt-4 text-white/60 text-sm">
              No long-term commitment. Start learning in 48 hours.
            </p>
          </div>
        </div>
      </section>

      {/* WhatsApp float */}
      <a
        href="https://wa.me/918890240404"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        <svg className="h-7 w-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>

      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": "https://gammaprep.com/#organization",
            "name": "Gammaprep",
            "url": "https://gammaprep.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://gammaprep.com/gammaprep_logo_main.png",
              "width": 280,
              "height": 80,
            },
            "description":
              "Career coaching platform for software engineers in India. Expert interview preparation, resume audit, and placement mentorship by a Microsoft SDE2.",
            "areaServed": { "@type": "Country", "name": "India" },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-88902-40404",
              "contactType": "customer support",
              "availableLanguage": "English",
            },
            "sameAs": [
              "https://www.instagram.com/gammaprep_placement/",
              "https://www.linkedin.com/company/gammaprep-com/",
              "https://www.facebook.com/Gammaprepcom-100658998882595/",
              "https://www.youtube.com/channel/UCH3r-pLuC_JH_uh09P49EbA/videos",
              "https://www.quora.com/How-is-the-Gammaprep-placement-preparation-course",
            ],
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "200",
              "bestRating": "5",
              "worstRating": "1",
            },
            "knowsAbout": [
              "Software Engineering Interview Preparation",
              "Career Coaching for Software Engineers",
              "Resume Review India",
              "FAANG Interview Preparation",
              "System Design Interview Coaching",
              "DSA Interview Preparation",
              "Placement Mentorship India",
            ],
            "mentions": [
              { "@type": "Organization", "name": "Amazon" },
              { "@type": "Organization", "name": "Microsoft" },
              { "@type": "Organization", "name": "Google" },
              { "@type": "Organization", "name": "Meta" },
              { "@type": "Organization", "name": "Apple" },
              { "@type": "Organization", "name": "Netflix" },
              { "@type": "Organization", "name": "Uber" },
              { "@type": "Organization", "name": "Adobe" },
              { "@type": "Organization", "name": "Salesforce" },
              { "@type": "Organization", "name": "Oracle" },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "@id": "https://gammaprep.com/#vaibhav-goyal",
            "name": "Vaibhav Goyal",
            "jobTitle": "Career Coach & Software Development Engineer",
            "worksFor": [{ "@type": "Organization", "name": "Microsoft" }],
            "alumniOf": [{ "@type": "Organization", "name": "Oracle" }],
            "url": "https://gammaprep.com",
            "sameAs": ["https://www.linkedin.com/in/vaibgoyl/"],
            "description":
              "Microsoft SDE2 and career coach who has personally coached 3000+ software engineers in India to land roles at top product companies.",
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "@id": "https://gammaprep.com/#website",
            "url": "https://gammaprep.com",
            "name": "Gammaprep",
            "description":
              "Career coaching for software engineers in India. Resume audit, interview prep, and placement mentorship.",
            "publisher": { "@id": "https://gammaprep.com/#organization" },
            "speakable": {
              "@type": "SpeakableSpecification",
              "cssSelector": ["h1", ".hero-description"],
            },
          }),
        }}
      />
    </div>
  );
}
