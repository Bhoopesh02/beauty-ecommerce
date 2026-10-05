'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import styles from './EmptyOrders.module.css';

interface EmptyOrdersProps {
  onResetOrders?: () => void;
  isFiltered?: boolean;
  onClearFilters?: () => void;
}

export default function EmptyOrders({
  onResetOrders,
  isFiltered = false,
  onClearFilters
}: EmptyOrdersProps) {
  if (isFiltered) {
    return (
      <motion.div
        className={styles.emptyContainer}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className={styles.emptyTitle}>NO MATCHING ORDERS</h3>
        <p className={styles.emptyDescription}>
          No orders found matching your selected status filter or search criteria.
        </p>
        {onClearFilters && (
          <button
            type="button"
            className={styles.ctaButton}
            onClick={onClearFilters}
          >
            VIEW ALL ORDERS
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={styles.emptyContainer}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className={styles.emptyTitle}>YOUR ORDER HISTORY IS EMPTY</h3>
      <p className={styles.emptyDescription}>
        Discover pieces designed with{'\n'}a distinct DERRUME perspective.
      </p>

      <Link href="/products" className={styles.ctaButton}>
        EXPLORE COLLECTION
      </Link>

      {onResetOrders && (
        <div className={styles.secondaryActions}>
          <button
            type="button"
            className={styles.resetBtn}
            onClick={onResetOrders}
          >
            Load Demo Purchase Archive
          </button>
        </div>
      )}
    </motion.div>
  );
}
