import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "@/lib/routing";
import { toast } from "@/lib/toast";
import { submitContact } from "@/lib/api";

export default function Contact() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  // SEO is handled by the SEO component in the return

  // Auto-expand form if URL has ?form=open parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('form') === 'open') {
      setIsFormOpen(true);
      // Scroll to form after a short delay
      setTimeout(() => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  // Phone number validation - requires country code starting with +
  const validatePhone = (phone: string): boolean => {
    // Must start with + for country code
    if (!phone.startsWith('+')) {
      return false;
    }
    // Remove all non-digit characters except + at the start
    const cleaned = phone.replace(/[^\d+]/g, '');
    // Must have at least 7 digits (some countries have short numbers)
    // and at most 15 digits (ITU-T E.164 max)
    const digitCount = cleaned.replace(/\D/g, '').length;
    return digitCount >= 7 && digitCount <= 15;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validate phone number on change
    if (name === 'phone') {
      if (value && !validatePhone(value)) {
        setPhoneError('Please enter a valid phone number with country code (e.g., +1 555 123 4567)');
      } else {
        setPhoneError('');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone before submission
    if (!formData.phone) {
      setPhoneError('Phone number is required');
      return;
    }
    if (!validatePhone(formData.phone)) {
      setPhoneError('Please enter a valid phone number with country code (e.g., +1 555 123 4567)');
      return;
    }
    
    setIsSubmitting(true);

    try {
      await submitContact({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || undefined,
        message: formData.message,
      });

      if (typeof window !== "undefined" && (window as any).dataLayer) {
        (window as any).dataLayer.push({ event: "contact_form_submitted", form_id: "contact" });
      }
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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

                  <a
                    href="https://calendly.com/team-upsight/30min"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button size="lg" className="w-full text-base h-12">
                      <Calendar className="mr-2 h-5 w-5" />
                      Schedule Free Consultation
                    </Button>
                  </a>

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
              <Card id="contact-form">
                <Collapsible open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <CollapsibleTrigger asChild>
                    <CardContent className="p-6 cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold mb-2">
                              Prefer to Send a Message?
                            </h3>
                            <ChevronDown
                              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                                isFormOpen ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Fill out the form below with details about your
                            project, and we'll get back to you within 24 hours.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <div className="px-6 pb-6 border-t border-border pt-6">
                      {isSubmitted ? (
                        <div className="text-center py-8">
                          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                          <p className="text-muted-foreground mb-6">
                            Thank you for reaching out. We'll get back to you within 24 hours.
                          </p>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsSubmitted(false);
                              setPhoneError('');
                            }}
                          >
                            Send Another Message
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name *</Label>
                              <Input
                                id="name"
                                name="name"
                                placeholder="Your name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email">Email *</Label>
                              <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone *</Label>
                              <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                className={phoneError ? 'border-destructive' : ''}
                              />
                              {phoneError && (
                                <p className="text-sm text-destructive">{phoneError}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                name="company"
                                placeholder="Your company name"
                                value={formData.company}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="message">Message *</Label>
                            <Textarea
                              id="message"
                              name="message"
                              placeholder="Tell us about your project and analytics challenges..."
                              rows={4}
                              value={formData.message}
                              onChange={handleInputChange}
                              required
                              minLength={10}
                            />
                            {formData.message.length > 0 && formData.message.length < 10 && (
                              <p className="text-sm text-destructive">Message must be at least 10 characters</p>
                            )}
                          </div>

                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting || !!phoneError}
                          >
                            {isSubmitting ? (
                              "Sending..."
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                Send Message
                              </>
                            )}
                          </Button>
                        </form>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
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
            <Accordion type="single" collapsible className="space-y-4">
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border border-border rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-6">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-6">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
                <a
                  href="https://calendly.com/team-upsight/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" className="text-base px-8 h-12">
                    <Calendar className="mr-2 h-5 w-5" />
                    Book Free Consultation Now
                  </Button>
                </a>
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
