/*
  Warnings:

  - You are about to drop the column `email` on the `cliente` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Cliente_email_key` ON `cliente`;

-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `email`;
