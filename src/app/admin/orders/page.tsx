"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../products/products.module.css";
import { orderService } from "@/services/orderService";
import { Order } from "@/types";

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    orderService.getOrders().then(fetchedOrders => {
      setOrders(fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setLoading(false);
    });
  }, []);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className={styles.container} style={{padding: '100px 0', textAlign: 'center'}}>Loading orders...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Search orders..." 
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.desktopView}>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th className={styles.actionsHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td className={styles.cellBold}>{order.id}</td>
                  <td>
                    <div className={styles.productName}>{order.shippingAddress.fullName}</div>
                    <div className={styles.productType}>{order.shippingAddress.phone}</div>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className={styles.productPrice}>₹{order.total.toFixed(2)}</td>
                  <td>
                    <span className={styles.statusBadge}>{order.orderStatus}</span>
                  </td>
                  <td className={styles.actionsCell}>
                    <Link href={`/admin/orders/${order.id}`} className={styles.editBtn}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className={styles.mobileView}>
        {filteredOrders.map(order => (
          <div key={order.id} className={styles.mobileCard}>
            <div className={styles.mobileCardHeader}>
              <div className={styles.mobileCardInfo}>
                <h4 className={styles.productName}>{order.id}</h4>
                <p className={styles.productCategory}>{order.shippingAddress.fullName}</p>
                <p className={styles.productCategory}>{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className={styles.mobileCardDetails}>
              <span className={styles.mobileCardPrice}>₹{order.total.toFixed(2)}</span>
              <span className={styles.statusBadge}>{order.orderStatus}</span>
            </div>
            <div className={styles.mobileCardActions}>
              <Link href={`/admin/orders/${order.id}`} className={styles.mobileEditBtn}>
                View Order
              </Link>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className={styles.emptyStateMobile}>
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}
