export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Upsight Digital",
  url: "https://upsight.digital",
  logo: "https://upsight.digital/images/logo.png",
  description: "Digital analytics consultancy specializing in server-side tracking, GA4, Meta CAPI, and privacy-compliant analytics solutions.",
  foundingDate: "2019",
  areaServed: "Worldwide",
  serviceType: ["Server-Side Tracking", "Google Analytics 4", "Meta Conversions API", "Cookie Consent Management", "Tracking Audits", "Custom Dashboards"],
  sameAs: ["https://www.linkedin.com/company/upsight-digital"],
};

export const serviceSchema = (name: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description,
  provider: { "@type": "Organization", name: "Upsight Digital", url: "https://upsight.digital" },
  areaServed: "Worldwide",
});

export const caseStudySchema = (name: string, description: string, client: string, industry: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: name,
  description,
  author: { "@type": "Organization", name: "Upsight Digital" },
  publisher: { "@type": "Organization", name: "Upsight Digital", url: "https://upsight.digital" },
  about: { "@type": "Organization", name: client, industry },
});

export const caseStudiesCollectionSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Analytics Case Studies",
  description: "Analytics and tracking case studies from Upsight Digital.",
  url: "https://upsight.digital/case-studies",
};
