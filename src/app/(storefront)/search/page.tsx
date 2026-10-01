'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';

const allProducts = [
  { id: '1', name: 'Radiance Face Oil', price: 85, category: 'Face', image: '', isNew: true },
  { id: '2', name: 'Botanical Cleanser', price: 40, category: 'Face', image: '', isNew: false },
  { id: '3', name: 'Rosewater Mist', price: 35, category: 'Face', image: '', isNew: false },
  { id: '4', name: 'Nourishing Body Butter', price: 55, category: 'Body', image: '', isNew: true },
  { id: '5', name: 'Exfoliating Scrub', price: 45, category: 'Body', image: '', isNew: false },
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams?.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState(allProducts);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setIsSearching(true);
    const timer = setTimeout(() => {
      const q = initialQuery.toLowerCase();
      if (!q) {
        setResults([]);
      } else {
        setResults(allProducts.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)));
      }
      setIsSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [initialQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      <div className={styles.header}>
        <SectionHeading centered>SEARCH RESULTS</SectionHeading>
        {initialQuery && (
          <p className={styles.subtitle}>Results for &quot;{initialQuery}&quot;</p>
        )}

        <form className={styles.searchBar} onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search for products..." 
            className={styles.searchInput}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <Button type="submit" variant="primary">SEARCH</Button>
        </form>
      </div>

      {isSearching ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>Searching...</div>
      ) : results.length > 0 ? (
        <>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsCount}>{results.length} Product{results.length !== 1 ? 's' : ''}</div>
            <div className={styles.controls}>
              <select className={styles.select}>
                <option value="">Sort By: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <div className={styles.grid}>
            {results.map(product => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  category: product.category,
                  image: product.image,
                  type: product.category,
                  slug: product.id
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div className={styles.emptyState}>
          <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-violet)' }}>
            NO PRODUCTS FOUND
          </h2>
          <p>Try another search or explore our collections.</p>
          <div className={styles.emptyActions}>
            <Button variant="outline" onClick={() => { setQuery(''); router.push('/search'); }}>CLEAR SEARCH</Button>
            <Button variant="primary" onClick={() => router.push('/shop')}>EXPLORE PRODUCTS</Button>
          </div>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className={styles.container}>
      <div className="container animate-fade-in">
        <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem 0' }}>Loading search...</div>}>
          <SearchContent />
        </Suspense>
      </div>
    </div>
  );
}
