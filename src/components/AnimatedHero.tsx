import { ButtonLink } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background to-muted/50">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/82 to-muted/20" />

      <canvas
        id="analytics-hero-canvas"
        width="1600"
        height="900"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 block h-full w-full opacity-90"
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
          <div className="relative h-6 w-6 rounded-full bg-primary/60">
            <div
              className="absolute -inset-2 rounded-full bg-primary/40 animate-ping"
              style={{ animationDuration: "2.5s" }}
            />
            <div
              className="absolute -inset-1 rounded-full bg-primary/30 animate-ping"
              style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
            />
            <div className="absolute inset-1 rounded-full bg-primary shadow-[0_0_15px_#00AD84,0_0_30px_rgba(0,173,132,0.31),0_0_45px_rgba(0,173,132,0.19)]" />
          </div>
          <span className="font-mono text-base font-semibold text-primary drop-shadow-[0_0_10px_rgba(0,173,132,0.31)]">
            {node.label}
          </span>
        </div>
      ))}

      <div className="container relative z-10 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="heading-xl mb-6 text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Stop Losing Revenue to{" "}
            <span className="relative inline-block text-primary">
              Broken Tracking
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 4 Q50 0 100 4 T200 4"
                  stroke="#00AD84"
                  strokeWidth="3"
                  fill="none"
                  className="hero-underline"
                />
              </svg>
            </span>
          </h1>

          <p className="body-lg mx-auto mb-8 max-w-3xl text-muted-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-primary">Digital analytics, tracking &amp; measurement implementation</span>
            <span className="mt-3 block">We fix tracking gaps, implement server-side solutions, and build consent-aware measurement for clearer decision-making.</span>
          </p>

          <div className="mb-16 flex flex-col justify-center gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <ButtonLink href="/contact" size="lg" className="group relative h-12 overflow-hidden px-8 text-base shadow-lg shadow-primary/20 transition-all duration-300 hover:shadow-xl hover:shadow-primary/30">
                <span className="relative z-10 flex items-center">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 transition-opacity group-hover:opacity-100" />
              </ButtonLink>
            <ButtonLink href="/health-check" size="lg" variant="outline" className="hero-health-button group relative h-12 overflow-hidden px-8 text-base backdrop-blur-sm transition-all duration-300 hover:bg-primary/10">
                <span className="relative z-10">✨ Free Health Check</span>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,173,132,0.3)_0%,transparent_50%,rgba(0,173,132,0.3)_100%)] opacity-20 transition-opacity group-hover:opacity-30" />
              </ButtonLink>
          </div>

          <div className="mx-auto grid max-w-2xl grid-cols-3 gap-4 sm:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            {stats.map((stat) => (
              <div key={stat.label} className="group cursor-default text-center">
                <div className="mb-2 text-3xl font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:text-primary/90 md:text-5xl">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground transition-colors duration-300 group-hover:text-foreground sm:text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" aria-hidden="true" />

      <style>{`
        .hero-underline {
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: hero-draw 1.5s ease-out .5s forwards;
        }
        .hero-health-button {
          box-shadow: 0 0 20px rgba(0, 173, 132, 0.2);
          animation: hero-button-glow 2s ease-in-out infinite;
        }
        @keyframes hero-draw { to { stroke-dashoffset: 0; } }
        @keyframes hero-button-glow {
          0%,100% { box-shadow: 0 0 16px rgba(0,173,132,.13); }
          50% { box-shadow: 0 0 26px rgba(0,173,132,.28); }
        }
        @keyframes float-1 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(15px,-10px)} 50%{transform:translate(5px,15px)} 75%{transform:translate(-10px,5px)} }
        @keyframes float-2 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-12px,8px)} 50%{transform:translate(10px,-12px)} 75%{transform:translate(8px,10px)} }
        @keyframes float-3 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(10px,12px)} 50%{transform:translate(-15px,-8px)} 75%{transform:translate(-5px,15px)} }
        @keyframes float-4 { 0%,100%{transform:translate(0,0)} 25%{transform:translate(-8px,-15px)} 50%{transform:translate(12px,10px)} 75%{transform:translate(15px,-5px)} }
        @media (prefers-reduced-motion: reduce) {
          .hero-underline { animation: none; stroke-dashoffset: 0; }
          .hero-health-button, [style*="float-"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
