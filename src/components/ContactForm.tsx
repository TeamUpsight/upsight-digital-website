import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContact } from "@/lib/api";
import {
  CheckCircle2,
  ChevronDown,
  MessageSquare,
  Send
} from "lucide-react";
import { useEffect, useState } from "react";
import Turnstile, { Honeypot } from "./Turnstile";

export default function ContactForm() {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [submissionError, setSubmissionError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);


  // Auto-expand form if URL has ?form=open parameter
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get('form') === 'open') {
      setIsFormOpen(true);
      // Scroll to form after a short delay
      const timer = setTimeout(() => {
        const formElement = document.getElementById('contact-form');
        if (formElement) {
          formElement.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
        }
      }, 300);
      return () => clearTimeout(timer);
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

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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

    if (isSubmitting) return;
    setSubmissionError("");
    setIsSubmitting(true);

    try {
      await submitContact({
        turnstileToken, honeypot,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || undefined,
        message: formData.message,
      });

      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({ event: "contact_form_submitted", form_id: "contact" });
      }
      setIsSubmitted(true);
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (error) {
      setSubmissionError(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTurnstileToken("");
      setVerificationAttempt(value => value + 1);
    }
  };

  return (
              <Card id="contact-form">
                <details open={isFormOpen} onToggle={(event) => setIsFormOpen(event.currentTarget.open)}>
                  <summary className="list-none p-6 cursor-pointer hover:bg-muted/50 transition-colors [&::-webkit-details-marker]:hidden">
                      <span className="flex items-start gap-4">
                        <span className="p-2 rounded-lg bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </span>
                        <span className="flex-1">
                          <span className="flex items-center justify-between">
                            <span className="block font-semibold mb-2">
                              Prefer to Send a Message?
                            </span>
                            <ChevronDown
                              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                                isFormOpen ? "rotate-180" : ""
                              }`}
                            />
                          </span>
                          <span className="block text-sm text-muted-foreground">
                            Fill out the form below with details about your
                            project, and we'll get back to you within 24 hours.
                          </span>
                        </span>
                      </span>
                    </summary>

                  <div>
                    <div className="px-6 pb-6 border-t border-border pt-6">
                      {isSubmitted ? (
                        <div className="text-center py-8" role="status" tabIndex={-1} ref={element => { element?.focus(); }}>
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
                        <form onSubmit={handleSubmit} className="space-y-4" aria-busy={isSubmitting}>
                          <Honeypot value={honeypot} onChange={setHoneypot} />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Name *</Label>
                              <Input
                                id="name"
                                name="name"
                                maxLength={120} autoComplete="name"
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
                                maxLength={254} autoComplete="email"
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
                                maxLength={40} autoComplete="tel"
                                type="tel"
                                placeholder="+1 (555) 123-4567"
                                value={formData.phone}
                                onChange={handleInputChange}
                                required
                                aria-invalid={!!phoneError} aria-describedby={phoneError ? "phone-error" : undefined}
                                className={phoneError ? 'border-destructive' : ''}
                              />
                              {phoneError && (
                                <p id="phone-error" role="alert" className="text-sm text-destructive">{phoneError}</p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="company">Company</Label>
                              <Input
                                id="company"
                                name="company"
                                maxLength={160} autoComplete="organization"
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
                                maxLength={5000} autoComplete="off"
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

                          <Turnstile action="contact" resetKey={verificationAttempt} onToken={setTurnstileToken} />
                          {submissionError && <p role="alert" className="text-sm text-destructive">{submissionError}</p>}
                          <Button
                            type="submit"
                            className="w-full"
                            disabled={isSubmitting || !!phoneError || (!turnstileToken && !(import.meta.env.DEV && !import.meta.env.PUBLIC_TURNSTILE_SITE_KEY))}
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
                  </div>
                </details>
              </Card>
  );
}
