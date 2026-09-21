export interface Technology {
  key: string;
  name: string;
  logo: string;
  label?: string;
}

// Local CC0 Simple Icons or product marks. They remain decorative beside text.
// See public/images/tech/README.md for sources and trademark notice.
export const technologyCatalog = {
  googleAnalytics: { key: 'googleAnalytics', name: 'Google Analytics 4', logo: '/images/tech/google-analytics.svg' },
  googleTagManager: { key: 'googleTagManager', name: 'Google Tag Manager', logo: '/images/tech/google-tag-manager.svg' },
  serverSideGtm: { key: 'serverSideGtm', name: 'Server-Side GTM', logo: '/images/tech/server-side-gtm.svg', label: 'sGTM' },
  metaCapi: { key: 'metaCapi', name: 'Meta Pixel / CAPI', logo: '/images/tech/meta.svg', label: 'CAPI' },
  segment: { key: 'segment', name: 'Segment', logo: '/images/tech/segment.svg' },
  tealium: { key: 'tealium', name: 'Tealium', logo: '/images/tech/tealium.svg' },
  shopify: { key: 'shopify', name: 'Shopify', logo: '/images/tech/shopify.svg' },
  woocommerce: { key: 'woocommerce', name: 'WooCommerce', logo: '/images/tech/woocommerce.svg' },
  consentMode: { key: 'consentMode', name: 'Google Consent Mode v2', logo: '/images/tech/google-consent-mode.svg' },
  lookerStudio: { key: 'lookerStudio', name: 'Google Data Studio', logo: '/images/tech/looker-studio.svg' },
  bigQuery: { key: 'bigQuery', name: 'BigQuery', logo: '/images/tech/bigquery.svg' },
  cookiebot: { key: 'cookiebot', name: 'Usercentrics Cookiebot', logo: '/images/tech/cookiebot.svg' },
  tiktok: { key: 'tiktok', name: 'TikTok', logo: '/images/tech/tiktok.svg' },
  snapchat: { key: 'snapchat', name: 'Snapchat', logo: '/images/tech/snapchat.svg' },
  linkedin: { key: 'linkedin', name: 'LinkedIn', logo: '/images/tech/linkedin.svg' },
  wordpress: { key: 'wordpress', name: 'WordPress', logo: '/images/tech/wordpress.svg' },
  customPlatform: { key: 'customPlatform', name: 'Custom Websites', logo: '/images/tech/custom-platform.svg', label: 'API' },
} as const satisfies Record<string, Technology>;

export type TechnologyKey = keyof typeof technologyCatalog;

export function selectTechnologies(keys: readonly TechnologyKey[]): Technology[] {
  return keys.map((key) => technologyCatalog[key]);
}

export const technologies = Object.values(technologyCatalog);
