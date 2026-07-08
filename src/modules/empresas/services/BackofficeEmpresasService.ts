import bcrypt from "bcryptjs";
import { ILike } from "typeorm";
import { EmpresasRepository } from "../repositories/EmpresasRepository";
import { AuthRepository } from "../../users/repositories/AuthRepository";

function gerarSenha(tamanho = 10): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";
  return Array.from({ length: tamanho }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export const BackofficeEmpresasService = {
  async list(page: number, rpp: number, term?: string) {
    const where = term
      ? [{ fantasia: ILike(`%${term}%`) }, { cnpj: ILike(`%${term}%`) }]
      : undefined;

    const [list, total] = await EmpresasRepository.findAndCount({
      where,
      order: { createdAt: "DESC" },
      skip: (page - 1) * rpp,
      take: rpp,
    });

    return { list, total, page, rpp, more: page * rpp < total };
  },

  async create(data: {
    fantasia: string;
    razaoSocial: string;
    cnpj: string;
    usuarioAdmin: { nome: string; email: string };
  }) {
    const existing = await EmpresasRepository.findOneBy({ cnpj: data.cnpj });
    if (existing) throw new Error("CNPJ já cadastrado");

    const emailExistente = await AuthRepository.findOneBy({ email: data.usuarioAdmin.email });
    if (emailExistente) throw new Error("E-mail do usuário administrador já cadastrado");

    const empresa = await EmpresasRepository.save(EmpresasRepository.create({
      fantasia: data.fantasia,
      razaoSocial: data.razaoSocial,
      cnpj: data.cnpj,
    }));

    const senhaAdmin = gerarSenha();
    const hash = await bcrypt.hash(senhaAdmin, 10);

    await AuthRepository.save(AuthRepository.create({
      nome: data.usuarioAdmin.nome,
      email: data.usuarioAdmin.email,
      password: hash,
      super: false,
      empresa,
    }));

    return { empresa, senhaAdmin };
  },

  async update(id: string, data: { fantasia?: string; razaoSocial?: string; cnpj?: string; logo?: string }) {
    await EmpresasRepository.update(id, data);
    return EmpresasRepository.findOneByOrFail({ id });
  },

  async updateLogo(id: string, logoKey: string | null) {
    await EmpresasRepository.update(id, { logo: logoKey });
    return EmpresasRepository.findOneByOrFail({ id });
  },
};
