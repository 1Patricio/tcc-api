import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../repositories/AuthRepository";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

export const BackofficeAuthService = {
  async login(email: string, password: string) {
    if (!email || !password) throw new Error("Credenciais não informadas");

    const user = await AuthRepository.findOneBy({ email });
    if (!user) throw new Error("Credenciais inválidas");

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) throw new Error("Credenciais inválidas");

    if (!user.super) throw new Error("Usuário não autorizado");

    const token = jwt.sign(
      { id: user.id, email: user.email, super: true },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: { id: user.id, nome: user.nome, email: user.email, super: true },
    };
  },
};
