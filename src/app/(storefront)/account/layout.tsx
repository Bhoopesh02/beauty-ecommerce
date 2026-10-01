import React from 'react';
import styles from './layout.module.css';
import AccountSidebar from '@/components/AccountSidebar';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <div className="container">
        <div className={styles.content}>
          <AccountSidebar />
          <main className={styles.main}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
