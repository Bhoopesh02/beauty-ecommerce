"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./products.module.css";
import { products as initialProducts } from "@/data/products";

export default function AdminProducts() {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(initialProducts.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={styles.filterSelect}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <Link href="/admin/products/new" className={styles.addBtn}>
          + Add Product
        </Link>
      </div>

      {/* Desktop Table View */}
      <div className={styles.desktopView}>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th className={styles.actionsHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.productImage}></div>
                      <div>
                        <p className={styles.productName}>{product.name}</p>
                        <p className={styles.productType}>{product.type}</p>
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td className={styles.productPrice}>₹{product.price}</td>
                  <td>
                    <span className={styles.statusBadge}>Active</span>
                  </td>
                  <td className={styles.actionsCell}>
                    <Link href={`/admin/products/${product.id}/edit`} className={styles.editBtn}>
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(product.id)} className={styles.deleteBtn}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className={styles.emptyState}>
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className={styles.mobileView}>
        {filteredProducts.map((product) => (
          <div key={product.id} className={styles.mobileCard}>
            <div className={styles.mobileCardHeader}>
              <div className={styles.productImage}></div>
              <div className={styles.mobileCardInfo}>
                <p className={styles.productName}>{product.name}</p>
                <p className={styles.productCategory}>{product.category}</p>
              </div>
            </div>
            <div className={styles.mobileCardDetails}>
              <div className={styles.mobileCardPrice}>₹{product.price}</div>
              <span className={styles.statusBadge}>Active</span>
            </div>
            <div className={styles.mobileCardActions}>
              <Link href={`/admin/products/${product.id}/edit`} className={styles.mobileEditBtn}>
                Edit
              </Link>
              <button onClick={() => handleDelete(product.id)} className={styles.mobileDeleteBtn}>
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && (
          <div className={styles.emptyStateMobile}>
            No products found.
          </div>
        )}
      </div>
    </div>
  );
}
