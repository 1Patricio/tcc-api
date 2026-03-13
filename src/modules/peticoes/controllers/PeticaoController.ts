import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../users/services/AuthService';
import { PeticaoService } from '../services/PeticaoService';

export const PeticaoController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const user = await AuthService.userInfo(token);
      const peticoes = await PeticaoService.list(user.id);
      res.json(peticoes);
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

      const peticaoId = req.params.id as string;
      if (!peticaoId) {
        return res.status(400).json({ message: "ID do arquivo é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      const arquivo = await PeticaoService.get(user.id, peticaoId);
      
      res.json(arquivo);
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

      const user = await AuthService.userInfo(token);
      const newPeticao = await PeticaoService.create(user.id, req.body);
      res.status(201).json(newPeticao);
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

      const peticaoId = req.params.id as string;
      if (!peticaoId) {
        return res.status(400).json({ message: "Petição não informada" });
      }

      const user = await AuthService.userInfo(token);
      await PeticaoService.remove(user.id, peticaoId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const peticaoId = req.params.id as string;
      if (!peticaoId) {
        return res.status(400).json({ message: "Petição não informada" });
      }

      const user = await AuthService.userInfo(token);
      const editPedicao = await PeticaoService.update(user.id, peticaoId, req.body);
      res.status(200).send(editPedicao);
    } catch (err) {
      next(err);
    }
  },
};