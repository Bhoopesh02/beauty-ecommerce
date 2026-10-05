'use client';

import React, { useState, useEffect, use, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/motion/PageTransition';
import FadeIn from '@/components/motion/FadeIn';
import RevealOnScroll from '@/components/motion/RevealOnScroll';
import OrderStatusTimeline from '@/components/orders/OrderStatusTimeline';
import TrackingModal from '@/components/orders/TrackingModal';
import CancelOrderModal from '@/components/orders/CancelOrderModal';
import ReturnOrderModal from '@/components/orders/ReturnOrderModal';
import OrderNotFound from '@/components/orders/OrderNotFound';
import { orderService } from '@/services/orderService';
import { Order } from '@/types';
import { formatPrice, formatDate, isCancellable, isReturnEligible, getStatusMessage } from '@/utils/orderUtils';
import styles from './page.module.css';

export default function OrderDetailsPage({
  params
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const loadOrder = useCallback(async () => {
    try {
      const fetched = await orderService.getOrderById(orderId);
      setOrder(fetched);
    } catch (err) {
      console.error('Error fetching order:', err);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleConfirmCancel = async (id: string, reason: string) => {
    const updated = await orderService.cancelOrder(id, reason);
    if (updated) {
      setOrder(updated);
      setFeedbackMsg('Your order has been cancelled.');
      setTimeout(() => setFeedbackMsg(''), 5000);
    }
  };

  const handleConfirmReturn = async (id: string, reason: string) => {
    const updated = await orderService.requestReturn(id, reason);
    if (updated) {
      setOrder(updated);
      setFeedbackMsg('Return request submitted. Our courier partner will schedule reverse pickup.');
      setTimeout(() => setFeedbackMsg(''), 6000);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ padding: '6rem 0', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading order details...
        </div>
      </div>
    );
  }

  if (!order) {
    return <OrderNotFound />;
  }

  const cancellable = isCancellable(order.orderStatus);
  const returnEligible = isReturnEligible(order);
  const statusMsg = getStatusMessage(order.orderStatus);

  return (
    <PageTransition>
      <div className={styles.container}>
        {/* Back Link */}
        <Link href="/account/orders" className={styles.backLink}>
          <ArrowLeft size={15} /> Back to Orders
        </Link>

        {/* Header */}
        <header className={styles.header}>
          <div>
            <h1 className={styles.orderId}>ORDER #{order.id}</h1>
            <div className={styles.orderDate}>
              Placed on {formatDate(order.createdAt)}
            </div>
          </div>

          <div className={styles.headerActions}>
            {order.orderStatus !== 'Cancelled' && (
              <button
                type="button"
                className={styles.actionBtnSecondary}
                onClick={() => setIsTrackingOpen(true)}
              >
                TRACK ORDER
              </button>
            )}

            {cancellable && (
              <button
                type="button"
                className={styles.actionBtnMuted}
                onClick={() => setIsCancelOpen(true)}
              >
                CANCEL ORDER
              </button>
            )}

            {returnEligible && (
              <button
                type="button"
                className={styles.actionBtnOutline}
                onClick={() => setIsReturnOpen(true)}
              >
                REQUEST RETURN
              </button>
            )}
          </div>
        </header>

        {/* Feedback message */}
        {feedbackMsg && (
          <FadeIn duration={0.3}>
            <div className={styles.returnBanner} style={{ marginBottom: '1.5rem' }}>
              {feedbackMsg}
            </div>
          </FadeIn>
        )}

        {/* Status Banner */}
        <div className={styles.statusBanner}>
          <div className={styles.statusHeadline}>
            <span>{order.orderStatus}</span>
          </div>
          <p className={styles.statusMessage}>{statusMsg}</p>
          {order.returnStatus === 'requested' && (
            <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: 'var(--brand-violet)', fontWeight: 600 }}>
              &bull; Return Request Under Review ({order.returnReason})
            </div>
          )}
        </div>

        {/* Order Status Timeline */}
        <div className={styles.section} style={{ marginBottom: '2.5rem' }}>
          <h2 className={styles.sectionTitle}>Order Status</h2>
          <OrderStatusTimeline order={order} />
        </div>

        {/* Two Column Layout */}
        <div className={styles.grid}>
          {/* Main Column: Items */}
          <div className={styles.mainCol}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Items ({order.items.reduce((acc, i) => acc + i.quantity, 0)})</h2>
              <div className={styles.itemsList}>
                {order.items.map((item, idx) => {
                  const productHref = item.slug ? `/products/${item.slug}` : '/products';
                  return (
                    <div key={idx} className={styles.itemRow}>
                      <Link href={productHref} className={styles.itemImageWrapper}>
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="80px"
                            style={{ objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ width: '100%', height: '100%', backgroundColor: '#eee' }} />
                        )}
                      </Link>

                      <div className={styles.itemDetails}>
                        <Link href={productHref} className={styles.itemLink}>
                          <h3 className={styles.itemName}>{item.name}</h3>
                        </Link>
                        <div className={styles.itemAttributes}>
                          {[item.color, item.size].filter(Boolean).join(' / ')}
                        </div>
                        <div className={styles.itemQuantity}>
                          Quantity {item.quantity}
                        </div>
                      </div>

                      <div className={styles.itemPrice}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Side Column: Summary, Address, Payment */}
          <div className={styles.sideCol}>
            {/* Order Summary */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Order Summary</h2>
              <div className={styles.summaryTable}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? '₹0' : formatPrice(order.shipping)}</span>
                </div>
                {order.discount > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Discount</span>
                    <span>-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className={styles.summaryTotalRow}>
                  <span className={styles.summaryTotalLabel}>Total</span>
                  <span className={styles.summaryTotalAmount}>{formatPrice(order.total)}</span>
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Delivery Address</h2>
              <div className={styles.infoContent}>
                <div className={styles.infoName}>{order.shippingAddress.fullName}</div>
                <div>{order.shippingAddress.address}</div>
                {order.shippingAddress.landmark && <div>{order.shippingAddress.landmark}</div>}
                <div>{order.shippingAddress.city}, {order.shippingAddress.state}</div>
                <div>{order.shippingAddress.pincode}</div>
                <div>{order.shippingAddress.country || 'India'}</div>
                {order.shippingAddress.phone && (
                  <div style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>
                    Phone: {order.shippingAddress.phone}
                  </div>
                )}
              </div>
            </section>

            {/* Payment Summary */}
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Payment</h2>
              <div className={styles.infoContent}>
                <div className={styles.paymentMethodRow}>
                  <span>{order.paymentDetails?.method || (order.paymentMethod === 'card' ? 'Credit / Debit Card' : order.paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery')}</span>
                  <span className={styles.paymentBadge}>{order.paymentStatus || 'Paid'}</span>
                </div>
                {order.paymentDetails?.cardLast4 && (
                  <div style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                    •••• {order.paymentDetails.cardLast4}
                  </div>
                )}
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Total Paid: {formatPrice(order.total)}
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Modals */}
        <TrackingModal
          order={order}
          isOpen={isTrackingOpen}
          onClose={() => setIsTrackingOpen(false)}
        />

        <CancelOrderModal
          order={order}
          isOpen={isCancelOpen}
          onClose={() => setIsCancelOpen(false)}
          onConfirmCancel={handleConfirmCancel}
        />

        <ReturnOrderModal
          order={order}
          isOpen={isReturnOpen}
          onClose={() => setIsReturnOpen(false)}
          onConfirmReturn={handleConfirmReturn}
        />
      </div>
    </PageTransition>
  );
}
