'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui';
import { formatCurrency } from '@/utils/format';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, error, updateQuantity, removeFromCart, clearCart } = useCart();

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-xl font-semibold">Shopping Cart</h1>
          <p className="mt-2 text-foreground/70">
            Your cart is empty. Start shopping to add items!
          </p>
          <div className="mt-4">
            <Button onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 grid gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Shopping Cart</h1>
            <Button variant="outline" size="sm" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </Card>

        {error && (
          <Alert variant="error" title="Error">
            {error.message}
          </Alert>
        )}

        {cart.items.map((item) => (
          <Card key={item.id}>
            <div className="flex gap-4">
              {item.productImage ? (
                <img
                  src={item.productImage}
                  alt={item.productName}
                  className="h-24 w-24 rounded-lg object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-lg bg-muted flex items-center justify-center">
                  <span className="text-2xl">📦</span>
                </div>
              )}
              
              <div className="flex-1">
                <h3 className="font-medium">{item.productName}</h3>
                <p className="text-sm text-foreground/70">
                  {formatCurrency(item.productPrice)} each
                </p>
                
                <div className="mt-2 flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-border hover:bg-muted"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center rounded border border-border hover:bg-muted"
                    >
                      +
                    </button>
                  </div>
                  
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-brand">
                  {formatCurrency(parseFloat(item.subtotal))}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div className="grid gap-4">
        <Card>
          <h2 className="font-medium mb-4">Order Summary</h2>
          <dl className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground/70">Subtotal</dt>
              <dd className="font-medium">{formatCurrency(cart.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/70">Shipping</dt>
              <dd className="font-medium">
                {parseFloat(cart.shippingCost) === 0 ? 'Free' : formatCurrency(cart.shippingCost)}
              </dd>
            </div>
            {parseFloat(cart.discount) > 0 && (
              <div className="flex justify-between text-green-600">
                <dt>Discount</dt>
                <dd>-{formatCurrency(cart.discount)}</dd>
              </div>
            )}
            <div className="border-t border-border pt-3 flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="text-brand">{formatCurrency(cart.total)}</dd>
            </div>
          </dl>
          
          <Button className="w-full mt-4" onClick={() => router.push('/checkout')}>
            Proceed to Checkout
          </Button>
        </Card>

        <Card>
          <h3 className="font-medium mb-2">Free Shipping</h3>
          <p className="text-sm text-foreground/70">
            Add {formatCurrency(Math.max(0, 100 - parseFloat(cart.subtotal)))} more to get free shipping!
          </p>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-brand transition-all"
              style={{ width: `${Math.min(100, (parseFloat(cart.subtotal) / 100) * 100)}%` }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
