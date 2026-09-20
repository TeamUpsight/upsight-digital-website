import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  ClipboardCheck,
  EyeOff,
  FileText,
  Globe,
  Megaphone,
  Palette,
  PenTool,
  Route,
  Search,
  Settings,
  ShieldAlert,
  ShoppingCart,
  ToggleRight,
  Users,
  Wrench,
} from "lucide-react";
import TechnologyGrid from "@/components/TechnologyGrid";

export default function CookieConsent() {

  const problems = [
    {
      icon: EyeOff,
      title: "Blinded Algorithms",
      description:
        "Users decline consent, pixels stop firing, and your ad platforms lose the signals they need to optimize.",
    },
    {
      icon: ShieldAlert,
      title: "Broken Attribution",
      description:
        "You spend money on campaigns, but your reports no longer show what is actually driving revenue.",
    },
    {
      icon: AlertTriangle,
      title: "Compliance Risk",
      description:
        "Tags firing without intended consent controls can create an unclear measurement and privacy posture.",
    },
  ];

  const solutions = [
    {
      icon: Settings,
      title: "CMP Platform Selection",
      description:
        "We review your website, traffic regions, business model, and tech stack to recommend the right CMP.",
    },
    {
      icon: Palette,
      title: "Clear Banner UX",
      description:
        "We configure clear consent experiences around your approved categories, regions, and technical requirements.",
    },
    {
      icon: ToggleRight,
      title: "Google Consent Mode v2",
      description:
        "We configure advanced consent signals so Google can model lost conversion data when users decline.",
    },
    {
      icon: Route,
      title: "GTM Consent Routing",
      description:
        "Tags fire only when allowed. No leakage. No messy workarounds. No blind guessing.",
    },
    {
      icon: FileText,
      title: "Policy & Vendor Sync",
      description:
        "We document vendor and tag behaviour so technical implementation can stay aligned as your marketing stack changes.",
    },
    {
      icon: Globe,
      title: "Multi-Region Setup",
      description:
        "For brands operating across countries, we configure consent rules by region, language, and privacy requirement.",
    },
  ];

  const processSteps = [
    {
      icon: Search,
      step: "01",
      title: "Audit",
      description:
        "We inspect your current CMP, GTM setup, tracking tags, consent behavior, and data leakage risks.",
    },
    {
      icon: PenTool,
      step: "02",
      title: "Design",
      description:
        "We define the right consent architecture for your website, regions, tools, and marketing platforms.",
    },
    {
      icon: Wrench,
      step: "03",
      title: "Implement",
      description:
        "We configure the CMP, Google Consent Mode v2, GTM consent checks, and vendor-specific tag rules.",
    },
    {
      icon: ClipboardCheck,
      step: "04",
      title: "Validate",
      description:
        "We test accept, reject, and partial-consent scenarios to confirm tracking behaves correctly.",
    },
  ];

  const audiences = [
    {
      icon: ShoppingCart,
      title: "Ecommerce Brands",
      description:
        "Protect conversion tracking while staying aligned with privacy requirements.",
    },
    {
      icon: Megaphone,
      title: "Paid Media Teams",
      description:
        "Keep Google, Meta, TikTok, Snapchat, and other ad platforms receiving the cleanest allowed signals.",
    },
    {
      icon: Users,
      title: "Marketing Agencies",
      description:
        "Deliver consent-aware tracking setups for clients without creating messy tag logic.",
    },
    {
      icon: Building2,
      title: "Multi-Region Businesses",
      description:
        "Manage different consent rules across countries, languages, brands, and domains.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">


      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        {/* Subtle background grid */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl mb-6">
              Cookie Consent &amp; CMP{" "}
              <span className="text-primary">Implementation</span>
            </h1>
            <p className="body-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
              We implement CMPs, Google Consent Mode v2, and consent-based GTM
              routing so approved analytics and advertising tags behave according
              to the consent state your team has defined.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <ButtonLink href="/contact" size="lg" className="text-base px-8 h-12">
                  Fix My Tracking Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </ButtonLink>
              <ButtonLink href="/health-check" size="lg" variant="outline" style={{
                    boxShadow: "0 0 20px rgba(0, 173, 132, 0.2)",
                    animation: "button-glow 2s ease-in-out infinite",
                  }} className="text-base px-8 h-12 border-primary text-primary hover:bg-primary/10 relative overflow-hidden group">
                  <span className="relative z-10">
                    ✨ Free Health Check
                  </span>
                  <div
                    className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0, 173, 132, 0.3) 0%, transparent 50%, rgba(0, 173, 132, 0.3) 100%)",
                    }}
                  />
                </ButtonLink>
            </div>

            <p className="text-xs text-muted-foreground">
              No credit card required for the initial health check.
            </p>
          </div>
        </div>
      </section>

      {/* Technical scope */}
      <section className="py-8 border-y border-border/50 bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center items-center">
            {[
              { value: "CMP", label: "selection and configuration" },
              { value: "Consent Mode", label: "v2 implementation" },
              { value: "GTM", label: "consent routing" },
              { value: "QA", label: "accept, reject, and partial-consent testing" },
            ].map((stat, index) => <div key={index} className="flex flex-col items-center"><span className="text-lg md:text-xl font-bold text-primary">{stat.value}</span><span className="text-xs text-muted-foreground mt-1">{stat.label}</span></div>)}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">
              Consent Needs More Than a Banner
            </h2>
            <p className="body-md text-muted-foreground">
              A banner needs to be connected properly to GTM, GA4, and advertising
              tags. Without an agreed consent-state design, teams can struggle to
              understand which tags run and what their reporting represents.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {problems.map((problem, index) => {
              const Icon = problem.icon;
              return (
                <Card
                  key={index}
                  className="border-border/50 hover:border-destructive/50 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-lg bg-destructive/10 inline-block">
                      <Icon className="h-6 w-6 text-destructive" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {problem.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {problem.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">
              Consent Infrastructure Built for Measurement
            </h2>
            <p className="body-md text-muted-foreground">
              We do not just install a banner. We engineer the full consent layer
              behind it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {solutions.map((solution, index) => {
              const Icon = solution.icon;
              return (
                <Card
                  key={index}
                  className="group hover:border-primary transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 inline-block group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">
                      {solution.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {solution.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">How We Fix It</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="border-border/50 hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                >
                  <CardContent className="p-6">
                    {/* Step number */}
                    <span aria-hidden="true" className="text-4xl font-bold text-primary/70 absolute top-4 right-4">
                      {step.step}
                    </span>
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 inline-block">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3"><span className="sr-only">Step {step.step}: </span>{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Who Needs This Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">Who This Is For</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {audiences.map((audience, index) => {
              const Icon = audience.icon;
              return (
                <Card
                  key={index}
                  className="hover:border-primary/50 transition-all duration-300"
                >
                  <CardContent className="p-6 flex gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 h-fit flex-shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {audience.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {audience.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">Tools We Work With</h2>
          </div>

          <TechnologyGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-5xl mx-auto" keys={['cookiebot', 'consentMode', 'googleTagManager', 'googleAnalytics', 'metaCapi', 'tiktok', 'snapchat', 'linkedin', 'shopify', 'wordpress', 'woocommerce', 'customPlatform']} />
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="section-spacing">
        <div className="container">
          <Card className="border-2 border-primary">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="heading-md mb-6">
                Build Consent-Aware Measurement.
              </h2>
              <p className="body-md text-muted-foreground mb-8 max-w-2xl mx-auto">
                We help you build a consent system with clear category choices,
                routing rules, and QA for the measurement your team is permitted
                to collect. This is technical implementation support, not legal advice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <ButtonLink href="/health-check" size="lg" className="text-base px-8 h-12">
                    Take the Health Check
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </ButtonLink>
                <ButtonLink href="/contact" size="lg" variant="outline" className="text-base px-8 h-12">
                    Book Free Consultation
                  </ButtonLink>
              </div>
              <p className="text-xs text-muted-foreground">
                Discuss your technical consent implementation with our team.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      
    </div>
  );
}
