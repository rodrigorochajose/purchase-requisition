/*
  Warnings:

  - You are about to alter the column `status` on the `ApprovalHistory` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(1))`.
  - You are about to drop the column `status` on the `PurchaseRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `ApprovalHistory` MODIFY `status` ENUM('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') NOT NULL;

-- AlterTable
ALTER TABLE `PurchaseRequest` DROP COLUMN `status`;
