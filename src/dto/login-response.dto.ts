import z from "zod";
import { UserResponseDto } from "./user-response.dto.js";

export const LoginResponseDto = z.object({
  token: z.string(),
  user: UserResponseDto,
});

export type LoginResponseDtoType = z.infer<typeof LoginResponseDto>;
