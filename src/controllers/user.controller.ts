import type { Request, Response } from "express";
import { UserService } from "../services/user.service.js";
import {
  UpdateUserDto,
  type UpdateUserDtoType,
} from "../dto/update-user.dto.js";
import { UserResponseDto, UsersResponseDto } from "../dto/user-response.dto.js";
import z from "zod";
import { NotFoundException } from "../exceptions/notFoundException.js";

const userService = new UserService();

export class UserController {
  async find(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = Number(id);

    try {
      const user = await userService.find(userId);
      return res.status(200).json(UserResponseDto.parse(user));
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }

      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async findMany(req: Request, res: Response): Promise<Response> {
    const users = await userService.findMany();

    return res.status(200).json(UsersResponseDto.parse(users));
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const userId = Number(id);

    const data: UpdateUserDtoType = UpdateUserDto.parse(req.body);

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value !== undefined)
    );

    try {
      const result = await userService.update(userId, updateData);

      return res.status(200).json(UserResponseDto.parse(result));
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        return res.status(404).json({ message: error.message });
      }

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
