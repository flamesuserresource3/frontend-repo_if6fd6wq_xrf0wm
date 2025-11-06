import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBalloons from './FloatingBalloons';

export default function CountdownIntro({ onComplete }) {
  const [count, setCount] = useState(3);
  const [showWish, setShowWish] = useState(false);

  useEffect(() => {
    let timer;
    if (count > 0) {
      timer = setTimeout(() => setCount((c) => c - 1), 900);
    } else {
      setShowWish(true);
      timer = setTimeout(() => {
        onComplete?.();
      }, 2600);
    }
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-b from-pink-50 via-rose-50 to-orange-50 flex items-center justify-center">
      <AnimatePresence mode="wait">
        {count > 0 && (
          <motion.div
            key={count}
            initial={{ scale: 0.2, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.2, opacity: 0, y: -40 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="text-8xl font-black tracking-tight text-rose-600 drop-shadow-sm"
          >
            {count}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showWish && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <FloatingBalloons />
            <motion.h1
              className="text-center text-4xl sm:text-5xl font-extrabold text-rose-700 px-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 160 }}
            >
              Happy Birthday!
            </motion.h1>
            <motion.p
              className="mt-3 text-center text-rose-500 text-lg px-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.35, type: 'spring', stiffness: 160 }}
            >
              Wishing you a day filled with love, laughter, and all your favorite moments.
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
