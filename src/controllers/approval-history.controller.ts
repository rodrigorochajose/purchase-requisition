import type { Request, Response } from "express";
import { ApprovalHistoryService } from "../services/approval-history.service.js";
import { UpdateApprovalStatusDto } from "../dto/update-approval-history.dto.js";

const approvalHistService = new ApprovalHistoryService();

export class ApprovalHistoryController {
  async updateStatus(req: Request, res: Response, status: string) {
    const { id } = req.params;
    const userId = Number(id);

    const data = UpdateApprovalStatusDto.parse(status);

    // adicionar try catch

    const result = await approvalHistService.updateStatus(userId, data);

    return res.status(200).json(result);
  }

  async getSummary(req: Request, res: Response) {}
}
