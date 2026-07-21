import { NextFunction, Request, Response } from "express";
import { PastaService } from "../services/PastaService";

export const PastaController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const rpp = parseInt(req.query.rpp as string) || 20;
      const term = req.query.term as string | undefined;
      res.json(await PastaService.list(req.user!.tenantId!, page, rpp, term));
    } catch (err) {
      next(err)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      res.json(await PastaService.get(id, req.user!.tenantId!));
    } catch (err) { next(err); }
  },
}