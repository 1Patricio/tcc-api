import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const { nome, email, password } = req.body;
      const user = await AuthService.register(nome, email, password);
      return res.status(201).json(user);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  },

  async me(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ message: "Token não informado" });
      }

      const user = await AuthService.userInfo(token);

      return res.json({ user });
    } catch (err) {
      return res.status(401).json({ message: "Não autorizado" });
    }
  }
};
