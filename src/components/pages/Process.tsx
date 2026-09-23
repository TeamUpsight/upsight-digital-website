import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  Lightbulb,
  Rocket,
  Settings,
  TrendingUp,
} from "lucide-react";

export default function Process() {

  const steps = [
    {
      number: "01",
      icon: FileSearch,
      title: "Audit & Discovery",
      description:
        "We start by understanding your business objectives, audience, and current data infrastructure to identify gaps and opportunities.",
      activities: [
        "Review current tracking setup and data quality",
        "Identify gaps, errors, and missing events",
        "Define success metrics and KPIs",
        "Assess compliance requirements",
      ],
      deliverable: "Comprehensive audit report with prioritized recommendations",
      timeline: "3-5 days",
    },
    {
      number: "02",
      icon: Lightbulb,
      title: "Measurement Planning & Architecture Design",
      description:
        "We design a tracking architecture tailored to your business model, defining events, parameters, and data structure for scalable analytics.",
      activities: [
        "Design tracking architecture and data flow",
        "Define events, parameters, and naming conventions",
        "Create measurement plan documentation",
        "Build implementation roadmap",
      ],
      deliverable: "Technical specification document and implementation plan",
      timeline: "5-7 days",
    },
    {
      number: "03",
      icon: Settings,
      title: "Implementation",
      description:
        "We set up GA4, GTM, server-side tracking, CAPI, consent management, and all necessary integrations according to the measurement plan.",
      activities: [
        "Configure GA4 properties and data streams",
        "Set up GTM containers (web and server-side)",
        "Implement Meta CAPI and platform integrations",
        "Configure consent management and Consent Mode v2",
      ],
      deliverable: "Fully configured tracking system ready for testing",
      timeline: "1-3 weeks",
    },
    {
      number: "04",
      icon: CheckCircle2,
      title: "Validation & QA",
      description:
        "We thoroughly test all tracking in staging environments, verify data accuracy across platforms, and document the complete setup.",
      activities: [
        "Test all tracking in staging environment",
        "Verify data accuracy in GA4 and ad platforms",
        "Cross-check event deduplication",
        "Provide training and documentation",
      ],
      deliverable: "QA report, documentation, and team training",
      timeline: "3-5 days",
    },
    {
      number: "05",
      icon: TrendingUp,
      title: "Optimization & Support",
      description:
        "We continuously monitor data quality, refine tracking based on insights, and provide ongoing support to ensure long-term success.",
      activities: [
        "Monitor data quality and tracking health",
        "Refine tracking based on business needs",
        "Provide ongoing troubleshooting support",
        "Deliver monthly performance reports",
      ],
      deliverable: "Ongoing support and monthly performance reports",
      timeline: "Continuous",
    },
  ];

  const projectTimeline = [
    {
      phase: "Small Project",
      duration: "2-3 weeks",
      examples: "GA4 setup, GTM implementation, basic tracking audit",
    },
    {
      phase: "Medium Project",
      duration: "4-6 weeks",
      examples:
        "Server-side tracking, Meta CAPI, consent management, ecommerce tracking",
    },
    {
      phase: "Large Project",
      duration: "8-12 weeks",
      examples:
        "Complete analytics overhaul, multi-platform integration, custom CDP setup",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">


      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl mb-6">
              Our <span className="text-primary">5-Step Process</span>
            </h1>
            <p className="body-lg text-muted-foreground mb-8">
              A systematic approach to building analytics infrastructure that's
              accurate, scalable, and aligned with your business goals.
            </p>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section-spacing">
        <div className="container">
          <div className="max-w-5xl mx-auto space-y-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card
                  key={index}
                  className="hover:border-primary transition-all duration-300"
                >
                  <CardContent className="p-8">
                    <div className="grid md:grid-cols-12 gap-8">
                      {/* Left: Number and Icon */}
                      <div className="md:col-span-2">
                        <div aria-hidden="true" className="text-6xl font-bold text-primary/70 mb-4">
                          {step.number}
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10 inline-block">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>

                      {/* Middle: Content */}
                      <div className="md:col-span-6">
                        <h2 className="text-2xl font-semibold mb-3">
                          <span className="sr-only">Step {step.number}: </span>
                          {step.title}
                        </h2>
                        <p className="text-muted-foreground mb-6">
                          {step.description}
                        </p>

                        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                          Key Activities
                        </h3>
                        <ul className="space-y-2">
                          {step.activities.map((activity, activityIndex) => (
                            <li
                              key={activityIndex}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{activity}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Right: Deliverable and Timeline */}
                      <div className="md:col-span-4">
                        <div className="bg-muted/50 rounded-lg p-6">
                          <div className="mb-4">
                            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                              Deliverable
                            </h3>
                            <p className="text-sm">{step.deliverable}</p>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wide text-muted-foreground">
                              Timeline
                            </h3>
                            <p className="text-sm font-medium text-primary">
                              {step.timeline}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Project Timeline */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-md mb-6">Typical Project Timeline</h2>
              <p className="body-md text-muted-foreground">
                Project duration varies based on scope and complexity. Here's
                what to expect for different project sizes.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {projectTimeline.map((project, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.phase}
                    </h3>
                    <div className="text-3xl font-bold text-primary mb-4">
                      {project.duration}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {project.examples}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Timeline starts after project kickoff and may vary based on
                client responsiveness and technical complexity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="section-spacing">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-md mb-6">What Makes Our Process Different</h2>
              <p className="body-md text-muted-foreground">
                We don't just implement tags—we build strategic analytics
                infrastructure that scales with your business.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Rocket className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Strategic Approach</h3>
                  <p className="text-sm text-muted-foreground">
                    We start with your business goals and work backward to
                    design tracking that delivers the insights you need, not
                    just data you'll never use.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Thorough QA</h3>
                  <p className="text-sm text-muted-foreground">
                    Every implementation is tested in staging before going live.
                    We verify data accuracy across all platforms and provide
                    detailed documentation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Continuous Optimization</h3>
                  <p className="text-sm text-muted-foreground">
                    We don't disappear after launch. We monitor data quality,
                    refine tracking based on your evolving needs, and provide
                    ongoing support.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <Lightbulb className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Knowledge Transfer</h3>
                  <p className="text-sm text-muted-foreground">
                    We provide comprehensive documentation and training so your
                    team understands the setup and can make informed decisions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <Card className="border-2 border-primary">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="heading-md mb-6">Ready to Get Started?</h2>
              <p className="body-md text-muted-foreground mb-8 max-w-2xl mx-auto">
                Book a free consultation. We'll review your current setup,
                identify gaps, and outline a clear plan to fix your tracking.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonLink href="/contact" size="lg" className="text-base px-8 h-12">
                    Book Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </ButtonLink>
                <ButtonLink href="/health-check" size="lg" variant="outline" style={{
                      boxShadow: '0 0 20px rgba(0, 173, 132, 0.2)',
                      animation: 'button-glow 2s ease-in-out infinite',
                    }} className="text-base px-8 h-12 border-primary text-primary hover:bg-primary/10 relative overflow-hidden group">
                    <span className="relative z-10">✨ Free Health Check</span>
                    <div 
                      className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 173, 132, 0.3) 0%, transparent 50%, rgba(0, 173, 132, 0.3) 100%)',
                      }}
                    />
                  </ButtonLink>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      
    </div>
  );
}
