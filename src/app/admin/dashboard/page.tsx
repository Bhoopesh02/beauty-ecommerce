import Link from "next/link";
import styles from "./dashboard.module.css";
import { products } from "@/data/products";

export default function AdminDashboard() {
  // Mock Data
  const stats = [
    { label: "Total Revenue", value: "₹45,231", trend: "+12.5%", isPositive: true },
    { label: "Total Orders", value: "156", trend: "+8.2%", isPositive: true },
    { label: "Total Customers", value: "2,401", trend: "-2.1%", isPositive: false },
    { label: "Total Products", value: products.length.toString(), trend: "+4.3%", isPositive: true },
  ];

  const recentOrders = [
    { id: "#ORD-001", customer: "Priya Sharma", date: "Today, 10:45 AM", total: "₹1,248", status: "Processing" },
    { id: "#ORD-002", customer: "Rahul Verma", date: "Today, 09:12 AM", total: "₹899", status: "Shipped" },
    { id: "#ORD-003", customer: "Anjali Desai", date: "Yesterday, 04:30 PM", total: "₹2,150", status: "Delivered" },
    { id: "#ORD-004", customer: "Vikram Singh", date: "Yesterday, 02:15 PM", total: "₹549", status: "Delivered" },
  ];

  // Assuming price < 600 as mock for low stock for now
  const lowStockProducts = products.filter(p => p.price < 600);

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
                      <td>{order.customer}</td>
                      <td className={styles.cellMuted}>{order.date}</td>
                      <td className={styles.cellBold}>{order.total}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[`status${order.status}`]}`}>
                          {order.status}
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
              {lowStockProducts.map((product) => (
                <div key={product.id} className={styles.listItem}>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{product.name}</p>
                    <p className={styles.itemCategory}>SKU: {product.slug.substring(0,8).toUpperCase()}</p>
                  </div>
                  <div className={styles.itemStockAlert}>
                    {Math.floor(Math.random() * 5) + 1} left
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
