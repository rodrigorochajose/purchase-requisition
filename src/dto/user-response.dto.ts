import * as z from "zod";

export const UserResponseDto = z.object({
  id: z.int(),
  name: z.string(),
  email: z.email(),
  role: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type UserResponseDtoType = z.infer<typeof UserResponseDto>;

export const UsersResponseDto = z.array(UserResponseDto);
