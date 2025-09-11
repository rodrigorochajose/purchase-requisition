import { UserService } from "./user.service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { LoginResponseDtoType } from "../dto/login-response.dto.js";
import type { CreateUserDtoType } from "../dto/create-user.dto.js";
import type { UserResponseDtoType } from "../dto/user-response.dto.js";

const userService = new UserService();

export class AuthService {
  async register(data: CreateUserDtoType): Promise<UserResponseDtoType> {
    return await userService.create(data);
  }

  async login(
    email: string,
    password: string
  ): Promise<LoginResponseDtoType | null> {
    const user = await userService.findUniqueByEmail(email);

    if (!user) {
      return null;
    }

    const passwordMatch = bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return null;
    }

    const payload = {
      userId: user.id,
      role: user.role,
    };

    const secret = process.env.JWT_SECRET || "default_secret";

    const token = jwt.sign(payload, secret, {
      expiresIn: "1h",
    });

    const result: LoginResponseDtoType = {
      token,
      user,
    };

    return result;
  }
}
