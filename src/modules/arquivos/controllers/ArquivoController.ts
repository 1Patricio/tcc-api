import { Request, Response, NextFunction } from 'express';
import { ArquivoService } from '../services/ArquivoService';
import { AuthService } from '../../users/services/AuthService';

export const ArquivoController = {

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const pastaId = req.params.pastaId as string;
      
      if (!pastaId) {
        return res.status(400).json({ message: "ID da pasta é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      const arquivos = await ArquivoService.list(user.id, pastaId);
      res.json(arquivos);
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

      const arquivoId = req.params.arquivoId as string;
      if (!arquivoId) {
        return res.status(400).json({ message: "ID do arquivo é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      const arquivo = await ArquivoService.get(user.id, arquivoId);
      res.json(arquivo);
    } catch (err) {
      next(err);
    }
  },


  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      const arquivoId = String(req.params.arquivoId);
      if (!arquivoId) {
        return res.status(400).json({ message: "ID do arquivo é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      const arquivo = await ArquivoService.get(user.id, arquivoId);
      
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

      const pastaId = req.params.pastaId as string;
      if (!pastaId) {
        return res.status(400).json({ message: "ID da pasta é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      const novoArquivo = await ArquivoService.create(user.id, pastaId, req.body);
      res.status(201).json(novoArquivo);
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

      const arquivoId = req.params.arquivoId as string;
      if (!arquivoId) {
        return res.status(400).json({ message: "ID do arquivo é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      const arquivoAtualizado = await ArquivoService.update(user.id, arquivoId, req.body);
      res.json(arquivoAtualizado);
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

      const arquivoId = req.params.arquivoId as string;
      if (!arquivoId) {
        return res.status(400).json({ message: "ID do arquivo é obrigatório" });
      }

      const user = await AuthService.userInfo(token);
      await ArquivoService.remove(user.id, arquivoId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};