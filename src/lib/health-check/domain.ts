export type HealthCheckAnswers = Record<string, string | string[]>;

// Types
export interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: "single" | "multi" | "input";
  options?: { value: string; label: string }[];
  condition?: (answers: HealthCheckAnswers) => boolean;
  validation?: (value: string) => boolean;
  placeholder?: string;
}

export interface ScoreBreakdown {
  reliability: number;
  coverage: number;
  attribution: number;
  privacy: number;
  ownership: number;
}

export interface Risk {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  category: string;
}

export interface Recommendation {
  title: string;
  description: string;
  impact: string;
  link: string;
  category: string;
}

// Scoring Matrix from JSON
const scoreMap: Record<string, Record<string, ScoreBreakdown>> = {
  q1: {
    "Ecommerce": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "Lead Generation": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "App-First Business": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "SaaS": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "Marketing Agency": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "Other": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
  q2: {
    "Website Only": { reliability: 0, coverage: 0, attribution: 4, privacy: 0, ownership: 0 },
    "Mobile app": { reliability: 0, coverage: 0, attribution: 4, privacy: 0, ownership: 0 },
    "Both": { reliability: 0, coverage: 0, attribution: 4, privacy: 0, ownership: 0 },
    "Not sure": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
  q3: {
    "Custom setup": { reliability: 0, coverage: 13, attribution: 4, privacy: 0, ownership: 0 },
    "GA4 + GTM": { reliability: 0, coverage: 10, attribution: 0, privacy: 0, ownership: 0 },
    "CMS plugin only (Shopify/Woo)": { reliability: 0, coverage: 10, attribution: 0, privacy: 0, ownership: 0 },
    "Not sure / none": { reliability: 0, coverage: 0, attribution: -4, privacy: 0, ownership: 0 },
  },
  q4_app: {
    "Adjust": { reliability: 0, coverage: 4, attribution: 4, privacy: 0, ownership: 0 },
    "AppsFlyer": { reliability: 0, coverage: 4, attribution: 4, privacy: 0, ownership: 0 },
    "Firebase only": { reliability: 0, coverage: 4, attribution: -2, privacy: 0, ownership: 0 },
    "No Mobile Measurement Partner (MMP)": { reliability: 0, coverage: 0, attribution: -4, privacy: 0, ownership: 0 },
    "Not sure": { reliability: 0, coverage: 0, attribution: -4, privacy: 0, ownership: 0 },
  },
  q4: {
    "Social (Facebook, Snapchat, Tiktok, etc.)": { reliability: 0, coverage: 0, attribution: 2, privacy: 0, ownership: 0 },
    "Search (Google Ads, Microsoft Ads, Apple Search, etc.)": { reliability: 0, coverage: 0, attribution: 2, privacy: 0, ownership: 0 },
    "DSPs (DV360, Amazon Ads, The Trade Desk, etc.)": { reliability: 0, coverage: 0, attribution: 2, privacy: 0, ownership: 0 },
    "Affiliates (CJ, Impact, Awin, Rakuten, etc.)": { reliability: 0, coverage: 0, attribution: 2, privacy: 0, ownership: 0 },
    "Not sure / None of the above": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
  q5: {
    "Very confident": { reliability: 15, coverage: 0, attribution: 4, privacy: 0, ownership: 0 },
    "Somewhat confident": { reliability: 10, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "Low confidence": { reliability: 5, coverage: 0, attribution: -2, privacy: 0, ownership: 0 },
    "Not confident": { reliability: 0, coverage: 0, attribution: -4, privacy: 0, ownership: 0 },
  },
  q6: {
    "Attribution gaps": { reliability: -5, coverage: 0, attribution: -5, privacy: -1, ownership: 0 },
    "Missing events": { reliability: -5, coverage: -5, attribution: 0, privacy: 0, ownership: 0 },
    "iOS/Safari issues": { reliability: 0, coverage: -5, attribution: -5, privacy: 0, ownership: 0 },
    "Consent/compliance": { reliability: 0, coverage: 0, attribution: 0, privacy: -5, ownership: 0 },
    "Reporting mismatch": { reliability: -5, coverage: 0, attribution: -5, privacy: -1, ownership: 0 },
    "Not sure where to start": { reliability: -3, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
  q7: {
    "Proper CMP": { reliability: 0, coverage: 0, attribution: 0, privacy: 10, ownership: 0 },
    "Basic banner": { reliability: 0, coverage: 0, attribution: 0, privacy: 5, ownership: 0 },
    "No": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "Not sure": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
  q9: {
    "Server-side / CAPI": { reliability: 0, coverage: 8, attribution: 8, privacy: 4, ownership: 0 },
    "Partial setup": { reliability: 0, coverage: 0, attribution: 4, privacy: 2, ownership: 0 },
    "Browser-only": { reliability: 0, coverage: 0, attribution: 0, privacy: 2, ownership: 0 },
    "Not sure": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
  q10: {
    "Under $5,000": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "$5,000 - $25,000": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "$25,000 - $100,000": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "$100,000+": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
  q11: {
    "In-house + agency": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 10 },
    "In-house only": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 6 },
    "Agency only": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 6 },
    "Freelancer": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 4 },
    "No clear owner": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
  q12: {
    "ASAP": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "1-3 Months": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
    "Just Exploring Options": { reliability: 0, coverage: 0, attribution: 0, privacy: 0, ownership: 0 },
  },
};

// Category max values
export const categoryMaxValues = {
  coverage: 30,
  attribution: 30,
  reliability: 15,
  privacy: 15,
  ownership: 10,
};

// URL validation function
export const isValidUrl = (value: string): boolean => {
  if (!value || value.length > 2048 || /\s/.test(value)) return false;
  try {
    const url = new URL(value.includes('://') ? value : `https://${value}`);
    return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password && url.hostname.includes('.');
  } catch { return false; }
};

// Questions configuration
export const questions: Question[] = [
  {
    id: "q1",
    text: "What type of business do you run?",
    subtext: "This helps us tailor our assessment to your specific needs.",
    type: "single",
    options: [
      { value: "Ecommerce", label: "Ecommerce" },
      { value: "Lead Generation", label: "Lead Generation" },
      { value: "App-First Business", label: "App-First Business" },
      { value: "SaaS", label: "SaaS" },
      { value: "Marketing Agency", label: "Marketing Agency" },
      { value: "Other", label: "Other" },
    ],
  },
  {
    id: "q2",
    text: "Where do your conversions mainly happen?",
    subtext: "Understanding your conversion touchpoints helps assess tracking complexity.",
    type: "single",
    options: [
      { value: "Website Only", label: "Website Only" },
      { value: "Mobile app", label: "Mobile App" },
      { value: "Both", label: "Both Website & App" },
      { value: "Not sure", label: "Not Sure" },
    ],
  },
  {
    id: "q3",
    text: "Which analytics setup do you currently use?",
    subtext: "Your current infrastructure affects data quality and flexibility.",
    type: "single",
    options: [
      { value: "GA4 + GTM", label: "GA4 + Google Tag Manager" },
      { value: "CMS plugin only (Shopify/Woo)", label: "CMS Plugin Only (Shopify/WooCommerce)" },
      { value: "Custom setup", label: "Custom Setup" },
      { value: "Not sure / none", label: "Not Sure / None" },
    ],
  },
  {
    id: "q4_app",
    text: "How is your mobile app measured?",
    subtext: "Mobile measurement partners (MMPs) are crucial for app attribution.",
    type: "single",
    condition: (answers) => answers.q2 === "Mobile app" || answers.q2 === "Both",
    options: [
      { value: "Adjust", label: "Adjust" },
      { value: "AppsFlyer", label: "AppsFlyer" },
      { value: "Firebase only", label: "Firebase Only" },
      { value: "No Mobile Measurement Partner (MMP)", label: "No MMP" },
      { value: "Not sure", label: "Not Sure" },
    ],
  },
  {
    id: "q4",
    text: "Which ad platforms do you actively spend on?",
    subtext: "Select all that apply.",
    type: "multi",
    options: [
      { value: "Social (Facebook, Snapchat, Tiktok, etc.)", label: "Social (Facebook, Snapchat, Tiktok, etc.)" },
      { value: "Search (Google Ads, Microsoft Ads, Apple Search, etc.)", label: "Search (Google Ads, Microsoft Ads, Apple Search, etc.)" },
      { value: "DSPs (DV360, Amazon Ads, The Trade Desk, etc.)", label: "DSPs (DV360, Amazon Ads, The Trade Desk, etc.)" },
      { value: "Affiliates (CJ, Impact, Awin, Rakuten, etc.)", label: "Affiliates (CJ, Impact, Awin, Rakuten, etc.)" },
      { value: "Not sure / None of the above", label: "Not Sure / None of the Above" },
    ],
  },
  {
    id: "q5",
    text: "How confident are you in your conversion data?",
    subtext: "Be honest—this helps us identify where to focus.",
    type: "single",
    options: [
      { value: "Very confident", label: "Very Confident" },
      { value: "Somewhat confident", label: "Somewhat Confident" },
      { value: "Low confidence", label: "Low Confidence" },
      { value: "Not confident", label: "Not Confident At All" },
    ],
  },
  {
    id: "q6",
    text: "What are your biggest analytics challenges?",
    subtext: "Select all that apply to your situation.",
    type: "multi",
    options: [
      { value: "Attribution gaps", label: "Attribution Gaps" },
      { value: "Missing events", label: "Missing Events" },
      { value: "iOS/Safari issues", label: "iOS/Safari Tracking Issues" },
      { value: "Consent/compliance", label: "Consent/Compliance Concerns" },
      { value: "Reporting mismatch", label: "Reporting Mismatch" },
      { value: "Not sure where to start", label: "Not Sure Where to Start" },
    ],
  },
  {
    id: "q7",
    text: "Do you use a consent banner or CMP?",
    subtext: "Consent management is critical for compliance and data quality.",
    type: "single",
    options: [
      { value: "Proper CMP", label: "Yes, Proper CMP (Cookiebot, OneTrust, etc.)" },
      { value: "Basic banner", label: "Basic Cookie Banner" },
      { value: "No", label: "No Consent Management" },
      { value: "Not sure", label: "Not Sure" },
    ],
  },
  {
    id: "q8",
    text: "What's your website URL?",
    subtext: "This helps us understand your business context.",
    type: "input",
    placeholder: "https://example.com",
    validation: isValidUrl,
  },
  {
    id: "q9",
    text: "How do you handle iOS/Safari tracking limitations?",
    subtext: "iOS 14+ and Safari ITP significantly impact tracking accuracy.",
    type: "single",
    options: [
      { value: "Server-side / CAPI", label: "Server-side Tracking / CAPI" },
      { value: "Partial setup", label: "Partial Implementation" },
      { value: "Browser-only", label: "Browser-only Tracking" },
      { value: "Not sure", label: "Not Sure" },
    ],
  },
  {
    id: "q10",
    text: "What's your monthly ad spend?",
    subtext: "This helps us understand the scale and potential impact.",
    type: "single",
    options: [
      { value: "Under $5,000", label: "Under $5,000" },
      { value: "$5,000 - $25,000", label: "$5,000 - $25,000" },
      { value: "$25,000 - $100,000", label: "$25,000 - $100,000" },
      { value: "$100,000+", label: "$100,000+" },
    ],
  },
  {
    id: "q11",
    text: "Who manages analytics/tracking today?",
    subtext: "Understanding ownership helps us tailor recommendations.",
    type: "single",
    options: [
      { value: "In-house + agency", label: "In-house Team + Agency" },
      { value: "In-house only", label: "In-house Only" },
      { value: "Agency only", label: "Agency Only" },
      { value: "Freelancer", label: "Freelancer" },
      { value: "No clear owner", label: "No Clear Owner" },
    ],
  },
  {
    id: "q12",
    text: "How urgent is improving your analytics?",
    subtext: "This helps us prioritize recommendations.",
    type: "single",
    options: [
      { value: "ASAP", label: "ASAP - It's Affecting Decisions Now" },
      { value: "1-3 Months", label: "1-3 Months" },
      { value: "Just Exploring Options", label: "Just Exploring Options" },
    ],
  },
];

// Category to recommendation mapping
const categoryRecommendations: Record<string, Recommendation> = {
  coverage: {
    title: "Track Key Events and Full Funnel Steps",
    description: "Implement comprehensive event tracking to capture the complete user journey from first touch to conversion.",
    impact: "Complete visibility into user behavior",
    link: "/services#server-side-tracking",
    category: "coverage",
  },
  reliability: {
    title: "Audit and Validate Tracking Accuracy",
    description: "Conduct a thorough audit of your current tracking setup to identify and fix data quality issues.",
    impact: "Trustworthy data for confident decisions",
    link: "/services#tracking-audits",
    category: "reliability",
  },
  attribution: {
    title: "Improve Attribution with Server-Side/CAPI",
    description: "Use server-side tracking (and CAPIs) to reduce iOS/Safari loss and improve attribution accuracy.",
    impact: "Recover 30-50% of lost conversion data",
    link: "/services#meta-capi",
    category: "attribution",
  },
  privacy: {
    title: "Implement a CMP with Consent Mode v2",
    description: "Set up a proper Consent Management Platform with Google Consent Mode v2 for GDPR/CCPA compliance.",
    impact: "Ensure compliance and improve data modeling",
    link: "/services#consent-compliance",
    category: "privacy",
  },
  ownership: {
    title: "Define Clear Ownership and Monitoring",
    description: "Establish clear ownership of analytics with documented processes and regular monitoring workflows.",
    impact: "Proactive issue detection and resolution",
    link: "/services#reporting-optimization",
    category: "ownership",
  },
};

// Category to risk mapping
const categoryRisks: Record<string, Risk> = {
  coverage: {
    title: "Tracking Coverage Gaps",
    description: "Missing events and incomplete funnel tracking are hiding critical drop-off points and optimization opportunities.",
    severity: "high",
    category: "coverage",
  },
  reliability: {
    title: "Data Trust Issues",
    description: "Low confidence in conversion data leads to poor decision-making and wasted ad spend.",
    severity: "high",
    category: "reliability",
  },
  attribution: {
    title: "Attribution Blind Spots",
    description: "You can't accurately measure which channels drive conversions, leading to misallocated budgets.",
    severity: "high",
    category: "attribution",
  },
  privacy: {
    title: "Compliance Risk",
    description: "Inadequate consent management exposes you to GDPR/CCPA penalties and data loss.",
    severity: "high",
    category: "privacy",
  },
  ownership: {
    title: "Ownership Gap",
    description: "No clear owner for analytics means issues go undetected and optimizations don't happen.",
    severity: "medium",
    category: "ownership",
  },
};

// Scoring function
export function calculateScore(answers: HealthCheckAnswers): {
  total: number;
  breakdown: ScoreBreakdown;
  percentages: Record<string, number>;
  maturity: string;
  risks: Risk[];
  recommendations: Recommendation[];
  improvementEstimation: string[];
} {
  const breakdown: ScoreBreakdown = {
    reliability: 0,
    coverage: 0,
    attribution: 0,
    privacy: 0,
    ownership: 0,
  };

  // Calculate scores from answers
  questions.forEach((question) => {
    const answer = answers[question.id];
    if (!answer) return;

    // Skip input fields for scoring
    if (question.type === "input") return;

    const questionKey = question.id;

    if (question.type === "single" && typeof answer === "string") {
      const scores = scoreMap[questionKey]?.[answer];
      if (scores) {
        breakdown.reliability += scores.reliability;
        breakdown.coverage += scores.coverage;
        breakdown.attribution += scores.attribution;
        breakdown.privacy += scores.privacy;
        breakdown.ownership += scores.ownership;
      }
    } else if (question.type === "multi" && Array.isArray(answer)) {
      // For multi-select (Q6), add scores for each selected option
      answer.forEach((val) => {
        const scores = scoreMap[questionKey]?.[val];
        if (scores) {
          breakdown.reliability += scores.reliability;
          breakdown.coverage += scores.coverage;
          breakdown.attribution += scores.attribution;
          breakdown.privacy += scores.privacy;
          breakdown.ownership += scores.ownership;
        }
      });
    }
  });

  // Negative protection: clamp to zero
  breakdown.coverage = Math.max(0, breakdown.coverage);
  breakdown.reliability = Math.max(0, breakdown.reliability);
  breakdown.attribution = Math.max(0, breakdown.attribution);
  breakdown.privacy = Math.max(0, breakdown.privacy);
  breakdown.ownership = Math.max(0, breakdown.ownership);

  // Calculate total
  const total = breakdown.coverage + breakdown.reliability + breakdown.attribution + breakdown.privacy + breakdown.ownership;

  // Calculate percentages
  const percentages = {
    coverage: breakdown.coverage / categoryMaxValues.coverage,
    reliability: breakdown.reliability / categoryMaxValues.reliability,
    attribution: breakdown.attribution / categoryMaxValues.attribution,
    privacy: breakdown.privacy / categoryMaxValues.privacy,
    ownership: breakdown.ownership / categoryMaxValues.ownership,
  };

  // Determine maturity label
  let maturity = "High Risk";
  if (total >= 80) maturity = "Strong";
  else if (total >= 60) maturity = "Developing";
  else if (total >= 40) maturity = "Weak";

  // Get top 3 risks (lowest category percentages)
  const categoryPercentages = Object.entries(percentages)
    .map(([category, pct]) => ({ category, pct }))
    .sort((a, b) => a.pct - b.pct);

  const lowestThreeCategories = categoryPercentages.slice(0, 3);

  const risks: Risk[] = lowestThreeCategories.map(({ category }) => ({
    ...categoryRisks[category],
    severity: percentages[category as keyof typeof percentages] < 0.4 ? "high" : percentages[category as keyof typeof percentages] < 0.6 ? "medium" : "low",
  }));

  // Get recommendations for lowest 3 categories
  const recommendations: Recommendation[] = lowestThreeCategories.map(({ category }) =>
    categoryRecommendations[category]
  );

  // Improvement estimation
  const improvementEstimation: string[] = [];

  if (percentages.attribution < 0.5) {
    improvementEstimation.push("Recover 30-50% of lost conversion data");
  } else if (percentages.attribution < 0.75) {
    improvementEstimation.push("Recover 20-30% of lost conversion data");
  } else {
    improvementEstimation.push("Recover 10-20% of lost conversion data");
  }

  if (percentages.coverage < 0.5) {
    improvementEstimation.push("Major tracking gaps are hiding funnel drop-offs.");
  } else if (percentages.coverage < 0.75) {
    improvementEstimation.push("Some funnel blind spots remain.");
  } else {
    improvementEstimation.push("Tracking coverage is solid; only refinements needed.");
  }

  return {
    total,
    breakdown,
    percentages,
    maturity,
    risks,
    recommendations,
    improvementEstimation,
  };
}


export type HealthCheckResult = ReturnType<typeof calculateScore>;
export interface HealthReport extends Omit<HealthCheckResult, "total"> {
  score: number;
  email: string;
  answers: HealthCheckAnswers;
  websiteUrl?: string;
}

/** Uses the fixed canonical questionnaire order so conditional paths cannot regress. */
export function getQuestionProgress(questionId: string | undefined): number {
  const index = questions.findIndex((question) => question.id === questionId);
  return index < 0 ? 0 : ((index + 1) / questions.length) * 100;
}
