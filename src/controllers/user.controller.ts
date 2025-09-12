import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import {
  UpdateUserDto,
  type UpdateUserDtoType,
} from "../dto/update-user.dto.js";
import type { UserResponseDtoType } from "../dto/user-response.dto.js";
import z from "zod";

const userService = new UserService();

export class UserController {
  async findUnique(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = Number(id);

    try {
      const user = await userService.findUnique(userId);

      if (!user) {
        return res.status(404).json({ error: "Registro não encontrado" });
      }

      const userResponse: UserResponseDtoType = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };

      return res.status(200).json(userResponse);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }

      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async findMany(req: Request, res: Response): Promise<Response> {
    const users = await userService.findMany();

    const usersResponse: UserResponseDtoType[] = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));

    return res.status(200).json(usersResponse);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = Number(id);

    try {
      const user = await userService.findUnique(userId);

      if (!user) {
        res.status(404).json({ error: "Registro não encontrado" });
      }

      const data: UpdateUserDtoType = UpdateUserDto.parse(req.body);

      const updateData = Object.fromEntries(
        Object.entries(data).filter(([_, value]) => value !== undefined)
      );

      const result = await userService.update(userId, updateData);

      const userResponse: UserResponseDtoType = {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      };

      return res.status(200).json(userResponse);
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Email já existe" });
      }

      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.issues,
        });
      }

      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}
