'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/utils/orderUtils';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: Order;
  onTrackOrder?: (order: Order) => void;
}

export default function OrderCard({ order, onTrackOrder }: OrderCardProps) {
  const isMultiple = order.items.length > 1;
  const firstItem = order.items[0];

  const getStatusDisplay = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return {
          dotClass: styles.statusDotDelivered,
          textClass: styles.statusTextDelivered,
          dateLabel: order.deliveredAt ? formatDate(order.deliveredAt) : formatDate(order.createdAt)
        };
      case 'Shipped':
      case 'Out for Delivery':
        return {
          dotClass: styles.statusDotShipped,
          textClass: styles.statusTextShipped,
          dateLabel: order.estimatedDelivery ? `Expected ${formatDate(order.estimatedDelivery)}` : 'In Transit'
        };
      case 'Cancelled':
        return {
          dotClass: styles.statusDotCancelled,
          textClass: styles.statusTextCancelled,
          dateLabel: order.cancelledAt ? `Cancelled ${formatDate(order.cancelledAt)}` : 'Order Cancelled'
        };
      case 'Placed':
      case 'Confirmed':
      case 'Packed':
      default:
        return {
          dotClass: styles.statusDotProcessing,
          textClass: styles.statusTextProcessing,
          dateLabel: 'Estimated dispatch within 2 business days'
        };
    }
  };

  const statusInfo = getStatusDisplay(order.orderStatus);

  // Can track if order has tracking number or is not cancelled
  const canTrack = order.orderStatus !== 'Cancelled';

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.orderMeta}>
          <h3 className={styles.orderId}>ORDER #{order.id}</h3>
          <span className={styles.orderDate}>Placed {formatDate(order.createdAt)}</span>
        </div>

        <div className={styles.statusWrapper}>
          <div className={`${styles.statusBadge} ${statusInfo.textClass}`}>
            <span className={`${styles.statusDot} ${statusInfo.dotClass}`} />
            <span>{order.orderStatus}</span>
          </div>
          <span className={styles.deliveryDate}>{statusInfo.dateLabel}</span>
        </div>
      </div>

      {/* Body: Single Item or Multiple Items Preview */}
      <div className={styles.body}>
        {!isMultiple && firstItem ? (
          <div className={styles.singleItem}>
            <div className={styles.thumbWrapper}>
              {firstItem.image ? (
                <Image
                  src={firstItem.image}
                  alt={firstItem.name}
                  fill
                  sizes="72px"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
              )}
            </div>

            <div className={styles.itemDetails}>
              <h4 className={styles.itemName}>{firstItem.name}</h4>
              <div className={styles.itemAttributes}>
                {[firstItem.color, firstItem.size].filter(Boolean).join(' / ')}
              </div>
              <div className={styles.itemQty}>Qty {firstItem.quantity}</div>
            </div>

            <div className={styles.singlePrice}>
              {formatPrice(order.total)}
            </div>
          </div>
        ) : (
          <div className={styles.multiItem}>
            <div className={styles.multiSummary}>
              <span className={styles.itemsCount}>
                {order.items.reduce((acc, i) => acc + i.quantity, 0)} items · {formatPrice(order.total)}
              </span>
            </div>

            <div className={styles.thumbnailsRow}>
              {order.items.slice(0, 3).map((item, idx) => (
                <div key={idx} className={styles.thumbWrapper} title={item.name}>
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="72px"
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
              ))}
              {order.items.length > 3 && (
                <div className={styles.moreBadge}>
                  +{order.items.length - 3}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.totalBlock}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalAmount}>{formatPrice(order.total)}</span>
        </div>

        <div className={styles.actions}>
          <Link href={`/account/orders/${order.id}`} className={styles.viewBtn}>
            VIEW ORDER
          </Link>
          {canTrack && (
            onTrackOrder ? (
              <button
                type="button"
                className={styles.trackBtn}
                onClick={() => onTrackOrder(order)}
              >
                TRACK ORDER
              </button>
            ) : (
              <Link
                href={`/track-order?orderId=${encodeURIComponent(order.id)}`}
                className={styles.trackBtn}
              >
                TRACK ORDER
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
