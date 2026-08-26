import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@/lib/routing";

export default function AnimatedHero() {
  const stats = [
    { value: "7+", label: "Years of Expertise" },
    { value: "120+", label: "Successful Projects" },
    { value: "10+", label: "Countries Served" },
  ];

  const dataNodes = [
    { id: 1, left: "12%", top: "22%", label: "GA4", delay: "0s" },
    { id: 2, left: "88%", top: "18%", label: "sGTM", delay: "0.2s" },
    { id: 3, left: "8%", top: "72%", label: "CAPI", delay: "0.4s" },
    { id: 4, left: "92%", top: "78%", label: "Data", delay: "0.6s" },
  ];

  return (
    <section className="relative flex min-h-[680px] items-center justify-center overflow-hidden bg-gradient-to-br from-background to-muted/50 pt-24 md:min-h-[760px] md:pt-28">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-muted/20" />

      <canvas
        id="analytics-hero-canvas"
        width="1600"
        height="900"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden h-full w-full opacity-80 md:block"
      />

      {dataNodes.map((node) => (
        <div
          key={node.id}
          className="absolute hidden items-center gap-3 md:flex"
          style={{
            left: node.left,
            top: node.top,
            animation: `float-${node.id} 8s ease-in-out infinite`,
            animationDelay: node.delay,
          }}
          aria-hidden="true"
        >
          <div className="relative h-5 w-5 rounded-full bg-primary/70 shadow-[0_0_18px_rgba(0,173,132,0.65)]">
            <div className="absolute -inset-2 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "2.5s" }} />
            <div className="absolute inset-1 rounded-full bg-primary" />
          </div>
          <span className="font-mono text-sm font-semibold text-primary drop-shadow-[0_0_8px_rgba(0,173,132,0.35)]">{node.label}</span>
        </div>
      ))}

      <div className="container relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="heading-xl mb-6 text-foreground">
            Stop Losing Revenue to{" "}
            <span className="relative inline-block text-primary">
              Broken Tracking
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 200 8" fill="none" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 4 Q50 0 100 4 T200 4" stroke="#00AD84" strokeWidth="3" fill="none" />
              </svg>
            </span>
          </h1>

          <p className="body-lg mx-auto mb-8 max-w-3xl text-muted-foreground">
            We fix tracking gaps, implement server-side solutions, and deliver privacy-compliant analytics that turn your ad spend into measurable growth.
          </p>

          <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/contact">
              <Button size="lg" className="group relative h-12 overflow-hidden px-8 text-base shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
                <span className="relative z-10 flex items-center">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link href="/health-check">
              <Button
                size="lg"
                variant="outline"
                className="group relative h-12 overflow-hidden border-primary px-8 text-base text-primary transition-all duration-300 hover:bg-primary/10"
              >
                <span className="relative z-10">✨ Free Health Check</span>
              </Button>
            </Link>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4 sm:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mb-2 text-3xl font-bold text-primary md:text-5xl">{stat.value}</div>
                <div className="text-xs text-muted-foreground sm:text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />

      <style>{`
        @keyframes float-1 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(15px,-10px)} 50%{transform:translate(5px,15px)} 75%{transform:translate(-10px,5px)} }
        @keyframes float-2 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-12px,8px)} 50%{transform:translate(10px,-12px)} 75%{transform:translate(8px,10px)} }
        @keyframes float-3 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(10px,12px)} 50%{transform:translate(-15px,-8px)} 75%{transform:translate(-5px,15px)} }
        @keyframes float-4 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-8px,-15px)} 50%{transform:translate(12px,10px)} 75%{transform:translate(15px,-5px)} }
        @media (prefers-reduced-motion: reduce) {
          [style*="float-"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
