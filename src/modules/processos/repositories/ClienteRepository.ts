import { AppDataSource } from "../../../data";
import { Cliente } from "../models/Processo";

export const ClienteRepository = AppDataSource.getRepository(Cliente)