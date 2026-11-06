import { MetadataRoute } from "next";
import { defaultTemplates } from "@/lib/defaultTemplates";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mybelovedinvitations.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const templateRoutes: MetadataRoute.Sitemap = defaultTemplates.map((t) => ({
    url: `${baseUrl}/templates/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const previewRoutes: MetadataRoute.Sitemap = defaultTemplates.map((t) => ({
    url: `${baseUrl}/preview/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...templateRoutes, ...previewRoutes];
}
