"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import styles from "./SearchOverlay.module.css";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (inputRef.current) {
        inputRef.current.focus();
      }
      const saved = localStorage.getItem("derrume_recent_searches");
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    } else {
      document.body.style.overflow = "";
      setQuery("");
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      const newRecents = [query.trim(), ...recentSearches.filter(s => s !== query.trim())].slice(0, 5);
      setRecentSearches(newRecents);
      localStorage.setItem("derrume_recent_searches", JSON.stringify(newRecents));
      
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("derrume_recent_searches");
  };

  const handleRecentClick = (term: string) => {
    router.push(`/search?q=${encodeURIComponent(term)}`);
    onClose();
  };

  const recommendedProducts = products.filter(p => p.featured).slice(0, 4);

  const searchResults = query.trim()
    ? products.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) || 
        p.type.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Search products">
      <div className={styles.container}>
        <div className={styles.header}>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              ref={inputRef}
              type="text"
              placeholder="Search oils, moisturizers, hair care..."
              className={styles.searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
            {query && (
              <button 
                type="button"
                className={styles.clearBtn} 
                onClick={() => { setQuery(""); inputRef.current?.focus(); }}
                aria-label="Clear search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </form>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close search panel">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
               <line x1="18" y1="6" x2="6" y2="18"></line>
               <line x1="6" y1="6" x2="18" y2="18"></line>
             </svg>
          </button>
        </div>

        <div className={styles.content}>
          {!query.trim() ? (
            <div className={styles.discoveryState}>
              {recentSearches.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>
                    <h3 className={styles.sectionTitle}>Recent Searches</h3>
                    <button className={styles.textBtn} onClick={clearRecentSearches}>Clear all</button>
                  </div>
                  <ul className={styles.recentList}>
                    {recentSearches.map((term, index) => (
                      <li key={index}>
                        <button className={styles.recentItem} onClick={() => handleRecentClick(term)}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span>{term}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Recommended</h3>
                  <Link href="/products" className={styles.textBtn} onClick={onClose}>
                    Browse all
                  </Link>
                </div>
                <div className={styles.recommendedGrid}>
                  {recommendedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.resultsState}>
              {searchResults.length > 0 ? (
                <>
                  <ul className={styles.suggestionsList}>
                    {searchResults.map(product => (
                      <li key={product.id}>
                        <Link href={`/products/${product.slug}`} className={styles.suggestionItem} onClick={onClose}>
                          <div className={styles.suggestionImage}>
                            <Image 
                              src={product.image} 
                              alt={product.name}
                              fill
                              sizes="60px"
                              className={styles.image}
                            />
                          </div>
                          <div className={styles.suggestionInfo}>
                            <p className={styles.suggestionName}>{product.name}</p>
                            <p className={styles.suggestionType}>{product.type || product.category}</p>
                          </div>
                          <div className={styles.suggestionPrice}>
                            ₹{product.price}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <button className={styles.viewAllBtn} onClick={handleSearch}>
                    View all results for &quot;{query}&quot;
                  </button>
                </>
              ) : (
                <div className={styles.noResults}>
                  <p>No products found for &quot;{query}&quot;</p>
                  <Link href="/products" className={styles.browseAllBtn} onClick={onClose}>
                    Browse all products
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
