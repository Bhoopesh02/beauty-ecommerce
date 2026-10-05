'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { OrderFilterTab } from '@/types';
import styles from './OrderFilters.module.css';

interface OrderFiltersProps {
  activeFilter: OrderFilterTab;
  onSelectFilter: (filter: OrderFilterTab) => void;
  counts?: Partial<Record<OrderFilterTab, number>>;
}

const TABS: OrderFilterTab[] = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export default function OrderFilters({
  activeFilter,
  onSelectFilter,
  counts
}: OrderFiltersProps) {
  return (
    <nav className={styles.filterNav} aria-label="Order Status Filters" role="tablist">
      {TABS.map((tab) => {
        const isActive = activeFilter === tab;
        const count = counts?.[tab];

        return (
          <button
            key={tab}
            role="tab"
            aria-selected={isActive}
            className={`${styles.filterButton} ${isActive ? styles.active : ''}`}
            onClick={() => onSelectFilter(tab)}
          >
            <span>{tab.toUpperCase()}</span>
            {typeof count === 'number' && (
              <span className={styles.count}>({count})</span>
            )}

            {isActive && (
              <motion.div
                layoutId="orderFilterActiveLine"
                className={styles.activeLine}
                transition={{
                  type: 'spring',
                  stiffness: 400,
                  damping: 32
                }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
