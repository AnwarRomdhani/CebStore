-- DropIndex
DROP INDEX "carts_userId_idx";

-- DropIndex
DROP INDEX "carts_items_cartId_idx";

-- DropIndex
DROP INDEX "carts_items_productId_idx";

-- DropIndex
DROP INDEX "categories_isActive_idx";

-- DropIndex
DROP INDEX "categories_slug_idx";

-- DropIndex
DROP INDEX "discounts_code_idx";

-- DropIndex
DROP INDEX "discounts_isActive_expiresAt_idx";

-- DropIndex
DROP INDEX "order_items_orderId_idx";

-- DropIndex
DROP INDEX "order_items_productId_idx";

-- DropIndex
DROP INDEX "orders_orderNumber_idx";

-- DropIndex
DROP INDEX "orders_status_idx";

-- DropIndex
DROP INDEX "orders_userId_idx";

-- DropIndex
DROP INDEX "payments_orderId_idx";

-- DropIndex
DROP INDEX "payments_transactionId_idx";

-- DropIndex
DROP INDEX "payments_userId_idx";

-- DropIndex
DROP INDEX "products_categoryId_idx";

-- DropIndex
DROP INDEX "products_isActive_idx";

-- DropIndex
DROP INDEX "products_sku_idx";

-- DropIndex
DROP INDEX "users_email_idx";

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
