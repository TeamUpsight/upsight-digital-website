import { Button } from "@/components/ui/button";
import {
  ArrowDownRight,
  ArrowRight,
  BarChart3,
  Check,
  CircleAlert,
  Database,
  Gauge,
  Layers3,
  RadioTower,
  Search,
  Waypoints,
  Wrench,
} from "lucide-react";
import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";
import { Link } from "@/lib/routing";

const ROADSURFER_LOGO_URL = "/images/logo-roadsurfer.webp";

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, isVisible } = useInView();

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-700 motion-reduce:transition-none ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ToplineMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-card/80 p-5 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 md:p-6">
      <p className="font-mono text-3xl font-bold text-primary md:text-4xl">{value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

function ChallengeCard({
  icon: Icon,
  title,
  items,
  delay = 0,
}: {
  icon: ElementType;
  title: string;
  items: Array<{ title: string; detail: string }>;
  delay?: number;
}) {
  return (
    <Reveal delay={delay}>
      <article className="group h-full rounded-2xl border border-destructive/20 bg-gradient-to-b from-destructive/[0.06] to-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-destructive/40 hover:shadow-xl hover:shadow-destructive/5 motion-reduce:transform-none">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-destructive/25 bg-destructive/10 text-destructive transition-colors group-hover:bg-destructive/15">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="mb-5 text-xl font-semibold">{title}</h3>
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.title} className="border-t border-border/50 pt-4 first:border-t-0 first:pt-0">
              <div className="flex items-start gap-2.5">
                <span className="mt-1 text-sm font-bold text-destructive">×</span>
                <div>
                  <h4 className="text-sm font-semibold leading-5">{item.title}</h4>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>
    </Reveal>
  );
}

function RouteStep({
  number,
  icon: Icon,
  title,
  description,
  items,
}: {
  number: string;
  icon: ElementType;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <article className="relative h-full overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 motion-reduce:transform-none">
      <span className="absolute right-5 top-3 font-mono text-5xl font-bold text-primary/[0.07]">{number}</span>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <p className="mb-5 text-sm leading-6 text-muted-foreground">{description}</p>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-foreground/85">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function MetricBar({ label, value, detail, delay = 0 }: { label: string; value: number; detail: string; delay?: number }) {
  const { ref, isVisible } = useInView(0.3);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-xs text-muted-foreground">{detail}</p>
        </div>
        <span className="font-mono text-xl font-semibold text-primary">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary transition-[width] duration-1000 ease-out motion-reduce:transition-none"
          style={{ width: isVisible ? `${value}%` : "0%", transitionDelay: `${delay}ms` }}
        />
      </div>
    </div>
  );
}

function DeltaCard({
  platform,
  before,
  after,
  note,
}: {
  platform: string;
  before: string;
  after: string;
  note: string;
}) {
  return (
    <article className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.08] via-card to-card p-6">
      <p className="mb-5 text-sm font-semibold text-muted-foreground">{platform}</p>
      <div className="mb-4 flex items-center gap-3">
        <span className="font-mono text-3xl font-bold text-foreground/45 line-through decoration-destructive/70">{before}</span>
        <ArrowDownRight className="h-6 w-6 text-primary" aria-hidden="true" />
        <span className="font-mono text-4xl font-bold text-primary">{after}</span>
      </div>
      <p className="text-sm leading-6 text-muted-foreground">{note}</p>
    </article>
  );
}

