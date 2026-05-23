import { AuthTokenPayload } from "../core/middlewares/Auth";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
