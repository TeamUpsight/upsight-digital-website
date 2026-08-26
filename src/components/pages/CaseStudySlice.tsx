import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Play,
  AlertTriangle,
  Layers,
  ShieldAlert,
  Server,
  Database,
  Shield,
  ChevronDown,
  RotateCcw,
} from "lucide-react";
import DataFlowDiagram from "@/components/DataFlowDiagram";
import { Link } from "@/lib/routing";
import { useEffect, useState, useRef, useCallback } from "react";

// CDN URLs for assets
const SLICE_LOGO_URL = "/images/logo-slice.webp";
const VIDEO_TESTIMONIAL_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269151870/NKnKdFDxhaRVudBQKnGMGB/AlyssaWong-SliceLife_76a30443.mp4";

/* ─── Animated Counter Hook ─── */
function useCountUp(target: number, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!startOnView) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted, startOnView]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start * 100) / 100);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);

  return { count, ref };
}

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
}

/* ─── Horizontal Bar Chart Component ─── */
function HorizontalBar({ label, value, suffix = "%", maxValue = 140, delay = 0 }: {
  label: string;
  value: number;
  suffix?: string;
  maxValue?: number;
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  const width = Math.min((value / maxValue) * 100, 100);

  return (
    <div ref={ref} className="mb-5">
      <div className="flex justify-between items-baseline mb-2">
        <span className="text-sm font-medium text-foreground/80">{label}</span>
        <span className="text-lg font-bold text-primary">
          {value > 0 ? "+" : ""}{value}{suffix}
        </span>
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all ease-out"
          style={{
            width: isVisible ? `${width}%` : "0%",
            transitionDuration: "1.5s",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Donut Chart Component ─── */
function DonutChart({ value, label, size = 120, strokeWidth = 10 }: {
  value: number;
  label: string;
  size?: number;
  strokeWidth?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div ref={ref} className="flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isVisible ? offset : circumference}
          strokeLinecap="round"
          className="text-primary transition-all ease-out"
          style={{ transitionDuration: "2s" }}
        />
      </svg>
      <div className="text-center -mt-[76px] mb-[40px]">
        <div className="text-2xl font-bold text-primary">{value}%</div>
      </div>
      <p className="text-xs text-muted-foreground text-center mt-1 max-w-[100px]">{label}</p>
    </div>
  );
}

/* ─── Data Flow Architecture: see @/components/DataFlowDiagram.tsx ─── */


/* ─── Flippable Video Card (Vertical Mobile Shape) ─── */
function FlippableVideoCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFlip = useCallback(() => {
    if (isFlipped && videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handlePlayVideo = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full transition-transform duration-700 cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          aspectRatio: "9/16",
        }}
      >
        {/* Front: Quote Card */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
          onClick={handleFlip}
        >
          <Card className="h-full border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <CardContent className="p-6 md:p-8 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src="/images/alyssa-wong.webp"
                    alt="Alyssa Wong"
                    width="56"
                    height="56"
                    className="rounded-full border-2 border-primary/30"
                  />
                  <div>
                    <p className="font-semibold">Alyssa Wong</p>
                    <p className="text-xs text-muted-foreground">Director of Growth Marketing, Slice</p>
                  </div>
                </div>
                <blockquote className="text-sm md:text-base leading-relaxed text-foreground/90 italic">
                  "Partnering with Upsight Digital has been transformational for Slice. They quickly
                  identified and addressed critical tracking issues—from fragmented event structures
                  and tracking gaps to compliance risks—streamlining our data infrastructure across
                  web and mobile. We now have significantly cleaner data pipelines, improved
                  cross-platform visibility, and greater confidence in our analytics."
                </blockquote>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Play className="h-3.5 w-3.5" fill="currentColor" />
                  <span>Tap to watch video</span>
                </div>
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back: Video Player */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <Card className="h-full border-primary/20 bg-black">
            <div className="relative h-full">
              <video
                ref={videoRef}
                src={VIDEO_TESTIMONIAL_URL}
                className="w-full h-full object-cover rounded-2xl"
                controls={isVideoPlaying}
                onEnded={() => setIsVideoPlaying(false)}
                playsInline
              />
              {!isVideoPlaying && isFlipped && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVideo();
                  }}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50 group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 text-primary-foreground ml-0.5" fill="currentColor" />
                  </div>
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-10"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ─── Metric Card with animation ─── */
function MetricCard({ value, suffix, label, prefix = "+", delay = 0 }: {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
  delay?: number;
}) {
  const { count, ref } = useCountUp(value, 2000);
  return (
    <div
      ref={ref}
      className="p-5 md:p-6 bg-card/80 border border-primary/20 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
    >
      <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">
        {prefix}{count.toFixed(value % 1 === 0 ? 0 : 2)}{suffix}
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

/* ─── Problem Card ─── */
function ProblemCard({ icon: Icon, title, items, delay = 0 }: {
  icon: React.ElementType;
  title: string;
  items: string[];
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: "600ms" }}
    >
      <Card className="h-full border-destructive/20 bg-gradient-to-b from-destructive/5 to-transparent hover:border-destructive/40 transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="p-3 rounded-xl bg-destructive/10 inline-block mb-4 group-hover:bg-destructive/20 transition-colors">
            <Icon className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="text-destructive mt-0.5 flex-shrink-0 font-bold">&#x2715;</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

/* ─── Strategy Pillar Card ─── */
function PillarCard({ icon: Icon, title, items, delay = 0 }: {
  icon: React.ElementType;
  title: string;
  items: string[];
  delay?: number;
}) {
  const { ref, isVisible } = useScrollReveal();
  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
      style={{ transitionDelay: `${delay}ms`, transitionDuration: "600ms" }}
    >
      <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/5 to-transparent hover:border-primary/40 transition-all duration-300 group">
        <CardContent className="p-6">
          <div className="p-3 rounded-xl bg-primary/10 inline-block mb-4 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-4">{title}</h3>
          <ul className="space-y-2.5">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="text-primary mt-0.5 flex-shrink-0">&#x2713;</span>
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function CaseStudySlice() {
  // SEO is handled by the SEO component in the return

  return (
    <div className="min-h-screen flex flex-col bg-background">


      {/* ─── HERO (Asymmetric Layout) ─── */}
      <section id="overview" className="relative pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="container relative z-10">

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center">
            {/* Left: Title & subtitle */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 leading-[1.1] tracking-tight">
                How Slice Life Improved{" "}
                <span className="text-primary">Marketing Efficiency</span>,{" "}
                Data Accuracy & Compliance
              </h1>

              <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed max-w-xl">
                A server-side, consent-first analytics transformation that recovered lost conversions and unlocked measurable growth.
              </p>

              <p className="text-sm text-muted-foreground/70">
                Client: Slice Life &nbsp;|&nbsp; Industry: Food & Drink
              </p>
            </div>

            {/* Right: Stacked stat cards */}
            <div className="flex flex-col gap-4">
              <MetricCard value={57.91} suffix="% ROAS" label="Google Ads" />
              <MetricCard value={130.43} suffix="% ROAS" label="Facebook Ads" />
              <MetricCard value={99} suffix="% Order Match" label="Data Accuracy" prefix="" />
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="flex justify-center mt-14 animate-bounce cursor-pointer"
            onClick={() => document.getElementById('client-info')?.scrollIntoView({ behavior: 'smooth' })}
            role="button"
            aria-label="Scroll to next section"
          >
            <ChevronDown className="h-6 w-6 text-muted-foreground/50 hover:text-primary transition-colors" />
          </div>
        </div>
      </section>

      {/* ─── CLIENT INFO SECTION ─── */}
      <section id="client-info" className="py-8 border-y border-border/30 bg-muted/20">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-3">
              <img src={SLICE_LOGO_URL} alt="Slice Logo" width="40" height="40" className="rounded-lg" />
              <div>
                <p className="text-sm font-semibold">Slice Life</p>
                <p className="text-xs text-muted-foreground">Client</p>
              </div>
            </div>
            <div className="h-8 w-px bg-border/50 hidden md:block" />
            <div>
              <p className="text-sm font-semibold">Food & Drink</p>
              <p className="text-xs text-muted-foreground">Category</p>
            </div>
            <div className="h-8 w-px bg-border/50 hidden md:block" />
            <div>
              <p className="text-sm font-semibold">Web, Android, iOS</p>
              <p className="text-xs text-muted-foreground">Platforms</p>
            </div>
            <div className="h-8 w-px bg-border/50 hidden md:block" />
            <div>
              <p className="text-sm font-semibold">14,000+</p>
              <p className="text-xs text-muted-foreground">Partner Websites</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── THE PROBLEM ─── */}
      <section id="problem" className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-destructive/80 uppercase tracking-widest">The Challenge</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 mb-4">Three Critical Problems</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Slice's analytics infrastructure had accumulated significant technical debt, creating blind spots across measurement, attribution, and compliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <ProblemCard
              icon={Layers}
              title="Fragmented Measurement"
              items={[
                "Inconsistent event names across Web and Mobile data streams",
                "Duplicate purchase events causing 10% inflation in the revenue data",
                "Partial funnel visibility hiding drop-off points",
              ]}
              delay={0}
            />
            <ProblemCard
              icon={AlertTriangle}
              title="Broken Attribution"
              items={[
                "Browser-only tracking losing signals due to Safari and AdBlockers",
                "52% misattributed traffic",
                "Weak signal quality leading to low match rates",
              ]}
              delay={150}
            />
            <ProblemCard
              icon={ShieldAlert}
              title="Compliance Risk"
              items={[
                "Missing consent enforcement across platforms",
                "Improper integration exposing user data",
                "Growing CCPA regulatory exposure",
              ]}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ─── STRATEGY & IMPLEMENTATION ─── */}
      <section id="strategy" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary/80 uppercase tracking-widest">Our Approach</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 mb-4">Strategy & Implementation</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We designed a unified data architecture that flows from the client's website through server-side processing to clean, actionable analytics.
            </p>
          </div>

          {/* Architecture Diagram */}
          <div className="mb-16">
            <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Data Flow Architecture</h3>
            <DataFlowDiagram />
          </div>

          {/* Three Pillars */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <PillarCard
              icon={Database}
              title="Tracking Foundation"
              items={[
                "Standardized GA4 event taxonomy",
                "Unified purchase event structure",
                "Automated duplicate removal logic",
              ]}
              delay={0}
            />
            <PillarCard
              icon={Server}
              title="Server-Side Measurement"
              items={[
                "sGTM + Conversion APIs",
                "First-party data collection",
                "Signal recovery from iOS restrictions",
              ]}
              delay={150}
            />
            <PillarCard
              icon={Shield}
              title="Consent & Attribution"
              items={[
                "Ethyca CMP integration",
                "Google Consent Mode v2",
                "Precise tracking for 14,000+ partner websites",
              ]}
              delay={300}
            />
          </div>
        </div>
      </section>

      {/* ─── RESULTS & IMPACT ─── */}
      <section id="results" className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary/80 uppercase tracking-widest">Measurable Outcomes</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 mb-4">Results & Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The transformation delivered immediate, measurable improvements across every key performance indicator.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            {/* Top-line metrics */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <MetricCard value={57.91} suffix="%" label="ROAS — Google Ads" />
              <MetricCard value={130.43} suffix="%" label="ROAS — Facebook Ads" />
              <div className="p-5 md:p-6 bg-card/80 border border-primary/20 rounded-xl hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary mb-1">
                  8.0
                </div>
                <div className="text-sm text-muted-foreground">EMQ Score</div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bar Chart: ROAS Improvement */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Ad Platform ROAS Improvement</h3>
                  <HorizontalBar label="Google Ads ROAS" value={57.91} maxValue={140} delay={0} />
                  <HorizontalBar label="Facebook Ads ROAS" value={130.43} maxValue={140} delay={200} />
                  <HorizontalBar label="EMQ Score" value={8} suffix="/10" maxValue={10} delay={400} />
                </CardContent>
              </Card>

              {/* Donut Charts: Accuracy Metrics */}
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6">Data Quality Metrics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 mt-4">
                    <DonutChart value={99} label="Duplicate Orders Eliminated" />
                    <DonutChart value={97} label="GA4 Attribution Data Accuracy" />
                    <DonutChart value={93} label="Data Consistency Score" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─── VIDEO TESTIMONIAL (Flippable Card - Vertical) ─── */}
      <section id="testimonial" className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary/80 uppercase tracking-widest">Client Testimonial</span>
            <h2 className="text-2xl md:text-4xl font-bold mt-3 mb-4">Hear It From Slice</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Click the card to watch Alyssa Wong share her experience working with Upsight Digital.
            </p>
          </div>

          <FlippableVideoCard />
        </div>
      </section>

      {/* ─── KEY TAKEAWAYS ─── */}
      <section id="takeaways" className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-sm font-semibold text-primary/80 uppercase tracking-widest">Summary</span>
                <h2 className="text-2xl md:text-3xl font-bold mt-3 mb-6">Key Takeaways</h2>
                <div className="space-y-4">
                  {[
                    { title: "ROAS depends on tracking quality", desc: "Fixing measurement infrastructure directly improved ad platform returns by over 50%." },
                    { title: "Server-side is now baseline", desc: "Browser-only tracking is no longer sufficient — sGTM and CAPI are essential for accurate data." },
                    { title: "Compliance improves data clarity", desc: "Proper consent management doesn't reduce data — it makes the data you collect more reliable." },
                    { title: "Attribution unlocks smarter spend", desc: "Correctly attributing traffic revealed hidden ROI and enabled better budget allocation." },
                  ].map((item, i) => {
                    const { ref, isVisible } = useScrollReveal();
                    return (
                      <div
                        key={i}
                        ref={ref}
                        className={`p-4 rounded-lg border border-border/50 bg-card transition-all ease-out ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                        style={{ transitionDelay: `${i * 100}ms`, transitionDuration: "500ms" }}
                      >
                        <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CTA Card */}
              <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
                <CardContent className="p-8 md:p-10">
                  <h3 className="text-2xl font-bold mb-4">
                    Is your tracking limiting growth?
                  </h3>
                  <p className="text-muted-foreground mb-8 leading-relaxed">
                    Request a measurement audit or server-side assessment with Upsight Digital. We'll identify exactly where you're losing data and revenue.
                  </p>
                  <div className="space-y-3">
                    <Link href="/contact">
                      <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25">
                        Book a Free Consultation
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link href="/health-check">
                      <Button size="lg" variant="outline" className="w-full">
                        Take Free Health Check
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section className="py-12 border-t border-border/50">
        <div className="container">
          <div className="text-center mb-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Technologies & Platforms</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              "Google Analytics 4", "Google Tag Manager (Server-Side)", "Meta Conversions API",
              "Google Ads", "Bing Ads", "Segment CDP", "Appsflyer",
              "BigQuery", "Looker Studio", "Consent Mode v2", "Ethyca CMP",
            ].map((tech, i) => (
              <span key={i} className="px-4 py-2 bg-card border border-border/50 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      
    </div>
  );
}
