import { PrismaClient, type PurchaseRequest } from "@prisma/client";
import type { CreatePurchaseRequestDtoType } from "../dto/create-purchase-request.dto.js";

const prisma = new PrismaClient();

export class PurchaseRequestService {
  async create(data: CreatePurchaseRequestDtoType): Promise<PurchaseRequest> {
    return await prisma.purchaseRequest.create({
      data: {
        userId: data.userId,
        items: {
          create: data.items,
        },
        approvalHistory: {
          create: {
            status: "DRAFT",
          },
        },
      },
      include: {
        items: true,
        approvalHistory: true,
      },
    });
  }

  async findMany() {
    return await prisma.purchaseRequest.findMany({
      include: {
        items: true,
        approvalHistory: true,
      },
    });
  }

  async findUnique(id: number) {
    return await prisma.purchaseRequest.findUnique({
      where: { id },
      include: {
        items: true,
        approvalHistory: true,
      },
    });
  }

  async update() {}

  async delete() {}
}
