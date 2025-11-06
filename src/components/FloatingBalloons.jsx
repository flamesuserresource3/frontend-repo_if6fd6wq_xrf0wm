import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

function random(min, max) {
  return Math.random() * (max - min) + min;
}

export default function FloatingBalloons() {
  const balloons = useMemo(() =>
    Array.from({ length: 18 }).map((_, i) => ({
      id: i,
      left: random(0, 100),
      size: random(30, 70),
      delay: random(0, 3),
      duration: random(6, 12),
      color: `hsl(${random(330, 20)}, 80%, 70%)`,
    })), []);

  useEffect(() => {}, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {balloons.map((b) => (
        <motion.div
          key={b.id}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: -600, opacity: [0, 1, 1, 0.4, 0] }}
          transition={{ delay: b.delay, duration: b.duration, repeat: Infinity, ease: 'easeOut' }}
          className="absolute bottom-0"
          style={{ left: `${b.left}%` }}
        >
          <div
            className="rounded-full shadow-md"
            style={{ width: b.size, height: b.size * 1.2, background: b.color }}
          />
          <div className="w-0.5 h-10 mx-auto" style={{ background: b.color, opacity: 0.6 }} />
        </motion.div>
      ))}
    </div>
  );
}
