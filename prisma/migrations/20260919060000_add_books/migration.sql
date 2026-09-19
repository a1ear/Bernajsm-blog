-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "heading" TEXT,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "coverImageAlt" TEXT,
    "buyUrl" TEXT NOT NULL,
    "availableLabel" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "books_status_featured_publishedAt_idx" ON "books"("status", "featured", "publishedAt");

-- Same rationale as prisma/migrations/*_enable_rls -- see that migration's
-- header comment. Prisma connects as the table owner and bypasses RLS
-- regardless; this only shuts the PostgREST-over-anon-key door for this
-- new table. Real authorization stays in lib/auth.ts and the "published
-- only" filters in lib/queries.ts.
ALTER TABLE "books" ENABLE ROW LEVEL SECURITY;
