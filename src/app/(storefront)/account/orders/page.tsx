'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import Button from '@/components/Button';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import { useAuth } from '@/hooks/useAuth';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      orderService.getOrdersByUser(user.id).then((userOrders: Order[]) => {
        setOrders(userOrders.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Placed':
      case 'Confirmed': return styles.statusConfirmed;
      case 'Packed':
      case 'Shipped':
      case 'Out for Delivery': return styles.statusShipped;
      case 'Delivered': return styles.statusDelivered;
      case 'Cancelled': return styles.statusCancelled;
      default: return styles.statusConfirmed;
    }
  };

  if (loading) {
    return <div className={styles.container}><div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading orders...</div></div>;
  }

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.header}>
        <h1>MY ORDERS</h1>
        <p>View your order history and track shipments.</p>
      </div>

      <div className={styles.orderList}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't placed any orders yet.</p>
            <Link href="/products">
              <Button variant="primary">START SHOPPING</Button>
            </Link>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div>
                  <h3 className={styles.orderId}>{order.id}</h3>
                  <div className={styles.orderDate}>Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
                <div className={`${styles.orderStatus} ${getStatusClass(order.orderStatus)}`}>
                  {order.orderStatus}
                </div>
              </div>

              <div className={styles.orderContent}>
                <div className={styles.orderPreview}>
                  <div className={styles.previewImage}>
                    {order.items[0]?.image && (
                      <Image src={order.items[0].image} alt={order.items[0].name} fill style={{objectFit: 'cover'}} />
                    )}
                  </div>
                  <div className={styles.previewInfo}>
                    <div className={styles.previewName}>{order.items[0]?.name}</div>
                    {order.items.length > 1 && (
                      <div className={styles.previewMore}>+ {order.items.length - 1} more item(s)</div>
                    )}
                  </div>
                </div>
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.orderTotal}>
                  Total: ₹{order.total.toFixed(2)}
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
