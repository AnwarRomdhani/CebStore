-- Composite indexes to speed up common "filter + orderBy createdAt desc" queries

CREATE INDEX IF NOT EXISTS "orders_userId_createdAt_desc_idx"
ON "orders" ("userId", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "orders_status_createdAt_desc_idx"
ON "orders" ("status", "createdAt" DESC);

CREATE INDEX IF NOT EXISTS "carts_userId_checkedOut_createdAt_desc_idx"
ON "carts" ("userId", "checkedOut", "createdAt" DESC);

