import { Request, Response, NextFunction } from 'express';
import { Readable } from 'stream';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '../../../config/awsConfig';
import { ArquivoService } from '../services/ArquivoService';
import { ArquivoRepository } from '../repositories/ArquivoRepository';
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
      if (!token) return res.status(401).json({ message: "Token não fornecido" });

      const { pastaId } = req.body; 
      if (!pastaId) return res.status(400).json({ message: "ID da pasta é obrigatório" });

      if (!req.file) return res.status(400).json({ message: "Nenhum arquivo enviado" });

      const user = await AuthService.userInfo(token);
      
      const novoArquivo = await ArquivoService.create(user.id, pastaId, req.file);
      
      return res.status(201).json(novoArquivo);
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

  async download(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) return res.status(401).json({ message: 'Token não fornecido' });

      const arquivoId = req.params.arquivoId as string;
      if (!arquivoId) return res.status(400).json({ message: 'ID do arquivo é obrigatório' });

      const arquivo = await ArquivoRepository.findOneBy({ id: arquivoId });
      if (!arquivo) return res.status(404).json({ message: 'Arquivo não encontrado' });

      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: arquivo.nomeFisico,
      });

      const s3Response = await s3Client.send(command);

      res.setHeader('Content-Type', s3Response.ContentType || 'application/octet-stream');
      res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(arquivo.nome)}"`);

      (s3Response.Body as Readable).pipe(res);
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