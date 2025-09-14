import {
  PrismaClient,
  RequestStatus,
  type ApprovalHistory,
} from "@prisma/client";
import { NotFoundException } from "../exceptions/notFoundException";
import { StatusApprovalException } from "../exceptions/statusApprovalException";

const prisma = new PrismaClient();

export class ApprovalHistoryService {
  async findByPurchaseReqId(id: number): Promise<ApprovalHistory[]> {
    return await prisma.approvalHistory.findMany({
      where: { purchaseRequestId: id },
    });
  }

  private async getStatus(purchaseRequestId: number): Promise<RequestStatus> {
    const status = await prisma.approvalHistory.findFirst({
      where: { purchaseRequestId },
      select: { status: true },
      orderBy: { createdAt: "desc" },
    });

    if (!status) {
      throw new NotFoundException();
    }

    return status.status;
  }

  async submit(purchaseReqId: number): Promise<ApprovalHistory> {
    const expectedStatus = "DRAFT";
    const approval = await this.getStatus(purchaseReqId);

    if (approval != expectedStatus) {
      throw new StatusApprovalException(expectedStatus);
    }

    return await prisma.approvalHistory.create({
      data: {
        purchaseRequestId: purchaseReqId,
        status: "SUBMITTED",
      },
    });
  }

  async approve(purchaseReqId: number): Promise<ApprovalHistory> {
    const expectedStatus = "SUBMITTED";
    const approval = await this.getStatus(purchaseReqId);

    if (approval != expectedStatus) {
      throw new StatusApprovalException(expectedStatus);
    }

    return await prisma.approvalHistory.create({
      data: {
        purchaseRequestId: purchaseReqId,
        status: "APPROVED",
      },
    });
  }

  async reject(purchaseReqId: number): Promise<ApprovalHistory> {
    const expectedStatus = "SUBMITTED";
    const approval = await this.getStatus(purchaseReqId);

    if (approval != expectedStatus) {
      throw new StatusApprovalException(expectedStatus);
    }

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
