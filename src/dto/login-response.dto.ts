import { UserResponseDto } from "./user-response.dto";
import * as z from "zod";

export const LoginResponseDto = z.object({
  token: z.string(),
  user: UserResponseDto,
});

export type LoginResponseDtoType = z.infer<typeof LoginResponseDto>;
