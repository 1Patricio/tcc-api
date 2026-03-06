import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from '../../users/repositories/AuthRepository';
import { PastaRepository } from '../../pasta/repositories/PastaRepository';
import { Arquivo } from '../models/Arquivo';
import { ArquivoRepository } from '../repositories/ArquivoRepository';

export const ArquivoService = {

  async list(userId: string, pastaId: string): Promise<Arquivo[]> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const pasta = await PastaRepository.findOneBy({ id: pastaId });
    if (!pasta) {
      throw { status: 404, message: "Pasta não encontrada" };
    }

    return ArquivoRepository.findBy({ pastaId: pastaId });
  },

  async get(userId: string, arquivoId: string): Promise<Arquivo> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    if (arquivoId == null) {
      throw { status: 400, message: "ID do arquivo é obrigatório" };
    }

    const arquivo = await ArquivoRepository.findOneBy({ id: arquivoId });
    if (!arquivo) {
      throw { status: 404, message: "Arquivo não encontrado" };
    }

    return arquivo;
  },

  async create(userId: string, pastaId: string, data: Partial<Arquivo>): Promise<Arquivo> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const pasta = await PastaRepository.findOneBy({ id: pastaId });
    if (!pasta) {
      throw { status: 404, message: "Pasta não encontrada" };
    }

    data.id = uuidv4();
    data.pastaId = pastaId;

    const newArquivo = ArquivoRepository.create(data);
    
    await PastaRepository.update(pastaId, { 
      dataUltimaModificacao: new Date() 
    });

    return ArquivoRepository.save(newArquivo);
  },

  async update(userId: string, arquivoId: string, data: Partial<Arquivo>): Promise<Arquivo> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const arquivo = await ArquivoRepository.findOneBy({ id: arquivoId });
    if (!arquivo) {
      throw { status: 404, message: "Arquivo não encontrado" };
    }

    ArquivoRepository.merge(arquivo, data);

    if (arquivo.pastaId) {
      await PastaRepository.update(arquivo.pastaId, { 
        dataUltimaModificacao: new Date() 
      });
    }

    return ArquivoRepository.save(arquivo);
  },

  async remove(userId: string, arquivoId: string): Promise<void> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const arquivo = await ArquivoRepository.findOneBy({ id: arquivoId });
    if (!arquivo) {
      throw { status: 404, message: "Arquivo não encontrado" };
    }

    const pastaId = arquivo.pastaId;

    await ArquivoRepository.remove(arquivo);

    if (pastaId) {
      await PastaRepository.update(pastaId, { 
        dataUltimaModificacao: new Date() 
      });
    }
  },
};