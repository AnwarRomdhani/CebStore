'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui';
import { formatCurrency, truncateText } from '@/utils/format';
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

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...(search && { search }),
        ...(category && { category }),
      });
      
      const response = await fetch(`/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: ProductsResponse = await response.json();
      setProducts(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      await addToCart(productId, 1);
    } catch (err) {
      // Error handled by useCart hook
    } finally {
      setAddingToCart(null);
    }
  };

  if (loading) {
    return <LoadingPage message="Loading products..." />;
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="card">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-1 text-sm text-foreground/70">
          Browse our catalog of quality products
        </p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 flex-1 rounded-lg border border-border bg-transparent px-3 outline-none focus:ring-2 focus:ring-brand/30 min-w-[200px]"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 rounded-lg border border-border bg-transparent px-3 outline-none focus:ring-2 focus:ring-brand/30"
          >
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="clothing">Clothing</option>
            <option value="home">Home & Garden</option>
            <option value="sports">Sports</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-foreground/70">No products found</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <Card key={product.id} hover className="flex flex-col">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="aspect-square w-full object-cover rounded-lg mb-3"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-lg bg-muted mb-3 flex items-center justify-center">
                    <span className="text-4xl">📦</span>
                  </div>
                )}
                
                <CardContent className="flex-1 flex flex-col">
                  <h3 className="font-medium">{product.name}</h3>
                  {product.description && (
                    <p className="mt-1 text-sm text-foreground/70 line-clamp-2">
                      {truncateText(product.description, 80)}
                    </p>
                  )}
                  
                  <div className="mt-auto pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-brand">
                        {formatCurrency(product.price)}
                      </span>
                      <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <Button
                      className="w-full mt-3"
                      onClick={() => handleAddToCart(product.id)}
                      isLoading={addingToCart === product.id}
                      disabled={product.stock === 0}
                    >
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
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

function LoadingPage({ message }: { message: string }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-sm text-foreground/70">{message}</p>
      </div>
    </div>
  );
}
