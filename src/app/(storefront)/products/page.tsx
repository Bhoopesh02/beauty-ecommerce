"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import ProductCard from "@/components/ProductCard";
import Button from "@/components/Button";
import { products } from "@/data/products";

// Derive filter options from data
const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
const types = Array.from(new Set(products.map(p => p.type).filter(Boolean)));

export default function ShopPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [sortOption, setSortOption] = useState("featured");
  
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) || 
        p.type?.toLowerCase().includes(lowerQuery)
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(p => p.category && selectedCategories.includes(p.category));
    }

    if (selectedTypes.length > 0) {
      result = result.filter(p => p.type && selectedTypes.includes(p.type));
    }

    if (minPrice) {
      const min = parseFloat(minPrice);
      if (!isNaN(min)) {
        result = result.filter(p => p.price >= min);
      }
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        result = result.filter(p => p.price <= max);
      }
    }

    // Sort
    return [...result].sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "featured":
        default:
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
    });
  }, [searchQuery, selectedCategories, selectedTypes, minPrice, maxPrice, sortOption]);

  const handleCheckboxChange = (
    setter: React.Dispatch<React.SetStateAction<string[]>>, 
    value: string
  ) => {
    setter(prev => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedTypes([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const renderFilterContent = () => (
    <>
      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Category</h3>
        <ul className={styles.filterList}>
          {categories.map(cat => (
            <li key={cat}>
              <label className={styles.filterLabel}>
                <input 
                  type="checkbox" 
                  checked={selectedCategories.includes(cat)}
                  onChange={() => handleCheckboxChange(setSelectedCategories, cat)}
                />
                {cat}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Product Type</h3>
        <ul className={styles.filterList}>
          {types.map(type => (
            <li key={type}>
              <label className={styles.filterLabel}>
                <input 
                  type="checkbox" 
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleCheckboxChange(setSelectedTypes, type)}
                />
                {type}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterGroup}>
        <h3 className={styles.filterTitle}>Price</h3>
        <div className={styles.priceRange}>
          <input 
            type="number" 
            placeholder="Min" 
            className={styles.priceInput}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            className={styles.priceInput}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
      </div>
      
      {(selectedCategories.length > 0 || selectedTypes.length > 0 || minPrice || maxPrice || searchQuery) && (
        <button onClick={clearFilters} className={styles.clearFiltersBtn}>
          Clear All Filters
        </button>
      )}
    </>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>SHOP DERRUME</h1>
        <p className={styles.subtitle} style={{ textAlign: "center", marginBottom: "20px", color: "var(--color-text-light)" }}>
          Discover natural, homemade skincare and hair-care rituals.
        </p>
        
        <div className={styles.searchSort}>
          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder="Search products..." 
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
          
          <div className={styles.controls}>
            <button 
              className={styles.mobileFilterBtn}
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter
            </button>
            
            <div className={styles.sortWrapper}>
              <select 
                className={styles.sortSelect}
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <svg className={styles.sortIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>
      </header>

      <div className={styles.main}>
        {/* Desktop Sidebar */}
        <aside className={styles.sidebar}>
          {renderFilterContent()}
        </aside>

        {/* Mobile Filter Drawer */}
        <div 
          className={styles.mobileFilterDrawer} 
          data-open={isMobileFilterOpen}
        >
          <div className={styles.drawerHeader}>
            <h2>Filters</h2>
            <button className={styles.closeBtn} onClick={() => setIsMobileFilterOpen(false)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className={styles.drawerContent}>
            {renderFilterContent()}
          </div>
          <div className={styles.drawerFooter}>
            <Button variant="outline" fullWidth onClick={clearFilters}>Clear</Button>
            <Button variant="primary" fullWidth onClick={() => setIsMobileFilterOpen(false)}>Apply</Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className={styles.content}>
          {filteredProducts.length === 0 ? (
            <div className={styles.empty}>
              <h3>No products found</h3>
              <p>Try adjusting your filters or search query.</p>
              <button onClick={clearFilters} className={styles.clearFiltersBtn}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className={styles.grid}>
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
