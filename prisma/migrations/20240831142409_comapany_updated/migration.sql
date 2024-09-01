/*
  Warnings:

  - You are about to drop the column `locating` on the `Company` table. All the data in the column will be lost.
  - Added the required column `location` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "locating",
ADD COLUMN     "location" TEXT NOT NULL;
