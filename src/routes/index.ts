import { Router } from "express";
import type { Request, Response } from "express";
import { UserController } from "../controllers/user.controller.js";
import { AuthController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { PurchaseRequestController } from "../controllers/purchase-request.controller.js";
import { ApprovalHistoryController } from "../controllers/approval-history.controller.js";

const routes = Router();
const authController = new AuthController();
const userController = new UserController();
const purchaseReqController = new PurchaseRequestController();
const approvalHistController = new ApprovalHistoryController();

routes.get("/", (req: Request, res: Response) => {
  return res.json({ message: "API is running!" });
});

routes.post("/auth/register", authController.register);
routes.post("/auth/login", authController.login);

routes.get("/user/:id", authMiddleware, userController.findUnique);
routes.patch("/user/:id", authMiddleware, userController.update);
routes.get("/users", authMiddleware, userController.findMany);

routes.post("/requests", authMiddleware, purchaseReqController.create);
routes.get("/requests", authMiddleware, purchaseReqController.findMany);
routes.get("/requests/:id", authMiddleware, purchaseReqController.findUnique);
routes.patch("/requests/:id", authMiddleware, purchaseReqController.update);

routes.get(
  "/history/:id",
  authMiddleware,
  approvalHistController.findByPurchaseId
);

routes.post(
  "/requests/:id/submit",
  authMiddleware,
  (req: Request, res: Response) => {
    approvalHistController.submit(req, res);
  }
);

routes.post(
  "/requests/:id/approve",
  authMiddleware,
  roleMiddleware(["APPROVER"]),
  (req: Request, res: Response) => {
    approvalHistController.approve(req, res);
  }
);

routes.post(
  "/requests/:id/reject",
  authMiddleware,
  roleMiddleware(["APPROVER"]),
  (req: Request, res: Response) => {
    approvalHistController.reject(req, res);
  }
);

routes.get(
  "/reports/summary",
  authMiddleware,
  approvalHistController.getSummary
);

export { routes };
