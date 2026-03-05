import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Cliente } from "./modules/clientes/models/Cliente";
import { User } from "./modules/users/models/User";
import { Processo } from "./modules/processos/models/Processo";
import { Pasta } from "./modules/pasta/models/Pasta";
import { Arquivo } from "./modules/arquivos/models/Arquivo";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL!,
  synchronize: true, 
  logging: false,
  entities: [Cliente, User, Processo, Pasta, Arquivo],
});