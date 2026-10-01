'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AccountSidebar.module.css';
import { LogOut } from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/account' },
  { label: 'Profile', href: '/account/profile' },
  { label: 'Orders', href: '/account/orders' },
  { label: 'Addresses', href: '/account/addresses' },
  { label: 'Wishlist', href: '/wishlist' },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.title}>MY ACCOUNT</h2>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/account' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.link} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          );
        })}
        <button 
          className={`${styles.link} ${styles.logout}`}
          onClick={() => {
            window.location.href = '/login';
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LogOut size={16} /> Logout
          </span>
        </button>
      </nav>
    </aside>
  );
}
