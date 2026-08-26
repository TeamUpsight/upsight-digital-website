import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Lock,
  Server,
  ShoppingCart,
  TrendingUp,
  Target,
  Cpu,
  RefreshCw,
  Users,
} from "lucide-react";
import { Link } from "@/lib/routing";
import { useEffect, useState, lazy, Suspense } from "react";

// Lazy-load heavy components - below the fold
const AnimatedHero = lazy(() => import("@/components/AnimatedHero"));
const LogoSlider = lazy(() => import("@/components/LogoSlider"));

// Loading skeleton for lazy components
const ComponentSkeleton = () => (
  <div className="w-full h-64 bg-muted animate-pulse rounded-lg" />
);

export default function Home() {
// Track if animations should be enabled (defer on mobile)
  const [enableAnimations, setEnableAnimations] = useState(false);

  useEffect(() => {
    // Title is now handled by SEO component
    
    // Enable animations after initial paint completes
    // Use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => setEnableAnimations(true), { timeout: 2000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => setEnableAnimations(true), 2000);
    }
  }, []);

  const clientLogos = [
    { src: "/images/client-logo-1.webp", alt: "Client 1" },
    { src: "/images/client-logo-2.webp", alt: "Client 2" },
    { src: "/images/client-logo-3.webp", alt: "Client 3" },
    { src: "/images/client-logo-4.webp", alt: "Client 4" },
    { src: "/images/client-logo-5.webp", alt: "Client 5" },
    { src: "/images/client-logo-6.webp", alt: "Client 6" },
    { src: "/images/client-logo-7.webp", alt: "Client 7" },
    { src: "/images/client-logo-8.webp", alt: "Client 8" },
    { src: "/images/client-logo-9.webp", alt: "Client 9" },
    { src: "/images/client-logo-10.webp", alt: "Client 10" },
    { src: "/images/client-logo-11.webp", alt: "Client 11" },
    { src: "/images/client-logo-12.webp", alt: "Client 12" },
  ];

  const services = [
    {
      icon: Server,
      title: "Server-Side Tracking",
      description:
        "Bypass browser restrictions with sGTM. Improve data accuracy, reduce page load, and recover lost conversions from iOS 14+ restrictions.",
    },
    {
      icon: Activity,
      title: "Meta Conversions API",
      description:
        "Implement CAPI for Facebook and Instagram ads. Recover lost conversions, improve attribution accuracy, and optimize ad delivery.",
    },
    {
      icon: Lock,
      title: "Consent & Compliance",
      description:
        "Stay compliant with GDPR, CCPA, and privacy regulations. Integrate CMPs and Consent Mode v2 for privacy-first tracking.",
      link: "/services/cookie-consent",
    },
    {
      icon: BarChart3,
      title: "Tracking Audits",
      description:
        "Comprehensive audit of your analytics setup. Identify gaps, fix errors, and ensure data accuracy across all platforms.",
    },
    {
      icon: TrendingUp,
      title: "Custom Dashboards",
      description:
        "Looker Studio dashboards with decision-focused insights. Automated reporting that saves time and aligns teams.",
    },
    {
      icon: ShoppingCart,
      title: "Ecommerce Tracking",
      description:
        "Track the full customer journey from product view to purchase. Enhanced ecommerce for Shopify, WooCommerce, and custom platforms.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Partnering with Upsight Digital has been transformational for Slice. They quickly addressed tracking gaps, streamlined our data infrastructure, and implemented server-side tracking and compliance—giving us cleaner data, better visibility, and confidence in our analytics.",
      author: "Alyssa Wong",
      role: "Director of Growth Marketing at Slice",
      image: "/images/alyssa-wong.webp",
    },
    {
      quote:
        "Upsight Digital is simply amazing. Their team solves tracking and analytics challenges that no one else can. Fast, reliable, and brilliant. Working with them has made me look like a rock star for years.",
      author: "Alan Waggoner",
      role: "Paid Media Manager at Shift",
      image: "/images/alan-waggoner.webp",
    },
    {
      quote:
        "Upsight Digital has been an incredible resource for our team. They support our devs with Google Suite, Analytics, and e-commerce tracking—always prompt, thorough, and extremely helpful. We continue to work with them and gladly refer them to others.",
      author: "Ashley Stanford",
      role: "Head of Marketing at TicketSocket",
      image: "/images/ashley-stanford.webp",
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


      {/* Interactive Hero Section - Lazy load with fallback */}
      <section className="section-spacing bg-gradient-to-br from-background to-muted/50 relative overflow-hidden min-h-[600px] md:min-h-[700px]">
        {enableAnimations ? (
          <Suspense fallback={<ComponentSkeleton />}>
            <AnimatedHero />
          </Suspense>
        ) : (
          <div className="container">
            <div className="max-w-3xl mx-auto text-center py-20">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Stop Losing Revenue to <span className="text-primary">Broken Tracking</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                We fix tracking gaps, implement server-side solutions, and deliver privacy-compliant analytics that turn your ad spend into measurable growth.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Get Free Consultation →
                  </Button>
                </Link>
                <Link href="/health-check">
                  <Button size="lg" variant="outline">
                    ✨ Free Health Check
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

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
                      Losing 30-50% of conversion data to iOS restrictions
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
                      Risking GDPR/CCPA fines from non-compliant tracking
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
                      Server-side tracking that bypasses browser restrictions
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
                      Privacy-compliant tracking with consent management
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
              From server-side tracking to privacy compliance, we build
              analytics infrastructure that scales with your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              const cardContent = (
                <Card
                  key={index}
                  className={`group hover:border-primary transition-all duration-300 ${service.link ? "cursor-pointer" : ""}`}
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
                  </CardContent>
                </Card>
              );
              return service.link ? (
                <Link key={index} href={service.link}>
                  {cardContent}
                </Link>
              ) : (
                cardContent
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button size="lg" variant="outline">
                View All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
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
                <Link href="/who-its-for">
                  <Button className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold mb-4">
                  Ecommerce & Website Owners
                </h3>
                <p className="text-muted-foreground mb-6">
                  Get accurate data for smarter growth decisions. Track every
                  customer touchpoint with privacy-compliant, reliable analytics.
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
                      Privacy-compliant implementation
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">
                      Clear, actionable reporting
                    </span>
                  </li>
                </ul>
                <Link href="/who-its-for">
                  <Button className="w-full">Learn More</Button>
                </Link>
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

      {/* Trusted By Section - Lazy load slider */}
      {enableAnimations ? (
        <Suspense fallback={<ComponentSkeleton />}>
          <LogoSlider logos={clientLogos} />
        </Suspense>
      ) : (
        <section className="section-spacing bg-muted/30">
          <div className="container">
            <p className="text-center text-muted-foreground">
              Trusted by leading brands worldwide
            </p>
          </div>
        </section>
      )}

      {/* Testimonials Section - Lazy loaded */}
      <section className="section-spacing bg-muted/30 min-h-[500px] md:min-h-[600px]">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-md mb-6">What Our Clients Say</h2>
            <p className="body-md text-muted-foreground">
              Trusted by growth leaders and analytics experts worldwide.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="flex flex-col">
                <CardContent className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground mb-6 flex-1 italic">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-full object-cover"
                    width="40"
                    height="40"
                    loading="lazy"
                  />
                    <div>
                      <p className="font-semibold text-sm">{testimonial.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  {testimonial.author === "Alyssa Wong" && (
                    <Link href="/case-studies/slice" className="mt-4">
                      <Button size="sm" variant="outline" className="w-full">
                        Read Slice Case Study
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
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
              <Link href="/health-check">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Start Free Health Check
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Schedule Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
}
