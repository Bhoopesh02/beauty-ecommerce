'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import styles from '@/components/AuthForm.module.css';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useAuth();
  const [formData, setFormData] = useState({ 
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '', 
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      await registerUser(
        `${formData.firstName} ${formData.lastName}`.trim(),
        formData.email,
        formData.password
      );
      router.push('/account');
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <AuthLayout>
      <h1 className={styles.heading}>CREATE YOUR ACCOUNT</h1>
      
      {errors.general && (
        <div className={styles.errorText} style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '-1rem' }}>
          {errors.general}
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className={styles.formGroup}>
            <label htmlFor="firstName">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              className={styles.input}
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="lastName">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              className={styles.input}
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
            />
            {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.email && <span className={styles.errorText}>{errors.email}</span>}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="phone">Phone (Optional)</label>
          <input 
            type="tel" 
            id="phone" 
            className={styles.input}
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            className={styles.input}
            value={formData.password}
            onChange={handleChange}
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
            onChange={handleChange}
            disabled={isLoading}
          />
          {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
        </div>

        <div className={styles.checkboxGroup}>
          <input 
            type="checkbox" 
            id="agreeTerms" 
            checked={formData.agreeTerms}
            onChange={handleChange}
            disabled={isLoading}
          />
          <label htmlFor="agreeTerms">
            I agree to the <Link href="/terms">Terms & Conditions</Link> and <Link href="/privacy">Privacy Policy</Link>.
          </label>
        </div>
        {errors.agreeTerms && <span className={styles.errorText} style={{ marginTop: '-1rem' }}>{errors.agreeTerms}</span>}

        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
        </Button>
      </form>

      <div className={styles.footer}>
        Already have an account?
        <Link href="/login" className={styles.footerLink}>
          LOGIN
        </Link>
      </div>
    </AuthLayout>
  );
}
