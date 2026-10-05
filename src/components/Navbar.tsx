"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Navbar.module.css";
import SearchOverlay from "./SearchOverlay";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { wishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.announcement}>
        100% NATURAL • HOMEMADE • PURE
      </div>
      
      <div className={`container ${styles.navContainer}`}>
        {/* Mobile Left: Menu Toggle */}
        <button className={styles.mobileMenuBtn} aria-label="Open menu" onClick={() => setIsMobileMenuOpen(true)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        {/* Desktop Left: Links */}
        <nav className={styles.desktopNav}>
          <Link href="/" className={styles.navLink}>Home</Link>
          <Link href="/products" className={styles.navLink}>Products</Link>
          <Link href="/about" className={styles.navLink}>About Us</Link>
          <Link href="/contact" className={styles.navLink}>Contact</Link>
        </nav>

        {/* Center: Logo */}
        <Link href="/" className={styles.logo}>
          DERRUME
        </Link>

        {/* Right: Icons */}
        <div className={styles.iconNav}>
          <button className={`${styles.iconBtn} ${styles.searchBtn}`} aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </button>
          <Link href={user ? "/account" : "/login"} className={`${styles.iconBtn} ${styles.hideMobile} ${styles.accountBtn}`} aria-label="Account">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </Link>
          <Link href="/wishlist" className={`${styles.iconBtn} ${styles.hideMobile} ${styles.wishlistNavBtn}`} aria-label="Wishlist">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            {mounted && wishlist.length > 0 && <span className={styles.badge}>{wishlist.length}</span>}
          </Link>
          <Link href="/cart" className={`${styles.iconBtn} ${styles.cartBtn}`} aria-label="Cart">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            {mounted && itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className={styles.mobileMenuOverlay}
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className={styles.mobileMenuHeader}>
            <span className={styles.mobileMenuTitle}>Menu</span>
            <button className={styles.closeBtn} onClick={() => setIsMobileMenuOpen(false)} aria-label="Close menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <nav className={styles.mobileNavLinks}>
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <Link href="/products" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
            <Link href="/about" onClick={() => setIsMobileMenuOpen(false)}>About Us</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
            <hr className={styles.mobileMenuDivider} />
            <Link href={mounted && user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)}>Account</Link>
            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)}>Wishlist {mounted && wishlist.length > 0 ? `(${wishlist.length})` : ""}</Link>
          </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
}
