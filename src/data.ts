import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { Cliente } from "./modules/clientes/models/Cliente";
import { User } from "./modules/users/models/User";
import { Processo } from "./modules/processos/models/Processo";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL!,
  synchronize: true, 
  logging: false,
  entities: [Cliente, User, Processo],
});