'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export function Header() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { cart, cartItemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="inline-block size-2 rounded-full bg-brand" />
          <span>CebStore</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link href="/products" className="text-sm hover:text-brand">
            Products
          </Link>
          <Link href="/chat" className="text-sm hover:text-brand">
            Chatbot
          </Link>
          <Link href="/recommendations" className="text-sm hover:text-brand">
            Recommendations
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative text-sm hover:text-brand">
            Cart
            {cartItemCount > 0 && (
              <span className="absolute -right-3 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-xs font-medium text-[color:var(--brand-fg)]">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Auth - Show loading state */}
          {isLoading ? (
            <LoadingSpinner size="sm" />
          ) : isAuthenticated ? (
            <>
              <Link href="/orders" className="text-sm hover:text-brand">
                Orders
              </Link>
              <Link href="/wishlist" className="text-sm hover:text-brand">
                Wishlist
              </Link>
              {user?.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm hover:text-brand">
                  Admin
                </Link>
              )}
              <button onClick={logout} className="text-sm hover:text-brand">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-outline">
                Login
              </Link>
              <Link href="/register" className="btn-brand">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
