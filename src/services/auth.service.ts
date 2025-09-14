import { UserService } from "./user.service";
import type { LoginResponseDtoType } from "../dto/login-response.dto";
import type { CreateUserDtoType } from "../dto/create-user.dto";
import type { UserResponseDtoType } from "../dto/user-response.dto";
import { NotFoundException } from "../exceptions/notFoundException";
import { InvalidCredentialsException } from "../exceptions/invalidCredentialsException";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const userService = new UserService();

export class AuthService {
  async register(data: CreateUserDtoType): Promise<UserResponseDtoType> {
    return await userService.create(data);
  }

  async login(email: string, password: string): Promise<LoginResponseDtoType> {
    const user = await userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new InvalidCredentialsException();
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
