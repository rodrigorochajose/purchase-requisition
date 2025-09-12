import { type UserResponseDtoType } from "../dto/user-response.dto.js";
import type { CreateUserDtoType } from "../dto/create-user.dto.js";
import type { UpdateUserDtoType } from "../dto/update-user.dto.js";
import { Prisma, PrismaClient, type User } from "@prisma/client";

const prisma = new PrismaClient();

export class UserService {
  async create(data: CreateUserDtoType): Promise<UserResponseDtoType> {
    return await prisma.user.create({
      data,
    });
  }

  async findMany(): Promise<UserResponseDtoType[]> {
    return await prisma.user.findMany();
  }

  async findUnique(id: number): Promise<UserResponseDtoType | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user ? user : null;
  }

  async findUniqueByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async update(
    id: number,
    updateData: UpdateUserDtoType
  ): Promise<UserResponseDtoType> {
    return await prisma.user.update({
      where: { id },
      data: updateData as Prisma.UserUpdateInput,
    });
  }
}
