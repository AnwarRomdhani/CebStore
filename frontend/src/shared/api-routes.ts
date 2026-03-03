export const ApiRoutes = {
  backend: {
    auth: '/auth',
    users: '/users',
    products: '/products',
    carts: '/carts',
    orders: '/orders',
    wishlist: '/wishlist',
    ai: '/ai',
    workflows: '/workflows',
  },
  proxy: {
    auth: '/api/auth',
    users: '/api/users',
    products: '/api/products',
    cart: '/api/cart',
    orders: '/api/orders',
    wishlist: '/api/wishlist',
    ai: '/api/ai',
    adminWorkflows: '/api/admin/workflows',
  },
} as const;
