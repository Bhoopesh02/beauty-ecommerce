"use client";

import React, { useState, useEffect } from "react";
import styles from "../products/products.module.css";
import { authService } from "@/services/authService";
import { User } from "@/types";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    authService.getCustomers().then(fetchedCustomers => {
      setCustomers(fetchedCustomers);
      setLoading(false);
    });
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className={styles.container} style={{padding: '100px 0', textAlign: 'center'}}>Loading customers...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.controls}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input 
              type="text" 
              placeholder="Search customers..." 
              className={styles.searchInput}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={styles.desktopView}>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map(customer => (
                <tr key={customer.id}>
                  <td className={styles.cellBold}>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{new Date(customer.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.emptyState}>
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile View */}
      <div className={styles.mobileView}>
        {filteredCustomers.map(customer => (
          <div key={customer.id} className={styles.mobileCard}>
            <div className={styles.mobileCardHeader}>
              <div className={styles.mobileCardInfo}>
                <h4 className={styles.productName}>{customer.name}</h4>
                <p className={styles.productCategory}>{customer.email}</p>
                {customer.phone && <p className={styles.productCategory}>{customer.phone}</p>}
                <p className={styles.productCategory}>Joined: {new Date(customer.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
        {filteredCustomers.length === 0 && (
          <div className={styles.emptyStateMobile}>
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
}
