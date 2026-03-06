import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../users/services/AuthService';
import { JurisprudenciaService } from '../services/JurisprudenciaService';

export const JurisprudenciaController = {

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const processoId = req.params.processoId as string;
      
      if (!processoId) {
        return res.status(400).json({ message: "ID do processo é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      const jurisprudencias = await JurisprudenciaService.list(user.id, processoId);
      res.json(jurisprudencias);
    } catch (err) {
      next(err);
    }
  },

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const jurisprudenciaId = req.params.arquivoId as string;
      if (!jurisprudenciaId) {
        return res.status(400).json({ message: "ID da Jurisprudência é obrigatória" });
      }

      const user = await AuthService.userInfo(token);
      const jurisprudencia = await JurisprudenciaService.get(user.id, jurisprudenciaId);
      res.json(jurisprudencia);
    } catch (err) {
      next(err);
    }
  },


  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const processoId = req.params.processoId as string;
      if (!processoId) {
        return res.status(400).json({ message: "ID do Processo é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      const newJurisprudencia = await JurisprudenciaService.create(user.id, processoId, req.body);
      res.status(201).json(newJurisprudencia);
    } catch (err) {
      next(err);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const jurisprudenciaId = req.params.jurisprudenciaId as string;
      if (!jurisprudenciaId) {
        return res.status(400).json({ message: "ID do Processo é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      await JurisprudenciaService.remove(user.id, jurisprudenciaId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};