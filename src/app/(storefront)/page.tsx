'use client';

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import Button from "@/components/Button";
import SectionHeading from "@/components/SectionHeading";
import ProductCard from "@/components/ProductCard";
import { defaultProducts } from "@/data/products";
import FadeIn from "@/components/motion/FadeIn";
import RevealOnScroll from "@/components/motion/RevealOnScroll";
import StaggerContainer from "@/components/motion/StaggerContainer";
import StaggerItem from "@/components/motion/StaggerItem";

export default function Home() {
  const featuredProducts = defaultProducts.filter(p => p.featured).slice(0, 4);
  const bestSellers = defaultProducts.filter(p => p.bestseller).slice(0, 4);

  return (
    <div className={styles.page}>
      {/* 1. HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image src="/images/stock/home-hero/home-hero-4k.webp" alt="Botanical flat lay" fill sizes="100vw" unoptimized style={{objectFit: 'cover'}} priority />
        </div>
        <div className={`container ${styles.heroContainer}`}>
          <FadeIn delay={0.2} duration={0.8} className={styles.heroContent}>
            <h1 className="heading-hero">NATURE,<br />BOTTLED<br />BEAUTIFULLY.</h1>
            <p className={styles.heroSubtitle}>100% Natural. Homemade. Pure.</p>
            <div className={styles.heroActions}>
              <Button href="/products">SHOP THE COLLECTION</Button>
              <Button href="/about" variant="outline">OUR STORY</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* 2. DERRUME PROMISE */}
      <section className={styles.promise}>
        <StaggerContainer className={`container ${styles.promiseContainer}`} delayChildren={0.4} staggerChildren={0.15}>
          <StaggerItem className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <span>100% NATURAL</span>
          </StaggerItem>
          <StaggerItem className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <span>HANDMADE</span>
          </StaggerItem>
          <StaggerItem className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <span>PURE INGREDIENTS</span>
          </StaggerItem>
          <StaggerItem className={styles.promiseItem}>
            <span className={styles.promiseIcon}>✧</span>
            <span>MADE WITH CARE</span>
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 3. FEATURED PRODUCTS */}
      <section className="section-spacing container" style={{ paddingBottom: 0 }}>
        <RevealOnScroll>
          <SectionHeading 
            title="A RITUAL WORTH KEEPING" 
            subtitle="Discover the products our customers reach for again and again." 
          />
        </RevealOnScroll>
        <StaggerContainer className={styles.productGrid} staggerChildren={0.1}>
          {featuredProducts.map(product => (
            <StaggerItem key={product.id}>
              <ProductCard product={product} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 4. CHOOSE YOUR RITUAL */}
      <section className={`section-spacing ${styles.ritualsSection}`}>
        <div className="container">
          <RevealOnScroll>
            <SectionHeading title="CHOOSE YOUR RITUAL" />
          </RevealOnScroll>
          <StaggerContainer className={styles.ritualsGrid} staggerChildren={0.2}>
            <StaggerItem className={styles.ritualCard}>
              <div className={styles.ritualImagePlaceholder}>
                <Image src="/images/stock/categories/skincare-4k.webp" alt="Skincare Ritual" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.ritualContent}>
                <h3 className={styles.ritualTitle}>THE GLOW RITUAL</h3>
                <p className={styles.ritualType}>Skin Care</p>
              </div>
            </StaggerItem>
            <StaggerItem className={styles.ritualCard}>
              <div className={styles.ritualImagePlaceholder}>
                <Image src="/images/stock/categories/haircare-4k.webp" alt="Haircare Ritual" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.ritualContent}>
                <h3 className={styles.ritualTitle}>THE HAIR RITUAL</h3>
                <p className={styles.ritualType}>Hair Care</p>
              </div>
            </StaggerItem>
            <StaggerItem className={styles.ritualCard}>
              <div className={styles.ritualImagePlaceholder}>
                <Image src="/images/stock/categories/combos-4k.webp" alt="Everyday Ritual" fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized style={{objectFit: 'cover'}} />
              </div>
              <div className={styles.ritualContent}>
                <h3 className={styles.ritualTitle}>THE EVERYDAY RITUAL</h3>
                <p className={styles.ritualType}>Daily Care</p>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </section>

      {/* 5. SHOP BY CONCERN */}
      <section className="section-spacing container" style={{ paddingBottom: 0 }}>
        <RevealOnScroll>
          <SectionHeading title="WHAT DOES YOUR SKIN NEED?" />
        </RevealOnScroll>
        <StaggerContainer className={styles.concernGrid} staggerChildren={0.1}>
          {['HYDRATION', 'GLOW', 'CLEANSING', 'NOURISHMENT'].map((concern) => (
            <StaggerItem key={concern}>
              <Link href={`/products?concern=${concern.toLowerCase()}`} className={styles.concernCard}>
                {concern}
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 6. BRAND STORY */}
      <section className={`section-spacing ${styles.storySection}`} style={{ paddingBottom: 0 }}>
        <StaggerContainer className={`container ${styles.storyContainer}`} staggerChildren={0.2}>
          <StaggerItem className={styles.storyContent}>
            <h2 className="heading-section">FROM NATURE,<br />WITH INTENTION.</h2>
            <p className={styles.storyText}>
              DERRUME is built around a simple belief: skincare should feel pure, personal and uncomplicated.
            </p>
            <Button href="/about" variant="outline">READ OUR STORY</Button>
          </StaggerItem>
          <StaggerItem className={styles.storyImagePlaceholder}>
            <div className={styles.storyOrbit}></div>
            <Image src="/images/stock/about/about-story.webp" alt="Botanicals in a wooden bowl" fill sizes="(max-width: 768px) 100vw, 50vw" style={{objectFit: 'cover'}} />
          </StaggerItem>
        </StaggerContainer>
      </section>

      {/* 7. INGREDIENT GARDEN */}
      <section className="section-spacing container" style={{ paddingBottom: 0 }}>
        <RevealOnScroll>
          <SectionHeading title="WHAT NATURE GIVES US" />
        </RevealOnScroll>
        <StaggerContainer className={styles.ingredientGrid}>
          {[
            { name: 'ROSE', image: '/images/stock/ingredients/rose.webp' },
            { name: 'ALOE', image: '/images/stock/ingredients/aloe.webp' },
            { name: 'NEEM', image: '/images/stock/ingredients/neem.webp' },
            { name: 'TURMERIC', image: '/images/stock/ingredients/turmeric.webp' }
          ].map((ingredient) => (
            <StaggerItem key={ingredient.name} className={styles.ingredientCard}>
              <div className={styles.ingredientImagePlaceholder} style={{position: 'relative', overflow: 'hidden'}}>
                <Image src={ingredient.image} alt={`Illustration of ${ingredient.name}`} fill sizes="(max-width: 768px) 50vw, 25vw" style={{objectFit: 'cover'}} />
              </div>
              <h4 className={styles.ingredientTitle}>{ingredient.name}</h4>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 8. MADE BY HAND */}
      <section className={`section-spacing ${styles.handmadeSection}`}>
        <StaggerContainer className={`container ${styles.handmadeContainer}`}>
          <StaggerItem className={styles.handmadeImagePlaceholder}>
            <Image src="/images/stock/auth/auth-side-4k.webp" alt="Handmade Care" fill sizes="(max-width: 768px) 100vw, 50vw" unoptimized style={{objectFit: 'cover'}} />
          </StaggerItem>
          <StaggerItem className={styles.handmadeContent}>
            <h2 className="heading-section">MADE WITH<br />HUMAN HANDS.</h2>
            <p className={styles.handmadeText}>
              Small batches.<br />
              Thoughtful ingredients.<br />
              Personal care.
            </p>
          </StaggerItem>
        </StaggerContainer>
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
            <div key={i} className={styles.instaImagePlaceholder} style={{ position: 'relative', overflow: 'hidden' }}>
              <Image 
                src={`/images/stock/insta/insta_${i}.jpg`} 
                alt={`Botanical Journal image ${i}`} 
                fill 
                sizes="(max-width: 768px) 50vw, 25vw" 
                style={{ objectFit: 'cover', transition: 'transform 0.5s ease' }} 
                className="hover-scale"
              />
            </div>
          ))}
        </div>
        <div className={styles.instaAction}>
          <Button href="https://instagram.com" variant="outline" style={{ display: 'inline-flex', alignItems: 'center' }} target="_blank">
            FOLLOW @derrume
          </Button>
        </div>
      </section>

      {/* 12. NEWSLETTER */}
      <section className={styles.newsletterSection}>
        <div className={`container ${styles.newsletterContainer}`}>
          <SectionHeading 
            title="A LITTLE MORE NATURE, IN YOUR INBOX." 
            subtitle="New rituals. New products. Botanical notes." 
          />
          <form className={styles.newsletterForm} onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const btn = form.querySelector('button');
            if (btn) btn.textContent = 'JOINED!';
            setTimeout(() => { if (btn) btn.textContent = 'JOIN'; form.reset(); }, 3000);
          }}>
            <input type="email" placeholder="Enter your email" className={styles.newsletterInput} required />
            <Button type="submit">JOIN</Button>
          </form>
        </div>
      </section>
    </div>
  );
}
