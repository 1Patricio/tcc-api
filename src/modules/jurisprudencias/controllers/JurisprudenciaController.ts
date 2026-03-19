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

    const { termo, conteudoBusca } = req.body;

    if (!termo) {
      return res.status(400).json({ message: "Termo de busca é obrigatório" });
    }

    if (!conteudoBusca) {
      return res.status(400).json({ message: "Conteudo de busca é obrigatório" });
    }


    const params = new URLSearchParams();

    params.append("action", "consultas_solr_ajax");
    params.append("metodo", "buscar_resultados");
    params.append(
      "parametros",
      `aba=jurisprudencia&realizando_pesquisa=1&pagina_atual=1&q_palavra_chave=${encodeURIComponent(
        termo
      )}&conteudo_busca=${conteudoBusca}&facet=on&wt=json&ordem=desc&start=0`
    );

    const response = await axios.post(
      "https://www.tjrs.jus.br/buscas/jurisprudencia/ajax.php",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest"
        }
      }
    );

    res.json(response.data);

  } catch (err) {
    next(err);
  }
}
};