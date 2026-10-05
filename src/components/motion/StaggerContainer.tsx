'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

export default function StaggerContainer({ 
  children, 
  className = '', 
  delayChildren = 0.1,
  staggerChildren = 0.1
}: { 
  children: ReactNode; 
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren,
            staggerChildren
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
