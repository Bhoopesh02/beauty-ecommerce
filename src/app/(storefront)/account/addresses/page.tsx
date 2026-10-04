'use client';

import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import formStyles from '../form.module.css';
import Button from '@/components/Button';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { addressService } from '@/services/addressService';
import { Address } from '@/types';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Omit<Address, "id">>({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: '',
    type: 'home',
    isDefault: false
  });

  const loadAddresses = async () => {
    const addrs = await addressService.getAddresses();
    setAddresses(addrs);
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleAddNew = () => {
    setFormData({
      fullName: '', phone: '', address: '',
      city: '', state: '', pincode: '', landmark: '', type: 'home', isDefault: addresses.length === 0
    });
    setEditId(null);
    setIsEditing(true);
  };

  const handleEdit = (addr: Address) => {
    setFormData({
      fullName: addr.fullName, phone: addr.phone, address: addr.address,
      city: addr.city, state: addr.state,
      pincode: addr.pincode, landmark: addr.landmark || '', type: addr.type || 'home', isDefault: addr.isDefault
    });
    setEditId(addr.id);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      await addressService.deleteAddress(id);
      await loadAddresses();
    }
  };

  const handleSetDefault = async (id: string) => {
    await addressService.setDefaultAddress(id);
    await loadAddresses();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      await addressService.updateAddress(editId, formData);
    } else {
      await addressService.addAddress(formData);
    }
    await loadAddresses();
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`${formStyles.container} animate-fade-in`}>
        <div className={formStyles.header}>
          <h1>{editId ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}</h1>
        </div>
        <div className={formStyles.section}>
          <form className={formStyles.form} onSubmit={handleSubmit}>
            <div className={formStyles.formRow}>
              <div className={formStyles.formGroup}>
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text" id="fullName" required className={formStyles.input}
                  value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel" id="phone" required className={formStyles.input}
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                />
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="address">Address</label>
              <input
                type="text" id="address" required className={formStyles.input}
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="landmark">Landmark (Optional)</label>
              <input
                type="text" id="landmark" className={formStyles.input}
                value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})}
              />
            </div>

            <div className={formStyles.formRow}>
              <div className={formStyles.formGroup}>
                <label htmlFor="city">City</label>
                <input
                  type="text" id="city" required className={formStyles.input}
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label htmlFor="state">State / Province</label>
                <input
                  type="text" id="state" required className={formStyles.input}
                  value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
                />
              </div>
            </div>

            <div className={formStyles.formRow}>
              <div className={formStyles.formGroup}>
                <label htmlFor="pincode">Postal Code</label>
                <input
                  type="text" id="pincode" required className={formStyles.input}
                  value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label htmlFor="type">Address Type</label>
                <select
                  id="type" required className={formStyles.input}
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}
                  style={{ appearance: 'auto' }}
                >
                  <option value="home">Home</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={e => setFormData({...formData, isDefault: e.target.checked})}
              />
              <label htmlFor="isDefault">Set as default address</label>
            </div>

            <div className={formStyles.actions}>
              <Button type="submit" variant="primary">SAVE ADDRESS</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>CANCEL</Button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`${formStyles.container} animate-fade-in`}>
      <div className={styles.headerRow}>
        <div className={formStyles.header}>
          <h1>MY ADDRESSES</h1>
          <p>Manage your shipping addresses.</p>
        </div>
        <Button variant="primary" onClick={handleAddNew}>
          + ADD NEW ADDRESS
        </Button>
      </div>

      <div className={styles.grid}>
        {addresses.map(addr => (
          <div key={addr.id} className={styles.card}>
            {addr.isDefault && (
              <div className={styles.defaultBadge}>
                <CheckCircle2 size={16} /> DEFAULT ADDRESS
              </div>
            )}
            
            <div className={styles.cardContent}>
              <h3 className={styles.name}>{addr.fullName}</h3>
              <p>{addr.address}</p>
              {addr.landmark && <p>{addr.landmark}</p>}
              <p>{addr.city}, {addr.state} {addr.pincode}</p>
              <p className={styles.phone}>{addr.phone}</p>
              <p style={{marginTop: '0.5rem', fontSize: '0.875rem', textTransform: 'capitalize', color: 'var(--text-secondary)'}}>{addr.type}</p>
            </div>

            <div className={styles.actions}>
              <button className={styles.actionBtn} onClick={() => handleEdit(addr)}>
                <Edit2 size={16} /> EDIT
              </button>
              <button className={styles.actionBtn} onClick={() => handleDelete(addr.id)}>
                <Trash2 size={16} /> DELETE
              </button>
              {!addr.isDefault && (
                <button className={styles.actionBtn} onClick={() => handleSetDefault(addr.id)}>
                  SET AS DEFAULT
                </button>
              )}
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <div style={{gridColumn: '1 / -1', padding: '2rem', textAlign: 'center', background: 'var(--surface-color)', borderRadius: '4px'}}>
            <p style={{marginBottom: '1rem'}}>You haven't saved any addresses yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
