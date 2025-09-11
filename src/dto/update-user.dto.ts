import { Role } from "@prisma/client";
import z from "zod";

export const BaseUserDto = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
  role: z.enum(Role),
});

export const UpdateUserDto = BaseUserDto.partial();

export type UpdateUserDtoType = z.infer<typeof UpdateUserDto>;
