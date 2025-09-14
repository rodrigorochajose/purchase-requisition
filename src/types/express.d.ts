import { JwtPayload } from "../../generated/prisma/index";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
