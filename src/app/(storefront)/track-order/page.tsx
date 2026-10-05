'use client';

import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Package,
  Truck,
  Copy,
  Check,
  Printer,
  Clock,
  MapPin,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  MessageCircle,
  Mail,
  RotateCcw,
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import PageTransition from '@/components/motion/PageTransition';
import FadeIn from '@/components/motion/FadeIn';
import OrderStatusTimeline from '@/components/orders/OrderStatusTimeline';
import { orderService } from '@/services/orderService';
import { Order, OrderStatus } from '@/types';
import { formatPrice, formatDate } from '@/utils/orderUtils';
import styles from './page.module.css';

const SAMPLE_ORDERS = [
  { id: 'DR-10284', label: 'Delivered', status: 'Delivered' },
  { id: 'DR-10283', label: 'In Transit', status: 'Shipped' },
  { id: 'DR-10282', label: 'Confirmed', status: 'Confirmed' },
  { id: 'DR-10281', label: 'Cancelled', status: 'Cancelled' }
];

function TrackOrderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [orderQuery, setOrderQuery] = useState('');
  const [authQuery, setAuthQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copiedTracking, setCopiedTracking] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [recentOrder, setRecentOrder] = useState<Order | null>(null);

  // Check recent order in storage on mount
  useEffect(() => {
    orderService.getLatestOrder().then((latest) => {
      if (latest) {
        setRecentOrder(latest);
      }
    });
  }, []);

  const executeTrack = useCallback(async (trackingId: string, emailOrPhoneVal?: string) => {
    const trimmed = trackingId.trim();
    if (!trimmed) {
      setErrorMsg('Please provide a valid Order ID or Courier Waybill Number.');
      setOrder(null);
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await orderService.trackOrder({
        orderIdOrTracking: trimmed,
        emailOrPhone: emailOrPhoneVal
      });

      if (res.success && res.order) {
        setOrder(res.order);
        setErrorMsg('');
      } else {
        setOrder(null);
        setErrorMsg(res.error || 'No shipment records found for this identifier.');
      }
    } catch {
      setOrder(null);
      setErrorMsg('An unexpected error occurred while querying the tracking network. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle URL query parameters on load (e.g. /track-order?orderId=DR-10283)
  useEffect(() => {
    const paramOrderId = searchParams.get('orderId') || searchParams.get('order') || searchParams.get('trackingNumber');
    if (paramOrderId) {
      setOrderQuery(paramOrderId);
      executeTrack(paramOrderId);
    }
  }, [searchParams, executeTrack]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;
    executeTrack(orderQuery, authQuery);
  };

  const handleSelectSample = (sampleId: string) => {
    setOrderQuery(sampleId);
    executeTrack(sampleId);
  };

  const handleCopyTracking = () => {
    if (!order?.trackingNumber) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(order.trackingNumber);
      setCopiedTracking(true);
      setTimeout(() => setCopiedTracking(false), 2000);
    }
  };

  const handleCopyShareLink = () => {
    if (!order) return;
    if (typeof window !== 'undefined' && navigator.clipboard) {
      const url = `${window.location.origin}/track-order?orderId=${encodeURIComponent(order.id)}`;
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleResetSearch = () => {
    setOrder(null);
    setOrderQuery('');
    setAuthQuery('');
    setErrorMsg('');
    router.replace('/track-order');
  };

  // Status badge styling helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return {
          pillClass: styles.statusPillDelivered,
          text: 'Delivered',
          dotPulse: false
        };
      case 'Shipped':
      case 'Out for Delivery':
        return {
          pillClass: styles.statusPillTransit,
          text: status === 'Out for Delivery' ? 'Out for Delivery' : 'In Transit',
          dotPulse: true
        };
      case 'Cancelled':
        return {
          pillClass: styles.statusPillCancelled,
          text: 'Cancelled',
          dotPulse: false
        };
      case 'Placed':
      case 'Confirmed':
      case 'Packed':
      default:
        return {
          pillClass: styles.statusPillProcessing,
          text: status,
          dotPulse: true
        };
    }
  };

  // Mask phone number for customer privacy: +91 98401 23456 -> +91 98*** **456
  const maskPhone = (phone?: string) => {
    if (!phone) return 'Verified Customer';
    if (phone.length <= 6) return phone;
    const first3 = phone.slice(0, 4);
    const last3 = phone.slice(-3);
    return `${first3}•••••${last3}`;
  };

  return (
    <PageTransition>
      <div className={styles.pageContainer}>
        <div className={styles.inner}>
          {/* Header */}
          <header className={styles.header}>
            <span className={styles.tagline}>Priority Logistics &amp; Dispatch</span>
            <h1 className={styles.title}>TRACK YOUR SHIPMENT</h1>
            <p className={styles.subtitle}>
              Monitor your handcrafted DERRUME beauty formulations with live courier milestone tracking from atelier dispatch to doorstep handover.
            </p>
          </header>

          {/* Search Card */}
          <section className={styles.searchCard} aria-labelledby="tracker-heading">
            <h2 id="tracker-heading" className="sr-only" style={{ display: 'none' }}>
              Track Package Form
            </h2>

            <form onSubmit={handleSubmit} className={styles.searchForm}>
              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="trackingInput" className={styles.label}>
                    Order ID or Tracking AWB
                  </label>
                  <div className={styles.inputWrapper}>
                    <Package size={18} className={styles.inputIcon} />
                    <input
                      id="trackingInput"
                      type="text"
                      className={styles.input}
                      placeholder="e.g. DR-10283 or BD-DR-10283-IN"
                      value={orderQuery}
                      onChange={(e) => setOrderQuery(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="authInput" className={styles.label}>
                    Phone or Email
                    <span className={styles.optionalTag}>(Optional)</span>
                  </label>
                  <div className={styles.inputWrapper}>
                    <Search size={18} className={styles.inputIcon} />
                    <input
                      id="authInput"
                      type="text"
                      className={styles.input}
                      placeholder="Verify phone or email"
                      value={authQuery}
                      onChange={(e) => setAuthQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={loading || !orderQuery.trim()}
                >
                  {loading ? (
                    <>
                      <RotateCcw size={16} className="animate-spin" /> Fetching Status...
                    </>
                  ) : (
                    <>
                      <Truck size={17} /> Track Package
                    </>
                  )}
                </button>

                {order && (
                  <button
                    type="button"
                    onClick={handleResetSearch}
                    className={styles.toolBtn}
                  >
                    <RotateCcw size={14} /> Clear / New Search
                  </button>
                )}
              </div>
            </form>

            {/* Quick Sample Order Pills */}
            <div className={styles.sampleChips}>
              <span className={styles.sampleLabel}>Demo Test Orders:</span>
              {recentOrder && (
                <button
                  type="button"
                  onClick={() => handleSelectSample(recentOrder.id)}
                  className={styles.chipBtn}
                  style={{ borderColor: 'var(--brand-violet)', background: '#efe9f2' }}
                  title="Your latest placed order"
                >
                  <Sparkles size={12} />
                  <span>Latest: #{recentOrder.id}</span>
                  <span className={styles.chipStatus}>{recentOrder.orderStatus}</span>
                </button>
              )}
              {SAMPLE_ORDERS.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleSelectSample(sample.id)}
                  className={styles.chipBtn}
                >
                  <span>{sample.id}</span>
                  <span className={styles.chipStatus}>{sample.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Error Banner */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                className={styles.errorBanner}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                role="alert"
              >
                <AlertCircle size={22} className={styles.errorIcon} />
                <div className={styles.errorContent}>
                  <div className={styles.errorTitle}>Shipment Not Found</div>
                  <div className={styles.errorMsg}>
                    {errorMsg}
                    <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem' }}>
                      Tips: Double check the Order ID in your confirmation email or invoice. You can also try clicking one of the demo test order chips above.
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Section */}
          {order && (
            <FadeIn>
              <div className={styles.resultSection}>
                {/* Summary Card */}
                <div className={styles.summaryCard}>
                  <div className={styles.summaryHeader}>
                    <div className={styles.orderIdentity}>
                      <h2 className={styles.orderTitle}>ORDER #{order.id}</h2>
                      <span className={styles.orderDateText}>
                        Placed on {formatDate(order.createdAt)}
                      </span>
                    </div>

                    <div className={styles.statusBadgeGroup}>
                      {(() => {
                        const badge = getStatusBadge(order.orderStatus);
                        return (
                          <div className={`${styles.statusPill} ${badge.pillClass}`}>
                            <span
                              className={`${styles.statusDot} ${badge.dotPulse ? styles.statusDotActive : ''}`}
                            />
                            <span>{badge.text}</span>
                          </div>
                        );
                      })()}
                      <span className={styles.etaText}>
                        {order.orderStatus === 'Delivered'
                          ? `Delivered on ${formatDate(order.deliveredAt || order.createdAt)}`
                          : order.estimatedDelivery
                          ? `Estimated Delivery: ${formatDate(order.estimatedDelivery)}`
                          : 'Expected within 2-3 business days'}
                      </span>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className={styles.metricsGrid}>
                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Carrier Partner</span>
                      <span className={styles.metricValue}>
                        <Truck size={16} style={{ color: 'var(--brand-violet)' }} />
                        {order.carrier || 'BlueDart Apex Luxury'}
                      </span>
                    </div>

                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Waybill / AWB</span>
                      <div className={styles.metricValue}>
                        <span style={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                          {order.trackingNumber || `BD-${order.id}-IN`}
                        </span>
                        <button
                          type="button"
                          className={styles.copyIconBtn}
                          onClick={handleCopyTracking}
                          title="Copy tracking number"
                          aria-label="Copy tracking number"
                        >
                          {copiedTracking ? <Check size={13} /> : <Copy size={13} />}
                        </button>
                      </div>
                    </div>

                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Destination</span>
                      <span className={styles.metricValue}>
                        <MapPin size={16} style={{ color: 'var(--brand-violet)' }} />
                        {order.shippingAddress?.city}, {order.shippingAddress?.state}
                      </span>
                    </div>

                    <div className={styles.metricItem}>
                      <span className={styles.metricLabel}>Total Value</span>
                      <span className={styles.metricValue}>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  {/* Action Toolbar */}
                  <div className={styles.actionToolbar}>
                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={handleCopyShareLink}
                    >
                      {copiedLink ? <Check size={14} /> : <Share2 size={14} />}
                      {copiedLink ? 'Link Copied!' : 'Share Tracking Link'}
                    </button>

                    <button
                      type="button"
                      className={styles.toolBtn}
                      onClick={handlePrint}
                    >
                      <Printer size={14} /> Print Summary
                    </button>

                    <Link
                      href={`/account/orders/${order.id}`}
                      className={styles.toolBtn}
                    >
                      <ExternalLink size={14} /> View Account Order
                    </Link>
                  </div>
                </div>

                {/* Milestone Progress Bar */}
                <div className={styles.timelineCard}>
                  <h3 className={styles.sectionHeading}>
                    <Clock size={18} /> Delivery Progression
                  </h3>
                  <OrderStatusTimeline order={order} />
                </div>

                {/* Checkpoint Milestones Log */}
                <div className={styles.checkpointsCard}>
                  <h3 className={styles.sectionHeading}>
                    <MapPin size={18} /> Live Transit Milestones
                  </h3>

                  <div className={styles.checkpointsList}>
                    {(order.trackingCheckpoints && order.trackingCheckpoints.length > 0
                      ? order.trackingCheckpoints
                      : [
                          {
                            status: order.orderStatus,
                            location: 'DERRUME Logistics Hub',
                            timestamp: order.createdAt,
                            description: `Current order status: ${order.orderStatus}`
                          }
                        ]
                    ).map((cp, idx) => (
                      <div
                        key={idx}
                        className={`${styles.checkpointRow} ${idx === 0 ? styles.checkpointRowActive : ''}`}
                      >
                        <div className={styles.checkpointMarker} />
                        <div className={styles.checkpointHeader}>
                          <span className={styles.checkpointStatus}>{cp.status}</span>
                          <span className={styles.checkpointTime}>
                            {formatDate(cp.timestamp)}
                          </span>
                        </div>
                        <div className={styles.checkpointLocation}>{cp.location}</div>
                        <p className={styles.checkpointDesc}>{cp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Two-Column Details: Parcel Items & Destination */}
                <div className={styles.detailsGrid}>
                  {/* Parcel Items */}
                  <div className={styles.detailsCard}>
                    <h3 className={styles.sectionHeading}>
                      <Package size={18} /> Items in this Parcel ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                    </h3>

                    <div className={styles.itemList}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className={styles.itemRow}>
                          <div className={styles.itemImageWrapper}>
                            {item.image ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                sizes="64px"
                                style={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <div
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#bbb'
                                }}
                              >
                                <Package size={20} />
                              </div>
                            )}
                          </div>

                          <div className={styles.itemInfo}>
                            <h4 className={styles.itemName}>{item.name}</h4>
                            <div className={styles.itemMeta}>
                              {[item.color, item.size].filter(Boolean).join(' • ')}
                              {item.size ? ` • Qty ${item.quantity}` : `Qty ${item.quantity}`}
                            </div>
                          </div>

                          <div className={styles.itemPrice}>
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Destination & Concierge Support */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div className={styles.detailsCard}>
                      <h3 className={styles.sectionHeading}>
                        <MapPin size={18} /> Delivery Destination
                      </h3>

                      <div className={styles.addressBlock}>
                        <div className={styles.recipientName}>
                          {order.shippingAddress?.fullName || 'Valued Client'}
                        </div>
                        <div>{order.shippingAddress?.address}</div>
                        {order.shippingAddress?.landmark && (
                          <div>{order.shippingAddress.landmark}</div>
                        )}
                        <div>
                          {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                        </div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginTop: '0.35rem' }}>
                          Phone: {maskPhone(order.shippingAddress?.phone)}
                        </div>
                      </div>
                    </div>

                    {/* Support Box */}
                    <div className={styles.supportCard}>
                      <h4 className={styles.supportTitle}>Need Help with this Shipment?</h4>
                      <p className={styles.supportText}>
                        Our luxury concierge desk is available to assist with delivery scheduling, address modifications, or inquiries.
                      </p>

                      <div className={styles.supportActions}>
                        <a
                          href={`https://wa.me/919840123456?text=${encodeURIComponent(`Hello DERRUME Concierge, I am inquiring about tracking for Order #${order.id}.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.conciergeBtn}
                        >
                          <MessageCircle size={14} /> WhatsApp Concierge
                        </a>

                        <a
                          href={`mailto:contact@derrume.com?subject=${encodeURIComponent(`Shipment Tracking Inquiry: Order #${order.id}`)}&body=${encodeURIComponent(`Hi DERRUME Team,\n\nI have a question regarding my order #${order.id} with tracking number ${order.trackingNumber}.\n\nThank you.`)}`}
                          className={styles.emailBtn}
                        >
                          <Mail size={14} /> Email Support
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          {/* Informational Pillars (Shown when no search is active or underneath) */}
          {!order && (
            <>
              <div className={styles.infoPillars}>
                <div className={styles.pillarCard}>
                  <div className={styles.pillarIcon}>
                    <ShieldCheck size={24} />
                  </div>
                  <h3 className={styles.pillarTitle}>Atelier Certification</h3>
                  <p className={styles.pillarDesc}>
                    Every botanical elixir is hand-inspected, batched in small artisanal runs, and sealed with our signature tamper-evident wax seal before courier handover.
                  </p>
                </div>

                <div className={styles.pillarCard}>
                  <div className={styles.pillarIcon}>
                    <Truck size={24} />
                  </div>
                  <h3 className={styles.pillarTitle}>Climate-Controlled Dispatch</h3>
                  <p className={styles.pillarDesc}>
                    Our priority air network ensures delicate cold-pressed botanicals and virgin active oils remain in optimal thermal conditions throughout transit.
                  </p>
                </div>

                <div className={styles.pillarCard}>
                  <div className={styles.pillarIcon}>
                    <Sparkles size={24} />
                  </div>
                  <h3 className={styles.pillarTitle}>Real-Time Telemetry</h3>
                  <p className={styles.pillarDesc}>
                    Continuous electronic milestone synchronization ensures you receive real-time notifications at each logistical transition until doorstep delivery.
                  </p>
                </div>
              </div>

              {/* FAQs */}
              <div className={styles.faqSection}>
                <h2 className={styles.faqTitle}>Frequently Asked Tracking Questions</h2>
                <div className={styles.faqGrid}>
                  <div className={styles.faqCard}>
                    <h3 className={styles.faqQuestion}>Where can I find my Order ID or AWB?</h3>
                    <p className={styles.faqAnswer}>
                      Your Order ID (e.g. DR-10283) is included in your confirmation email, order SMS, and inside your Account Orders tab. The courier AWB is generated once the parcel is packed.
                    </p>
                  </div>

                  <div className={styles.faqCard}>
                    <h3 className={styles.faqQuestion}>How long does delivery typically take?</h3>
                    <p className={styles.faqAnswer}>
                      Metropolitan cities typically receive priority deliveries within 24–48 hours of dispatch. Tier-2 and regional regions arrive within 3–5 business days.
                    </p>
                  </div>

                  <div className={styles.faqCard}>
                    <h3 className={styles.faqQuestion}>Can I change my delivery address in transit?</h3>
                    <p className={styles.faqAnswer}>
                      If your parcel has not yet left our regional hub, our concierge team can re-route your delivery. Contact us immediately via WhatsApp Concierge with your Order ID.
                    </p>
                  </div>

                  <div className={styles.faqCard}>
                    <h3 className={styles.faqQuestion}>What if I miss my delivery attempt?</h3>
                    <p className={styles.faqAnswer}>
                      Our delivery executive will attempt 3 consecutive delivery attempts and reach out via phone before returning the parcel to the regional fulfillment centre.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.pageContainer}>
          <div className={styles.inner} style={{ textAlign: 'center', padding: '6rem 0' }}>
            <h2 className={styles.title}>LOADING TRACKER...</h2>
            <p className={styles.subtitle}>Connecting to DERRUME priority logistics network...</p>
          </div>
        </div>
      }
    >
      <TrackOrderContent />
    </Suspense>
  );
}
