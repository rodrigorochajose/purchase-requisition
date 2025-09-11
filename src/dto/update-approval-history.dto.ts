// No seu arquivo DTO, por exemplo, src/dtos/approval.dto.ts
import { RequestStatus } from "@prisma/client";
import { z } from "zod";

export const UpdateApprovalStatusDto = z.object({
  status: z.enum(RequestStatus),
});

export type UpdateApprovalStatusDtoType = z.infer<
  typeof UpdateApprovalStatusDto
>;
