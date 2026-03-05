import { v4 as uuidv4 } from 'uuid';
import { Cliente } from '../models/Cliente';
import { AuthRepository } from '../../users/repositories/AuthRepository';
import { ClienteRepository } from '../repositories/ClienteRepository';
import { PastaRepository } from '../../pasta/repositories/PastaRepository';

export const ClienteService = {
  async list(id: string): Promise<Cliente[]> {
    const authUser = await AuthRepository.findOneBy({ id });
    if (!authUser) {
      throw new Error("Usuário não encontrado");
    }

    return ClienteRepository.findBy({ createdByUser: authUser.id });
  },

  async get(id: string): Promise<Cliente> {
    if(id == null) throw { status: 404, message: "Erro ao buscar cliente" };

    const cliente = await ClienteRepository.findOneBy({ id });
    if (!cliente) throw { status: 404, message: "Cliente não encontrado" };
    return cliente;
  },

  async create(data: Partial<Cliente>): Promise<Cliente> {
    data.id = uuidv4();
    const newCliente = ClienteRepository.create(data);
    const newPasta = PastaRepository.create({
      id: data.id,
      nome: newCliente.nome,
      dataUltimaModificacao: new Date()
    })

    PastaRepository.save(newPasta);
    return ClienteRepository.save(newCliente);
  },

  async update(id: string, data: Partial<Cliente>): Promise<Cliente> {
    const cliente = await ClienteRepository.findOneBy({ id });
    if (!cliente) throw { status: 404, message: "Cliente não encontrado" };

    ClienteRepository.merge(cliente, data);
    await PastaRepository.update(id, {dataUltimaModificacao: new Date(), nome: data.nome!})

    return ClienteRepository.save(cliente);
  },

  async remove(id: string): Promise<void> {
    const cliente = await ClienteRepository.findOneBy({ id });
    if (!cliente) throw { status: 404, message: "Cliente não encontrado" };

    await ClienteRepository.remove(cliente);
  },
};