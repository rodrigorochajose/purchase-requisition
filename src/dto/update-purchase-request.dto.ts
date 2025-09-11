import { RequestStatus } from "@prisma/client";
import z from "zod";

export const UpdatePurchaseRequestDto = z.object({
  status: z.enum(RequestStatus),
});

export type UpdatePurchaseRequestDtoType = z.infer<
  typeof UpdatePurchaseRequestDto
>;
