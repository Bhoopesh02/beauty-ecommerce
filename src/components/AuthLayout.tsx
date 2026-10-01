import React from 'react';
import styles from './AuthLayout.module.css';
import Link from 'next/link';
import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.mobileImage} />
      <div className={styles.content}>
        <div className={styles.imageSection}>
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Image src="/images/stock/auth/auth-side.webp" alt="Botanical still life" fill style={{objectFit: 'cover'}} priority />
          </div>
        </div>
        <div className={styles.formSection}>
          <div className={`${styles.formContainer} animate-fade-in`}>
            <div className={styles.brandName}>
              <Link href="/">DERRUME</Link>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
