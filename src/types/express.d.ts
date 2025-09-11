import { JwtPayload } from "../../generated/prisma/index.js";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
