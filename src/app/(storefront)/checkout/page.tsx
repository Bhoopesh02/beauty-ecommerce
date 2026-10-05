'use client';

import React, { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Button from '@/components/Button';
import { Lock } from 'lucide-react';
import { checkoutService } from '@/services/checkoutService';
import { cartService } from '@/services/cartService';
import { orderService } from '@/services/orderService';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

function CheckoutContent() {
  const router = useRouter();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const mode = checkoutService.getCheckoutMode();
    if (mode === 'buy-now') {
      setItems(checkoutService.getCheckoutItems());
    } else {
      cartService.getCart().then(setItems);
    }
  }, []);

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
    phone: '',
    paymentMethod: 'card'
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || prev.email,
        firstName: user.name.split(' ')[0] || prev.firstName,
        lastName: user.name.split(' ').slice(1).join(' ') || prev.lastName,
        phone: user.phone || prev.phone
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const mode = checkoutService.getCheckoutMode();
    
    try {
      const created = await orderService.createOrder({
        userId: user?.id || 'guest',
        items: items,
        total: subtotal,
        subtotal: subtotal,
        shipping: 0,
        discount: 0,
        paymentStatus: 'Pending',
        shippingAddress: {
          id: `addr-${Date.now()}`,
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.address,
          landmark: formData.apartment,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          type: 'home',
          isDefault: false
        },
        paymentMethod: formData.paymentMethod as any
      });

      if (mode !== 'buy-now') {
        await cartService.clearCart();
        await refreshCart();
      }
      checkoutService.clearCheckout();
      
      router.push(`/checkout/success?orderId=${encodeURIComponent(created.id)}`);
    } catch (err) {
      alert("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (!isClient) return null;

  if (items.length === 0) {
    return (
      <div className={styles.container}>
        <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Your checkout is empty</h2>
          <p style={{ margin: '1rem 0' }}>Add items to your cart or use Buy Now to checkout.</p>
          <Link href="/products">
            <Button variant="primary">CONTINUE SHOPPING</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                {!user && (
                  <div className={styles.loginLink}>
                    Have an account? <Link href="/login">Log in</Link>
                  </div>
                )}
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
              <div className={styles.formGroup} style={{marginBottom: '1rem'}}>
                <label htmlFor="paymentMethod">Select Payment Method</label>
                <select 
                  id="paymentMethod" 
                  className={styles.input} 
                  value={formData.paymentMethod} 
                  onChange={handleChange}
                  style={{ appearance: 'auto' }}
                >
                  <option value="card">Credit / Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
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
                  <div className={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className={styles.summaryTotals}>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <div className={styles.summaryTotalRow}>
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className={styles.container}><div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Loading checkout...</div></div>}>
      <CheckoutContent />
    </Suspense>
  );
}

