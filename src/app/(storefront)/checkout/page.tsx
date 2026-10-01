'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/Button';
import { Lock } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
    const mode = searchParams.get('mode');
    if (mode === 'buy-now') {
      const buyNowItem = JSON.parse(localStorage.getItem('derrume_buynow') || '{}');
      if (buyNowItem && buyNowItem.productId) {
        setItems([{ ...buyNowItem, id: buyNowItem.productId }]);
      }
    } else {
      const cart = JSON.parse(localStorage.getItem('derrume_cart') || '[]');
      setItems(cart);
    }
  }, [searchParams]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    router.push('/checkout/success');
  };

  if (!isClient) return null;

  return (
    <div className={styles.container}>
      <div className="container animate-fade-in">
        <div className={styles.brandHeader}>
          <Link href="/">DERRUME</Link>
        </div>

        <form className={styles.content} onSubmit={handleSubmit}>
          <div className={styles.mainCol}>
            
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>Contact</h2>
                <div className={styles.loginLink}>
                  Have an account? <Link href="/login">Log in</Link>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input 
                  type="email" id="email" required 
                  className={styles.input} 
                  value={formData.email} onChange={handleChange} 
                />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Shipping Address</h2>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" id="firstName" required 
                    className={styles.input} 
                    value={formData.firstName} onChange={handleChange} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" id="lastName" required 
                    className={styles.input} 
                    value={formData.lastName} onChange={handleChange} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <input 
                  type="text" id="address" required 
                  className={styles.input} 
                  value={formData.address} onChange={handleChange} 
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="apartment">Apartment, suite, etc. (optional)</label>
                <input 
                  type="text" id="apartment" 
                  className={styles.input} 
                  value={formData.apartment} onChange={handleChange} 
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" id="city" required 
                    className={styles.input} 
                    value={formData.city} onChange={handleChange} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="state">State</label>
                  <input 
                    type="text" id="state" required 
                    className={styles.input} 
                    value={formData.state} onChange={handleChange} 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="pincode">Pincode</label>
                  <input 
                    type="text" id="pincode" required 
                    className={styles.input} 
                    value={formData.pincode} onChange={handleChange} 
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input 
                  type="tel" id="phone" required 
                  className={styles.input} 
                  value={formData.phone} onChange={handleChange} 
                />
              </div>
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment</h2>
              <div className={styles.paymentBox}>
                <Lock size={24} style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }} />
                <p>This is a secure 128-bit SSL encrypted payment.</p>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                  (Payment integration placeholder. In a real app, Stripe or Razorpay would be mounted here.)
                </div>
              </div>
            </section>

            <div style={{ marginTop: '1rem' }}>
              <Button type="submit" variant="primary" fullWidth disabled={isSubmitting}>
                {isSubmitting ? 'PROCESSING...' : 'PAY NOW'}
              </Button>
            </div>
          </div>

          <div className={styles.sideCol}>
            <div className={styles.summaryItems}>
              {items.map((item, index) => (
                <div key={index} className={styles.summaryItem}>
                  <div className={styles.itemImage}>
                    <div className={styles.itemBadge}>{item.quantity}</div>
                  </div>
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>{item.name}</div>
                    <div className={styles.itemVariant}>{item.variant || item.size}</div>
                  </div>
                  <div className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className={styles.summaryTotalRow}>
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
