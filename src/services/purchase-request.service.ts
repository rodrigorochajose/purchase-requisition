import { Prisma, PrismaClient, type PurchaseRequest } from "@prisma/client";
import { type CreatePurchaseRequestDtoType } from "../dto/create-purchase-request.dto.js";
import { type UpdatePurchaseRequestDtoType } from "../dto/update-purchase-request.dto.js";
import { type CreateRequestItemsDtoType } from "../dto/create-request-items.dto.js";
import { NotFoundException } from "../exceptions/notFoundException.js";
import { StatusLockedException } from "../exceptions/statusLockedException.js";

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

  async findMany(): Promise<PurchaseRequest[]> {
    return await prisma.purchaseRequest.findMany({
      include: {
        items: true,
        approvalHistory: true,
      },
    });
  }

  async find(id: number): Promise<PurchaseRequest> {
    const purchaseReq = await prisma.purchaseRequest.findFirst({
      where: { id },
      include: {
        items: true,
        approvalHistory: true,
      },
    });

    if (!purchaseReq) {
      throw new NotFoundException();
    }

    return purchaseReq;
  }

  async hasPurchaseReq(id: number): Promise<boolean> {
    const purchaseReq = await prisma.purchaseRequest.findFirst({
      where: { id },
    });

    return purchaseReq !== null;
  }

  async update(
    purchaseRequestId: number,
    updateDto: UpdatePurchaseRequestDtoType
  ) {
    const existingItems = await prisma.requestItems.findMany({
      where: { purchaseRequestId },
    });

    if (!existingItems) {
      throw new NotFoundException();
    }

    const status = await prisma.approvalHistory.findFirst({
      where: { purchaseRequestId },
      select: { status: true },
      orderBy: { createdAt: "desc" },
    });

    if (status && status.status != "DRAFT") {
      throw new StatusLockedException();
    }

    const countExistingItems = existingItems.length;
    const countNewItems = updateDto.length;

    if (countExistingItems > countNewItems) {
      const itemsToDelete = existingItems.splice(
        0,
        countExistingItems - countNewItems
      );

      itemsToDelete.forEach(async (element) => {
        await prisma.requestItems.delete({ where: { id: element.id } });
      });
    } else if (countExistingItems < countNewItems) {
      const itemsToAdd = updateDto.splice(
        0,
        countNewItems - countExistingItems
      );

      const data: CreateRequestItemsDtoType = itemsToAdd.map((item) => {
        return {
          purchaseRequestId,
          description: item.description ?? "",
          quantity: item.quantity ?? 1,
          price: item.price ?? 1,
        };
      });

      await prisma.requestItems.createMany({
        data,
      });
    }

    const updatePromises = updateDto.map((item, index) => {
      const existingItem = existingItems[index];

      if (!existingItem) {
        console.log("Item não encontrado");
        return Promise.resolve();
      }

      return prisma.requestItems.update({
        where: { id: existingItem.id },
        data: item as Prisma.RequestItemsUpdateInput,
      });
    });

    await Promise.all(updatePromises);

    return await prisma.requestItems.findMany({
      where: { purchaseRequestId },
    });
  }
}
