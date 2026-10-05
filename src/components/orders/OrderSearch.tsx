'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import styles from './OrderSearch.module.css';

interface OrderSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  placeholder?: string;
}

export default function OrderSearch({
  query,
  onQueryChange,
  placeholder = 'Search orders by ID or product'
}: OrderSearchProps) {
  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchWrapper}>
        <div className={styles.searchIcon}>
          <Search size={16} strokeWidth={1.5} />
        </div>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={placeholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search orders"
        />
        {query && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => onQueryChange('')}
            aria-label="Clear search"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
