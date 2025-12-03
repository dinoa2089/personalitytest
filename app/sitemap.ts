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

// Content topics for each type
const contentTopics = [
  "learning",
  "careers",
  "relationships",
  "communication",
  "stress",
  "leadership",
  "growth",
  "workplace",
  "compatibility",
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
      url: `${siteUrl}/for-employers`,
      lastModified: currentDate,
      changeFrequency: "weekly",
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

  // PRISM-7 topic pages (108 pages: 12 types × 9 topics)
  const prismTopicPages: MetadataRoute.Sitemap = prismTypes.flatMap((type) =>
    contentTopics.map((topic) => ({
      url: `${siteUrl}/type/${type}/${topic}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // MBTI type pages (high priority - lots of search traffic)
  const mbtiTypePages: MetadataRoute.Sitemap = mbtiTypes.map((type) => ({
    url: `${siteUrl}/type/mbti/${type}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // MBTI topic pages (144 pages: 16 types × 9 topics)
  const mbtiTopicPages: MetadataRoute.Sitemap = mbtiTypes.flatMap((type) =>
    contentTopics.map((topic) => ({
      url: `${siteUrl}/type/mbti/${type}/${topic}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Enneagram type pages (high priority - lots of search traffic)
  const enneagramTypePages: MetadataRoute.Sitemap = enneagramTypes.map((type) => ({
    url: `${siteUrl}/type/enneagram/${type}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Enneagram topic pages (81 pages: 9 types × 9 topics)
  const enneagramTopicPages: MetadataRoute.Sitemap = enneagramTypes.flatMap((type) =>
    contentTopics.map((topic) => ({
      url: `${siteUrl}/type/enneagram/${type}/${topic}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  );

  // Total: 12 static + 12 PRISM main + 108 PRISM topics + 16 MBTI main + 144 MBTI topics + 9 Enneagram main + 81 Enneagram topics
  // = 12 + 12 + 108 + 16 + 144 + 9 + 81 = 382 URLs
  return [
    ...staticPages, 
    ...prismTypePages,
    ...prismTopicPages,
    ...mbtiTypePages,
    ...mbtiTopicPages,
    ...enneagramTypePages,
    ...enneagramTopicPages,
  ];
}
