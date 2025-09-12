import type { Request, Response } from "express";
import { PurchaseRequestService } from "../services/purchase-request.service.js";
import {
  CreatePurchaseRequestDto,
  type CreatePurchaseRequestDtoType,
} from "../dto/create-purchase-request.dto.js";
import { UpdatePurchaseRequestDto } from "../dto/update-purchase-request.dto.js";
import z from "zod";

const purchaseReqService = new PurchaseRequestService();

export class PurchaseRequestController {
  async create(req: Request, res: Response): Promise<Response> {
    const data: CreatePurchaseRequestDtoType = CreatePurchaseRequestDto.parse(
      req.body
    );

    try {
      const purchaseReq = await purchaseReqService.create(data);

      return res.status(201).json(purchaseReq);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }

      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async findMany(req: Request, res: Response): Promise<Response> {
    const purchaseReqs = await purchaseReqService.findMany();

    return res.status(200).json(purchaseReqs);
  }

  async findUnique(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const purchaseReqId = Number(id);

    try {
      const purchaseReq = await purchaseReqService.findUnique(purchaseReqId);

      if (!purchaseReq) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      return res.status(200).json(purchaseReq);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const purchaseReqId = Number(id);

    const data = UpdatePurchaseRequestDto.parse(req.body);

    const purchaseReqExists = await purchaseReqService.hasPurchaseReq(
      purchaseReqId
    );

    if (!purchaseReqExists) {
      return res.status(404).json({ error: "Registro não encontrado" });
    }

    try {
      const result = await purchaseReqService.update(purchaseReqId, data);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }

      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
