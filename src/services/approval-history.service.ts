import { PrismaClient } from "@prisma/client";
import type { UpdateApprovalStatusDtoType } from "../dto/update-approval-history.dto.js";

const prisma = new PrismaClient();

export class ApprovalHistoryService {
  async updateStatus(id: number, data: UpdateApprovalStatusDtoType) {
    return await prisma.approvalHistory.update({
      where: { id },
      data,
    });
  }

  async getSummary() {}
}
