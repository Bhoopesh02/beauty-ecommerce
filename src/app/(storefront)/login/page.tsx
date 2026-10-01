'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import styles from '@/components/AuthForm.module.css';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: any = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    
    // Simulate auth
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Fake error for demo
    if (formData.email === 'error@test.com') {
      setErrors({ general: 'Invalid email or password' });
      setIsLoading(false);
      return;
    }

    // Success - redirect would happen here
    window.location.href = '/account';
  };

  return (
    <AuthLayout>
      <h1 className={styles.heading}>WELCOME BACK</h1>
      
      {errors.general && (
        <div className={styles.errorText} style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '-1rem' }}>
          {errors.general}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            className={styles.input}
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            disabled={isLoading}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
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

        <div className={styles.forgotPassword}>
          <Link href="/forgot-password" className={styles.forgotPasswordLink}>
            Forgot Password?
          </Link>
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'LOGGING IN...' : 'LOGIN'}
        </Button>
      </form>

      <div className={styles.footer}>
        Don&apos;t have an account?
        <Link href="/register" className={styles.footerLink}>
          CREATE ACCOUNT
        </Link>
      </div>
    </AuthLayout>
  );
}
