import type { Request, Response } from "express";
import {
  CreateUserDto,
  type CreateUserDtoType,
} from "../dto/create-user.dto.js";
import { type UserResponseDtoType } from "../dto/user-response.dto.js";
import { UserService } from "../services/user.service.js";
import {
  UpdateUserDto,
  type UpdateUserDtoType,
} from "../dto/update-user.dto.js";
import bcrypt from "bcrypt";

const userService = new UserService();

export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    const data: CreateUserDtoType = CreateUserDto.parse(req.body);

    try {
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

  async findUnique(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = Number(id);

    try {
      const user = await userService.findUnique(userId);

      if (!user) {
        res.status(404).json({ error: "Registro não encontrado" });
      }

      return res.status(200).json(user);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
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

      return res.status(200).json(result);
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Email já existe" });
      }

      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = Number(id);

    try {
      const user = await userService.findUnique(userId);

      if (!user) {
        res.status(404).json({ error: "Registro não encontrado" });
      }

      const result = await userService.delete(userId);

      return res.status(200).json(result);
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
