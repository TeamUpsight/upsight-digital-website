const SITE_URL = "https://upsight.digital";
const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Upsight Digital",
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/images/logo-optimized.webp`,
    width: 400,
    height: 85,
  },
  image: `${SITE_URL}/images/hero_analytics_abstract.webp`,
  description:
    "Digital analytics consultancy specializing in server-side tracking, GA4, Meta Conversions API, consent management, ecommerce measurement, tracking audits, and analytics reporting.",
  foundingDate: "2019",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dubai",
    addressCountry: "AE",
  },
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    email: "team@upsight.digital",
    telephone: "+971568525950",
    availableLanguage: "English",
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Google Analytics 4",
    "Google Tag Manager",
    "Server-Side Google Tag Manager",
    "Meta Conversions API",
    "Consent Mode v2",
    "Ecommerce Analytics",
    "Digital Analytics",
    "Marketing Attribution",
    "Looker Studio",
    "BigQuery",
  ],
  sameAs: [
    "https://www.linkedin.com/company/upsight-digital",
    "https://www.facebook.com/upsightdigital",
  ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "Upsight Digital",
  alternateName: "Upsight Digital Analytics",
  url: `${SITE_URL}/`,
  publisher: { "@id": ORG_ID },
  inLanguage: "en",
};

export const serviceSchema = (name: string, description: string, url?: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  ...(url ? { url } : {}),
  provider: { "@id": ORG_ID },
  areaServed: "Worldwide",
  serviceType: name,
});

export const caseStudySchema = (
  name: string,
  description: string,
  client: string,
  industry: string,
  url?: string,
  image?: string,
) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: name,
  description,
  ...(url ? { url, mainEntityOfPage: { "@type": "WebPage", "@id": url } } : {}),
  ...(image ? { image } : {}),
  author: { "@id": ORG_ID },
  publisher: { "@id": ORG_ID },
  about: { "@type": "Organization", name: client, industry },
  inLanguage: "en",
});

export const caseStudiesCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Analytics Case Studies",
  description: "Analytics and tracking case studies from Upsight Digital.",
  url: `${SITE_URL}/case-studies`,
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Slice analytics transformation",
        url: `${SITE_URL}/case-studies/slice`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Roadsurfer analytics transformation",
        url: `${SITE_URL}/case-studies/roadsurfer`,
      },
    ],
  },
};
