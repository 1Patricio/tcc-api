import { AuthRepository } from '../../users/repositories/AuthRepository';
import { Pasta } from '../models/Pasta';
import { PastaRepository } from '../repositories/PastaRepository';
import { ClienteRepository } from '../../clientes/repositories/ClienteRepository';
import { In, ILike } from "typeorm";

export const PastaService = {

  async list(
    userId: string,
    page: number = 1,
    rpp: number = 20,
    term?: string
  ): Promise<{ list: Pasta[], more: boolean, page: number, rpp: number }> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) throw { status: 404, message: "Usuário não encontrado" };

    const clientes = await ClienteRepository.findBy({ createdByUser: authUser.id });
    const clienteIds = clientes.map(c => c.id);

    if (clienteIds.length === 0) return { list: [], more: false, page, rpp };

    const where: any = term
      ? { id: In(clienteIds), nome: ILike(`%${term}%`) }
      : { id: In(clienteIds) };

    const [list, total] = await PastaRepository.findAndCount({
      where,
      skip: (page - 1) * rpp,
      take: rpp,
      order: { nome: 'ASC' },
    });

    return { list, more: page * rpp < total, page, rpp };
  },

  async get(id: string): Promise<Pasta> {
    if(id == null) throw { status: 404, message: "Erro ao buscar pasta" };

    const pasta = await PastaRepository.findOne({
      where: { id },
      relations: ['subpastas', 'arquivos', 'parent']
     });
     
    if (!pasta) throw { status: 404, message: "Pasta não encontrado" };

    return pasta;
  },
};