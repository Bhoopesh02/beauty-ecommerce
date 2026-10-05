'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Order, OrderStatus } from '@/types';
import { formatDate } from '@/utils/orderUtils';
import styles from './OrderStatusTimeline.module.css';

interface OrderStatusTimelineProps {
  order: Order;
}

const STANDARD_STEPS: OrderStatus[] = [
  'Placed',
  'Confirmed',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export default function OrderStatusTimeline({ order }: OrderStatusTimelineProps) {
  const isCancelled = order.orderStatus === 'Cancelled';

  if (isCancelled) {
    const placedTime = order.statusHistory?.find(s => s.status === 'Placed')?.timestamp || order.createdAt;
    const cancelledTime = order.cancelledAt || order.statusHistory?.find(s => s.status === 'Cancelled')?.timestamp;

    return (
      <div className={styles.timelineContainer}>
        <div className={styles.cancelledNotice}>
          <div>
            <strong>Order Cancelled:</strong> {order.cancelReason || 'This order was cancelled.'}
            {cancelledTime && (
              <span style={{ display: 'block', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                Cancelled on {formatDate(cancelledTime)}
              </span>
            )}
          </div>
        </div>

        {/* Simplified 2-step timeline for cancelled */}
        <div className={styles.mobileTimeline} style={{ marginTop: '1.25rem' }}>
          <div className={styles.mobileStep}>
            <div className={styles.mobileTrackCol}>
              <div className={`${styles.mobileDot} ${styles.mobileDotCompleted}`}>
                <Check size={11} strokeWidth={3} />
              </div>
              <div className={styles.mobileLine} />
            </div>
            <div className={styles.mobileContent}>
              <span className={`${styles.mobileLabel} ${styles.mobileLabelCompleted}`}>Order Placed</span>
              <span className={styles.mobileDate}>{formatDate(placedTime)}</span>
            </div>
          </div>

          <div className={styles.mobileStep}>
            <div className={styles.mobileTrackCol}>
              <div className={`${styles.mobileDot} ${styles.mobileDotActive}`} style={{ borderColor: '#8c828d' }}>
                <span className={styles.dotInner} style={{ backgroundColor: '#8c828d' }} />
              </div>
            </div>
            <div className={styles.mobileContent}>
              <span className={styles.mobileLabelActive} style={{ color: '#8c828d' }}>Cancelled</span>
              {cancelledTime && <span className={styles.mobileDate}>{formatDate(cancelledTime)}</span>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentIndex = STANDARD_STEPS.indexOf(order.orderStatus);
  const progressRatio = currentIndex >= 0 ? currentIndex / (STANDARD_STEPS.length - 1) : 0;

  return (
    <div className={styles.timelineContainer}>
      {/* Desktop Horizontal Timeline */}
      <div className={styles.desktopTimeline}>
        <div className={styles.timelineTrack}>
          <div className={styles.baseLine} />

          {/* Animated Progress Line */}
          <motion.div
            className={styles.progressLine}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progressRatio }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            style={{ width: 'calc(100% - 20px)' }}
          />

          {STANDARD_STEPS.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isActive = idx === currentIndex;
            const historyEntry = order.statusHistory?.find(s => s.status === step);
            const dateStr = historyEntry ? formatDate(historyEntry.timestamp) : '';

            return (
              <div key={step} className={styles.stepNode}>
                <motion.div
                  className={`${styles.dotOuter} ${isCompleted ? styles.dotCompleted : ''} ${isActive ? styles.dotActive : ''}`}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1 * idx }}
                >
                  {isCompleted ? (
                    <Check size={12} strokeWidth={3} />
                  ) : isActive ? (
                    <span className={styles.dotInner} />
                  ) : null}
                </motion.div>

                <span
                  className={`${styles.stepLabel} ${isCompleted ? styles.stepLabelCompleted : ''} ${isActive ? styles.stepLabelActive : ''}`}
                >
                  {step}
                </span>

                {dateStr && <span className={styles.stepDate}>{dateStr}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Vertical Timeline */}
      <div className={styles.mobileTimeline}>
        {STANDARD_STEPS.map((step, idx) => {
          const isCompleted = idx < currentIndex;
          const isActive = idx === currentIndex;
          const isLast = idx === STANDARD_STEPS.length - 1;
          const historyEntry = order.statusHistory?.find(s => s.status === step);
          const dateStr = historyEntry ? formatDate(historyEntry.timestamp) : '';

          return (
            <motion.div
              key={step}
              className={styles.mobileStep}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.08 * idx }}
            >
              <div className={styles.mobileTrackCol}>
                <div
                  className={`${styles.mobileDot} ${isCompleted ? styles.mobileDotCompleted : ''} ${isActive ? styles.mobileDotActive : ''}`}
                >
                  {isCompleted ? (
                    <Check size={10} strokeWidth={3} />
                  ) : isActive ? (
                    <span className={styles.dotInner} />
                  ) : null}
                </div>
                {!isLast && (
                  <div
                    className={`${styles.mobileLine} ${idx < currentIndex ? styles.mobileLineCompleted : ''}`}
                  />
                )}
              </div>

              <div className={styles.mobileContent}>
                <span
                  className={`${styles.mobileLabel} ${isCompleted ? styles.mobileLabelCompleted : ''} ${isActive ? styles.mobileLabelActive : ''}`}
                >
                  {step === 'Placed' ? 'Order Placed' : step}
                </span>
                {dateStr && <span className={styles.mobileDate}>{dateStr}</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
