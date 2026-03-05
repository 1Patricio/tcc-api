import { AuthRepository } from '../../users/repositories/AuthRepository';
import { Pasta } from '../models/Pasta';
import { PastaRepository } from '../repositories/PastaRepository';
import { ClienteRepository } from '../../clientes/repositories/ClienteRepository';
import { In } from "typeorm";

export const PastaService = {

  async list(userId: string): Promise<Pasta[]> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) {
      throw { status: 404, message: "Usuário não encontrado" };
    }

    const clientes = await ClienteRepository.findBy({
      createdByUser: authUser.id
    });

    const clienteIds = clientes.map(cliente => cliente.id);

    return PastaRepository.findBy({id: In(clienteIds)});
  },

  async get(id: string): Promise<Pasta> {
    if(id == null) throw { status: 404, message: "Erro ao buscar pasta" };

    const pasta = await ClienteRepository.findOneBy({ id });
    if (!pasta) throw { status: 404, message: "Pasta não encontrado" };

    return pasta;
  },
};