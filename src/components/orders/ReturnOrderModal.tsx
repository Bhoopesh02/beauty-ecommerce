'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Order } from '@/types';
import styles from './ReturnOrderModal.module.css';

interface ReturnOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmReturn: (orderId: string, reason: string) => Promise<void>;
}

const RETURN_REASONS = [
  'Size / Fit did not match expectation',
  'Item arrived defective or damaged',
  'Different from image / product description',
  'Quality not as expected',
  'Changed my mind / No longer needed'
];

export default function ReturnOrderModal({
  order,
  isOpen,
  onClose,
  onConfirmReturn
}: ReturnOrderModalProps) {
  const [selectedReason, setSelectedReason] = useState(RETURN_REASONS[0]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !order) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const fullReason = comments.trim()
      ? `${selectedReason} - ${comments.trim()}`
      : selectedReason;

    try {
      await onConfirmReturn(order.id, fullReason);
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
          aria-labelledby="return-title"
        >
          <div className={styles.header}>
            <div>
              <h3 id="return-title" className={styles.title}>REQUEST RETURN</h3>
              <span className={styles.subtitle}>Order #{order.id}</span>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close return modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className={styles.sectionTitle}>Items for Return</div>
          <div className={styles.itemList}>
            {order.items.map((item, idx) => (
              <div key={idx} className={styles.itemCard}>
                <div className={styles.itemImage}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="50px"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div className={styles.itemDetails}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemMeta}>
                    Qty: {item.quantity} &bull; {[item.color, item.size].filter(Boolean).join(' / ')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="return-reason" className={styles.label}>
                Return Reason
              </label>
              <select
                id="return-reason"
                className={styles.select}
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                {RETURN_REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="return-comments" className={styles.label}>
                Additional Notes (Optional)
              </label>
              <textarea
                id="return-comments"
                className={styles.textarea}
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Any specific feedback for our quality desk..."
              />
            </div>

            <div className={styles.pickupNotice}>
              <strong>Doorstep Reverse Pickup:</strong> Our luxury courier partner will inspect and collect the item in original packaging from:
              <br />
              <span style={{ color: 'var(--text-primary)', marginTop: '0.25rem', display: 'inline-block' }}>
                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.pincode}
              </span>
            </div>

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={onClose}
                disabled={isSubmitting}
              >
                CANCEL
              </button>
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT RETURN REQUEST'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
