import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../users/services/AuthService';
import { JurisprudenciaService } from '../services/JurisprudenciaService';
import axios from "axios";

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
      const jurisprudencias = await JurisprudenciaService.list(user.id);
      res.json(jurisprudencias);
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

      const processoId = req.body.processoId as string;
      if (!processoId) {
        return res.status(400).json({ message: "Processo não informado" });
      }

      const user = await AuthService.userInfo(token);
      const newJurisprudencia = await JurisprudenciaService.create(user.id, req.body);
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

  async buscaRs(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return res.status(401).json({ message: "Token não fornecido" });
      }

      await AuthService.userInfo(token);

      const { termo, tipoConsulta = "Inteiro Teor", pagina = 1 } = req.body;

      if (!termo) {
        return res.status(400).json({ message: "Termo de busca é obrigatório" });
      }

      const response = await axios.get(
        "https://www.tjrs.jus.br/novo/wp-admin/admin-ajax.php",
        {
          params: {
            action: "busca_jurisprudencia",
            palavra_chave: termo,
            tipo_consulta: tipoConsulta,
            num_page: pagina,
          }
        }
      );

      const data = response.data;
      if (data?.data?.html) {
        data.data.html = data.data.html
          .replace(/www\.dev\.tjrs\.jus\.br/g, 'www.tjrs.jus.br')
          .replace(/<a /g, '<a target="_blank" rel="noopener noreferrer" ')
          .replace(/<p><span class="title-results">Inteiro teor:<\/span>.*?<\/p>/gs, '')
          .replace(/<span id="span-ver-integra-[^"]*">.*?<\/span>/gs, '<span class="ver-integra-placeholder"></span>');
      }

      res.json(data);

    } catch (err) {
      next(err);
    }
  }
};