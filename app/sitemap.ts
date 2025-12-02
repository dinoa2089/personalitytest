import { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prism7test.com";

// PRISM-7 personality type slugs
const prismTypes = [
  "innovator",
  "architect", 
  "catalyst",
  "strategist",
  "connector",
  "guardian",
  "explorer",
  "stabilizer",
  "visionary",
  "harmonizer",
  "achiever",
  "analyst",
];

// MBTI types
const mbtiTypes = [
  "intj", "intp", "entj", "entp",
  "infj", "infp", "enfj", "enfp",
  "istj", "isfj", "estj", "esfj",
  "istp", "isfp", "estp", "esfp",
];

// Enneagram types
const enneagramTypes = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

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

  // PRISM-7 personality type pages (high priority - our main types)
  const prismTypePages: MetadataRoute.Sitemap = prismTypes.map((type) => ({
    url: `${siteUrl}/type/${type}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // MBTI type pages (high priority - lots of search traffic)
  const mbtiTypePages: MetadataRoute.Sitemap = mbtiTypes.map((type) => ({
    url: `${siteUrl}/type/mbti/${type}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Enneagram type pages (high priority - lots of search traffic)
  const enneagramTypePages: MetadataRoute.Sitemap = enneagramTypes.map((type) => ({
    url: `${siteUrl}/type/enneagram/${type}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    ...staticPages, 
    ...prismTypePages, 
    ...mbtiTypePages, 
    ...enneagramTypePages
  ];
}
