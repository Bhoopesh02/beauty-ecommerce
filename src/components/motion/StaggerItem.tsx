'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function StaggerItem({ 
  children, 
  className = '',
  yOffset = 25,
  duration = 0.6
}: { 
  children: ReactNode; 
  className?: string;
  yOffset?: number;
  duration?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: { opacity: 1, y: 0, transition: { duration, ease: [0.22, 1, 0.36, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
