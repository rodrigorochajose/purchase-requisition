import z from "zod";

const CreateRequestItemsSchema = z.object({
  purchaseRequestId: z.int().positive(),
  description: z.string().min(1),
  quantity: z.number().int().min(1),
  price: z.number().min(0),
});

export const CreateRequestItemsDto = z.array(CreateRequestItemsSchema);

export type CreateRequestItemsDtoType = z.infer<typeof CreateRequestItemsDto>;
