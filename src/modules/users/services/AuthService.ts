import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/AuthRepository";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const AuthService = {
  async register(nome: string, email: string, password: string) {
    if (!nome || !email || !password) throw new Error("Credenciais não informadas");

    const existingUser =  await AuthRepository.findOneBy({ email });
    if (existingUser) {
      throw new Error("Usuário já existente");
    }

    const hashed = await bcrypt.hash(password, 10);
    const diaAtual = new Date();

    try {
      const user = AuthRepository.create({ nome, email, password: hashed, createdAt: diaAtual });
      await AuthRepository.save(user);
      return { id: user.id, nome: user.nome ,email: user.email, createdAt: user.createdAt };
    } catch (error) {
      throw new Error("Erro ao cadastrar usuário");
    }
  },

  async login(email: string, password: string) {
    if (!email || !password) throw new Error("Credenciais não informadas");

    const user = await AuthRepository.findOneBy({ email });
    if (!user) throw new Error("Credenciais Inválidas");

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) throw new Error("Credenciais Inválidas");

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    return { token, user: { id: user.id, nome: user.nome, email: user.email } };
  },

  async updatePerfil(userId: string, nome: string, email: string, novaSenha?: string, fotoUrl?: string) {
    if (!nome) throw new Error("Nome não informado");
    if (!email) throw new Error("E-mail não informado");
    if (novaSenha !== undefined && novaSenha.length < 6) throw new Error("A nova senha deve ter no mínimo 6 caracteres");

    const user = await AuthRepository.findOne({ where: { id: userId } });
    if (!user) throw new Error("Usuário não encontrado");

    if (email !== user.email) {
      const existing = await AuthRepository.findOneBy({ email });
      if (existing) throw new Error("E-mail já está em uso");
    }

    user.nome = nome;
    user.email = email;
    if (novaSenha) user.password = await bcrypt.hash(novaSenha, 10);
    if (fotoUrl) user.fotoPerfil = fotoUrl;

    await AuthRepository.save(user);
    return { id: user.id, nome: user.nome, email: user.email, fotoPerfil: user.fotoPerfil };
  },

  async userInfo(token: string) {
    try {
      if(!token) throw new Error("Token inválido ou expirado");

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const user = await AuthRepository.findOne({
        where: { id: payload.id },
        select: ["id", "nome", "email", "fotoPerfil"]
      });

      if (!user) throw new Error("Usuário não encontrado");

      return user;
    } catch {
      throw new Error("Token inválido ou expirado");
    }
  }
}
