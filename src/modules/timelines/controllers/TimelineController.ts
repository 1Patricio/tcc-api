import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../users/services/AuthService";
import { TimelineService } from "../services/TimelineService";

export const TimelineController = {
  async resumo(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.userInfo(req.headers.authorization!.replace("Bearer ", ""));
      res.json(await TimelineService.resumo(user.id));
    } catch (err) {
      next(err);
    }
  },

  async listByProcesso(req: Request, res: Response, next: NextFunction) {
    try {
      const processoId = String(req.params["processoId"]);
      res.json(await TimelineService.listByProcesso(processoId));
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const processoId = String(req.params["processoId"]);
      const evento = await TimelineService.create(processoId, req.body);
      res.status(201).json(evento);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params["id"]);
      res.json(await TimelineService.update(id, req.body));
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params["id"]);
      await TimelineService.remove(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async getPublic(req: Request, res: Response, next: NextFunction) {
    try {
      const processoId = String(req.params["processoId"]);
      const pin = req.query["pin"];

      if (!pin || typeof pin !== "string") {
        return res.status(400).json({ message: "PIN obrigatório" });
      }

      res.json(await TimelineService.getPublicTimeline(processoId, pin));
    } catch (err) {
      next(err);
    }
  },
};
