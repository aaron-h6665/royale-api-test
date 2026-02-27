'use client';

import { motion } from 'framer-motion';

export default function AnimatedContainer({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} // Start invisible and 20px down
      animate={{ opacity: 1, y: 0 }}  // Slide up and fade in
      transition={{ 
        duration: 0.5, 
        delay: delay, 
        ease: [0.25, 0.1, 0.25, 1.0] // "Flowy" cubic-bezier curve
      }}
    >
      {children}
    </motion.div>
  );
}