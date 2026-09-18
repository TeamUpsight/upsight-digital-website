import { Button, ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { submitHealthCheck } from "@/lib/api";
import { toast } from "@/lib/toast";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  RotateCcw,
  Search,
  Shield,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Turnstile, { Honeypot } from "../Turnstile";

// Declare dataLayer type
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

import { calculateScore, categoryMaxValues, questions, type HealthCheckAnswers } from "@/lib/health-check/domain";

// Push dataLayer event helper
function pushDataLayerEvent(eventName: string, data: Record<string, unknown> = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...data,
  });
}

export default function HealthCheck() {

  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const analyzingInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const advancing = useRef(false);
  const focusTarget = useRef<HTMLDivElement>(null);
  const hasInteracted = useRef(false);
  const later = (callback: () => void, delay: number) => { timeouts.current.push(setTimeout(callback, delay)); };
  useEffect(() => () => { timeouts.current.forEach(clearTimeout); clearInterval(analyzingInterval.current); }, []);
  const [currentStep, setCurrentStep] = useState<"intro" | "questions" | "analyzing" | "results">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<HealthCheckAnswers>({});
  const [multiSelectValues, setMultiSelectValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [inputError, setInputError] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [results, setResults] = useState<ReturnType<typeof calculateScore> | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(0);

  useEffect(() => {
    if (currentStep !== "intro" || hasInteracted.current) {
      focusTarget.current?.focus();
      hasInteracted.current = true;
    }
  }, [currentStep, currentQuestionIndex]);

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
    timeouts.current.forEach(clearTimeout); timeouts.current = [];
    clearInterval(analyzingInterval.current); advancing.current = false;
    setCurrentStep("intro");
    setCurrentQuestionIndex(0);
    setAnswers({});
    setMultiSelectValues([]);
    setInputValue("");
    setInputError("");
    setEmail("");
    setEmailSubmitted(false);
    setSubmissionError("");
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

  const advanceToNextQuestion = (newAnswers: HealthCheckAnswers) => {
    advancing.current = false;
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
      analyzingInterval.current = setInterval(() => {
        setLoadingMessage(prev => {
          if (prev < loadingMessages.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1500);
      
      // After 8 seconds, show results
      later(() => {
        clearInterval(analyzingInterval.current);
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
    if (advancing.current) return;
    advancing.current = true;
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
    
    later(() => {
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
    if (multiSelectValues.length === 0 || advancing.current) return;
    advancing.current = true;
    
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
    
    later(() => {
      advanceToNextQuestion(newAnswers);
    }, 300);
  };

  const handleInputSubmit = () => {
    if (advancing.current) return;
    if (!inputValue.trim()) {
      setInputError("Please enter a URL");
      return;
    }
    
    if (currentQuestion.validation && !currentQuestion.validation(inputValue)) {
      setInputError("Please enter a valid website URL (e.g., example.com or https://example.com)");
      return;
    }
    
    advancing.current = true;
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
    
    later(() => {
      advanceToNextQuestion(newAnswers);
    }, 300);
  };

  // Submit the completed assessment to the Astro/Cloudflare API.
  // PDF generation from the Manus backend was removed because the UI never exposed the generated file.
  const handleEmailSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !results || isSubmittingEmail) return;
    setSubmissionError("");
    
    setIsSubmittingEmail(true);
    
    try {
      await submitHealthCheck({ email, answers, turnstileToken, honeypot });
      setEmailSubmitted(true);
      toast.success("Thank you! Your assessment has been sent. Our team will follow up with detailed insights.");
      pushDataLayerEvent("health_check_email_submitted");
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Failed to send report. Please try again.");
    } finally {
      setIsSubmittingEmail(false);
      setTurnstileToken("");
      setVerificationAttempt(value => value + 1);
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
                    aria-label="Start over"
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
          <Card className="border-2 min-h-[440px] transition-[min-height] duration-300 motion-reduce:transition-none">
            <CardContent ref={focusTarget} tabIndex={-1} aria-label={currentStep === "questions" ? currentQuestion.text : currentStep === "results" ? "Your Analytics Health Score" : "Analytics Health Check"} className="p-6 md:p-8">
                {currentStep !== "intro" && <h1 className="sr-only">Quick Analytics Health Check</h1>}
                {/* Intro Screen */}
                {currentStep === "intro" && (
                  <div key="intro" className="health-step text-center py-8">
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
                  </div>
                )}

                {/* Questions */}
                {currentStep === "questions" && currentQuestion && (
                  <div key={currentQuestion.id} className="health-step space-y-6">
                    {/* Bot Message */}
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-2xl rounded-tl-sm p-4 inline-block max-w-lg">
                          <h2 id="health-question" className="font-medium mb-1">{currentQuestion.text}</h2>
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
                                aria-pressed={multiSelectValues.includes(option.value)}
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
                              type="text" aria-labelledby="health-question" maxLength={2048}
                              aria-invalid={!!inputError} aria-describedby={inputError ? "health-url-error" : undefined}
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
                            <p id="health-url-error" role="alert" className="text-sm text-red-400">{inputError}</p>
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
                  </div>
                )}

                {/* Analyzing Animation */}
                {currentStep === "analyzing" && (
                  <div key="analyzing" className="health-step text-center py-12">
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
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                              isActive || isComplete ? 'opacity-100' : 'opacity-40'
                            } ${
                              isActive
                                ? 'scale-[1.02] bg-primary/10 border border-primary/30'
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
                          </div>
                        );
                      })}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-6">
                      Please wait while we analyze your responses...
                    </p>
                  </div>
                )}

                {/* Results */}
                {currentStep === "results" && results && (
                  <div key="results" className="health-step space-y-8">
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
                          <Honeypot value={honeypot} onChange={setHoneypot} />
                          <Turnstile action="health-check" resetKey={verificationAttempt} onToken={setTurnstileToken} />
                          {submissionError && <p role="alert" className="text-sm text-destructive">{submissionError}</p>}
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Input
                                type="email"
                              aria-label="Email address" maxLength={254} autoComplete="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="flex-1 h-12 text-base bg-background/80"
                              />
                              <Button type="submit" size="lg" disabled={isSubmittingEmail || (!turnstileToken && !(import.meta.env.DEV && !import.meta.env.PUBLIC_TURNSTILE_SITE_KEY))} className="h-12 px-6 whitespace-nowrap">
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
                        <div className="text-center" role="status">
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
                      <ButtonLink href="https://calendly.com/team-upsight/30min" target="_blank" rel="noopener noreferrer" size="lg" className="text-base h-12 px-8">
                          <Calendar className="mr-2 h-5 w-5" />
                          Book a Free Consultation
                        </ButtonLink>
                    </div>
                  </div>
                )}
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
