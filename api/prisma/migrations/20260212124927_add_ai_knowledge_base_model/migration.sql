-- CreateTable
CREATE TABLE "ai_knowledge_base" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "sourceId" TEXT,
    "embedding" vector(1536),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_knowledge_base_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_knowledge_base_source_idx" ON "ai_knowledge_base"("source");
