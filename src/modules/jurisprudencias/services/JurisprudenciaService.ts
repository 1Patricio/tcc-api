import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from '../../users/repositories/AuthRepository';
import { Jurisprudencia } from '../models/Jurisprudencia';
import { JurisprudenciaRepository } from '../repositories/JurisprudenciaRepository';
import { ProcessoRepository } from '../../processos/repositories/ProcessoRepository';

export const JurisprudenciaService = {
  
  async list(userId: string, processoId: string): Promise<Jurisprudencia[]> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const processo = await ProcessoRepository.findOneBy({ id: processoId });
    if (!processo) {
      throw { status: 404, message: "Processo não encontrada" };
    }

    return JurisprudenciaRepository.findBy({ processoId: processoId });
  },

  async get(userId: string, jurisprudenciaId: string): Promise<Jurisprudencia> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    if (jurisprudenciaId == null) {
      throw { status: 400, message: "ID da Jurisprudência é obrigatório" };
    }

    const jurisprudencia = await JurisprudenciaRepository.findOneBy({ id: jurisprudenciaId });
    if (!jurisprudencia) {
      throw { status: 404, message: "Jurisprudência não encontrada" };
    }

    return jurisprudencia;
  },

  async create(userId: string, data: Partial<Jurisprudencia>): Promise<Jurisprudencia> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    if (!data.processoId) {
      throw { status: 400, message: "Processo não informado" };
    }

    const processo = await ProcessoRepository.findOneBy({ id: data.processoId });
    if (!processo) {
      throw { status: 404, message: "Processo não encontrado" };
    }

    const jurisprudenciaExistente = await JurisprudenciaRepository.findOneBy({ processo: data.processo! });
    if (jurisprudenciaExistente) {
      throw { status: 404, message: "Jurisprudência já existente" };
    }

    data.id = uuidv4();

    const newJurisprudencia = JurisprudenciaRepository.create(data);
    return JurisprudenciaRepository.save(newJurisprudencia);
  },

  async remove(userId: string, jurisprudenciaId: string): Promise<void> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const jurisprudencia = await JurisprudenciaRepository.findOneBy({ id: jurisprudenciaId });
    if (!jurisprudencia) {
      throw { status: 404, message: "Jurisprudência não encontrada" };
    }
  
    await JurisprudenciaRepository.remove(jurisprudencia);
  },
};