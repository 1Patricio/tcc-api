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

      const { termo, tipoConsulta = "ementa", pagina = 1 } = req.body;

      if (!termo) {
        return res.status(400).json({ message: "Termo de busca é obrigatório" });
      }

      const conteudoBusca = tipoConsulta === "Inteiro Teor" ? "documento_text" : "ementa_completa";
      const start = (Number(pagina) - 1) * 10;

      const parametros = new URLSearchParams({
        aba: "jurisprudencia",
        realizando_pesquisa: "1",
        pagina_atual: String(pagina),
        q_palavra_chave: termo,
        conteudo_busca: conteudoBusca,
        wt: "json",
        ordem: "desc",
        start: String(start),
      }).toString();

      const body = new URLSearchParams({
        action: "consultas_solr_ajax",
        metodo: "buscar_resultados",
        parametros,
      }).toString();

      const response = await axios.post(
        "https://tjrs-proxy.andersongpatricio.workers.dev",
        body,
        { headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" } }
      );

      const solr = response.data;
      const docs = solr.response?.docs ?? [];

      const resultados = docs.map((doc: any) => ({
        codEmenta: doc.cod_ementa,
        numeroProcesso: doc.numero_processo,
        tipoProcesso: doc.tipo_processo || doc.nome_classe_cnj,
        ementa: (Array.isArray(doc.ementa_completa) ? doc.ementa_completa[0] : doc.ementa_completa)?.trim(),
        relator: Array.isArray(doc.relator_redator) ? doc.relator_redator[0] : doc.nome_relator,
        orgaoJulgador: doc.orgao_julgador,
        dataJulgamento: doc.data_julgamento ? doc.data_julgamento.split('T')[0] : null,
      }));

      res.json({ total: solr.response?.numFound ?? 0, resultados });

    } catch (err) {
      next(err);
    }
  }
};