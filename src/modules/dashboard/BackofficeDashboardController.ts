import { Request, Response } from "express";
import { BackofficeDashboardService } from "./BackofficeDashboardService";

export const BackofficeDashboardController = {
  async stats(req: Request, res: Response) {
    try {
      const result = await BackofficeDashboardService.stats();
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ message: err?.message ?? "Erro ao carregar dashboard" });
    }
  },
};
