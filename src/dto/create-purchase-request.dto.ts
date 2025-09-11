import { z } from "zod";

const RequestItemSchema = z.object({
  description: z.string(),
  quantity: z
    .number()
    .int()
    .positive("A quantidade deve ser um número inteiro positivo."),
  price: z.number().positive("O preço deve ser um número positivo."),
});

export const CreatePurchaseRequestDto = z.object({
  userId: z.int(),
  items: z
    .array(RequestItemSchema)
    .min(1, "A solicitação de compra deve conter pelo menos um item."),
});

export type CreatePurchaseRequestDtoType = z.infer<
  typeof CreatePurchaseRequestDto
>;
