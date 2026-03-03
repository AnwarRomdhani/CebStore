import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="inline-block size-2 rounded-full bg-brand" />
              <span>CebStore</span>
            </Link>
            <p className="mt-2 text-sm text-foreground/70">
              AI-powered e-commerce platform for smarter shopping.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-3">Shop</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/products" className="hover:text-brand">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=featured" className="hover:text-brand">
                  Featured
                </Link>
              </li>
              <li>
                <Link href="/products?category=new" className="hover:text-brand">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="font-medium mb-3">Account</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/orders" className="hover:text-brand">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-brand">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="hover:text-brand">
                  Recommendations
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-medium mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-foreground/70">
              <li>
                <Link href="/chat" className="hover:text-brand">
                  Chatbot
                </Link>
              </li>
              <li>
                <a href="mailto:support@cebstore.com" className="hover:text-brand">
                  Contact
                </a>
              </li>
              <li>
                <Link href="/admin" className="hover:text-brand">
                  Admin
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center text-sm text-foreground/70">
          <p>&copy; {new Date().getFullYear()} CebStore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
