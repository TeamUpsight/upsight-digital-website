import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Phone
} from "lucide-react";

export default function Contact({ children }: { children: React.ReactNode }) {
  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      value: "team@upsight.digital",
      link: "mailto:team@upsight.digital",
      description: "We typically respond within 24 hours",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+971-56-8525950",
      link: "tel:+971568525950",
      description: "Mon-Fri, 9 AM - 6 PM EST",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Dubai, UAE",
      link: null,
      description: "Serving clients globally",
    },
  ];

  const consultationBenefits = [
    "Review your current tracking setup",
    "Identify gaps and opportunities",
    "Discuss your specific business needs",
    "Provide actionable recommendations",
    "Outline a clear implementation plan",
    "Answer all your analytics questions",
  ];

  const faqItems = [
    {
      question: "How long does a typical project take?",
      answer:
        "Project timelines vary based on scope. Small projects (GA4 setup, basic tracking) take 2-3 weeks. Medium projects (server-side tracking, CAPI) take 4-6 weeks. Large projects (complete analytics overhaul) take 8-12 weeks.",
    },
    {
      question: "Do you work with agencies?",
      answer:
        "Yes! We work with many marketing agencies as a white-label partner. We provide expert implementation and support for your clients while you maintain the client relationship.",
    },
    {
      question: "What platforms do you support?",
      answer:
        "We work with GA4, Google Tag Manager (web and server-side), Meta Conversions API, Shopify, WooCommerce, Segment, Tealium, and most major analytics and marketing platforms.",
    },
    {
      question: "Do you offer ongoing support?",
      answer:
        "Yes. After implementation, we provide ongoing monitoring, optimization, and support to ensure your tracking continues to perform as your business evolves.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Every project is different, so we don't have fixed packages. During the free consultation, we'll discuss your needs and provide a custom quote based on scope and complexity.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">


      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="heading-xl mb-6">
              Let's Fix Your{" "}
              <span className="text-primary">Tracking Together</span>
            </h1>
            <p className="body-lg text-muted-foreground mb-8">
              Book a free 30-minute consultation. We'll review your current
              setup, identify gaps, and show you exactly how we can help.
            </p>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="section-spacing">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Left: Consultation Info */}
            <div>
              <Card className="border-2 border-primary">
                <CardContent className="p-8">
                  <div className="mb-6 p-3 rounded-lg bg-primary/10 inline-block">
                    <Calendar className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="text-3xl font-semibold mb-4">
                    Book Your Free Consultation
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    In this 30-minute call, we'll discuss your analytics
                    challenges, review your current setup, and provide
                    actionable recommendations—no commitment required.
                  </p>

                  <h3 className="font-semibold mb-4">
                    What You'll Get From This Call:
                  </h3>
                  <ul className="space-y-3 mb-8">
                    {consultationBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <ButtonLink href="https://calendly.com/team-upsight/30min" target="_blank" rel="noopener noreferrer" size="lg" className="block w-full text-base h-12">
                      <Calendar className="mr-2 h-5 w-5" />
                      Schedule Free Consultation
                    </ButtonLink>

                  <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>30 minutes • No commitment required</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Contact Methods */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Other Ways to Reach Us
              </h2>
              <div className="space-y-4 mb-8">
                {contactMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">
                              {method.title}
                            </h3>
                            {method.link ? (
                              <a
                                href={method.link}
                                className="text-sm text-primary hover:underline"
                              >
                                {method.value}
                              </a>
                            ) : (
                              <p className="text-sm text-foreground">
                                {method.value}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-1">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Expandable Contact Form */}
              {children}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-spacing bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <h2 className="heading-md mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details name="contact-faq"
                  key={index}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-semibold py-6 [&::-webkit-details-marker]:hidden">
                    {item.question}<span aria-hidden="true">⌄</span>
                  </summary>
                  <div className="text-sm text-muted-foreground pb-6">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing">
        <div className="container">
          <Card className="border-2 border-primary">
            <CardContent className="p-8 md:p-12 text-center">
              <h2 className="heading-md mb-6">
                Ready to Transform Your Analytics?
              </h2>
              <p className="body-md text-muted-foreground mb-8 max-w-2xl mx-auto">
                Stop losing revenue to broken tracking. Book your free
                consultation today and let's build analytics infrastructure that
                drives real growth.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <ButtonLink href="https://calendly.com/team-upsight/30min" target="_blank" rel="noopener noreferrer" size="lg" className="text-base px-8 h-12">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Free Consultation Now
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
