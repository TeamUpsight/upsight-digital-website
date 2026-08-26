import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@/lib/routing";

const SLICE_LOGO_URL =
  "/images/slice-logo.png";
const ROADSURFER_LOGO_URL = "/images/roadsurfer-logo.png";

const studies = [
  {
    client: "Slice Life",
    category: "Food & Drink",
    href: "/case-studies/slice",
    logo: SLICE_LOGO_URL,
    logoAlt: "Slice Life logo",
    logoClassName: "h-16 w-16 rounded-xl object-contain",
    headline: "Turning fragmented measurement into a reliable growth engine",
    summary:
      "A server-side, consent-first analytics transformation that unified web and mobile measurement, repaired attribution, and improved paid-media performance.",
    metrics: [
      { value: "+57.91%", label: "Google Ads ROAS" },
      { value: "+130.43%", label: "Facebook Ads ROAS" },
      { value: "99%", label: "Order match" },
    ],
    technologies: ["Web", "Android", "iOS", "sGTM"],
  },
  {
    client: "Roadsurfer",
    category: "Travel & Mobility",
    href: "/case-studies/roadsurfer",
    logo: ROADSURFER_LOGO_URL,
    logoAlt: "Roadsurfer logo",
    logoClassName: "h-16 w-16 rounded-xl bg-white p-1 object-contain",
    headline: "From a tracking maze to one trusted view of every booking",
    summary:
      "A GA4, GTM, ecommerce, and server-side measurement rebuild that created a dependable reporting foundation across countries and paid-media channels.",
    metrics: [
      { value: "+12%", label: "Website conversions" },
      { value: "120+", label: "GTM tags removed" },
      { value: "5 → 1", label: "GA4 properties" },
    ],
    technologies: ["Web", "GA4", "GTM", "Server-Side"],
  },
];

export default function CaseStudies() {
  return (
    <div className="min-h-screen bg-background text-foreground">


      <div>
        <section className="relative overflow-hidden border-b border-border/40 pb-14 pt-28 md:pb-20 md:pt-36">
          <div
            className="absolute inset-0 opacity-70"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,173,132,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,173,132,0.045) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage: "linear-gradient(to bottom, black, transparent 92%)",
            }}
          />
          <div className="absolute -left-28 top-20 h-80 w-80 rounded-full bg-primary/10 blur-[110px]" />
          <div className="absolute -right-28 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-[90px]" />

          <div className="container relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">Case Studies</h1>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground md:text-lg">
                See how we help ambitious brands rebuild analytics foundations, recover lost signals, and make better marketing decisions with data they can trust.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-20">
          <div className="container">
            <div className="space-y-8">
              {studies.map((study, index) => (
                <Link
                  key={study.client}
                  href={study.href}
                  aria-label={`View ${study.client} case study`}
                  className="block rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <article className="group relative cursor-pointer overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 motion-reduce:transform-none">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-primary/40 to-transparent" />
                    <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                      <div className="p-6 md:p-9 lg:p-11">
                        <div className="mb-8 flex items-center gap-4">
                          <img
                            src={study.logo}
                            alt={study.logoAlt}
                            width="64"
                            height="64"
                            className={study.logoClassName}
                            loading={index === 0 ? "eager" : "lazy"}
                          />
                          <div>
                            <p className="text-lg font-semibold">{study.client}</p>
                            <p className="text-sm text-muted-foreground">{study.category}</p>
                          </div>
                        </div>

                        <h2 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight md:text-4xl">
                          {study.headline}
                        </h2>
                        <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">{study.summary}</p>

                        <div className="mt-8 flex flex-wrap gap-2">
                          {study.technologies.map((technology) => (
                            <span
                              key={technology}
                              className="rounded-full border border-border/60 bg-background/40 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                            >
                              {technology}
                            </span>
                          ))}
                        </div>

                        <span className="mt-8 inline-flex h-10 items-center rounded-md border border-border bg-background/20 px-4 text-sm font-medium transition-colors group-hover:border-primary/35 group-hover:text-primary">
                          View {study.client} Case Study
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </span>
                      </div>

                      <div className="relative border-t border-border/50 bg-muted/20 p-6 md:p-9 lg:border-l lg:border-t-0 lg:p-11">
                        <div className="absolute right-5 top-4 font-mono text-6xl font-bold text-primary/[0.05]">0{index + 1}</div>
                        <p className="relative mb-6 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Topline outcomes</p>
                        <div className="relative space-y-4">
                          {study.metrics.map((metric) => (
                            <div
                              key={metric.label}
                              className="rounded-2xl border border-primary/15 bg-background/40 px-5 py-4 transition-colors group-hover:border-primary/30"
                            >
                              <p className="font-mono text-3xl font-bold text-primary">{metric.value}</p>
                              <p className="mt-1 text-sm text-muted-foreground">{metric.label}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container">
            <div className="grid gap-8 rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-card p-7 md:grid-cols-[1fr_auto] md:items-center md:p-12">
              <div>
                <div className="mb-4 flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-[0.2em]">Your measurement story</span>
                </div>
                <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">Ready to turn tracking complexity into clearer growth decisions?</h2>
                <p className="mt-5 max-w-2xl leading-7 text-muted-foreground">
                  We will assess your current analytics foundation and show you where data quality, attribution, or platform signals are limiting performance.
                </p>
              </div>
              <Link href="/contact">
                <Button size="lg" className="w-full shadow-lg shadow-primary/20 md:w-auto">
                  Book a Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      
    </div>
  );
}
