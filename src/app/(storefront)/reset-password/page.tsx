'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import styles from '@/components/AuthForm.module.css';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <AuthLayout>
      <h1 className={styles.heading}>RESET PASSWORD</h1>
      
      {isSuccess ? (
        <div className={styles.successMessage}>
          PASSWORD UPDATED
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            Your password has been reset successfully.
          </p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href="/login">
              <Button variant="primary" fullWidth>BACK TO LOGIN</Button>
            </Link>
          </div>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="password">New Password</label>
            <input 
              type="password" 
              id="password" 
              className={styles.input}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              disabled={isLoading}
            />
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className={styles.input}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
          </Button>
        </form>
      )}
    </AuthLayout>
  );
}
