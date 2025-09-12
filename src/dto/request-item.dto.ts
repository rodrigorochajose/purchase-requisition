import z from "zod";

export const RequestItemDto = z.object({
  id: z.number().int().positive().optional(),
  description: z.string().min(1).optional(),
  quantity: z.number().int().min(1).optional(),
  price: z.number().min(0).optional(),
});

export type RequestItemDtoType = z.infer<typeof RequestItemDto>;
