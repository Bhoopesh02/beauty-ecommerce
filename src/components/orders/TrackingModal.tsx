'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import { Order } from '@/types';
import { formatDate } from '@/utils/orderUtils';
import styles from './TrackingModal.module.css';

interface TrackingModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrackingModal({ order, isOpen, onClose }: TrackingModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const carrier = order.carrier || 'BlueDart Apex Luxury';
  const trackingNumber = order.trackingNumber || `BD-${order.id}-IN`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const checkpoints = order.trackingCheckpoints || [
    {
      status: order.orderStatus,
      location: 'Logistics Hub',
      timestamp: order.createdAt,
      description: `Package status: ${order.orderStatus}`
    }
  ];

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="tracking-title"
        >
          <div className={styles.header}>
            <div>
              <h3 id="tracking-title" className={styles.title}>SHIPMENT TRACKING</h3>
              <span className={styles.subtitle}>Order #{order.id}</span>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close tracking modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Courier Partner</span>
              <span className={styles.infoValue}>{carrier}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Waybill / AWB</span>
              <div className={styles.trackingNumberRow}>
                <span className={styles.infoValue} style={{ fontSize: '0.8125rem' }}>{trackingNumber}</span>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={handleCopy}
                  title="Copy tracking number"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Current Status</span>
              <span className={styles.infoValue}>{order.orderStatus}</span>
            </div>

            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                {order.orderStatus === 'Delivered' ? 'Delivered On' : 'Expected Delivery'}
              </span>
              <span className={styles.infoValue}>
                {order.orderStatus === 'Delivered'
                  ? formatDate(order.deliveredAt || order.createdAt)
                  : order.estimatedDelivery
                  ? formatDate(order.estimatedDelivery)
                  : 'Within 2-3 business days'}
              </span>
            </div>
          </div>

          <h4 className={styles.checkpointsTitle}>Journey Milestones</h4>

          <div className={styles.checkpointsList}>
            {checkpoints.map((cp, idx) => (
              <div key={idx} className={styles.checkpointItem}>
                <span className={`${styles.checkpointDot} ${idx === 0 ? styles.checkpointDotActive : ''}`} />
                <div className={styles.checkpointStatus}>{cp.status}</div>
                <div className={styles.checkpointDesc}>{cp.description} &bull; {cp.location}</div>
                <div className={styles.checkpointTime}>{formatDate(cp.timestamp)}</div>
              </div>
            ))}
          </div>

          <div className={styles.disclaimer}>
            Status information is synchronized via DERRUME Priority Logistics. Real-time courier API integrations can be connected to this tracking interface.
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
