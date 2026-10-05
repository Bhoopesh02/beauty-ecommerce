'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Order } from '@/types';
import styles from './CancelOrderModal.module.css';

interface CancelOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (orderId: string, reason: string) => Promise<void>;
}

const REASONS = [
  'Need to change shipping address or contact info',
  'Ordered wrong product or size',
  'Placed duplicate order by mistake',
  'Found alternative product or changed my mind',
  'Other reason'
];

export default function CancelOrderModal({
  order,
  isOpen,
  onClose,
  onConfirmCancel
}: CancelOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState(REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const reason = selectedReason === 'Other reason' && customReason.trim()
      ? customReason.trim()
      : selectedReason;

    try {
      await onConfirmCancel(order.id, reason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

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
          aria-labelledby="cancel-title"
        >
          <div className={styles.header}>
            <div>
              <h3 id="cancel-title" className={styles.title}>CANCEL ORDER</h3>
              <span className={styles.subtitle}>Order #{order.id}</span>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.warningBox}>
            Orders can only be cancelled while in <strong>Placed</strong> or <strong>Confirmed</strong> status. Once cancelled, any authorized payment will be refunded to your original payment method.
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="cancel-reason" className={styles.label}>
                Reason for Cancellation
              </label>
              <select
                id="cancel-reason"
                className={styles.select}
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {selectedReason === 'Other reason' && (
              <div className={styles.formGroup}>
                <label htmlFor="custom-reason" className={styles.label}>
                  Please specify
                </label>
                <textarea
                  id="custom-reason"
                  className={styles.textarea}
                  rows={3}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Tell us why you are requesting cancellation..."
                  required
                />
              </div>
            )}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={isSubmitting}
              >
                KEEP ORDER
              </button>
              <button
                type="submit"
                className={styles.confirmBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'CANCELLING...' : 'CONFIRM CANCELLATION'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
