"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import styles from "./page.module.css";
import Button from "@/components/Button";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/SectionHeading";
import ProductReviews from "@/components/ProductReviews";
import { productService } from "@/services/productService";
import { cartService } from "@/services/cartService";
import { checkoutService } from "@/services/checkoutService";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { wishlistService } from "@/services/wishlistService";
import { Product, ProductVariant } from "@/types";

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
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  
  const { refreshCart } = useCart();
  const { isInWishlist, refreshWishlist } = useWishlist();

  useEffect(() => {
    productService.getProductBySlug(slug).then(p => {
      if (!p) {
        setError(true);
      } else {
        setProduct(p);
        if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        }
        productService.getProducts().then(all => {
          let related = all.filter(rp => rp.id !== p.id && rp.category === p.category);
          if (related.length === 0) related = all.filter(rp => rp.id !== p.id);
          setRelatedProducts(related.slice(0, 4));
        });
      }
      setLoading(false);
    });
  }, [slug]);

  if (loading) return <div className={styles.main}><div className="container" style={{padding:"100px 0", textAlign:"center"}}>Loading product...</div></div>;
  if (error || !product) return notFound();

  const isWished = isInWishlist(product.id);
  
  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentStock = selectedVariant ? selectedVariant.stock : product.stock;
  const outOfStock = currentStock <= 0;

  const images = product.images?.length > 0 ? product.images : [product.image || ""];

  const handleAddToCart = async () => {
    if (outOfStock) return;
    
    await cartService.addToCart({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: currentPrice,
      quantity: quantity,
      image: images[0],
      size: selectedVariant?.size
    });
    
    await refreshCart();
    
    const toast = document.createElement("div");
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.background = "#333";
    toast.style.color = "#fff";
    toast.style.padding = "12px 24px";
    toast.style.borderRadius = "4px";
    toast.style.zIndex = "9999";
    toast.innerText = "Added to your bag";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const handleBuyNow = () => {
    if (outOfStock) return;
    
    checkoutService.setCheckoutItems([{
      productId: product.id,
      variantId: selectedVariant?.id,
      name: product.name,
      price: currentPrice,
      size: selectedVariant?.size,
      quantity: quantity,
      image: images[0]
    }], "buy-now");
    
    router.push('/checkout');
  };

  const handleWishlist = async () => {
    await wishlistService.toggleWishlist(product.id);
    await refreshWishlist();
  };

  const increaseQty = () => {
    if (quantity < currentStock) setQuantity(q => q + 1);
  };
  
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <main className={styles.main}>
      <div className={`container ${styles.productContainer}`}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span className={styles.separator}>/</span>
          <Link href="/products">Products</Link>
          <span className={styles.separator}>/</span>
          <span className={styles.current}>{product.name}</span>
        </nav>

        <div className={styles.productLayout}>
          <div className={styles.galleryColumn}>
            {images.length > 1 && (
              <div className={styles.thumbnailList}>
                {images.map((img, index) => (
                  <button
                    key={index}
                    className={`${styles.thumbnailBtn} ${activeImage === index ? styles.activeThumbnail : ""}`}
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                  >
                    <Image src={img} alt={`Thumbnail ${index + 1}`} fill className={styles.thumbnailImg} style={{objectFit: 'cover'}} />
                  </button>
                ))}
              </div>
            )}
            
            <div className={styles.mainImageWrapper}>
              <Image 
                src={images[activeImage]} 
                alt={product.name} 
                fill 
                priority
                className={styles.mainImage}
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{objectFit: 'cover'}}
              />
            </div>
          </div>

          <div className={styles.infoColumn}>
            <div className={styles.badges}>
              {product.bestseller && (
                <span className={styles.badge}>Bestseller</span>
              )}
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
              <h1 className={styles.title}>{product.name}</h1>
              <button 
                onClick={handleWishlist}
                style={{background: 'none', border: 'none', cursor: 'pointer', padding: '10px'}}
                aria-label="Wishlist"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill={isWished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </button>
            </div>
            
            <p className={styles.type}>{product.productType || product.type}</p>

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
                <span className={styles.reviewCount}>No reviews yet</span>
              )}
            </div>

            <p className={styles.price}>₹{currentPrice}</p>

            <p className={styles.description}>
              {product.description}
            </p>

            {product.variants && product.variants.length > 0 && (
              <div className={styles.selectorGroup}>
                <h3 className={styles.selectorLabel}>Size</h3>
                <div className={styles.sizeOptions}>
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      className={`${styles.sizeBtn} ${selectedVariant?.id === variant.id ? styles.activeSize : ""}`}
                      onClick={() => {
                        setSelectedVariant(variant);
                        setQuantity(1); // reset qty on variant change
                      }}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.selectorGroup}>
              <h3 className={styles.selectorLabel}>Quantity</h3>
              {outOfStock ? (
                <span style={{color: 'red', fontWeight: 'bold'}}>OUT OF STOCK</span>
              ) : (
                <div className={styles.quantitySelector}>
                  <button
                    className={styles.qtyBtn}
                    onClick={decreaseQty}
                    aria-label="Decrease quantity"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className={styles.qtyValue}>{quantity}</span>
                  <button
                    className={styles.qtyBtn}
                    onClick={increaseQty}
                    aria-label="Increase quantity"
                    disabled={quantity >= currentStock}
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <div className={styles.actionButtons}>
              <Button variant="outline" className={styles.addBtn} onClick={handleAddToCart} disabled={outOfStock}>
                {outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
              </Button>
              <Button variant="primary" className={styles.buyBtn} onClick={handleBuyNow} disabled={outOfStock}>
                {outOfStock ? "UNAVAILABLE" : "BUY IT NOW"}
              </Button>
            </div>

            <div className={styles.accordionContainer}>
              {product.ingredients && (
                <AccordionItem title="Ingredients" defaultOpen={true}>
                  <p>{product.ingredients}</p>
                </AccordionItem>
              )}
              
              {product.benefits && (
                <AccordionItem title="Benefits">
                  <p>{product.benefits}</p>
                </AccordionItem>
              )}

              {product.howToUse && (
                <AccordionItem title="How to Use">
                  <p>{product.howToUse}</p>
                </AccordionItem>
              )}
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />

      {relatedProducts.length > 0 && (
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
      )}

      <div className={styles.mobileStickyBar}>
        <div className={styles.stickyBarInfo}>
          <p className={styles.stickyBarTitle}>{product.name}</p>
          <p className={styles.stickyBarPrice}>₹{currentPrice}</p>
        </div>
        <div style={{display: 'flex', gap: '8px', flex: 1, minWidth: '50%'}}>
          <Button variant="outline" className={styles.stickyBarBtn} onClick={handleAddToCart} disabled={outOfStock} style={{flex: 1, padding: '0'}}>
            ADD
          </Button>
          <Button variant="primary" className={styles.stickyBarBtn} onClick={handleBuyNow} disabled={outOfStock} style={{flex: 1, padding: '0'}}>
            BUY
          </Button>
        </div>
      </div>
    </main>
  );
}
