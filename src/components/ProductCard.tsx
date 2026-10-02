"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductCard.module.css";
import Button from "./Button";

export interface ProductProps {
  id: string;
  name: string;
  type: string;
  category?: string;
  concerns?: string[];
  price: number;
  image: string;
  slug: string;
}

function addToCart(product: ProductProps) {
  const item = {
    id: product.id,
    name: product.name,
    price: product.price,
    variant: "default",
    quantity: 1,
    image: product.image,
  };
  const cart = JSON.parse(localStorage.getItem("derrume_cart") || "[]");
  const existing = cart.find(
    (i: { id: string; variant: string }) =>
      i.id === item.id && i.variant === item.variant
  );
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push(item);
  }
  localStorage.setItem("derrume_cart", JSON.stringify(cart));
}

export default function ProductCard({ product }: { product: ProductProps }) {
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className={styles.card}>
      <Link href={`/products/${product.slug}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <button className={styles.wishlistBtn} aria-label="Add to wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </Link>

      <div className={styles.info}>
        <div className={styles.header}>
          <div>
            <h3 className={styles.name}>
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>
            <p className={styles.type}>{product.type}</p>
          </div>
          <p className={styles.price}>₹{product.price}</p>
        </div>

        <Button
          variant="outline"
          fullWidth
          className={styles.addToBag}
          onClick={handleAddToBag}
        >
          {isAdded ? "✓ ADDED" : "ADD TO BAG"}
        </Button>
      </div>
    </div>
  );
}
