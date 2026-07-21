import { v4 as uuidv4 } from 'uuid';
import { Peticao } from '../models/Peticao';
import { PeticaoRepository } from '../repositories/PeticaoRepository';

export const PeticaoService = {

  async list(tenantId: string): Promise<Peticao[]> {
    return PeticaoRepository.findBy({ tenantId });
  },

  async get(tenantId: string, peticaoId: string): Promise<Peticao> {
    if(peticaoId == null) {
      throw { status: 400, message: "Petição não informada" };
    }

    const peticao = await PeticaoRepository.findOneBy({ tenantId, id: peticaoId });
    if (!peticao) {
      throw { status: 404, message: "Petição não encontrada" };
    }

    return peticao;
  },

  async create(userId: string, tenantId: string, data: Partial<Peticao>): Promise<Peticao> {
    if (!data) {
      throw { status: 400, message: "Petição não informada" };
    }

    data.id = uuidv4();
    data.createdByUser = userId;
    data.tenantId = tenantId;

    const newJurisprudencia = PeticaoRepository.create(data);
    return PeticaoRepository.save(newJurisprudencia);
  },

  async remove(tenantId: string, peticaoId: string): Promise<void> {
    const peticao = await PeticaoRepository.findOneBy({ id: peticaoId, tenantId });
    if (!peticao) {
      throw { status: 404, message: "Petição não encontrada" };
    }

    await PeticaoRepository.remove(peticao);
  },

  async update(tenantId: string, peticaoId: string, data: Partial<Peticao>): Promise<Peticao> {
    const peticao = await PeticaoRepository.findOneBy({ id: peticaoId, tenantId });
    if (!peticao) {
      throw { status: 404, message: "Petição não encontrada" };
    }

    PeticaoRepository.merge(peticao, data);
    return PeticaoRepository.save(peticao);
  },
};