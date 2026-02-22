/*
  Warnings:

  - You are about to drop the column `category` on the `challenges` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `challenges` table. All the data in the column will be lost.
  - Added the required column `updated_at` to the `challenges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "challenges" DROP COLUMN "category",
DROP COLUMN "tags",
ADD COLUMN     "author_id" TEXT,
ADD COLUMN     "category_id" TEXT,
ADD COLUMN     "forked_from_id" TEXT,
ADD COLUMN     "is_official" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "likes_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "estimated_time" DROP NOT NULL,
ALTER COLUMN "order" SET DEFAULT 0;

-- DropEnum
DROP TYPE "Category";

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_official" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_tags" (
    "challenge_id" TEXT NOT NULL,
    "tag_id" TEXT NOT NULL,

    CONSTRAINT "challenge_tags_pkey" PRIMARY KEY ("challenge_id","tag_id")
);

-- CreateTable
CREATE TABLE "challenge_likes" (
    "user_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_likes_pkey" PRIMARY KEY ("user_id","challenge_id")
);

-- CreateTable
CREATE TABLE "challenge_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- AddForeignKey
ALTER TABLE "challenge_tags" ADD CONSTRAINT "challenge_tags_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_tags" ADD CONSTRAINT "challenge_tags_tag_id_fkey" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_forked_from_id_fkey" FOREIGN KEY ("forked_from_id") REFERENCES "challenges"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenges" ADD CONSTRAINT "challenges_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_likes" ADD CONSTRAINT "challenge_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_likes" ADD CONSTRAINT "challenge_likes_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_comments" ADD CONSTRAINT "challenge_comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_comments" ADD CONSTRAINT "challenge_comments_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;
