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
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

