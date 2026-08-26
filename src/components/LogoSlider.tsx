interface Logo {
  src: string;
  alt: string;
}

interface LogoSliderProps {
  logos: Logo[];
}

export default function LogoSlider({ logos }: LogoSliderProps) {
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="overflow-hidden bg-[#0f1219] py-16 defer-render">
      <div className="container mb-10">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Trusted by leading brands worldwide
        </p>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-20 bg-gradient-to-r from-[#0f1219] to-transparent md:w-32" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-20 bg-gradient-to-l from-[#0f1219] to-transparent md:w-32" />

        <div className="logo-track flex w-max items-center gap-4 md:gap-6 lg:gap-8">
          {duplicatedLogos.map((logo, index) => (
            <div key={`${logo.src}-${index}`} className="flex h-20 w-[160px] shrink-0 items-center justify-center rounded-lg border border-[#00AD84]/20 bg-[#00AD84]/15 p-2 md:h-24 md:w-[200px] lg:h-28 lg:w-[240px]">
              <img
                src={logo.src}
                alt={index < logos.length ? logo.alt : ""}
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

      <style>{`
        .logo-track {
          animation: logo-scroll 60s linear infinite;
          will-change: transform;
          transform: translate3d(-50%, 0, 0);
        }
        .logo-track:hover { animation-play-state: paused; }
        @keyframes logo-scroll {
          from { transform: translate3d(-50%, 0, 0); }
          to { transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-track { animation: none; transform: none; }
        }
      `}</style>
    </section>
  );
}
