'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  yOffset?: number;
  duration?: number;
  className?: string;
  width?: string;
}

export default function RevealOnScroll({ 
  children, 
  delay = 0, 
  yOffset = 30,
  duration = 0.7,
  className = '',
  width = 'auto'
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
}
