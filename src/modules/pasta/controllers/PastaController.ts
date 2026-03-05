import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../users/services/AuthService";
import { PastaService } from "../services/PastaService";

export const PastaController = {
  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const user = AuthService.userInfo(req.headers.authorization!.replace("Bearer ",""));
      res.json(await PastaService.list((await user).id))  
    } catch (err) {
      next(err)
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id);
      res.json(await PastaService.get(id));
    } catch (err) { next(err); }
  },
}