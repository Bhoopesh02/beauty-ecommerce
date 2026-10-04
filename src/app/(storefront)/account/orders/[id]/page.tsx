'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { ArrowLeft, Check } from 'lucide-react';
import Button from '@/components/Button';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService.getOrderById(id).then(fetched => {
      setOrder(fetched);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className={styles.container}><div className="container" style={{padding: '100px 0', textAlign: 'center'}}>Loading order details...</div></div>;
  }
  
  if (!order) {
    notFound();
  }

  const allStatuses = ['Placed', 'Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];
  const currentIndex = allStatuses.indexOf(order.orderStatus);
  
  const statuses = allStatuses.map((s, idx) => ({
    label: s,
    date: idx === 0 ? new Date(order.createdAt).toLocaleString() : '',
    completed: idx <= currentIndex && order.orderStatus !== 'Cancelled',
    active: idx === currentIndex && order.orderStatus !== 'Cancelled'
  }));

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.header}>
        <Link href="/account/orders" className={styles.backLink}>
          <ArrowLeft size={16} /> BACK TO ORDERS
        </Link>
        <div>
          <h1>ORDER {order.id}</h1>
          <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.mainCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Tracking</h2>
            <div className={styles.timeline}>
              {statuses.filter(s => order.orderStatus === 'Cancelled' ? s.label === 'Placed' || s.label === 'Cancelled' : s.label !== 'Cancelled').map((status) => (
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
              {order.items.map((item, idx) => (
                <div key={idx} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.image && (
                      <Image src={item.image} alt={item.name} fill style={{objectFit: 'cover'}} />
                    )}
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    {item.size && <div className={styles.itemVariant}>{item.size}</div>}
                    <div className={styles.itemMeta}>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sideCol}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>₹{order.shipping.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Discount</span>
                <span>₹{order.discount.toFixed(2)}</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>₹{order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Delivery Information</h2>
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Shipping Address</div>
              <div className={styles.infoValue}>
                {order.shippingAddress.fullName}<br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.landmark && <>{order.shippingAddress.landmark}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}<br />
              </div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Contact</div>
              <div className={styles.infoValue}>
                {order.shippingAddress.phone}<br />
              </div>
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.infoLabel}>Payment Method</div>
              <div className={styles.infoValue}>
                {order.paymentMethod === 'card' ? 'Credit/Debit Card' : order.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}
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
