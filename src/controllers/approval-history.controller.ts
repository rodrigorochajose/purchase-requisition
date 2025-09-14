import z from "zod";
import type { Request, Response } from "express";
import { ApprovalHistoryService } from "../services/approval-history.service";
import { StatusApprovalException } from "../exceptions/statusApprovalException";
import { NotFoundException } from "../exceptions/notFoundException";

const approvalHistService = new ApprovalHistoryService();

export class ApprovalHistoryController {
  async findByPurchaseId(req: Request, res: Response) {
    const { id } = req.params;
    const purchaseReq = Number(id);

    try {
      const approval = await approvalHistService.findByPurchaseReqId(
        purchaseReq
      );

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

  async submit(req: Request, res: Response) {
    const { id } = req.params;
    const purchaseReqId = Number(id);

    try {
      const approval = await approvalHistService.submit(purchaseReqId);

      return res.status(200).json(approval);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof StatusApprovalException) {
        return res.status(400).json({ message: error.message });
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

  async approve(req: Request, res: Response) {
    const { id } = req.params;
    const purchaseReqId = Number(id);

    try {
      const approval = await approvalHistService.approve(purchaseReqId);

      return res.status(200).json(approval);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof StatusApprovalException) {
        return res.status(400).json({ message: error.message });
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

  async reject(req: Request, res: Response) {
    const { id } = req.params;
    const purchaseReqId = Number(id);

    try {
      const approval = await approvalHistService.reject(purchaseReqId);

      return res.status(200).json(approval);
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }

      if (error instanceof StatusApprovalException) {
        return res.status(400).json({ message: error.message });
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
