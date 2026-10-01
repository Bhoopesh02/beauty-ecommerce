'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import formStyles from '../form.module.css';
import Button from '@/components/Button';
import { Edit2, Trash2, CheckCircle2 } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    name: 'Jane Doe',
    phone: '+1 234 567 8900',
    addressLine1: '123 Main Street',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    isDefault: true,
  },
  {
    id: '2',
    name: 'Jane Doe',
    phone: '+1 234 567 8900',
    addressLine1: '456 Business Blvd',
    city: 'San Francisco',
    state: 'CA',
    postalCode: '94105',
    country: 'United States',
    isDefault: false,
  }
];

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false
  });

  const handleAddNew = () => {
    setFormData({
      name: '', phone: '', addressLine1: '', addressLine2: '',
      city: '', state: '', postalCode: '', country: 'United States', isDefault: false
    });
    setEditId(null);
    setIsEditing(true);
  };

  const handleEdit = (addr: Address) => {
    setFormData({
      name: addr.name, phone: addr.phone, addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '', city: addr.city, state: addr.state,
      postalCode: addr.postalCode, country: addr.country, isDefault: addr.isDefault
    });
    setEditId(addr.id);
    setIsEditing(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(a => a.id !== id));
    }
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      setAddresses(addresses.map(a => {
        if (a.id === editId) {
          const updated = { ...formData, id: editId };
          return updated;
        }
        if (formData.isDefault) return { ...a, isDefault: false };
        return a;
      }));
    } else {
      const newAddr = { ...formData, id: Date.now().toString() };
      if (formData.isDefault) {
        setAddresses(addresses.map(a => ({ ...a, isDefault: false })).concat(newAddr));
      } else {
        setAddresses([...addresses, newAddr]);
      }
    }
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
                <label htmlFor="name">Full Name</label>
                <input
                  type="text" id="name" required className={formStyles.input}
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
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
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                type="text" id="addressLine1" required className={formStyles.input}
                value={formData.addressLine1} onChange={e => setFormData({...formData, addressLine1: e.target.value})}
              />
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="addressLine2">Apartment / Building (Optional)</label>
              <input
                type="text" id="addressLine2" className={formStyles.input}
                value={formData.addressLine2} onChange={e => setFormData({...formData, addressLine2: e.target.value})}
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
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text" id="postalCode" required className={formStyles.input}
                  value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label htmlFor="country">Country</label>
                <input
                  type="text" id="country" required className={formStyles.input}
                  value={formData.country} disabled
                />
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
              <h3 className={styles.name}>{addr.name}</h3>
              <p>{addr.addressLine1}</p>
              {addr.addressLine2 && <p>{addr.addressLine2}</p>}
              <p>{addr.city}, {addr.state} {addr.postalCode}</p>
              <p>{addr.country}</p>
              <p className={styles.phone}>{addr.phone}</p>
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
      </div>
    </div>
  );
}
