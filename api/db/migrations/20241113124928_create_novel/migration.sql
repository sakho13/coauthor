-- CreateTable
CREATE TABLE "Novel" (
    "novel_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,

    CONSTRAINT "Novel_pkey" PRIMARY KEY ("novel_id")
);

-- AddForeignKey
ALTER TABLE "Novel" ADD CONSTRAINT "Novel_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
