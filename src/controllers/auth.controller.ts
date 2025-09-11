import type { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    if (!result) {
      return res.status(400).json({ message: "Credenciais Inválidas" });
    }

    return res.status(200).json({
      message: "Login bem sucedido",
      token: result.token,
      user: {
        userId: result.user.id,
        role: result.user.role,
      },
    });
  }
}
