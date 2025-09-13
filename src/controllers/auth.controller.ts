import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";
import {
  CreateUserDto,
  type CreateUserDtoType,
} from "../dto/create-user.dto.js";
import bcrypt from "bcrypt";
import { UserService } from "../services/user.service.js";
import { UserResponseDto } from "../dto/user-response.dto.js";
import { InvalidCredentialsException } from "../exceptions/invalidCredentialsException.js";

const authService = new AuthService();
const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    const data: CreateUserDtoType = CreateUserDto.parse(req.body);

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    try {
      const user = await userService.create(data);

      return res.status(201).json(UserResponseDto.parse(user));
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

    try {
      const result = await authService.login(email, password);

      return res.status(200).json({
        token: result.token,
        user: {
          userId: result.user.id,
          role: result.user.role,
        },
      });
    } catch (error: any) {
      if (error instanceof InvalidCredentialsException) {
        return res.status(400).json({ message: error.message });
      }

      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
