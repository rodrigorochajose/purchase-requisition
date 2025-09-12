import z from "zod";
import { RequestItemDto } from "./request-item.dto.js";

export const UpdatePurchaseRequestDto = z.object({
  items: z.array(RequestItemDto),
});

export type UpdatePurchaseRequestDtoType = z.infer<
  typeof UpdatePurchaseRequestDto
>;
