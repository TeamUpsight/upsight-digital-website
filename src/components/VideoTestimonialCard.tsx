import { Card, CardContent } from '@/components/ui/card';
import { Play, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface VideoTestimonialCardProps {
  name: string;
  role: string;
  portrait: string;
  quote: string;
  videoSrc?: string;
  posterSrc?: string;
  videoLabel: string;
  caseStudyHref?: string;
  caseStudyLabel?: string;
  className?: string;
}

export default function VideoTestimonialCard({
  name, role, portrait, quote, videoSrc, posterSrc, videoLabel, caseStudyHref, caseStudyLabel, className = '',
}: VideoTestimonialCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const frontButton = useRef<HTMLButtonElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const hasFlipped = useRef(false);
  const [videoHeight, setVideoHeight] = useState(0);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const updateVideoHeight = () => setVideoHeight(Math.ceil(card.getBoundingClientRect().width * 16 / 9));
    updateVideoHeight();
    const resizeObserver = new ResizeObserver(updateVideoHeight);
    resizeObserver.observe(card);
    return () => resizeObserver.disconnect();
  }, []);

  const returnToQuote = useCallback(() => {
    if (videoRef.current) videoRef.current.pause();
    setIsVideoPlaying(false);
    setIsFlipped(false);
  }, []);

  useEffect(() => {
    if (!hasFlipped.current) return;
    (isFlipped ? playButton.current : frontButton.current)?.focus();
  }, [isFlipped]);

  const flipToVideo = useCallback(() => {
    if (!videoSrc) return;
    hasFlipped.current = true;
    setIsFlipped(true);
  }, [videoSrc]);

  const playVideo = useCallback(() => {
    if (!videoRef.current) return;
    void videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
  }, []);

  return (
    <div className={`w-full ${className}`} style={{ perspective: '1200px' }} onKeyDown={(event) => {
      if (event.key === 'Escape' && isFlipped) { event.preventDefault(); returnToQuote(); }
    }}>
      <div
        ref={cardRef}
        data-testimonial-card
        data-state={isFlipped ? 'video' : 'quote'}
        className="relative h-[500px] w-full transition-[height,transform] duration-700 motion-reduce:transition-none sm:h-[470px] lg:h-[450px]"
        style={{
          height: isFlipped && videoHeight ? `${videoHeight}px` : undefined,
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <article className="absolute inset-0" style={{ backfaceVisibility: 'hidden' }} inert={isFlipped} aria-hidden={isFlipped}>
          <Card className="h-full gap-0 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 py-0">
            <CardContent className="grid h-full grid-rows-[auto_minmax(min-content,1fr)_auto] p-6">
              <div className="flex min-h-14 items-center gap-3">
                <img src={portrait} alt={name} width="56" height="56" loading="lazy" className="h-14 w-14 rounded-full border-2 border-primary/30 object-cover" />
                <div><p className="font-semibold">{name}</p><p className="text-xs text-muted-foreground">{role}</p></div>
              </div>
              <blockquote className="mt-6 self-start text-sm leading-relaxed text-foreground/90 italic">{quote}</blockquote>
              <div data-testimonial-actions className="mt-6 min-h-[8.25rem] space-y-3 border-t border-border/50 pt-4">
                {videoSrc && <button ref={frontButton} type="button" aria-label={`Watch ${name}'s video testimonial`} onClick={flipToVideo} className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                  <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" /> Watch testimonial
                </button>}
                {caseStudyHref && caseStudyLabel && <a href={caseStudyHref} className="inline-flex w-full items-center justify-center rounded-md px-3 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{caseStudyLabel}</a>}
              </div>
            </CardContent>
          </Card>
        </article>

        {videoSrc && <article className="absolute inset-0 overflow-hidden rounded-xl" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }} inert={!isFlipped} aria-hidden={!isFlipped}>
          <Card className="h-full gap-0 border-primary/20 bg-[#0b1218] py-0"><div className="relative h-full">
            <video ref={videoRef} src={videoSrc} poster={posterSrc} className="h-full w-full rounded-xl object-contain" controls={isVideoPlaying} preload="metadata" aria-label={videoLabel} onEnded={() => setIsVideoPlaying(false)} playsInline suppressHydrationWarning />
            {!isVideoPlaying && isFlipped && <button ref={playButton} type="button" aria-label={`Play ${videoLabel}`} onClick={playVideo} className="absolute inset-0 flex items-center justify-center group">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/50 transition-transform group-hover:scale-110"><Play className="ml-0.5 h-7 w-7 text-primary-foreground" fill="currentColor" aria-hidden="true" /></span>
            </button>}
            <button type="button" aria-label={`Return to ${name}'s testimonial`} onClick={returnToQuote} className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><RotateCcw className="h-4 w-4" aria-hidden="true" /></button>
          </div></Card>
        </article>}
      </div>
    </div>
  );
}
