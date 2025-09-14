import * as z from "zod";

const UpdatePurchaseRequestSchema = z.object({
  purchaseRequestId: z.number().int().positive().optional(),
  description: z.string().min(1).optional(),
  quantity: z.number().int().min(1).optional(),
  price: z.number().min(0).optional(),
});

export const UpdatePurchaseRequestDto = z.array(UpdatePurchaseRequestSchema);

export type UpdatePurchaseRequestDtoType = z.infer<
  typeof UpdatePurchaseRequestDto
>;
