import { PrismaClient, Role, User } from "@prisma/client";
import { UserService } from "../src/services/user.service";
import { CreateUserDto } from "../src/dto/create-user.dto";
import { UpdateUserDto } from "../src/dto/update-user.dto";
import { UserResponseDto } from "../src/dto/user-response.dto";
import { NotFoundException } from "../src/exceptions/notFoundException";

jest.mock("@prisma/client", () => {
  const mockUser = {
    findUnique: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => ({
      user: mockUser,
    })),
  };
});

describe("UserService", () => {
  const userService: UserService = new UserService();
  const prisma: any = new PrismaClient();

  const users: User[] = [
    {
      id: 1,
      name: "João",
      email: "joao@hotmail.com",
      password: "123",
      role: "USER" as Role,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      name: "Osvaldo",
      email: "valdo@hotmail.com",
      password: "123",
      role: "APPROVER" as Role,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user", async () => {
    const userToCreate = CreateUserDto.parse(users[0]);
    prisma.user.create.mockResolvedValue({
      id: users[0].id,
      name: users[0].name,
      email: users[0].email,
      role: users[0].role,
      createdAt: users[0].createdAt,
      updatedAt: users[0].updatedAt,
    });

    const result = await userService.create(userToCreate);

    expect(result).toEqual(UserResponseDto.parse(users[0]));
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: userToCreate,
    });
  });

  it("should get a user", async () => {
    prisma.user.findFirst.mockResolvedValue(users[0]);

    const result = await userService.find(users[0].id);

    expect(result).toEqual(users[0]);
    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { id: users[0].id },
    });
  });

  it("should get all users", async () => {
    prisma.user.findMany.mockResolvedValue(users);

    const result = await userService.findMany();

    expect(result).toEqual(users);
    expect(prisma.user.findMany).toHaveBeenCalled();
  });

  it("should update a user", async () => {
    const updateData = UpdateUserDto.parse({
      name: "João Augusto",
      role: "USER",
    });
    prisma.user.findFirst.mockResolvedValue(users[0]);
    prisma.user.update.mockResolvedValue({ ...users[0], ...updateData });

    const result = await userService.update(users[0].id, updateData);

    expect(result).toEqual({ ...users[0], ...updateData });
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: users[0].id },
      data: updateData,
    });
  });

  it("should throw NotFoundException", async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(userService.find(999)).rejects.toThrow(NotFoundException);
  });

  it("should throw NotFoundException if user does not exist", async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      userService.findByEmail("cleberdasilvajuniorsantos@hotmail.com")
    ).rejects.toThrow(NotFoundException);

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: "cleberdasilvajuniorsantos@hotmail.com" },
    });
  });

  it("should throw a validation error", async () => {
    const invalidData = { ...users[0], email: "email" };
    await expect(
      CreateUserDto.parseAsync(invalidData as any)
    ).rejects.toThrow();
  });
});
