import {
  PrismaClient,
  RequestStatus,
  type ApprovalHistory,
} from "@prisma/client";

const prisma = new PrismaClient();

export class ApprovalHistoryService {
  async getStatus(id: number): Promise<RequestStatus | null> {
    const status = await prisma.approvalHistory.findFirst({
      where: { purchaseRequestId: id },
      select: { status: true },
      orderBy: { createdAt: "desc" },
    });

    return status ? status.status : null;
  }

  async find(id: number): Promise<ApprovalHistory | null> {
    return await prisma.approvalHistory.findFirst({
      where: { purchaseRequestId: id },
    });
  }

  async findByPurchaseReqId(id: number): Promise<ApprovalHistory[] | null> {
    return await prisma.approvalHistory.findMany({
      where: { purchaseRequestId: id },
    });
  }

  async submit(purchaseReqId: number): Promise<ApprovalHistory> {
    return await prisma.approvalHistory.create({
      data: {
        purchaseRequestId: purchaseReqId,
        status: "SUBMITTED",
      },
    });
  }

  async approve(purchaseReqId: number): Promise<ApprovalHistory> {
    return await prisma.approvalHistory.create({
      data: {
        purchaseRequestId: purchaseReqId,
        status: "APPROVED",
      },
    });
  }

  async reject(purchaseReqId: number): Promise<ApprovalHistory> {
    return await prisma.approvalHistory.create({
      data: {
        purchaseRequestId: purchaseReqId,
        status: "REJECTED",
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
