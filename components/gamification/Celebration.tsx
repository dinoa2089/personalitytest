"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface CelebrationProps {
  show: boolean;
  message?: string;
}

export function Celebration({ show, message = "Great progress!" }: CelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => setIsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: -50 }}
          className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 transform"
        >
          <div className="rounded-lg border bg-card p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatDelay: 0.5,
                }}
                className="text-4xl"
              >
                🎉
              </motion.div>
              <div>
                <p className="font-semibold">{message}</p>
                <p className="text-sm text-muted-foreground">Keep going!</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

