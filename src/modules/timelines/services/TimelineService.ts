import { AuthRepository } from "../../users/repositories/AuthRepository";
import { ProcessoRepository } from "../../processos/repositories/ProcessoRepository";
import { TimelineEventoRepository } from "../repositories/TimelineEventoRepository";
import { TimelineEvento } from "../models/TimelineEvento";

export const TimelineService = {
  async resumo(userId: string): Promise<object[]> {
    const authUser = await AuthRepository.findOneBy({ id: userId });
    if (!authUser) throw { status: 401, message: "Usuário não encontrado" };

    const processos = await ProcessoRepository.find({
      where: { createdByUser: authUser.id },
      order: { createdAt: "DESC" },
    });

    return Promise.all(
      processos.map(async (p) => {
        const totalEventos = await TimelineEventoRepository.count({ where: { processoId: p.id } });
        const ultimo = await TimelineEventoRepository.findOne({
          where: { processoId: p.id },
          order: { data: "DESC", createdAt: "DESC" },
        });
        return {
          id: p.id,
          numeroProcesso: p.numeroProcesso,
          status: p.status,
          tipoAcaoProcesso: p.tipoAcaoProcesso,
          parteContraria: p.parteContraria,
          totalEventos,
          ultimoEvento: ultimo
            ? { titulo: ultimo.titulo, tipo: ultimo.tipo, data: String(ultimo.data) }
            : null,
        };
      })
    );
  },

  async listByProcesso(processoId: string): Promise<TimelineEvento[]> {
    return TimelineEventoRepository.find({
      where: { processoId },
      order: { data: "DESC", createdAt: "DESC" },
    });
  },

  async create(processoId: string, data: Partial<TimelineEvento>): Promise<TimelineEvento> {
    const processo = await ProcessoRepository.findOneBy({ id: processoId });
    if (!processo) throw { status: 404, message: "Processo não encontrado" };

    const evento = TimelineEventoRepository.create({
      ...data,
      processoId,
    });
    return TimelineEventoRepository.save(evento);
  },

  async update(id: string, data: Partial<TimelineEvento>): Promise<TimelineEvento> {
    const evento = await TimelineEventoRepository.findOneBy({ id });
    if (!evento) throw { status: 404, message: "Evento não encontrado" };

    TimelineEventoRepository.merge(evento, data);
    return TimelineEventoRepository.save(evento);
  },

  async remove(id: string): Promise<void> {
    const evento = await TimelineEventoRepository.findOneBy({ id });
    if (!evento) throw { status: 404, message: "Evento não encontrado" };

    await TimelineEventoRepository.remove(evento);
  },

  /**
   * Rota pública: verifica se os 4 últimos chars do numeroProcesso batem com o pin
   * e retorna os eventos + dados básicos do processo.
   */
  async getPublicTimeline(processoId: string, pin: string): Promise<{
    processo: { numeroProcesso: string; status: string; tipoAcaoProcesso: string; cliente?: string };
    eventos: TimelineEvento[];
  }> {
    const processo = await ProcessoRepository.findOne({
      where: { id: processoId },
      relations: ["cliente"],
    });

    if (!processo) throw { status: 404, message: "Processo não encontrado" };

    const ultimosQuatro = processo.numeroProcesso.replace(/\D/g, "").slice(-4);
    if (ultimosQuatro !== pin.trim()) {
      throw { status: 401, message: "PIN inválido" };
    }

    const eventos = await TimelineEventoRepository.find({
      where: { processoId },
      order: { data: "ASC", createdAt: "ASC" },
    });

    return {
      processo: {
        numeroProcesso: processo.numeroProcesso,
        status: processo.status,
        tipoAcaoProcesso: processo.tipoAcaoProcesso,
        cliente: (processo as any).cliente?.nome,
      },
      eventos,
    };
  },
};
