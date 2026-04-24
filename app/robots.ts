import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/admin/", "/checkout/", "/api/", "/onboarding/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
