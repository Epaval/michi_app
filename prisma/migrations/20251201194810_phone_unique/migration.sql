/*
  Warnings:

  - A unique constraint covering the columns `[telefono]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Cliente_telefono_key` ON `Cliente`(`telefono`);
