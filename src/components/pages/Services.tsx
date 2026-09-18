import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Database,
  FileSearch,
  Lock,
  Server,
  ShoppingCart,
  Smartphone,
  TrendingUp,
  Zap,
} from "lucide-react";

interface Service { id: string; icon: typeof Server; title: string; description: string; benefits: string[]; whoNeedsIt: string; link?: string }
interface ServiceCategory { id: string; category: string; description: string; services: Service[] }

export default function Services() {

  const serviceCategories: ServiceCategory[] = [
    {
      id: "tracking-implementation",
      category: "Tracking & Implementation",
      description:
        "Build reliable tracking infrastructure that captures every key event with precision.",
      services: [
        {
          id: "server-side-tracking",
          icon: Server,
          title: "Server-Side Tracking (sGTM)",
          description:
            "Google Tag Manager Server-Side container setup that bypasses browser restrictions, improves data accuracy, and reduces page load times.",
          benefits: [
            "Bypass iOS 14+ and browser tracking restrictions",
            "Improve data accuracy by 30-50%",
            "Reduce client-side page load impact",
            "Enhanced data security and control",
          ],
          whoNeedsIt:
            "Brands losing conversions to iOS 14+, agencies managing multiple clients",
        },
        {
          id: "ga4-gtm-web",
          icon: BarChart3,
          title: "GA4/GTM Setup (Web)",
          description:
            "Complete Google Analytics 4 and Google Tag Manager implementation for web, including custom event tracking, data layer setup, and cross-platform configuration.",
          benefits: [
            "Future-proof analytics infrastructure",
            "Cross-platform tracking (web, app, offline)",
            "Custom event and parameter setup",
            "Organized tag management and version control",
          ],
          whoNeedsIt:
            "Businesses needing comprehensive web tracking and marketing team autonomy",
        },
        {
          id: "ga4-gtm-mobile",
          icon: Smartphone,
          title: "GA4/GTM Setup (Mobile)",
          description:
            "Mobile app analytics implementation with Firebase Analytics, GA4 integration, and mobile-specific event tracking for iOS and Android applications.",
          benefits: [
            "Native iOS and Android tracking",
            "Firebase Analytics integration",
            "App-specific event architecture",
            "Cross-platform user journey tracking",
          ],
          whoNeedsIt:
            "App developers, businesses with mobile apps needing analytics",
        },
      ],
    },
    {
      id: "attribution-compliance",
      category: "Attribution & Compliance",
      description:
        "Accurate conversion tracking and privacy-compliant measurement for modern marketing.",
      services: [
        {
          id: "meta-capi",
          icon: Activity,
          title: "Meta Conversions API (CAPI)",
          description:
            "Server-side conversion tracking for Facebook and Instagram ads that recovers lost conversions and improves attribution.",
          benefits: [
            "Recover 20-40% of lost conversions",
            "Improve ad delivery optimization",
            "Better attribution accuracy",
            "Event deduplication with pixel data",
          ],
          whoNeedsIt: "Brands running Meta ads with declining ROAS",
        },
        {
          id: "consent-compliance",
          icon: Lock,
          title: "Cookie Consent & CMP Setup",
          description:
            "Consent Management Platform integration and Google Consent Mode v2 implementation for GDPR/CCPA compliance.",
          benefits: [
            "GDPR and CCPA compliance",
            "Consent Mode v2 implementation",
            "Maintain tracking while respecting privacy",
            "Reduced legal risk",
          ],
          whoNeedsIt:
            "EU/CA businesses, brands concerned about privacy regulations",
          link: "/services/cookie-consent",
        },
        {
          id: "attribution",
          icon: Zap,
          title: "Multi-Touch Attribution",
          description:
            "Attribution modeling, cross-platform tracking, and deduplication to understand the true customer journey.",
          benefits: [
            "Understand full customer journey",
            "Optimize marketing mix",
            "Reduce wasted ad spend",
            "Data-driven budget allocation",
          ],
          whoNeedsIt: "Brands running multi-channel campaigns",
        },
      ],
    },
    {
      id: "ecommerce-funnel",
      category: "Ecommerce & Funnel Tracking",
      description:
        "Track the complete customer journey from first touch to purchase and beyond.",
      services: [
        {
          id: "ecommerce-tracking",
          icon: ShoppingCart,
          title: "Ecommerce Tracking",
          description:
            "Enhanced ecommerce implementation for Shopify, WooCommerce, and custom platforms with complete product analytics.",
          benefits: [
            "Track full customer journey",
            "Product performance insights",
            "Cart abandonment tracking",
            "Revenue attribution",
          ],
          whoNeedsIt: "Online stores, subscription businesses",
        },
        {
          id: "funnel-tracking",
          icon: Activity,
          title: "Custom Funnel Tracking",
          description:
            "Multi-step form tracking, lead generation tracking, and conversion funnel optimization.",
          benefits: [
            "Identify drop-off points",
            "Optimize conversion rates",
            "Lead quality tracking",
            "Funnel performance analysis",
          ],
          whoNeedsIt: "SaaS, lead-gen businesses, complex sales funnels",
        },
      ],
    },
    {
      id: "reporting-optimization",
      category: "Reporting & Optimization",
      description:
        "Turn raw data into actionable insights with audits, dashboards, and strategic planning.",
      services: [
        {
          id: "tracking-audits",
          icon: FileSearch,
          title: "Tracking Audits",
          description:
            "Comprehensive audit of your existing tracking setup with data quality assessment and actionable recommendations.",
          benefits: [
            "Identify tracking gaps and errors",
            "Data quality assessment",
            "Prioritized fix recommendations",
            "Implementation roadmap",
          ],
          whoNeedsIt:
            "Brands with unreliable data, agencies onboarding new clients",
        },
        {
          id: "dashboards-reports",
          icon: TrendingUp,
          title: "Custom Dashboards & Reports",
          description:
            "Looker Studio dashboards, automated reporting, and KPI tracking focused on decision-making.",
          benefits: [
            "Decision-focused insights",
            "Automated reporting saves time",
            "Team alignment on metrics",
            "Real-time performance visibility",
          ],
          whoNeedsIt:
            "Marketing teams, executives needing clear performance visibility",
        },
        {
          id: "measurement-planning",
          icon: Database,
          title: "Measurement Planning",
          description:
            "Tracking strategy development, KPI framework definition, and data governance for scalable analytics.",
          benefits: [
            "Align tracking with business goals",
            "Scalable data structure",
            "Clear KPI definitions",
            "Documentation and governance",
          ],
          whoNeedsIt: "Growing businesses, new product launches",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">


      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl mb-6">
              Data-Driven Solutions That Drive{" "}
              <span className="text-primary">Real Results</span>
            </h1>
            <p className="body-lg text-muted-foreground mb-8">
              From server-side tracking to privacy compliance, we build
              analytics infrastructure that's accurate, scalable, and aligned
              with your business goals.
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
          </div>
        </div>
      </section>

      {/* Service Categories */}
      {serviceCategories.map((category, categoryIndex) => (
        <section
          key={categoryIndex}
          id={category.id}
          className={`section-spacing defer-render ${
            categoryIndex % 2 === 0 ? "bg-muted/30" : ""
          }`}
        >
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="heading-md mb-4">{category.category}</h2>
              <p className="body-md text-muted-foreground">
                {category.description}
              </p>
            </div>

            <div className="grid gap-8 max-w-6xl mx-auto">
              {category.services.map((service, serviceIndex) => {
                const Icon = service.icon;
                const cardContent = (
                  <Card
                    key={serviceIndex}
                    id={service.id}
                    className="hover:border-primary transition-all duration-300 scroll-mt-24"
                  >
                    <CardContent className="p-8">
                      <div className="grid md:grid-cols-3 gap-8">
                        {/* Left: Icon and Title */}
                        <div className="md:col-span-1">
                          <div className="mb-4 p-3 rounded-lg bg-primary/10 inline-block">
                            <Icon className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-2xl font-semibold mb-3">
                            {service.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>

                        {/* Middle: Benefits */}
                        <div className="md:col-span-1">
                          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                            Key Benefits
                          </h4>
                          <ul className="space-y-2">
                            {service.benefits.map((benefit, benefitIndex) => (
                              <li
                                key={benefitIndex}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Right: Who Needs It */}
                        <div className="md:col-span-1">
                          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
                            Who Needs This
                          </h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            {service.whoNeedsIt}
                          </p>
                          <ButtonLink href={service.link || "/contact"} size="sm" className="w-full">
                              {service.link ? `Explore ${service.title}` : `Discuss ${service.title}`}
                            </ButtonLink>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
                return cardContent;
              })}
            </div>
          </div>
        </section>
      ))}

      {/* Technologies Section */}
      <section className="section-spacing defer-render">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">Technologies We Work With</h2>
            <p className="body-md text-muted-foreground">
              Deep expertise across the modern analytics and marketing technology stack.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { name: "Google Analytics 4", logo: null },
              { name: "Google Tag Manager", logo: null },
              { name: "Server-Side GTM", logo: null },
              { name: "Meta Conversions API", logo: null },
              { name: "Segment", logo: null },
              { name: "Tealium", logo: null },
              { name: "Shopify", logo: null },
              { name: "WooCommerce", logo: null },
              { name: "Consent Mode v2", logo: null },
              { name: "Looker Studio", logo: null },
              { name: "BigQuery", logo: null },
              { name: "Custom Platforms", logo: null },
            ].map((tech, index) => (
              <Card key={index} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-4 flex flex-col items-center justify-center gap-3 min-h-[100px]">
                  {tech.logo ? (
                    <img 
                      src={tech.logo} 
                      alt={tech.name} 
                      className="h-8 w-8 object-contain"
                      width="32"
                      height="32"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                      <span aria-hidden="true" className="text-primary font-bold text-xs">{tech.name === "Custom Platforms" ? "API" : tech.name.split(/[ -]/).map(word => word[0]).slice(0, 3).join("")}</span>
                    </div>
                  )}
                  <span className="text-sm font-medium text-center">{tech.name}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <Card className="border-2 border-primary">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="heading-md mb-6">
                Not Sure Which Service You Need?
              </h2>
              <p className="body-md text-muted-foreground mb-8 max-w-2xl mx-auto">
                Book a free consultation. We'll review your current setup,
                identify gaps, and recommend the right solution for your
                business.
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
