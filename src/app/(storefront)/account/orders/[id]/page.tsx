import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { ArrowLeft, Check } from 'lucide-react';
import Button from '@/components/Button';

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const statuses = [
    { label: 'PLACED', date: 'Oct 1, 2026, 10:00 AM', completed: true },
    { label: 'CONFIRMED', date: 'Oct 1, 2026, 11:30 AM', completed: true },
    { label: 'PACKED', date: 'Oct 2, 2026, 09:15 AM', completed: true },
    { label: 'SHIPPED', date: 'Oct 2, 2026, 02:45 PM', completed: false, active: true },
    { label: 'OUT FOR DELIVERY', date: '', completed: false },
    { label: 'DELIVERED', date: '', completed: false }
  ];

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.header}>
        <Link href="/account/orders" className={styles.backLink}>
          <ArrowLeft size={16} /> BACK TO ORDERS
        </Link>
        <div>
          <h1>ORDER {params.id}</h1>
          <p>Placed on October 1, 2026</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Tracking</h2>
            <div className={styles.timeline}>
              {statuses.map((status, idx) => (
                <div key={status.label} className={styles.timelineStep}>
                  <div className={`${styles.stepIcon} ${status.completed ? styles.completed : ''} ${status.active ? styles.active : ''}`}>
                    {status.completed && <Check size={12} strokeWidth={3} />}
                  </div>
                  <div className={styles.stepContent}>
                    <div className={`${styles.stepTitle} ${status.completed ? styles.completed : ''} ${status.active ? styles.active : ''}`}>
                      {status.label}
                    </div>
                    {status.date && <div className={styles.stepDate}>{status.date}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Items in your order</h2>
            <div className={styles.items}>
              <div className={styles.item}>
                <div className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>Botanical Cleanser</div>
                  <div className={styles.itemVariant}>100ml</div>
                  <div className={styles.itemMeta}>
                    <span>Qty: 2</span>
                    <span>$80.00</span>
                  </div>
                </div>
              </div>
              <div className={styles.item}>
                <div className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>Rosewater Mist</div>
                  <div className={styles.itemVariant}>50ml</div>
                  <div className={styles.itemMeta}>
                    <span>Qty: 1</span>
                    <span>$40.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>$120.00</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span>$0.00</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>$120.00</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Information</h2>
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Shipping Address</div>
              <div className={styles.infoValue}>
                Jane Doe<br />
                123 Main Street<br />
                Apt 4B<br />
                New York, NY 10001<br />
                United States
              </div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Contact</div>
              <div className={styles.infoValue}>
                +1 234 567 8900<br />
                jane@example.com
              </div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Payment Method</div>
              <div className={styles.infoValue}>
                Credit Card ending in •••• 4242
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Link href="/contact" style={{ width: '100%' }}>
              <Button variant="outline" fullWidth>CONTACT SUPPORT</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
