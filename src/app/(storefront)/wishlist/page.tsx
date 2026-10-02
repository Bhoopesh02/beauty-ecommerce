'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';

const initialWishlist = [
  {
    id: 'prod-1',
    name: 'Radiance Face Oil',
    price: 85,
    category: 'Face',
    image: '/images/products/Hydraglow-Moisturizer.webp',
    isNew: true
  },
  {
    id: 'prod-3',
    name: 'Rosewater Mist',
    price: 40,
    category: 'Face',
    image: '/images/products/Rose-Water-Face-Mist.webp',
    isNew: false
  }
];

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState(initialWishlist);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const handleAddToBag = (product: typeof initialWishlist[number]) => {
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      variant: 'default',
      quantity: 1,
      image: product.image,
    };
    const cart = JSON.parse(localStorage.getItem('derrume_cart') || '[]');
    const existing = cart.find(
      (i: { id: string; variant: string }) =>
        i.id === item.id && i.variant === item.variant
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(item);
    }
    localStorage.setItem('derrume_cart', JSON.stringify(cart));

    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className="container animate-fade-in">
          <div className={styles.emptyState}>
            <SectionHeading centered subtitle="YOUR WISHLIST IS WAITING">
              MY WISHLIST
            </SectionHeading>
            <p>Save products you love and return to them anytime.</p>
            <Link href="/shop">
              <Button variant="primary">EXPLORE PRODUCTS</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className="container animate-fade-in">
        <div className={styles.header}>
          <SectionHeading centered>MY WISHLIST</SectionHeading>
        </div>

        <div className={styles.grid}>
          {wishlistItems.map(product => (
            <div key={product.id} style={{ position: 'relative' }}>
              <ProductCard
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  category: product.category,
                  image: product.image,
                  type: product.category,
                  slug: product.id
                }}
              />
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="primary"
                  style={{ flex: 1 }}
                  onClick={() => handleAddToBag(product)}
                >
                  {addedIds.has(product.id) ? '✓ ADDED' : 'ADD TO BAG'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setWishlistItems(wishlistItems.filter(item => item.id !== product.id))}
                >
                  REMOVE
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