export default function CaseStudyRoadsurfer() {
  const challengeCategories = [
    {
      icon: Layers3,
      title: "Fragmented Analytics Governance",
      items: [
        {
          title: "Five GA4 properties, no single source of truth",
          detail: "Only three properties were collecting data, leaving reports fragmented across teams and markets.",
        },
        {
          title: "An overloaded GTM container",
          detail: "More than 320 tags made governance difficult, including 122 obsolete Universal Analytics tags.",
        },
      ],
    },
    {
      icon: Waypoints,
      title: "Broken Channel Attribution",
      items: [
        {
          title: "Paid social bookings credited to the wrong source",
          detail: "Nearly 74% of Facebook-driven sales were being classified as referral traffic instead of paid social.",
        },
        {
          title: "Roadsurfer appeared as its own acquisition source",
          detail: "Self-referrals obscured where new visitors and bookings actually originated.",
        },
      ],
    },
    {
      icon: Database,
      title: "Unreliable Event & Revenue Data",
      items: [
        {
          title: "Duplicate events inflated customer activity",
          detail: "Repeated GA4 events made user behavior look stronger than it was and weakened funnel reporting.",
        },
        {
          title: "E-commerce data arrived in the wrong format",
          detail: "Revenue and item parameters still followed incomplete Universal Analytics conventions instead of GA4's ecommerce structure.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">


      <main>
        <section className="relative overflow-hidden border-b border-border/40 pb-16 pt-28 md:pb-24 md:pt-36">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,173,132,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,173,132,0.045) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage: "linear-gradient(to bottom, black, transparent 90%)",
            }}
          />
          <div className="absolute -right-24 top-20 h-80 w-80 rounded-full bg-primary/10 blur-[100px]" />

          <div className="container relative z-10">
            <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
              <div>
                <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight md:text-6xl lg:text-[4.25rem]">
                  From tracking maze to one trusted view of every <span className="text-primary">booking.</span>
                </h1>
                <p className="mt-7 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                  Roadsurfer needed consistent measurement across countries, languages, and paid media channels. We rebuilt the foundation first—then activated resilient server-side conversion tracking.
                </p>
                <p className="mt-7 text-sm text-muted-foreground/70">Client: Roadsurfer &nbsp;|&nbsp; Industry: Travel & Mobility</p>
              </div>

              <div className="flex flex-col gap-4">
                <ToplineMetric value="+12%" label="More website conversions reported" />
                <ToplineMetric value="120+" label="GTM tags removed" />
                <ToplineMetric value="5 → 1" label="GA4 properties merged" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-border/40 bg-muted/20 py-8">
          <div className="container">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 lg:gap-16">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-white p-1.5">
                  <img src={ROADSURFER_LOGO_URL} alt="Roadsurfer logo" width="389" height="389" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Roadsurfer</p>
                  <p className="text-xs text-muted-foreground">Client</p>
                </div>
              </div>
              <div className="hidden h-9 w-px bg-border/50 md:block" />
              <div>
                <p className="text-sm font-semibold">Travel & Mobility</p>
                <p className="text-xs text-muted-foreground">Category</p>
              </div>
              <div className="hidden h-9 w-px bg-border/50 md:block" />
              <div>
                <p className="text-sm font-semibold">Web</p>
                <p className="text-xs text-muted-foreground">Platform</p>
              </div>
              <div className="hidden h-9 w-px bg-border/50 md:block" />
              <div>
                <p className="text-sm font-semibold">Europe & North America</p>
                <p className="text-xs text-muted-foreground">Market</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container">
            <Reveal className="mx-auto mb-12 max-w-3xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-destructive/80">Audit findings</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">The Challenge</h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Structural debt across governance, attribution, event logic, and ecommerce data made it difficult for Roadsurfer to trust marketing performance reports.
              </p>
            </Reveal>

            <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
              {challengeCategories.map((category, index) => (
                <ChallengeCard key={category.title} {...category} delay={index * 120} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border/40 bg-muted/25 py-16 md:py-24">
          <div className="container">
            <Reveal className="mx-auto mb-14 max-w-3xl text-center">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Our Approach</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">Stabilise first. Then scale.</h2>
              <p className="mt-5 leading-7 text-muted-foreground">
                Rather than layering new tools over an unstable setup, we worked in three deliberate stages—moving from diagnosis to a dependable conversion signal.
              </p>
            </Reveal>

            <div className="relative mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
              <div className="absolute left-[16%] right-[16%] top-6 hidden border-t border-dashed border-primary/30 md:block" />
              <Reveal delay={0}>
                <RouteStep
                  number="01"
                  icon={Search}
                  title="Audit the terrain"
                  description="We reviewed GA4, GTM, event logic, and attribution rules end to end before changing the implementation."
                  items={["Mapped duplicate and unused tracking", "Identified channel-classification faults", "Produced a prioritized remediation plan"]}
                />
              </Reveal>
              <Reveal delay={100}>
                <RouteStep
                  number="02"
                  icon={Wrench}
                  title="Rebuild the foundation"
                  description="We simplified the analytics environment and established one dependable reporting source."
                  items={["Consolidated five GA4 properties into one", "Removed 122 obsolete UA tags", "Migrated the ecommerce data layer to GA4"]}
                />
              </Reveal>
              <Reveal delay={200}>
                <RouteStep
                  number="03"
                  icon={RadioTower}
                  title="Strengthen the signal"
                  description="Once browser-side collection was stable, we introduced server-side conversion tracking across paid media."
                  items={["Improved conversion resilience", "Aligned browser and server reporting", "Added platform-specific deduplication"]}
                />
              </Reveal>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Implementation detail</p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">What changed under the hood</h2>
                <p className="mt-5 leading-7 text-muted-foreground">
                  The transformation reduced complexity at every layer—from account governance to the shape of purchase data sent into reporting and ad platforms.
                </p>
                <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/[0.06] p-6">
                  <div className="flex items-center gap-3">
                    <CircleAlert className="h-5 w-5 text-primary" aria-hidden="true" />
                    <p className="font-semibold">A deliberate sequencing decision</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Server-side tracking was activated only after the browser-side measurement foundation and ecommerce schema were reliable.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                  <div className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-border/60 bg-muted/30 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground md:px-6">
                    <span>Layer</span>
                    <span>Before</span>
                    <span className="text-primary">After</span>
                  </div>
                  {[
                    ["GA4", "Five fragmented properties", "One primary reporting property"],
                    ["GTM", "320+ tags and unclear ownership", "122 obsolete tags removed"],
                    ["Events", "Duplicate actions", "Consolidated event logic"],
                    ["Attribution", "Broken channel grouping", "Corrected traffic classification"],
                    ["Referrals", "Own domain listed as a source", "Self-referrals excluded"],
                    ["Ecommerce", "UA-era, text-based values", "GA4 item-level schema"],
                    ["Paid media", "Browser-dependent signals", "Server-side conversion tracking"],
                  ].map(([layer, before, after]) => (
                    <div key={layer} className="grid grid-cols-[0.8fr_1fr_1fr] border-b border-border/40 px-4 py-4 text-xs last:border-b-0 md:px-6 md:text-sm">
                      <span className="font-semibold text-foreground">{layer}</span>
                      <span className="pr-3 text-muted-foreground">{before}</span>
                      <span className="text-foreground/90">{after}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="border-y border-border/40 bg-[#0b1215] py-16 md:py-24">
          <div className="container">
            <div className="mb-12 grid items-end gap-6 md:grid-cols-[1fr_auto]">
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Signal recovery dashboard</p>
                <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">Marketing reports moved closer to reality</h2>
              </Reveal>
              <Reveal delay={80}>
                <div className="rounded-2xl border border-primary/25 bg-primary/10 px-6 py-5 text-left md:text-right">
                  <p className="font-mono text-4xl font-bold text-primary">+12%</p>
                  <p className="mt-1 text-sm text-muted-foreground">more website conversions captured</p>
                </div>
              </Reveal>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-2xl border border-border/60 bg-card/75 p-6 md:p-8">
                  <h3 className="mb-7 flex items-center gap-3 text-lg font-semibold">
                    <Gauge className="h-5 w-5 text-primary" aria-hidden="true" />
                    Cross-platform agreement
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DeltaCard platform="Meta Ads discrepancy" before="40%" after="8%" note="Browser and server reporting aligned far more closely." />
                    <DeltaCard platform="Bing vs. GA4 variance" before="95%" after="2%" note="The major reporting gap was reduced to a marginal difference." />
                  </div>
                </div>
              </Reveal>

              <Reveal delay={100}>
                <div className="h-full rounded-2xl border border-border/60 bg-card/75 p-6 md:p-8">
                  <h3 className="mb-7 flex items-center gap-3 text-lg font-semibold">
                    <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
                    Conversion recovery and deduplication
                  </h3>
                  <div className="space-y-6">
                    <MetricBar label="Pinterest Ads" value={99} detail="deduplication accuracy" delay={0} />
                    <MetricBar label="TikTok Ads" value={97} detail="deduplication accuracy" delay={100} />
                    <MetricBar label="Google Ads" value={6} detail="additional conversions captured" delay={200} />
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={150} className="mt-8">
              <p className="text-center text-xs leading-5 text-muted-foreground">
                Reported improvements compare the corrected implementation with the prior tracking setup and vary by advertising platform.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-10 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-7 md:grid-cols-[1fr_auto] md:items-center md:p-12">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">The takeaway</p>
                <h2 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">Advanced tracking works best on a clean foundation.</h2>
                <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                  By consolidating analytics, correcting attribution, rebuilding ecommerce data, and then adding server-side measurement, Roadsurfer gained a clearer basis for allocating marketing spend across markets.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:min-w-[260px]">
                <Link href="/contact">
                  <Button size="lg" className="w-full shadow-lg shadow-primary/20">
                    Book a Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/health-check">
                  <Button size="lg" variant="outline" className="w-full bg-background/20">
                    Take Free Health Check
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 py-12">
          <div className="container">
            <h2 className="text-center font-mono text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Technologies & channels</h2>
            <div className="mx-auto mt-6 flex max-w-4xl flex-wrap justify-center gap-3">
              {[
                "Google Analytics 4",
                "Google Tag Manager",
                "GTM Server-Side",
                "Google Ads",
                "Meta Ads",
                "Microsoft Ads",
                "TikTok Ads",
                "Pinterest Ads",
                "GA4 Ecommerce",
              ].map((technology) => (
                <span key={technology} className="rounded-full border border-border/60 bg-card px-4 py-2 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground">
                  {technology}
                </span>
              ))}
            </div>
          </div>
        </section>
      </main>

      
    </div>
  );
}
