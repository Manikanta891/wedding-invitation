import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://mybelovedinvitations.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/templates", "/contact", "/preview/"],
        disallow: ["/admin", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

