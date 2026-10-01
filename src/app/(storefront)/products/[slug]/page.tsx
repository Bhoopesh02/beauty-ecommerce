"use client";

import React, { useState, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import ProductReviews from "@/components/ProductReviews";
import { products } from "@/data/products";

// Using Lucide icons or raw SVGs for standard icons
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "var(--brand-blush)" : "none"}
    stroke="var(--brand-blush)"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ChevronDownIcon = ({ isOpen }: { isOpen?: boolean }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{
      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
      transition: "transform 0.3s ease",
    }}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const AccordionItem = ({ title, children, defaultOpen = false }: any) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={styles.accordionItem}>
      <button
        className={styles.accordionHeader}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className={styles.accordionTitle}>{title}</span>
        <ChevronDownIcon isOpen={isOpen} />
      </button>
      <div
        className={styles.accordionContent}
        style={{
          maxHeight: isOpen ? "1000px" : "0",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className={styles.accordionInner}>{children}</div>
      </div>
    </div>
  );
};

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("50ml");
  // For prototyping, we'll use a placeholder array of images if product has no multiple images
  const [activeImage, setActiveImage] = useState(0);

  const product = products.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  // Get some related products (same category or just others)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);
    
  if (relatedProducts.length === 0) {
    relatedProducts.push(...products.filter((p) => p.id !== product.id).slice(0, 4));
  }

  const sizes = ["30ml", "50ml", "100ml"];
  // Mock multiple images for gallery
  const images = [
    product.image,
    "/images/placeholder-2.jpg",
    "/images/placeholder-3.jpg",
    "/images/placeholder-4.jpg",
  ];

  const handleAddToCart = () => {
    const item = {
      id: product.id,
      name: product.name,
      price: product.price,
      variant: selectedSize,
      quantity: quantity,
      image: product.image
    };
    const cart = JSON.parse(localStorage.getItem('derrume_cart') || '[]');
    const existing = cart.find((i: any) => i.id === item.id && i.variant === item.variant);
    if (existing) {
      existing.quantity += item.quantity;
    } else {
      cart.push(item);
    }
    localStorage.setItem('derrume_cart', JSON.stringify(cart));
    alert('Added to your bag');
  };

  const handleBuyNow = () => {
    const item = {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      quantity: quantity,
      image: product.image
    };
    localStorage.setItem('derrume_buynow', JSON.stringify(item));
    router.push('/checkout?mode=buy-now');
  };

  return (
    <main className={styles.main}>
      <div className={`container ${styles.productContainer}`}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <Link href="/products">Products</Link>
          <span className={styles.separator}>/</span>
          <Link href={`/category/${product.category?.toLowerCase().replace(" ", "-")}`}>
            {product.category}
          </Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>{product.name}</span>
        </nav>

        <div className={styles.productLayout}>
          {/* Left Column: Image Gallery */}
          <div className={styles.galleryColumn}>
            <div className={styles.thumbnailList}>
              {images.map((img, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnailBtn} ${
                    activeImage === index ? styles.activeThumbnail : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <div className={styles.placeholderThumbnail}></div>
                  {/* Using placeholder div, but setup Image for real ones */}
                  {/* <Image src={img} alt={`Thumbnail ${index + 1}`} fill className={styles.thumbnailImg} /> */}
                </button>
              ))}
            </div>
            
            <div className={styles.mainImageWrapper}>
              <div className={styles.placeholderMainImage}></div>
              {/* <Image 
                src={images[activeImage]} 
                alt={product.name} 
                fill 
                priority
                className={styles.mainImage}
                sizes="(max-width: 768px) 100vw, 50vw"
              /> */}
            </div>
          </div>

          {/* Right Column: Product Info */}
          <div className={styles.infoColumn}>
            <div className={styles.badges}>
              {product.bestseller && (
                <span className={styles.badge}>Bestseller</span>
              )}
            </div>

            <h1 className={styles.title}>{product.name}</h1>
            <p className={styles.type}>{product.type}</p>

            <div className={styles.rating}>
              {(product.reviewCount || 0) > 0 ? (
                <>
                  <div className={styles.stars}>
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon />
                    <StarIcon filled={false} />
                  </div>
                  <a href="#reviews" className={styles.reviewCount} style={{ cursor: 'pointer', textDecoration: 'underline' }}>({product.averageRating} | {product.reviewCount} Reviews)</a>
                </>
              ) : (
                <a href="#reviews" className={styles.reviewCount} style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--brand-blush)' }}>No reviews yet</a>
              )}
            </div>

            <p className={styles.price}>₹{product.price}</p>

            <p className={styles.description}>
              [Product Description] Our {product.name.toLowerCase()} is crafted with care using authentic organic ingredients. It specifically addresses {product.concerns?.join(" and ").toLowerCase()} to reveal your natural radiance.
            </p>

            <div className={styles.selectorGroup}>
              <h3 className={styles.selectorLabel}>Size</h3>
              <div className={styles.sizeOptions}>
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeBtn} ${
                      selectedSize === size ? styles.activeSize : ""
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.selectorGroup}>
              <h3 className={styles.selectorLabel}>Quantity</h3>
              <div className={styles.quantitySelector}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.qtyValue}>{quantity}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.actionButtons}>
              <Button variant="outline" className={styles.addBtn} onClick={handleAddToCart}>
                ADD TO CART
              </Button>
              <Button variant="primary" className={styles.buyBtn} onClick={handleBuyNow}>
                BUY IT NOW
              </Button>
            </div>

            {/* Accordion Information */}
            <div className={styles.accordionContainer}>
              <AccordionItem title="Ingredients" defaultOpen={true}>
                <p>
                  [Ingredients List] Please refer to product packaging for the most up to date list of ingredients.
                </p>
                <ul className={styles.ingredientList}>
                  <li>Organic Key Ingredient 1</li>
                  <li>Natural Extract 2</li>
                  <li>Essential Oil Blend</li>
                </ul>
              </AccordionItem>
              
              <AccordionItem title="Benefits">
                <ul className={styles.benefitsList}>
                  <li>Helps with {product.concerns?.[0]?.toLowerCase() || "skin health"}</li>
                  <li>Provides long-lasting nourishment</li>
                  <li>100% organic and cruelty-free</li>
                </ul>
              </AccordionItem>

              <AccordionItem title="How to Use">
                <ol className={styles.usageList}>
                  <li>Apply a small amount to the palm of your hand.</li>
                  <li>Gently massage onto the desired area.</li>
                  <li>Use twice daily for best results.</li>
                </ol>
              </AccordionItem>
              
              <AccordionItem title="FAQs">
                <div className={styles.faqItem}>
                  <strong>Is this suitable for all types?</strong>
                  <p>Yes, our formulation is gentle and suitable for daily use on all profiles.</p>
                </div>
                <div className={styles.faqItem}>
                  <strong>Is this cruelty-free?</strong>
                  <p>Absolutely. We never test on animals.</p>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews */}
      <ProductReviews productId={product.id} />

      {/* Related Products */}
      <section className={`section-spacing ${styles.relatedSection}`}>
        <div className="container">
          <SectionHeading 
            title="You May Also Like" 
            subtitle="Perfect additions to your routine" 
          />
          <div className={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Sticky Add to Bag Bar */}
      <div className={styles.mobileStickyBar}>
        <div className={styles.stickyBarInfo}>
          <p className={styles.stickyBarTitle}>{product.name}</p>
          <p className={styles.stickyBarPrice}>₹{product.price}</p>
        </div>
        <Button variant="primary" className={styles.stickyBarBtn} onClick={handleAddToCart}>
          ADD TO BAG
        </Button>
      </div>
    </main>
  );
}
