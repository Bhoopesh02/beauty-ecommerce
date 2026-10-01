import React from 'react';
import styles from '../legal.module.css';
import SectionHeading from '@/components/SectionHeading';

export const metadata = {
  title: 'Privacy Policy | DERRUME',
  description: 'Privacy Policy for DERRUME',
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.legal}>
      <div className="container animate-fade-in">
        <div className={styles.header}>
          <SectionHeading subtitle="DERRUME" centered>
            PRIVACY POLICY
          </SectionHeading>
        </div>
        
        <div className={styles.content}>
          <h2>1. Introduction</h2>
          <p>
            Welcome to DERRUME. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>

          <h2>2. The Data We Collect About You</h2>
          <p>
            Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows:
          </p>
          <ul>
            <li><strong>Identity Data</strong> includes first name, last name, username or similar identifier.</li>
            <li><strong>Contact Data</strong> includes billing address, delivery address, email address and telephone numbers.</li>
            <li><strong>Financial Data</strong> includes bank account and payment card details (processed securely via our payment providers).</li>
            <li><strong>Transaction Data</strong> includes details about payments to and from you and other details of products you have purchased from us.</li>
          </ul>

          <h2>3. How We Use Your Personal Data</h2>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul>
            <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., processing your order).</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
            <li>Where we need to comply with a legal or regulatory obligation.</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
          </p>

          <h2>5. Your Legal Rights</h2>
          <p>
            Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data and (where the lawful ground of processing is consent) to withdraw consent.
          </p>
          
          <h2>6. Contact Details</h2>
          <p>
            If you have any questions about this privacy policy or our privacy practices, please contact us at:
            <br /><br />
            Email: privacy@derrume.com
          </p>
        </div>
      </div>
    </div>
  );
}
