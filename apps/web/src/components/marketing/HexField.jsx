import { motion } from 'framer-motion';

const hexagons = [
  { top: '8%', left: '6%', size: 70, delay: 0, opacity: 0.5 },
  { top: '20%', left: '82%', size: 110, delay: 1.2, opacity: 0.35 },
  { top: '62%', left: '12%', size: 90, delay: 0.6, opacity: 0.4 },
  { top: '72%', left: '78%', size: 60, delay: 1.8, opacity: 0.45 },
  { top: '40%', left: '48%', size: 48, delay: 2.4, opacity: 0.3 },
];

function Hex({ size, opacity }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ opacity }} aria-hidden="true">
      <defs>
        <linearGradient id={`hx-${size}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1FA6B8" />
          <stop offset="1" stopColor="#0B5C73" />
        </linearGradient>
      </defs>
      <polygon
        points="50,3 93,26 93,74 50,97 7,74 7,26"
        fill="none"
        stroke={`url(#hx-${size})`}
        strokeWidth="3"
      />
    </svg>
  );
}

export function HexField() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Animated blobs */}
      <div className="absolute -left-20 top-10 h-96 w-96 animate-blob rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute right-0 top-1/3 h-[28rem] w-[28rem] animate-blob rounded-full bg-brand-400/20 blur-3xl [animation-delay:4s]" />
      <div className="absolute bottom-0 left-1/3 h-80 w-80 animate-blob rounded-full bg-brand-500/10 blur-3xl [animation-delay:7s]" />

      {/* Floating hexagons */}
      {hexagons.map((h, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: h.top, left: h.left }}
          animate={{ y: [0, -22, 0], rotate: [0, 8, 0] }}
          transition={{ duration: 8 + i, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
        >
          <Hex size={h.size} opacity={h.opacity} />
        </motion.div>
      ))}
    </div>
  );
}
