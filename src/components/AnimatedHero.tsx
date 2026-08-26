import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "@/lib/routing";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulsePhase: number;
}

interface DataNode {
  id: number;
  baseX: number;
  baseY: number;
  label: string;
  delay: number;
  color: string;
}

export default function AnimatedHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  const stats = [
    { value: "7+", label: "Years of Expertise" },
    { value: "120+", label: "Successful Projects" },
    { value: "10+", label: "Countries Served" },
  ];

  const dataNodes: DataNode[] = [
    { id: 1, baseX: 12, baseY: 22, label: "GA4", delay: 0, color: "#00AD84" },
    { id: 2, baseX: 88, baseY: 18, label: "sGTM", delay: 0.2, color: "#00AD84" },
    { id: 3, baseX: 8, baseY: 72, label: "CAPI", delay: 0.4, color: "#00AD84" },
    { id: 4, baseX: 92, baseY: 78, label: "Data", delay: 0.6, color: "#00AD84" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize particles with larger sizes and more variety
    const initParticles = () => {
      const particles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: Math.random() * canvas.offsetWidth,
          y: Math.random() * canvas.offsetHeight,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 5 + 3, // Larger particles: 3-8px
          opacity: Math.random() * 0.6 + 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
    };

    initParticles();

    const animate = () => {
      timeRef.current += 0.016; // ~60fps
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw grid pattern - more prominent
      ctx.strokeStyle = "rgba(0, 173, 132, 0.05)";
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < canvas.offsetWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.offsetHeight);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.offsetHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.offsetWidth, y);
        ctx.stroke();
      }

      // Update and draw particles with autonomous movement
      particlesRef.current.forEach((particle, i) => {
        // Autonomous sinusoidal movement
        const baseVx = Math.sin(timeRef.current * 0.5 + particle.pulsePhase) * 0.3;
        const baseVy = Math.cos(timeRef.current * 0.4 + particle.pulsePhase) * 0.3;
        
        particle.x += particle.vx + baseVx;
        particle.y += particle.vy + baseVy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.offsetWidth;
        if (particle.x > canvas.offsetWidth) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.offsetHeight;
        if (particle.y > canvas.offsetHeight) particle.y = 0;

        // Pulsing effect - more prominent
        const pulseOpacity = particle.opacity * (0.6 + 0.4 * Math.sin(timeRef.current * 2 + particle.pulsePhase));
        const pulseSize = particle.size * (0.85 + 0.15 * Math.sin(timeRef.current * 3 + particle.pulsePhase));

        // Draw particle with larger glow
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, pulseSize * 4
        );
        gradient.addColorStop(0, `rgba(0, 173, 132, ${pulseOpacity})`);
        gradient.addColorStop(0.5, `rgba(0, 173, 132, ${pulseOpacity * 0.3})`);
        gradient.addColorStop(1, "rgba(0, 173, 132, 0)");
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize * 4, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Core particle - larger
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, pulseSize, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 173, 132, ${pulseOpacity})`;
        ctx.fill();

        // Draw connections to nearby particles - thicker lines
        particlesRef.current.slice(i + 1).forEach((other) => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 180) {
            const connectionOpacity = 0.25 * (1 - distance / 180);
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 173, 132, ${connectionOpacity})`;
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        });

        // Gentle velocity changes for organic movement
        particle.vx += (Math.random() - 0.5) * 0.02;
        particle.vy += (Math.random() - 0.5) * 0.02;

        // Damping
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Limit velocity
        const maxVel = 1.2;
        const vel = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
        if (vel > maxVel) {
          particle.vx = (particle.vx / vel) * maxVel;
          particle.vy = (particle.vy / vel) * maxVel;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Calculate animated positions for data nodes
  const getNodePosition = (node: DataNode, time: number) => {
    const offsetX = Math.sin(time * 0.8 + node.delay * 5) * 2;
    const offsetY = Math.cos(time * 0.6 + node.delay * 5) * 2;
    return {
      x: node.baseX + offsetX,
      y: node.baseY + offsetY,
    };
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20" />

      {/* Animated canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9 }}
      />

      {/* Floating data nodes with autonomous movement */}
      {dataNodes.map((node) => (
        <div
          key={node.id}
          className="absolute hidden md:flex items-center gap-3"
          style={{
            left: `${node.baseX}%`,
            top: `${node.baseY}%`,
            animation: `float-${node.id} 8s ease-in-out infinite`,
            animationDelay: `${node.delay}s`,
          }}
        >
          <div 
            className="relative w-6 h-6 rounded-full"
            style={{ backgroundColor: `${node.color}99` }}
          >
            {/* Pulse rings - larger */}
            <div 
              className="absolute -inset-2 rounded-full animate-ping"
              style={{ 
                backgroundColor: node.color,
                opacity: 0.4,
                animationDuration: "2.5s"
              }}
            />
            <div 
              className="absolute -inset-1 rounded-full animate-ping"
              style={{ 
                backgroundColor: node.color,
                opacity: 0.3,
                animationDuration: "2.5s",
                animationDelay: "0.5s"
              }}
            />
            {/* Inner glow - larger */}
            <div 
              className="absolute inset-1 rounded-full"
              style={{ 
                backgroundColor: node.color,
                boxShadow: `0 0 15px ${node.color}, 0 0 30px ${node.color}50, 0 0 45px ${node.color}30`
              }}
            />
          </div>
          <span 
            className="text-base font-mono font-semibold text-primary"
            style={{
              textShadow: `0 0 10px ${node.color}50`
            }}
          >
            {node.label}
          </span>
        </div>
      ))}



      {/* Content */}
      <div className="container relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main headline */}
          <h1 className="heading-xl mb-6 text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            Stop Losing Revenue to{" "}
            <span className="text-primary relative inline-block">
              Broken Tracking
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 200 8"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 4 Q50 0 100 4 T200 4"
                  stroke="#00AD84"
                  strokeWidth="3"
                  fill="none"
                  style={{
                    strokeDasharray: 200,
                    strokeDashoffset: 200,
                    animation: "draw 1.5s ease-out 0.5s forwards",
                  }}
                />
              </svg>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="body-lg text-muted-foreground mb-8 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            We fix tracking gaps, implement server-side solutions, and deliver
            privacy-compliant analytics that turn your ad spend into measurable
            growth.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <Link href="/contact">
              <Button
                size="lg"
                className="text-base px-8 h-12 group relative overflow-hidden shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center">
                  Get Free Consultation
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
            <Link href="/health-check">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 backdrop-blur-sm hover:bg-primary/10 transition-all duration-300 relative overflow-hidden group"
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

          {/* Stats with hover effects */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-default"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2 transition-all duration-300 group-hover:scale-110 group-hover:text-primary/90">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />

      {/* CSS for animations */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -100;
          }
        }
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes float-1 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(15px, -10px); }
          50% { transform: translate(5px, 15px); }
          75% { transform: translate(-10px, 5px); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-12px, 8px); }
          50% { transform: translate(10px, -12px); }
          75% { transform: translate(8px, 10px); }
        }
        @keyframes float-3 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(10px, 12px); }
          50% { transform: translate(-15px, -8px); }
          75% { transform: translate(-5px, 15px); }
        }
        @keyframes float-4 {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(-8px, -15px); }
          50% { transform: translate(12px, 10px); }
          75% { transform: translate(15px, -5px); }
        }
      `}</style>
    </section>
  );
}
