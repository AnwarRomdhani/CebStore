'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/utils/format';

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
}

interface OrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      });
      
      const response = await fetch(`/api/orders?${params}`);
      
      if (response.status === 401) {
        setError('Please login to view your orders');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data: OrdersResponse = await response.json();
      setOrders(data.data);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (error && orders.length === 0) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-xl font-semibold">My Orders</h1>
          <Alert variant="error" className="mt-4" title="Error">
            {error}
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push('/login')}>
              Login to View Orders
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-sm text-foreground/70">
          Track and manage your orders
        </p>
      </Card>

      {orders.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-foreground/70 mb-4">You haven&apos;t placed any orders yet</p>
            <Button onClick={() => router.push('/products')}>
              Start Shopping
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid gap-4">
            {orders.map((order) => (
              <Card key={order.id} hover>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">Order #{order.orderNumber}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-foreground/70 mt-1">
                      {formatDateTime(order.createdAt)}
                    </p>
                    <div className="mt-2 text-sm text-foreground/70">
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      {order.items.slice(0, 2).map((item, idx) => (
                        <span key={idx}>
                          {idx > 0 && ', '}{item.productName} x {item.quantity}
                        </span>
                      ))}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-brand">
                      {formatCurrency(order.totalAmount)}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => router.push(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="flex items-center px-4 text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
