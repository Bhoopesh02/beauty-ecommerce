import React from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import { Package, Heart, MapPin, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'My Account | DERRUME',
  description: 'Manage your DERRUME account.',
};

export default function AccountDashboard() {
  return (
    <div className={`${styles.dashboard} animate-fade-in`}>
      <div className={styles.welcome}>
        <h1>WELCOME BACK</h1>
        <p>Manage your orders, profile, and preferences.</p>
      </div>

      <div className={styles.grid}>
        <Link href="/account/orders" className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <Package size={20} />
            </div>
            <h3>Orders</h3>
          </div>
          <div className={styles.cardContent}>
            View your order history, track recent shipments, and manage returns.
          </div>
          <div className={styles.cardAction}>
            VIEW ORDERS <ArrowRight size={16} />
          </div>
        </Link>

        <Link href="/account/profile" className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <User size={20} />
            </div>
            <h3>Profile</h3>
          </div>
          <div className={styles.cardContent}>
            Manage your personal information, email address, and password.
          </div>
          <div className={styles.cardAction}>
            MANAGE PROFILE <ArrowRight size={16} />
          </div>
        </Link>

        <Link href="/account/addresses" className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <MapPin size={20} />
            </div>
            <h3>Addresses</h3>
          </div>
          <div className={styles.cardContent}>
            Save and edit shipping addresses for faster checkout.
          </div>
          <div className={styles.cardAction}>
            MANAGE ADDRESSES <ArrowRight size={16} />
          </div>
        </Link>

        <Link href="/wishlist" className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon}>
              <Heart size={20} />
            </div>
            <h3>Wishlist</h3>
          </div>
          <div className={styles.cardContent}>
            Review your saved products and move them to your bag.
          </div>
          <div className={styles.cardAction}>
            VIEW WISHLIST <ArrowRight size={16} />
          </div>
        </Link>
      </div>
    </div>
  );
}
