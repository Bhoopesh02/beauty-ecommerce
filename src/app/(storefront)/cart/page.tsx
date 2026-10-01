'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import { Minus, Plus } from 'lucide-react';

const initialCart = [
  {
    id: '1',
    name: 'Radiance Face Oil',
    price: 85.00,
    variant: '30ml',
    quantity: 1,
    image: ''
  },
  {
    id: '2',
    name: 'Botanical Cleanser',
    price: 40.00,
    variant: '100ml',
    quantity: 2,
    image: ''
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const cart = JSON.parse(localStorage.getItem('derrume_cart') || '[]');
    setCartItems(cart);
  }, []);

  const handleUpdateQuantity = (id: string, variant: string, delta: number) => {
    const updated = cartItems.map(item => {
      if (item.id === id && item.variant === variant) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem('derrume_cart', JSON.stringify(updated));
  };

  const handleRemove = (id: string, variant: string) => {
    const updated = cartItems.filter(item => !(item.id === id && item.variant === variant));
    setCartItems(updated);
    localStorage.setItem('derrume_cart', JSON.stringify(updated));
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (!isClient) return null;

  if (cartItems.length === 0) {
    return (
      <div className={styles.container}>
        <div className="container animate-fade-in">
          <div className={styles.emptyState}>
            <SectionHeading centered subtitle="YOUR BAG IS WAITING">
              YOUR BAG
            </SectionHeading>
            <p>Discover something beautiful for your daily ritual.</p>
            <Link href="/products">
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
          <SectionHeading centered>YOUR BAG</SectionHeading>
        </div>

        <div className={styles.content}>
          <div className={styles.items}>
            {cartItems.map((item, index) => (
              <div key={`${item.id}-${item.variant}-${index}`} className={styles.item}>
                <div className={styles.itemImage} />
                <div className={styles.itemInfo}>
                  <div>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <div className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div className={styles.itemVariant}>{item.variant}</div>
                  </div>
                  
                  <div className={styles.itemActions}>
                    <div className={styles.quantity}>
                      <button 
                        className={styles.quantityBtn} 
                        onClick={() => handleUpdateQuantity(item.id, item.variant, -1)}
                      >
                        <Minus size={14} />
                      </button>
                      <div className={styles.quantityValue}>{item.quantity}</div>
                      <button 
                        className={styles.quantityBtn} 
                        onClick={() => handleUpdateQuantity(item.id, item.variant, 1)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item.id, item.variant)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.summaryTitle}>ORDER SUMMARY</h2>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Link href="/checkout">
                <Button variant="primary" fullWidth>PROCEED TO CHECKOUT</Button>
              </Link>
              <Link href="/products">
                <Button variant="outline" fullWidth>CONTINUE SHOPPING</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
