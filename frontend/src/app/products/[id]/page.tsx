'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui';
import { formatCurrency } from '@/utils/format';
import { useCart } from '@/hooks/useCart';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  sku: string;
  imageUrl: string | null;
  isActive: boolean;
  category: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/products/${params.id}`);
      
      if (response.status === 404) {
        setError('Product not found');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch product');
      }
      
      const data = await response.json();
      setProduct(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAddingToCart(true);
    try {
      await addToCart(product.id, quantity);
    } catch (err) {
      // Error handled by useCart hook
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" className="min-h-[400px]" />;
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-md">
        <Card>
          <Alert variant="error" title="Error">
            {error || 'Product not found'}
          </Alert>
          <div className="mt-4">
            <Button onClick={() => router.push('/products')}>
              Back to Products
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Image */}
      <Card>
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full rounded-lg"
          />
        ) : (
          <div className="aspect-square w-full rounded-lg bg-muted flex items-center justify-center">
            <span className="text-6xl">📦</span>
          </div>
        )}
      </Card>

      {/* Details */}
      <div className="grid gap-4">
        <Card>
          <h1 className="text-2xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-sm text-foreground/70">
            SKU: {product.sku}
          </p>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-3xl font-bold text-brand">
              {formatCurrency(product.price)}
            </span>
            <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
            </span>
          </div>
        </Card>

        {product.description && (
          <Card>
            <h2 className="font-medium mb-2">Description</h2>
            <p className="text-foreground/80 whitespace-pre-wrap">
              {product.description}
            </p>
          </Card>
        )}

        <Card>
          <h2 className="font-medium mb-3">Add to Cart</h2>
          <div className="flex gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border hover:bg-muted"
                disabled={quantity >= product.stock}
              >
                +
              </button>
            </div>
            
            <Button
              className="flex-1"
              onClick={handleAddToCart}
              isLoading={addingToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="font-medium mb-2">Product Details</h2>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-foreground/70">Category</dt>
              <dd className="font-medium">{product.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/70">Status</dt>
              <dd className="font-medium">{product.isActive ? 'Active' : 'Inactive'}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
