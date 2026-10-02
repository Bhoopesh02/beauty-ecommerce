import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './not-found.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';

export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className="container animate-fade-in">
        <div className={styles.content}>
          <div className={styles.icon} style={{ position: 'relative', width: '200px', height: '200px', marginBottom: '2rem', borderRadius: '50%', overflow: 'hidden' }}>
            <Image src="/images/stock/decorative/404.webp" alt="Delicate Botanical Sprig" fill style={{objectFit: 'cover'}} />
          </div>
          
          <SectionHeading centered>
            NOTHING HERE, FOR NOW.
          </SectionHeading>
          
          <p className={styles.subtitle}>
            The page you&apos;re looking for may have moved or doesn&apos;t exist.
          </p>
          
          <div className={styles.actions}>
            <Link href="/">
              <Button variant="outline">GO HOME</Button>
            </Link>
            <Link href="/products">
              <Button variant="primary">SHOP PRODUCTS</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
