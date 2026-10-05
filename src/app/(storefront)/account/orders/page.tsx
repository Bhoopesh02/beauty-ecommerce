'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import PageTransition from '@/components/motion/PageTransition';
import StaggerContainer from '@/components/motion/StaggerContainer';
import StaggerItem from '@/components/motion/StaggerItem';
import FadeIn from '@/components/motion/FadeIn';
import OrderCard from '@/components/orders/OrderCard';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderSearch from '@/components/orders/OrderSearch';
import EmptyOrders from '@/components/orders/EmptyOrders';
import OrderSkeleton from '@/components/orders/OrderSkeleton';
import TrackingModal from '@/components/orders/TrackingModal';
import { orderService } from '@/services/orderService';
import { Order, OrderFilterTab } from '@/types';
import { useAuth } from '@/hooks/useAuth';
import { matchesFilter } from '@/utils/orderUtils';
import styles from './page.module.css';

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrderFilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const fetched = await orderService.getOrdersByUser(user?.id);
      setOrders(fetched);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Compute tab counts
  const counts = useMemo(() => {
    const tabs: OrderFilterTab[] = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
    const res: Partial<Record<OrderFilterTab, number>> = {};
    for (const tab of tabs) {
      res[tab] = orders.filter(o => matchesFilter(o, tab)).length;
    }
    return res;
  }, [orders]);

  // Filter & Search
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status filter
      if (!matchesFilter(order, activeFilter)) return false;

      // Search filter (Order ID or Product Name)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesId = order.id.toLowerCase().includes(q);
        const matchesItem = order.items.some(item =>
          item.name.toLowerCase().includes(q)
        );
        if (!matchesId && !matchesItem) return false;
      }

      return true;
    });
  }, [orders, activeFilter, searchQuery]);

  const handleResetOrders = async () => {
    setLoading(true);
    const restored = await orderService.resetOrders();
    setOrders(restored);
    setActiveFilter('All');
    setSearchQuery('');
    setLoading(false);
  };

  const isFiltered = activeFilter !== 'All' || searchQuery.trim().length > 0;

  return (
    <PageTransition>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <h1 className={styles.title}>My Orders</h1>
          <p className={styles.subtitle}>A record of your DERRUME purchases.</p>
        </header>

        {loading ? (
          <OrderSkeleton count={3} />
        ) : orders.length === 0 ? (
          <EmptyOrders onResetOrders={handleResetOrders} />
        ) : (
          <>
            {/* Filters & Search Controls */}
            <div className={styles.controls}>
              <div className={styles.filterCol}>
                <OrderFilters
                  activeFilter={activeFilter}
                  onSelectFilter={setActiveFilter}
                  counts={counts}
                />
              </div>

              <div className={styles.searchCol}>
                <OrderSearch
                  query={searchQuery}
                  onQueryChange={setSearchQuery}
                  placeholder="Search orders"
                />
              </div>
            </div>

            {/* Results count / active search reminder */}
            {isFiltered && (
              <FadeIn duration={0.3}>
                <div className={styles.resultsMeta}>
                  <span>
                    Showing {filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
                    {searchQuery && ` for "${searchQuery}"`}
                  </span>
                  <button
                    type="button"
                    className={styles.clearFilterLink}
                    onClick={() => {
                      setActiveFilter('All');
                      setSearchQuery('');
                    }}
                  >
                    Clear filters
                  </button>
                </div>
              </FadeIn>
            )}

            {/* Order Cards List */}
            {filteredOrders.length === 0 ? (
              <EmptyOrders
                isFiltered
                onClearFilters={() => {
                  setActiveFilter('All');
                  setSearchQuery('');
                }}
              />
            ) : (
              <StaggerContainer
                className={styles.orderList}
                delayChildren={0.05}
                staggerChildren={0.08}
              >
                {filteredOrders.map(order => (
                  <StaggerItem key={order.id} yOffset={15} duration={0.45}>
                    <OrderCard
                      order={order}
                      onTrackOrder={(o) => setTrackingOrder(o)}
                    />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </>
        )}

        {/* Tracking Modal */}
        <TrackingModal
          order={trackingOrder}
          isOpen={!!trackingOrder}
          onClose={() => setTrackingOrder(null)}
        />
      </div>
    </PageTransition>
  );
}
