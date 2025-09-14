import { PrismaClient } from "@prisma/client";
import { ApprovalHistoryService } from "../src/services/approval-history.service";
import { StatusApprovalException } from "../src/exceptions/statusApprovalException";

jest.mock("@prisma/client", () => {
  const mockApprovalHistory = {
    findMany: jest.fn(),
    findFirst: jest.fn(),
    create: jest.fn(),
    groupBy: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      approvalHistory: mockApprovalHistory,
    })),
  };
});

describe("ApprovalHistoryService", () => {
  const service: ApprovalHistoryService = new ApprovalHistoryService();
  const prisma: any = new PrismaClient();

  const approval = {
    id: 1,
    purchaseRequestId: 1,
    status: "DRAFT",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should find approval history by purchase request id", async () => {
    prisma.approvalHistory.findMany.mockResolvedValue([approval]);

    const result = await service.findByPurchaseReqId(1);

    expect(result).toEqual([approval]);
    expect(prisma.approvalHistory.findMany).toHaveBeenCalledWith({
      where: { purchaseRequestId: 1 },
    });
  });

  it("should submit a purchase request if status is DRAFT", async () => {
    prisma.approvalHistory.findFirst.mockResolvedValue(approval);
    prisma.approvalHistory.create.mockResolvedValue({
      ...approval,
      status: "SUBMITTED",
    });

    const result = await service.submit(1);

    expect(result.status).toBe("SUBMITTED");
    expect(prisma.approvalHistory.create).toHaveBeenCalledWith({
      data: { purchaseRequestId: 1, status: "SUBMITTED" },
    });
  });

  it("should approve a purchase request if status is SUBMITTED", async () => {
    prisma.approvalHistory.findFirst.mockResolvedValue({
      ...approval,
      status: "SUBMITTED",
    });
    prisma.approvalHistory.create.mockResolvedValue({
      ...approval,
      status: "APPROVED",
    });

    const result = await service.approve(1);

    expect(result.status).toBe("APPROVED");
  });

  it("should return a summary", async () => {
    const summary = [{ status: "DRAFT", _count: { status: 2 } }];
    prisma.approvalHistory.groupBy.mockResolvedValue(summary);

    const result = await service.getSummary();

    expect(result).toEqual(summary);
    expect(prisma.approvalHistory.groupBy).toHaveBeenCalledWith({
      by: ["status"],
      _count: { status: true },
    });
  });

  it("should reject a purchase request if status is SUBMITTED", async () => {
    prisma.approvalHistory.findFirst.mockResolvedValue({
      ...approval,
      status: "SUBMITTED",
    });
    prisma.approvalHistory.create.mockResolvedValue({
      ...approval,
      status: "REJECTED",
    });

    const result = await service.reject(1);

    expect(result.status).toBe("REJECTED");
  });

  it("should throw StatusApprovalException on submit if status is not DRAFT", async () => {
    prisma.approvalHistory.findFirst.mockResolvedValue({
      ...approval,
      status: "SUBMITTED",
    });

    await expect(service.submit(1)).rejects.toThrow(StatusApprovalException);
  });

  it("should throw StatusApprovalException on approve if status is not SUBMITTED", async () => {
    prisma.approvalHistory.findFirst.mockResolvedValue(approval);
    await expect(service.approve(1)).rejects.toThrow(StatusApprovalException);
  });

  it("should throw StatusApprovalException on reject if status is not SUBMITTED", async () => {
    prisma.approvalHistory.findFirst.mockResolvedValue(approval);
    await expect(service.reject(1)).rejects.toThrow(StatusApprovalException);
  });
});
