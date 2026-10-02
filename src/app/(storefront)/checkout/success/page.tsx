import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { Check } from 'lucide-react';
import Button from '@/components/Button';

export default function CheckoutSuccessPage() {
  const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  return (
    <div className={styles.container}>
      <div className="container animate-fade-in">
        <div className={styles.content}>
          <div className={styles.icon} style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '1.5rem', borderRadius: '50%', overflow: 'hidden', padding: 0, border: 'none', background: 'transparent' }}>
            <Image src="/images/stock/decorative/success.webp" alt="Checkout Success" fill style={{objectFit: 'cover'}} />
          </div>

          <h1 className={styles.title}>ORDER CONFIRMED</h1>
          <p className={styles.subtitle}>Thank you for choosing DERRUME.</p>

          <div className={styles.details}>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Order ID</span>
              <span className={styles.detailValue}>{orderId}</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Estimated Delivery</span>
              <span className={styles.detailValue}>3-5 Business Days</span>
            </div>
            <div className={styles.detailRow}>
              <span className={styles.detailLabel}>Total</span>
              <span className={styles.detailValue}>$165.00</span>
            </div>
          </div>

          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            We&apos;ve sent a confirmation email to you with the order details.
          </p>

          <div className={styles.actions}>
            <Link href={`/account/orders/${orderId}`}>
              <Button variant="outline">VIEW ORDER</Button>
            </Link>
            <Link href="/shop">
              <Button variant="primary">CONTINUE SHOPPING</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
