export interface Technology {
  name: string;
  logo?: string;
  label?: string;
}

// Local copies of Simple Icons (CC0); see public/images/tech/README.md.
export const technologies: Technology[] = [
  { name: 'Google Analytics 4', logo: '/images/tech/google-analytics.svg' },
  { name: 'Google Tag Manager', logo: '/images/tech/google-tag-manager.svg' },
  { name: 'Server-Side GTM', logo: '/images/tech/google-tag-manager.svg', label: 'sGTM' },
  { name: 'Meta Conversions API', logo: '/images/tech/meta.svg', label: 'CAPI' },
  { name: 'Segment', label: 'SEG' },
  { name: 'Tealium', label: 'T' },
  { name: 'Shopify', logo: '/images/tech/shopify.svg' },
  { name: 'WooCommerce', logo: '/images/tech/woocommerce.svg' },
  { name: 'Consent Mode v2', logo: '/images/tech/google-analytics.svg', label: 'CM' },
  { name: 'Looker Studio', logo: '/images/tech/looker-studio.svg' },
  { name: 'BigQuery', logo: '/images/tech/bigquery.svg' },
  { name: 'Custom Platforms', label: 'API' },
];
