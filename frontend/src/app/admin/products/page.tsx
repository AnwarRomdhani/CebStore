'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, Button, LoadingSpinner, Alert } from '@/components/ui';
import { formatCurrency } from '@/utils/format';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  sku: string;
  isActive: boolean;
  category: string;
}

interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      });
      
      const response = await fetch(`/api/admin/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const data: ProductsResponse = await response.json();
      setProducts(data.data);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleProductStatus = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update product');
      }
      
      await fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    }
  };

  return (
    <div className="grid gap-6">
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Products Management</h1>
            <p className="text-sm text-foreground/70">
              Manage your product catalog
            </p>
          </div>
          <Button onClick={() => window.location.href = '/admin/products/new'}>
            Add Product
          </Button>
        </div>
      </Card>

      {error && (
        <Alert variant="error" title="Error">
          {error}
        </Alert>
      )}

      <Card>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-border bg-transparent px-3 outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>

        {loading ? (
          <LoadingSpinner className="py-12" />
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-foreground/70">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">SKU</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                  <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-border last:border-0">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{product.name}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-foreground/70">{product.sku}</td>
                    <td className="py-3 px-4 text-sm text-foreground/70">{product.category}</td>
                    <td className="py-3 px-4 text-sm font-medium">{formatCurrency(product.price)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleProductStatus(product.id, product.isActive)}
                      >
                        {product.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
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
      </Card>
    </div>
  );
}
