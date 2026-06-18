import { Request, Response } from "express";
import { BackofficeAuthService } from "../services/BackofficeAuthService";

export const BackofficeAuthController = {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await BackofficeAuthService.login(email, password);
      return res.json(result);
    } catch (err: any) {
      const message = err?.message ?? "Falha na autenticação";
      const status = message === "Usuário não autorizado" ? 403 : 401;
      return res.status(status).json({ message });
    }
  },
};
