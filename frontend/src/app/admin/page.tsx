'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui';

interface DashboardStats {
  users: {
    total: number;
    active: number;
  };
  products: {
    total: number;
    active: number;
    lowStock: number;
  };
  orders: {
    total: number;
    pending: number;
    revenue: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  return (
    <div className="grid gap-6">
      <Card>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-foreground/70">
          Overview of your e-commerce platform
        </p>
      </Card>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Users */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-sm text-foreground/70">Total Users</p>
              <p className="text-2xl font-bold">{stats?.users.total ?? '-'}</p>
              <p className="text-xs text-green-600">{stats?.users.active ?? 0} active</p>
            </div>
          </div>
        </Card>

        {/* Products */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
              <span className="text-2xl">📦</span>
            </div>
            <div>
              <p className="text-sm text-foreground/70">Total Products</p>
              <p className="text-2xl font-bold">{stats?.products.total ?? '-'}</p>
              <p className="text-xs text-red-600">{stats?.products.lowStock ?? 0} low stock</p>
            </div>
          </div>
        </Card>

        {/* Orders */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <span className="text-2xl">🛒</span>
            </div>
            <div>
              <p className="text-sm text-foreground/70">Total Orders</p>
              <p className="text-2xl font-bold">{stats?.orders.total ?? '-'}</p>
              <p className="text-xs text-yellow-600">{stats?.orders.pending ?? 0} pending</p>
            </div>
          </div>
        </Card>

        {/* Revenue */}
        <Card>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-foreground/70">Total Revenue</p>
              <p className="text-2xl font-bold">{stats?.orders.revenue ?? 0} TND</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h2 className="font-medium mb-4">Quick Actions</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Button onClick={() => window.location.href = '/admin/products'}>
            Manage Products
          </Button>
          <Button onClick={() => window.location.href = '/admin/orders'}>
            Manage Orders
          </Button>
          <Button onClick={() => window.location.href = '/admin/analytics'}>
            View Analytics
          </Button>
          <Button onClick={() => window.location.href = '/admin/workflows'}>
            Workflows
          </Button>
        </div>
      </Card>
    </div>
  );
}
