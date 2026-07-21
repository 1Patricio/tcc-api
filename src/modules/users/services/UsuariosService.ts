import bcrypt from "bcryptjs";
import { ILike } from "typeorm";
import { AuthRepository } from "../repositories/AuthRepository";
import { AppError, NotFoundException } from "../../../core/exceptions/HttpException";

export const UsuariosService = {
  async list(tenantId: string, page: number = 1, rpp: number = 20, term?: string) {
    const baseWhere = { empresa: { id: tenantId } };

    const where = term
      ? [
          { ...baseWhere, nome: ILike(`%${term}%`) },
          { ...baseWhere, email: ILike(`%${term}%`) },
        ]
      : baseWhere;

    const [list, total] = await AuthRepository.findAndCount({
      where,
      select: { id: true, nome: true, email: true, ativo: true, createdAt: true },
      skip: (page - 1) * rpp,
      take: rpp,
      order: { nome: "ASC" },
    });

    return { list, more: page * rpp < total, page, rpp };
  },

  async getById(id: string, tenantId: string) {
    const user = await AuthRepository.findOne({ where: { id }, relations: ["empresa"] });
    if (!user || user.empresa?.id !== tenantId) throw new NotFoundException("Usuário não encontrado");

    return { id: user.id, nome: user.nome, email: user.email, ativo: user.ativo, createdAt: user.createdAt };
  },

  async create(tenantId: string, data: { nome: string; email: string; password: string }) {
    const { nome, email, password } = data;

    if (!nome) throw new AppError("Nome não informado");
    if (!email) throw new AppError("E-mail não informado");
    if (!password || password.length < 6) throw new AppError("A senha deve ter no mínimo 6 caracteres");

    const existing = await AuthRepository.findOneBy({ email });
    if (existing) throw new AppError("E-mail já cadastrado");

    const hash = await bcrypt.hash(password, 10);
    const user = AuthRepository.create({ nome, email, password: hash, empresa: { id: tenantId } as any });
    await AuthRepository.save(user);

    return { id: user.id, nome: user.nome, email: user.email, createdAt: user.createdAt };
  },

  async update(id: string, tenantId: string, requesterId: string, data: { nome?: string; email?: string; ativo?: boolean }) {
    const user = await AuthRepository.findOne({ where: { id }, relations: ["empresa"] });
    if (!user || user.empresa?.id !== tenantId) throw new NotFoundException("Usuário não encontrado");

    if (data.email && data.email !== user.email) {
      const existing = await AuthRepository.findOneBy({ email: data.email });
      if (existing) throw new AppError("E-mail já está em uso");
    }

    if (data.ativo === false && id === requesterId) {
      throw new AppError("Você não pode inativar seu próprio usuário");
    }

    if (data.nome) user.nome = data.nome;
    if (data.email) user.email = data.email;
    if (data.ativo !== undefined) user.ativo = data.ativo;

    await AuthRepository.save(user);
    return { id: user.id, nome: user.nome, email: user.email, ativo: user.ativo };
  },

  async changeSenha(id: string, tenantId: string, novaSenha: string) {
    if (!novaSenha || novaSenha.length < 6) throw new AppError("A senha deve ter no mínimo 6 caracteres");

    const user = await AuthRepository.findOne({ where: { id }, relations: ["empresa"] });
    if (!user || user.empresa?.id !== tenantId) throw new NotFoundException("Usuário não encontrado");

    user.password = await bcrypt.hash(novaSenha, 10);
    await AuthRepository.save(user);
  },
};
