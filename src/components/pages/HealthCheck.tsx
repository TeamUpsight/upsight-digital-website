import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Loader2,
  Mail,
  MessageCircle,
  RotateCcw,
  Shield,
  Target,
  TrendingUp,
  Zap,
  Globe,
  Download,
  Search,
  Database,
  BarChart3,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/lib/toast";
import { trpc } from "@/lib/trpc";

// Declare dataLayer type
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

// Types
interface Question {
  id: string;
  text: string;
  subtext?: string;
  type: "single" | "multi" | "input";
  options?: { value: string; label: string }[];
  condition?: (answers: Record<string, string | string[]>) => boolean;
  validation?: (value: string) => boolean;
  placeholder?: string;
}

interface ScoreBreakdown {
  reliability: number;
  coverage: number;
  attribution: number;
  privacy: number;
  ownership: number;
}

interface Risk {
  title: string;
  description: string;
  severity: "high" | "medium" | "low";
  category: string;
}

interface Recommendation {
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
const categoryMaxValues = {
  coverage: 30,
  attribution: 30,
  reliability: 15,
  privacy: 15,
  ownership: 10,
};

// URL validation function
const isValidUrl = (url: string): boolean => {
  if (!url) return false;
  // Allow URLs with or without protocol
  const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  return urlPattern.test(url);
};

// Questions configuration
const questions: Question[] = [
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
function calculateScore(answers: Record<string, string | string[]>): {
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

// Push dataLayer event helper
function pushDataLayerEvent(eventName: string, data: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...data,
  });
}

export default function HealthCheck() {
  // SEO is handled by the SEO component in the return

  const [currentStep, setCurrentStep] = useState<"intro" | "questions" | "analyzing" | "results">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [showEmailCapture, setShowEmailCapture] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [results, setResults] = useState<ReturnType<typeof calculateScore> | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(0);

  // Filter questions based on conditions
  const activeQuestions = questions.filter(
    (q) => !q.condition || q.condition(answers)
  );

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const progress = currentStep === "questions" 
    ? ((currentQuestionIndex + 1) / activeQuestions.length) * 100 
    : (currentStep === "results" || currentStep === "analyzing") ? 100 : 0;

  // Reset function
  const handleReset = () => {
    setCurrentStep("intro");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMultiSelectValues([]);
    setInputValue("");
    setInputError("");
    setShowEmailCapture(false);
    setEmail("");
    setResults(null);
    setLoadingMessage(0);
    
    pushDataLayerEvent('health_check_reset');
  };

  const handleStart = () => {
    setCurrentStep("questions");
    pushDataLayerEvent('health_check_start');
  };

  // Loading messages for analyzing step
  const loadingMessages = [
    { icon: Search, text: "Analyzing your website..." },
    { icon: Database, text: "Checking tracking implementation..." },
    { icon: BarChart3, text: "Evaluating cookies..." },
    { icon: Shield, text: "Assessing privacy compliance..." },
    { icon: Activity, text: "Generating your personalized report..." },
  ];

  const advanceToNextQuestion = (newAnswers: Record<string, string | string[]>) => {
    const nextActiveQuestions = questions.filter(
      (q) => !q.condition || q.condition(newAnswers)
    );
    const currentIndexInActive = nextActiveQuestions.findIndex(q => q.id === currentQuestion.id);
    
    if (currentIndexInActive < nextActiveQuestions.length - 1) {
      setCurrentQuestionIndex(currentIndexInActive + 1);
    } else {
      // Show analyzing step before results
      setCurrentStep("analyzing");
      setLoadingMessage(0);
      
      // Cycle through loading messages (1.5 seconds per message for 5 messages = 7.5 seconds)
      const messageInterval = setInterval(() => {
        setLoadingMessage(prev => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1500);
      
      // After 8 seconds, show results
      setTimeout(() => {
        clearInterval(messageInterval);
        const calculatedResults = calculateScore(newAnswers);
        setResults(calculatedResults);
        setCurrentStep("results");
        
        // Push completion event
        pushDataLayerEvent('health_check_complete', {
          score: calculatedResults.total,
          maturity: calculatedResults.maturity,
        });
      }, 8000);
    }
  };

  const handleSingleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);
    
    // Get the label for the selected option
    const selectedOption = currentQuestion.options?.find(o => o.value === value);
    
    // Push dataLayer event
    pushDataLayerEvent('health_check_steps', {
      step: String(currentQuestionIndex + 1),
      question: currentQuestion.text,
      answer: selectedOption?.label || value,
    });
    
    setTimeout(() => {
      advanceToNextQuestion(newAnswers);
    }, 300);
  };

  const handleMultiSelect = (value: string) => {
    if (value === "Not sure where to start") {
      setMultiSelectValues(["Not sure where to start"]);
    } else {
      const newValues = multiSelectValues.includes(value)
        ? multiSelectValues.filter((v) => v !== value)
        : [...multiSelectValues.filter((v) => v !== "Not sure where to start"), value];
      setMultiSelectValues(newValues);
    }
  };

  const handleMultiSubmit = () => {
    if (multiSelectValues.length === 0) return;
    
    const newAnswers = { ...answers, [currentQuestion.id]: multiSelectValues };
    setAnswers(newAnswers);
    
    // Get labels for selected options
    const selectedLabels = multiSelectValues.map(v => {
      const option = currentQuestion.options?.find(o => o.value === v);
      return option?.label || v;
    });
    
    // Push dataLayer event
    pushDataLayerEvent('health_check_steps', {
      step: String(currentQuestionIndex + 1),
      question: currentQuestion.text,
      answer: selectedLabels.join(', '),
    });
    
    setMultiSelectValues([]);
    
    setTimeout(() => {
      advanceToNextQuestion(newAnswers);
    }, 300);
  };

  const handleInputSubmit = () => {
    if (!inputValue.trim()) {
      setInputError("Please enter a URL");
      return;
    }
    
    if (currentQuestion.validation && !currentQuestion.validation(inputValue)) {
      setInputError("Please enter a valid website URL (e.g., example.com or https://example.com)");
      return;
    }
    
    const newAnswers = { ...answers, [currentQuestion.id]: inputValue };
    setAnswers(newAnswers);
    
    // Push dataLayer event
    pushDataLayerEvent('health_check_steps', {
      step: String(currentQuestionIndex + 1),
      question: currentQuestion.text,
      answer: inputValue,
    });
    
    setInputValue("");
    setInputError("");
    
    setTimeout(() => {
      advanceToNextQuestion(newAnswers);
    }, 300);
  };

  const submitEmailMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Report sent! Check your inbox.");
      setShowEmailCapture(false);
      pushDataLayerEvent('health_check_email_submitted');
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send report. Please try again.");
    },
  });

  // Submit the completed assessment to the Astro/Cloudflare API.
  // PDF generation from the Manus backend was removed because the UI never exposed the generated file.
  const generateReportMutation = trpc.healthCheck.generateReport.useMutation({
    onSuccess: () => {
      setEmailSubmitted(true);
      toast.success("Thank you! Your assessment has been sent. Our team will follow up with detailed insights.");
      pushDataLayerEvent('health_check_email_submitted');
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send report. Please try again.");
    },
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !results) return;
    
    setIsSubmittingEmail(true);
    
    try {
      // Generate PDF report
      await generateReportMutation.mutateAsync({
        email,
        score: results.total,
        maturity: results.maturity,
        breakdown: results.breakdown,
        risks: results.risks.map(r => ({
          title: r.title,
          description: r.description,
          severity: r.severity,
        })),
        recommendations: results.recommendations.map(r => ({
          title: r.title,
          description: r.description,
          impact: r.impact,
          link: r.link,
        })),
        improvementEstimation: results.improvementEstimation,
        answers: answers as Record<string, string | string[]>,
        websiteUrl: typeof answers.q8 === 'string' ? answers.q8 : undefined,
      });
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    if (score >= 40) return "text-orange-400";
    return "text-red-400";
  };

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case "Strong": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Developing": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Weak": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default: return "bg-red-500/20 text-red-400 border-red-500/30";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "text-red-400";
      case "medium": return "text-orange-400";
      default: return "text-yellow-400";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">


      <div className="flex-1 pt-24 pb-16">
        <div className="container max-w-4xl">
          {/* Progress Bar with Reset Button */}
          {currentStep !== "intro" && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">
                  {currentStep === "questions" 
                    ? `Question ${currentQuestionIndex + 1} of ${activeQuestions.length}`
                    : currentStep === "analyzing"
                    ? "Analyzing your setup..."
                    : "Assessment Complete"}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    title="Start over"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Widget Container - Responsive, no internal scroll */}
          <Card className="border-2">
            <CardContent className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {/* Intro Screen */}
                {currentStep === "intro" && (
                  <motion.div
                    key="intro"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-8"
                  >
                    <div className="mb-6 p-4 rounded-full bg-primary/10 inline-block">
                      <Activity className="h-12 w-12 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">
                      Quick Analytics Health Check
                    </h1>
                    <h2 className="text-lg text-muted-foreground mb-2">Assess Your Tracking Setup in 3 Minutes</h2>
                    <p className="text-lg text-muted-foreground mb-6 max-w-xl mx-auto">
                      Get a personalized assessment of your analytics setup in just 3 minutes. 
                      No technical knowledge required! We'll identify gaps and give you actionable recommendations.
                    </p>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>3 minutes</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <span>12 questions</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Target className="h-4 w-4 text-primary" />
                        <span>Instant results</span>
                      </div>
                    </div>

                    <Button size="lg" onClick={handleStart} className="text-base h-12 px-8">
                      Start Health Check
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </motion.div>
                )}

                {/* Questions */}
                {currentStep === "questions" && currentQuestion && (
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {/* Bot Message */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-4 inline-block max-w-lg">
                          <p className="font-medium mb-1">{currentQuestion.text}</p>
                          {currentQuestion.subtext && (
                            <p className="text-sm text-muted-foreground">{currentQuestion.subtext}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Options */}
                    <div className="pl-13 space-y-2">
                      {currentQuestion.type === "single" && currentQuestion.options ? (
                        <div className="grid gap-2">
                          {currentQuestion.options.map((option) => (
                            <Button
                              key={option.value}
                              variant="outline"
                              className={`justify-start h-auto py-3 px-4 text-left whitespace-normal break-words overflow-hidden ${
                                answers[currentQuestion.id] === option.value
                                  ? "border-primary bg-primary/10"
                                  : ""
                              }`}
                              onClick={() => handleSingleSelect(option.value)}
                            >
                              <ChevronRight className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span className="text-left break-words overflow-wrap-anywhere" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{option.label}</span>
                            </Button>
                          ))}
                        </div>
                      ) : currentQuestion.type === "multi" && currentQuestion.options ? (
                        <>
                          <div className="grid gap-2">
                            {currentQuestion.options.map((option) => (
                              <Button
                                key={option.value}
                                variant="outline"
                                className={`justify-start h-auto py-3 px-4 text-left whitespace-normal break-words overflow-hidden ${
                                  multiSelectValues.includes(option.value)
                                    ? "border-primary bg-primary/10"
                                    : ""
                                }`}
                                onClick={() => handleMultiSelect(option.value)}
                              >
                                <div className={`w-4 h-4 mr-2 rounded border flex-shrink-0 flex items-center justify-center ${
                                  multiSelectValues.includes(option.value)
                                    ? "bg-primary border-primary"
                                    : "border-muted-foreground"
                                }`}>
                                  {multiSelectValues.includes(option.value) && (
                                    <CheckCircle2 className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                                <span className="text-left break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{option.label}</span>
                              </Button>
                            ))}
                          </div>
                          <Button 
                            className="mt-4"
                            onClick={handleMultiSubmit}
                            disabled={multiSelectValues.length === 0}
                          >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </>
                      ) : currentQuestion.type === "input" ? (
                        <div className="space-y-4">
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                              type="text"
                              placeholder={currentQuestion.placeholder || "Enter your answer"}
                              value={inputValue}
                              onChange={(e) => {
                                setInputValue(e.target.value);
                                setInputError("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleInputSubmit();
                                }
                              }}
                              className="pl-11 h-12 text-base bg-background/80 border-2 focus:border-primary"
                            />
                          </div>
                          {inputError && (
                            <p className="text-sm text-red-400">{inputError}</p>
                          )}
                          <div className="pt-2">
                            <Button onClick={handleInputSubmit} className="w-full sm:w-auto">
                              Continue
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </motion.div>
                )}

                {/* Analyzing Animation */}
                {currentStep === "analyzing" && (
                  <motion.div
                    key="analyzing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                  >
                    <div className="mb-8">
                      <div className="relative inline-flex items-center justify-center">
                        {/* Outer spinning ring */}
                        <div className="absolute w-32 h-32 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        {/* Inner pulsing circle */}
                        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                          <Loader2 className="h-10 w-10 text-primary animate-spin" />
                        </div>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-4">Analyzing Your Analytics Setup</h2>
                    
                    {/* Animated loading messages */}
                    <div className="space-y-4 max-w-md mx-auto">
                      {loadingMessages.map((msg, index) => {
                        const Icon = msg.icon;
                        const isActive = index === loadingMessage;
                        const isComplete = index < loadingMessage;
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0.4 }}
                            animate={{ 
                              opacity: isActive || isComplete ? 1 : 0.4,
                              scale: isActive ? 1.02 : 1
                            }}
                            transition={{ duration: 0.3 }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              isActive 
                                ? 'bg-primary/10 border border-primary/30' 
                                : isComplete 
                                ? 'bg-muted/30' 
                                : 'bg-transparent'
                            }`}
                          >
                            <div className={`p-2 rounded-full ${
                              isComplete 
                                ? 'bg-primary/20 text-primary' 
                                : isActive 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {isComplete ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : isActive ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                              ) : (
                                <Icon className="h-5 w-5" />
                              )}
                            </div>
                            <span className={`text-sm ${
                              isActive || isComplete 
                                ? 'text-foreground font-medium' 
                                : 'text-muted-foreground'
                            }`}>
                              {msg.text}
                            </span>
                          </motion.div>
                        );
                      })}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-6">
                      Please wait while we analyze your responses...
                    </p>
                  </motion.div>
                )}

                {/* Results */}
                {currentStep === "results" && results && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Score Header */}
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-4">Your Analytics Health Score</h2>
                      <div className="relative inline-flex items-center justify-center">
                        <svg className="w-40 h-40">
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            className="text-muted/30"
                          />
                          <circle
                            cx="80"
                            cy="80"
                            r="70"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${(results.total / 100) * 440} 440`}
                            transform="rotate(-90 80 80)"
                            className={getScoreColor(results.total)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-4xl font-bold ${getScoreColor(results.total)}`}>
                            {results.total}
                          </span>
                          <span className="text-sm text-muted-foreground">out of 100</span>
                        </div>
                      </div>
                      <div className={`inline-block mt-4 px-4 py-2 rounded-full border ${getMaturityColor(results.maturity)}`}>
                        {results.maturity} Analytics Maturity
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { label: "Coverage", value: results.breakdown.coverage, max: categoryMaxValues.coverage },
                        { label: "Attribution", value: results.breakdown.attribution, max: categoryMaxValues.attribution },
                        { label: "Reliability", value: results.breakdown.reliability, max: categoryMaxValues.reliability },
                        { label: "Privacy", value: results.breakdown.privacy, max: categoryMaxValues.privacy },
                        { label: "Ownership", value: results.breakdown.ownership, max: categoryMaxValues.ownership },
                      ].map((item) => (
                        <div key={item.label} className="text-center p-3 rounded-lg bg-muted/30">
                          <div className="text-lg font-semibold">{item.value}/{item.max}</div>
                          <div className="text-xs text-muted-foreground">{item.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Risks */}
                    {results.risks.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-orange-400" />
                          Top Risks Identified
                        </h3>
                        <div className="space-y-3">
                          {results.risks.map((risk, index) => (
                            <div key={index} className="p-4 rounded-lg bg-muted/30 border border-muted">
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 ${getSeverityColor(risk.severity)}`}>
                                  <AlertTriangle className="h-5 w-5" />
                                </div>
                                <div>
                                  <h4 className="font-medium">{risk.title}</h4>
                                  <p className="text-sm text-muted-foreground">{risk.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {results.recommendations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          Recommended Next Steps
                        </h3>
                        <div className="space-y-3">
                          {results.recommendations.map((rec, index) => (
                            <a key={index} href={rec.link} className="block">
                              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors">
                                <div className="flex items-start gap-3">
                                  <div className="text-primary mt-0.5">
                                    <TrendingUp className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{rec.title}</h4>
                                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                                    <div className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded">
                                      <Target className="h-3 w-3" />
                                      {rec.impact}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Email Capture - Prominent CTA */}
                    <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-2 border-primary/30">
                      {!emailSubmitted ? (
                        <>
                          <div className="text-center mb-4">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/20 mb-3">
                              <Mail className="h-7 w-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Get Your Full Report</h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                              Enter your email to receive your detailed assessment and personalized recommendations.
                            </p>
                          </div>
                          
                          <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 h-12 text-base bg-background/80"
                              />
                              <Button type="submit" size="lg" disabled={isSubmittingEmail} className="h-12 px-6 whitespace-nowrap">
                                {isSubmittingEmail ? (
                                  <span className="flex items-center gap-2">
                                    <span className="animate-spin">⏳</span>
                                    Generating...
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Get Report
                                  </span>
                                )}
                              </Button>
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-3">
                              Our team will reach out with detailed insights. No spam, ever.
                            </p>
                          </form>
                        </>
                      ) : (
                        <div className="text-center">
                          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/20 mb-3">
                            <CheckCircle2 className="h-7 w-7 text-green-400" />
                          </div>
                          <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                          <p className="text-muted-foreground max-w-md mx-auto mb-4">
                            Our analytics experts will review your assessment and reach out with detailed insights and recommendations tailored to your business.
                          </p>

                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="text-center pt-4">
                      <p className="text-muted-foreground mb-4">
                        Ready to optimize your analytics and unlock data-driven growth?
                      </p>
                      <a href="https://calendly.com/team-upsight/30min" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="text-base h-12 px-8">
                          <Calendar className="mr-2 h-5 w-5" />
                          Book a Free Consultation
                        </Button>
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Trust Signals */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Your data is secure</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No commitment required</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                <span>Results in 3 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
}
