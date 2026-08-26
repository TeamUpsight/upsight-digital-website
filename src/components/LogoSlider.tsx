/**
 * LogoSlider Component
 * Design: Infinite scrolling logo carousel with smooth CSS animation
 * Features: Dark background matching theme, translucent green boxes behind logos, uniform sizes, left-to-right motion
 * Performance: GPU-accelerated with will-change and transform3d
 */

import { useEffect, useState } from "react";

interface Logo {
  src: string;
  alt: string;
}

interface LogoSliderProps {
  logos: Logo[];
}

export default function LogoSlider({ logos }: LogoSliderProps) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkReducedMotion = () => {
      setPrefersReducedMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    };
    checkReducedMotion();
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    motionQuery.addEventListener("change", checkReducedMotion);
    return () => motionQuery.removeEventListener("change", checkReducedMotion);
  }, []);

  // Duplicate logos for seamless infinite scroll
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-16 bg-[#0f1219] overflow-hidden" style={{ contain: 'layout style' }}>
      <div className="container mb-10">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-wider font-medium">
          Trusted by leading brands worldwide
        </p>
      </div>
      
      <div className="relative">
        {/* Gradient fade edges - matching dark background */}
        <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-[#0f1219] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-[#0f1219] to-transparent z-10 pointer-events-none" />
        
        {/* Scrolling container - GPU accelerated */}
        <div 
          className="flex items-center gap-4 md:gap-6 lg:gap-8 hover:[animation-play-state:paused]"
          style={{
            animation: prefersReducedMotion ? 'none' : `scrollLeftToRight 60s linear infinite`,
            width: 'fit-content',
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-20 md:h-24 lg:h-28 w-[160px] md:w-[200px] lg:w-[240px] flex items-center justify-center p-2 rounded-lg bg-[#00AD84]/15 border border-[#00AD84]/20"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="h-full w-full object-contain p-1"
                width="200"
                height="100"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animation - GPU accelerated with translate3d */}
      <style>{`
        @keyframes scrollLeftToRight {
          0% {
            transform: translate3d(calc(-100% / 3), 0, 0);
          }
          100% {
            transform: translate3d(0, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hover\\:[animation-play-state\\:paused] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
