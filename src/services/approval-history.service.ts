import {
  PrismaClient,
  RequestStatus,
  type ApprovalHistory,
} from "@prisma/client";

const prisma = new PrismaClient();

export class ApprovalHistoryService {
  async findUnique(id: number): Promise<ApprovalHistory | null> {
    return await prisma.approvalHistory.findUnique({
      where: { id },
    });
  }

  async findByPurchaseReqId(id: number): Promise<ApprovalHistory[] | null> {
    return await prisma.approvalHistory.findMany({
      where: { purchaseRequestId: id },
    });
  }

  async create(
    purchaseReqId: number,
    status: string
  ): Promise<ApprovalHistory> {
    return await prisma.approvalHistory.create({
      data: {
        purchaseRequestId: purchaseReqId,
        status: RequestStatus[status as keyof typeof RequestStatus],
      },
    });
  }

  async getSummary() {
    return await prisma.approvalHistory.groupBy({
      by: ["status"],
      _count: {
        status: true,
      },
    });
  }
}
