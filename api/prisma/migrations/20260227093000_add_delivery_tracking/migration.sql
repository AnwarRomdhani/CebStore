-- CreateTable
CREATE TABLE "delivery_tracking" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "tracking_number" TEXT,
    "carrier" TEXT,
    "tracking_url" TEXT,
    "notes" TEXT,
    "photo_url" TEXT,
    "estimated_delivery_date" TIMESTAMPTZ,
    "shipped_at" TIMESTAMPTZ,
    "delivered_at" TIMESTAMPTZ,
    "location" TEXT,
    "description" TEXT NOT NULL,
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT "delivery_tracking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "delivery_tracking"
ADD CONSTRAINT "delivery_tracking_order_id_fkey"
FOREIGN KEY ("order_id") REFERENCES "orders"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "delivery_tracking_order_id_idx" ON "delivery_tracking"("order_id");

-- CreateIndex
CREATE INDEX "delivery_tracking_order_id_timestamp_idx" ON "delivery_tracking"("order_id", "timestamp");

