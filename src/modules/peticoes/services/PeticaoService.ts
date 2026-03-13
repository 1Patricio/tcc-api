import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from '../../users/repositories/AuthRepository';
import { Peticao } from '../models/Peticao';
import { PeticaoRepository } from '../repositories/PeticaoRepository';

export const PeticaoService = {
  
  async list(userId: string): Promise<Peticao[]> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    return PeticaoRepository.findBy({ createdByUser: userId });
  },

  async get(userId: string, peticaoId: string): Promise<Peticao> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    if (userId == null) {
      throw { status: 400, message: "Usuário não informado" };
    }

    if(peticaoId == null) {
      throw { status: 400, message: "Petição não informada" };
    }

    const peticao = await PeticaoRepository.findOneBy({ createdByUser: userId, id: peticaoId });
    if (!peticao) {
      throw { status: 404, message: "Petição não encontrada" };
    }

    return peticao;
  },

  async create(userId: string, data: Partial<Peticao>): Promise<Peticao> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    if (!data) {
      throw { status: 400, message: "Petição não informada" };
    }

    const peticaoExistente = await PeticaoRepository.findOneBy({ id: data.id! });
    if (peticaoExistente) {
      throw { status: 404, message: "Petição já existente" };
    }

    data.id = uuidv4();
    data.createdByUser = authUser.id;

    const newJurisprudencia = PeticaoRepository.create(data);
    return PeticaoRepository.save(newJurisprudencia);
  },

  async remove(userId: string, peticaoId: string): Promise<void> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const peticao = await PeticaoRepository.findOneBy({ id: peticaoId, createdByUser: userId });
    if (!peticao) {
      throw { status: 404, message: "Petição não encontrada" };
    }
  
    await PeticaoRepository.remove(peticao);
  },

  async update(userId: string, peticaoId: string, data: Partial<Peticao>): Promise<Peticao> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const peticao = await PeticaoRepository.findOneBy({ id: peticaoId, createdByUser: userId });
    if (!peticao) {
      throw { status: 404, message: "Petição não encontrada" };
    }
  
    PeticaoRepository.merge(peticao, data);
    return PeticaoRepository.save(peticao);
  },
};