import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Award,
  Cpu,
  Globe,
  Handshake,
  Settings,
  Shield,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import TechnologyGrid from "@/components/TechnologyGrid";
import { type ReactNode } from "react";

export default function About({ children }: { children?: ReactNode }) {

  const stats = [
    { value: "2019", label: "Founded" },
    { value: "120+", label: "Projects Completed" },
    { value: "10+", label: "Countries Served" },
    { value: "7+", label: "Years of Expertise" },
  ];

  const expertise = [
    {
      icon: Target,
      title: "Server-Side Tracking Architecture",
      description:
        "Deep expertise in Google Tag Manager Server-Side, custom server implementations, and data flow optimization.",
    },
    {
      icon: TrendingUp,
      title: "GA4 Implementation & Migration",
      description:
        "Complete GA4 setup, UA to GA4 migration, custom event architecture, and cross-platform tracking.",
    },
    {
      icon: Globe,
      title: "Meta Conversions API & Ad Platforms",
      description:
        "Server-side conversion tracking for Meta, Google Ads, TikTok, and other platforms with deduplication and attribution.",
    },
    {
      icon: Award,
      title: "Consent Management & Privacy Compliance",
      description:
        "GDPR and CCPA compliant tracking with CMP integration, Consent Mode v2, and privacy-first measurement.",
    },
    {
      icon: Users,
      title: "Ecommerce & Funnel Analytics",
      description:
        "Enhanced ecommerce tracking for Shopify, WooCommerce, and custom platforms with complete customer journey visibility.",
    },
    {
      icon: TrendingUp,
      title: "Custom Reporting & Dashboards",
      description:
        "Looker Studio dashboards, automated reporting, and decision-focused analytics that drive action.",
    },
  ];

  const values = [
    {
      icon: Cpu,
      title: "Technical Depth",
      description:
        "We don't just install tags. We architect tracking systems that scale with your business and adapt to platform changes.",
    },
    {
      icon: Shield,
      title: "Privacy-First Approach",
      description:
        "We build compliant tracking that respects user privacy while delivering the insights you need.",
    },
    {
      icon: Handshake,
      title: "Strategic Partnership",
      description:
        "We work alongside your team, not as a vendor but as an extension of your marketing operations.",
    },
    {
      icon: Settings,
      title: "No Packages, Just Solutions",
      description:
        "Every business is different. We design custom solutions based on your specific needs and goals.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">


      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl mb-6">
              Your Technical{" "}
              <span className="text-primary">Analytics Partner</span>
            </h1>
            <p className="body-lg text-muted-foreground mb-8">
              Founded in 2019, Upsight Digital was built on a simple belief:
              accurate data should be accessible to every business, not just
              enterprise companies with massive budgets.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-md mb-8 text-center">Our Story</h2>
            <div className="space-y-6 text-muted-foreground">
              <p className="body-md">
                What started as a niche analytics consultancy has grown into a
                specialized agency trusted by brands across industries and
                continents. We've helped over 120 clients navigate the
                complexities of modern analytics—from the Universal Analytics
                sunset to the rise of server-side tracking and privacy-first
                measurement.
              </p>
              <p className="body-md">
                Over the years, we've built deep expertise in Google Analytics
                4, tag management, server-side tracking, customer data
                platforms, and consent compliance. We've seen firsthand how iOS
                14+ restrictions, cookie deprecation, and privacy regulations
                have transformed the analytics landscape. These challenges
                require modern solutions, and that's exactly what we deliver.
              </p>
              <p className="body-md">
                Today, we work with marketing agencies who need reliable
                tracking for their clients, ecommerce brands optimizing their
                customer journey, and growing businesses making data-driven
                decisions. Our mission remains the same: make data accurate,
                actionable, and growth-focused.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="section-spacing">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">What Makes Us Different</h2>
            <p className="body-md text-muted-foreground">
              We're not just another analytics agency. We're technical experts
              who understand both the technology and the business strategy
              behind effective tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6 flex gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 h-fit">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">Our Expertise</h2>
            <p className="body-md text-muted-foreground">
              Deep technical knowledge across the modern analytics and marketing
              technology stack.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {expertise.map((item, index) => {
              const Icon = item.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="mb-4 p-3 rounded-lg bg-primary/10 inline-block">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications & Technologies */}
      <section className="section-spacing">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <h2 className="heading-md mb-8 text-center">
              Certifications & Technologies
            </h2>
            
            {/* Certifications */}
            <div className="mb-12">
              <h3 className="font-semibold mb-6 text-center text-muted-foreground">Certifications</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Google Analytics Certified", icon: Award },
                  { name: "Google Tag Manager Expert", icon: Award },
                  { name: "Server-Side Tracking Specialist", icon: Award },
                  { name: "Privacy & Compliance Expert", icon: Award },
                ].map((cert, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex flex-col items-center justify-center gap-2 min-h-[80px]">
                      <Award className="h-6 w-6 text-primary" />
                      <span className="text-xs font-medium text-center">{cert.name}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div>
              <h3 className="font-semibold mb-6 text-center text-muted-foreground">Technologies We Master</h3>
              <TechnologyGrid className="grid grid-cols-3 md:grid-cols-6 gap-4" keys={['googleAnalytics', 'googleTagManager', 'metaCapi', 'segment', 'shopify', 'lookerStudio']} />
            </div>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">What Clients Say</h2>
            <p className="body-md text-muted-foreground">
              Every project is a partnership. Here's what our clients have to
              say about working with us.
            </p>
          </div>

          {children}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container">
          <Card className="border-2 border-primary">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="heading-md mb-6">Let's Work Together</h2>
              <p className="body-md text-muted-foreground mb-8 max-w-2xl mx-auto">
                Ready to fix your tracking and unlock the full potential of your
                analytics? Book a free consultation and let's discuss your
                needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonLink href="/contact" size="lg" className="text-base px-8 h-12">
                    Get Free Consultation
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
