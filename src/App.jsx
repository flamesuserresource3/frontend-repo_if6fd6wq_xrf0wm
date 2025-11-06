import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CountdownIntro from './components/CountdownIntro';
import GreetingCard from './components/GreetingCard';
import InteractiveCake from './components/InteractiveCake';
import SceneOrnament from './components/SceneOrnament';

export default function App() {
  const [stage, setStage] = useState(0); // 0=countdown, 1=card, 2=cake

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">
      <SceneOrnament />
      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <CountdownIntro onComplete={() => setStage(1)} />
          </motion.div>
        )}
        {stage === 1 && (
          <motion.div key="s1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <GreetingCard onNext={() => setStage(2)} />
          </motion.div>
        )}
        {stage === 2 && (
          <motion.div key="s2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <InteractiveCake />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
