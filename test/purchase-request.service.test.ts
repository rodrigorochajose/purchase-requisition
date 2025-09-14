import { PrismaClient } from "@prisma/client";
import { PurchaseRequestService } from "../src/services/purchase-request.service";
import { NotFoundException } from "../src/exceptions/notFoundException";
import { StatusLockedException } from "../src/exceptions/statusLockedException";

jest.mock("@prisma/client", () => {
  const mockPurchaseRequest = {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
  };

  const mockRequestItems = {
    findMany: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
    createMany: jest.fn(),
  };

  const mockApprovalHistory = {
    findFirst: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      purchaseRequest: mockPurchaseRequest,
      requestItems: mockRequestItems,
      approvalHistory: mockApprovalHistory,
    })),
  };
});

describe("PurchaseRequestService", () => {
  const service: PurchaseRequestService = new PurchaseRequestService();
  const prisma: any = new PrismaClient();

  const sampleRequest = {
    id: 1,
    userId: 1,
    items: [{ id: 1, description: "Celular", quantity: 1, price: 50 }],
    approvalHistory: [{ status: "DRAFT" }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a purchase request", async () => {
    prisma.purchaseRequest.create.mockResolvedValue(sampleRequest);

    const dto = {
      userId: 1,
      items: [{ description: "Celular", quantity: 1, price: 50 }],
    };

    const result = await service.create(dto);

    expect(result).toEqual(sampleRequest);
    expect(prisma.purchaseRequest.create).toHaveBeenCalledWith({
      data: {
        userId: dto.userId,
        items: { create: dto.items },
        approvalHistory: { create: { status: "DRAFT" } },
      },
      include: { items: true, approvalHistory: true },
    });
  });

  it("should get all purchase requests", async () => {
    prisma.purchaseRequest.findMany.mockResolvedValue([sampleRequest]);

    const result = await service.findMany();

    expect(result).toEqual([sampleRequest]);
    expect(prisma.purchaseRequest.findMany).toHaveBeenCalledWith({
      include: { items: true, approvalHistory: true },
    });
  });

  it("should get a purchase request by id", async () => {
    prisma.purchaseRequest.findFirst.mockResolvedValue(sampleRequest);

    const result = await service.find(1);

    expect(result).toEqual(sampleRequest);
    expect(prisma.purchaseRequest.findFirst).toHaveBeenCalledWith({
      where: { id: 1 },
      include: { items: true, approvalHistory: true },
    });
  });

  it("should return true if purchase request exists", async () => {
    prisma.purchaseRequest.findFirst.mockResolvedValue(sampleRequest);

    const result = await service.hasPurchaseReq(1);
    expect(result).toBe(true);
  });

  it("should return false if purchase request does not exist", async () => {
    prisma.purchaseRequest.findFirst.mockResolvedValue(null);

    const result = await service.hasPurchaseReq(999);
    expect(result).toBe(false);
  });

  it("should update purchase request items", async () => {
    const existingItems = [
      { id: 1, description: "Celular", quantity: 1, price: 50 },
    ];

    const updateDto = [{ description: "Notebook", quantity: 2, price: 2000 }];

    prisma.requestItems.findMany.mockResolvedValue(existingItems);
    prisma.approvalHistory.findFirst.mockResolvedValue({ status: "DRAFT" });
    prisma.requestItems.update.mockResolvedValue({
      ...existingItems[0],
      ...updateDto[0],
    });
    prisma.requestItems.findMany.mockResolvedValue([
      { ...existingItems[0], ...updateDto[0] },
    ]);

    const result = await service.update(1, updateDto);

    expect(prisma.requestItems.findMany).toHaveBeenCalledWith({
      where: { purchaseRequestId: 1 },
    });
    expect(prisma.approvalHistory.findFirst).toHaveBeenCalledWith({
      where: { purchaseRequestId: 1 },
      select: { status: true },
      orderBy: { createdAt: "desc" },
    });
    expect(prisma.requestItems.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateDto[0],
    });
    expect(result).toEqual([{ ...existingItems[0], ...updateDto[0] }]);
  });

  it("should throw NotFoundException if purchase request not found", async () => {
    prisma.purchaseRequest.findFirst.mockResolvedValue(null);

    await expect(service.find(999)).rejects.toThrow(NotFoundException);
  });

  it("should throw StatusLockedException if status is not DRAFT", async () => {
    prisma.requestItems.findMany.mockResolvedValue([{ id: 1 }]);
    prisma.approvalHistory.findFirst.mockResolvedValue({ status: "APPROVED" });

    await expect(
      service.update(1, [{ description: "Cabo", quantity: 1, price: 15 }])
    ).rejects.toThrow(StatusLockedException);
  });

  it("should throw NotFoundException if no existing items found on update", async () => {
    prisma.requestItems.findMany.mockResolvedValue(null);

    await expect(
      service.update(1, [{ description: "Cabo", quantity: 1, price: 12 }])
    ).rejects.toThrow(NotFoundException);
  });
});
