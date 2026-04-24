import { createClient } from "@/lib/supabase/server";
import { Star } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "200+ Student Reviews & Success Stories | Gammaprep",
  description:
    "Read verified reviews from software engineers coached by Gammaprep. Students placed at Amazon, Microsoft, Google, Meta, Deloitte, Zoho, Walmart, Barclays, and more. 4.9/5 from 200+ reviews.",
  keywords: [
    "gammaprep reviews",
    "gammaprep testimonials",
    "career coaching reviews India",
    "software engineer placement reviews",
    "gammaprep student success stories",
    "is gammaprep worth it",
  ],
  alternates: {
    canonical: "https://gammaprep.com/testimonials",
  },
  openGraph: {
    title: "200+ Verified Reviews from Placed Engineers | Gammaprep",
    description:
      "Real results. Real placements. 4.9/5 from 200+ verified reviews from software engineers placed at top companies.",
    url: "https://gammaprep.com/testimonials",
  },
};

const COMPANY_COLORS: Record<string, string> = {
  google: "bg-blue-100 text-blue-800",
  microsoft: "bg-purple-100 text-purple-800",
  amazon: "bg-orange-100 text-orange-800",
  meta: "bg-blue-100 text-blue-800",
  flipkart: "bg-yellow-100 text-yellow-800",
  default: "bg-gray-100 text-gray-800",
};

function companyColor(company: string) {
  const key = company.toLowerCase();
  return COMPANY_COLORS[key] ?? COMPANY_COLORS.default;
}

export default async function TestimonialsPage() {
  const supabase = createClient();

  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("id, name, role, company, content, rating, product_id, products(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-3">Student Success Stories</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {(testimonials ?? []).length}+ software engineers have transformed their careers with
            Gammaprep. Here&apos;s what they say.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(testimonials ?? []).map((t) => (
            <div
              key={t.id}
              className="rounded-xl border bg-background p-5 flex flex-col gap-3"
            >
              {/* Stars */}
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                &ldquo;{t.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${companyColor(
                    t.company ?? ""
                  )}`}
                >
                  {t.company}
                </span>
              </div>

              {/* Product tag */}
              {t.products && (
                <div className="text-xs text-primary border-t pt-2">
                  {(t.products as { name: string }).name}
                </div>
              )}
            </div>
          ))}
        </div>

        {(testimonials ?? []).length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            Success stories coming soon.
          </div>
        )}
      </div>
    </div>
  );
}
