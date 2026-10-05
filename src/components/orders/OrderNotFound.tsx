'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './OrderNotFound.module.css';

export default function OrderNotFound() {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className={styles.title}>ORDER NOT FOUND</h2>
      <p className={styles.description}>We couldn&apos;t find this order.</p>
      <Link href="/account/orders" className={styles.backButton}>
        BACK TO ORDERS
      </Link>
    </motion.div>
  );
}
