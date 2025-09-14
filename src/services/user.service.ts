import { type UserResponseDtoType } from "../dto/user-response.dto";
import type { CreateUserDtoType } from "../dto/create-user.dto";
import type { UpdateUserDtoType } from "../dto/update-user.dto";
import { Prisma, PrismaClient, type User } from "@prisma/client";
import { NotFoundException } from "../exceptions/notFoundException";

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

  async find(id: number): Promise<UserResponseDtoType> {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(
    id: number,
    updateData: UpdateUserDtoType
  ): Promise<UserResponseDtoType> {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return await prisma.user.update({
      where: { id },
      data: updateData as Prisma.UserUpdateInput,
    });
  }
}
