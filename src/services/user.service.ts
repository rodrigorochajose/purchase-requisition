import {
  UserResponseDto,
  type UserResponseDtoType,
} from "../dto/user-response.dto.js";
import type { CreateUserDtoType } from "../dto/create-user.dto.js";
import {
  Prisma,
  PrismaClient,
  type User,
} from "../../generated/prisma/index.js";
import type { UpdateUserDtoType } from "../dto/update-user.dto.js";

const prisma = new PrismaClient();

export class UserService {
  async create(data: CreateUserDtoType): Promise<UserResponseDtoType> {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });

    return user;
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
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return user;
  }

  async update(
    id: number,
    updateData: UpdateUserDtoType
  ): Promise<UserResponseDtoType> {
    const user = await prisma.user.update({
      where: { id },
      data: updateData as Prisma.UserUpdateInput,
    });

    return UserResponseDto.parse(user);
  }

  async delete(id: number): Promise<object> {
    await prisma.user.delete({
      where: { id },
    });

    return { message: "Usuário deletado" };
  }
}
