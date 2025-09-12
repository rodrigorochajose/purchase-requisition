import type { Request, Response } from "express";
import { PurchaseRequestService } from "../services/purchase-request.service.js";
import {
  CreatePurchaseRequestDto,
  type CreatePurchaseRequestDtoType,
} from "../dto/create-purchase-request.dto.js";

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
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
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
    return res.status(200).json({ error: "ainda nao implementado" });
  }

  async delete(req: Request, res: Response) {
    return res.status(200).json({ error: "ainda nao implementado" });
  }
}
