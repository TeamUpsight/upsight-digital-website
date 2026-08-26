import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  Code,
  DollarSign,
  FileText,
  GraduationCap,
  HeadphonesIcon,
  Heart,
  LayoutDashboard,
  LineChart,
  Repeat,
  Server,
  Shield,
  ShoppingBag,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
import { Link } from "@/lib/routing";
import { useEffect } from "react";

export default function WhoItsFor() {
  // SEO is handled by the SEO component in the return

  const agencyBenefits = [
    {
      icon: Zap,
      title: "Fast Turnaround",
      description:
        "Quick implementation for client projects without sacrificing quality.",
    },
    {
      icon: Users,
      title: "White-Label Support",
      description:
        "We work behind the scenes as an extension of your team.",
    },
    {
      icon: Shield,
      title: "Expert Troubleshooting",
      description:
        "Solve complex tracking challenges that stump other providers.",
    },
    {
      icon: Clock,
      title: "Ongoing Support",
      description:
        "Continuous monitoring and optimization for your clients.",
    },
  ];

  const businessBenefits = [
    {
      icon: TrendingUp,
      title: "Accurate Data",
      description:
        "Make confident decisions based on reliable, complete analytics.",
    },
    {
      icon: DollarSign,
      title: "Maximize ROI",
      description:
        "Recover lost conversions and optimize ad spend effectively.",
    },
    {
      icon: Shield,
      title: "Stay Compliant",
      description:
        "Privacy-first tracking that meets GDPR and CCPA requirements.",
    },
    {
      icon: Building2,
      title: "Scale Confidently",
      description:
        "Analytics infrastructure that grows with your business.",
    },
  ];

  const agencyPainPoints = [
    "Clients complaining about declining campaign performance",
    "Spending hours troubleshooting GA4 and GTM issues",
    "Need expert analytics support without hiring full-time",
    "Struggling with server-side tracking implementations",
    "Clients asking about iOS 14+ tracking solutions",
  ];

  const businessPainPoints = [
    "Can't trust your analytics data for decision-making",
    "Losing conversions to iOS 14+ and cookie restrictions",
    "Concerned about GDPR/CCPA compliance risks",
    "Don't have in-house analytics expertise",
    "Need clear reporting that drives action",
  ];

  return (
    <div className="min-h-screen flex flex-col">


      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl mb-6">
              Specialized Solutions for{" "}
              <span className="text-primary">Your Business</span>
            </h1>
            <p className="body-lg text-muted-foreground mb-8">
              Whether you're a marketing agency serving clients or a growing
              business optimizing your own analytics, we have the expertise to
              help you succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Marketing Agencies Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Content */}
            <div>
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-primary">
                  For Agencies
                </span>
              </div>
              <h2 className="heading-lg mb-6">
                Reliable Tracking for Your Clients
              </h2>
              <p className="body-md text-muted-foreground mb-6">
                Deliver expert analytics implementation and support for your
                clients without the overhead of hiring a full-time analytics
                team. We work behind the scenes as an extension of your agency.
              </p>

              <h3 className="font-semibold mb-4">Common Challenges We Solve:</h3>
              <ul className="space-y-3 mb-8">
                {agencyPainPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact?form=open">
                <Button size="lg" className="text-base px-8 h-12">
                  Partner With Us
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Right: Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              {agencyBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="mb-3 p-2 rounded-lg bg-primary/10 inline-block">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2 text-sm">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What We Deliver for Agencies */}
      <section className="section-spacing">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-md mb-8 text-center">
              What We Deliver for Agencies
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Server className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Implementation</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• GA4 setup and migration</li>
                    <li>• Server-side tracking (sGTM)</li>
                    <li>• Meta CAPI integration</li>
                    <li>• Consent management</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <HeadphonesIcon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Support</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Ongoing troubleshooting</li>
                    <li>• Technical consultation</li>
                    <li>• QA and validation</li>
                    <li>• Documentation</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <LayoutDashboard className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Reporting</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Custom dashboards</li>
                    <li>• Automated reporting</li>
                    <li>• Performance insights</li>
                    <li>• Client presentations</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Ecommerce & Website Owners Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            {/* Left: Benefits Grid */}
            <div className="grid grid-cols-2 gap-4 order-2 lg:order-1">
              {businessBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="mb-3 p-2 rounded-lg bg-primary/10 inline-block">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2 text-sm">
                        {benefit.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {benefit.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Right: Content */}
            <div className="order-1 lg:order-2">
              <div className="inline-block mb-4 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-medium text-primary">
                  For Businesses
                </span>
              </div>
              <h2 className="heading-lg mb-6">
                Accurate Data for Smarter Growth
              </h2>
              <p className="body-md text-muted-foreground mb-6">
                Stop losing revenue to broken tracking. Get complete,
                privacy-compliant analytics that help you make confident
                decisions and optimize your marketing spend.
              </p>

              <h3 className="font-semibold mb-4">Common Challenges We Solve:</h3>
              <ul className="space-y-3 mb-8">
                {businessPainPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>

              <Link href="/contact">
                <Button size="lg" className="text-base px-8 h-12">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What We Deliver for Businesses */}
      <section className="section-spacing">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-md mb-8 text-center">
              What We Deliver for Businesses
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <Store className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Complete Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    End-to-end tracking infrastructure from GA4 and GTM to
                    server-side tracking and consent management.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Privacy Compliance</h3>
                  <p className="text-sm text-muted-foreground">
                    GDPR and CCPA compliant tracking with consent management
                    and privacy-first measurement.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <TrendingUp className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-3">Actionable Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Custom dashboards and reports that drive decisions, not
                    just display data.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">Industries We Serve</h2>
            <p className="body-md text-muted-foreground">
              We've worked with businesses across diverse industries, delivering
              tailored analytics solutions for each unique challenge.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { name: "Ecommerce", icon: ShoppingCart },
              { name: "SaaS", icon: Code },
              { name: "Lead Generation", icon: LineChart },
              { name: "Subscription", icon: Repeat },
              { name: "B2B Services", icon: Briefcase },
              { name: "Healthcare", icon: Heart },
              { name: "Education", icon: GraduationCap },
              { name: "Finance", icon: Wallet },
            ].map((industry, index) => {
              const Icon = industry.icon;
              return (
                <Card key={index}>
                  <CardContent className="p-4 text-center">
                    <Icon className="h-6 w-6 text-primary mx-auto mb-2" />
                    <span className="text-sm font-medium">{industry.name}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container">
          <Card className="border-2 border-primary">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="heading-md mb-6">Ready to Get Started?</h2>
              <p className="body-md text-muted-foreground mb-8 max-w-2xl mx-auto">
                Book a free consultation. We'll discuss your specific needs and
                show you exactly how we can help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <Button size="lg" className="text-base px-8 h-12">
                    Book Free Consultation
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/health-check">
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-base px-8 h-12 border-primary text-primary hover:bg-primary/10 relative overflow-hidden group"
                    style={{
                      boxShadow: '0 0 20px rgba(0, 173, 132, 0.2)',
                      animation: 'button-glow 2s ease-in-out infinite',
                    }}
                  >
                    <span className="relative z-10">✨ Free Health Check</span>
                    <div 
                      className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0, 173, 132, 0.3) 0%, transparent 50%, rgba(0, 173, 132, 0.3) 100%)',
                      }}
                    />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      
    </div>
  );
}
