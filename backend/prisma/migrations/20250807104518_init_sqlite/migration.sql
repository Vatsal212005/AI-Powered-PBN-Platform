-- CreateTable
CREATE TABLE "Domain" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "tags" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "domain_id" TEXT,
    "selected_version_id" TEXT,
    "updated_at" DATETIME NOT NULL,
    "user" TEXT,
    "status" TEXT NOT NULL,
    "anchor" TEXT,
    "backlink_target" TEXT,
    "keyword" TEXT,
    "niche" TEXT,
    "topic" TEXT,
    "internal_links" BOOLEAN NOT NULL DEFAULT false,
    "backlink_expiry" DATETIME,
    CONSTRAINT "articles_domain_id_fkey" FOREIGN KEY ("domain_id") REFERENCES "Domain" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "articles_selected_version_id_fkey" FOREIGN KEY ("selected_version_id") REFERENCES "article_versions" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "article_versions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "article_id" TEXT NOT NULL,
    "version_num" INTEGER NOT NULL,
    "content_md" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_qc_notes" JSONB,
    "last_qc_status" TEXT,
    "prompt" TEXT,
    "qc_attempts" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "article_versions_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Domain_slug_key" ON "Domain"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "articles_selected_version_id_key" ON "articles"("selected_version_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_versions_article_id_version_num_key" ON "article_versions"("article_id", "version_num");
