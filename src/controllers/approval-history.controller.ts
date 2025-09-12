import type { Request, Response } from "express";
import { ApprovalHistoryService } from "../services/approval-history.service.js";
import z from "zod";

const approvalHistService = new ApprovalHistoryService();

export class ApprovalHistoryController {
  async findUnique(req: Request, res: Response) {
    const { id } = req.params;
    const approvalId = Number(id);

    try {
      const approval = await approvalHistService.findUnique(approvalId);

      if (!approval) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      return res.status(200).json(approval);
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

  async findByPurchaseId(req: Request, res: Response) {
    const { id } = req.params;
    const purchaseReq = Number(id);

    try {
      const result = await approvalHistService.findByPurchaseReqId(purchaseReq);

      if (!result) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

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

  async create(req: Request, res: Response, status: string) {
    const { id } = req.params;
    const purchaseReqId = Number(id);

    try {
      const approval = await approvalHistService.create(purchaseReqId, status);

      return res.status(200).json(approval);
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

  async getSummary(req: Request, res: Response) {
    try {
      const summary = await approvalHistService.getSummary();

      return res.status(200).json(summary);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
