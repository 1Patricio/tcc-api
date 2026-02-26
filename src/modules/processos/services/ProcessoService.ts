import { v4 as uuidv4 } from 'uuid';
import { AuthRepository } from '../../users/repositories/AuthRepository';
import { Processo } from '../models/Processo';
import { ProcessoRepository } from '../repositories/ProcessoRepository';

export const ProcessoService = {
  async list(id: string): Promise<Processo[]> {
    const authUser = await AuthRepository.findOneBy({ id });
    if (!authUser) {
      throw new Error("Usuário não encontrado");
    }

    return ProcessoRepository.findBy({ createdByUser: authUser.id });
  },

  async get(id: string): Promise<Processo> {
    if(id == null) throw { status: 404, message: "Erro ao buscar proceso" };

    const processo = await ProcessoRepository.findOneBy({ id });
    if (!processo) throw { status: 404, message: "Proceso não encontrado" };
    return processo;
  },

  async create(data: Partial<Processo>): Promise<Processo> {
    data.id = uuidv4();
    const newProcesso = ProcessoRepository.create(data);
    return ProcessoRepository.save(newProcesso);
  },

  async update(id: string, data: Partial<Processo>): Promise<Processo> {
    const processo = await ProcessoRepository.findOneBy({ id });
    if (!processo) throw { status: 404, message: "Proceso não encontrado" };

    ProcessoRepository.merge(processo, data);
    return ProcessoRepository.save(processo);
  },

  async remove(id: string): Promise<void> {
    const processo = await ProcessoRepository.findOneBy({ id });
    if (!processo) throw { status: 404, message: "Proceso não encontrado" };

    await ProcessoRepository.remove(processo);
  },
};