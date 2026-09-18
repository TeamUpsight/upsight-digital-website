import {
  BarChart3,
  Database,
  Globe,
  Handshake,
  Megaphone,
  Server,
  Smartphone,
} from "lucide-react";

/* ─── Animated connection line between two points ─── */
function FlowLine({
  from,
  to,
  delay,
}: {
  from: { x: number; y: number };
  to: { x: number; y: number };
  delay: number;
}) {
  const midX = (from.x + to.x) / 2;
  const d = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;

  return (
    <g>
      {/* Base shadow line */}
      <path
        d={d}
        fill="none"
        stroke="rgba(0,173,132,0.08)"
        strokeWidth="3"
        className="transition-opacity duration-1000 opacity-100"
        style={{ transitionDelay: `${delay}ms` }}
      />
      {/* Static track line */}
      <path
        d={d}
        fill="none"
        stroke="rgba(0,173,132,0.2)"
        strokeWidth="1.5"
        className="transition-opacity duration-1000 opacity-100"
        style={{ transitionDelay: `${delay}ms` }}
      />
      {/* Animated flowing particles */}
      <path
        d={d}
        fill="none"
        stroke="rgba(0,173,132,0.7)"
        strokeWidth="2"
        strokeDasharray="6 14"
        className="transition-opacity duration-1000 opacity-100"
        style={{
          transitionDelay: `${delay + 200}ms`,
          animation: "dataFlow 2s linear infinite",
          animationDelay: `${delay + 200}ms`,
        }}
      />
      {/* Bright dot at destination */}
      <circle
        cx={to.x}
        cy={to.y}
        r="3"
        fill="#00AD84"
        className="transition-opacity duration-700 opacity-100"
        style={{
          transitionDelay: `${delay + 400}ms`,
          filter: "drop-shadow(0 0 4px rgba(0,173,132,0.6))",
        }}
      />
    </g>
  );
}

/* ─── Node component ─── */
function DiagramNode({
  x,
  y,
  icon: Icon,
  label,
  sublabel,
  delay,
  floatClass,
}: {
  x: number;
  y: number;
  icon: React.ElementType;
  label: string;
  sublabel: string;
  delay: number;
  floatClass: string;
}) {

  return (
    <g
      className={`${floatClass} cursor-pointer transition-all duration-700 opacity-100`}
      style={{ transitionDelay: `${delay}ms` }}
      data-diagram-node
    >
      {/* Outer glow on hover */}
      {(
        <rect className="diagram-hover-glow"
          x={x - 2}
          y={y - 2}
          width="144"
          height="84"
          rx="14"
          ry="14"
          fill="none"
          stroke="rgba(0,173,132,0.3)"
          strokeWidth="1"
          style={{ filter: "drop-shadow(0 0 8px rgba(0,173,132,0.3))" }}
        />
      )}
      {/* Card background */}
      <rect
        x={x}
        y={y}
        width="140"
        height="80"
        rx="12"
        ry="12"
        fill="#0f1923"
        className="diagram-node-card" stroke="rgba(0,173,132,0.25)" strokeWidth="1"
        className="transition-all duration-300"
      />
      {/* Top accent line */}
      <rect
        x={x + 16}
        y={y}
        width="108"
        height="2"
        rx="1"
        className="diagram-node-accent" fill="rgba(0,173,132,0.4)"
        className="transition-all duration-300"
      />
      {/* Icon container */}
      <rect
        x={x + 12}
        y={y + 16}
        width="36"
        height="36"
        rx="8"
        ry="8"
        fill="rgba(0,173,132,0.1)"
        stroke="rgba(0,173,132,0.2)"
        strokeWidth="1"
      />
      {/* Icon placeholder - rendered via foreignObject */}
      <foreignObject x={x + 12} y={y + 16} width="36" height="36">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} color="#00AD84" strokeWidth={1.5} />
        </div>
      </foreignObject>
      {/* Label */}
      <text
        x={x + 60}
        y={y + 32}
        textAnchor="start"
        fill="#e8eaed"
        fontSize="13"
        fontWeight="600"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {label}
      </text>
      {/* Sublabel */}
      <text
        x={x + 60}
        y={y + 50}
        textAnchor="start"
        fill="rgba(255,255,255,0.45)"
        fontSize="10"
        fontFamily="Inter, system-ui, sans-serif"
      >
        {sublabel}
      </text>
    </g>
  );
}

/* ─── Central Server Node (Hexagonal) ─── */
function CenterNode({
  cx,
  cy,
}: {
  cx: number;
  cy: number;
}) {
  const r = 62;
  const hexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
  }).join(" ");
  const innerR = 52;
  const innerHexPoints = Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    return `${cx + innerR * Math.cos(angle)},${cy + innerR * Math.sin(angle)}`;
  }).join(" ");

  return (
    <g
      className="cursor-pointer transition-all duration-700 opacity-100"
      style={{ transitionDelay: "500ms" }}
      data-diagram-node
    >
      {/* Outer pulse ring */}
      <circle
        cx={cx}
        cy={cy}
        r="78"
        fill="none"
        stroke="rgba(0,173,132,0.08)"
        strokeWidth="1"
        style={{ animation: "serverPulse 3s ease-in-out infinite" }}
      />
      <circle
        cx={cx}
        cy={cy}
        r="70"
        fill="none"
        stroke="rgba(0,173,132,0.12)"
        strokeWidth="1"
      />
      {/* Hexagon */}
      <polygon
        points={hexPoints}
        fill="#0a2e24"
        className="diagram-server" stroke="rgba(0,173,132,0.5)" strokeWidth="1.5"
        style={{
          filter: "drop-shadow(0 0 6px rgba(0,173,132,0.2))",
          transition: "all 0.3s ease",
        }}
      />
      {/* Inner hexagon */}
      <polygon
        points={innerHexPoints}
        fill="rgba(0,173,132,0.08)"
        stroke="rgba(0,173,132,0.15)"
        strokeWidth="1"
      />
      {/* Server icon */}
      <foreignObject x={cx - 14} y={cy - 26} width="28" height="28">
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Server size={22} color="#00AD84" strokeWidth={1.5} />
        </div>
      </foreignObject>
      {/* Labels */}
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        fill="#e8eaed"
        fontSize="12"
        fontWeight="700"
        fontFamily="Inter, system-ui, sans-serif"
      >
        Server-Side
      </text>
      <text
        x={cx}
        y={cy + 30}
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize="9"
        fontFamily="Inter, system-ui, sans-serif"
      >
        Segment + GTM
      </text>
    </g>
  );
}

