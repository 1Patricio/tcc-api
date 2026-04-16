import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../users/services/AuthService";
import { ProcessoService } from "../services/ProcessoService";

export const ProcessoController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.userInfo(req.headers.authorization!.replace("Bearer ", ""));
      const page = parseInt(req.query.page as string) || 1;
      const rpp = parseInt(req.query.rpp as string) || 10;
      res.json(await ProcessoService.list(user.id, page, rpp));
    } catch (err) {
      next(err)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      res.json(await ProcessoService.get(id));
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.userInfo(
        req.headers.authorization!.replace("Bearer ","")
      );

      const { clienteId, ...rest } = req.body;

      const processo = await ProcessoService.create({
        ...rest,
        createdByUser: user.id,
        cliente: { id: clienteId }
      });

      res.status(201).json(processo);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      res.json(await ProcessoService.update(id, req.body));
    } catch (err) { next(err); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await ProcessoService.remove(id);
      res.status(204).send();
    } catch (err) { next(err); }
  },
}