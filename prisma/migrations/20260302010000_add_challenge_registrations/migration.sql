-- CreateTable
CREATE TABLE "challenge_registrations" (
    "user_id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "challenge_registrations_pkey" PRIMARY KEY ("user_id","challenge_id")
);

-- AddForeignKey
ALTER TABLE "challenge_registrations" ADD CONSTRAINT "challenge_registrations_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenges"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_registrations" ADD CONSTRAINT "challenge_registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
