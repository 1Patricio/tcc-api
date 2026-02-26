import { AppDataSource } from "../../../data";
import { Cliente } from "../models/Cliente";

export const ClienteRepository = AppDataSource.getRepository(Cliente)