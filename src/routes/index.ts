import { Router } from "express";
import type { Request, Response } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const routes = Router();
const userController = new UserController();
const authController = new AuthController();

routes.get("/", (req: Request, res: Response) => {
  return res.json({ message: "API is running!" });
});

routes.post("/login", authController.login);

routes.post("/user", userController.create);
routes.get("/users", authMiddleware, userController.findMany);
routes.get(
  "/user/:id",
  authMiddleware,
  roleMiddleware(["APPROVER"]),
  userController.findUnique
);
routes.patch("/user/:id", userController.update);
routes.delete("/user/:id", userController.delete);

export { routes };
