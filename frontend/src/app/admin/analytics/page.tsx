'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, LoadingSpinner, Alert } from '@/components/ui';
import { formatCurrency } from '@/utils/format';

interface AnalyticsData {
  revenue: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
    outOfStock: number;
  };
  customers: {
    total: number;
    active: number;
    newThisMonth: number;
  };
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/analytics');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-sm text-foreground/70">
          Insights and statistics about your business
        </p>
      </Card>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Revenue Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-foreground/70">Total Revenue</p>
          <p className="text-2xl font-bold text-brand">
            {formatCurrency(data?.revenue.total ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-foreground/70">Today</p>
          <p className="text-xl font-semibold">
            {formatCurrency(data?.revenue.today ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-foreground/70">This Week</p>
          <p className="text-xl font-semibold">
            {formatCurrency(data?.revenue.thisWeek ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-foreground/70">This Month</p>
          <p className="text-xl font-semibold">
            {formatCurrency(data?.revenue.thisMonth ?? 0)}
          </p>
        </Card>
      </div>

      {/* Orders Stats */}
      <Card>
        <h2 className="font-medium mb-4">Orders Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-3xl font-bold">{data?.orders.total ?? 0}</p>
            <p className="text-sm text-foreground/70">Total Orders</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
            <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">
              {data?.orders.pending ?? 0}
            </p>
            <p className="text-sm">Pending</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900/20">
            <p className="text-3xl font-bold text-green-800 dark:text-green-200">
              {data?.orders.completed ?? 0}
            </p>
            <p className="text-sm">Completed</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-100 dark:bg-red-900/20">
            <p className="text-3xl font-bold text-red-800 dark:text-red-200">
              {data?.orders.cancelled ?? 0}
            </p>
            <p className="text-sm">Cancelled</p>
          </div>
        </div>
      </Card>

      {/* Products Stats */}
      <Card>
        <h2 className="font-medium mb-4">Products Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-3xl font-bold">{data?.products.total ?? 0}</p>
            <p className="text-sm text-foreground/70">Total Products</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900/20">
            <p className="text-3xl font-bold text-green-800 dark:text-green-200">
              {data?.products.active ?? 0}
            </p>
            <p className="text-sm">Active</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
            <p className="text-3xl font-bold text-yellow-800 dark:text-yellow-200">
              {data?.products.lowStock ?? 0}
            </p>
            <p className="text-sm">Low Stock</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-red-100 dark:bg-red-900/20">
            <p className="text-3xl font-bold text-red-800 dark:text-red-200">
              {data?.products.outOfStock ?? 0}
            </p>
            <p className="text-sm">Out of Stock</p>
          </div>
        </div>
      </Card>

      {/* Customers Stats */}
      <Card>
        <h2 className="font-medium mb-4">Customers Overview</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="text-center p-4 rounded-lg bg-muted">
            <p className="text-3xl font-bold">{data?.customers.total ?? 0}</p>
            <p className="text-sm text-foreground/70">Total Customers</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-200">
              {data?.customers.active ?? 0}
            </p>
            <p className="text-sm">Active</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-green-100 dark:bg-green-900/20">
            <p className="text-3xl font-bold text-green-800 dark:text-green-200">
              {data?.customers.newThisMonth ?? 0}
            </p>
            <p className="text-sm">New This Month</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
