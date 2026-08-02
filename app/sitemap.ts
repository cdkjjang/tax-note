import type { MetadataRoute } from "next";
import { guides } from "@/lib/guides";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/calc/year-end`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/income-tax`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/vat`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/calc/gift-tax`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/guide`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE_URL}/editorial`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${SITE_URL}/guide/${g.slug}`,
    lastModified: g.updated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...guidePages];
}
