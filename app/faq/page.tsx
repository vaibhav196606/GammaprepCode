import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import { HelpCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Career Audit, Interview Sprint & Placement Mentorship | Gammaprep",
  description:
    "Frequently asked questions about Gammaprep's career coaching services. Learn about Career Audit (₹499), Interview Sprint, Placement Mentorship, pricing, and refund policy.",
  keywords: [
    "gammaprep FAQ",
    "career audit questions",
    "interview sprint FAQ",
    "placement mentorship India questions",
    "career coaching India FAQ",
    "gammaprep pricing",
    "is gammaprep worth it",
  ],
  alternates: {
    canonical: "https://gammaprep.com/faq",
  },
};

function interpolatePrices(text: string, priceMap: Map<string, number>): string {
  const fmt = (slug: string, fallback: number) =>
    `₹${(priceMap.get(slug) ?? fallback).toLocaleString("en-IN")}`;
  return text
    .replace(/\{career_audit_price\}/g, fmt("career_audit", 499))
    .replace(/\{interview_sprint_price\}/g, fmt("interview_sprint", 9999))
    .replace(/\{placement_mentorship_price\}/g, fmt("placement_mentorship", 29999));
}

export default async function FaqPage() {
  const supabase = createClient();
  const serviceSupabase = createServiceClient();

  const [{ data: faqs }, { data: dbProducts }, { data: siteSettings }] = await Promise.all([
    supabase
      .from("faqs")
      .select("id, question, answer, product_id, products(name)")
      .order("sort_order", { ascending: true }),
    serviceSupabase.from("products").select("slug, price_inr").eq("is_active", true),
    serviceSupabase.from("site_settings").select("key, value").eq("key", "whatsapp_link").maybeSingle(),
  ]);

  const whatsappLink =
    (siteSettings?.value as string | undefined) ?? "https://wa.me/919XXXXXXXXX";

  const priceMap = new Map((dbProducts ?? []).map((p) => [p.slug, p.price_inr]));

  const general = (faqs ?? []).filter((f) => !f.product_id);
  const byProduct: Record<string, typeof faqs> = {};
  (faqs ?? [])
    .filter((f) => f.product_id)
    .forEach((f) => {
      const name = (f.products as { name: string } | null)?.name ?? "Other";
      if (!byProduct[name]) byProduct[name] = [];
      byProduct[name]!.push(f);
    });

  return (
    <div className="min-h-screen py-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Can&apos;t find what you&apos;re looking for?{" "}
            <a href={whatsappLink} className="text-primary hover:underline">
              Chat with us on WhatsApp
            </a>
          </p>
        </div>

        {/* General FAQs */}
        {general.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-semibold mb-4">General</h2>
            <div className="space-y-3">
              {general.map((f) => (
                <details
                  key={f.id}
                  className="group rounded-xl border bg-background px-5 py-4 cursor-pointer"
                >
                  <summary className="flex items-center justify-between font-medium text-sm list-none">
                    {f.question}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform ml-2 shrink-0">
                      ▾
                    </span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {interpolatePrices(f.answer, priceMap)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Product-specific FAQs */}
        {Object.entries(byProduct).map(([productName, items]) => (
          <div key={productName} className="mb-10">
            <h2 className="text-lg font-semibold mb-4">{productName}</h2>
            <div className="space-y-3">
              {(items ?? []).map((f) => (
                <details
                  key={f.id}
                  className="group rounded-xl border bg-background px-5 py-4 cursor-pointer"
                >
                  <summary className="flex items-center justify-between font-medium text-sm list-none">
                    {f.question}
                    <span className="text-muted-foreground group-open:rotate-180 transition-transform ml-2 shrink-0">
                      ▾
                    </span>
                  </summary>
                  <div className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {interpolatePrices(f.answer, priceMap)}
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}

        {/* Fallback */}
        {(faqs ?? []).length === 0 && (
          <div className="text-center text-muted-foreground py-16">
            FAQs coming soon.
          </div>
        )}
      </div>

      {/* FAQPage structured data */}
      {(faqs ?? []).length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": (faqs ?? []).map((f) => ({
                "@type": "Question",
                "name": f.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": interpolatePrices(f.answer, priceMap),
                },
              })),
            }),
          }}
        />
      )}
    </div>
  );
}
