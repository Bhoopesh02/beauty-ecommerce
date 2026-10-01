"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin-layout.module.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className={`${inter.className} ${styles.adminRoot}`}>
        {children}
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
    { name: "Products", href: "/admin/products", icon: "📦" },
    { name: "Orders", href: "/admin/orders", icon: "🛍️" },
    { name: "Customers", href: "/admin/customers", icon: "👥" },
    { name: "Settings", href: "/admin/settings", icon: "⚙️" },
  ];

  return (
    <div className={`${inter.className} ${styles.adminRoot}`}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h2>DERRUME Admin</h2>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navItem} ${
                pathname.startsWith(item.href) ? styles.active : ""
              }`}
            >
              <span className={styles.icon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className={styles.logoutContainer}>
          <Link href="/admin/login" className={styles.logoutBtn}>
            <span className={styles.icon}>🚪</span>
            Logout
          </Link>
        </div>
      </aside>
      
      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <h1>{navItems.find((i) => pathname.startsWith(i.href))?.name || "Admin"}</h1>
          </div>
          <div className={styles.userMenu}>
            <div className={styles.avatar}>A</div>
            <span>Admin User</span>
          </div>
        </header>
        <main className={styles.contentArea}>{children}</main>
      </div>
    </div>
  );
}
