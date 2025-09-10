import { Router } from "express";
import type { Request, Response } from "express";

const routes = Router();

routes.get("/", (req: Request, res: Response) => {
  return res.json({ message: "API is running!" });
});

export { routes };
