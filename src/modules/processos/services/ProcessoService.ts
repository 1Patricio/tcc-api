import { v4 as uuidv4 } from 'uuid';
import { ILike } from 'typeorm';
import { AuthRepository } from '../../users/repositories/AuthRepository';
import { Processo } from '../models/Processo';
import { ProcessoRepository } from '../repositories/ProcessoRepository';
import { PastaRepository } from '../../pasta/repositories/PastaRepository';

type ListFilters = {
  term?: string;
  status?: string;
  tipoAcaoProcesso?: string;
}

export const ProcessoService = {
  async list(
    id: string,
    page: number = 1,
    rpp: number = 20,
    filters: ListFilters = {}
  ): Promise<{ list: Processo[], more: boolean, page: number, rpp: number }> {
    const authUser = await AuthRepository.findOneBy({ id });
    if (!authUser) throw new Error("Usuário não encontrado");

    const { term, status, tipoAcaoProcesso } = filters;

    const baseWhere: any = {
      createdByUser: authUser.id,
      ...(status && { status }),
      ...(tipoAcaoProcesso && { tipoAcaoProcesso }),
    };

    const where = term
      ? [
          { ...baseWhere, numeroProcesso: ILike(`%${term}%`) },
          { ...baseWhere, parteContraria: ILike(`%${term}%`) },
        ]
      : [baseWhere];

    const [list, total] = await ProcessoRepository.findAndCount({
      where,
      skip: (page - 1) * rpp,
      take: rpp,
      order: { createdAt: 'DESC' },
    });

    return { list, more: page * rpp < total, page, rpp };
  },

  async get(id: string): Promise<Processo> {
    if(id == null) throw { status: 404, message: "Erro ao buscar proceso" };

    const processo = await ProcessoRepository.findOneBy({ id });
    if (!processo) throw { status: 404, message: "Proceso não encontrado" };
    return processo;
  },

  async create(data: Partial<Processo>): Promise<Processo> {
    if(!data) throw { status: 404, message: "Processo não informado" };
    if (!data.cliente) throw { status: 404, message: "Cliente não informado" };
    if (!data.numeroProcesso) throw { status: 404, message: "Número processo não informado" };

    const processoId = uuidv4();
    data.id = processoId

    const novaSubpasta = PastaRepository.create({
      id: processoId,
      nome: `Processo: ${data.numeroProcesso}`,
      parentId: data.cliente.id,
      dataUltimaModificacao: new Date()
    })

    await PastaRepository.save(novaSubpasta);

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

  async dashboard(userId: string): Promise<{
    stats: { status: string; total: number }[];
    proximosPrazos: Processo[];
  }> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) throw new Error("Usuário não encontrado");

    const statuses = ['ANDAMENTO', 'JULGAMENTO', 'SENTENCA', 'RECURSO', 'ARQUIVADO'];

    const stats = await Promise.all(
      statuses.map(async (status) => {
        const total = await ProcessoRepository.count({
          where: { createdByUser: authUser.id, status: status as any },
        });
        return { status, total };
      })
    );

    const proximosPrazos = await ProcessoRepository.createQueryBuilder('p')
      .where('p.createdByUser = :userId', { userId: authUser.id })
      .andWhere("p.status != 'ARQUIVADO'")
      .andWhere('p.dataPrazo IS NOT NULL')
      .orderBy('p.dataPrazo', 'ASC')
      .take(10)
      .getMany();

    return { stats, proximosPrazos };
  },
};