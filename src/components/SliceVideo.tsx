import { Card, CardContent } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
const VIDEO_TESTIMONIAL_URL = "https://d2xsxph8kpxj0f.cloudfront.net/310519663269151870/NKnKdFDxhaRVudBQKnGMGB/AlyssaWong-SliceLife_76a30443.mp4";

export default function FlippableVideoCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frontButton = useRef<HTMLButtonElement>(null);
  const playButton = useRef<HTMLButtonElement>(null);
  const hasFlipped = useRef(false);

  useEffect(() => {
    if (hasFlipped.current) (isFlipped ? playButton.current : frontButton.current)?.focus();
  }, [isFlipped]);

  const handleFlip = useCallback(() => {
    hasFlipped.current = true;
    if (isFlipped && videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
    setIsFlipped(!isFlipped);
  }, [isFlipped]);

  const handlePlayVideo = useCallback(() => {
    if (videoRef.current) {
      void videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => setIsVideoPlaying(false));
    }
  }, []);

  return (
    <div className="w-full max-w-sm mx-auto" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full transition-transform duration-700 cursor-pointer"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          aspectRatio: "9/16",
        }}
      >
        {/* Front: Quote Card */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
          inert={isFlipped}
          aria-hidden={isFlipped}
        >
          <Card className="h-full border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
            <CardContent className="p-6 md:p-8 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <img
                    src="/images/alyssa-wong.webp"
                    alt="Alyssa Wong"
                    width="56"
                    height="56"
                    className="rounded-full border-2 border-primary/30"
                  />
                  <div>
                    <p className="font-semibold">Alyssa Wong</p>
                    <p className="text-xs text-muted-foreground">Director of Growth Marketing, Slice</p>
                  </div>
                </div>
                <blockquote className="text-sm md:text-base leading-relaxed text-foreground/90 italic">
                  "Partnering with Upsight Digital has been transformational for Slice. They quickly
                  identified and addressed critical tracking issues—from fragmented event structures
                  and tracking gaps to compliance risks—streamlining our data infrastructure across
                  web and mobile. We now have significantly cleaner data pipelines, improved
                  cross-platform visibility, and greater confidence in our analytics."
                </blockquote>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-xs text-primary">
                  <Play className="h-3.5 w-3.5" fill="currentColor" />
                  <span>Tap to watch video</span>
                </div>
                <RotateCcw className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <button ref={frontButton} type="button" className="absolute inset-0 rounded-2xl" aria-label="Watch Alyssa Wong’s video testimonial" onClick={handleFlip} />
        </div>

        {/* Back: Video Player */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          inert={!isFlipped}
          aria-hidden={!isFlipped}
        >
          <Card className="h-full border-primary/20 bg-black">
            <div className="relative h-full">
              <video
                ref={videoRef}
                src={VIDEO_TESTIMONIAL_URL}
                className="w-full h-full object-cover rounded-2xl"
                controls={isVideoPlaying}
                preload="none"
                aria-label="Alyssa Wong’s testimonial"
                onEnded={() => setIsVideoPlaying(false)}
                playsInline
              />
              {!isVideoPlaying && isFlipped && (
                <button ref={playButton} type="button" aria-label="Play video"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlayVideo();
                  }}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/50 group-hover:scale-110 transition-transform">
                    <Play className="h-7 w-7 text-primary-foreground ml-0.5" fill="currentColor" />
                  </div>
                </button>
              )}
              <button type="button" aria-label="Return to testimonial"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFlip();
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors z-10"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