/* ─── Main Diagram ─── */
export default function DataFlowDiagram() {

  // Layout positions
  const centerX = 450;
  const centerY = 200;

  const leftNodes = [
    { x: 30, y: 40, icon: Globe, label: "Web", sublabel: "slicelife.com", delay: 200 },
    { x: 30, y: 160, icon: Smartphone, label: "App", sublabel: "Android & iOS", delay: 350 },
    { x: 30, y: 280, icon: Handshake, label: "Partners", sublabel: "14,000+ sites", delay: 500 },
  ];

  const rightNodes = [
    { x: 730, y: 40, icon: BarChart3, label: "GA4", sublabel: "Analytics", delay: 800 },
    { x: 730, y: 160, icon: Megaphone, label: "Ads", sublabel: "Google + Meta", delay: 950 },
    { x: 730, y: 280, icon: Database, label: "BigQuery", sublabel: "Data Warehouse", delay: 1100 },
  ];

  const floatClasses = ["diagram-float-1", "diagram-float-2", "diagram-float-3"];

  return (
    <div data-reveal className="relative max-w-5xl mx-auto overflow-hidden">
      <style>{`
        @keyframes dataFlow {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes serverPulse {
          0%, 100% { opacity: 0.3; transform-origin: center; transform: scale(1); }
          50% { opacity: 0.8; transform-origin: center; transform: scale(1.04); }
        }
        @keyframes diagram-float-1-kf {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes diagram-float-2-kf {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes diagram-float-3-kf {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .diagram-float-1 { animation: diagram-float-1-kf 5s ease-in-out infinite; }
        .diagram-float-2 { animation: diagram-float-2-kf 5s ease-in-out infinite 0.6s; }
        .diagram-float-3 { animation: diagram-float-3-kf 5s ease-in-out infinite 1.2s; }
      `}</style>

      <svg
        viewBox="0 0 900 400"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background */}
        <defs>
          <pattern id="diag-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path
              d="M 30 0 L 0 0 0 30"
              fill="none"
              stroke="rgba(0,173,132,0.04)"
              strokeWidth="0.5"
            />
          </pattern>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(0,173,132,0.06)" />
            <stop offset="100%" stopColor="rgba(0,173,132,0)" />
          </radialGradient>
        </defs>

        <rect width="900" height="400" fill="#0c1219" rx="16" ry="16" />
        <rect width="900" height="400" fill="url(#diag-grid)" rx="16" ry="16" />
        {/* Center ambient glow */}
        <circle cx={centerX} cy={centerY} r="200" fill="url(#centerGlow)" />

        {/* ─── Flow Lines (Left → Center) ─── */}
        {leftNodes.map((node, i) => (
          <FlowLine
            key={`left-${i}`}
            from={{ x: node.x + 140, y: node.y + 40 }}
            to={{ x: centerX - 62, y: centerY }}
            delay={node.delay + 300}
          />
        ))}

        {/* ─── Flow Lines (Center → Right) ─── */}
        {rightNodes.map((node, i) => (
          <FlowLine
            key={`right-${i}`}
            from={{ x: centerX + 62, y: centerY }}
            to={{ x: node.x, y: node.y + 40 }}
            delay={node.delay + 300}
          />
        ))}

        {/* ─── Left Nodes ─── */}
        {leftNodes.map((node, i) => (
          <DiagramNode
            key={`ln-${i}`}
            x={node.x}
            y={node.y}
            icon={node.icon}
            label={node.label}
            sublabel={node.sublabel}
            delay={node.delay}
            floatClass={floatClasses[i]}
          />
        ))}

        {/* ─── Center Node ─── */}
        <CenterNode cx={centerX} cy={centerY} />

        {/* ─── Right Nodes ─── */}
        {rightNodes.map((node, i) => (
          <DiagramNode
            key={`rn-${i}`}
            x={node.x}
            y={node.y}
            icon={node.icon}
            label={node.label}
            sublabel={node.sublabel}
            delay={node.delay}
            floatClass={floatClasses[i]}
          />
        ))}

        {/* ─── Direction labels ─── */}
        <text
          x={centerX - 120}
          y={380}
          textAnchor="middle"
          fill="rgba(0,173,132,0.3)"
          fontSize="9"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="2"
        >
          DATA SOURCES
        </text>
        <text
          x={centerX + 120}
          y={380}
          textAnchor="middle"
          fill="rgba(0,173,132,0.3)"
          fontSize="9"
          fontFamily="Inter, system-ui, sans-serif"
          letterSpacing="2"
        >
          DESTINATIONS
        </text>
      </svg>
    </div>
  );
}
