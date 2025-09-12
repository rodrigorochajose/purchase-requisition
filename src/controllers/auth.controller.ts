import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import {
  CreateUserDto,
  type CreateUserDtoType,
} from "../dto/create-user.dto.js";
import bcrypt from "bcrypt";
import { UserService } from "../services/user.service.js";
import type { UserResponseDtoType } from "../dto/user-response.dto.js";

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const data: CreateUserDtoType = CreateUserDto.parse(req.body);

      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;

      const newUser = await userService.create(data);

      const userResponse: UserResponseDtoType = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
        updatedAt: newUser.updatedAt,
      };

      return res.status(201).json(userResponse);
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Email já existe" });
      }

      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    if (!result) {
      return res.status(400).json({ message: "Credenciais Inválidas" });
    }

    return res.status(200).json({
      token: result.token,
      user: {
        userId: result.user.id,
        role: result.user.role,
      },
    });
  }
}
