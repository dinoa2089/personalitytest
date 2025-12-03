/**
 * Global Structured Data Components for SEO
 * Implements Organization, WebSite, and SearchAction schemas
 */

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://prism7test.com";

export function GlobalStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": "PRISM-7",
        "alternateName": "PRISM-7 Personality Assessment",
        "url": siteUrl,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/logo.png`,
          "width": 512,
          "height": 512
        },
        "description": "Scientifically validated personality assessment based on the HEXACO+ model of personality psychology.",
        "foundingDate": "2024",
        "sameAs": [
          "https://twitter.com/prism7test"
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "url": `${siteUrl}/contact`
        }
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "PRISM-7",
        "description": "Discover your authentic self with PRISM-7, a scientifically validated personality assessment.",
        "publisher": {
          "@id": `${siteUrl}/#organization`
        },
        "inLanguage": "en-US",
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": `${siteUrl}/type/{search_term_string}`
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "WebApplication",
        "@id": `${siteUrl}/#assessment`,
        "name": "PRISM-7 Personality Assessment",
        "url": `${siteUrl}/assessment`,
        "applicationCategory": "HealthApplication",
        "operatingSystem": "Any",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free personality assessment with basic results"
        },
        "featureList": [
          "Scientifically validated HEXACO+ assessment",
          "7 personality dimensions measured",
          "Dimensional scores with confidence intervals",
          "12 personality archetypes",
          "Career and relationship insights"
        ],
        "screenshot": `${siteUrl}/og-image.png`,
        "provider": {
          "@id": `${siteUrl}/#organization`
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${siteUrl}${item.url}`
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <nav aria-label="Breadcrumb" className={`text-sm ${className}`}>
        <ol className="flex items-center space-x-2 text-muted-foreground">
          {items.map((item, index) => (
            <li key={item.url} className="flex items-center">
              {index > 0 && (
                <svg
                  className="h-4 w-4 mx-2 text-muted-foreground/50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {index === items.length - 1 ? (
                <span className="text-foreground font-medium">{item.name}</span>
              ) : (
                <a
                  href={item.url}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}

interface PersonSchemaProps {
  name: string;
  description: string;
  image?: string;
  url?: string;
  jobTitle?: string;
}

export function PersonSchema({ name, description, image, url, jobTitle }: PersonSchemaProps) {
  const personData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": name,
    "description": description,
    ...(image && { "image": image }),
    ...(url && { "url": url }),
    ...(jobTitle && { "jobTitle": jobTitle })
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(personData) }}
    />
  );
}



