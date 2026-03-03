'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Button, Input, Alert, LoadingSpinner } from '@/components/ui';
import { formatCurrency } from '@/utils/format';
import { useCart } from '@/hooks/useCart';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisia',
    paymentMethod: 'card',
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-xl font-semibold">Checkout</h1>
          <p className="mt-2 text-foreground/70">
            Your cart is empty. Add items before checkout.
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push('/cart')}>
              Go to Cart
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          paymentMethod: formData.paymentMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create order');
      }

      const order = await response.json();
      await clearCart();
      
      // Redirect to order confirmation
      router.push(`/orders/${order.data?.id ?? order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Checkout Form */}
      <div className="lg:col-span-2 grid gap-4">
        <Card>
          <h1 className="text-xl font-semibold">Checkout</h1>
          <p className="text-sm text-foreground/70">
            Complete your order by filling out the information below.
          </p>
        </Card>

        {error && (
          <Alert variant="error" title="Error">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          {/* Contact Information */}
          <Card>
            <h2 className="font-medium mb-4">Contact Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </Card>

          {/* Shipping Address */}
          <Card>
            <h2 className="font-medium mb-4">Shipping Address</h2>
            <div className="grid gap-4">
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card>
            <h2 className="font-medium mb-4">Payment Method</h2>
            <div className="grid gap-3">
              <label className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-medium">Credit/Debit Card</p>
                  <p className="text-sm text-foreground/70">Pay securely with card</p>
                </div>
              </label>
              <label className="flex items-center gap-3 rounded-lg border border-border p-3 cursor-pointer hover:bg-muted">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash_on_delivery"
                  checked={formData.paymentMethod === 'cash_on_delivery'}
                  onChange={handleChange}
                  className="h-4 w-4"
                />
                <div>
                  <p className="font-medium">Cash on Delivery</p>
                  <p className="text-sm text-foreground/70">Pay when you receive your order</p>
                </div>
              </label>
            </div>
          </Card>

          <Button type="submit" className="w-full" size="lg" isLoading={loading}>
            Place Order - {formatCurrency(cart.total)}
          </Button>
        </form>
      </div>

      {/* Order Summary */}
      <div>
        <Card>
          <h2 className="font-medium mb-4">Order Summary</h2>
          <div className="grid gap-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground/70">
                  {item.productName} x {item.quantity}
                </span>
                <span className="font-medium">{formatCurrency(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-4 pt-4 grid gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Subtotal</span>
              <span>{formatCurrency(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground/70">Shipping</span>
              <span>{parseFloat(cart.shippingCost) === 0 ? 'Free' : formatCurrency(cart.shippingCost)}</span>
            </div>
            <div className="border-t border-border pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span className="text-brand">{formatCurrency(cart.total)}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
