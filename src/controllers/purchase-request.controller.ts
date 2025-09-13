import type { Request, Response } from "express";
import { PurchaseRequestService } from "../services/purchase-request.service.js";
import {
  CreatePurchaseRequestDto,
  type CreatePurchaseRequestDtoType,
} from "../dto/create-purchase-request.dto.js";
import { UpdatePurchaseRequestDto } from "../dto/update-purchase-request.dto.js";
import z from "zod";
import { NotFoundException } from "../exceptions/notFoundException.js";
import { StatusLockedException } from "../exceptions/statusLockedException.js";

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

  async find(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const purchaseReqId = Number(id);

    try {
      const purchaseReq = await purchaseReqService.find(purchaseReqId);

      return res.status(200).json(purchaseReq);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ error: error.message });
      }

      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const purchaseReqId = Number(id);

    const data = UpdatePurchaseRequestDto.parse(req.body);

    try {
      const result = await purchaseReqService.update(purchaseReqId, data);

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ error: error.message });
      }

      if (error instanceof StatusLockedException) {
        return res.status(400).json({ error: error.message });
      }

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
