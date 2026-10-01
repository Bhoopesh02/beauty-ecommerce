'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import { Mail, MessageCircle, AtSign } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  return (
    <div className={styles.contact}>
      <div className="container animate-fade-in">
        <div className={styles.hero}>
          <SectionHeading centered>GET IN TOUCH</SectionHeading>
          <p className={styles.heroSubtitle}>
            Have a question about a product or your order? We&apos;d love to hear from you.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.infoCards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <MessageCircle size={24} />
              </div>
              <div className={styles.cardContent}>
                <h3>WhatsApp</h3>
                <p>+91 (000) 000-0000</p>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <Mail size={24} />
              </div>
              <div className={styles.cardContent}>
                <h3>Email</h3>
                <p>hello@derrume.com</p>
              </div>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <AtSign size={24} />
              </div>
              <div className={styles.cardContent}>
                <h3>Instagram</h3>
                <p>@derrumeorganics</p>
              </div>
            </div>
          </div>

          <div className={styles.formContainer}>
            {isSuccess && (
              <div className={styles.successMessage}>
                Thank you. Your message has been received.
              </div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={styles.input}
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className={styles.input}
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className={styles.textarea}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
