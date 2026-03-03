import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../users/services/AuthService";
import { ClienteService } from "../services/ClienteService";

export const ClienteController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = AuthService.userInfo(req.headers.authorization!.replace("Bearer ",""));
      res.json(await ClienteService.list((await user).id))  
    } catch (err) {
      next(err)
    }
  },

    async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      res.json(await ClienteService.get(id));
    } catch (err) { next(err); }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const user = AuthService.userInfo(req.headers.authorization!.replace("Bearer ",""));
      res.status(201).json(await ClienteService.create({
        ...req.body,
        createdByUser: (await user).id
      }));
    } catch (err) { next(err); }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      res.json(await ClienteService.update(id, req.body));
    } catch (err) { next(err); }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      await ClienteService.remove(id);
      res.status(204).send();
    } catch (err) { next(err); }
  },
}