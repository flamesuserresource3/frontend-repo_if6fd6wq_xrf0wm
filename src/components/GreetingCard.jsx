import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GreetingCard({ onNext }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setTimeout(() => onNext?.(), 2800);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 flex items-center justify-center p-6">
      <div className="max-w-sm w-full">
        <AnimatePresence initial={false}>
          {!open ? (
            <motion.button
              key="closed"
              onClick={handleOpen}
              className="w-full aspect-[3/4] bg-white/70 backdrop-blur rounded-3xl border border-rose-100 shadow-xl overflow-hidden relative"
              initial={{ rotateX: 0, opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 160 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100/70 to-amber-100/60" />
              <div className="relative h-full w-full flex flex-col items-center justify-center gap-3 p-6">
                <motion.div className="text-5xl">🎁</motion.div>
                <div className="text-2xl font-bold text-rose-700">Tap to open</div>
                <div className="text-rose-500 text-sm">A little note straight from the heart</div>
              </div>
            </motion.button>
          ) : (
            <motion.div
              key="open"
              className="relative w-full aspect-[3/4] perspective-1000"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="relative w-full h-full">
                <motion.div
                  className="absolute inset-0 origin-left bg-white rounded-l-3xl shadow-md border border-rose-100"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: -160 }}
                  transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                />
                <motion.div
                  className="absolute inset-0 origin-right bg-white rounded-r-3xl shadow-xl border border-rose-100 p-6 flex items-center"
                  initial={{ rotateY: 0 }}
                  animate={{ rotateY: 160 }}
                  transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="text-rose-700"
                  >
                    <div className="text-xl font-semibold">To the birthday star ✨</div>
                    <p className="mt-3 leading-relaxed text-rose-600">
                      On your special day, I wish you oceans of joy and tiny moments that make your heart smile.
                      May every candle you light today bring a wish that finds its way to reality.
                    </p>
                    <p className="mt-3 leading-relaxed text-rose-600">
                      Thank you for being wonderfully you. Here’s to more laughter, more adventures, and more love — always.
                    </p>
                    <div className="mt-4 text-right font-medium">With all my heart 💖</div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
