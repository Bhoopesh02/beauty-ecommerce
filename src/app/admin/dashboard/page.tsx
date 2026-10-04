'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./dashboard.module.css";
import { productService } from "@/services/productService";
import { Product } from "@/types";

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      productService.getProducts(),
      import('@/services/orderService').then(m => m.orderService.getOrders()),
      import('@/services/authService').then(m => m.authService.getCustomers())
    ]).then(([fetchedProducts, fetchedOrders, fetchedCustomers]) => {
      setProducts(fetchedProducts);
      setOrders(fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      setCustomers(fetchedCustomers);
      setLoading(false);
    });
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  // Stats
  const stats = [
    { label: "Total Revenue", value: `₹${totalRevenue.toFixed(0)}`, trend: "+12.5%", isPositive: true },
    { label: "Total Orders", value: orders.length.toString(), trend: "+8.2%", isPositive: true },
    { label: "Total Customers", value: customers.length.toString(), trend: "+4.1%", isPositive: true },
    { label: "Total Products", value: products.length.toString(), trend: "+4.3%", isPositive: true },
  ];

  const recentOrders = orders.slice(0, 4);

  // Assuming stock < 10 as mock for low stock for now
  const lowStockProducts = products.filter(p => p.stock < 10);

  if (loading) {
    return <div className={styles.dashboard} style={{padding: '100px 0', textAlign: 'center'}}>Loading dashboard...</div>;
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <p className={styles.statLabel}>{stat.label}</p>
            <div className={styles.statValueWrapper}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <span className={`${styles.statTrend} ${stat.isPositive ? styles.positive : styles.negative}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.mainGrid}>
        <div className={styles.gridColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recent Orders</h3>
              <Link href="/admin/orders" className={styles.cardLink}>View All</Link>
            </div>
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order, i) => (
                    <tr key={i}>
                      <td className={styles.cellBold}>{order.id}</td>
                      <td>{order.shippingAddress.fullName}</td>
                      <td className={styles.cellMuted}>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className={styles.cellBold}>₹{order.total.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[`status${order.orderStatus}`]}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recent Products</h3>
              <Link href="/admin/products" className={styles.cardLink}>View All</Link>
            </div>
            <div className={styles.listContainer}>
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className={styles.listItem}>
                  <div className={styles.itemImagePlaceholder}></div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{product.name}</p>
                    <p className={styles.itemCategory}>{product.category}</p>
                  </div>
                  <div className={styles.itemPrice}>₹{product.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.sideColumn}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Low Stock Products</h3>
            </div>
            <div className={styles.listContainer}>
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className={styles.listItem}>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{product.name}</p>
                    <p className={styles.itemCategory}>ID: {product.id.substring(0,8)}</p>
                  </div>
                  <div className={styles.itemStockAlert}>
                    {product.stock} left
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div style={{padding: '1rem', color: 'var(--text-secondary)'}}>No low stock products.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
