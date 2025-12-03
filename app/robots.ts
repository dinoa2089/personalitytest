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
          "/business/dashboard/",
          "/business/jobs/",
          "/business/teams/",
          "/business/settings/",
          "/business/setup/",
          "/referrals/",
          "/results/",
          "/assessment/questions/",
          "/assessment/checkpoint/",
          "/assessment/complete/",
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
          "/assessment/intro/",
          "/science/",
          "/pricing/",
          "/faq/",
          "/for-employers/",
          "/contact/",
          "/compare/",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/business/dashboard/",
          "/business/jobs/",
          "/business/teams/",
          "/business/settings/",
          "/business/setup/",
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
          "/for-employers/",
          "/pricing/",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/business/dashboard/",
          "/business/jobs/",
          "/business/teams/",
          "/results/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
