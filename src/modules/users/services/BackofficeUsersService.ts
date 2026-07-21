import bcrypt from "bcryptjs";
import { ILike } from "typeorm";
import { AuthRepository } from "../repositories/AuthRepository";
import { Empresa } from "../../empresas/models/Empresa";

function gerarSenha(tamanho = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";
  return Array.from({ length: tamanho }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const BackofficeUsersService = {
  async list(page: number, rpp: number, term?: string, tenantId?: string) {
    const baseWhere: any = tenantId ? { empresa: { id: tenantId } } : {};

    const where = term
      ? [
          { ...baseWhere, nome: ILike(`%${term}%`) },
          { ...baseWhere, email: ILike(`%${term}%`) },
        ]
      : baseWhere;

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

  async create(data: { nome: string; email: string; tenantId: string; super?: boolean }) {
    const { nome, email, tenantId, super: isSuper } = data;

    if (!nome) throw new Error("Nome não informado");
    if (!email) throw new Error("E-mail não informado");
    if (!tenantId) throw new Error("Escritório não informado");

    const existing = await AuthRepository.findOneBy({ email });
    if (existing) throw new Error("E-mail já cadastrado");

    const novaSenha = gerarSenha();
    const hash = await bcrypt.hash(novaSenha, 10);

    const user = AuthRepository.create({
      nome,
      email,
      password: hash,
      super: !!isSuper,
      empresa: { id: tenantId },
    });
    await AuthRepository.save(user);

    return {
      user: { id: user.id, nome: user.nome, email: user.email, super: user.super },
      novaSenha,
    };
  },

  async update(id: string, data: { nome?: string; email?: string; tenantId?: string; super?: boolean }) {
    const user = await AuthRepository.findOneByOrFail({ id });

    if (data.nome) user.nome = data.nome;
    if (data.email) user.email = data.email;
    if (data.tenantId) user.empresa = { id: data.tenantId } as Empresa;
    if (data.super !== undefined) user.super = data.super;

    await AuthRepository.save(user);

    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      super: user.super,
    };
  },

  async resetSenha(id: string) {
    const novaSenha = gerarSenha();
    const hash = await bcrypt.hash(novaSenha, 10);
    await AuthRepository.update(id, { password: hash });
    return { novaSenha };
  },
};
