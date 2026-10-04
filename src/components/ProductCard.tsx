"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";
import Button from "./Button";
import { Product } from "../types";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { cartService } from "@/services/cartService";
import { wishlistService } from "@/services/wishlistService";

export default function ProductCard({ product }: { product: Product }) {
  const [isAdded, setIsAdded] = useState(false);
  const { refreshCart } = useCart();
  const { isInWishlist, refreshWishlist } = useWishlist();

  const isWished = isInWishlist(product.id);
  const outOfStock = product.stock <= 0;

  const handleAddToBag = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (outOfStock) return;

    await cartService.addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.images[0] || product.image || "",
    });
    
    await refreshCart();
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await wishlistService.toggleWishlist(product.id);
    await refreshWishlist();
  };

  const productImage = product.images?.[0] || product.image || "";

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={productImage}
            alt={product.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <button 
            className={`${styles.wishlistBtn} ${isWished ? styles.wished : ""}`} 
            aria-label="Add to wishlist"
            onClick={handleWishlist}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isWished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </Link>

      <div className={styles.info}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.name}>
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className={styles.type}>{product.productType || product.type}</p>
          </div>
          <p className={styles.price}>₹{product.price}</p>
        </div>

        <Button
          variant="outline"
          fullWidth
          className={styles.addToBag}
          onClick={handleAddToBag}
          disabled={outOfStock}
        >
          {outOfStock ? "OUT OF STOCK" : isAdded ? "✓ ADDED" : "ADD TO BAG"}
        </Button>
      </div>
    </div>
  );
}
