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

  async userInfo(token: string) {
    try {
      if(!token) throw new Error("Token inválido ou expirado");

      const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const user = await AuthRepository.findOne({
        where: { id: payload.id },
        select: ["id", "nome", "email"]
      });

      if (!user) throw new Error("Usuário não encontrado");

      return user;
    } catch {
      throw new Error("Token inválido ou expirado");
    }
  }
}
