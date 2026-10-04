'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import { Minus, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { cartService } from '@/services/cartService';
import { checkoutService } from '@/services/checkoutService';
import { productService } from '@/services/productService';
import { Product } from '@/types';

export default function CartPage() {
  const { cart, loading, refreshCart, subtotal } = useCart();
  const [productsCache, setProductsCache] = useState<Record<string, Product>>({});
  const router = useRouter();

  useEffect(() => {
    productService.getProducts().then(products => {
      const cache: Record<string, Product> = {};
      products.forEach(p => { cache[p.id] = p; });
      setProductsCache(cache);
    });
  }, []);

  const handleUpdateQuantity = async (productId: string, variantId: string | undefined, delta: number, currentQty: number) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    
    // Check stock
    const product = productsCache[productId];
    if (product) {
      const variant = product.variants?.find(v => v.id === variantId);
      const stock = variant ? variant.stock : product.stock;
      if (newQty > stock) {
        alert("Cannot add more than available stock.");
        return;
      }
    }
    
    await cartService.updateQuantity(productId, variantId, newQty);
    await refreshCart();
  };

  const handleRemove = async (productId: string, variantId: string | undefined) => {
    await cartService.removeFromCart(productId, variantId);
    await refreshCart();
  };
  
  const handleClear = async () => {
    await cartService.clearCart();
    await refreshCart();
  };

  const handleProceedToCheckout = () => {
    checkoutService.setCheckoutItems(cart, "cart");
    router.push("/checkout");
  };

  if (loading) return null;

  if (cart.length === 0) {
    return (
      <div className={styles.container}>
        <div className="container animate-fade-in">
          <div className={styles.emptyState}>
            <SectionHeading centered subtitle="YOUR BAG IS WAITING">
              YOUR BAG IS EMPTY
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
          <button className={styles.removeBtn} onClick={handleClear} style={{marginTop: '1rem'}}>
            Clear Bag
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.items}>
            {cart.map((item, index) => (
              <div key={`${item.productId}-${item.variantId}-${index}`} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.image && (
                    <Image src={item.image} alt={item.name} width={100} height={100} style={{objectFit: 'cover'}} />
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <div>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>
                        <Link href={`/products/${productsCache[item.productId]?.slug || ''}`}>{item.name}</Link>
                      </h3>
                      <div className={styles.itemPrice}>₹{(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    {item.size && <div className={styles.itemVariant}>{item.size}</div>}
                  </div>
                  
                  <div className={styles.itemActions}>
                    <div className={styles.quantity}>
                      <button 
                        className={styles.quantityBtn} 
                        onClick={() => handleUpdateQuantity(item.productId, item.variantId, -1, item.quantity)}
                      >
                        <Minus size={14} />
                      </button>
                      <div className={styles.quantityValue}>{item.quantity}</div>
                      <button 
                        className={styles.quantityBtn} 
                        onClick={() => handleUpdateQuantity(item.productId, item.variantId, 1, item.quantity)}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    
                    <button 
                      className={styles.removeBtn}
                      onClick={() => handleRemove(item.productId, item.variantId)}
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
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            
            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Button variant="primary" fullWidth onClick={handleProceedToCheckout}>
                PROCEED TO CHECKOUT
              </Button>
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
