import React from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import SectionHeading from '@/components/SectionHeading';
import Button from '@/components/Button';
import Link from 'next/link';
import { Droplet, Leaf, Sparkles, Heart } from 'lucide-react';

export const metadata = {
  title: 'About Us | DERRUME',
  description: 'Learn about our philosophy, our process, and what makes DERRUME pure and rooted in nature.',
};

export default function AboutPage() {
  return (
    <div className={styles.about}>
      <div className="container animate-fade-in">
        <div className={styles.hero}>
          <SectionHeading subtitle="ABOUT DERRUME" centered>
            BEAUTY,<br />ROOTED IN NATURE.
          </SectionHeading>
          <p className={styles.heroSubtitle}>
            100% Natural. Homemade. Pure.
          </p>
        </div>

        <div className={styles.heroImageWrapper}>
          <div style={{ position: 'relative', width: '100%', height: '60vh', borderRadius: '8px', marginBottom: 'var(--space-section-desktop)', overflow: 'hidden' }}>
            <Image src="/images/stock/about/about-hero.webp" alt="Botanical garden" fill style={{objectFit: 'cover'}} priority />
          </div>
        </div>

        <section className={styles.story}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '8px', overflow: 'hidden' }}>
            <Image src="/images/stock/about/about-story.webp" alt="Botanical ingredients" fill style={{objectFit: 'cover'}} />
          </div>
          
          <div className={styles.storyText}>
            <SectionHeading subtitle="OUR STORY">
              FROM NATURE,<br />WITH INTENTION.
            </SectionHeading>
            <p>
              At DERRUME, we believe that true beauty stems from the earth. Every ingredient we choose is thoughtfully sourced, honoring the ancient rituals of natural care.
            </p>
            <p>
              We craft each product in small batches, ensuring purity, potency, and a profound connection to nature. Our formulations are free from harsh chemicals, synthetic fragrances, and artificial preservatives.
            </p>
            <p>
              Our intention is simple: to create rituals that nourish your skin, body, and soul, letting your natural radiance shine through.
            </p>
          </div>
        </section>

        <section className={styles.philosophy}>
          <SectionHeading subtitle="OUR PHILOSOPHY" centered>
            GUIDING PRINCIPLES
          </SectionHeading>
          <div className={styles.philosophyGrid}>
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyIcon}><Leaf size={24} /></div>
              <h3>NATURAL</h3>
              <p>Harnessing the raw, unadulterated power of botanical extracts and earthy elements.</p>
            </div>
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyIcon}><Heart size={24} /></div>
              <h3>HANDMADE</h3>
              <p>Crafted in small, mindful batches to ensure the highest quality and freshest care.</p>
            </div>
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyIcon}><Droplet size={24} /></div>
              <h3>PURE</h3>
              <p>Free from toxins, synthetics, and fillers. Just potent, active ingredients.</p>
            </div>
            <div className={styles.philosophyCard}>
              <div className={styles.philosophyIcon}><Sparkles size={24} /></div>
              <h3>THOUGHTFUL</h3>
              <p>Designed as rituals that elevate your daily routine into a moment of mindfulness.</p>
            </div>
          </div>
        </section>

        <section className={styles.process}>
          <SectionHeading subtitle="THE HANDMADE PROCESS" centered>
            HOW WE CRAFT
          </SectionHeading>
          <div className={styles.timeline}>
            <div className={styles.timelineStep}>
              <div className={styles.stepNumber}>01</div>
              <div className={styles.stepContent}>
                <h3>SELECT</h3>
                <p>Sourcing the finest raw botanicals.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <div className={styles.stepNumber}>02</div>
              <div className={styles.stepContent}>
                <h3>PREPARE</h3>
                <p>Gentle extraction and preparation.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <div className={styles.stepNumber}>03</div>
              <div className={styles.stepContent}>
                <h3>CREATE</h3>
                <p>Blending our formulas by hand.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <div className={styles.stepNumber}>04</div>
              <div className={styles.stepContent}>
                <h3>PACK</h3>
                <p>Mindful packaging to preserve potency.</p>
              </div>
            </div>
            <div className={styles.timelineStep}>
              <div className={styles.stepNumber}>05</div>
              <div className={styles.stepContent}>
                <h3>DELIVER</h3>
                <p>Freshly crafted care, sent to you.</p>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.promise}>
          <h2>PURE CARE.<br />THOUGHTFULLY MADE.</h2>
        </section>

        <section className={styles.cta}>
          <SectionHeading centered>
            READY TO BEGIN YOUR RITUAL?
          </SectionHeading>
          <div className={styles.ctaButtons}>
            <Link href="/shop">
              <Button variant="primary">SHOP ALL PRODUCTS</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline">CONTACT US</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
