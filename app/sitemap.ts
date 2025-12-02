import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prism7test.com";

// Personality type slugs for dynamic pages
const personalityTypes = [
  "innovator",
  "architect", 
  "catalyst",
  "diplomat",
  "analyst",
  "advocate",
  "commander",
  "mediator",
  "performer",
  "protector",
  "explorer",
  "sentinel",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/assessment`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/assessment/intro`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/science`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/blog/why-most-personality-tests-fall-short`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/compare`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic personality type pages
  const typePages: MetadataRoute.Sitemap = personalityTypes.map((type) => ({
    url: `${siteUrl}/type/${type}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...typePages];
}

