'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import styles from './page.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import ProductCard from '@/components/ProductCard';

import { products as allProducts } from '@/data/products';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const initialQuery = searchParams?.get('q') || '';
  const initialSort = searchParams?.get('sort') || 'featured';
  const initialCategories = searchParams?.getAll('category') || [];
  const initialTypes = searchParams?.getAll('type') || [];
  const initialPriceRange = searchParams?.get('price') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filter state
  const [sort, setSort] = useState(initialSort);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCategories);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(initialTypes);
  const [priceRange, setPriceRange] = useState<string>(initialPriceRange);

  // Sync state with URL
  useEffect(() => {
    setQuery(initialQuery);
    setSort(initialSort);
    setSelectedCategories(initialCategories);
    setSelectedTypes(initialTypes);
    setPriceRange(initialPriceRange);
  }, [initialQuery, initialSort, initialCategories, initialTypes, initialPriceRange, searchParams]);

  // Derived unique filter options from data
  const categories = useMemo(() => Array.from(new Set(allProducts.map(p => p.category))), []);
  const types = useMemo(() => Array.from(new Set(allProducts.map(p => p.type))), []);

  const updateUrl = (
    newQuery: string, 
    newSort: string, 
    newCats: string[], 
    newTypes: string[],
    newPrice: string
  ) => {
    const params = new URLSearchParams();
    if (newQuery) params.set('q', newQuery);
    if (newSort !== 'featured') params.set('sort', newSort);
    if (newPrice) params.set('price', newPrice);
    newCats.forEach(c => params.append('category', c));
    newTypes.forEach(t => params.append('type', t));
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      updateUrl(query.trim(), sort, selectedCategories, selectedTypes, priceRange);
    } else {
      updateUrl('', sort, selectedCategories, selectedTypes, priceRange);
    }
  };

  const handleCategoryToggle = (category: string) => {
    const nextCats = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    updateUrl(query, sort, nextCats, selectedTypes, priceRange);
  };

  const handleTypeToggle = (type: string) => {
    const nextTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type];
    updateUrl(query, sort, selectedCategories, nextTypes, priceRange);
  };
  
  const handlePriceChange = (price: string) => {
    const nextPrice = price === priceRange ? '' : price;
    updateUrl(query, sort, selectedCategories, selectedTypes, nextPrice);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateUrl(query, e.target.value, selectedCategories, selectedTypes, priceRange);
  };

  const clearFilters = () => {
    updateUrl(query, 'featured', [], [], '');
  };

  // Filter & Sort Logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = allProducts;
    
    // 1. Search Query
    if (initialQuery) {
      const q = initialQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.type.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.concerns?.some(c => c.toLowerCase().includes(q))
      );
    }
    
    // 2. Filters
    if (selectedCategories.length > 0) {
      result = result.filter(p => selectedCategories.includes(p.category));
    }
    if (selectedTypes.length > 0) {
      result = result.filter(p => selectedTypes.includes(p.type));
    }
    if (priceRange) {
      if (priceRange === 'under-500') {
        result = result.filter(p => p.price < 500);
      } else if (priceRange === '500-1000') {
        result = result.filter(p => p.price >= 500 && p.price <= 1000);
      } else if (priceRange === 'over-1000') {
        result = result.filter(p => p.price > 1000);
      }
    }
    
    // 3. Sort
    result = [...result]; // clone before sort
    switch(initialSort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        result.sort((a, b) => (a.bestseller === b.bestseller) ? 0 : a.bestseller ? -1 : 1);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (a.featured === b.featured) ? 0 : a.featured ? -1 : 1);
        break;
    }
    
    return result;
  }, [initialQuery, selectedCategories, selectedTypes, initialSort]);

  const activeFilterCount = selectedCategories.length + selectedTypes.length + (priceRange ? 1 : 0);

  return (
    <>
      <div className={styles.header}>
        <SectionHeading centered>SEARCH</SectionHeading>
        {initialQuery && (
          <p className={styles.subtitle}>Results for &quot;{initialQuery}&quot;</p>
        )}

        <form className={styles.searchBar} onSubmit={handleSearch}>
          <div className={styles.searchFormContainer}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={styles.searchIcon}>
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search products..." 
              className={styles.searchInput}
              value={query}
              onChange={e => setQuery(e.target.value)}
              aria-label="Search query"
            />
          </div>
          <Button type="submit" variant="primary">SEARCH</Button>
        </form>
      </div>

      <div className={styles.layout}>
        {/* Desktop Sidebar / Mobile Drawer */}
        <aside className={`${styles.sidebar} ${showMobileFilters ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h3 className={styles.sidebarTitle}>Filters</h3>
            <button className={styles.closeSidebarBtn} onClick={() => setShowMobileFilters(false)} aria-label="Close filters">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <h4 className={styles.filterTitle}>Category</h4>
            </div>
            <div className={styles.filterOptions}>
              {categories.map(cat => (
                <label key={cat} className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={selectedCategories.includes(cat)}
                    onChange={() => handleCategoryToggle(cat)}
                    className={styles.checkbox}
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <h4 className={styles.filterTitle}>Product Type</h4>
            </div>
            <div className={styles.filterOptions}>
              {types.map(type => (
                <label key={type} className={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeToggle(type)}
                    className={styles.checkbox}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <div className={styles.filterHeader}>
              <h4 className={styles.filterTitle}>Price</h4>
            </div>
            <div className={styles.filterOptions}>
              <label className={styles.checkboxLabel}>
                <input 
                  type="radio" 
                  name="priceRange"
                  checked={priceRange === 'under-500'}
                  onChange={() => handlePriceChange('under-500')}
                  className={styles.checkbox}
                />
                <span>Under ₹500</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input 
                  type="radio" 
                  name="priceRange"
                  checked={priceRange === '500-1000'}
                  onChange={() => handlePriceChange('500-1000')}
                  className={styles.checkbox}
                />
                <span>₹500 - ₹1000</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input 
                  type="radio" 
                  name="priceRange"
                  checked={priceRange === 'over-1000'}
                  onChange={() => handlePriceChange('over-1000')}
                  className={styles.checkbox}
                />
                <span>Over ₹1000</span>
              </label>
            </div>
          </div>

          {activeFilterCount > 0 && (
            <button className={styles.clearFiltersBtn} onClick={clearFilters}>
              Clear all filters ({activeFilterCount})
            </button>
          )}
        </aside>

        <div className={styles.mainContent}>
          <div className={styles.resultsHeader}>
            <div className={styles.resultsCount}>
              {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 ? 's' : ''}
            </div>
            
            <div className={styles.controls}>
              <button 
                className={styles.mobileFilterBtn} 
                onClick={() => setShowMobileFilters(true)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>

              <select className={styles.select} value={initialSort} onChange={handleSortChange} aria-label="Sort by">
                <option value="featured">Sort By: Featured</option>
                <option value="bestselling">Best Selling</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div className={styles.grid}>
              {filteredAndSortedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <h2 style={{ fontFamily: 'var(--font-cinzel), serif', fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--brand-violet)' }}>
                NO PRODUCTS FOUND
              </h2>
              <p>We couldn&apos;t find any products matching your current search and filters.</p>
              <div className={styles.emptyActions}>
                {(activeFilterCount > 0 || initialQuery) && (
                  <Button variant="outline" onClick={() => updateUrl('', 'featured', [], [])}>CLEAR ALL</Button>
                )}
                <Button variant="primary" onClick={() => router.push('/products')}>BROWSE ALL</Button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Filter Overlay Backdrop */}
      {showMobileFilters && (
        <div className={styles.filterBackdrop} onClick={() => setShowMobileFilters(false)}></div>
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
