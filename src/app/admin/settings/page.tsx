"use client";

import React, { useState } from "react";
import styles from "../products/products.module.css";
import formStyles from "@/components/AuthForm.module.css";
import Button from "@/components/Button";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 style={{ margin: 0 }}>Store Settings</h2>
      </div>

      <div className={styles.desktopView}>
        <div className={styles.tableCard} style={{ padding: '24px', maxWidth: '600px' }}>
          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className={formStyles.formGroup}>
              <label htmlFor="storeName" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Store Name</label>
              <input 
                type="text" 
                id="storeName" 
                className={formStyles.input}
                defaultValue="DERRUME"
              />
            </div>
            
            <div className={formStyles.formGroup}>
              <label htmlFor="contactEmail" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Contact Email</label>
              <input 
                type="email" 
                id="contactEmail" 
                className={formStyles.input}
                defaultValue="support@derrume.com"
              />
            </div>
            
            <div className={formStyles.formGroup}>
              <label htmlFor="currency" style={{ fontWeight: 600, fontSize: '0.875rem' }}>Currency</label>
              <select id="currency" className={formStyles.input} defaultValue="INR">
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
              {saved && <span style={{ color: '#065f46', fontSize: '0.875rem', fontWeight: 500 }}>Settings saved successfully!</span>}
            </div>
          </form>
        </div>
      </div>
      <div className={styles.mobileView}>
        <div className={styles.mobileCard}>
            <p>Please use a desktop device to manage settings.</p>
        </div>
      </div>
    </div>
  );
}
