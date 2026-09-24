import AnimatedHero from "@/components/AnimatedHero";
import LogoSlider from "@/components/LogoSlider";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/lib/routing";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Cpu,
  Lock,
  RefreshCw,
  Server,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { ReactNode } from 'react';

export default function Home({ children }: { children?: ReactNode }) {

  const clientLogos = [
    { src: "/images/client-logo-1.webp", alt: "" },
    { src: "/images/client-logo-2.webp", alt: "" },
    { src: "/images/client-logo-3.webp", alt: "" },
    { src: "/images/client-logo-4.webp", alt: "" },
    { src: "/images/client-logo-5.webp", alt: "" },
    { src: "/images/client-logo-6.webp", alt: "" },
    { src: "/images/client-logo-7.webp", alt: "" },
    { src: "/images/client-logo-8.webp", alt: "" },
    { src: "/images/client-logo-9.webp", alt: "" },
    { src: "/images/client-logo-10.webp", alt: "" },
    { src: "/images/client-logo-11.webp", alt: "" },
    { src: "/images/client-logo-12.webp", alt: "" },
  ];

  const services = [
    {
      icon: Server,
      title: "Server-Side Tracking",
      description:
        "Build a controlled server-side event path with sGTM, consent-aware routing, and validation for key conversions.",
      link: "/services/server-side-tracking/",
    },
    {
      icon: Activity,
      title: "Meta Conversions API",
      description:
        "Implement CAPI event mapping, diagnostics, and browser/server deduplication for Meta advertising.",
      link: "/services/meta-conversions-api/",
    },
    {
      icon: Lock,
      title: "Cookie Consent & CMP",
      description:
        "Implement CMPs, Consent Mode v2, and GTM consent routing for consent-aware measurement.",
      link: "/services/cookie-consent/",
    },
    {
      icon: BarChart3,
      title: "Tracking Audits",
      description:
        "Comprehensive audit of your analytics setup. Identify gaps, fix errors, and ensure data accuracy across all platforms.",
      link: "/services/tracking-audit/",
    },
    {
      icon: TrendingUp,
      title: "Custom Dashboards",
      description:
        "Looker Studio dashboards with decision-focused insights. Automated reporting that saves time and aligns teams.",
      link: "/services/analytics-dashboards/",
    },
    {
      icon: BarChart3,
      title: "GA4/GTM Setup",
      description:
        "Plan and implement website events, ecommerce measurement, conversions, and data-layer requirements in GA4 and GTM.",
      link: "/services/ga4-gtm-setup/",
    },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Tailored Tracking Architectures",
      description:
        "Custom solutions designed for your specific business model, tech stack, and growth goals.",
    },
    {
      icon: Cpu,
      title: "Advanced Technical Expertise",
      description:
        "Deep knowledge of GA4, sGTM, CAPI, and modern analytics infrastructure.",
    },
    {
      icon: RefreshCw,
      title: "Insight-Driven Optimization",
      description:
        "We don't just implement—we continuously monitor, refine, and improve your tracking.",
    },
    {
      icon: Users,
      title: "Transparent & Collaborative",
      description:
        "Clear communication, detailed documentation, and ongoing support as an extension of your team.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">


      {/* Hero: server-rendered HTML with a lightweight progressive canvas enhancement */}
      <AnimatedHero />

      {/* Problem/Solution Section */}
      <section className="section-spacing bg-muted/30 min-h-[600px] md:min-h-[700px]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">The Hidden Cost of Broken Analytics</h2>
            <p className="body-md text-muted-foreground">
              iOS 14+ tracking loss, cookie restrictions, attribution gaps, and
              compliance risks are costing you money every day. Modern problems
              require modern solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 min-h-[300px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-destructive">
                  Without Proper Tracking
                </h3>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span className="text-sm text-muted-foreground">
                      Working with incomplete or inconsistent browser-side measurement
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span className="text-sm text-muted-foreground">
                      Wasting ad spend on campaigns you can't measure
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span className="text-sm text-muted-foreground">
                      Making decisions based on incomplete or inaccurate data
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-destructive mt-1">✗</span>
                    <span className="text-sm text-muted-foreground">
                      Unclear consent behaviour and privacy requirements
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary min-h-[300px] flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  With Upsight Digital
                </h3>
                <ul className="space-y-3 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Server-side tracking with a controlled event path
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Meta CAPI and platform integrations for accurate attribution
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Consent-aware measurement with technical consent management
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">
                      Clear, actionable dashboards for confident decision-making
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-spacing min-h-[500px] md:min-h-[600px]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">
              Data-Driven Solutions That Drive Real Results
            </h2>
            <p className="body-md text-muted-foreground">
              From server-side tracking to consent-aware measurement, we build
              analytics infrastructure that scales with your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const cardContent = (
                <Card
                  key={index}
                  className="group h-full cursor-pointer border-border transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-[0_10px_28px_rgba(0,173,132,0.12)]"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 inline-block">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                      Explore service
                      <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-focus-within:translate-x-1" aria-hidden="true" />
                    </span>
                  </CardContent>
                </Card>
              );
              return (
                <Link key={index} href={service.link} className="block h-full" aria-label={`Learn more about ${service.title}`}>
                  {cardContent}
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <ButtonLink href="/services" size="lg" variant="outline">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </ButtonLink>
          </div>
        </div>
      </section>

      {/* Who We Serve Section */}
      <section className="section-spacing bg-muted/30 min-h-[500px] md:min-h-[600px]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">Who We Serve</h2>
            <p className="body-md text-muted-foreground">
              Specialized solutions for marketing agencies and growing businesses.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Marketing Agencies
                </h3>
                <p className="text-muted-foreground mb-6">
                  Deliver reliable tracking for your clients without hiring a
                  full-time analytics team. Fast turnaround, white-label
                  support, and expert troubleshooting.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      White-label analytics implementation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Fast project turnaround times
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Ongoing support and troubleshooting
                    </span>
                  </li>
                </ul>
                <ButtonLink href="/who-its-for" className="w-full">Explore Agency Solutions</ButtonLink>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Ecommerce & Website Owners
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get accurate data for smarter growth decisions. Track every
                  customer touchpoint with consent-aware, reliable analytics.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Complete tracking infrastructure
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Consent-aware implementation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Clear, actionable reporting
                    </span>
                  </li>
                </ul>
                <ButtonLink href="/who-its-for" className="w-full">Explore Ecommerce Solutions</ButtonLink>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section-spacing min-h-[500px] md:min-h-[600px]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">
              Why Leading Brands Trust Upsight Digital
            </h2>
            <p className="body-md text-muted-foreground">
              We don't just set up tracking—we ensure your data is accurate,
              privacy-compliant, and built to scale.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6 flex gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 h-fit">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trusted By Section: CSS-only animation, no hydration required */}
      <LogoSlider logos={clientLogos} />

      {/* Testimonials Section - Lazy loaded */}
      <section className="section-spacing bg-muted/30 min-h-[500px] md:min-h-[600px]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">What Our Clients Say</h2>
            <p className="body-md text-muted-foreground">
              Trusted by growth leaders and analytics experts worldwide.
            </p>
          </div>

          {children}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-primary/5 border-t min-h-[300px] md:min-h-[400px]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="heading-md mb-6">Ready to Fix Your Tracking?</h2>
            <p className="body-md text-muted-foreground mb-8">
              Get a free audit of your analytics setup. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <ButtonLink href="/health-check" size="lg" className="bg-[#008466] hover:bg-[#007A5E] text-white">
                  Start Free Health Check
                </ButtonLink>
              <ButtonLink href="/contact" size="lg" variant="outline">
                  Schedule Consultation
                </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
