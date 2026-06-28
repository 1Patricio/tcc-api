import { ILike } from "typeorm";
import { AuthRepository } from "../repositories/AuthRepository";

export const BackofficeUsersService = {
  async list(page: number, rpp: number, term?: string, empresaId?: string) {
    const baseWhere: any = empresaId ? { empresa: { id: empresaId } } : {};

    const where = term
      ? [
          { ...baseWhere, nome: ILike(`%${term}%`) },
          { ...baseWhere, email: ILike(`%${term}%`) },
        ]
      : Object.keys(baseWhere).length ? [baseWhere] : undefined;

    const [list, total] = await AuthRepository.findAndCount({
      where,
      relations: ["empresa"],
      select: {
        id: true,
        nome: true,
        email: true,
        super: true,
        createdAt: true,
        empresa: { id: true, fantasia: true },
      },
      skip: (page - 1) * rpp,
      take: rpp,
      order: { createdAt: "DESC" },
    });

    return { list, total, page, rpp, more: page * rpp < total };
  },

  async update(id: string, data: { nome?: string; email?: string; super?: boolean }) {
    await AuthRepository.update(id, data);
    const updated = await AuthRepository.findOneByOrFail({ id });
    return {
      id: updated.id,
      nome: updated.nome,
      email: updated.email,
      super: updated.super,
    };
  },
};
