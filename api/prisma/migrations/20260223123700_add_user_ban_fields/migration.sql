-- Add isActive, bannedAt, and bannedReason fields to users table
ALTER TABLE "users" ADD COLUMN "isActive" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "users" ADD COLUMN "bannedAt" TIMESTAMP(3);
ALTER TABLE "users" ADD COLUMN "bannedReason" TEXT;

-- Create index on isActive for faster queries
CREATE INDEX "users_isActive_idx" ON "users"("isActive");