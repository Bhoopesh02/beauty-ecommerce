'use client';

import React from 'react';
import styles from './OrderSkeleton.module.css';

export default function OrderSkeleton({ count = 2 }: { count?: number }) {
  return (
    <div className={styles.container} aria-label="Loading orders...">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className={styles.skeletonCard}>
          <div className={styles.header}>
            <div>
              <div className={`${styles.line} ${styles.lineTitle}`} />
              <div className={`${styles.line} ${styles.lineDate}`} />
            </div>
            <div className={`${styles.line} ${styles.lineStatus}`} />
          </div>

          <div className={styles.body}>
            <div className={styles.thumb} />
            <div className={styles.info}>
              <div className={`${styles.line} ${styles.lineName}`} />
              <div className={`${styles.line} ${styles.lineSub}`} />
            </div>
          </div>

          <div className={styles.footer}>
            <div className={`${styles.line} ${styles.linePrice}`} />
            <div className={`${styles.line} ${styles.lineBtn}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
