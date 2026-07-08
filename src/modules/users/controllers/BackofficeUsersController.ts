import { Request, Response } from "express";
import { BackofficeUsersService } from "../services/BackofficeUsersService";

export const BackofficeUsersController = {
  async list(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const rpp = parseInt(req.query.rpp as string) || 15;
      const term = (req.query.term as string) || undefined;
      const empresaId = (req.query.empresaId as string) || undefined;
      const result = await BackofficeUsersService.list(page, rpp, term, empresaId);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message ?? "Erro ao listar usuários" });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const { nome, email, super: isSuper } = req.body;
      const result = await BackofficeUsersService.update(id, { nome, email, super: isSuper });
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message ?? "Erro ao atualizar usuário" });
    }
  },

  async resetSenha(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const result = await BackofficeUsersService.resetSenha(id);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message ?? "Erro ao resetar senha" });
    }
  },
};
