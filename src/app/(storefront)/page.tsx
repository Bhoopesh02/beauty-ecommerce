import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

export default function Home() {
  const featuredProducts = products.filter(p => p.featured).slice(0, 4);
  const bestSellers = products.filter(p => p.bestseller).slice(0, 4);

  return (
    <div className={styles.page}>
      {/* 1. HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image src="/images/stock/home-hero/home-hero.webp" alt="Botanical flat lay" fill sizes="100vw" style={{objectFit: 'cover'}} priority />
        </div>
        <div className={`container ${styles.heroContainer}`}>
          <div className={`${styles.heroContent} animate-fade-in`}>
            <h1 className="heading-hero">NATURE,<br />BOTTLED<br />BEAUTIFULLY.</h1>
            <p className={styles.heroSubtitle}>100% Natural. Homemade. Pure.</p>
            <div className={styles.heroActions}>
              <Button>SHOP THE COLLECTION</Button>
              <Button variant="outline">OUR STORY</Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DERRUME PROMISE */}
      <section className={styles.promise}>
        <div className={`container ${styles.promiseContainer}`}>
          <div className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <span>100% NATURAL</span>
          </div>
          <div className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <span>HANDMADE</span>
          </div>
          <div className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <span>PURE INGREDIENTS</span>
          </div>
          <div className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <span>MADE WITH CARE</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="section-spacing container" style={{ paddingBottom: 0 }}>
        <SectionHeading 
          title="A RITUAL WORTH KEEPING" 
          subtitle="Discover the products our customers reach for again and again." 
        />
        <div className={styles.productGrid}>
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 4. CHOOSE YOUR RITUAL */}
      <section className={`section-spacing ${styles.ritualsSection}`}>
        <div className="container">
          <SectionHeading title="CHOOSE YOUR RITUAL" />
          <div className={styles.ritualsGrid}>
            <div className={styles.ritualCard}>
              <div className={styles.ritualImagePlaceholder}>
                <Image src="/images/stock/categories/skincare.webp" alt="Skincare Ritual" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.ritualContent}>
                <h3 className={styles.ritualTitle}>THE GLOW RITUAL</h3>
                <p className={styles.ritualType}>Skin Care</p>
              </div>
            </div>
            <div className={styles.ritualCard}>
              <div className={styles.ritualImagePlaceholder}>
                <Image src="/images/stock/categories/haircare.webp" alt="Haircare Ritual" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.ritualContent}>
                <h3 className={styles.ritualTitle}>THE HAIR RITUAL</h3>
                <p className={styles.ritualType}>Hair Care</p>
              </div>
            </div>
            <div className={styles.ritualCard}>
              <div className={styles.ritualImagePlaceholder}>
                <Image src="/images/stock/categories/combos.webp" alt="Everyday Ritual" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.ritualContent}>
                <h3 className={styles.ritualTitle}>THE EVERYDAY RITUAL</h3>
                <p className={styles.ritualType}>Daily Care</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY CONCERN */}
      <section className="section-spacing container" style={{ paddingBottom: 0 }}>
        <SectionHeading title="WHAT DOES YOUR SKIN NEED?" />
        <div className={styles.concernGrid}>
          {['HYDRATION', 'GLOW', 'CLEANSING', 'NOURISHMENT'].map((concern) => (
            <Link key={concern} href={`/shop?concern=${concern.toLowerCase()}`} className={styles.concernCard}>
              {concern}
            </Link>
          ))}
        </div>
      </section>

      {/* 6. BRAND STORY */}
      <section className={`section-spacing ${styles.storySection}`} style={{ paddingBottom: 0 }}>
        <div className={`container ${styles.storyContainer}`}>
          <div className={styles.storyContent}>
            <h2 className="heading-section">FROM NATURE,<br />WITH INTENTION.</h2>
            <p className={styles.storyText}>
              DERRUME is built around a simple belief: skincare should feel pure, personal and uncomplicated.
            </p>
            <Button variant="outline">READ OUR STORY</Button>
          </div>
          <div className={styles.storyImagePlaceholder}>
            <div className={styles.storyOrbit}></div>
            <Image src="/images/stock/about/about-story.webp" alt="Botanicals in a wooden bowl" fill sizes="(max-width: 768px) 100vw, 50vw" style={{objectFit: 'cover'}} />
          </div>
        </div>
      </section>

      {/* 7. INGREDIENT GARDEN */}
      <section className="section-spacing container" style={{ paddingBottom: 0 }}>
        <SectionHeading title="WHAT NATURE GIVES US" />
        <div className={styles.ingredientGrid}>
          {[
            { name: 'ROSE', image: '/images/stock/ingredients/rose.webp' },
            { name: 'ALOE', image: '/images/stock/ingredients/aloe.webp' },
            { name: 'NEEM', image: '/images/stock/ingredients/neem.webp' },
            { name: 'TURMERIC', image: '/images/stock/ingredients/turmeric.webp' }
          ].map((ingredient) => (
            <div key={ingredient.name} className={styles.ingredientCard}>
              <div className={styles.ingredientImagePlaceholder} style={{position: 'relative', overflow: 'hidden'}}>
                <Image src={ingredient.image} alt={`Illustration of ${ingredient.name}`} fill sizes="(max-width: 768px) 50vw, 25vw" style={{objectFit: 'cover'}} />
              </div>
              <h4 className={styles.ingredientTitle}>{ingredient.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* 8. MADE BY HAND */}
      <section className={`section-spacing ${styles.handmadeSection}`}>
        <div className={`container ${styles.handmadeContainer}`}>
          <div className={styles.handmadeImagePlaceholder}>
            <Image src="/images/stock/auth/auth-side.webp" alt="Handmade Care" fill sizes="(max-width: 768px) 100vw, 50vw" style={{objectFit: 'cover'}} />
          </div>
          <div className={styles.handmadeContent}>
            <h2 className="heading-section">MADE WITH<br />HUMAN HANDS.</h2>
            <p className={styles.handmadeText}>
              Small batches.<br />
              Thoughtful ingredients.<br />
              Personal care.
            </p>
          </div>
        </div>
      </section>

      {/* 9. BEST SELLERS */}
      <section className="section-spacing container" style={{ paddingBottom: 0 }}>
        <SectionHeading title="THE DERRUME EDIT" />
        <div className={styles.carouselWrapper}>
          <div className={styles.productCarousel}>
            {bestSellers.map(product => (
              <div key={product.id} className={styles.carouselItem}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIALS */}
      <section className={`section-spacing ${styles.testimonialSection}`}>
        <div className="container">
          <SectionHeading title="WHAT THEY SAY" />
          <div className={styles.testimonialGrid}>
            {[1, 2, 3].map(i => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.stars}>★★★★★</div>
                <p className={styles.testimonialQuote}>"Absolutely love the pure, handmade feel of these products. My skin has never looked better."</p>
                <p className={styles.testimonialAuthor}>- Verified Customer</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. INSTAGRAM */}
      <section className="section-spacing container">
        <SectionHeading title="FROM OUR BOTANICAL JOURNAL" />
        <div className={styles.instaGrid}>
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={styles.instaImagePlaceholder}></div>
          ))}
        </div>
        <div className={styles.instaAction}>
          <Button variant="outline">FOLLOW @derrume</Button>
        </div>
      </section>

      {/* 12. NEWSLETTER */}
      <section className={styles.newsletterSection}>
        <div className={`container ${styles.newsletterContainer}`}>
          <SectionHeading 
            title="A LITTLE MORE NATURE, IN YOUR INBOX." 
            subtitle="New rituals. New products. Botanical notes." 
          />
          <form className={styles.newsletterForm}>
            <input type="email" placeholder="Enter your email" className={styles.newsletterInput} required />
            <Button type="submit">JOIN</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
