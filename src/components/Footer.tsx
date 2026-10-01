import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <h2 className={styles.brandName}>DERRUME</h2>
          <p className={styles.tagline}>Natural. Homemade. Pure.</p>
        </div>

        <div className={styles.linkGroup}>
          <h3 className={styles.heading}>SHOP</h3>
          <Link href="/shop" className={styles.link}>All Products</Link>
          <Link href="/category/skin-care" className={styles.link}>Skin Care</Link>
          <Link href="/category/hair-care" className={styles.link}>Hair Care</Link>
          <Link href="/category/combos" className={styles.link}>Combos</Link>
        </div>

        <div className={styles.linkGroup}>
          <h3 className={styles.heading}>COMPANY</h3>
          <Link href="/about" className={styles.link}>About Us</Link>
          <Link href="/contact" className={styles.link}>Contact Us</Link>
        </div>

        <div className={styles.linkGroup}>
          <h3 className={styles.heading}>ACCOUNT</h3>
          <Link href="/login" className={styles.link}>Login</Link>
          <Link href="/account" className={styles.link}>My Account</Link>
          <Link href="/account/orders" className={styles.link}>Orders</Link>
          <Link href="/wishlist" className={styles.link}>Wishlist</Link>
        </div>

        <div className={styles.linkGroup}>
          <h3 className={styles.heading}>CONNECT</h3>
          <a href="#" className={styles.link}>Instagram</a>
          <a href="#" className={styles.link}>WhatsApp</a>
          <a href="#" className={styles.link}>Email</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`container ${styles.bottomContent}`}>
          <p>&copy; {new Date().getFullYear()} DERRUME</p>
          <div className={styles.legalLinks}>
            <Link href="/privacy" className={styles.link}>Privacy Policy</Link>
            <Link href="/terms" className={styles.link}>Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
