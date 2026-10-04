"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../products/products.module.css";
import { orderService } from "@/services/orderService";
import { Order, OrderStatus } from "@/types";

export default function AdminOrderDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<OrderStatus>("Placed");

  useEffect(() => {
    orderService.getOrderById(id).then(fetched => {
      if (fetched) {
        setOrder(fetched);
        setStatus(fetched.orderStatus);
      }
      setLoading(false);
    });
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!order) return;
    setSaving(true);
    const updated = await orderService.updateOrderStatus(order.id, status);
    if (updated) setOrder(updated);
    setSaving(false);
  };

  if (loading) {
    return <div className={styles.container} style={{padding: '100px 0', textAlign: 'center'}}>Loading order details...</div>;
  }

  if (!order) {
    notFound();
  }

  const statusOptions: OrderStatus[] = [
    "Placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/admin/orders" className={styles.editBtn}>
            &larr; Back
          </Link>
          <h2 style={{ margin: 0 }}>Order {order.id}</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className={styles.filterSelect}
          >
            {statusOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button 
            className={styles.addBtn} 
            onClick={handleUpdateStatus} 
            disabled={saving || status === order.orderStatus}
            style={{ opacity: (saving || status === order.orderStatus) ? 0.5 : 1 }}
          >
            {saving ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        <div className={styles.tableCard}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: 0, fontSize: '1.125rem' }}>Items</h3>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className={styles.productName}>{item.name}</div>
                    {item.size && <div className={styles.productType}>{item.size}</div>}
                  </td>
                  <td>₹{item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>Subtotal</td>
                <td style={{ fontWeight: 600 }}>₹{order.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>Shipping</td>
                <td style={{ fontWeight: 600 }}>₹{order.shipping.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>Total</td>
                <td style={{ fontWeight: 700, fontSize: '1.125rem' }}>₹{order.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className={styles.tableCard} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem' }}>Customer</h3>
            <p style={{ margin: '0 0 8px 0', fontWeight: 500 }}>{order.shippingAddress.fullName}</p>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>{order.shippingAddress.phone}</p>
            <p style={{ margin: '0', fontSize: '0.875rem' }}>{order.userId === 'guest' ? 'Guest Customer' : order.userId}</p>
          </div>

          <div className={styles.tableCard} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem' }}>Shipping Address</h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>{order.shippingAddress.address}</p>
            {order.shippingAddress.landmark && <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>{order.shippingAddress.landmark}</p>}
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
          </div>
          
          <div className={styles.tableCard} style={{ padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.125rem' }}>Payment</h3>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>Method: <span style={{ textTransform: 'uppercase' }}>{order.paymentMethod}</span></p>
            <p style={{ margin: '0 0 4px 0', fontSize: '0.875rem' }}>Status: <span className={styles.statusBadge}>{order.paymentStatus}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
