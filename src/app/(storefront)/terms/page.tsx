import React from 'react';
import styles from '../legal.module.css';
import SectionHeading from '@/components/SectionHeading';

export const metadata = {
  title: 'Terms & Conditions | DERRUME',
  description: 'Terms & Conditions for DERRUME',
};

export default function TermsConditionsPage() {
  return (
    <div className={styles.legal}>
      <div className="container animate-fade-in">
        <div className={styles.header}>
          <SectionHeading subtitle="DERRUME" centered>
            TERMS & CONDITIONS
          </SectionHeading>
        </div>
        
        <div className={styles.content}>
          <h2>1. Introduction</h2>
          <p>
            These terms and conditions govern your use of the DERRUME website and the purchase of any products from it. By accessing this website and/or placing an order, you agree to be bound by these terms and conditions.
          </p>

          <h2>2. Products</h2>
          <p>
            All products are subject to availability. We reserve the right to discontinue any product at any time. We have made every effort to display as accurately as possible the colors and images of our products that appear at the store. We cannot guarantee that your computer monitor&apos;s display of any color will be accurate.
          </p>
          
          <h2>3. Orders and Payments</h2>
          <p>
            By placing an order, you are offering to purchase a product on and subject to the following terms and conditions. All orders are subject to availability and confirmation of the order price.
          </p>
          <ul>
            <li>You must possess a valid credit or debit card issued by a bank acceptable to us.</li>
            <li>Prices for our products are subject to change without notice.</li>
            <li>We reserve the right to refuse any order you place with us.</li>
          </ul>

          <h2>4. Shipping</h2>
          <p>
            Shipping costs and delivery times vary depending on the delivery address and shipping method selected at checkout. We are not responsible for delays outside our control.
          </p>

          <h2>5. Returns and Cancellations</h2>
          <p>
            For hygienic reasons, we cannot accept returns on opened skincare products. If you receive a damaged or incorrect item, please contact us within 48 hours of receipt.
          </p>

          <h2>6. User Accounts</h2>
          <p>
            If you create an account on our website, you are responsible for maintaining the security of your account and you are fully responsible for all activities that occur under the account.
          </p>

          <h2>7. Intellectual Property</h2>
          <p>
            All content included on this site, such as text, graphics, logos, button icons, images, and software, is the property of DERRUME or its content suppliers and protected by international copyright laws.
          </p>
          
          <h2>8. Contact</h2>
          <p>
            Questions about the Terms of Service should be sent to us at:
            <br /><br />
            Email: legal@derrume.com
          </p>
        </div>
      </div>
    </div>
  );
}
