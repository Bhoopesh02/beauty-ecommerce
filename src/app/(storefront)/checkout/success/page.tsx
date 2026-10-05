'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Button from '@/components/Button';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import { formatPrice } from '@/utils/orderUtils';

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get('orderId') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [fallbackId] = useState(() => 'DR-' + Math.floor(100000 + Math.random() * 900000));

  useEffect(() => {
    if (queryOrderId) {
      orderService.getOrderById(queryOrderId).then((found) => {
        if (found) {
          setOrder(found);
        }
      });
    } else {
      orderService.getLatestOrder().then((latest) => {
        if (latest) {
          setOrder(latest);
        }
      });
    }
  }, [queryOrderId]);

  const displayId = order?.id || queryOrderId || fallbackId;
  const displayTotal = order ? formatPrice(order.total) : '₹1,650';

  return (
    <div className={styles.container}>
      <div className="container animate-fade-in">
        <div className={styles.content}>
          <div
            className={styles.icon}
            style={{
              position: 'relative',
              width: '200px',
              height: '200px',
              marginBottom: '1.5rem',
              borderRadius: '50%',
              overflow: 'hidden',
              padding: 0,
              border: 'none',
              background: 'transparent'
            }}
          >
            <Image
              src="/images/stock/decorative/success-4k.webp"
              alt="Checkout Success"
              fill
              unoptimized
              style={{ objectFit: 'cover' }}
            />
          </div>

          <h1 className={styles.title}>ORDER CONFIRMED</h1>
          <p className={styles.subtitle}>Thank you for choosing DERRUME.</p>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Order ID</span>
              <span className={styles.detailValue} style={{ fontWeight: 700 }}>
                {displayId}
              </span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Estimated Delivery</span>
              <span className={styles.detailValue}>2-4 Business Days</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Total</span>
              <span className={styles.detailValue}>{displayTotal}</span>
            </div>
            {order?.trackingNumber && (
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Courier AWB</span>
                <span className={styles.detailValue} style={{ fontSize: '0.8125rem' }}>
                  {order.trackingNumber}
                </span>
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            We&apos;ve sent a confirmation email with your invoice and dispatch timeline.
          </p>

          <div className={styles.actions} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link href={`/track-order?orderId=${encodeURIComponent(displayId)}`}>
              <Button variant="primary">TRACK ORDER</Button>
            </Link>
            <Link href={`/account/orders/${encodeURIComponent(displayId)}`}>
              <Button variant="outline">VIEW ORDER</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline">CONTINUE SHOPPING</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.container}>
          <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h2>Loading order confirmation...</h2>
          </div>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
