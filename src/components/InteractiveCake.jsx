import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function Candle({ x, lit, onToggle }) {
  return (
    <g transform={`translate(${x},0)`} onClick={onToggle} className="cursor-pointer">
      <rect x={-6} y={-40} width={12} height={40} rx={3} fill="#ffd7d7" stroke="#ff9fb1" />
      {lit && (
        <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
          <motion.ellipse cx={0} cy={-48} rx={6} ry={10} fill="url(#flameGrad)" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.8, repeat: Infinity }} />
          <motion.circle cx={0} cy={-48} r={2} fill="#fff6d1" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.8, repeat: Infinity }} />
        </motion.g>
      )}
      {!lit && <circle cx={0} cy={-41} r={2} fill="#555" />}
    </g>
  );
}

export default function InteractiveCake() {
  const [candles, setCandles] = useState([]); // positions
  const [lit, setLit] = useState({});
  const [placing, setPlacing] = useState(true);
  const svgRef = useRef(null);
  const audioRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const rafRef = useRef(null);

  const cakeWidth = 320;

  const handlePlace = (e) => {
    if (!placing) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - cakeWidth / 2; // relative to center
    setCandles((c) => [...c, x]);
  };

  const toggleCandle = (idx) => {
    setLit((l) => ({ ...l, [idx]: !l[idx] }));
  };

  const lightAll = () => {
    const next = {};
    candles.forEach((_, i) => (next[i] = true));
    setLit(next);
    setPlacing(false);
  };

  const blowOut = () => {
    setLit((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => (next[k] = false));
      return next;
    });
  };

  const startMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      mediaStreamRef.current = stream;
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      const data = new Uint8Array(analyser.frequencyBinCount);

      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let peak = 0;
        for (let i = 0; i < data.length; i++) {
          const v = Math.abs(data[i] - 128) / 128; // 0..1
          if (v > peak) peak = v;
        }
        // If loud breath detected
        if (peak > 0.35) {
          blowOut();
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      console.warn('Mic not available', e);
    }
  };

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach((t) => t.stop());
  }, []);

  const anyLit = useMemo(() => Object.values(lit).some(Boolean), [lit]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-amber-50 to-rose-50 flex flex-col items-center justify-center p-6">
      <div className="text-center mb-4">
        <h2 className="text-3xl font-extrabold text-rose-700">Make a wish</h2>
        <p className="text-rose-500">Tap to place candles. Light them, then blow them out using your mic!</p>
      </div>

      <div className="w-full max-w-md bg-white/70 backdrop-blur border border-rose-100 rounded-3xl shadow-xl p-4">
        <svg
          ref={svgRef}
          onClick={handlePlace}
          viewBox="-200 -130 400 260"
          className="w-full h-auto"
        >
          <defs>
            <linearGradient id="flameGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#fff6a4" />
              <stop offset="100%" stopColor="#ff8a65" />
            </linearGradient>
            <linearGradient id="icing" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ffd1dc" />
              <stop offset="100%" stopColor="#ffb3c1" />
            </linearGradient>
          </defs>

          {/* Cake shadow */}
          <ellipse cx="0" cy="90" rx="120" ry="18" fill="#e8c3c3" opacity="0.4" />

          {/* Plate */}
          <rect x="-150" y="70" width="300" height="16" rx="8" fill="#fff" stroke="#e5e7eb" />

          {/* Cake layers */}
          <g>
            <rect x="-140" y="10" width="280" height="70" rx="20" fill="url(#icing)" stroke="#ff9fb1" />
            <rect x="-110" y="-30" width="220" height="40" rx="16" fill="#ffe4ec" stroke="#ffb3c1" />
            {/* Drips */}
            {[...Array(8)].map((_, i) => (
              <path
                key={i}
                d={`M ${-120 + i * 30} 0 q 10 10 0 20 t 0 20`}
                fill="none"
                stroke="#ff8fb4"
                strokeWidth="4"
                opacity="0.5"
              />
            ))}
          </g>

          {/* Candles */}
          <g transform="translate(0,-30)">
            {candles.map((x, i) => (
              <Candle key={i} x={x} lit={!!lit[i]} onToggle={() => toggleCandle(i)} />
            ))}
          </g>

          {/* Sparking confetti when blown out */}
          {!anyLit && candles.length > 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[...Array(40)].map((_, i) => (
                <motion.circle
                  key={i}
                  cx={Math.random() * 200 - 100}
                  cy={-40 + Math.random() * 40}
                  r={2}
                  fill={`hsl(${Math.random() * 360},80%,60%)`}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: 140, opacity: [0, 1, 0] }}
                  transition={{ duration: 1.6, delay: Math.random() * 0.3 }}
                />
              ))}
            </motion.g>
          )}
        </svg>

        <div className="flex gap-2 justify-center mt-2">
          <button onClick={() => setPlacing((p) => !p)} className="px-3 py-2 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
            {placing ? 'Stop placing' : 'Place candles'}
          </button>
          <button onClick={lightAll} className="px-3 py-2 rounded-full bg-rose-500 text-white text-sm font-medium">Light all</button>
          <button onClick={startMic} className="px-3 py-2 rounded-full bg-amber-500 text-white text-sm font-medium">Use mic</button>
          <button onClick={blowOut} className="px-3 py-2 rounded-full bg-rose-200 text-rose-700 text-sm font-medium">Blow out</button>
        </div>
      </div>
    </div>
  );
}
