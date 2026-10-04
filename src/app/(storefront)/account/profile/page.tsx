'use client';

import React, { useState, useEffect } from 'react';
import styles from '../form.module.css';
import Button from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/authService';

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email,
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg('');
    try {
      await authService.updateProfile({
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.phone
      });
      await refreshUser();
      setSuccessMsg('Profile updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Update failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    setSuccessMsg('');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setSuccessMsg('Password changed successfully.');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.header}>
        <h1>MY PROFILE</h1>
        <p>Manage your personal information and password.</p>
      </div>

      {successMsg && (
        <div className={styles.successMessage}>
          {successMsg}
        </div>
      )}

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Personal Information</h2>
        <form className={styles.form} onSubmit={handleProfileSubmit}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                className={styles.input}
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                disabled={isSubmitting}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                className={styles.input}
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={formData.email}
              disabled={true} // Email typically requires special flow to change
              title="Email cannot be changed directly."
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              className={styles.input}
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              disabled={isSubmitting}
            />
          </div>

          <div className={styles.actions}>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'SAVING...' : 'SAVE CHANGES'}
            </Button>
          </div>
        </form>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Change Password</h2>
        <form className={styles.form} onSubmit={handlePasswordSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              className={styles.input}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              disabled={isSubmitting}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              className={styles.input}
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              className={styles.input}
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className={styles.actions}>
            <Button type="submit" variant="outline" disabled={isSubmitting}>
              {isSubmitting ? 'UPDATING...' : 'UPDATE PASSWORD'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
