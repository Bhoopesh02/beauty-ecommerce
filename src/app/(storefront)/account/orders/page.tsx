import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import Button from '@/components/Button';

const mockOrders = [
  {
    id: 'ORD-583920',
    date: 'October 1, 2026',
    status: 'DELIVERED',
    total: 85.00,
    items: [
      { name: 'Radiance Face Oil', quantity: 1, image: '' }
    ]
  },
  {
    id: 'ORD-492811',
    date: 'September 15, 2026',
    status: 'SHIPPED',
    total: 120.00,
    items: [
      { name: 'Botanical Cleanser', quantity: 2, image: '' },
      { name: 'Rosewater Mist', quantity: 1, image: '' }
    ]
  }
];

export default function OrdersPage() {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'PLACED':
      case 'CONFIRMED': return styles.statusConfirmed;
      case 'PACKED':
      case 'SHIPPED':
      case 'OUT FOR DELIVERY': return styles.statusShipped;
      case 'DELIVERED': return styles.statusDelivered;
      case 'CANCELLED': return styles.statusCancelled;
      default: return styles.statusConfirmed;
    }
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.header}>
        <h1>MY ORDERS</h1>
        <p>View your order history and track shipments.</p>
      </div>

      <div className={styles.orderList}>
        {mockOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven&apos;t placed any orders yet.</p>
            <Link href="/shop">
              <Button variant="primary">START SHOPPING</Button>
            </Link>
          </div>
        ) : (
          mockOrders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <h3 className={styles.orderId}>{order.id}</h3>
                  <div className={styles.orderDate}>Placed on {order.date}</div>
                </div>
                <div className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                  {order.status}
                </div>
              </div>

              <div className={styles.orderContent}>
                <div className={styles.orderPreview}>
                  {/* Placeholder for order item image */}
                  <div className={styles.previewImage} />
                  <div className={styles.previewInfo}>
                    <div className={styles.previewName}>{order.items[0].name}</div>
                    {order.items.length > 1 && (
                      <div className={styles.previewMore}>+ {order.items.length - 1} more item(s)</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.orderTotal}>
                  Total: ${order.total.toFixed(2)}
                </div>
                <Link href={`/account/orders/${order.id}`}>
                  <Button variant="outline">VIEW DETAILS</Button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
