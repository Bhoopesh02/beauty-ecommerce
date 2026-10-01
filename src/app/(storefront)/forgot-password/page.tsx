'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';
import Button from '@/components/Button';
import styles from '@/components/AuthForm.module.css';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Valid email is required');
      return;
    }

    setIsLoading(true);
    setError('');
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsLoading(false);
    setIsSuccess(true);
  };

  return (
    <AuthLayout>
      <h1 className={styles.heading}>FORGOT YOUR PASSWORD?</h1>
      <p className={styles.supportingText}>
        Enter your email address and we&apos;ll help you reset your password.
      </p>

      {isSuccess ? (
        <div className={styles.successMessage}>
          CHECK YOUR EMAIL
          <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
            We have sent a password reset link to {email}.
          </p>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className={styles.input}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              disabled={isLoading}
            />
            {error && <span className={styles.errorText}>{error}</span>}
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? 'SENDING...' : 'SEND RESET LINK'}
          </Button>
        </form>
      )}

      <div className={styles.footer}>
        <Link href="/login" className={styles.footerLink} style={{ marginLeft: 0 }}>
          BACK TO LOGIN
        </Link>
      </div>
    </AuthLayout>
  );
}
