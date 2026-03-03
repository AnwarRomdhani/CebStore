'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui';
import { formatCurrency } from '@/utils/format';

interface WishlistItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    stock: number;
  };
}

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/wishlist');
      
      if (response.status === 401) {
        setError('Please login to view your wishlist');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }
      
      const data = await response.json();
      setItems(data.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeFromWishlist = async (itemId: string) => {
    setRemoving(itemId);
    try {
      const response = await fetch(`/api/wishlist/items/${itemId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }
      
      await fetchWishlist();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity: 1 }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add to cart');
      }
      
      router.push('/cart');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (error && items.length === 0) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <h1 className="text-xl font-semibold">Wishlist</h1>
          <Alert variant="error" className="mt-4" title="Error">
            {error}
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push('/login')}>
              Login to View Wishlist
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <Card>
        <h1 className="text-2xl font-semibold">My Wishlist</h1>
        <p className="text-sm text-foreground/70">
          Save your favorite products for later
        </p>
      </Card>

      {items.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-foreground/70 mb-4">Your wishlist is empty</p>
            <Button onClick={() => router.push('/products')}>
              Browse Products
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card key={item.id} hover>
              {item.product.imageUrl ? (
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="aspect-square w-full object-cover rounded-lg mb-3"
                />
              ) : (
                <div className="aspect-square w-full rounded-lg bg-muted mb-3 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
              )}
              
              <CardContent>
                <h3 className="font-medium">{item.product.name}</h3>
                <p className="mt-1 text-lg font-semibold text-brand">
                  {formatCurrency(item.product.price)}
                </p>
                <p className={`text-xs mt-1 ${item.product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </p>
                
                <div className="mt-3 flex gap-2">
                  <Button
                    className="flex-1"
                    size="sm"
                    onClick={() => addToCart(item.product.id)}
                    disabled={item.product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeFromWishlist(item.id)}
                    isLoading={removing === item.id}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
