'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';
import { useWishlist } from '@/hooks/useWishlist';
import { productService } from '@/services/productService';
import { cartService } from '@/services/cartService';
import { wishlistService } from '@/services/wishlistService';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';

export default function WishlistPage() {
  const { wishlist, loading, refreshWishlist } = useWishlist();
  const { refreshCart } = useCart();
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    productService.getProducts().then(products => {
      const filtered = products.filter(p => wishlist.includes(p.id));
      setWishlistProducts(filtered);
    });
  }, [wishlist]);

  const handleAddToBag = async (product: Product) => {
    const variantId = product.variants?.[0]?.id;
    const price = product.variants?.[0]?.price || product.price;
    const size = product.variants?.[0]?.size;
    const stock = product.variants?.[0]?.stock ?? product.stock;
    
    if (stock <= 0) return;

    await cartService.addToCart({
      productId: product.id,
      variantId,
      name: product.name,
      price: price,
      quantity: 1,
      image: product.images?.[0] || product.image || "",
      size
    });
    
    await refreshCart();

    setAddedIds((prev) => new Set(prev).add(product.id));
    setTimeout(() => {
      setAddedIds((prev) => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }, 1500);
  };
  
  const handleRemove = async (productId: string) => {
    await wishlistService.toggleWishlist(productId);
    await refreshWishlist();
  };

  if (loading) return null;

  if (wishlistProducts.length === 0) {
    return (
      <div className={styles.container}>
        <div className="container animate-fade-in">
          <div className={styles.emptyState}>
            <SectionHeading centered subtitle="YOUR WISHLIST IS WAITING">
              MY WISHLIST
            </SectionHeading>
            <p>Save products you love and return to them anytime.</p>
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
          <SectionHeading centered>MY WISHLIST</SectionHeading>
        </div>

        <div className={styles.grid}>
          {wishlistProducts.map(product => {
            const outOfStock = (product.stock || 0) <= 0;
            return (
              <div key={product.id} style={{ position: 'relative' }}>
                <ProductCard product={product} />
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <Button
                    variant="primary"
                    style={{ flex: 1 }}
                    onClick={() => handleAddToBag(product)}
                    disabled={outOfStock}
                  >
                    {addedIds.has(product.id) ? '✓ ADDED' : outOfStock ? 'UNAVAILABLE' : 'ADD TO BAG'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleRemove(product.id)}
                  >
                    REMOVE
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
