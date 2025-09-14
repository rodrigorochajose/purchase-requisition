import { PrismaClient } from "@prisma/client";
import { AuthService } from "../src/services/auth.service";
import { NotFoundException } from "../src/exceptions/notFoundException";
import { InvalidCredentialsException } from "../src/exceptions/invalidCredentialsException";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

jest.mock("@prisma/client", () => {
  const mockUser = {
    findFirst: jest.fn(),
    create: jest.fn(),
  };
  return {
    PrismaClient: jest.fn(() => ({ user: mockUser })),
  };
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(() => "hashed_password_123"),
  compare: jest.fn(() => true),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mocked_token"),
}));

describe("AuthService", () => {
  const authService: AuthService = new AuthService();
  const prisma: any = new PrismaClient();

  const sampleUser = {
    id: 1,
    name: "João",
    email: "joao@example.com",
    password: "hashed_password_123",
    role: "USER",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a user", async () => {
    prisma.user.create.mockResolvedValue(sampleUser);

    const dto = {
      name: "João",
      email: "joao@hotmail.com",
      password: "123",
      role: "USER",
    };

    const result = await authService.register(dto);

    expect(result).toEqual(sampleUser);
    expect(prisma.user.create).toHaveBeenCalledWith({ data: dto });
  });

  it("should login a user successfully", async () => {
    prisma.user.findFirst.mockResolvedValue(sampleUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.login("joao@hotmail.com", "123");

    expect(result).toEqual({
      token: "mocked_token",
      user: sampleUser,
    });

    expect(prisma.user.findFirst).toHaveBeenCalledWith({
      where: { email: "joao@hotmail.com" },
    });
    expect(bcrypt.compare).toHaveBeenCalledWith("123", sampleUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: sampleUser.id, role: sampleUser.role },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );
  });

  it("should throw NotFoundException if user does not exist on login", async () => {
    prisma.user.findFirst.mockResolvedValue(null);

    await expect(
      authService.login("cleberdasilvajuniorsantos@hotmail.com", "123")
    ).rejects.toThrow(NotFoundException);
  });

  it("should throw InvalidCredentialsException if password is incorrect", async () => {
    prisma.user.findFirst.mockResolvedValue(sampleUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      authService.login("joao@hotmail.com", "wrong_password")
    ).rejects.toThrow(InvalidCredentialsException);
  });
});
