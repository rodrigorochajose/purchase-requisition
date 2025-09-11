import * as z from "zod";

export const CreateUserDto = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

export type CreateUserDtoType = z.infer<typeof CreateUserDto>;
