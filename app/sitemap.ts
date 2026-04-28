import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://gammaprep.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
      lastModified: new Date("2025-04-01"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/products/career-audit`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/products/interview-sprint`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/products/placement-mentorship`,
      lastModified: new Date("2025-03-01"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date("2025-04-01"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/stories`,
      lastModified: new Date("2025-04-01"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date("2024-01-01"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastModified: new Date("2024-01-01"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: new Date("2024-01-01"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
