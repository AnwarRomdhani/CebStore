'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui';
import { formatCurrency, formatDateTime } from '@/utils/format';

interface Order {
  id: string;
  orderNumber: string;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  updatedAt: string;
  items: {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
  userEmail?: string;
  userName?: string;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
  SHIPPED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
  DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/orders/${params.id}`);
      
      if (response.status === 404) {
        setError('Order not found');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      
      const data = await response.json();
      setOrder(data.data || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  const cancelOrder = async () => {
    if (!order || order.status !== 'PENDING') return;
    
    setCancelling(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/cancel`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }
      
      await fetchOrder();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <Alert variant="error" title="Error">
            {error || 'Order not found'}
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push('/orders')}>
              Back to Orders
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Order #{order.orderNumber}</h1>
            <p className="text-sm text-foreground/70 mt-1">
              Placed on {formatDateTime(order.createdAt)}
            </p>
          </div>
          <span className={`text-sm px-3 py-1 rounded-full ${statusColors[order.status]}`}>
            {order.status}
          </span>
        </div>
      </Card>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 grid gap-4">
          <Card>
            <h2 className="font-medium mb-4">Order Items</h2>
            <div className="grid gap-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 py-3 border-b border-border last:border-0">
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productName}</h3>
                    <p className="text-sm text-foreground/70">
                      Quantity: {item.quantity} × {formatCurrency(item.price)}
                    </p>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="grid gap-4">
          <Card>
            <h2 className="font-medium mb-4">Order Summary</h2>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-foreground/70">Subtotal</dt>
                <dd>{formatCurrency(order.totalAmount)}</dd>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-semibold">
                <dt>Total</dt>
                <dd className="text-brand">{formatCurrency(order.totalAmount)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="font-medium mb-4">Shipping Address</h2>
            <address className="text-sm not-italic text-foreground/70">
              {order.shippingAddress || 'No shipping address provided'}
            </address>
          </Card>

          {order.status === 'PENDING' && (
            <Button
              variant="danger"
              onClick={cancelOrder}
              isLoading={cancelling}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
