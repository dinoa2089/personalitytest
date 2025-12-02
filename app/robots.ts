import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prism7test.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/business/",
          "/referrals/",
          "/results/",
          "/assessment/questions/",
          "/comparison/",
          "/sign-in/",
          "/sign-up/",
        ],
      },
      {
        // Googlebot specific rules - allow everything we want indexed
        userAgent: "Googlebot",
        allow: [
          "/",
          "/type/",
          "/blog/",
          "/assessment/",
          "/science/",
          "/pricing/",
          "/faq/",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/business/",
          "/results/",
          "/sign-in/",
          "/sign-up/",
        ],
      },
      {
        // Bingbot - same rules
        userAgent: "Bingbot",
        allow: [
          "/",
          "/type/",
          "/blog/",
          "/assessment/",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/business/",
          "/results/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
