import type { NextFunction, Request, Response } from "express";
import type { Role } from "../../generated/prisma/index.js";

export function roleMiddleware(allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Acesso negado ! Você não possui permissão." });
    }

    return next();
  };
}
