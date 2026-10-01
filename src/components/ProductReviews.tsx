import React, { useState } from 'react';
import styles from './ProductReviews.module.css';
import Button from './Button';

interface Review {
  id: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  images?: string[];
  variant?: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  helpfulCount: number;
  createdAt: string;
  reviewerName: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showWriteReview, setShowWriteReview] = useState(false);

  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const totalReviews = reviews.length;
  
  return (
    <section id="reviews" className={`section-spacing ${styles.reviewsSection}`}>
      <div className="container">
        <h2 className={styles.sectionTitle} style={{ fontFamily: 'var(--font-cinzel)', textAlign: 'center', marginBottom: '2rem' }}>
          CUSTOMER REVIEWS
        </h2>
        
        {totalReviews > 0 ? (
          <>
            <div className={styles.summaryBlock} style={{ backgroundColor: '#F3D9E5', padding: '2rem', borderRadius: '8px', display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
              <div className={styles.averageRating} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#4A3267' }}>{averageRating}</div>
                <div className={styles.stars} style={{ color: '#DE638A', fontSize: '1.5rem' }}>★★★★★</div>
                <div style={{ color: 'var(--text-secondary)' }}>Based on {totalReviews} reviews</div>
              </div>
              
              <div className={styles.distribution} style={{ flex: 1, minWidth: '250px' }}>
                {[5, 4, 3, 2, 1].map(star => (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ width: '1rem', textAlign: 'right' }}>{star}</span>
                    <span style={{ color: '#DE638A' }}>★</span>
                    <div style={{ flex: 1, height: '8px', backgroundColor: '#E8DDE4', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${(reviews.filter(r => r.rating === star).length / totalReviews) * 100}%`, height: '100%', backgroundColor: '#DE638A' }} />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.writeReviewCta}>
                <Button variant="primary" onClick={() => setShowWriteReview(true)}>
                  WRITE A REVIEW
                </Button>
              </div>
            </div>

            <div className={styles.controls} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', marginBottom: '1rem' }}>
              <select style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                <option>Most Recent</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
                <option>Most Helpful</option>
              </select>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input type="checkbox" /> With Photos
              </label>
            </div>

            <div className={styles.reviewList}>
              {reviews.map(review => (
                <div key={review.id} className={styles.reviewCard} style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8DDE4', borderRadius: '8px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <div style={{ color: '#DE638A' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</div>
                      <strong style={{ fontFamily: 'var(--font-cinzel)' }}>{review.title}</strong>
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                    <strong>{review.reviewerName}</strong> 
                    {review.verifiedPurchase && <span style={{ color: 'green', marginLeft: '0.5rem' }}>✓ Verified Purchase</span>}
                    {review.variant && <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>| Size: {review.variant}</span>}
                  </div>
                  
                  <p style={{ marginBottom: '1rem' }}>{review.body}</p>
                  
                  <button style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.875rem' }}>
                    Helpful ({review.helpfulCount})
                  </button>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Button variant="outline">LOAD MORE</Button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: '#FFFFFF', border: '1px solid #E8DDE4', borderRadius: '8px' }}>
            <h3 style={{ fontFamily: 'var(--font-cinzel)', marginBottom: '1rem' }}>BE THE FIRST TO REVIEW</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Share your experience with this product.</p>
            <Button variant="primary" onClick={() => setShowWriteReview(true)}>
              WRITE A REVIEW
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
