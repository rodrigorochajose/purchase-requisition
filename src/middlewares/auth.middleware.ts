import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");

  if (!token) {
    return res.status(401).json({ error: "Formato do token inválido" });
  }

  try {
    const secret = process.env.JWT_SECRET || "default_secret";

    const decoded = jwt.verify(token, secret);

    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
